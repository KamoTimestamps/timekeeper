/**
 * Timestamp View
 * Handles all UI rendering, DOM manipulation, and visual feedback for timestamps.
 * This module is responsible for displaying timestamps and managing user interactions.
 */

import { TimestampRecord } from './schema';

/**
 * Get all timestamp list items (excludes placeholders and error messages)
 */
export function getTimestampItems(list: HTMLUListElement | null): HTMLLIElement[] {
  if (!list) return [];
  return Array.from(list.querySelectorAll<HTMLLIElement>('li:not(.ytls-placeholder):not(.ytls-error-message)'));
}

/**
 * Clear all timestamps from the display
 */
export function clearTimestampsDisplay(list: HTMLUListElement | null): void {
  if (!list) return;
  list.replaceChildren();
  // Also clear any pending error message
  const errorItem = list.querySelector('.ytls-error-message');
  if (errorItem) {
    errorItem.remove();
  }
}

/**
 * Show a placeholder message when no timestamps exist
 */
export function showListPlaceholder(list: HTMLUListElement | null, message: string): void {
  if (!list) return;
  clearTimestampsDisplay(list);
  const li = document.createElement('li');
  li.className = 'ytls-placeholder';
  li.textContent = message;
  list.appendChild(li);
  list.style.overflowY = 'hidden';
}

/**
 * Clear any placeholder message
 */
export function clearListPlaceholder(list: HTMLUListElement | null): void {
  if (!list) return;
  const placeholder = list.querySelector('.ytls-placeholder');
  if (placeholder) placeholder.remove();
  list.style.overflowY = '';
}

/**
 * Check if the timestamp list contains an error message.
 */
export function hasPaneError(list: HTMLUListElement | null): boolean {
  if (!list) return false;
  return list.querySelector('.ytls-error-message') !== null;
}

/**
 * Show a prominent error banner in the timestamp pane.
 * This is displayed at the top of the list and prevents all editing.
 */
export function displayPaneError(list: HTMLUListElement | null, message: string): void {
  if (!list) return;
  clearTimestampsDisplay(list);

  const errorItem = document.createElement('li');
  errorItem.className = 'ytls-error-message';
  errorItem.style.cssText = `
    color: #ff4d4f;
    text-align: center;
    padding: 16px;
    background: rgba(255, 0, 0, 0.08);
    border: 1px solid rgba(255, 77, 79, 0.3);
    border-radius: 6px;
    margin: 8px;
    font-weight: 600;
    font-size: 14px;
    line-height: 1.5;
  `;

  // Create a friendly error message with a refresh hint
  errorItem.innerHTML = `<div style="margin-bottom:8px">⚠️ ${escapeHtml(message)}</div><div style="font-size:12px;font-weight:normal;color:#aaa">Check the console for details or refresh the page.</div>`;
  list.appendChild(errorItem);
  list.style.overflowY = 'hidden';
}

/**
 * Clear any error message from the timestamp list.
 */
export function clearPaneError(list: HTMLUListElement | null): void {
  if (!list) return;
  const errorItem = list.querySelector('.ytls-error-message');
  if (errorItem) {
    errorItem.remove();
  }
}

/**
 * Escape HTML to prevent XSS in error messages.
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Ensure empty placeholder is shown when no timestamps exist (and no error is shown).
 */
export function ensureEmptyPlaceholder(
  list: HTMLUListElement | null,
  isLoading: boolean
): void {
  if (!list || isLoading) return;
  // Don't show placeholder when an error is displayed
  if (hasPaneError(list)) return;

  const hasNonPlaceholderItems = Array.from(list.children).some(li => {
    return !li.classList.contains('ytls-placeholder') && !li.classList.contains('ytls-error-message');
  });

  if (!hasNonPlaceholderItems) {
    showListPlaceholder(list, 'No timestamps for this video');
  }
}

/**
 * Extract timestamp records from the UI
 */
export function extractTimestampRecords(list: HTMLUListElement | null): TimestampRecord[] {
  if (!list) return [];

  const items = getTimestampItems(list);
  const records: TimestampRecord[] = [];

  items.forEach(li => {
    const timeLink = li.querySelector<HTMLElement>('[data-time]');
    const commentInput = li.querySelector<HTMLInputElement>('input');
    const guid = li.dataset.guid;

    if (!timeLink || !commentInput || !guid) {
      return;
    }

    const timeValue = timeLink.dataset.time;
    if (!timeValue) {
      return;
    }

    const start = Number.parseInt(timeValue, 10);
    if (!Number.isFinite(start)) {
      return;
    }

    records.push({
      guid,
      start,
      comment: commentInput.value
    });
  });

  return records.sort((a, b) => a.start - b.start);
}

/**
 * Get the latest (maximum) timestamp value from the UI
 */
export function getLatestTimestampValue(list: HTMLUListElement | null): number {
  if (!list) return 0;

  const items = getTimestampItems(list);
  let maxTime = 0;

  items.forEach(li => {
    const timeLink = li.querySelector<HTMLElement>('[data-time]');
    const timeValue = timeLink?.dataset.time;
    if (timeValue) {
      const time = Number.parseInt(timeValue, 10);
      if (Number.isFinite(time)) {
        maxTime = Math.max(maxTime, time);
      }
    }
  });

  return maxTime;
}
