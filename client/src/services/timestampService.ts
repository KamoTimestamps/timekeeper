/**
 * Timestamp Service
 * Business logic layer for timestamp operations.
 * Uses the Repository pattern for data access.
 */

import {
  TimestampRecord,
  TimestampRow,
  TimestampRowSchema,
  ExportDataSchema,
} from '../schema';
import { log, formatTimeString, getTimestampSuffix, buildYouTubeUrlWithTimestamp } from '../util';
import * as TimestampRepository from './timestampRepository';

// === Export/Import Business Logic ===

/**
 * Build a complete export payload with all timestamps
 */
export async function buildExportPayload({ includeDeleted = false }: { includeDeleted?: boolean } = {}): Promise<{
  json: string;
  filename: string;
  totalVideos: number;
  totalTimestamps: number;
  invalidRows: number;
}> {
  const exportData = {} as Record<string, unknown>;

  const allTimestamps = await TimestampRepository.getAllTimestamps();

  // Validate row by row: one corrupt row must not silently empty the whole export.
  const validRows: TimestampRow[] = [];
  let invalidRows = 0;
  for (const row of allTimestamps) {
    const parsedRow = TimestampRowSchema.safeParse(row);
    if (parsedRow.success) {
      validRows.push(parsedRow.data);
    } else {
      invalidRows++;
    }
  }
  if (invalidRows > 0) {
    log(`Skipped ${invalidRows} timestamp rows that failed validation during export`, null, 'warn');
  }

  const rows = includeDeleted ? validRows : validRows.filter(r => !r.deleted_at);
  const sortedRows = [...rows].sort((a, b) => {
    const videoCompare = a.video_id.localeCompare(b.video_id);
    if (videoCompare !== 0) return videoCompare;
    const startCompare = a.start - b.start;
    if (startCompare !== 0) return startCompare;
    return a.guid.localeCompare(b.guid);
  });

  // Group timestamps by video_id
  const videoGroups = new Map<string, TimestampRecord[]>();
  for (const ts of sortedRows) {
    if (!videoGroups.has(ts.video_id)) {
      videoGroups.set(ts.video_id, []);
    }
    videoGroups.get(ts.video_id)!.push({
      guid: ts.guid,
      start: ts.start,
      comment: ts.comment,
      write_counter: ts.write_counter,
      deleted_at: ts.deleted_at, // soft-deletion state for backup/restore sync
      // device_id is storage-only; excluded from export
    });
  }

  // Populate exportData with all timestamps in v1 format for compatibility
  const videoIds = Array.from(videoGroups.keys()).sort((a, b) => a.localeCompare(b));
  for (const videoId of videoIds) {
    const timestamps = videoGroups.get(videoId)!;
    exportData[`ytls-${videoId}`] = {
      video_id: videoId,
      timestamps,
    };
  }

  const filename = `timekeeper-data.json`;
  const json = JSON.stringify(exportData, null, 2);
  return { json, filename, totalVideos: videoGroups.size, totalTimestamps: sortedRows.length, invalidRows };
}

/**
 * Export all timestamps to a local JSON file
 */
export async function exportAllTimestamps(): Promise<void> {
  try {
    const { json, filename, totalVideos, totalTimestamps } = await buildExportPayload();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    log(`Exported ${totalVideos} videos with ${totalTimestamps} timestamps`);
  } catch (err) {
    log("Failed to export data:", err, 'error');
    throw err;
  }
}

/**
 * Build a CSV export payload with columns: Tag,Timestamp,URL
 */
export async function buildExportCsvPayload(): Promise<{
  csv: string;
  filename: string;
  totalVideos: number;
  totalTimestamps: number;
}> {
  // Get all timestamps from repository, excluding soft-deleted records
  const allTimestampsResult = TimestampRowSchema.array().safeParse(
    (await TimestampRepository.getAllTimestamps()).filter(r => !r.deleted_at)
  );

  // Early return with header when no timestamps or parse failure
  if (!allTimestampsResult.success || allTimestampsResult.data.length === 0) {
    if (!allTimestampsResult.success) {
      log('Failed to parse timestamp rows for CSV export:', allTimestampsResult.error.message, 'warn');
    }
    const header = 'Tag,Timestamp,URL\n';
    const filename = `timestamps-${getTimestampSuffix()}.csv`;
    return { csv: header, filename, totalVideos: 0, totalTimestamps: 0 };
  }

  const allTimestamps = allTimestampsResult.data;

  // Group timestamps by video_id
  const videoGroups = new Map<string, Array<{ start: number; comment: string }>>();
  for (const rec of allTimestamps) {
    if (!videoGroups.has(rec.video_id)) {
      videoGroups.set(rec.video_id, []);
    }
    videoGroups.get(rec.video_id)!.push({ start: rec.start, comment: rec.comment });
  }

  // Prepare CSV lines
  const lines: string[] = [];
  lines.push('Tag,Timestamp,URL');
  let totalTimestamps = 0;

  const escapeCsv = (s: string) => `"${String(s).replace(/"/g, '""')}"`;

  const videoIds = Array.from(videoGroups.keys()).sort();
  for (const videoId of videoIds) {
    const timestamps = videoGroups.get(videoId)!.sort((a, b) => a.start - b.start);
    for (const ts of timestamps) {
      const tag = ts.comment;
      // Strictly HH:MM:SS for CSV consistency (maxTime >= 10h forces full padding)
      const human = formatTimeString(ts.start, 36000);
      const url = buildYouTubeUrlWithTimestamp(ts.start, `https://www.youtube.com/watch?v=${videoId}`);
      lines.push([escapeCsv(tag), escapeCsv(human), escapeCsv(url)].join(','));
      totalTimestamps++;
    }
  }

  const csv = lines.join('\n');
  const filename = `timestamps-${getTimestampSuffix()}.csv`;
  return { csv, filename, totalVideos: videoGroups.size, totalTimestamps };
}

/**
 * Export all timestamps as CSV
 */
export async function exportAllTimestampsCsv(): Promise<void> {
  try {
    const { csv, filename, totalVideos, totalTimestamps } = await buildExportCsvPayload();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    log(`Exported ${totalVideos} videos with ${totalTimestamps} timestamps (CSV)`);
  } catch (err) {
    log("Failed to export CSV data:", err, 'error');
    throw err;
  }
}

// === Timestamp Management Business Logic ===

/**
 * Create and save a new timestamp
 */
export async function addTimestamp(videoId: string, timestamp: TimestampRecord): Promise<void> {
  if (!videoId) {
    throw new Error('Video ID is required');
  }
  if (!timestamp.guid || timestamp.start == null) {
    throw new Error('Timestamp must have GUID and start time');
  }
  return TimestampRepository.saveTimestamp(videoId, timestamp);
}

/**
 * Save specific timestamps for a video without touching its other rows
 */
export async function saveTimestampRows(videoId: string, timestamps: TimestampRecord[]): Promise<void> {
  if (!videoId) {
    throw new Error('Video ID is required');
  }
  return TimestampRepository.upsertTimestamps(videoId, timestamps);
}

/**
 * Update timestamps for a video (replaces all)
 */
export async function updateVideoTimestamps(videoId: string, timestamps: TimestampRecord[]): Promise<void> {
  if (!videoId) {
    throw new Error('Video ID is required');
  }
  if (!Array.isArray(timestamps)) {
    throw new Error('Timestamps must be an array');
  }
  return TimestampRepository.saveTimestamps(videoId, timestamps);
}

/**
 * Remove a specific timestamp
 */
export async function removeTimestamp(guid: string): Promise<void> {
  if (!guid) {
    throw new Error('GUID is required');
  }
  return TimestampRepository.deleteTimestamp(guid);
}

/**
 * Remove all timestamps for a video
 */
export async function removeVideoTimestamps(videoId: string): Promise<void> {
  if (!videoId) {
    throw new Error('Video ID is required');
  }
  return TimestampRepository.deleteTimestampsForVideo(videoId);
}

/**
 * Get timestamps for a video
 */
export async function getVideoTimestamps(videoId: string): Promise<TimestampRecord[] | null> {
  if (!videoId) {
    throw new Error('Video ID is required');
  }
  return TimestampRepository.loadTimestamps(videoId);
}

// === Import/Merge Business Logic ===

/**
 * Merge remote backup data into local DB using Lamport counter conflict resolution.
 *
 * Rules:
 *   - New GUID (no local record)              → always import (with its deleted_at state)
 *   - Same GUID, higher remote counter        → remote wins, including its deleted_at state:
 *       - remote deleted_at set   → record is soft-deleted on this device after merge
 *       - remote deleted_at unset → record is live (re-activates any local soft-deletion)
 *   - Same GUID, equal/lower remote counter   → keep local as-is (local deletion preserved)
 *   - Same GUID, no counter in remote         → keep local (old backup format)
 *
 * write_counter is a monotonic global sequence stamped on every create, edit, and
 * soft-delete.  Because soft-deletes increment the counter, a deletion on one device
 * will have a higher counter than the pre-deletion record on other devices, so the
 * Lamport comparison naturally propagates deletions without extra bookkeeping.
 */
export async function mergeBackupData(json: string): Promise<{ mergedVideos: number; mergedTimestamps: number }> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    log('mergeBackupData: failed to parse JSON', null, 'warn');
    return { mergedVideos: 0, mergedTimestamps: 0 };
  }

  const result = ExportDataSchema.safeParse(parsed);
  if (!result.success) {
    log('mergeBackupData: data failed validation', result.error.message, 'warn');
    return { mergedVideos: 0, mergedTimestamps: 0 };
  }

  // Map: guid → row (for lookup + comparison)
  const existingRows = await TimestampRepository.getAllTimestamps();
  const existingMap = new Map<string, typeof existingRows[number]>();
  for (const row of existingRows) {
    existingMap.set(row.guid, row);
  }

  let mergedVideos = 0;
  let mergedTimestamps = 0;
  const batch: Array<{
    guid: string;
    video_id: string;
    start: number;
    comment: string;
    write_counter?: number;
    deleted_at?: number;
  }> = [];

  for (const [, videoEntry] of Object.entries(result.data)) {
    const { video_id, timestamps } = videoEntry;
    let videoMerged = 0;
    for (const ts of timestamps) {
      const existing = existingMap.get(ts.guid);

      const shouldImport = remoteWins(existing, video_id, ts);

      if (shouldImport) {
        batch.push({
          guid: ts.guid,
          video_id,
          start: ts.start,
          comment: ts.comment,
          write_counter: ts.write_counter,
          deleted_at: ts.deleted_at,
        });
        existingMap.set(ts.guid, {
          ...(existing ?? {}),
          guid: ts.guid,
          video_id,
          start: ts.start,
          comment: ts.comment,
          write_counter: ts.write_counter,
          deleted_at: ts.deleted_at,
        } as typeof existingRows[number]);
        videoMerged++;
        mergedTimestamps++;
      }
    }
    if (videoMerged > 0) mergedVideos++;
  }

  await TimestampRepository.saveTimestampsBatch(batch);
  // saveTimestampsBatch already advances the local counter to max(local, remoteMax)+1
  // so no additional setWriteCounter call is needed here.
  return { mergedVideos, mergedTimestamps };
}

/** Tie-break key for equal write_counters; must match `contentKey` in server/src/store.ts. */
function contentKey(video_id: string, r: { start: number; comment: string; deleted_at?: number | null }): string {
  return JSON.stringify([video_id, r.start, r.comment, r.deleted_at ?? null]);
}

/**
 * Whether the incoming record replaces the stored one (see the rules on mergeBackupData).
 * - No stored row: import, including its deleted_at state.
 * - Higher incoming counter: import. A remote soft-delete hides the row here; a higher counter
 *   without deleted_at re-activates a locally deleted row (remote edit supersedes local deletion).
 * - Equal counters, different content (concurrent edits on two devices): the greater content key
 *   wins. The sync server applies the identical rule, so all devices converge.
 * - Otherwise keep local as-is, including any local soft-deletion.
 */
function remoteWins(
  existing: { video_id: string; start: number; comment: string; write_counter?: number; deleted_at?: number | null } | undefined,
  video_id: string,
  ts: { start: number; comment: string; write_counter?: number; deleted_at?: number | null }
): boolean {
  if (!existing) return true;
  if (existing.write_counter === undefined || ts.write_counter === undefined) return false;
  if (ts.write_counter !== existing.write_counter) return ts.write_counter > existing.write_counter;
  return contentKey(video_id, ts) > contentKey(existing.video_id, existing);
}

/**
 * Rows (including soft-deleted ones) written after the given Lamport counter, oldest first.
 * This is what the live sync pushes; device_id is storage-only and never leaves the device.
 */
export async function getRecordsChangedSince(counter: number): Promise<Array<TimestampRecord & { video_id: string; write_counter: number }>> {
  const rows: Array<TimestampRecord & { video_id: string; write_counter: number }> = [];
  for (const row of await TimestampRepository.getTimestampsChangedSince(counter)) {
    const parsed = TimestampRowSchema.safeParse(row);
    if (!parsed.success || parsed.data.write_counter === undefined) continue;
    const { guid, video_id, start, comment, write_counter, deleted_at } = parsed.data;
    rows.push({ guid, video_id, start, comment, write_counter, ...(deleted_at !== undefined ? { deleted_at } : {}) });
  }
  return rows; // the write_counter index already yields them oldest first
}

/**
 * Merge records received from the sync server using the same Lamport rules as a backup restore.
 */
export async function mergeRemoteRecords(
  records: Array<TimestampRecord & { video_id: string }>
): Promise<{ mergedVideos: number; mergedTimestamps: number }> {
  const stored = new Map<string, Awaited<ReturnType<typeof TimestampRepository.getTimestampsByGuids>>[number]>();
  for (const row of await TimestampRepository.getTimestampsByGuids(records.map((r) => r.guid))) stored.set(row.guid, row);

  const batch: Array<TimestampRecord & { video_id: string }> = [];
  const videos = new Set<string>();
  for (const record of records) {
    if (!remoteWins(stored.get(record.guid), record.video_id, record)) continue;
    batch.push(record);
    videos.add(record.video_id);
  }

  // Silent: these writes came from the sync server, so they must not trigger a push cycle.
  await TimestampRepository.saveTimestampsBatch(batch, { silent: true });
  return { mergedVideos: videos.size, mergedTimestamps: batch.length };
}

// === Settings Business Logic ===

/**
 * Save a setting
 */
export function saveSetting(key: string, value: unknown): Promise<void> {
  if (!key) {
    throw new Error('Setting key is required');
  }
  return TimestampRepository.saveSetting(key, value);
}

/**
 * Load a setting
 */
export async function loadSetting(key: string): Promise<unknown> {
  if (!key) {
    throw new Error('Setting key is required');
  }
  return TimestampRepository.loadSetting(key);
}
