import { getHolidayEmoji } from './holidays';
import { log, formatTimeString, buildYouTubeUrlWithTimestamp, getTimestampSuffix } from './util';
import { addTooltip } from './tooltip';

declare const GM: {
  getValue<T = unknown>(key: string, defaultValue?: T): Promise<T>;
  setValue<T = unknown>(key: string, value: T): Promise<void>;
};

declare const GM_info: {
  script: {
    version: string;
  };
};

import { PANE_STYLES } from "./styles";
import * as GoogleDrive from "./google-drive";

// OAuth detection - always check URL for auth token, runs synchronously before any async operations
const hash = window.location.hash;
if (hash && hash.length > 1) {
  const params = new URLSearchParams(hash.substring(1));
  const state = params.get('state');

  if (state === 'timekeeper_auth') {
    const token = params.get('access_token');
    if (token) {
      console.log('[Timekeeper] Auth token detected in URL, broadcasting token');
      console.log('[Timekeeper] Token length:', token.length, 'characters');

      // Broadcast via BroadcastChannel (primary method)
      try {
        const channel = new BroadcastChannel('timekeeper_oauth');
        const message = { type: 'timekeeper_oauth_token', token: token };
        console.log('[Timekeeper] Sending auth message via BroadcastChannel:', { type: message.type, tokenLength: token.length });
        channel.postMessage(message);
        channel.close();
        console.log('[Timekeeper] Token broadcast via BroadcastChannel completed');
      } catch (e) {
        console.log('[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:', e);
        // Fallback to IndexedDB for cross-tab communication
        const message = {
          type: 'timekeeper_oauth_token',
          token: token,
          timestamp: Date.now()
        };
        // Direct IndexedDB write (can't use async helper here as it's not defined yet)
        const openReq = indexedDB.open('ytls-timestamps-db', 3);
        openReq.onsuccess = () => {
          const db = openReq.result;
          const tx = db.transaction('settings', 'readwrite');
          const store = tx.objectStore('settings');
          store.put({ key: 'oauth_message', value: message });
          tx.oncomplete = () => {
            console.log('[Timekeeper] Token broadcast via IndexedDB completed, timestamp:', message.timestamp);
            db.close();
          };
        };
      }

      // Clean up the hash from the URL
      if (history.replaceState) {
        const cleanUrl = window.location.pathname + window.location.search;
        history.replaceState(null, '', cleanUrl);
      }

      // Close window after broadcasting auth token
      console.log('[Timekeeper] Closing window after broadcasting auth token');
      window.close();
      // Exit the module by throwing - this prevents the IIFE from running
      throw new Error('OAuth window closed');
    }
  }
}

(async function () {
  'use strict';

  if (window.top !== window.self) {
    return; // Don't run in iframes
  }

  // Setup minimal logging and storage functions early for OAuth handling
  function earlyLoadGlobalSettings(key: string): Promise<unknown> {
    return GM.getValue(`timekeeper_${key}`, undefined);
  }

  function earlySaveGlobalSettings(key: string, value: unknown): Promise<void> {
    return GM.setValue(`timekeeper_${key}`, JSON.stringify(value));
  }

  // Initialize GoogleDrive callbacks early for OAuth handling
  (GoogleDrive as any).setLoadGlobalSettings(earlyLoadGlobalSettings);
  (GoogleDrive as any).setSaveGlobalSettings(earlySaveGlobalSettings);

  // Check if we're in an OAuth popup and handle it
  const isOAuthPopup = await GoogleDrive.handleOAuthPopup();
  if (isOAuthPopup) {
    log("OAuth popup detected, broadcasting token and closing");
    return; // Exit script, popup will close
  }

  // Load auth state early so user remains signed in
  await GoogleDrive.loadGoogleAuthState();

  const SUPPORTED_PATH_PREFIXES = ["/watch", "/live"] as const;

  function isSupportedUrl(url = window.location.href) {
    try {
      const parsed = new URL(url);
      if (parsed.origin !== "https://www.youtube.com") {
        return false;
      }
      return SUPPORTED_PATH_PREFIXES.some(prefix => {
        return parsed.pathname === prefix || parsed.pathname.startsWith(`${prefix}/`);
      });
    } catch (err) {
      log("Timekeeper failed to parse URL for support check:", err, 'error');
      return false;
    }
  }

  let pane: HTMLDivElement | null = null;
  let header: HTMLDivElement | null = null;
  let list: HTMLUListElement | null = null;
  let btns: HTMLDivElement | null = null;
  let timeDisplay: HTMLSpanElement | null = null;
  let style: HTMLStyleElement | null = null;
  let versionDisplay: HTMLSpanElement | null = null;
  let backupStatusIndicator: HTMLSpanElement | null = null;
  // Used for dynamic min-height calculation
  let minPaneHeight = 250;

  // Track last handled URL to avoid duplicate reloads from history events
  let lastHandledUrl: string | null = null;
  let urlChangeHandlersSetup = false;

  // --- Pane sizing helpers (available across module) ---
  function getPaneRect() {
    if (!pane) return null;
    return pane.getBoundingClientRect();
  }

  function updateLastSavedPanePositionFromRect(rect: DOMRect | null, xOverride?: number, yOverride?: number) {
    if (!rect) return;
    lastSavedPanePosition = {
      x: typeof xOverride === 'number' ? Math.round(xOverride) : Math.round(rect.left),
      y: typeof yOverride === 'number' ? Math.round(yOverride) : Math.round(rect.top),
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    };
  }

  function clampAndSavePanePosition(save = true) {
    if (!pane) return;
    clampPaneToViewport();
    const rect = getPaneRect();
    if (rect && (rect.width || rect.height)) {
      updateLastSavedPanePositionFromRect(rect);
      if (save) {
        saveGlobalSettings('windowPosition', lastSavedPanePosition);
        safePostMessage({ type: 'window_position_updated', position: lastSavedPanePosition, timestamp: Date.now() });
      }
    }
  }

  function ensureMinPaneHeight() {
    if (!pane || !header || !btns || !list) return;
    let liH = 40;
    const itemsForSize = getTimestampItems();
    if (itemsForSize.length > 0) {
      liH = (itemsForSize[0] as HTMLElement).offsetHeight;
    } else {
      const tempLi = document.createElement('li');
      tempLi.style.visibility = 'hidden';
      tempLi.style.position = 'absolute';
      tempLi.textContent = '00:00 Example';
      // Append temporarily so we can measure
      list.appendChild(tempLi);
      liH = tempLi.offsetHeight;
      list.removeChild(tempLi);
    }
    minPaneHeight = header.offsetHeight + btns.offsetHeight + liH;
    pane.style.minHeight = minPaneHeight + 'px';
  }

  // Append any timestamps that were built while the pane was animating open.
  function performSizingAndSave() {
    // Run a layout recalc then ensure pane sizing/clamping are applied
    requestAnimationFrame(() => {
      if (typeof (window as any).recalculateTimestampsArea === 'function') (window as any).recalculateTimestampsArea();
      ensureMinPaneHeight();
      clampAndSavePanePosition(true);
    });
  }

  function scheduleShowFinalizer(delay = 450) {
    if (visibilitySizingTimeoutId) {
      clearTimeout(visibilitySizingTimeoutId);
      visibilitySizingTimeoutId = null;
    }
    visibilitySizingTimeoutId = setTimeout(() => {
      // If timestamps were deferred while animating, append them first so sizing sees them
      appendPendingTimestamps();
      performSizingAndSave();
      visibilitySizingTimeoutId = null;
    }, delay);
  }

  function cancelScheduledShowFinalizer() {
    if (visibilitySizingTimeoutId) {
      clearTimeout(visibilitySizingTimeoutId);
      visibilitySizingTimeoutId = null;
    }
  }

  function startShowAnimation() {
    if (list) {
      list.style.visibility = 'hidden';
      log('Hiding timestamps during show animation');
    }
    performSizingAndSave();
    scheduleShowFinalizer();
  }

  function startHideAnimation() {
    // If any deferred timestamps exist, append them now (they'll remain hidden)
    appendPendingTimestamps();
    // Cancel any scheduled show finalizer since we're hiding instead
    cancelScheduledShowFinalizer();

    if (visibilityAnimationTimeoutId) {
      clearTimeout(visibilityAnimationTimeoutId);
      visibilityAnimationTimeoutId = null;
    }
    visibilityAnimationTimeoutId = setTimeout(() => {
      if (!pane) return;
      pane.style.display = "none";
      saveUIVisibilityState();
      visibilityAnimationTimeoutId = null;
    }, 400);
  }

  function appendPendingTimestamps() {
    if (!list) {
      // Resolve any pending promise so awaiters don't hang
      if (pendingTimestampsResolve) {
        pendingTimestampsResolve();
        pendingTimestampsResolve = null;
        pendingTimestampsPromise = null;
        pendingTimestampsFragment = null;
      }
      return;
    }

    // If there's nothing pending, ensure visibility is restored
    if (!pendingTimestampsFragment) {
      if (list.style.visibility === 'hidden') {
        list.style.visibility = '';
        log('Restoring timestamp visibility (no deferred fragment)');
      }
      if (pendingTimestampsResolve) {
        pendingTimestampsResolve();
        pendingTimestampsResolve = null;
        pendingTimestampsPromise = null;
      }
      return;
    }

    log('Appending deferred timestamps after animation');
    list.appendChild(pendingTimestampsFragment);
    pendingTimestampsFragment = null;

    // Restore visibility now that nodes are present
    if (list.style.visibility === 'hidden') {
      list.style.visibility = '';
      log('Restoring timestamp visibility after append');
    }

    // Resolve promise so loadTimestamps can continue
    if (pendingTimestampsResolve) {
      pendingTimestampsResolve();
      pendingTimestampsResolve = null;
      pendingTimestampsPromise = null;
    }

    updateIndentMarkers();
    updateSeekbarMarkers();
    if (typeof (window as any).recalculateTimestampsArea === 'function') {
      requestAnimationFrame(() => (window as any).recalculateTimestampsArea());
    }

    const playerForHighlight = getActivePlayer();
    const currentTimeForHighlight = playerForHighlight
      ? Math.floor(playerForHighlight.getCurrentTime())
      : getLatestTimestampValue();
    if (Number.isFinite(currentTimeForHighlight)) {
      highlightNearestTimestampAtTime(currentTimeForHighlight, false);
    }
  }

  let timeUpdateIntervalId: ReturnType<typeof setInterval> | null = null;
  let isLoadingTimestamps = false; // Track if timestamps are currently loading
  const TIMESTAMP_DELETE_CLASS = "ytls-timestamp-pending-delete";
  const TIMESTAMP_HIGHLIGHT_CLASS = "ytls-timestamp-highlight";
  const HEADER_ICON_DEFAULT_URL = "https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png";
  const HEADER_ICON_HOVER_URL = "https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_Eyebrow_64px_Indexed.png";

  // Preload header images once at script startup so they're cached for later use
  function preloadHeaderIcons() {
    const preloadImage = (url: string) => {
      const img = new Image();
      img.src = url;
    };
    preloadImage(HEADER_ICON_DEFAULT_URL);
    preloadImage(HEADER_ICON_HOVER_URL);
  }
  preloadHeaderIcons();

  // Wait for YouTube interface to load completely
  async function waitForYouTubeReady() {
    // Wait for the main video element and controls to be present
    while (!document.querySelector('video') || !document.querySelector('#movie_player')) {
      await new Promise(r => setTimeout(r, 100));
    }
    // Optionally, wait for the progress bar and other UI elements
    while (!document.querySelector('.ytp-progress-bar')) {
      await new Promise(r => setTimeout(r, 100));
    }
    // Wait a little extra to ensure dynamic elements are ready
    await new Promise(r => setTimeout(r, 200));
  }

  const REQUIRED_PLAYER_METHODS = [
    "getCurrentTime",
    "seekTo",
    "getPlayerState",
    "seekToLiveHead",
    "getVideoData",
    "getDuration"
  ];
  const PLAYER_METHOD_CHECK_TIMEOUT_MS = 5000;
  const PLAYER_METHODS_WITH_FALLBACK = new Set([
    "getCurrentTime",
    "seekTo",
    "getPlayerState",
    "seekToLiveHead",
    "getVideoData",
    "getDuration"
  ]);

  function methodHasFallback(method) {
    return PLAYER_METHODS_WITH_FALLBACK.has(method);
  }

  function getVideoElement() {
    return document.querySelector("video");
  }

  let lastValidatedPlayer = null;

  function getActivePlayer() {
    if (lastValidatedPlayer && document.contains(lastValidatedPlayer)) {
      return lastValidatedPlayer;
    }
    const player = document.getElementById("movie_player");
    if (player && document.contains(player)) {
      return player;
    }
    return null;
  }

  function hasRequiredPlayerMethods(playerInstance) {
    return REQUIRED_PLAYER_METHODS.every(method => {
      if (typeof playerInstance?.[method] === "function") {
        return true;
      }
      if (!methodHasFallback(method)) {
        return false;
      }
      return !!getVideoElement();
    });
  }

  function missingPlayerMethods(playerInstance) {
    return REQUIRED_PLAYER_METHODS.filter(method => {
      if (typeof playerInstance?.[method] === "function") {
        return false;
      }
      if (!methodHasFallback(method)) {
        return true;
      }
      return !getVideoElement();
    });
  }

  async function waitForPlayerWithMethods(timeoutMs = PLAYER_METHOD_CHECK_TIMEOUT_MS) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const playerInstance = getActivePlayer();
      if (hasRequiredPlayerMethods(playerInstance)) {
        return playerInstance;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    const fallbackPlayer = getActivePlayer();
    if (hasRequiredPlayerMethods(fallbackPlayer)) {
      return fallbackPlayer;
    }
    return fallbackPlayer;
  }



  // Configuration for timestamp offset
  const OFFSET_KEY = "timestampOffsetSeconds";
  const DEFAULT_OFFSET = -5;

  // Configuration for shift-click time skip interval
  const SHIFT_SKIP_KEY = "shiftClickTimeSkipSeconds";
  const DEFAULT_SHIFT_SKIP = 10;

  // Default pane size when none is stored in the DB
  const DEFAULT_PANE_WIDTH = 300;
  const DEFAULT_PANE_HEIGHT = 300;

  // Create a BroadcastChannel for cross-tab communication
  let channel = new BroadcastChannel('ytls_timestamp_channel');

  // Safe wrapper for posting messages to avoid "Channel is closed" errors
  function safePostMessage(message: unknown) {
    try {
      channel.postMessage(message);
    } catch (err) {
      log('BroadcastChannel error, reopening:', err, 'warn');
      try {
        channel = new BroadcastChannel('ytls_timestamp_channel');
        channel.onmessage = handleChannelMessage;
        channel.postMessage(message);
      } catch (reopenErr) {
        log('Failed to reopen BroadcastChannel:', reopenErr, 'error');
      }
    }
  }

  // Listen for messages from other tabs
  function handleChannelMessage(event: MessageEvent) {
    log('Received message from another tab:', event.data);
    if (!isSupportedUrl() || !list || !pane) {
      return;
    }
    if (event.data) {
      if (event.data.type === 'timestamps_updated' && event.data.videoId === currentLoadedVideoId) {
        log('Debouncing timestamp load due to external update for video:', event.data.videoId);
        clearTimeout(loadTimeoutId);
        loadTimeoutId = setTimeout(() => {
          log('Reloading timestamps due to external update for video:', event.data.videoId);
          loadTimestamps();
        }, 500);
      } else if (event.data.type === 'window_position_updated' && pane) {
        const pos = event.data.position;
        if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
          pane.style.left = `${pos.x}px`;
          pane.style.top = `${pos.y}px`;
          pane.style.right = "auto";
          pane.style.bottom = "auto";
          if (typeof pos.width === 'number' && pos.width > 0) {
            pane.style.width = `${pos.width}px`;
          }
          if (typeof pos.height === 'number' && pos.height > 0) {
            pane.style.height = `${pos.height}px`;
          }
          const rect = pane.getBoundingClientRect();
          lastSavedPanePosition = {
            x: Math.round(pos.x),
            y: Math.round(pos.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          };
          // Only clamp if pane is outside viewport
          const viewportWidth = document.documentElement.clientWidth;
          const viewportHeight = document.documentElement.clientHeight;
          if (
            rect.left < 0 ||
            rect.top < 0 ||
            rect.right > viewportWidth ||
            rect.bottom > viewportHeight
          ) {
            clampPaneToViewport();
          }
        }
      }
    }
  }
  channel.onmessage = handleChannelMessage;

  // The user can configure 'timestampOffsetSeconds' in ViolentMonkey's script values.
  // A positive value will make it after current time, negative before.
  let configuredOffset = await GM.getValue<number>(OFFSET_KEY);
  if (typeof configuredOffset !== 'number' || Number.isNaN(configuredOffset)) {
    configuredOffset = DEFAULT_OFFSET;
    await GM.setValue(OFFSET_KEY, configuredOffset);
  }

  let configuredShiftSkip = await GM.getValue<number>(SHIFT_SKIP_KEY);
  if (typeof configuredShiftSkip !== 'number' || Number.isNaN(configuredShiftSkip)) {
    configuredShiftSkip = DEFAULT_SHIFT_SKIP;
    await GM.setValue(SHIFT_SKIP_KEY, configuredShiftSkip);
  }

  let loadTimeoutId: ReturnType<typeof setTimeout> | null = null; // Variable to hold the timeout ID for debouncing loads from broadcast
  let commentSaveTimeouts: Map<string, ReturnType<typeof setTimeout>> = new Map(); // Track comment save timeouts per GUID
  let isMouseOverTimestamps = false; // Default to false
  let settingsModalInstance: HTMLDivElement | null = null; // To keep a reference to the settings modal
  let settingsCogButtonElement: HTMLButtonElement | null = null; // To keep a reference to the settings cog button
  let currentLoadedVideoId: string | null = null; // Track the currently loaded video to prevent duplicate loads
  let visibilityAnimationTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let visibilitySizingTimeoutId: ReturnType<typeof setTimeout> | null = null;
  // When timestamps are loaded while a show animation is running, build the DOM nodes
  // but defer appending them to the visible list until the animation completes.
  let pendingTimestampsFragment: DocumentFragment | null = null;
  let pendingTimestampsPromise: Promise<void> | null = null;
  let pendingTimestampsResolve: (() => void) | null = null;
  let headerButtonImage: HTMLImageElement | null = null;
  let isHeaderButtonHovered = false;
  let lastSavedPanePosition: { x: number; y: number; width: number; height: number } | null = null;
  let isPaneInitializing = false; // Lock flag to prevent concurrent pane initialization

  // Event listener references for cleanup to prevent memory leaks
  let documentMousemoveHandler: ((e: MouseEvent) => void) | null = null;
  let documentMouseupHandler: (() => void) | null = null;
  let windowResizeHandler: (() => void) | null = null;
  let videoTimeupdateHandler: (() => void) | null = null;
  let videoPauseHandler: (() => void) | null = null;
  let videoPlayHandler: (() => void) | null = null;
  let videoSeekingHandler: (() => void) | null = null;
  let keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  // Track pointer activity to distinguish intentional blur from OS UI (emoji picker)
  let docPointerDownHandler: ((e: PointerEvent) => void) | null = null;
  let docPointerUpHandler: ((e: PointerEvent) => void) | null = null;
  let lastPointerDownTs = 0;
  // Suppress list-driven sorts while focus is temporarily lost to OS UI (e.g., emoji picker)
  let suppressSortUntilRefocus = false;
  // Track the most recently modified timestamp (GUID) for negative-diff-based sorting
  let mostRecentlyModifiedTimestampGuid: string | null = null;

  type TimestampRecord = {
    start: number;
    comment: string;
    guid: string;
  };


  // Global cache for latest timestamp value
  let latestTimestampValue: number | null = null;


  function getTimestampItems(): HTMLLIElement[] {
    if (!list) return [];
    // Only treat LIs containing a timestamp anchor as real timestamp items. This excludes
    // placeholder rows (e.g., 'Loading...' / 'No timestamps...') and error messages.
    return Array.from(list.querySelectorAll<HTMLLIElement>('li')).filter(li => {
      return !!li.querySelector<HTMLAnchorElement>('a[data-time]');
    });
  }

  // Utility to extract timestamp records from UI
  function extractTimestampRecords(): TimestampRecord[] {
    return getTimestampItems()
      .map(li => {
        const startLink = li.querySelector<HTMLAnchorElement>('a[data-time]');
        const timeValue = startLink?.dataset.time;
        if (!startLink || !timeValue) return null;
        const startTime = Number.parseInt(timeValue, 10);
        if (!Number.isFinite(startTime)) return null;
        const commentInput = li.querySelector<HTMLInputElement>('input');
        const comment = commentInput?.value ?? '';
        const guid = li.dataset.guid ?? crypto.randomUUID();
        if (!li.dataset.guid) li.dataset.guid = guid;
        return { start: startTime, comment, guid };
      })
      .filter(isTimestampRecord);
  }

  function getLatestTimestampValue(): number {
    if (latestTimestampValue !== null) {
      return latestTimestampValue;
    }
    const items = getTimestampItems();
    latestTimestampValue = items.length > 0
      ? Math.max(...items.map(li => {
          const t = li.querySelector('a[data-time]')?.getAttribute('data-time');
          return t ? Number.parseInt(t, 10) : 0;
        }))
      : 0;
    return latestTimestampValue;
  }

  function invalidateLatestTimestampValue() {
    latestTimestampValue = null;
  }

  function hasNegativeTimeDifference(li: HTMLLIElement): boolean {
    const timeDiffSpan = li.querySelector<HTMLSpanElement>('.time-diff');
    if (!timeDiffSpan) return false;
    const text = timeDiffSpan.textContent?.trim() || '';
    return text.startsWith('-');
  }

  function getIndentMarker(isIndented: boolean, isLast: boolean): string {
    if (!isIndented) return "";
    return isLast ? "└─ " : "├─ ";
  }

  function extractIndentLevel(commentText: string): number {
    // Check if comment starts with indent marker (├─ or └─)
    return (commentText.startsWith("├─ ") || commentText.startsWith("└─ ")) ? 1 : 0;
  }

  function removeIndentMarker(commentText: string): string {
    return commentText.replace(/^[├└]─\s/, "");
  }

  /**
   * Determine the appropriate indent marker for a timestamp based on its position in the list.
   * @param itemIndex - The index of the timestamp to evaluate
   * @returns The marker to use when indenting: "├─ " (branch) or "└─ " (corner)
   */
  function determineIndentMarkerForIndex(itemIndex: number): string {
    const items = getTimestampItems();

    // If it's the final item or no next item exists, use └─ (corner)
    if (itemIndex >= items.length - 1) {
      return "└─ ";
    }

    // Check if next item is indented
    const nextCommentInput = items[itemIndex + 1].querySelector<HTMLInputElement>('input');
    if (!nextCommentInput) {
      return "└─ ";
    }

    const nextIsIndented = extractIndentLevel(nextCommentInput.value) === 1;

    // Use ├─ (branch) if next is indented, └─ (corner) if unindented
    return nextIsIndented ? "├─ " : "└─ ";
  }

  function updateIndentMarkers() {
    if (!list) return;
    const items = getTimestampItems();

    // Update markers based on the next item's indent state
    // We need to iterate multiple times to handle cascading changes
    let changed = true;
    let iterations = 0;
    const maxIterations = items.length; // Prevent infinite loops

    while (changed && iterations < maxIterations) {
      changed = false;
      iterations++;

      items.forEach((item, index) => {
        const commentInput = item.querySelector<HTMLInputElement>('input');
        if (!commentInput) return;

        const isIndented = extractIndentLevel(commentInput.value) === 1;
        if (!isIndented) return; // Skip non-indented items

        // Determine the marker based on what comes next
        // Default to ├─ (branch), only use └─ if next item is unindented or if this is the final item
        let isLastInSeries = false;

        if (index < items.length - 1) {
          const nextCommentInput = items[index + 1].querySelector<HTMLInputElement>('input');
          if (nextCommentInput) {
            const nextIsIndented = extractIndentLevel(nextCommentInput.value) === 1;
            // Use └─ (corner) only if next item is unindented, otherwise ├─ (branch)
            isLastInSeries = !nextIsIndented;
          }
        } else {
          // Final item in list: treat as if followed by unindented, so use └─
          isLastInSeries = true;
        }

        const cleanComment = removeIndentMarker(commentInput.value);
        const marker = getIndentMarker(true, isLastInSeries);
        const newValue = `${marker}${cleanComment}`;

        // If the marker changed, track that we made a change
        if (commentInput.value !== newValue) {
          commentInput.value = newValue;
          changed = true;
        }
      });
    }
  }

  function clearTimestampsDisplay() {
    if (!list) return;
    while (list.firstChild) { // Clear the existing timestamps
      list.removeChild(list.firstChild);
    }

    // If there's a pending fragment (timestamps built but not yet appended because the UI
    // is animating), clear it and resolve any awaiting promise so callers don't hang.
    if (pendingTimestampsFragment) {
      pendingTimestampsFragment = null;
    }
    if (pendingTimestampsResolve) {
      pendingTimestampsResolve();
      pendingTimestampsResolve = null;
      pendingTimestampsPromise = null;
    }
  }

  // Ensure that when there are no timestamps shown, a friendly placeholder appears
  function ensureEmptyPlaceholder() {
    if (!list) return;
    // If loading is in progress or we have a deferred fragment coming, don't show the empty placeholder
    if (isLoadingTimestamps || pendingTimestampsFragment) return;

    const hasNonPlaceholderItems = Array.from(list.children).some(li => {
      return !li.classList.contains('ytls-placeholder') && !li.classList.contains('ytls-error-message');
    });

    if (!hasNonPlaceholderItems) {
      showListPlaceholder('No timestamps for this video');
    }
  }

  // Display a centered placeholder message inside the timestamps list
  function showListPlaceholder(message: string) {
    if (!list) return;
    clearTimestampsDisplay();
    const li = document.createElement('li');
    li.className = 'ytls-placeholder';
    li.textContent = message;
    list.appendChild(li);
    // Disable scrolling while showing placeholder
    list.style.overflowY = 'hidden';
  }

  function clearListPlaceholder() {
    if (!list) return;
    const placeholder = list.querySelector('.ytls-placeholder');
    if (placeholder) placeholder.remove();
    list.style.overflowY = '';
  }

  function setLoadingState(loading: boolean) {
    if (!pane || !list) return;

    isLoadingTimestamps = loading;

    if (loading) {
      // Show the pane and display a placeholder message while we load timestamps
      pane.style.display = '';
      pane.classList.remove('ytls-fade-out');
      pane.classList.add('ytls-fade-in');
      showListPlaceholder('Loading timestamps...');
    } else {
      // Remove any loading placeholder and show the pane
      clearListPlaceholder();
      pane.style.display = '';
      pane.classList.remove('ytls-fade-out');
      pane.classList.add('ytls-fade-in');

      // Update CT display now that loading is done
      if (timeDisplay) {
        const playerInstance = getActivePlayer();
        if (playerInstance) {
          const rawTime = playerInstance.getCurrentTime();
          const currentSeconds = Number.isFinite(rawTime) ? Math.max(0, Math.floor(rawTime)) : Math.max(0, getLatestTimestampValue());
          const h = Math.floor(currentSeconds / 3600);
          const m = Math.floor(currentSeconds / 60) % 60;
          const s = currentSeconds % 60;

          const { isLive } = playerInstance.getVideoData() || { isLive: false };

          const timestamps = list ? getTimestampItems().map(li => {
            const timeLink = li.querySelector('a[data-time]');
            return timeLink ? parseFloat(timeLink.getAttribute('data-time') ?? "0") : 0;
          }) : [];

          let timestampDisplay = "";
          if (timestamps.length > 0) {
            if (isLive) {
              const currentTimeMinutes = Math.max(1, currentSeconds / 60);
              const liveTimestamps = timestamps.filter(time => time <= currentSeconds);
              if (liveTimestamps.length > 0) {
                const timestampsPerMin = (liveTimestamps.length / currentTimeMinutes).toFixed(2);
                if (parseFloat(timestampsPerMin) > 0) {
                  timestampDisplay = ` (${timestampsPerMin}/min)`;
                }
              }
            } else {
              const durationSeconds = playerInstance.getDuration();
              const validDuration = Number.isFinite(durationSeconds) && durationSeconds > 0
                ? durationSeconds
                : 0;
              const totalMinutes = Math.max(1, validDuration / 60);
              const timestampsPerMin = (timestamps.length / totalMinutes).toFixed(1);
              if (parseFloat(timestampsPerMin) > 0) {
                timestampDisplay = ` (${timestampsPerMin}/min)`;
              }
            }
          }

          timeDisplay.textContent = `⏳${h ? h + ":" + String(m).padStart(2, "0") : m}:${String(s).padStart(2, "0")}${timestampDisplay}`;
        }
      }
    }

    // Ensure empty placeholder is shown now that loading finished
    if (!isLoadingTimestamps && list && !list.querySelector('.ytls-error-message')) {
      ensureEmptyPlaceholder();
    }

    syncToggleButtons();
  }

  // Helper function to format timestamps based on total duration
  function isTimestampRecord(value: TimestampRecord | null | undefined): value is TimestampRecord {
    return !!value && Number.isFinite(value.start) && typeof value.comment === "string" && typeof value.guid === "string";
  }

  // Update existing calls to formatTimeString to pass only the timestamp value itself
  function formatTime(anchor: HTMLAnchorElement, timeInSeconds: number) {
    // Format the timestamp based solely on its own value.
    anchor.textContent = formatTimeString(timeInSeconds);
    anchor.dataset.time = String(timeInSeconds);
    anchor.href = buildYouTubeUrlWithTimestamp(timeInSeconds, window.location.href);
  }

  // Debounce state for seeking
  let seekTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let pendingSeekTime: number | null = null;

  let isSeeking = false;

  // Detect whether playback is behind the live edge using YouTube player internals.
  function isBehindLiveEdge(playerInstance: any): boolean {
    if (!playerInstance || typeof playerInstance.getVideoData !== "function") {
      return false;
    }
    const videoData = playerInstance.getVideoData();
    if (!videoData?.isLive) {
      return false;
    }

    // Use YouTube's progress state if available to avoid relying on the HTML5 video element.
    if (typeof playerInstance.getProgressState === "function") {
      const state = playerInstance.getProgressState();
      const liveHead = Number(state?.seekableEnd ?? state?.liveHead ?? state?.head ?? state?.duration);
      const current = Number(state?.current ?? playerInstance.getCurrentTime?.());

      if (Number.isFinite(liveHead) && Number.isFinite(current)) {
        // Consider a small threshold to avoid flicker at the edge.
        return liveHead - current > 2;
      }
    }

    return false;
  }

  function highlightNearestTimestampAtTime(currentSeconds: number, shouldScroll: boolean) {
    if (!Number.isFinite(currentSeconds)) {
      return;
    }

    const nearestLi = findNearestTimestamp(currentSeconds);
    highlightTimestamp(nearestLi, shouldScroll);
  }

  // Find and return the nearest timestamp at or before the given time
  function findNearestTimestamp(currentTime: number): HTMLLIElement | null {
    if (!Number.isFinite(currentTime)) {
      return null;
    }

    const items = getTimestampItems();
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

  // Highlight a timestamp and optionally scroll it into view
  function highlightTimestamp(li: HTMLLIElement | null, shouldScroll = false) {
    if (!li) return;

    const items = getTimestampItems();
    items.forEach(item => {
      if (!item.classList.contains(TIMESTAMP_DELETE_CLASS)) {
        item.classList.remove(TIMESTAMP_HIGHLIGHT_CLASS);
      }
    });

    if (!li.classList.contains(TIMESTAMP_DELETE_CLASS)) {
      li.classList.add(TIMESTAMP_HIGHLIGHT_CLASS);
      if (shouldScroll && !isMouseOverTimestamps) {
        li.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  function offsetAllTimestamps(delta: number): boolean {
    if (!list || list.querySelector('.ytls-error-message')) {
      return false;
    }

    if (!Number.isFinite(delta) || delta === 0) {
      return false;
    }

    const items = getTimestampItems();
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
        formatTime(anchor, newTime);
        changed = true;
      }
    });

    if (!changed) {
      return false;
    }

    updateTimeDifferences();
    updateIndentMarkers();
    updateSeekbarMarkers();
    saveTimestamps(currentLoadedVideoId);
    mostRecentlyModifiedTimestampGuid = null;
    return true;
  }

  type OffsetApplicationOptions = {
    alertOnNoChange?: boolean;
    failureMessage?: string;
    logLabel?: string;
  };

  function applyOffsetToAllTimestamps(delta: number, options: OffsetApplicationOptions = {}): boolean {
    if (!Number.isFinite(delta) || delta === 0) {
      return false;
    }

    const applied = offsetAllTimestamps(delta);
    if (!applied) {
      if (options.alertOnNoChange) {
        const message = options.failureMessage ?? "Offset did not change any timestamps.";
        alert(message);
      }
      return false;
    }

    const label = options.logLabel ?? "bulk offset";
    log(`Timestamps changed: Offset all timestamps by ${delta > 0 ? '+' : ''}${delta} seconds (${label})`);

    const player = getActivePlayer();
    const currentTime = player ? Math.floor(player.getCurrentTime()) : 0;
    if (Number.isFinite(currentTime)) {
      const nearestLi = findNearestTimestamp(currentTime);
      highlightTimestamp(nearestLi, false);
    }

    return true;
  }

  function handleClick(event: MouseEvent | TouchEvent) {
    if (!list || isLoadingTimestamps) {
      return;
    }

    const target = event.target instanceof HTMLElement ? event.target : null;
    if (!target) {
      return;
    }

    if (target.dataset.time) {
      event.preventDefault();
      const newTime = Number(target.dataset.time);
      if (Number.isFinite(newTime)) {
        isSeeking = true;
        const player = getActivePlayer();
        if (player) player.seekTo(newTime);
        setTimeout(() => { isSeeking = false; }, 500);
      }
      const clickedLi = target.closest('li') as HTMLLIElement | null;
      if (clickedLi) {
        getTimestampItems().forEach(item => {
          if (!item.classList.contains(TIMESTAMP_DELETE_CLASS)) {
            item.classList.remove(TIMESTAMP_HIGHLIGHT_CLASS);
          }
        });
        if (!clickedLi.classList.contains(TIMESTAMP_DELETE_CLASS)) {
          clickedLi.classList.add(TIMESTAMP_HIGHLIGHT_CLASS);
          clickedLi.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    } else if (target.dataset.increment) {
      event.preventDefault();

      const linkContainer = target.parentElement;
      const timeLink = linkContainer?.querySelector<HTMLAnchorElement>('a[data-time]');
      if (!timeLink || !timeLink.dataset.time) {
        return;
      }

      const currTime = parseInt(timeLink.dataset.time, 10);
      let increment = parseInt(target.dataset.increment, 10);

      const shiftPressed = 'shiftKey' in event ? event.shiftKey : false;
      if (shiftPressed) {
        increment *= configuredShiftSkip;
      }

      const altPressed = 'altKey' in event ? event.altKey : false;
      if (altPressed) {
        applyOffsetToAllTimestamps(increment, { logLabel: "Alt adjust" });
        return;
      }

      const newTime = Math.max(0, currTime + increment);
      log(`Timestamps changed: Timestamp time incremented from ${currTime} to ${newTime}`);
      formatTime(timeLink, newTime);
      invalidateLatestTimestampValue();

      // Keep the timestamp highlighted while adjusting its time
      const timestampLi = target.closest('li');

      pendingSeekTime = newTime;
      if (seekTimeoutId) {
        clearTimeout(seekTimeoutId);
      }
      isSeeking = true;
      seekTimeoutId = setTimeout(() => {
        if (pendingSeekTime !== null) {
          const player = getActivePlayer();
          if (player) player.seekTo(pendingSeekTime);
        }
        seekTimeoutId = null;
        pendingSeekTime = null;
        setTimeout(() => { isSeeking = false; }, 500);
      }, 500);

      updateTimeDifferences();
      updateIndentMarkers();
      updateSeekbarMarkers();

      // Save the modified timestamp
      if (timestampLi) {
        const tsCommentInput = timestampLi.querySelector<HTMLInputElement>('input');
        const tsGuid = timestampLi.dataset.guid;
        if (tsCommentInput && tsGuid) {
          saveSingleTimestampDirect(currentLoadedVideoId, tsGuid, newTime, tsCommentInput.value);
          mostRecentlyModifiedTimestampGuid = tsGuid;
        }
      }
    } else if (target.dataset.action === "clear") {
      event.preventDefault();
      log('Timestamps changed: All timestamps cleared from UI');
      list.textContent = "";
      invalidateLatestTimestampValue();
      updateSeekbarMarkers();
      updateScroll();
      saveTimestamps(currentLoadedVideoId, { allowEmpty: true });
      mostRecentlyModifiedTimestampGuid = null;
      // Show placeholder when the list is empty after a clear
      ensureEmptyPlaceholder();
    }
  }

  function addTimestamp(start: number, comment = "", doNotSave = false, guid: string | null = null, appendToList = true) {
    if (!list) {
      return null;
    }

    const sanitizedStart = Math.max(0, start);
    const timestampGuid = guid ?? crypto.randomUUID();

    const li = document.createElement("li");
    const timeRow = document.createElement("div");
    const minus = document.createElement("span");
    const record = document.createElement("span");
    const plus = document.createElement("span");
    const anchor = document.createElement("a");
    const timeDiff = document.createElement("span");
    const commentInput = document.createElement("input");
    const del = document.createElement("button");

    li.dataset.guid = timestampGuid;

    timeRow.className = "time-row";

    // Setup indent gutter - displays in left margin without affecting layout
    const indentGutter = document.createElement("div");
    indentGutter.style.cssText = "position:absolute;left:0;top:0;width:20px;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;";
    addTooltip(indentGutter, "Click to toggle indent");

    const indentToggle = document.createElement("span");
    indentToggle.style.cssText = "color:#999;font-size:12px;pointer-events:none;display:none;";

    // Helper function to update arrow icon based on current indent state
    const updateArrowIcon = () => {
      const currentIndent = extractIndentLevel(commentInput.value);
      indentToggle.textContent = currentIndent === 1 ? "◀" : "▶";
    };

    // Handle indent toggle on entire gutter click
    const handleIndentToggle = (e: Event) => {
      e.stopPropagation();
      const currentIndent = extractIndentLevel(commentInput.value);
      const cleanComment = removeIndentMarker(commentInput.value);
      const newIndent = currentIndent === 0 ? 1 : 0;

      // Determine marker based on list context when indenting
      let marker = "";
      if (newIndent === 1) {
        const items = getTimestampItems();
        const currentIndex = items.indexOf(li);
        marker = determineIndentMarkerForIndex(currentIndex);
      }

      commentInput.value = `${marker}${cleanComment}`;

      // Immediately update arrow icon
      updateArrowIcon();
      updateIndentMarkers();
      const currentTime = Number.parseInt(anchor.dataset.time ?? "0", 10);
      saveSingleTimestampDirect(currentLoadedVideoId, timestampGuid, currentTime, commentInput.value);
    };

    indentGutter.onclick = handleIndentToggle;
    indentGutter.append(indentToggle);

    // Add padding to li for gutter space
    li.style.cssText = "position:relative;padding-left:20px;";

    li.addEventListener("mouseenter", () => {
      // Update arrow direction based on current indent state
      updateArrowIcon();
      indentToggle.style.display = "inline";
    });

    li.addEventListener("mouseleave", () => {
      indentToggle.style.display = "none";
    });

    // Add mouseleave listener to check for negative time diff and sort if needed
    li.addEventListener("mouseleave", () => {
      // Only sort immediately if this is the most recently modified timestamp and it has a negative diff
      if (li.dataset.guid === mostRecentlyModifiedTimestampGuid && hasNegativeTimeDifference(li)) {
        sortTimestampsAndUpdateDisplay();
      }
    });

    commentInput.value = comment || "";
    commentInput.style.cssText = "width:100%;margin-top:5px;display:block;";
    commentInput.type = "text";
    commentInput.setAttribute("inputmode", "text");
    commentInput.autocapitalize = "off" as any;
    commentInput.autocomplete = "off";
    commentInput.spellcheck = false;
    commentInput.addEventListener("focusin", () => {
      suppressSortUntilRefocus = false;
    });
    // If blur occurs without recent pointer interaction and without a local focus target, restore focus
    commentInput.addEventListener("focusout", (ev) => {
      const rt = (ev as FocusEvent).relatedTarget as Element | null;
      const recentPointer = Date.now() - lastPointerDownTs < 250;
      const movingWithinPane = !!rt && !!pane && pane.contains(rt);
      if (!recentPointer && !movingWithinPane) {
        suppressSortUntilRefocus = true;
        setTimeout(() => {
          // If nothing else took focus, restore here
          if (document.activeElement === document.body || document.activeElement == null) {
            commentInput.focus({ preventScroll: true });
            suppressSortUntilRefocus = false;
          }
        }, 0);
      }
    });
    // Save on input, but avoid saving mid-composition (IME/emoji picker)
    commentInput.addEventListener("input", (ev) => {
      const ie = ev as InputEvent;
      if (ie && (ie.isComposing || ie.inputType === "insertCompositionText")) {
        return;
      }
      // Debounce comment saves with 500ms delay
      const existingTimeout = commentSaveTimeouts.get(timestampGuid);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      const timeout = setTimeout(() => {
        const currentTime = Number.parseInt(anchor.dataset.time ?? "0", 10);
        saveSingleTimestampDirect(currentLoadedVideoId, timestampGuid, currentTime, commentInput.value);
        commentSaveTimeouts.delete(timestampGuid);
      }, 500);

      commentSaveTimeouts.set(timestampGuid, timeout);
    });
    // Commit a quick save when composition ends (e.g., emoji/IME finalized)
    commentInput.addEventListener("compositionend", () => {
      const currentTime = Number.parseInt(anchor.dataset.time ?? "0", 10);
      // Let the finalized character land, then save
      setTimeout(() => {
        saveSingleTimestampDirect(currentLoadedVideoId, timestampGuid, currentTime, commentInput.value);
      }, 50);
    });

    minus.textContent = "➖";
    minus.dataset.increment = "-1";
    minus.style.cursor = "pointer";
    minus.style.margin = "0px";
    minus.addEventListener("mouseenter", () => {
      minus.style.textShadow = "0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)";
    });
    minus.addEventListener("mouseleave", () => {
      minus.style.textShadow = "none";
    });

    plus.textContent = "➕";
    plus.dataset.increment = "1";
    plus.style.cursor = "pointer";
    plus.style.margin = "0px";
    plus.addEventListener("mouseenter", () => {
      plus.style.textShadow = "0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)";
    });
    plus.addEventListener("mouseleave", () => {
      plus.style.textShadow = "none";
    });

    record.textContent = "⏺️";
    record.style.cursor = "pointer";
    record.style.margin = "0px";
    addTooltip(record, "Set to current playback time");
    record.addEventListener("mouseenter", () => {
      record.style.textShadow = "0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)";
    });
    record.addEventListener("mouseleave", () => {
      record.style.textShadow = "none";
    });
    record.onclick = () => {
      const player = getActivePlayer();
      const currentTime = player ? Math.floor(player.getCurrentTime()) : 0;
      if (Number.isFinite(currentTime)) {
        log(`Timestamps changedset to current playback time ${currentTime}`);
        formatTime(anchor, currentTime);
        updateTimeDifferences();
        updateIndentMarkers();
        saveSingleTimestampDirect(currentLoadedVideoId, timestampGuid, currentTime, commentInput.value);
        mostRecentlyModifiedTimestampGuid = timestampGuid;
      }
    };

    formatTime(anchor, sanitizedStart);
    invalidateLatestTimestampValue();

    del.textContent = "🗑️";
    del.style.cssText = "background:transparent;border:none;color:white;cursor:pointer;margin-left:5px;";
    del.addEventListener("mouseenter", () => {
      del.style.textShadow = "0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 100, 100, 0.6)";
    });
    del.addEventListener("mouseleave", () => {
      del.style.textShadow = "none";
    });
    del.onclick = () => {
      if (li.dataset.deleteConfirmed === "true") {
        log('Timestamps changed: Timestamp deleted');
        const guid = li.dataset.guid ?? '';
        li.remove();
        invalidateLatestTimestampValue();
        updateTimeDifferences();
        updateIndentMarkers();
        updateSeekbarMarkers();
        updateScroll();
        deleteSingleTimestamp(currentLoadedVideoId, guid);
        mostRecentlyModifiedTimestampGuid = null;
        // If this was the last timestamp, show the empty placeholder
        ensureEmptyPlaceholder();
      } else {
        li.dataset.deleteConfirmed = "true";
        li.classList.add(TIMESTAMP_DELETE_CLASS);
        li.classList.remove(TIMESTAMP_HIGHLIGHT_CLASS);

        // Helper function to cancel delete and restore previous state
        const doCancelDelete = () => {
          li.dataset.deleteConfirmed = "false";
          li.classList.remove(TIMESTAMP_DELETE_CLASS);
          // Restore highlight if the item should be highlighted
          const player = getActivePlayer();
          const currentTime = player ? player.getCurrentTime() : 0;
          const itemTime = Number.parseInt(li.querySelector<HTMLAnchorElement>('a[data-time]')?.dataset.time ?? "0", 10);
          if (Number.isFinite(currentTime) && Number.isFinite(itemTime) && currentTime >= itemTime) {
            li.classList.add(TIMESTAMP_HIGHLIGHT_CLASS);
          }
        };

        // Add a click listener to cancel delete if clicking anywhere except the delete button
        const cancelDeleteOnClick = (event: Event) => {
          const target = event.target as Element;
          // Only cancel if clicking on something that's not the delete button itself
          if (target !== del) {
            doCancelDelete();
            li.removeEventListener("click", cancelDeleteOnClick, true);
            document.removeEventListener("click", cancelDeleteOnClick, true);
          }
        };

        // Cancel delete if cursor leaves the full timestamp UI (the list)
        const cancelDeleteOnMouseLeave = () => {
          if (li.dataset.deleteConfirmed === "true") {
            doCancelDelete();
            if (list) {
              list.removeEventListener("mouseleave", cancelDeleteOnMouseLeave);
            }
            li.removeEventListener("click", cancelDeleteOnClick, true);
            document.removeEventListener("click", cancelDeleteOnClick, true);
          }
        };

        // Add listeners for this timestamp's li and the document
        li.addEventListener("click", cancelDeleteOnClick, true);
        document.addEventListener("click", cancelDeleteOnClick, true);
        if (list) {
          list.addEventListener("mouseleave", cancelDeleteOnMouseLeave);
        }

        setTimeout(() => {
          if (li.dataset.deleteConfirmed === "true") {
            doCancelDelete();
          }
          // Clean up listeners even if timeout expires
          li.removeEventListener("click", cancelDeleteOnClick, true);
          document.removeEventListener("click", cancelDeleteOnClick, true);
          if (list) {
            list.removeEventListener("mouseleave", cancelDeleteOnMouseLeave);
          }
        }, 5000);
      }
    };

    timeDiff.className = "time-diff";
    timeDiff.style.color = "#888";
    timeDiff.style.marginLeft = "5px";

    timeRow.append(minus, record, plus, anchor, timeDiff, del);
    li.append(indentGutter, timeRow, commentInput);

    const newTime = Number.parseInt(anchor.dataset.time ?? "0", 10);
    if (appendToList) {
      // If a placeholder is present (e.g., "No timestamps for this video"), remove it
      // immediately so the first timestamp replaces the placeholder.
      clearListPlaceholder();

      let inserted = false;
      const existingItems = getTimestampItems();

      for (let i = 0; i < existingItems.length; i++) {
        const existingLi = existingItems[i];
        const existingLink = existingLi.querySelector<HTMLAnchorElement>('a[data-time]');
        const existingTimeStr = existingLink?.dataset.time;
        if (!existingTimeStr) {
          continue;
        }
        const existingTime = Number.parseInt(existingTimeStr, 10);
        if (!Number.isFinite(existingTime)) {
          continue;
        }

        if (newTime < existingTime) {
          list.insertBefore(li, existingLi);
          inserted = true;

          const prevLi = existingItems[i - 1];
          if (prevLi) {
            const prevLink = prevLi.querySelector<HTMLAnchorElement>('a[data-time]');
            const prevTimeStr = prevLink?.dataset.time;
            if (prevTimeStr) {
              const prevTime = Number.parseInt(prevTimeStr, 10);
              if (Number.isFinite(prevTime)) {
                timeDiff.textContent = formatTimeString(newTime - prevTime);
              }
            }
          } else {
            timeDiff.textContent = "";
          }

          const nextTimeDiff = existingLi.querySelector<HTMLSpanElement>('.time-diff');
          if (nextTimeDiff) {
            nextTimeDiff.textContent = formatTimeString(existingTime - newTime);
          }
          break;
        }
      }

      if (!inserted) {
        list.appendChild(li);
        if (existingItems.length > 0) {
          const lastLi = existingItems[existingItems.length - 1];
          const lastLink = lastLi.querySelector<HTMLAnchorElement>('a[data-time]');
          const lastTimeStr = lastLink?.dataset.time;
          if (lastTimeStr) {
            const lastTime = Number.parseInt(lastTimeStr, 10);
            if (Number.isFinite(lastTime)) {
              timeDiff.textContent = formatTimeString(newTime - lastTime);
            }
          }
        }
      }

      li.scrollIntoView({ behavior: "smooth", block: "center" });

      updateScroll();
      updateIndentMarkers();
      updateSeekbarMarkers();
      if (!doNotSave) {
        saveSingleTimestampDirect(currentLoadedVideoId, timestampGuid, sanitizedStart, comment);
        mostRecentlyModifiedTimestampGuid = timestampGuid;
        // Immediately highlight the newly created timestamp
        highlightTimestamp(li, false);
      }
    } else {
      // Do not append to the live DOM yet; expose the constructed li for callers that are
      // building a fragment to append later.
      (commentInput as any).__ytls_li = li;
    }

    return commentInput;
  }

  function updateTimeDifferences() {
    if (!list || list.querySelector('.ytls-error-message')) {
      return;
    }

    const items = getTimestampItems();
    items.forEach((item, index) => {
      const timeDiffSpan = item.querySelector<HTMLSpanElement>('.time-diff');
      if (!timeDiffSpan) {
        return;
      }
      const timeLink = item.querySelector<HTMLAnchorElement>('a[data-time]');
      const currentTimeStr = timeLink?.dataset.time;
      if (!currentTimeStr) {
        timeDiffSpan.textContent = '';
        return;
      }
      const currentTime = Number.parseInt(currentTimeStr, 10);
      if (!Number.isFinite(currentTime)) {
        timeDiffSpan.textContent = '';
        return;
      }
      if (index === 0) {
        timeDiffSpan.textContent = '';
        return;
      }
      const prevItem = items[index - 1];
      const prevLink = prevItem.querySelector<HTMLAnchorElement>('a[data-time]');
      const prevTimeStr = prevLink?.dataset.time;
      if (!prevTimeStr) {
        timeDiffSpan.textContent = '';
        return;
      }
      const prevTime = Number.parseInt(prevTimeStr, 10);
      if (!Number.isFinite(prevTime)) {
        timeDiffSpan.textContent = '';
        return;
      }
      const diff = currentTime - prevTime;
      const sign = diff < 0 ? '-' : '';
      timeDiffSpan.textContent = ` ${sign}${formatTimeString(Math.abs(diff))}`;
    });
  }

  function sortTimestampsAndUpdateDisplay() {
    if (!list || list.querySelector('.ytls-error-message') || isLoadingTimestamps) {
      return;
    }

    // Capture caret/scroll for the currently focused input so we can restore after sorting
    let restoreState: { guid: string; start: number; end: number; scroll: number } | null = null;
    if (document.activeElement instanceof HTMLInputElement && list.contains(document.activeElement)) {
      const activeInput = document.activeElement as HTMLInputElement;
      const activeLi = activeInput.closest('li');
      const guid = activeLi?.dataset.guid;
      if (guid) {
        const start = activeInput.selectionStart ?? activeInput.value.length;
        const end = activeInput.selectionEnd ?? start;
        const scroll = activeInput.scrollLeft;
        restoreState = { guid, start, end, scroll };
      }
    }

    const items = getTimestampItems();
    if (items.length === 0) return; // Nothing to sort when there are no timestamps


    // Capture original order to detect if reordering occurred
    const originalOrder = items.map(li => li.dataset.guid);

    const sortedItems = items
      .map(li => {
        const timeLink = li.querySelector<HTMLAnchorElement>('a[data-time]');
        const timeValue = timeLink?.dataset.time;
        if (!timeLink || !timeValue) {
          return null;
        }
        const time = Number.parseInt(timeValue, 10);
        if (!Number.isFinite(time)) {
          return null;
        }
        const guid = li.dataset.guid ?? "";
        return { time, guid, element: li };
      })
      .filter((item): item is { time: number; guid: string; element: HTMLLIElement } => item !== null)
      .sort((a, b) => {
        const timeDiff = a.time - b.time;
        if (timeDiff !== 0) {
          return timeDiff;
        }
        return a.guid.localeCompare(b.guid);
      });

    // Check if order changed
    const newOrder = sortedItems.map(item => item.guid);
    const orderChanged = originalOrder.length !== newOrder.length ||
                        originalOrder.some((guid, idx) => guid !== newOrder[idx]);

    // Clear current list
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
    // Append sorted items
    sortedItems.forEach(item => {
      list.appendChild(item.element);
    });

    // Update all time differences
    updateTimeDifferences();
    updateIndentMarkers();

    updateSeekbarMarkers();

    // Restore focus to the previously focused input if it still exists
    if (restoreState) {
      const targetLi = getTimestampItems().find(li => li.dataset.guid === restoreState!.guid);
      const targetInput = targetLi?.querySelector<HTMLInputElement>('input');
      if (targetInput) {
        try {
          targetInput.focus({ preventScroll: true });
        } catch {
          // If focus fails, continue without breaking sort
        }
      }
    }

    // Only save if order actually changed
    if (orderChanged) {
      log('Timestamps changed: Timestamps sorted');
      saveTimestamps(currentLoadedVideoId);
    }
  }

  function updateScroll() {
    if (!list || !pane || !header || !btns) return;
    const tsCount = getTimestampItems().length;

    // Always size the list to fill the available pane height, let the resize observer
    // and recalculateTimestampsArea handle the exact maxHeight calculation.
    if (typeof (window as any).recalculateTimestampsArea === 'function') (window as any).recalculateTimestampsArea();

    // Decide whether to show a scrollbar based on content height vs available height
    const paneRect = pane.getBoundingClientRect();
    const headerRect = header.getBoundingClientRect();
    const btnsRect = btns.getBoundingClientRect();
    const available = Math.max(0, paneRect.height - (headerRect.height + btnsRect.height));

    if (tsCount === 0) {
      // If empty, show the placeholder message and hide overflow
      ensureEmptyPlaceholder();
      list.style.overflowY = 'hidden';
    } else {
      // Show scrollbar only if content exceeds available area
      list.style.overflowY = list.scrollHeight > available ? 'auto' : 'hidden';
    }
  }

  function updateSeekbarMarkers() {
    if (!list) return;
    const video = getVideoElement();
    const progressBar = document.querySelector<HTMLDivElement>(".ytp-progress-bar");
    const player = getActivePlayer();
    const videoData = player ? player.getVideoData() : null;
    const isLiveStream = !!videoData && !!videoData.isLive;

    // Skip if video isn't ready, progress bar isn't found, or if it's a live stream
    if (!video || !progressBar || !isFinite(video.duration) || isLiveStream) return;

    removeSeekbarMarkers();

    const timestamps = getTimestampItems()
      .map(li => {
        const startLink = li.querySelector<HTMLAnchorElement>('a[data-time]');
        const timeValue = startLink?.dataset.time;
        if (!startLink || !timeValue) {
          return null;
        }
        const startTime = Number.parseInt(timeValue, 10);
        if (!Number.isFinite(startTime)) {
          return null;
        }
        const commentInput = li.querySelector<HTMLInputElement>('input');
        const comment = commentInput?.value ?? "";
        const guid = li.dataset.guid ?? crypto.randomUUID();
        if (!li.dataset.guid) {
          li.dataset.guid = guid;
        }
        return { start: startTime, comment, guid };
      })
      .filter(isTimestampRecord);

    timestamps.forEach(ts => {
      if (!Number.isFinite(ts.start)) {
        return;
      }
      const marker = document.createElement("div");
      marker.className = "ytls-marker";
      marker.style.position = "absolute";
      marker.style.height = "100%";
      marker.style.width = "2px";
      marker.style.backgroundColor = "#ff0000";
      marker.style.cursor = "pointer";
      marker.style.left = (ts.start / video.duration * 100) + "%";
      marker.dataset.time = String(ts.start);
      marker.addEventListener("click", () => {
        const player = getActivePlayer();
        if (player) player.seekTo(ts.start);
      });
      progressBar.appendChild(marker);
    });
  }

  function saveTimestamps(videoId: string, options: { allowEmpty?: boolean } = {}) {
    if (!list || list.querySelector('.ytls-error-message')) return;
    if (!videoId) return;
    // Prevent saving during loading state to avoid race conditions
    if (isLoadingTimestamps) {
      log('Save blocked: timestamps are currently loading');
      return;
    }
    updateIndentMarkers();
    const currentTimestampsFromUI = extractTimestampRecords().sort((a, b) => a.start - b.start);

    // Skip saving if the list is empty, unless explicitly allowed (e.g., user cleared all timestamps)
    if (currentTimestampsFromUI.length === 0 && !options.allowEmpty) {
      log('Save skipped: no timestamps to save');
      return;
    }

    saveToIndexedDB(videoId, currentTimestampsFromUI)
      .then(() => log(`Successfully saved ${currentTimestampsFromUI.length} timestamps for ${videoId} to IndexedDB`))
      .catch(err => log(`Failed to save timestamps for ${videoId} to IndexedDB:`, err, 'error'));
    safePostMessage({ type: 'timestamps_updated', videoId: videoId, action: 'saved' });
  }





  function saveSingleTimestampDirect(videoId: string | null | undefined, guid: string, start: number, comment: string) {
    if (!videoId || isLoadingTimestamps) return;

    const timestamp: TimestampRecord = { guid, start, comment };
    log(`Saving timestamp: guid=${guid}, start=${start}, comment="${comment}"`);

    saveSingleTimestampToIndexedDB(videoId, timestamp)
      .catch(err => log(`Failed to save timestamp ${guid}:`, err, 'error'));

    safePostMessage({ type: 'timestamps_updated', videoId: videoId, action: 'saved' });
  }

  function deleteSingleTimestamp(videoId: string | null | undefined, guid: string) {
    if (!videoId || isLoadingTimestamps) return;

    log(`Deleting timestamp: guid=${guid}`);
    deleteSingleTimestampFromIndexedDB(videoId, guid)
      .catch(err => log(`Failed to delete timestamp ${guid}:`, err, 'error'));

    safePostMessage({ type: 'timestamps_updated', videoId: videoId, action: 'saved' });
  }

  async function saveTimestampsAs(format) {
    if (!list || list.querySelector('.ytls-error-message')) {
      alert("Cannot export timestamps while displaying an error message.");
      return;
    }
    const videoId = currentLoadedVideoId;
    if (!videoId) return;
    log(`Exporting timestamps for video ID: ${videoId}`);
    const timestamps = extractTimestampRecords();
    const videoDuration = Math.max(getLatestTimestampValue(), 0);
    const timestampSuffix = getTimestampSuffix();
    if (format === "json") {
      const blob = new Blob([JSON.stringify(timestamps, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `timestamps-${videoId}-${timestampSuffix}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "text") {
      const plainText = timestamps.map(ts => {
        const timeString = formatTimeString(ts.start, videoDuration);
        const commentWithGuid = `${ts.comment} <!-- guid:${ts.guid} -->`.trimStart();
        return `${timeString} ${commentWithGuid}`;
      }).join("\n");
      const blob = new Blob([plainText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `timestamps-${videoId}-${timestampSuffix}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  function displayPaneError(message) {
    if (!pane || !list) {
      log("Timekeeper error:", message, 'error');
      return;
    }

    clearTimestampsDisplay();

    const errorItem = document.createElement("li");
    errorItem.textContent = message;
    errorItem.classList.add("ytls-error-message");
    errorItem.style.color = "#ff6b6b";
    errorItem.style.fontWeight = "bold";
    errorItem.style.padding = "8px";
    errorItem.style.background = "rgba(255, 0, 0, 0.1)";

    list.appendChild(errorItem);
    updateSeekbarMarkers();
  }

  function removeSeekbarMarkers() {
    document.querySelectorAll(".ytls-marker").forEach(marker => marker.remove());
  }

  function clampPaneToViewport() {
    if (!pane || !document.body.contains(pane)) return;

    const rect = pane.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const paneWidth = rect.width;
    const paneHeight = rect.height;

    if (rect.left < 0) {
      pane.style.left = "0";
      pane.style.right = "auto";
    }

    if (rect.right > viewportWidth) {
      const adjustedLeft = Math.max(0, viewportWidth - paneWidth);
      pane.style.left = `${adjustedLeft}px`;
      pane.style.right = "auto";
    }

    if (rect.top < 0) {
      pane.style.top = "0";
      pane.style.bottom = "auto";
    }

    if (rect.bottom > viewportHeight) {
      const adjustedTop = Math.max(0, viewportHeight - paneHeight);
      pane.style.top = `${adjustedTop}px`;
      pane.style.bottom = "auto";
    }
  }

  function removeAllEventListeners() {
    // Remove document listeners
    if (documentMousemoveHandler) {
      document.removeEventListener("mousemove", documentMousemoveHandler);
      documentMousemoveHandler = null;
    }
    if (documentMouseupHandler) {
      document.removeEventListener("mouseup", documentMouseupHandler);
      documentMouseupHandler = null;
    }
    if (keydownHandler) {
      document.removeEventListener("keydown", keydownHandler);
      keydownHandler = null;
    }
    if (windowResizeHandler) {
      window.removeEventListener("resize", windowResizeHandler);
      windowResizeHandler = null;
    }
    if (docPointerDownHandler) {
      document.removeEventListener("pointerdown", docPointerDownHandler, true);
      docPointerDownHandler = null;
    }
    if (docPointerUpHandler) {
      document.removeEventListener("pointerup", docPointerUpHandler, true);
      docPointerUpHandler = null;
    }

    // Remove video listeners
    const video = getVideoElement();
    if (video) {
      if (videoTimeupdateHandler) {
        video.removeEventListener("timeupdate", videoTimeupdateHandler);
        videoTimeupdateHandler = null;
      }
      if (videoPauseHandler) {
        video.removeEventListener("pause", videoPauseHandler);
        videoPauseHandler = null;
      }
      if (videoPlayHandler) {
        video.removeEventListener("play", videoPlayHandler);
        videoPlayHandler = null;
      }
      if (videoSeekingHandler) {
        video.removeEventListener("seeking", videoSeekingHandler);
        videoSeekingHandler = null;
      }
    }
  }

  function unloadTimekeeper() {
    removeSeekbarMarkers();

    // Clear all pending comment saves
    commentSaveTimeouts.forEach(timeout => clearTimeout(timeout));
    commentSaveTimeouts.clear();

    if (loadTimeoutId) {
      clearTimeout(loadTimeoutId);
      loadTimeoutId = null;
    }
    if (timeUpdateIntervalId) {
      clearInterval(timeUpdateIntervalId);
      timeUpdateIntervalId = null;
    }
    if (visibilityAnimationTimeoutId) {
      clearTimeout(visibilityAnimationTimeoutId);
      visibilityAnimationTimeoutId = null;
    }



    // Remove all event listeners to prevent memory leaks
    removeAllEventListeners();

    // Close the BroadcastChannel to prevent memory leaks
    try {
      channel.close();
    } catch (err) {
      // Channel may already be closed
    }

    if (settingsModalInstance && settingsModalInstance.parentNode === document.body) {
      document.body.removeChild(settingsModalInstance);
    }
    settingsModalInstance = null;
    settingsCogButtonElement = null;
    isMouseOverTimestamps = false;
    currentLoadedVideoId = null;




    if (pane && pane.parentNode) {
      pane.remove();
    }

    const headerButton = document.getElementById("ytls-header-button");
    if (headerButton && headerButton.parentNode) {
      headerButton.remove();
    }
    headerButtonImage = null;
    isHeaderButtonHovered = false;
    lastSavedPanePosition = null;

    clearTimestampsDisplay();
    pane = null;
    header = null;
    list = null;
    btns = null;
    timeDisplay = null;
    style = null;
    versionDisplay = null;

    lastValidatedPlayer = null;
  }

  async function validatePlayerAndVideoId() {
    const videoId = getVideoId();
    if (!videoId) {
      lastValidatedPlayer = null;
      return {
        ok: false,
        message: "Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."
      };
    }

    const playerInstance = await waitForPlayerWithMethods();
    if (!hasRequiredPlayerMethods(playerInstance)) {
      const missingMethods = missingPlayerMethods(playerInstance);
      const missingDetail = missingMethods.length ? ` Missing methods: ${missingMethods.join(", ")}.` : "";
      const baseMessage = playerInstance
        ? "Timekeeper cannot access the YouTube player API."
        : "Timekeeper cannot find the YouTube player on this page.";
      lastValidatedPlayer = null;
      return {
        ok: false,
        message: `${baseMessage}${missingDetail} Try refreshing once playback is ready.`
      };
    }

    lastValidatedPlayer = playerInstance;

    return {
      ok: true,
      player: playerInstance,
      videoId
    };
  }

  async function loadTimestamps() {
    if (!pane || !list) {
      return;
    }
    const previousScrollTop = list.scrollTop;
    let shouldRestoreScroll = true;
    const restoreScrollPosition = () => {
      if (!list || !shouldRestoreScroll) return;
      const maxScrollTop = Math.max(0, list.scrollHeight - list.clientHeight);
      list.scrollTop = Math.min(previousScrollTop, maxScrollTop);
    };
    try {
      const validation = await validatePlayerAndVideoId();
      if (!validation.ok) {
        displayPaneError(validation.message);
        clearTimestampsDisplay();
        updateSeekbarMarkers();
        return;
      }

      const { videoId } = validation;



      let finalTimestampsToDisplay = [];

      try {
        const dbTimestamps = await loadFromIndexedDB(videoId);
        if (dbTimestamps) {
          // Ensure all timestamps from DB have GUIDs
          finalTimestampsToDisplay = dbTimestamps.map(ts => ({
            ...ts,
            guid: ts.guid || crypto.randomUUID()
          }));
          log(`Loaded ${finalTimestampsToDisplay.length} timestamps from IndexedDB for ${videoId}`);
        } else {
          log(`No timestamps found in IndexedDB for ${videoId}`);
        }
      } catch (dbError) {
        log(`Failed to load timestamps from IndexedDB for ${videoId}:`, dbError, 'error');
        displayPaneError("Failed to load timestamps from IndexedDB. Try refreshing the page.");
        updateSeekbarMarkers();
        return;
      }

      if (finalTimestampsToDisplay.length > 0) {
        finalTimestampsToDisplay.sort((a, b) => a.start - b.start); // Sort by start time
        clearTimestampsDisplay();
        clearListPlaceholder();

        // Build as a document fragment so we can defer appending to the live DOM
        // while show animations are running.
        const frag = document.createDocumentFragment();
        finalTimestampsToDisplay.forEach(ts => {
          // Construct LI without appending to the live list
          const input = addTimestamp(ts.start, ts.comment, true, ts.guid, false);
          const li = (input as any).__ytls_li as HTMLLIElement | undefined;
          if (li) frag.appendChild(li);
        });

        // If showing animation is running, defer appending until animation completes
        const isShowingAnimation = pane && pane.classList.contains('ytls-zoom-in') && visibilitySizingTimeoutId != null;
        if (isShowingAnimation) {
          log('Deferring timestamp DOM append until show animation completes');
          pendingTimestampsFragment = frag;
          if (!pendingTimestampsPromise) {
            pendingTimestampsPromise = new Promise<void>((resolve) => { pendingTimestampsResolve = resolve; });
          }
          // Wait until the fragment is appended by the visibility timeout handler
          await pendingTimestampsPromise;
        } else {
          // Append immediately
          if (list) {
            list.appendChild(frag);
            updateIndentMarkers();
            updateSeekbarMarkers();
            // Ensure scroll area is recalculated after DOM updates
            if (typeof (window as any).recalculateTimestampsArea === 'function') {
              requestAnimationFrame(() => (window as any).recalculateTimestampsArea());
            }
          }
        }

        const playerForHighlight = getActivePlayer();
        const currentTimeForHighlight = playerForHighlight
          ? Math.floor(playerForHighlight.getCurrentTime())
          : getLatestTimestampValue();
        if (Number.isFinite(currentTimeForHighlight)) {
          highlightNearestTimestampAtTime(currentTimeForHighlight, false);
          shouldRestoreScroll = false;
        }
      } else {
        clearTimestampsDisplay(); // Ensure UI is cleared if no timestamps are found
        showListPlaceholder('No timestamps for this video');
        updateSeekbarMarkers(); // Ensure seekbar markers are cleared
        // Still recalculate area in case list is now empty
        if (typeof (window as any).recalculateTimestampsArea === 'function') {
          requestAnimationFrame(() => (window as any).recalculateTimestampsArea());
        }
      }
    } catch (err) {
      log("Unexpected error while loading timestamps:", err, 'error');
      displayPaneError("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.");
    } finally {
      // If timestamps were deferred for animation, wait until they're appended before restoring scroll
      if (pendingTimestampsPromise) {
        await pendingTimestampsPromise;
      }
      requestAnimationFrame(restoreScrollPosition);
      // Ensure scroll area is recalculated after loading timestamps
      if (typeof (window as any).recalculateTimestampsArea === 'function') {
        requestAnimationFrame(() => (window as any).recalculateTimestampsArea());
      }
      // If there is no error being shown, ensure a friendly placeholder appears when the list is empty
      if (list && !list.querySelector('.ytls-error-message')) {
        ensureEmptyPlaceholder();
      }
    }
  }

  function getVideoId() {
    // Try to get the video ID from the URL first
    const urlParams = new URLSearchParams(location.search);
    const videoId = urlParams.get("v");
    if (videoId) {
      return videoId; // Return the video ID if found in the URL
    }

    // Fallback to the clip method using the meta property
    const clipIdMeta = document.querySelector<HTMLMetaElement>('meta[itemprop="identifier"]');
    if (clipIdMeta?.content) {
      return clipIdMeta.content; // Return the clip identifier if available
    }

    // Return null if no video ID or clip identifier is found
    return null;
  }





  function setupVideoEventListeners() {
    const video = getVideoElement();
    if (!video) return;

    // Handler for timeupdate: always highlight the nearest timestamp
    const handleTimeUpdate = () => {
      if (!list) return;

      const player = getActivePlayer();
      const currentTime = player ? Math.floor(player.getCurrentTime()) : 0;
      if (!Number.isFinite(currentTime)) return;

      const nearestLi = findNearestTimestamp(currentTime);
      highlightTimestamp(nearestLi, false);
    };

    // Helper function to update URL t parameter
    const updateUrlTimeParam = (seconds: number | null) => {
      try {
        const url = new URL(window.location.href);
        if (seconds !== null && Number.isFinite(seconds)) {
          url.searchParams.set('t', `${Math.floor(seconds)}s`);
        } else {
          url.searchParams.delete('t');
        }
        window.history.replaceState({}, '', url.toString());
      } catch (err) {
        // Silently fail if URL manipulation doesn't work
      }
    };

    // Handler for pause: add t parameter with current time
    const handlePause = () => {
      const player = getActivePlayer();
      const currentTime = player ? Math.floor(player.getCurrentTime()) : 0;
      if (Number.isFinite(currentTime)) {
        updateUrlTimeParam(currentTime);
      }
    };

    // Handler for play: remove t parameter
    const handlePlay = () => {
      updateUrlTimeParam(null);
    };

    // Handler for seeking: highlight immediately on seek
    const handleSeeking = () => {
      const video = getVideoElement();
      if (!video) return;

      const player = getActivePlayer();
      const currentTime = player ? Math.floor(player.getCurrentTime()) : 0;
      if (!Number.isFinite(currentTime)) return;

      // Update URL when paused
      if (video.paused) {
        updateUrlTimeParam(currentTime);
      }

      // Always highlight immediately on seek, regardless of pause state
      const nearestLi = findNearestTimestamp(currentTime);
      highlightTimestamp(nearestLi, true);
    };

    // Store handlers for cleanup
    videoTimeupdateHandler = handleTimeUpdate;
    videoPauseHandler = handlePause;
    videoPlayHandler = handlePlay;
    videoSeekingHandler = handleSeeking;

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("pause", handlePause);
    video.addEventListener("play", handlePlay);
    video.addEventListener("seeking", handleSeeking);
  }

  // === IndexedDB Helper Functions ===
  const DB_NAME = 'ytls-timestamps-db';
  const DB_VERSION = 3;
  const STORE_NAME = 'timestamps';
  const STORE_NAME_V2 = 'timestamps_v2';
  const SETTINGS_STORE_NAME = 'settings';

  // Persistent database connection
  let dbConnection: IDBDatabase | null = null;
  let dbConnectionPromise: Promise<IDBDatabase> | null = null;

  // Get or create the database connection
  function getDB(): Promise<IDBDatabase> {
    // If we have a valid connection, return it
    if (dbConnection) {
      try {
        // Verify the connection is actually usable by checking objectStoreNames
        // This will throw if the connection is closed
        const isValid = dbConnection.objectStoreNames.length >= 0;
        if (isValid) {
          return Promise.resolve(dbConnection);
        }
      } catch (err) {
        // Connection is closed/invalid, clear it
        log('IndexedDB connection is no longer usable:', err, 'warn');
        dbConnection = null;
      }
    }

    // If a connection is already being established, return that promise
    if (dbConnectionPromise) {
      return dbConnectionPromise;
    }

    // Create a new connection
    dbConnectionPromise = openIndexedDB().then(db => {
      dbConnection = db;
      dbConnectionPromise = null;

      // Handle unexpected closes
      db.onclose = () => {
        log('IndexedDB connection closed unexpectedly', 'warn');
        dbConnection = null;
      };

      db.onerror = (event) => {
        log('IndexedDB connection error:', event, 'error');
      };

      return db;
    }).catch(err => {
      dbConnectionPromise = null;
      throw err;
    });

    return dbConnectionPromise;
  }

  // Build export JSON and filename for all timestamps
  async function buildExportPayload(): Promise<{ json: string; filename: string; totalVideos: number; totalTimestamps: number }> {
    const exportData = {} as Record<string, unknown>;

    // Get all timestamps from v2 store
    const allTimestamps = await getAllFromIndexedDB(STORE_NAME_V2);

    // Group timestamps by video_id
    const videoGroups = new Map<string, TimestampRecord[]>();
    for (const record of allTimestamps) {
      const ts = record as { guid: string; video_id: string; start: number; comment: string };
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
    return { json, filename, totalVideos: videoGroups.size, totalTimestamps: allTimestamps.length };
  }

  // Standalone export function to export all timestamps to a local file
  async function exportAllTimestamps(): Promise<void> {
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

  function openIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;
        const oldVersion = event.oldVersion;
        const transaction = (event.target as IDBOpenDBRequest).transaction!;

        // Version 1: Create initial timestamps store
        if (oldVersion < 1) {
          db.createObjectStore(STORE_NAME, { keyPath: 'video_id' });
        }

        // Version 2: Create settings store
        if (oldVersion < 2 && !db.objectStoreNames.contains(SETTINGS_STORE_NAME)) {
          db.createObjectStore(SETTINGS_STORE_NAME, { keyPath: 'key' });
        }

        // Version 3: Migrate from timestamps to timestamps_v2 and delete old store
        if (oldVersion < 3) {
          // Export backup before migration
          if (db.objectStoreNames.contains(STORE_NAME)) {
            log('Exporting backup before v2 migration...');
            const v1Store = transaction.objectStore(STORE_NAME);
            const exportRequest = v1Store.getAll();

            exportRequest.onsuccess = () => {
              const v1Records = exportRequest.result as Array<{
                video_id: string;
                timestamps: TimestampRecord[];
              }>;

              if (v1Records.length > 0) {
                try {
                  const exportData = {} as Record<string, unknown>;
                  let totalTimestamps = 0;

                  v1Records.forEach(record => {
                    if (Array.isArray(record.timestamps) && record.timestamps.length > 0) {
                      const timestampsWithGuids = record.timestamps.map(ts => ({
                        guid: ts.guid || crypto.randomUUID(),
                        start: ts.start,
                        comment: ts.comment
                      }));

                      exportData[`ytls-${record.video_id}`] = {
                        video_id: record.video_id,
                        timestamps: timestampsWithGuids.sort((a, b) => a.start - b.start)
                      };
                      totalTimestamps += timestampsWithGuids.length;
                    }
                  });

                  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `timekeeper-data-${getTimestampSuffix()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);

                  log(`Pre-migration backup exported: ${v1Records.length} videos, ${totalTimestamps} timestamps`);
                } catch (err) {
                  log('Failed to export pre-migration backup:', err, 'error');
                }
              }
            };
          }

          // Create v2 store with new structure: guid -> {guid, video_id, start, comment}
          const v2Store = db.createObjectStore(STORE_NAME_V2, { keyPath: 'guid' });
          v2Store.createIndex('video_id', 'video_id', { unique: false });
          v2Store.createIndex('video_start', ['video_id', 'start'], { unique: false });

          // Migrate data from v1 to v2 if v1 exists
          if (db.objectStoreNames.contains(STORE_NAME)) {
            const v1Store = transaction.objectStore(STORE_NAME);
            const getAllRequest = v1Store.getAll();

            getAllRequest.onsuccess = () => {
              const v1Records = getAllRequest.result as Array<{
                video_id: string;
                timestamps: TimestampRecord[];
              }>;

              if (v1Records.length > 0) {
                let totalMigrated = 0;
                v1Records.forEach(record => {
                  if (Array.isArray(record.timestamps) && record.timestamps.length > 0) {
                    record.timestamps.forEach(ts => {
                      v2Store.put({
                        guid: ts.guid || crypto.randomUUID(),
                        video_id: record.video_id,
                        start: ts.start,
                        comment: ts.comment
                      });
                      totalMigrated++;
                    });
                  }
                });
                log(`Migrated ${totalMigrated} timestamps from ${v1Records.length} videos to v2 store`);
              }
            };

            // Delete the old store after migration
            db.deleteObjectStore(STORE_NAME);
            log('Deleted old timestamps store after migration to v2');
          }
        }
      };
      request.onsuccess = event => {
        resolve((event.target as IDBOpenDBRequest).result);
      };
      request.onerror = event => {
        const error = (event.target as IDBOpenDBRequest).error;
        reject(error ?? new Error('Failed to open IndexedDB'));
      };
    });
  }

  // Helper to execute a transaction with error handling
  function executeTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T> | void
  ): Promise<T | undefined> {
    return getDB().then(db => {
      return new Promise<T | undefined>((resolve, reject) => {
        let tx: IDBTransaction;
        try {
          tx = db.transaction(storeName, mode);
        } catch (err) {
          reject(new Error(`Failed to create transaction for ${storeName}: ${err}`));
          return;
        }

        const store = tx.objectStore(storeName);
        let request: IDBRequest<T> | undefined;

        try {
          request = operation(store) as IDBRequest<T> | undefined;
        } catch (err) {
          reject(new Error(`Failed to execute operation on ${storeName}: ${err}`));
          return;
        }

        if (request) {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error ?? new Error(`IndexedDB ${mode} operation failed`));
        }

        tx.oncomplete = () => {
          if (!request) resolve(undefined);
        };
        tx.onerror = () => reject(tx.error ?? new Error(`IndexedDB transaction failed`));
        tx.onabort = () => reject(tx.error ?? new Error(`IndexedDB transaction aborted`));
      });
    });
  }

  function saveToIndexedDB(videoId: string, data: TimestampRecord[]): Promise<void> {
    // Save to v2 store only
    return getDB().then(db => {
      return new Promise<void>((resolve, reject) => {
        let tx: IDBTransaction;
        try {
          tx = db.transaction([STORE_NAME_V2], 'readwrite');
        } catch (err) {
          reject(new Error(`Failed to create transaction: ${err}`));
          return;
        }

        const v2Store = tx.objectStore(STORE_NAME_V2);
        const v2Index = v2Store.index('video_id');

        // Get existing records for this video
        const getRequest = v2Index.getAll(IDBKeyRange.only(videoId));

        getRequest.onsuccess = () => {
          try {
            const existingRecords = getRequest.result as Array<{guid: string}>;
            const newGuids = new Set(data.map(ts => ts.guid));

            // Delete removed timestamps
            existingRecords.forEach(record => {
              if (!newGuids.has(record.guid)) {
                v2Store.delete(record.guid);
              }
            });

            // Add/update timestamps
            data.forEach(ts => {
              v2Store.put({
                guid: ts.guid,
                video_id: videoId,
                start: ts.start,
                comment: ts.comment
              });
            });
          } catch (err) {
            log('Error during save operation:', err, 'error');
            // Let the transaction abort handler catch this
          }
        };

        getRequest.onerror = () => {
          reject(getRequest.error ?? new Error('Failed to get existing records'));
        };

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error ?? new Error('Failed to save to IndexedDB'));
        tx.onabort = () => reject(tx.error ?? new Error('Transaction aborted during save'));
      });
    });
  }

  function saveSingleTimestampToIndexedDB(videoId: string, timestamp: TimestampRecord): Promise<void> {
    // Save single timestamp to v2 store only
    return getDB().then(db => {
      return new Promise<void>((resolve, reject) => {
        let tx: IDBTransaction;
        try {
          tx = db.transaction([STORE_NAME_V2], 'readwrite');
        } catch (err) {
          reject(new Error(`Failed to create transaction: ${err}`));
          return;
        }

        // Write to v2 store (individual record)
        const v2Store = tx.objectStore(STORE_NAME_V2);
        const putRequest = v2Store.put({
          guid: timestamp.guid,
          video_id: videoId,
          start: timestamp.start,
          comment: timestamp.comment
        });

        putRequest.onerror = () => {
          reject(putRequest.error ?? new Error('Failed to put timestamp'));
        };

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error ?? new Error('Failed to save single timestamp to IndexedDB'));
        tx.onabort = () => reject(tx.error ?? new Error('Transaction aborted during single timestamp save'));
      });
    });
  }

  function deleteSingleTimestampFromIndexedDB(videoId: string, guid: string): Promise<void> {
    // Delete single timestamp from v2 store only
    log(`Deleting timestamp ${guid} for video ${videoId}`);
    return getDB().then(db => {
      return new Promise<void>((resolve, reject) => {
        let tx: IDBTransaction;
        try {
          tx = db.transaction([STORE_NAME_V2], 'readwrite');
        } catch (err) {
          reject(new Error(`Failed to create transaction: ${err}`));
          return;
        }

        // Delete from v2 store
        const v2Store = tx.objectStore(STORE_NAME_V2);
        const deleteRequest = v2Store.delete(guid);

        deleteRequest.onerror = () => {
          reject(deleteRequest.error ?? new Error('Failed to delete timestamp'));
        };

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error ?? new Error('Failed to delete single timestamp from IndexedDB'));
        tx.onabort = () => reject(tx.error ?? new Error('Transaction aborted during timestamp deletion'));
      });
    });
  }

  function loadFromIndexedDB(videoId: string): Promise<TimestampRecord[] | null> {
    // Load from v2 store only
    return getDB().then(db => {
      return new Promise<TimestampRecord[] | null>((resolve) => {
        let tx: IDBTransaction;
        try {
          tx = db.transaction([STORE_NAME_V2], 'readonly');
        } catch (err) {
          log('Failed to create read transaction:', err, 'warn');
          resolve(null);
          return;
        }

        const v2Store = tx.objectStore(STORE_NAME_V2);
        const v2Index = v2Store.index('video_id');

        const v2Request = v2Index.getAll(IDBKeyRange.only(videoId));

        v2Request.onsuccess = () => {
          const v2Records = v2Request.result as Array<{guid: string; video_id: string; start: number; comment: string}>;

          if (v2Records.length > 0) {
            // Found data in v2 store
            const timestamps = v2Records.map(r => ({
              guid: r.guid,
              start: r.start,
              comment: r.comment
            })).sort((a, b) => a.start - b.start);
            resolve(timestamps);
          } else {
            // No data found
            resolve(null);
          }
        };

        v2Request.onerror = () => {
          log('Failed to load timestamps:', v2Request.error, 'warn');
          resolve(null);
        };

        tx.onabort = () => {
          log('Transaction aborted during load:', tx.error, 'warn');
          resolve(null);
        };
      });
    });
  }

  function removeFromIndexedDB(videoId: string): Promise<void> {
    // Remove all timestamps for a video from v2 store
    return getDB().then(db => {
      return new Promise<void>((resolve, reject) => {
        let tx: IDBTransaction;
        try {
          tx = db.transaction([STORE_NAME_V2], 'readwrite');
        } catch (err) {
          reject(new Error(`Failed to create transaction: ${err}`));
          return;
        }

        const v2Store = tx.objectStore(STORE_NAME_V2);
        const v2Index = v2Store.index('video_id');
        const getRequest = v2Index.getAll(IDBKeyRange.only(videoId));

        getRequest.onsuccess = () => {
          try {
            const records = getRequest.result as Array<{guid: string}>;
            records.forEach(record => {
              v2Store.delete(record.guid);
            });
          } catch (err) {
            log('Error during remove operation:', err, 'error');
          }
        };

        getRequest.onerror = () => {
          reject(getRequest.error ?? new Error('Failed to get records for removal'));
        };

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error ?? new Error('Failed to remove timestamps'));
        tx.onabort = () => reject(tx.error ?? new Error('Transaction aborted during timestamp removal'));
      });
    });
  }

  function getAllFromIndexedDB(storeName: string): Promise<unknown[]> {
    return executeTransaction(storeName, 'readonly', (store) => {
      return store.getAll();
    }).then(result => {
      return Array.isArray(result) ? result : [];
    });
  }



  function saveGlobalSettings(key: string, value: unknown) {
    executeTransaction(SETTINGS_STORE_NAME, 'readwrite', (store) => {
      store.put({ key, value });
    }).catch(err => {
      log(`Failed to save setting '${key}' to IndexedDB:`, err, 'error');
    });
  }

  function loadGlobalSettings(key: string): Promise<unknown> {
    return executeTransaction(SETTINGS_STORE_NAME, 'readonly', (store) => {
      return store.get(key);
    }).then(result => {
      return (result as { value?: unknown } | undefined)?.value;
    }).catch(err => {
      log(`Failed to load setting '${key}' from IndexedDB:`, err, 'error');
      return undefined;
    });
  }




  function saveUIVisibilityState() {
    if (!pane) return;

    const isVisible = pane.style.display !== "none";
    saveGlobalSettings('uiVisible', isVisible);
  }

  function syncToggleButtons(visibilityOverride?: boolean) {
    const isVisible = typeof visibilityOverride === "boolean"
      ? visibilityOverride
      : (!!pane && pane.style.display !== "none");

    const headerButton = document.getElementById("ytls-header-button");
    if (headerButton instanceof HTMLButtonElement) {
      headerButton.setAttribute("aria-pressed", String(isVisible));
    }

    if (headerButtonImage && !isHeaderButtonHovered) {
      if (headerButtonImage.src !== HEADER_ICON_DEFAULT_URL) {
        headerButtonImage.src = HEADER_ICON_DEFAULT_URL;
      }
    }
  }

  function loadUIVisibilityState() {
    if (!pane) return;

    loadGlobalSettings('uiVisible').then(value => {
      const isVisible = value as boolean | undefined;
      if (typeof isVisible === 'boolean') {
        if (isVisible) {
          pane.style.display = "flex";
          // Apply zoom-in animation when showing initially
          pane.classList.remove("ytls-zoom-out");
          pane.classList.add("ytls-zoom-in");
        } else {
          pane.style.display = "none";
        }
        syncToggleButtons(isVisible);
      } else {
        // Default to visible if not found
        pane.style.display = "flex";
        // Apply zoom-in animation when showing initially
        pane.classList.remove("ytls-zoom-out");
        pane.classList.add("ytls-zoom-in");
        syncToggleButtons(true);
      }
    }).catch(err => {
      log("Failed to load UI visibility state:", err, 'error');
      // Default to visible on error
      pane.style.display = "flex";
      // Apply zoom-in animation when showing initially
      pane.classList.remove("ytls-zoom-out");
      pane.classList.add("ytls-zoom-in");
      syncToggleButtons(true);
    });
  }

  function togglePaneVisibility(force?: boolean) {
    if (!pane) {
      log('ERROR: togglePaneVisibility called but pane is null');
      return;
    }

    // If pane is not in DOM, append it before toggling
    if (!document.body.contains(pane)) {
      log('Pane not in DOM during toggle, appending it');
      // Remove any stray panes first
      document.querySelectorAll("#ytls-pane").forEach(el => {
        if (el !== pane) el.remove();
      });
      document.body.appendChild(pane);
    }

    // Verify no duplicate panes exist
    const allPanes = document.querySelectorAll("#ytls-pane");
    if (allPanes.length > 1) {
      log(`ERROR: Multiple panes detected in togglePaneVisibility (${allPanes.length}), cleaning up`);
      allPanes.forEach((el) => {
        if (el !== pane) el.remove();
      });
    }

    if (visibilityAnimationTimeoutId) {
      clearTimeout(visibilityAnimationTimeoutId);
      visibilityAnimationTimeoutId = null;
    }

    const isHidden = pane.style.display === "none";
    const shouldShow = typeof force === "boolean" ? force : isHidden;

    if (shouldShow) {
      pane.style.display = "flex";
      pane.classList.remove("ytls-fade-out");
      pane.classList.remove("ytls-zoom-out");
      pane.classList.add("ytls-zoom-in");
      syncToggleButtons(true);
      saveUIVisibilityState();
      // Hide timestamps until the show animation completes and schedule final sizing
      startShowAnimation();
      if (visibilitySizingTimeoutId) {
        clearTimeout(visibilitySizingTimeoutId);
        visibilitySizingTimeoutId = null;
      }
      visibilitySizingTimeoutId = setTimeout(() => {
        // If timestamps were deferred while animating, append them first so sizing sees them
        appendPendingTimestamps();
        if (typeof (window as any).recalculateTimestampsArea === 'function') (window as any).recalculateTimestampsArea();
        ensureMinPaneHeight();
        clampAndSavePanePosition(true);
        visibilitySizingTimeoutId = null;
      }, 450);
    } else {
      pane.classList.remove("ytls-fade-in");
      pane.classList.remove("ytls-zoom-in");
      pane.classList.add("ytls-zoom-out");
      syncToggleButtons(false);
      // Start hide animation (append any deferred timestamps hidden, cancel finalizer, and schedule hide)
      startHideAnimation();
      // Clear any scheduled sizing followups when hiding (startHideAnimation handles it)
    }
  }

  function processImportedData(contentString) {
    if (!list) {
      log("UI is not initialized; cannot import timestamps.", 'warn');
      return;
    }
    let processedSuccessfully = false;
    // Try parsing as JSON first
    try {
      const parsed = JSON.parse(contentString);
      let timestamps = null;

      // Check if it's a direct array of timestamps
      if (Array.isArray(parsed)) {
        timestamps = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        // Check if it's the full export format with ytls- keys
        const currentVideoId = currentLoadedVideoId;
        if (currentVideoId) {
          const key = `timekeeper-${currentVideoId}`;
          if (parsed[key] && Array.isArray(parsed[key].timestamps)) {
            timestamps = parsed[key].timestamps;
            log(`Found timestamps for current video (${currentVideoId}) in export format`, 'info');
          }
        }

        // If we didn't find a matching video, check if there's only one video in the export
        if (!timestamps) {
          const keys = Object.keys(parsed).filter(k => k.startsWith('ytls-'));
          if (keys.length === 1 && Array.isArray(parsed[keys[0]].timestamps)) {
            timestamps = parsed[keys[0]].timestamps;
            const videoId = parsed[keys[0]].video_id;
            log(`Found timestamps for video ${videoId} in export format`, 'info');
          }
        }
      }

      if (timestamps && Array.isArray(timestamps)) {
        // Check if all items are valid timestamp objects
        const isValidJsonData = timestamps.every(ts => typeof ts.start === 'number' && typeof ts.comment === 'string');
        if (isValidJsonData) {
          // Single pass: Process each timestamp
          timestamps.forEach(ts => {
            if (ts.guid) {
              const existingLi = getTimestampItems().find(li => li.dataset.guid === ts.guid);
              if (existingLi) {
                const commentInput = existingLi.querySelector<HTMLInputElement>('input');
                if (commentInput) {
                  commentInput.value = ts.comment;
                }
              } else {
                addTimestamp(ts.start, ts.comment, false, ts.guid);
              }
            } else {
              addTimestamp(ts.start, ts.comment, false, crypto.randomUUID());
            }
          });
          processedSuccessfully = true;
        } else {
          log("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.", 'warn');
        }
      } else {
        log("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.", 'warn');
      }
    } catch (e) {
      // JSON parsing failed or was not the correct structure, proceed to plain text parsing
    }

    if (!processedSuccessfully) {
      // Handle plain text input
      const lines = contentString.split("\n").map(line => line.trim()).filter(line => line);
      if (lines.length > 0) {
        let matchedAnyLine = false;
        lines.forEach(line => {
          const match = line.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);
          if (match) {
            matchedAnyLine = true;
            const hours = parseInt(match[1]) || 0;
            const minutes = parseInt(match[2]);
            const seconds = parseInt(match[3]);
            const start = hours * 3600 + minutes * 60 + seconds;
            const remainingText = match[4] ? match[4].trim() : "";

            // Parse GUID if present in HTML comment format <!-- guid:xyz -->
            let guid = null;
            let comment = remainingText;
            const guidMatch = remainingText.match(/<!--\s*guid:([^>]+?)\s*-->/);
            if (guidMatch) {
              guid = guidMatch[1].trim();
              comment = remainingText.replace(/<!--\s*guid:[^>]+?\s*-->/, '').trim();
            }

            // First try to match by GUID if available, then fall back to timestamp matching
            let existingLi: HTMLLIElement | undefined;
            if (guid) {
              existingLi = getTimestampItems().find(li => li.dataset.guid === guid);
            }
            if (!existingLi && !guid) {
              existingLi = getTimestampItems().find(li => {
                if (li.dataset.guid) {
                  return false;
                }
                const timeLink = li.querySelector<HTMLAnchorElement>('a[data-time]');
                const timeValue = timeLink?.dataset.time;
                if (!timeValue) {
                  return false;
                }
                const time = Number.parseInt(timeValue, 10);
                return Number.isFinite(time) && time === start;
              });
            }
            if (existingLi) {
              const commentInput = existingLi.querySelector<HTMLInputElement>('input');
              if (commentInput) {
                commentInput.value = comment;
              }
            } else {
              addTimestamp(start, comment, false, guid || crypto.randomUUID()); // Use existing GUID or generate new one
            }
          }
        });
        if (matchedAnyLine) {
          processedSuccessfully = true;
        }
      }
    }

    if (processedSuccessfully) {
      log('Timestamps changed: Imported timestamps from file/clipboard');
      updateIndentMarkers();
      saveTimestamps(currentLoadedVideoId);
      updateSeekbarMarkers();
      updateScroll();
      // alert("Timestamps loaded and merged successfully!");
    } else {
      alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.");
    }
  }


  async function initializePaneIfNeeded() {
    // Prevent concurrent initialization
    if (isPaneInitializing) {
      log('Pane initialization already in progress, skipping duplicate call');
      return;
    }

    if (pane && document.body.contains(pane)) {
      return;
    }

    isPaneInitializing = true;

    try {
      // Remove any stray panes before creating a new one
      document.querySelectorAll("#ytls-pane").forEach(el => el.remove());

    pane = document.createElement("div");
    header = document.createElement("div");
    list = document.createElement("ul");
    btns = document.createElement("div");
    timeDisplay = document.createElement("span");
    style = document.createElement("style");
    versionDisplay = document.createElement("span");
    backupStatusIndicator = document.createElement("span");
    backupStatusIndicator.classList.add("ytls-backup-indicator");
    backupStatusIndicator.style.cursor = "pointer";
    backupStatusIndicator.style.backgroundColor = "#666"; // Default gray color
    backupStatusIndicator.onclick = (e) => {
      e.stopPropagation();
      toggleSettingsModal('drive');
    };

    // Add event listeners to `list` after it is initialized
    list.addEventListener("mouseenter", () => {
      isMouseOverTimestamps = true;
      suppressSortUntilRefocus = false;
       });

    list.addEventListener("mouseleave", () => {
      isMouseOverTimestamps = false;
      if (suppressSortUntilRefocus) {
        return;
      }
      const player = getActivePlayer();
      const currentTime = player ? Math.floor(player.getCurrentTime()) : getLatestTimestampValue();
      highlightNearestTimestampAtTime(currentTime, false);

      // Preserve focus on the currently focused timestamp when sorting
      let focusedTimestampGuid: string | null = null;
      if (document.activeElement instanceof HTMLInputElement && list.contains(document.activeElement)) {
        const activeLi = document.activeElement.closest('li');
        focusedTimestampGuid = activeLi?.dataset.guid ?? null;
      }

      // Sort and restore focus
      sortTimestampsAndUpdateDisplay();

      if (focusedTimestampGuid) {
        const targetLi = getTimestampItems().find(li => li.dataset.guid === focusedTimestampGuid);
        const targetInput = targetLi?.querySelector<HTMLInputElement>('input');
        if (targetInput) {
          try {
            targetInput.focus({ preventScroll: true });
          } catch {
            // Focus restoration failed, continue
          }
        }
      }
    });

  pane.id = "ytls-pane";
  header.id = "ytls-pane-header";

  header.addEventListener("dblclick", (event) => {
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (target && (target.closest("a") || target.closest("button") || target.closest("#ytls-current-time") || target.closest(".ytls-version-display") || target.closest(".ytls-backup-indicator"))) {
      return;
    }
    event.preventDefault();
    togglePaneVisibility(false);
  });

    const scriptVersion = GM_info.script.version; // Get script version
    versionDisplay.textContent = `v${scriptVersion}`;
    versionDisplay.classList.add("ytls-version-display"); // Add class for CSS targeting

    // Create a wrapper for version and backup indicator
    const versionWrapper = document.createElement("span");
    versionWrapper.style.display = "inline-flex";
    versionWrapper.style.alignItems = "center";
    versionWrapper.style.gap = "6px";
    versionWrapper.appendChild(versionDisplay);
    versionWrapper.appendChild(backupStatusIndicator);

    timeDisplay.id = "ytls-current-time";
    timeDisplay.textContent = "⏳";

    // Enable clicking on the current timestamp to jump to the latest point in the live stream
    timeDisplay.onclick = () => {
      isSeeking = true;
      const player = getActivePlayer();
      if (player) player.seekToLiveHead();
      setTimeout(() => { isSeeking = false; }, 500);
    };

    function updateTime() {
      // Skip updates during loading or seeking
      if (isLoadingTimestamps || isSeeking) {
        return;
      }

      const video = getVideoElement();
      const playerInstance = getActivePlayer();
      if (!video && !playerInstance) {
        return;
      }

      const rawTime = playerInstance ? playerInstance.getCurrentTime() : 0;
      const currentSeconds = Number.isFinite(rawTime) ? Math.max(0, Math.floor(rawTime)) : Math.max(0, getLatestTimestampValue());
      const h = Math.floor(currentSeconds / 3600);
      const m = Math.floor(currentSeconds / 60) % 60;
      const s = currentSeconds % 60;

      const { isLive } = playerInstance ? (playerInstance.getVideoData() || { isLive: false }) : { isLive: false };
      const behindLive = playerInstance ? isBehindLiveEdge(playerInstance) : false;

      const timestamps = list ? getTimestampItems().map(li => {
        const timeLink = li.querySelector('a[data-time]');
        return timeLink ? parseFloat(timeLink.getAttribute('data-time') ?? "0") : 0;
      }) : [];

      let timestampDisplay = "";
      if (timestamps.length > 0) {
        if (isLive) {
          const currentTimeMinutes = Math.max(1, currentSeconds / 60);
          const liveTimestamps = timestamps.filter(time => time <= currentSeconds);
          if (liveTimestamps.length > 0) {
            const timestampsPerMin = (liveTimestamps.length / currentTimeMinutes).toFixed(2);
            if (parseFloat(timestampsPerMin) > 0) {
              timestampDisplay = ` (${timestampsPerMin}/min)`;
            }
          }
        } else {
          const durationSeconds = playerInstance ? playerInstance.getDuration() : 0;
          const validDuration = Number.isFinite(durationSeconds) && durationSeconds > 0
            ? durationSeconds
            : (video && Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0);
          const totalMinutes = Math.max(1, validDuration / 60);
          const timestampsPerMin = (timestamps.length / totalMinutes).toFixed(1);
          if (parseFloat(timestampsPerMin) > 0) {
            timestampDisplay = ` (${timestampsPerMin}/min)`;
          }
        }
      }

      timeDisplay.textContent = `⏳${h ? h + ":" + String(m).padStart(2, "0") : m}:${String(s).padStart(2, "0")}${timestampDisplay}`;
      timeDisplay.style.color = behindLive ? "#ff4d4f" : "";

      // Always highlight the nearest timestamp; defer scrolling to mouse leave
      if (timestamps.length > 0) {
        highlightNearestTimestampAtTime(currentSeconds, false);
      }
    }
    updateTime();
    if (timeUpdateIntervalId) {
      clearInterval(timeUpdateIntervalId);
    }
    timeUpdateIntervalId = setInterval(updateTime, 1000);
    btns.id = "ytls-buttons";

    // Reusable modal helper functions
    const createModalCloseHandler = (modal: HTMLElement, onClose?: () => void) => {
      return () => {
        modal.classList.remove("ytls-fade-in");
        modal.classList.add("ytls-fade-out");
        setTimeout(() => {
          if (document.body.contains(modal)) {
            document.body.removeChild(modal);
          }
          if (onClose) {
            onClose();
          }
        }, 300);
      };
    };

    const createEscapeKeyHandler = (closeHandler: () => void) => {
      return (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          closeHandler();
        }
      };
    };

    const registerModalEscapeHandler = (escapeHandler: (event: KeyboardEvent) => void) => {
      setTimeout(() => {
        document.addEventListener('keydown', escapeHandler);
      }, 0);
    };

    const createClickOutsideHandler = (modal: HTMLElement, closeHandler: () => void) => {
      return (event: MouseEvent) => {
        if (!modal.contains(event.target as Node)) {
          closeHandler();
        }
      };
    };

    const registerModalClickOutsideHandler = (clickOutsideHandler: (event: MouseEvent) => void) => {
      setTimeout(() => {
        document.addEventListener('click', clickOutsideHandler, true);
      }, 0);
    };

    // Define handlers for main buttons
    const handleAddTimestamp = () => {
      if (!list || list.querySelector('.ytls-error-message') || isLoadingTimestamps) {
        return;
      }

      // Use configuredOffset if available, otherwise default to 0
      const offset = typeof configuredOffset !== 'undefined' ? configuredOffset : 0;
      const player = getActivePlayer();
      const currentTime = player ? Math.floor(player.getCurrentTime() + offset) : 0;
      if (!Number.isFinite(currentTime)) {
        return;
      }
      const newCommentInput = addTimestamp(currentTime, "");
      if (newCommentInput) {
        newCommentInput.focus();
      }
    };

    const handleCopyTimestamps = function (e) {
      if (!list || list.querySelector('.ytls-error-message') || isLoadingTimestamps) {
        this.textContent = "❌";
        setTimeout(() => { this.textContent = "📋"; }, 2000);
        return;
      }
      const timestamps = extractTimestampRecords();
      const videoDuration = Math.max(getLatestTimestampValue(), 0);
      if (timestamps.length === 0) {
        this.textContent = "❌";
        setTimeout(() => { this.textContent = "📋"; }, 2000);
        return;
      }
      const includeGuids = e.ctrlKey;
      const plainText = timestamps.map(ts => {
        const timeString = formatTimeString(ts.start, videoDuration);
        return includeGuids
          ? `${timeString} ${ts.comment} <!-- guid:${ts.guid} -->`.trimStart()
          : `${timeString} ${ts.comment}`;
      }).join("\n");
      navigator.clipboard.writeText(plainText).then(() => {
        this.textContent = "✅";
        setTimeout(() => { this.textContent = "📋"; }, 2000);
      }).catch(err => {
        log("Failed to copy timestamps: ", err, 'error');
        this.textContent = "❌";
        setTimeout(() => { this.textContent = "📋"; }, 2000);
      });
    };

      const handleBulkOffset = () => {
        if (!list || list.querySelector('.ytls-error-message') || isLoadingTimestamps) {
          return;
        }

        const items = getTimestampItems();
        if (items.length === 0) {
          alert("No timestamps available to offset.");
          return;
        }

        const input = prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):", "0");
        if (input === null) {
          return;
        }

        const trimmed = input.trim();
        if (trimmed.length === 0) {
          return;
        }

        const offsetSeconds = Number.parseInt(trimmed, 10);
        if (!Number.isFinite(offsetSeconds)) {
          alert("Please enter a valid integer number of seconds.");
          return;
        }

        if (offsetSeconds === 0) {
          return;
        }

        if (!applyOffsetToAllTimestamps(offsetSeconds, {
          alertOnNoChange: true,
          failureMessage: "Offset had no effect because timestamps are already at the requested bounds.",
          logLabel: "bulk offset"
        })) {
          return;
        }
      };

      const handleDeleteAll = async () => {
        const currentVideoId = getVideoId();
        if (!currentVideoId) {
          alert("Unable to determine current video ID.");
          return;
        }

        // Create a styled modal for confirmation
        const modal = document.createElement("div");
        modal.id = "ytls-delete-all-modal";
        modal.classList.remove("ytls-fade-out");
        modal.classList.add("ytls-fade-in");

        const message = document.createElement("p");
        message.textContent = `Hold the button to delete all timestamps for:`;
        message.style.marginBottom = "10px";

        const videoIdDisplay = document.createElement("p");
        videoIdDisplay.textContent = currentVideoId;
        videoIdDisplay.style.fontFamily = "monospace";
        videoIdDisplay.style.fontSize = "12px";
        videoIdDisplay.style.marginBottom = "15px";
        videoIdDisplay.style.color = "#aaa";

        const confirmButton = document.createElement("button");
        confirmButton.classList.add("ytls-save-modal-button");
        confirmButton.style.background = "#d32f2f";
        confirmButton.style.position = "relative";
        confirmButton.style.overflow = "hidden";

        let holdTimer: ReturnType<typeof setTimeout> | null = null;
        let holdStartTime = 0;
        let progressAnimationFrame: number | null = null;

        const progressBar = document.createElement("div");
        progressBar.style.position = "absolute";
        progressBar.style.left = "0";
        progressBar.style.top = "0";
        progressBar.style.height = "100%";
        progressBar.style.width = "0%";
        progressBar.style.background = "#ff6b6b";
        progressBar.style.transition = "none";
        progressBar.style.pointerEvents = "none";
        confirmButton.appendChild(progressBar);

        const buttonText = document.createElement("span");
        buttonText.textContent = "Hold to Delete All";
        buttonText.style.position = "relative";
        buttonText.style.zIndex = "1";
        confirmButton.appendChild(buttonText);

        const updateProgress = () => {
          if (!holdStartTime) return;
          const elapsed = Date.now() - holdStartTime;
          const progress = Math.min((elapsed / 5000) * 100, 100);
          progressBar.style.width = `${progress}%`;

          if (progress < 100) {
            progressAnimationFrame = requestAnimationFrame(updateProgress);
          }
        };

        const resetButton = () => {
          if (holdTimer) {
            clearTimeout(holdTimer);
            holdTimer = null;
          }
          if (progressAnimationFrame) {
            cancelAnimationFrame(progressAnimationFrame);
            progressAnimationFrame = null;
          }
          holdStartTime = 0;
          progressBar.style.width = "0%";
          buttonText.textContent = "Hold to Delete All";
        };

        confirmButton.onmousedown = () => {
          holdStartTime = Date.now();
          buttonText.textContent = "Deleting...";
          progressAnimationFrame = requestAnimationFrame(updateProgress);

          holdTimer = setTimeout(async () => {
            // 5 seconds elapsed, proceed with deletion
            resetButton();
            modal.classList.remove("ytls-fade-in");
            modal.classList.add("ytls-fade-out");
            setTimeout(async () => {
              if (document.body.contains(modal)) {
                document.body.removeChild(modal);
              }
              try {
                await removeFromIndexedDB(currentVideoId);
                handleUrlChange(); // Refresh the tool to reflect deletion
              } catch (err) {
                log("Failed to delete all timestamps:", err, 'error');
                alert("Failed to delete timestamps. Check console for details.");
              }
            }, 300);
          }, 5000);
        };

        confirmButton.onmouseup = resetButton;
        confirmButton.onmouseleave = resetButton;

        let escapeHandler: ((event: KeyboardEvent) => void) | null = null;
        let clickOutsideHandler: ((event: MouseEvent) => void) | null = null;
        const closeDeleteModal = createModalCloseHandler(modal, () => {
          resetButton();
          if (escapeHandler) {
            document.removeEventListener('keydown', escapeHandler);
          }
          if (clickOutsideHandler) {
            document.removeEventListener('click', clickOutsideHandler, true);
          }
        });

        escapeHandler = createEscapeKeyHandler(closeDeleteModal);
        clickOutsideHandler = createClickOutsideHandler(modal, closeDeleteModal);

        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel";
        cancelButton.classList.add("ytls-save-modal-cancel-button");
        cancelButton.onclick = closeDeleteModal;

        modal.appendChild(message);
        modal.appendChild(videoIdDisplay);
        modal.appendChild(confirmButton);
        modal.appendChild(cancelButton);
        document.body.appendChild(modal);

        registerModalEscapeHandler(escapeHandler);
        registerModalClickOutsideHandler(clickOutsideHandler);
      };

    // Configuration for main buttons
    const mainButtonConfigs = [
      { label: "🐣", title: "Add timestamp", action: handleAddTimestamp },
      { label: "⚙️", title: "Settings", action: () => toggleSettingsModal() }, // Changed action
      { label: "📋", title: "Copy timestamps to clipboard", action: handleCopyTimestamps },
        { label: "⏱️", title: "Offset all timestamps", action: handleBulkOffset },
      { label: "🗑️", title: "Delete all timestamps for current video", action: handleDeleteAll }
    ];

    // Check for holiday emoji on load
    const holidayEmoji = getHolidayEmoji();

    // Create and append main buttons
    mainButtonConfigs.forEach(config => {
      const button = document.createElement("button");
      button.textContent = config.label;
      addTooltip(button, config.title);
      button.classList.add("ytls-main-button");

      // Add holiday emoji to the 🐣 button if available
      if (config.label === "🐣" && holidayEmoji) {
        const holidayEmojiSpan = document.createElement("span");
        holidayEmojiSpan.textContent = holidayEmoji;
        holidayEmojiSpan.classList.add("ytls-holiday-emoji");
        button.appendChild(holidayEmojiSpan);
      }

      if (config.label === "📋") {
        // For copy button, bind to an event handler that includes the event object
        button.onclick = function (e) { config.action.call(this, e); };
      } else {
        button.onclick = config.action;
      }
      if (config.label === "⚙️") { // Store a reference to the settings cog button
        settingsCogButtonElement = button;
      }
      btns.appendChild(button);
    });

    // Helper function to create a button with common styles and actions (for settings modal)
    function createButton(label, title, onClick) {
      const button = document.createElement("button");
      button.textContent = label;
      addTooltip(button, title);
      button.classList.add("ytls-settings-modal-button");
      button.onclick = onClick;
      return button;
    }

    // Function to create and toggle the settings modal
    function toggleSettingsModal(initialTab: 'general' | 'drive' = 'general') {
      if (settingsModalInstance && settingsModalInstance.parentNode === document.body) {
        // Close all subdialogs first
        const saveModal = document.getElementById('ytls-save-modal');
        const loadModal = document.getElementById('ytls-load-modal');
        const deleteModal = document.getElementById('ytls-delete-all-modal');
        if (saveModal && document.body.contains(saveModal)) {
          document.body.removeChild(saveModal);
        }
        if (loadModal && document.body.contains(loadModal)) {
          document.body.removeChild(loadModal);
        }
        if (deleteModal && document.body.contains(deleteModal)) {
          document.body.removeChild(deleteModal);
        }

        // Modal exists and is visible, so close it with fade-out
        settingsModalInstance.classList.remove("ytls-fade-in");
        settingsModalInstance.classList.add("ytls-fade-out");
        setTimeout(() => {
          if (document.body.contains(settingsModalInstance)) {
            document.body.removeChild(settingsModalInstance);
          }
          settingsModalInstance = null;
          document.removeEventListener('click', handleClickOutsideSettingsModal, true); // Remove click-outside listener
          document.removeEventListener('keydown', handleSettingsModalEscape); // Remove escape key listener
        }, 300); // Match animation duration
        return;
      }

      // Modal doesn't exist or isn't visible, so create and show it
      settingsModalInstance = document.createElement("div");
      settingsModalInstance.id = "ytls-settings-modal";
      settingsModalInstance.classList.remove("ytls-fade-out");
      settingsModalInstance.classList.add("ytls-fade-in");

      // Create header container with tabs and close button
      const header = document.createElement("div");
      header.className = "ytls-modal-header";

      const nav = document.createElement("div");
      nav.id = "ytls-settings-nav";

      const closeButton = document.createElement("button");
      closeButton.className = "ytls-modal-close-button";
      closeButton.textContent = "✕";
      addTooltip(closeButton, "Close");
      closeButton.onclick = () => {
        if (settingsModalInstance && settingsModalInstance.parentNode === document.body) {
          // Close all subdialogs first
          const saveModal = document.getElementById('ytls-save-modal');
          const loadModal = document.getElementById('ytls-load-modal');
          const deleteModal = document.getElementById('ytls-delete-all-modal');
          if (saveModal && document.body.contains(saveModal)) {
            document.body.removeChild(saveModal);
          }
          if (loadModal && document.body.contains(loadModal)) {
            document.body.removeChild(loadModal);
          }
          if (deleteModal && document.body.contains(deleteModal)) {
            document.body.removeChild(deleteModal);
          }

          settingsModalInstance.classList.remove("ytls-fade-in");
          settingsModalInstance.classList.add("ytls-fade-out");
          setTimeout(() => {
            if (document.body.contains(settingsModalInstance)) {
              document.body.removeChild(settingsModalInstance);
            }
            settingsModalInstance = null;
            document.removeEventListener('click', handleClickOutsideSettingsModal, true);
            document.removeEventListener('keydown', handleSettingsModalEscape);
          }, 300);
        }
      };

      const settingsContent = document.createElement("div");
      settingsContent.id = "ytls-settings-content";

      const sectionHeading = document.createElement("h3");
      sectionHeading.className = "ytls-section-heading";
      sectionHeading.textContent = "General";
      sectionHeading.style.display = "none";

      const generalSection = document.createElement("div");
      const driveSection = document.createElement("div");
      driveSection.className = "ytls-button-grid";

      function showSection(section: 'general' | 'drive') {
        generalSection.style.display = section === 'general' ? 'block' : 'none';
        driveSection.style.display = section === 'drive' ? 'block' : 'none';
        generalTab.classList.toggle('active', section === 'general');
        driveTab.classList.toggle('active', section === 'drive');
        sectionHeading.textContent = section === 'general' ? 'General' : 'Google Drive';
      }

      const generalTab = document.createElement("button");
      generalTab.textContent = '🛠️';
      const generalTabText = document.createElement("span");
      generalTabText.className = "ytls-tab-text";
      generalTabText.textContent = " General";
      generalTab.appendChild(generalTabText);
      addTooltip(generalTab, "General settings");
      generalTab.classList.add("ytls-settings-modal-button");
      generalTab.onclick = () => showSection('general');

      const driveTab = document.createElement("button");
      driveTab.textContent = '☁️';
      const driveTabText = document.createElement("span");
      driveTabText.className = "ytls-tab-text";
      driveTabText.textContent = " Backup";
      driveTab.appendChild(driveTabText);
      addTooltip(driveTab, "Google Drive sign-in and backup");
      driveTab.classList.add("ytls-settings-modal-button");
      driveTab.onclick = async () => {
        // Verify auth state when opening backup settings
        if (GoogleDrive.googleAuthState.isSignedIn) {
          await GoogleDrive.verifySignedIn();
        }
        showSection('drive');
      };
      nav.appendChild(generalTab);
      nav.appendChild(driveTab);

      header.appendChild(nav);
      header.appendChild(closeButton);
      settingsModalInstance.appendChild(header);

      // Build General section
      generalSection.className = "ytls-button-grid";
      generalSection.appendChild(createButton("💾 Save", "Save As...", saveBtn.onclick));
      generalSection.appendChild(createButton("📂 Load", "Load", loadBtn.onclick));
      generalSection.appendChild(createButton("📤 Export All", "Export All Data", exportBtn.onclick));
      generalSection.appendChild(createButton("📥 Import All", "Import All Data", importBtn.onclick));

      // Build Google Drive section
      const signButton = createButton(
        GoogleDrive.googleAuthState.isSignedIn ? "🔓 Sign Out" : "🔐 Sign In",
        GoogleDrive.googleAuthState.isSignedIn ? "Sign out from Google Drive" : "Sign in to Google Drive",
        async () => {
          if (GoogleDrive.googleAuthState.isSignedIn) {
            await GoogleDrive.signOutFromGoogle();
          } else {
            await GoogleDrive.signInToGoogle();
          }
          // Update label after action
          signButton.textContent = GoogleDrive.googleAuthState.isSignedIn ? "🔓 Sign Out" : "🔐 Sign In";
          addTooltip(signButton, GoogleDrive.googleAuthState.isSignedIn ? "Sign out from Google Drive" : "Sign in to Google Drive");
        }
      );
      driveSection.appendChild(signButton);

      const autoToggleButton = createButton(
        GoogleDrive.autoBackupEnabled ? "🔁 Auto Backup: On" : "🔁 Auto Backup: Off",
        "Toggle Auto Backup",
        async () => {
          await GoogleDrive.toggleAutoBackup();
          autoToggleButton.textContent = GoogleDrive.autoBackupEnabled ? "🔁 Auto Backup: On" : "🔁 Auto Backup: Off";
        }
      );
      driveSection.appendChild(autoToggleButton);

      const intervalButton = createButton(
        `⏱️ Backup Interval: ${GoogleDrive.autoBackupIntervalMinutes}min`,
        "Set periodic backup interval (minutes)",
        async () => {
          await GoogleDrive.setAutoBackupIntervalPrompt();
          intervalButton.textContent = `⏱️ Backup Interval: ${GoogleDrive.autoBackupIntervalMinutes}min`;
        }
      );
      driveSection.appendChild(intervalButton);

      driveSection.appendChild(createButton("🗄️ Backup Now", "Run a backup immediately", async () => {
        await GoogleDrive.runAutoBackupOnce(false);
      }));

      // Add status info displays at the bottom
      const infoContainer = document.createElement("div");
      infoContainer.style.marginTop = "15px";
      infoContainer.style.paddingTop = "10px";
      infoContainer.style.borderTop = "1px solid #555";
      infoContainer.style.fontSize = "12px";
      infoContainer.style.color = "#aaa";

      // Sign-in status indicator
      const statusDiv = document.createElement("div");
      statusDiv.style.marginBottom = "8px";
      statusDiv.style.fontWeight = "bold";
      infoContainer.appendChild(statusDiv);
      GoogleDrive.setAuthStatusDisplay(statusDiv);

      // User info
      const userInfoDiv = document.createElement("div");
      userInfoDiv.style.marginBottom = "8px";
      GoogleDrive.setGoogleUserDisplay(userInfoDiv);
      infoContainer.appendChild(userInfoDiv);

      // Backup status info
      const backupInfoDiv = document.createElement("div");
      GoogleDrive.setBackupStatusDisplay(backupInfoDiv);
      infoContainer.appendChild(backupInfoDiv);

      driveSection.appendChild(infoContainer);

      // Update status display based on sign-in state
      GoogleDrive.updateAuthStatusDisplay();
      GoogleDrive.updateGoogleUserDisplay();
      GoogleDrive.updateBackupStatusDisplay();

      // Append sections
      settingsContent.appendChild(sectionHeading);
      settingsContent.appendChild(generalSection)
      settingsContent.appendChild(driveSection);
      showSection(initialTab);

      settingsModalInstance.appendChild(settingsContent);
      document.body.appendChild(settingsModalInstance);

      // Calculate centered position and fix top edge
      requestAnimationFrame(() => {
        const rect = settingsModalInstance.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const centeredTop = (viewportHeight - rect.height) / 2;
        settingsModalInstance.style.top = `${Math.max(20, centeredTop)}px`;
        settingsModalInstance.style.transform = 'translateX(-50%)';
      });

      // Add click-outside listener
      // Use setTimeout to ensure this listener is added after the current click event cycle
      setTimeout(() => {
        document.addEventListener('click', handleClickOutsideSettingsModal, true);
        document.addEventListener('keydown', handleSettingsModalEscape);
      }, 0);
    }

    function handleSettingsModalEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && settingsModalInstance && settingsModalInstance.parentNode === document.body) {
        // Check if any subdialogs are open - if so, let their handlers deal with it
        const saveModal = document.getElementById('ytls-save-modal');
        const loadModal = document.getElementById('ytls-load-modal');
        const deleteModal = document.getElementById('ytls-delete-all-modal');
        if (saveModal || loadModal || deleteModal) {
          // Let the subdialog's escape handler handle this
          return;
        }

        event.preventDefault();

        // Close all subdialogs before closing settings
        if (saveModal && document.body.contains(saveModal)) {
          document.body.removeChild(saveModal);
        }
        if (loadModal && document.body.contains(loadModal)) {
          document.body.removeChild(loadModal);
        }
        if (deleteModal && document.body.contains(deleteModal)) {
          document.body.removeChild(deleteModal);
        }

        settingsModalInstance.classList.remove("ytls-fade-in");
        settingsModalInstance.classList.add("ytls-fade-out");
        setTimeout(() => {
          if (document.body.contains(settingsModalInstance)) {
            document.body.removeChild(settingsModalInstance);
          }
          settingsModalInstance = null;
          document.removeEventListener('click', handleClickOutsideSettingsModal, true);
          document.removeEventListener('keydown', handleSettingsModalEscape);
        }, 300);
      }
    }

    function handleClickOutsideSettingsModal(event) {
      // If the click is on the cog button itself, let toggleSettingsModal handle it
      if (settingsCogButtonElement && settingsCogButtonElement.contains(event.target)) {
        return;
      }

      // Check if clicked outside all modals
      const saveModal = document.getElementById('ytls-save-modal');
      const loadModal = document.getElementById('ytls-load-modal');
      const deleteModal = document.getElementById('ytls-delete-all-modal');

      const clickedInsideAnyModal = (saveModal && saveModal.contains(event.target)) ||
                                    (loadModal && loadModal.contains(event.target)) ||
                                    (deleteModal && deleteModal.contains(event.target)) ||
                                    (settingsModalInstance && settingsModalInstance.contains(event.target));

      if (!clickedInsideAnyModal) {
        // Close all subdialogs first
        if (saveModal && document.body.contains(saveModal)) {
          document.body.removeChild(saveModal);
        }
        if (loadModal && document.body.contains(loadModal)) {
          document.body.removeChild(loadModal);
        }
        if (deleteModal && document.body.contains(deleteModal)) {
          document.body.removeChild(deleteModal);
        }

        // Then close settings modal
        if (settingsModalInstance && settingsModalInstance.parentNode === document.body) {
          settingsModalInstance.classList.remove("ytls-fade-in");
          settingsModalInstance.classList.add("ytls-fade-out");
          setTimeout(() => {
            if (document.body.contains(settingsModalInstance)) {
              document.body.removeChild(settingsModalInstance);
            }
            settingsModalInstance = null;
            document.removeEventListener('click', handleClickOutsideSettingsModal, true);
            document.removeEventListener('keydown', handleSettingsModalEscape);
          }, 300); // Match animation duration
        }
      }
    }

    // Add a save button to the buttons section
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "💾 Save";
    saveBtn.classList.add("ytls-file-operation-button");
    saveBtn.onclick = () => {

      // Create a styled modal for the save format choice
      const modal = document.createElement("div");
      modal.id = "ytls-save-modal";
      modal.classList.remove("ytls-fade-out");
      modal.classList.add("ytls-fade-in");

      const message = document.createElement("p");
      message.textContent = "Save as:";

      let escapeHandler: ((event: KeyboardEvent) => void) | null = null;
      let clickOutsideHandler: ((event: MouseEvent) => void) | null = null;
      const closeSaveModal = createModalCloseHandler(modal, () => {
        if (escapeHandler) {
          document.removeEventListener('keydown', escapeHandler);
        }
        if (clickOutsideHandler) {
          document.removeEventListener('click', clickOutsideHandler, true);
        }
      });

      escapeHandler = createEscapeKeyHandler(closeSaveModal);
      clickOutsideHandler = createClickOutsideHandler(modal, closeSaveModal);

      const jsonButton = document.createElement("button");
      jsonButton.textContent = "JSON";
      jsonButton.classList.add("ytls-save-modal-button");
      jsonButton.onclick = () => {
        if (escapeHandler) {
          document.removeEventListener('keydown', escapeHandler);
        }
        if (clickOutsideHandler) {
          document.removeEventListener('click', clickOutsideHandler, true);
        }
        createModalCloseHandler(modal, () => saveTimestampsAs("json"))();
      };

      const textButton = document.createElement("button");
      textButton.textContent = "Plain Text";
      textButton.classList.add("ytls-save-modal-button");
      textButton.onclick = () => {
        if (escapeHandler) {
          document.removeEventListener('keydown', escapeHandler);
        }
        if (clickOutsideHandler) {
          document.removeEventListener('click', clickOutsideHandler, true);
        }
        createModalCloseHandler(modal, () => saveTimestampsAs("text"))();
      };

      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Cancel";
      cancelButton.classList.add("ytls-save-modal-cancel-button");
      cancelButton.onclick = closeSaveModal;

      modal.appendChild(message);
      modal.appendChild(jsonButton);
      modal.appendChild(textButton);
      modal.appendChild(cancelButton);
      document.body.appendChild(modal);

      registerModalEscapeHandler(escapeHandler);
      registerModalClickOutsideHandler(clickOutsideHandler);
    };

    // Add a load button to the buttons section
    const loadBtn = document.createElement("button");
    loadBtn.textContent = "📂 Load";
    loadBtn.classList.add("ytls-file-operation-button");
    loadBtn.onclick = () => {
      // Create a modal for choosing load source
      const loadModal = document.createElement("div");
      loadModal.id = "ytls-load-modal";
      loadModal.classList.remove("ytls-fade-out");
      loadModal.classList.add("ytls-fade-in");

      const loadMessage = document.createElement("p");
      loadMessage.textContent = "Load from:";

      let escapeHandler: ((event: KeyboardEvent) => void) | null = null;
      let clickOutsideHandler: ((event: MouseEvent) => void) | null = null;
      const closeLoadModal = createModalCloseHandler(loadModal, () => {
        if (escapeHandler) {
          document.removeEventListener('keydown', escapeHandler);
        }
        if (clickOutsideHandler) {
          document.removeEventListener('click', clickOutsideHandler, true);
        }
      });

      escapeHandler = createEscapeKeyHandler(closeLoadModal);
      clickOutsideHandler = createClickOutsideHandler(loadModal, closeLoadModal);

      const fromFileButton = document.createElement("button");
      fromFileButton.textContent = "File";
      fromFileButton.classList.add("ytls-save-modal-button");
      fromFileButton.onclick = () => {
        // Create a hidden file input element
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".json,.txt";
        fileInput.classList.add("ytls-hidden-file-input");

        fileInput.onchange = (event) => {
          const file = (event.target as HTMLInputElement).files?.[0];
          if (!file) return;

          // Close modal as soon as file is selected
          if (escapeHandler) {
            document.removeEventListener('keydown', escapeHandler);
          }
          if (clickOutsideHandler) {
            document.removeEventListener('click', clickOutsideHandler, true);
          }
          closeLoadModal();

          const reader = new FileReader();
          reader.onload = () => {
            const content = String(reader.result).trim();
            processImportedData(content);
          };
          reader.readAsText(file);
        };
        fileInput.click();
      };

      const fromClipboardButton = document.createElement("button");
      fromClipboardButton.textContent = "Clipboard";
      fromClipboardButton.classList.add("ytls-save-modal-button");
      fromClipboardButton.onclick = async () => {
        if (escapeHandler) {
          document.removeEventListener('keydown', escapeHandler);
        }
        if (clickOutsideHandler) {
          document.removeEventListener('click', clickOutsideHandler, true);
        }
        createModalCloseHandler(loadModal, async () => {
          try {
            const clipboardText = await navigator.clipboard.readText();
            if (clipboardText) {
              processImportedData(clipboardText.trim());
            } else {
              alert("Clipboard is empty.");
            }
          } catch (err) {
            log("Failed to read from clipboard: ", err, 'error');
            alert("Failed to read from clipboard. Ensure you have granted permission.");
          }
        })();
      };

      const cancelLoadButton = document.createElement("button");
      cancelLoadButton.textContent = "Cancel";
      cancelLoadButton.classList.add("ytls-save-modal-cancel-button");
      cancelLoadButton.onclick = closeLoadModal;

      loadModal.appendChild(loadMessage);
      loadModal.appendChild(fromFileButton);
      loadModal.appendChild(fromClipboardButton);
      loadModal.appendChild(cancelLoadButton);
      document.body.appendChild(loadModal);

      registerModalEscapeHandler(escapeHandler);
      registerModalClickOutsideHandler(clickOutsideHandler);
    };

    // Add export button to the buttons section
    const exportBtn = document.createElement("button");
    exportBtn.textContent = "📤 Export";
    exportBtn.classList.add("ytls-file-operation-button");
    exportBtn.onclick = async () => {
      try {
        await exportAllTimestamps();
      } catch (err) {
        alert("Failed to export data: Could not read from database.");
      }
    };

    // Add import button to the buttons section
    const importBtn = document.createElement("button");
    importBtn.textContent = "📥 Import";
    importBtn.classList.add("ytls-file-operation-button");
    importBtn.onclick = () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".json";
      fileInput.classList.add("ytls-hidden-file-input"); // Added class

      fileInput.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
          try {
            const importedData = JSON.parse(String(reader.result));
            const importPromises = [] as Promise<unknown>[];

            for (const key in importedData) {
              if (Object.prototype.hasOwnProperty.call(importedData, key) && key.startsWith("ytls-")) {
                const videoId = key.substring(5); // Extract videoId from "ytls-videoId"
                const videoData = importedData[key];

                // Ensure videoData has the expected structure before saving
                if (videoData && typeof videoData.video_id === 'string' && Array.isArray(videoData.timestamps)) {
                  // Ensure each timestamp has a guid
                  const timestampsWithGuids = videoData.timestamps.map(ts => ({
                    ...ts,
                    guid: ts.guid || crypto.randomUUID()
                  }));
                  // Save to IndexedDB
                  const promise = saveToIndexedDB(videoId, timestampsWithGuids)
                    .then(() => log(`Imported ${videoId} to IndexedDB`))
                    .catch(err => log(`Failed to import ${videoId} to IndexedDB:`, err, 'error'));
                  importPromises.push(promise);
                } else {
                  log(`Skipping key ${key} during import due to unexpected data format.`, 'warn');
                }
              }
            }
            Promise.all(importPromises).then(() => {
              // alert("Data imported successfully! Refreshing tool...");
              handleUrlChange(); // Refresh the tool to reflect imported data
            }).catch(err => {
              alert("An error occurred during import to IndexedDB. Check console for details.");
              log("Overall import error:", err, 'error');
            });
          } catch (e) {
            alert("Failed to import data. Please ensure the file is in the correct format.\n" + (e as Error).message);
            log("Import error:", e, 'error');
          }
        };

        reader.readAsText(file);
      };

      fileInput.click();
    };

  style.textContent = PANE_STYLES;

    list.onclick = (e) => {
      handleClick(e);
    };
    list.ontouchstart = (e) => {
      handleClick(e);
    };

    // Pane helpers are declared at module scope above

    // Load pane position from IndexedDB settings
    function loadPanePosition() {
      if (!pane) return;
      log('Loading window position from IndexedDB');
      loadGlobalSettings('windowPosition').then(value => {
        if (value && typeof (value as any).x === 'number' && typeof (value as any).y === 'number') {
          const pos = value as { x: number; y: number; width?: number; height?: number };
          pane.style.left = `${pos.x}px`;
          pane.style.top = `${pos.y}px`;
          pane.style.right = "auto";
          pane.style.bottom = "auto";
          // Apply stored size when provided, otherwise fall back to defaults
          if (typeof pos.width === 'number' && pos.width > 0) {
            pane.style.width = `${pos.width}px`;
          } else {
            pane.style.width = `${DEFAULT_PANE_WIDTH}px`;
            log(`No stored window width found, using default width ${DEFAULT_PANE_WIDTH}px`);
          }
          if (typeof pos.height === 'number' && pos.height > 0) {
            pane.style.height = `${pos.height}px`;
          } else {
            pane.style.height = `${DEFAULT_PANE_HEIGHT}px`;
            log(`No stored window height found, using default height ${DEFAULT_PANE_HEIGHT}px`);
          }
          // Get rect after applying position and size
          const rect = getPaneRect();
          updateLastSavedPanePositionFromRect(rect, pos.x, pos.y);
          log('Restored window position from IndexedDB:', lastSavedPanePosition);
        } else {
          log('No window position found in IndexedDB, applying default size and leaving default position');
          // Ensure default size is applied when no stored position exists
          pane.style.width = `${DEFAULT_PANE_WIDTH}px`;
          pane.style.height = `${DEFAULT_PANE_HEIGHT}px`;
          lastSavedPanePosition = null;
        }
        clampPaneToViewport();
        const rect = getPaneRect();
        if (rect && (rect.width || rect.height)) {
          updateLastSavedPanePositionFromRect(rect);
        }
        // Ensure the scroll area is sized after restoring position/size
        if (typeof (window as any).recalculateTimestampsArea === 'function') (window as any).recalculateTimestampsArea();
      }).catch(err => {
        log("failed to load pane position from IndexedDB:", err, 'warn');
        clampPaneToViewport();
        const rect = getPaneRect();
        if (rect && (rect.width || rect.height)) {
          lastSavedPanePosition = {
            x: Math.max(0, Math.round(rect.left)),
            y: 0, // Fixed at bottom
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          };
        }
        if (typeof (window as any).recalculateTimestampsArea === 'function') (window as any).recalculateTimestampsArea();
      });
    }

    function savePanePosition() {
      if (!pane) return;

      const rect = getPaneRect();
      if (!rect) return;

      const positionData = {
        x: Math.max(0, Math.round(rect.left)),
        y: Math.max(0, Math.round(rect.top)),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      };

      if (lastSavedPanePosition &&
        lastSavedPanePosition.x === positionData.x &&
        lastSavedPanePosition.y === positionData.y &&
        lastSavedPanePosition.width === positionData.width &&
        lastSavedPanePosition.height === positionData.height) {
        log('Skipping window position save; position and size unchanged');
        return;
      }

      lastSavedPanePosition = { ...positionData };
      log(`Saving window position and size to IndexedDB: x=${positionData.x}, y=${positionData.y}, width=${positionData.width}, height=${positionData.height}`);
      saveGlobalSettings('windowPosition', positionData);

      safePostMessage({
        type: 'window_position_updated',
        position: positionData,
        timestamp: Date.now()
      });
    }
    // Enable dragging for the pane
    pane.style.position = "fixed";
    pane.style.bottom = "0";
    pane.style.right = "0";
    pane.style.transition = "none"; // Disable transition during initial position restore
    loadPanePosition();
    // Ensure initial position is clamped to viewport
    setTimeout(() => clampPaneToViewport(), 10);

    let isDragging = false;
    let offsetX; let offsetY;
    let dragOccurredSinceLastMouseDown = false; // Flag to track if a drag occurred

    pane.addEventListener("mousedown", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        return;
      }

      // Allow dragging from the header region
      if (target !== header && !header.contains(target) && window.getComputedStyle(target).cursor === 'pointer') {
        return;
      }

      isDragging = true;
      dragOccurredSinceLastMouseDown = false;
      offsetX = e.clientX - pane.getBoundingClientRect().left;
      offsetY = e.clientY - pane.getBoundingClientRect().top;

      pane.style.transition = "none";
    });

    document.addEventListener("mousemove", documentMousemoveHandler = (e) => {
      if (!isDragging) return;

      dragOccurredSinceLastMouseDown = true; // Set flag if mouse moves while dragging

      let x = e.clientX - offsetX;
      let y = e.clientY - offsetY;

      // Get pane dimensions and viewport dimensions
      const paneRect = pane.getBoundingClientRect();
      const paneWidth = paneRect.width;
      const paneHeight = paneRect.height;
      // Use document.documentElement.clientWidth/Height to account for scrollbars
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;

      // Clamp x to keep pane fully on screen horizontally, accounting for scrollbars
      x = Math.max(0, Math.min(x, viewportWidth - paneWidth));

      // Clamp y to keep pane fully on screen vertically, accounting for scrollbars
      y = Math.max(0, Math.min(y, viewportHeight - paneHeight));

      pane.style.left = `${x}px`;
      pane.style.top = `${y}px`;
      pane.style.right = "auto";
      pane.style.bottom = "auto";
    });

    document.addEventListener("mouseup", documentMouseupHandler = () => {
      if (!isDragging) return;

      isDragging = false;
      const didDrag = dragOccurredSinceLastMouseDown;
      setTimeout(() => {
        dragOccurredSinceLastMouseDown = false; // Reset the flag after a short delay
      }, 50);

      // Ensure the pane remains fully visible and persist its position
      clampPaneToViewport();
      setTimeout(() => {
        if (didDrag) {
          savePanePosition();
        }
      }, 200);
    });

    // Prevent text selection during drag
    pane.addEventListener("dragstart", (e) => e.preventDefault());

    // Create corner resize handles (top-left, top-right, bottom-left, bottom-right)
    const resizeTL = document.createElement("div");
    const resizeTR = document.createElement("div");
    const resizeBL = document.createElement("div");
    const resizeBR = document.createElement("div");
    resizeTL.id = "ytls-resize-tl";
    resizeTR.id = "ytls-resize-tr";
    resizeBL.id = "ytls-resize-bl";
    resizeBR.id = "ytls-resize-br";

    // Resize state
    let isResizing = false;
    let resizeStartX: number = 0;
    let resizeStartY: number = 0;
    let resizeStartWidth: number = 0;
    let resizeStartHeight: number = 0;
    let resizeStartLeft: number = 0;
    let resizeStartTop: number = 0;
    let resizeEdge: "top-left" | "top-right" | "bottom-left" | "bottom-right" | null = null;

    function setupCorner(handle: HTMLElement, edge: "top-left" | "top-right" | "bottom-left" | "bottom-right") {
      handle.addEventListener("dblclick", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (pane) {
          pane.style.width = "300px";
          pane.style.height = "300px";
          savePanePosition();
          recalculateTimestampsArea();
        }
      });
      handle.addEventListener("mousedown", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        isResizing = true;
        resizeEdge = edge;
        resizeStartX = ev.clientX;
        resizeStartY = ev.clientY;
        const rect = pane.getBoundingClientRect();
        resizeStartWidth = rect.width;
        resizeStartHeight = rect.height;
        resizeStartLeft = rect.left;
        resizeStartTop = rect.top;
        // Set diagonal cursor indicator
        if (edge === "top-left" || edge === "bottom-right") document.body.style.cursor = "nwse-resize";
        else document.body.style.cursor = "nesw-resize";
      });
    }

    setupCorner(resizeTL, "top-left");
    setupCorner(resizeTR, "top-right");
    setupCorner(resizeBL, "bottom-left");
    setupCorner(resizeBR, "bottom-right");

    document.addEventListener("mousemove", (e) => {
      if (!isResizing || !pane || !resizeEdge) return;

      const deltaX = e.clientX - resizeStartX;
      const deltaY = e.clientY - resizeStartY;

      let newWidth = resizeStartWidth;
      let newHeight = resizeStartHeight;
      let newLeft = resizeStartLeft;
      let newTop = resizeStartTop;

      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;

      if (resizeEdge === "bottom-right") {
        newWidth = Math.max(200, Math.min(800, resizeStartWidth + deltaX));
        newHeight = Math.max(250, Math.min(viewportHeight, resizeStartHeight + deltaY));
      } else if (resizeEdge === "top-left") {
        newWidth = Math.max(200, Math.min(800, resizeStartWidth - deltaX));
        newLeft = resizeStartLeft + deltaX;
        newHeight = Math.max(250, Math.min(viewportHeight, resizeStartHeight - deltaY));
        newTop = resizeStartTop + deltaY;
      } else if (resizeEdge === "top-right") {
        newWidth = Math.max(200, Math.min(800, resizeStartWidth + deltaX));
        newHeight = Math.max(250, Math.min(viewportHeight, resizeStartHeight - deltaY));
        newTop = resizeStartTop + deltaY;
      } else if (resizeEdge === "bottom-left") {
        newWidth = Math.max(200, Math.min(800, resizeStartWidth - deltaX));
        newLeft = resizeStartLeft + deltaX;
        newHeight = Math.max(250, Math.min(viewportHeight, resizeStartHeight + deltaY));
      }

      // Clamp to viewport
      newLeft = Math.max(0, Math.min(newLeft, viewportWidth - newWidth));
      newTop = Math.max(0, Math.min(newTop, viewportHeight - newHeight));

      pane.style.width = `${newWidth}px`;
      pane.style.height = `${newHeight}px`;
      pane.style.left = `${newLeft}px`;
      pane.style.top = `${newTop}px`;
      pane.style.right = "auto";
      pane.style.bottom = "auto";
    });

    document.addEventListener("mouseup", () => {
      if (isResizing) {
        isResizing = false;
        resizeEdge = null;
        document.body.style.cursor = "";
        clampAndSavePanePosition(true);
      }
    });

    // Ensure the timestamps window is fully onscreen after resizing
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    window.addEventListener("resize", windowResizeHandler = () => {
      // Debounce position save - only save after resize is finished
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        // After resize finishes, clamp and save in a single helper
        clampAndSavePanePosition(true);
        resizeTimeout = null;
      }, 200);
    });


    header.appendChild(timeDisplay); // Add timeDisplay
    header.appendChild(versionWrapper); // Add version wrapper with indicator to header

    const content = document.createElement("div");
    content.id = "ytls-content";
    content.append(list); // Only the list is scrollable
    content.append(btns); // Buttons are always at the bottom of content

    pane.append(header, content, style, resizeTL, resizeTR, resizeBL, resizeBR); // Append header, content, style, and corner resize handles to the pane

    // Show diagonal cursors only on corners (no edge cursors)
    pane.addEventListener('mousemove', (ev) => {
      try {
        if (isDragging || isResizing) return;
        const rect = pane.getBoundingClientRect();
        const threshold = 20; // matches corner grab size
        const x = ev.clientX;
        const y = ev.clientY;
        const inLeft = x - rect.left <= threshold;
        const inRight = rect.right - x <= threshold;
        const inTop = y - rect.top <= threshold;
        const inBottom = rect.bottom - y <= threshold;
        let c = '';
        // Only show diagonal resize cursors when pointer is in a corner area
        if ((inTop && inLeft) || (inBottom && inRight)) c = 'nwse-resize';
        else if ((inTop && inRight) || (inBottom && inLeft)) c = 'nesw-resize';
        else c = '';
        document.body.style.cursor = c;
      } catch (e) {
        // ignore
      }
    });

    pane.addEventListener('mouseleave', () => {
      if (!isResizing && !isDragging) document.body.style.cursor = '';
    });

    // Dynamically set min-height: header + buttons + 1 li row
    function recalculateTimestampsArea() {
      if (pane && header && btns && list) {
        // Get bounding rectangles
        const paneRect = pane.getBoundingClientRect();
        const headerRect = header.getBoundingClientRect();
        const btnsRect = btns.getBoundingClientRect();
        // Calculate available height for the list
        const available = paneRect.height - (headerRect.height + btnsRect.height);
        list.style.maxHeight = available > 0 ? available + 'px' : '0px';
        list.style.overflowY = available > 0 ? 'auto' : 'hidden';
      }
    }
    (window as any).recalculateTimestampsArea = recalculateTimestampsArea;

    setTimeout(() => {
      recalculateTimestampsArea();
      // Also set minPaneHeight for drag/resize logic
      if (pane && header && btns && list) {
        let liH = 40;
        const itemsForSize = getTimestampItems();
        if (itemsForSize.length > 0) {
          liH = (itemsForSize[0] as HTMLElement).offsetHeight;
        } else {
          const tempLi = document.createElement('li');
          tempLi.style.visibility = 'hidden';
          tempLi.style.position = 'absolute';
          tempLi.textContent = '00:00 Example';
          // Append temporarily so we can measure
          list.appendChild(tempLi);
          liH = tempLi.offsetHeight;
          list.removeChild(tempLi);
        }
        minPaneHeight = header.offsetHeight + btns.offsetHeight + liH;
        pane.style.minHeight = minPaneHeight + 'px';
      }
    }, 0);

    // Recalculate on window and pane resize
    window.addEventListener('resize', recalculateTimestampsArea);
    new ResizeObserver(recalculateTimestampsArea).observe(pane);

    // Track pointer interactions globally to differentiate user-initiated focus changes
    if (!docPointerDownHandler) {
      document.addEventListener("pointerdown", docPointerDownHandler = () => {
        lastPointerDownTs = Date.now();
      }, true);
    }
    if (!docPointerUpHandler) {
      document.addEventListener("pointerup", docPointerUpHandler = () => {
        // no-op placeholder; reserved for future heuristics
      }, true);
    }
    } finally {
      isPaneInitializing = false;
    }
  }

  // Append the pane to the DOM and set up final UI
  async function displayPane() {
    if (!pane) return;

    // Remove any existing panes in the DOM (safety check)
    const existingPanes = document.querySelectorAll("#ytls-pane");
    existingPanes.forEach(el => {
      if (el !== pane) {
        log('Removing duplicate pane element from DOM');
        el.remove();
      }
    });

    // Prevent duplicate pane instances in the DOM
    if (document.body.contains(pane)) {
      log('Pane already in DOM, skipping append');
      return;
    }

    // Load the global UI visibility state BEFORE appending to DOM
    await loadUIVisibilityState();

    // Initialize Google Drive module callbacks using setter functions
    if (typeof (GoogleDrive as any).setBuildExportPayload === 'function') {
      (GoogleDrive as any).setBuildExportPayload(buildExportPayload);
    }
    if (typeof (GoogleDrive as any).setSaveGlobalSettings === 'function') {
      (GoogleDrive as any).setSaveGlobalSettings(saveGlobalSettings);
    }
    if (typeof (GoogleDrive as any).setLoadGlobalSettings === 'function') {
      (GoogleDrive as any).setLoadGlobalSettings(loadGlobalSettings);
    }
    if (typeof (GoogleDrive as any).setBackupStatusIndicator === 'function') {
      (GoogleDrive as any).setBackupStatusIndicator(backupStatusIndicator);
    }

    // Load Google auth state
    await GoogleDrive.loadGoogleAuthState();

    // Load auto backup settings and schedule if applicable
    await GoogleDrive.loadAutoBackupSettings();
    await GoogleDrive.scheduleAutoBackup();

    // Update backup status indicator after everything is loaded
    if (typeof (GoogleDrive as any).updateBackupStatusIndicator === 'function') {
      (GoogleDrive as any).updateBackupStatusIndicator();
    }

    // Aggressively ensure no duplicate panes exist before appending
    const allExistingPanes = document.querySelectorAll("#ytls-pane");
    if (allExistingPanes.length > 0) {
      log(`WARNING: Found ${allExistingPanes.length} existing pane(s) in DOM, removing all`);
      allExistingPanes.forEach(el => el.remove());
    }

    // Final safety check before append
    if (document.body.contains(pane)) {
      log('ERROR: Pane already in body, aborting append');
      return;
    }

    // Now append the pane with the correct minimized state already applied
    document.body.appendChild(pane);
    log('Pane successfully appended to DOM');
    // Hide timestamps until the initial display animation completes and schedule final sizing
    startShowAnimation();
    // Also schedule a follow-up after animation to catch final layout
    if (visibilitySizingTimeoutId) {
      clearTimeout(visibilitySizingTimeoutId);
      visibilitySizingTimeoutId = null;
    }
    visibilitySizingTimeoutId = setTimeout(() => {
      // If timestamps were deferred while animating, append them first so sizing sees them
      appendPendingTimestamps();
      if (typeof (window as any).recalculateTimestampsArea === 'function') (window as any).recalculateTimestampsArea();
      ensureMinPaneHeight();
      clampAndSavePanePosition(true);
      visibilitySizingTimeoutId = null;
    }, 450);

    // Install mutation observer to detect and prevent duplicate panes
    const paneObserver = new MutationObserver(() => {
      const panes = document.querySelectorAll("#ytls-pane");
      if (panes.length > 1) {
        log(`CRITICAL: Multiple panes detected (${panes.length}), removing duplicates`);
        panes.forEach((el, index) => {
          if (index > 0 || (pane && el !== pane)) {
            el.remove();
          }
        });
      }
    });
    paneObserver.observe(document.body, { childList: true, subtree: true });
  }

  function addHeaderButton(attempt = 0) {
    // Avoid creating duplicates
    if (document.getElementById("ytls-header-button")) {
      syncToggleButtons();
      return;
    }

    const logoElement = document.querySelector<HTMLElement>("#logo");
    if (!logoElement || !logoElement.parentElement) {
      if (attempt < 10) {
        setTimeout(() => addHeaderButton(attempt + 1), 300);
      }
      return;
    }

    const headerButton = document.createElement("button");
    headerButton.id = "ytls-header-button";
    headerButton.type = "button";
    headerButton.className = "ytls-header-button";
    addTooltip(headerButton, "Toggle Timekeeper UI");
    headerButton.setAttribute("aria-label", "Toggle Timekeeper UI");

    const headerIcon = document.createElement("img");
    headerIcon.src = HEADER_ICON_DEFAULT_URL;
    headerIcon.alt = "";
    headerIcon.decoding = "async";

    headerButton.appendChild(headerIcon);
    headerButtonImage = headerIcon;
    headerButton.addEventListener("mouseenter", () => {
      if (!headerButtonImage) return;
      isHeaderButtonHovered = true;
      headerButtonImage.src = HEADER_ICON_HOVER_URL;
    });
    headerButton.addEventListener("mouseleave", () => {
      if (!headerButtonImage) return;
      isHeaderButtonHovered = false;
      syncToggleButtons();
    });
    headerButton.addEventListener("click", () => {
      // Ensure pane is in DOM before toggling
      if (pane && !document.body.contains(pane)) {
        log('Pane not in DOM, re-appending before toggle');
        document.body.appendChild(pane);
      }
      togglePaneVisibility();
    });

    logoElement.insertAdjacentElement("afterend", headerButton);
    syncToggleButtons();
    log("Timekeeper header button added next to YouTube logo");
  }



  function setupUrlChangeHandlers() {
    if (urlChangeHandlersSetup) return;
    urlChangeHandlersSetup = true;

    const origPush = history.pushState;
    const origReplace = history.replaceState;

    function dispatchLocationChange() {
      try {
        const ev = new Event('locationchange');
        window.dispatchEvent(ev);
      } catch (e) {
        // ignore
      }
    }

    history.pushState = function () {
      const res = origPush.apply(this, arguments as any);
      dispatchLocationChange();
      return res;
    } as any;

    history.replaceState = function () {
      const res = origReplace.apply(this, arguments as any);
      dispatchLocationChange();
      return res;
    } as any;

    window.addEventListener('popstate', dispatchLocationChange);

    window.addEventListener('locationchange', () => {
      if (window.location.href !== lastHandledUrl) {
        log('Location changed (locationchange event) — deferring UI update until navigation finish');
      }
    });
  }

  // Add a function to handle URL changes
  async function handleUrlChange() {
    if (!isSupportedUrl()) {
      unloadTimekeeper();
      return;
    }

    // Track last handled URL so repeated history events don't trigger duplicate work
    lastHandledUrl = window.location.href;

    // Remove any duplicate panes BEFORE initialization
    document.querySelectorAll("#ytls-pane").forEach((el, idx) => {
      if (idx > 0 || (pane && el !== pane)) el.remove();
    });

    await waitForYouTubeReady();
    await initializePaneIfNeeded();

    currentLoadedVideoId = getVideoId(); // Update global video ID
    const pageTitle = document.title;
    log("Page Title:", pageTitle);
    log("Video ID:", currentLoadedVideoId);
    log("Current URL:", window.location.href);

    // Ensure the UI is locked and shows the loading placeholder while we fetch data for the new video
    setLoadingState(true);

    clearTimestampsDisplay();
    updateSeekbarMarkers();

    // loadTimestamps will get the videoId itself, load data from IndexedDB (migrating from localStorage if needed),
    await loadTimestamps();

    // Ensure seekbar markers are updated after timestamps are loaded
    updateSeekbarMarkers();

    // Set loading state to false after timestamps are loaded
    setLoadingState(false);
    log("Timestamps loaded and UI unlocked for video:", currentLoadedVideoId);

    // Display the pane after loading timestamps (with correct visibility state)
    await displayPane();

    addHeaderButton();

    // Setup video event listeners for highlighting and URL updates
    setupVideoEventListeners();
  }

  // Setup history-based URL handlers (pushState/replaceState/popstate) so SPA navigation triggers full redraw
  setupUrlChangeHandlers();

  // Listen for navigation start and lock UI with loading state
  window.addEventListener("yt-navigate-start", () => {
    log("Navigation started (yt-navigate-start event fired)");
    if (isSupportedUrl() && pane && list) {
      log("Locking UI and showing loading state for navigation");
      setLoadingState(true);
    }
  });

  // Keyboard shortcut: Ctrl+Alt+Shift+T to toggle Timekeeper UI
  keydownHandler = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.altKey && e.shiftKey && (e.key === "T" || e.key === "t")) {
      e.preventDefault();
      togglePaneVisibility();
      log("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)");
    }
  };
  document.addEventListener("keydown", keydownHandler);

  // Listen for navigation completion and load timestamps when navigation finishes
  window.addEventListener("yt-navigate-finish", () => {
    log("Navigation finished (yt-navigate-finish event fired)");
    // Only handle if the URL changed since last handled
    if (window.location.href !== lastHandledUrl) {
      handleUrlChange();
    } else {
      log("Navigation finished but URL already handled, skipping.");
    }
  });

  // Timekeeper initialization: ensure handlers are active and wait for navigation finish before drawing UI
  setupUrlChangeHandlers();

  log("Timekeeper initialized and waiting for navigation events");
})();
