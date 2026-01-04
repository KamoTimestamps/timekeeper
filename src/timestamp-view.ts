/**
 * Timestamp View
 * Handles all UI rendering, DOM manipulation, and visual feedback for timestamps.
 * This module is responsible for displaying timestamps and managing user interactions.
 */

import { TimestampRecord } from './schema';
import { log, formatTimeString, buildYouTubeUrlWithTimestamp } from './util';
import { addTooltip } from './tooltip';

// === UI State Management ===

export interface TimestampViewElements {
  pane: HTMLDivElement | null;
  header: HTMLDivElement | null;
  list: HTMLUListElement | null;
  btns: HTMLDivElement | null;
  timeDisplay: HTMLSpanElement | null;
  style: HTMLStyleElement | null;
  versionDisplay: HTMLSpanElement | null;
  backupStatusIndicator: HTMLSpanElement | null;
}

// CSS classes for timestamp states
const TIMESTAMP_HIGHLIGHT_CLASS = "ytls-highlight";
const TIMESTAMP_DELETE_CLASS = "ytls-deleting";

// Track mouse state for scroll behavior
let isMouseOverTimestamps = false;

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
  while (list.firstChild) {
    list.removeChild(list.firstChild);
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
 * Show an error message in the timestamp pane
 */
export function displayPaneError(list: HTMLUListElement | null, message: string): void {
  if (!list) return;
  clearTimestampsDisplay(list);
  const li = document.createElement('li');
  li.className = 'ytls-error-message';
  li.textContent = message;
  li.style.color = '#ff4d4f';
  li.style.textAlign = 'center';
  li.style.padding = '20px';
  list.appendChild(li);
  list.style.overflowY = 'hidden';
}

/**
 * Ensure empty placeholder is shown when no timestamps exist
 */
export function ensureEmptyPlaceholder(
  list: HTMLUListElement | null,
  isLoading: boolean
): void {
  if (!list || isLoading) return;

  const hasNonPlaceholderItems = Array.from(list.children).some(li => {
    return !li.classList.contains('ytls-placeholder') && !li.classList.contains('ytls-error-message');
  });

  if (!hasNonPlaceholderItems) {
    showListPlaceholder(list, 'No timestamps for this video');
  }
}

/**
 * Format a timestamp anchor element with time and URL
 */
export function formatTimeForDisplay(
  anchor: HTMLAnchorElement,
  timeInSeconds: number,
  currentUrl: string
): void {
  anchor.textContent = formatTimeString(timeInSeconds);
  anchor.dataset.time = String(timeInSeconds);
  anchor.href = buildYouTubeUrlWithTimestamp(timeInSeconds, currentUrl);
}

/**
 * Find the nearest timestamp at or before the given time
 */
export function findNearestTimestamp(
  list: HTMLUListElement | null,
  currentTime: number
): HTMLLIElement | null {
  if (!Number.isFinite(currentTime) || !list) {
    return null;
  }

  const items = getTimestampItems(list);
  if (items.length === 0) {
    return null;
  }

  let nearestLi: HTMLLIElement | null = null;
  let largestTimestamp = -Infinity;

  for (const li of items) {
    const timeLink = li.querySelector<HTMLAnchorElement>('a[data-time]');
    const timeValue = timeLink?.dataset.time;
    if (!timeValue) {
      continue;
    }
    const timestamp = Number.parseInt(timeValue, 10);
    if (!Number.isFinite(timestamp)) {
      continue;
    }
    // Only consider timestamps at or before the current time
    if (timestamp <= currentTime && timestamp > largestTimestamp) {
      largestTimestamp = timestamp;
      nearestLi = li;
    }
  }

  return nearestLi;
}

/**
 * Highlight a timestamp and optionally scroll it into view
 */
export function highlightTimestamp(
  list: HTMLUListElement | null,
  li: HTMLLIElement | null,
  shouldScroll = false
): void {
  if (!li || !list) return;

  const items = getTimestampItems(list);
  items.forEach(item => {
    if (!item.classList.contains(TIMESTAMP_DELETE_CLASS)) {
      item.classList.remove(TIMESTAMP_HIGHLIGHT_CLASS);
    }
  });

  if (!li.classList.contains(TIMESTAMP_DELETE_CLASS)) {
    li.classList.add(TIMESTAMP_HIGHLIGHT_CLASS);

    if (shouldScroll && !isMouseOverTimestamps) {
      try {
        if (list instanceof HTMLElement) {
          const liRect = li.getBoundingClientRect();
          const listRect = list.getBoundingClientRect();
          const isVisible = !(liRect.bottom < listRect.top || liRect.top > listRect.bottom);
          if (!isVisible) {
            li.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } else {
          li.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } catch (e) {
        try {
          li.scrollIntoView({ behavior: "smooth", block: "center" });
        } catch (_) {
          // Ignore scroll errors
        }
      }
    }
  }
}

/**
 * Highlight the nearest timestamp at the given time
 */
export function highlightNearestTimestampAtTime(
  list: HTMLUListElement | null,
  currentSeconds: number,
  shouldScroll: boolean
): void {
  if (!Number.isFinite(currentSeconds)) {
    return;
  }

  const nearestLi = findNearestTimestamp(list, currentSeconds);
  highlightTimestamp(list, nearestLi, shouldScroll);
}

/**
 * Remove all seekbar markers from YouTube's progress bar
 */
export function removeSeekbarMarkers(): void {
  const markers = document.querySelectorAll(".ytls-marker");
  markers.forEach(m => m.remove());
}

/**
 * Update seekbar markers based on current timestamps
 */
export function updateSeekbarMarkers(
  list: HTMLUListElement | null,
  getVideoElement: () => HTMLVideoElement | null,
  getActivePlayer: () => any,
  isLiveStream: boolean
): void {
  if (!list) return;
  const video = getVideoElement();
  const progressBar = document.querySelector<HTMLDivElement>(".ytp-progress-bar");

  // Skip if video isn't ready, progress bar isn't found, or if it's a live stream
  if (!video || !progressBar || !isFinite(video.duration) || isLiveStream) return;

  removeSeekbarMarkers();

  const timestamps = getTimestampItems(list);

  timestamps.forEach(li => {
    const startLink = li.querySelector<HTMLAnchorElement>('a[data-time]');
    const timeValue = startLink?.dataset.time;
    if (!startLink || !timeValue) {
      return;
    }
    const startTime = Number.parseInt(timeValue, 10);
    if (!Number.isFinite(startTime)) {
      return;
    }

    const marker = document.createElement("div");
    marker.className = "ytls-marker";
    marker.style.position = "absolute";
    marker.style.height = "100%";
    marker.style.width = "2px";
    marker.style.backgroundColor = "#ff0000";
    marker.style.cursor = "pointer";
    marker.style.left = (startTime / video.duration * 100) + "%";
    marker.dataset.time = String(startTime);
    marker.addEventListener("click", () => {
      const player = getActivePlayer();
      if (player) player.seekTo(startTime);
    });
    progressBar.appendChild(marker);
  });
}

/**
 * Extract timestamp records from the UI
 */
export function extractTimestampRecords(list: HTMLUListElement | null): TimestampRecord[] {
  if (!list) return [];

  const items = getTimestampItems(list);
  const records: TimestampRecord[] = [];

  items.forEach(li => {
    const timeLink = li.querySelector<HTMLAnchorElement>('a[data-time]');
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
 * Update scroll overflow based on content height
 */
export function updateScrollOverflow(
  pane: HTMLDivElement | null,
  header: HTMLDivElement | null,
  list: HTMLUListElement | null,
  btns: HTMLDivElement | null
): void {
  if (!pane || !header || !list || !btns) return;

  const tsCount = getTimestampItems(list).length;
  const paneRect = pane.getBoundingClientRect();
  const headerRect = header.getBoundingClientRect();
  const btnsRect = btns.getBoundingClientRect();
  const available = Math.max(0, paneRect.height - (headerRect.height + btnsRect.height));

  if (tsCount === 0) {
    list.style.overflowY = 'hidden';
  } else {
    list.style.overflowY = list.scrollHeight > available ? 'auto' : 'hidden';
  }
}

/**
 * Set mouse over timestamp state (for scroll behavior)
 */
export function setMouseOverTimestamps(value: boolean): void {
  isMouseOverTimestamps = value;
}

/**
 * Get mouse over timestamp state
 */
export function getMouseOverTimestamps(): boolean {
  return isMouseOverTimestamps;
}

/**
 * Sync visibility state across UI toggle buttons
 */
export function syncToggleButtons(
  isVisible: boolean,
  headerButton: HTMLButtonElement | null,
  headerButtonImage: HTMLImageElement | null,
  isHeaderButtonHovered: boolean,
  defaultIconUrl: string,
  hoverIconUrl: string
): void {
  if (headerButton) {
    headerButton.setAttribute("aria-pressed", String(isVisible));
  }

  if (headerButtonImage && !isHeaderButtonHovered) {
    if (headerButtonImage.src !== defaultIconUrl) {
      headerButtonImage.src = defaultIconUrl;
    }
  }
}

/**
 * Offset all timestamp times by a delta
 */
export function offsetAllTimestampTimes(
  list: HTMLUListElement | null,
  delta: number,
  currentUrl: string
): boolean {
  if (!list || !Number.isFinite(delta) || delta === 0) {
    return false;
  }

  const items = getTimestampItems(list);
  if (items.length === 0) {
    return false;
  }

  let changed = false;

  items.forEach(li => {
    const anchor = li.querySelector<HTMLAnchorElement>('a[data-time]');
    const timeValue = anchor?.dataset.time;
    if (!anchor || !timeValue) {
      return;
    }

    const currentTime = Number.parseInt(timeValue, 10);
    if (!Number.isFinite(currentTime)) {
      return;
    }

    const newTime = Math.max(0, currentTime + delta);
    if (newTime !== currentTime) {
      formatTimeForDisplay(anchor, newTime, currentUrl);
      changed = true;
    }
  });

  return changed;
}

/**
 * Get the latest (maximum) timestamp value from the UI
 */
export function getLatestTimestampValue(list: HTMLUListElement | null): number {
  if (!list) return 0;

  const items = getTimestampItems(list);
  let maxTime = 0;

  items.forEach(li => {
    const timeLink = li.querySelector<HTMLAnchorElement>('a[data-time]');
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

/**
 * Calculate and update time differences between consecutive timestamps
 */
export function updateTimeDifferences(list: HTMLUListElement | null): void {
  if (!list) return;

  const items = getTimestampItems(list);

  items.forEach((li, index) => {
    const timeDiff = li.querySelector<HTMLSpanElement>('.time-diff');
    const timeLink = li.querySelector<HTMLAnchorElement>('a[data-time]');
    const timeValue = timeLink?.dataset.time;

    if (!timeDiff || !timeValue) {
      return;
    }

    const currentTime = Number.parseInt(timeValue, 10);
    if (!Number.isFinite(currentTime)) {
      timeDiff.textContent = '';
      return;
    }

    if (index === 0) {
      // First timestamp shows time from start
      if (currentTime > 0) {
        timeDiff.textContent = `+${formatTimeString(currentTime)}`;
      } else {
        timeDiff.textContent = '';
      }
    } else {
      // Subsequent timestamps show delta from previous
      const prevLi = items[index - 1];
      const prevTimeLink = prevLi.querySelector<HTMLAnchorElement>('a[data-time]');
      const prevTimeValue = prevTimeLink?.dataset.time;

      if (prevTimeValue) {
        const prevTime = Number.parseInt(prevTimeValue, 10);
        if (Number.isFinite(prevTime)) {
          const diff = currentTime - prevTime;
          if (diff > 0) {
            timeDiff.textContent = `+${formatTimeString(diff)}`;
          } else {
            timeDiff.textContent = '';
          }
        } else {
          timeDiff.textContent = '';
        }
      } else {
        timeDiff.textContent = '';
      }
    }
  });
}

/**
 * Clamp pane position to viewport bounds
 */
export function clampPaneToViewport(pane: HTMLDivElement | null): void {
  if (!pane) return;

  const rect = pane.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;

  let x = rect.left;
  let y = rect.top;

  // Clamp to viewport bounds
  x = Math.max(0, Math.min(x, viewportWidth - rect.width));
  y = Math.max(0, Math.min(y, viewportHeight - rect.height));

  pane.style.left = `${x}px`;
  pane.style.top = `${y}px`;
  pane.style.right = "auto";
  pane.style.bottom = "auto";
}
