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
 */
export function addTimestamp(videoId: string, timestamp: TimestampRecord): Promise<void> {
  return TimestampService.addTimestamp(videoId, timestamp);
}

/**
 * Update all timestamps for a video
 */
export function saveToIndexedDB(videoId: string, timestamps: TimestampRecord[]): Promise<void> {
  return TimestampService.updateVideoTimestamps(videoId, timestamps);
}

/**
 * Save a single timestamp
 */
export function saveSingleTimestampToIndexedDB(videoId: string, timestamp: TimestampRecord): Promise<void> {
  return TimestampService.addTimestamp(videoId, timestamp);
}

/**
 * Get timestamps for a video
 */
export function loadFromIndexedDB(videoId: string): Promise<TimestampRecord[] | null> {
  return TimestampService.getVideoTimestamps(videoId);
}

/**
 * Delete a single timestamp
 */
export function deleteSingleTimestampFromIndexedDB(_videoId: string, guid: string): Promise<void> {
  return TimestampService.removeTimestamp(guid);
}

/**
 * Remove all timestamps for a video
 */
export function removeFromIndexedDB(videoId: string): Promise<void> {
  return TimestampService.removeVideoTimestamps(videoId);
}

// ============================================================================
// SETTINGS MANAGEMENT
// ============================================================================

/**
 * Save a global setting
 */
export function saveGlobalSettings(key: string, value: unknown): void {
  TimestampService.saveSetting(key, value);
}

/**
 * Load a global setting
 */
export function loadGlobalSettings(key: string): Promise<unknown> {
  return TimestampService.loadSetting(key);
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

/**
 * Build JSON export payload
 */
export function buildExportPayload() {
  return TimestampService.buildExportPayload();
}

/**
 * Export all timestamps as JSON
 */
export function exportAllTimestamps(): Promise<void> {
  return TimestampService.exportAllTimestamps();
}

/**
 * Build CSV export payload
 */
export function buildExportCsvPayload() {
  return TimestampService.buildExportCsvPayload();
}

/**
 * Export all timestamps as CSV
 */
export function exportAllTimestampsCsv(): Promise<void> {
  return TimestampService.exportAllTimestampsCsv();
}
