/**
  * Timestamp Model - Facade & Public API
  *
  * This module provides a clean public API that delegates to:
  * - Repository Layer: services/timestampRepository.ts (data access)
  * - Service Layer: services/timestampService.ts (business logic)
  *
  * Architecture:
  * 1. Repository Pattern: Abstracts IndexedDB operations
  * 2. Service Layer: Business logic and validation
  * 3. Model Facade: Public API exports for use by controllers/views
  */

import { TimestampRecord } from './schema';
import * as TimestampService from './services/timestampService';

// ============================================================================
// TIMESTAMP MANAGEMENT
// ============================================================================

/**
 * Add a new timestamp for a video
 * @param videoId - The YouTube video ID
 * @param timestamp - The timestamp record with guid, start time, and comment
 */
export function addTimestamp(videoId: string, timestamp: TimestampRecord): Promise<void> {
  return TimestampService.addTimestamp(videoId, timestamp);
}

/**
 * Replace all timestamps for a video (delete semantics for removed GUIDs)
 * @param videoId - The YouTube video ID
 * @param timestamps - The complete set of timestamps to persist
 */
export function saveToIndexedDB(videoId: string, timestamps: TimestampRecord[]): Promise<void> {
  return TimestampService.updateVideoTimestamps(videoId, timestamps);
}

/**
 * Save a single timestamp (upsert by GUID)
 * @param videoId - The YouTube video ID
 * @param timestamp - The timestamp record to save
 */
export function saveSingleTimestampToIndexedDB(videoId: string, timestamp: TimestampRecord): Promise<void> {
  return TimestampService.addTimestamp(videoId, timestamp);
}

/**
 * Load all timestamps for a video from IndexedDB
 * @param videoId - The YouTube video ID
 * @returns Array of timestamp records sorted by start time, or null if none exist
 */
export function loadFromIndexedDB(videoId: string): Promise<TimestampRecord[] | null> {
  return TimestampService.getVideoTimestamps(videoId);
}

/**
 * Soft-delete a single timestamp by GUID
 * @param _videoId - The YouTube video ID (reserved for future use)
 * @param guid - The timestamp GUID to delete
 */
export function deleteSingleTimestampFromIndexedDB(_videoId: string, guid: string): Promise<void> {
  return TimestampService.removeTimestamp(guid);
}

/**
 * Soft-delete all timestamps for a video
 * @param videoId - The YouTube video ID
 */
export function removeFromIndexedDB(videoId: string): Promise<void> {
  return TimestampService.removeVideoTimestamps(videoId);
}

// ============================================================================
// SETTINGS MANAGEMENT
// ============================================================================

/**
 * Save a global setting to IndexedDB
 * @param key - The setting key
 * @param value - The setting value
 */
export function saveGlobalSettings(key: string, value: unknown): Promise<void> {
  return TimestampService.saveSetting(key, value);
}

/**
 * Load a global setting from IndexedDB
 * @param key - The setting key
 * @returns The setting value, or undefined if not found
 */
export function loadGlobalSettings(key: string): Promise<unknown> {
  return TimestampService.loadSetting(key);
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

/**
 * Build a JSON export payload containing all timestamps
 * @param opts - Optional configuration
 * @param opts.includeDeleted - Whether to include soft-deleted records
 * @returns The export payload as a JSON string
 */
export function buildExportPayload(opts?: { includeDeleted?: boolean }) {
  return TimestampService.buildExportPayload(opts);
}

/**
 * Export all timestamps as a downloadable JSON file
 */
export function exportAllTimestamps(): Promise<void> {
  return TimestampService.exportAllTimestamps();
}

/**
 * Build a CSV export payload with columns: Tag, Timestamp, URL
 * @returns The CSV payload with filename
 */
export function buildExportCsvPayload() {
  return TimestampService.buildExportCsvPayload();
}

/**
 * Export all timestamps as a downloadable CSV file
 */
export function exportAllTimestampsCsv(): Promise<void> {
  return TimestampService.exportAllTimestampsCsv();
}

/**
 * Merge remote backup JSON into local DB additively by GUID.
 * Existing local timestamps are never modified or deleted.
 * @param json - The backup JSON string to merge
 * @returns Count of merged videos and timestamps
 */
export function mergeBackupData(json: string): Promise<{ mergedVideos: number; mergedTimestamps: number }> {
  return TimestampService.mergeBackupData(json);
}
