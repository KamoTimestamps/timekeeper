/**
 * Timestamp Service
 * Business logic layer for timestamp operations.
 * Uses the Repository pattern for data access.
 */

import {
  TimestampRecord,
  TimestampRowSchema,
} from '../schema';
import { log, getTimestampSuffix, buildYouTubeUrlWithTimestamp } from '../util';
import * as TimestampRepository from './timestampRepository';

// === Export/Import Business Logic ===

/**
 * Build a complete export payload with all timestamps
 */
export async function buildExportPayload(): Promise<{
  json: string;
  filename: string;
  totalVideos: number;
  totalTimestamps: number;
}> {
  const exportData = {} as Record<string, unknown>;

  // Get all timestamps from repository
  const allTimestamps = await TimestampRepository.getAllTimestamps();
  const parsedRows = TimestampRowSchema.array().safeParse(allTimestamps);

  if (!parsedRows.success) {
    log('Failed to parse timestamp rows for export:', parsedRows.error.format(), 'warn');
    return { json: '{}', filename: 'timekeeper-data.json', totalVideos: 0, totalTimestamps: 0 };
  }

  // Group timestamps by video_id
  const videoGroups = new Map<string, TimestampRecord[]>();
  for (const ts of parsedRows.data) {
    if (!videoGroups.has(ts.video_id)) {
      videoGroups.set(ts.video_id, []);
    }
    videoGroups.get(ts.video_id)!.push({
      guid: ts.guid,
      start: ts.start,
      comment: ts.comment
    });
  }

  // Populate exportData with all timestamps in v1 format for compatibility
  for (const [videoId, timestamps] of videoGroups) {
    exportData[`ytls-${videoId}`] = {
      video_id: videoId,
      timestamps: timestamps.sort((a, b) => a.start - b.start)
    };
  }

  const filename = `timekeeper-data.json`;
  const json = JSON.stringify(exportData, null, 2);
  return { json, filename, totalVideos: videoGroups.size, totalTimestamps: parsedRows.data.length };
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
  // Get all timestamps from repository
  const allTimestampsResult = TimestampRowSchema.array().safeParse(await TimestampRepository.getAllTimestamps());

  // Early return with header when no timestamps or parse failure
  if (!allTimestampsResult.success || allTimestampsResult.data.length === 0) {
    if (!allTimestampsResult.success) {
      log('Failed to parse timestamp rows for CSV export:', allTimestampsResult.error.format(), 'warn');
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

  // Format timestamps strictly as HH:MM:SS for CSV consistency
  const toHHMMSS = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = String(s % 60).padStart(2, '0');
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${ss}`;
  };

  const videoIds = Array.from(videoGroups.keys()).sort();
  for (const videoId of videoIds) {
    const timestamps = videoGroups.get(videoId)!.sort((a, b) => a.start - b.start);
    for (const ts of timestamps) {
      const tag = ts.comment;
      const human = toHHMMSS(ts.start);
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
  if (!timestamp.guid || !timestamp.start) {
    throw new Error('Timestamp must have GUID and start time');
  }
  return TimestampRepository.saveTimestamp(videoId, timestamp);
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

// === Settings Business Logic ===

/**
 * Save a setting
 */
export function saveSetting(key: string, value: unknown): void {
  if (!key) {
    throw new Error('Setting key is required');
  }
  TimestampRepository.saveSetting(key, value);
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
