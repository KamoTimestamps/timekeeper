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

(async function () {
  'use strict';

  if (window.top !== window.self) {
    return; // Don't run in iframes
  }

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

  // Unified logging function with log level support
  type LogLevel = 'debug' | 'info' | 'warn' | 'error';

  function log(message: string, ...args: any[]) {
    // Check if last argument is a LogLevel
    let logLevel: LogLevel = 'debug';
    const consoleArgs = [...args];

    if (args.length > 0 && typeof args[args.length - 1] === 'string' &&
      ['debug', 'info', 'warn', 'error'].includes(args[args.length - 1])) {
      logLevel = consoleArgs.pop() as LogLevel;
    }

    const version = GM_info.script.version;
    const prefix = `[Timekeeper v${version}]`;

    // Map LogLevel to console methods
    const methodMap: Record<LogLevel, (...args: any[]) => void> = {
      'debug': console.log,
      'info': console.info,
      'warn': console.warn,
      'error': console.error
    };

    const consoleMethod = methodMap[logLevel];
    consoleMethod(`${prefix} ${message}`, ...consoleArgs);
  }

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
          pane.style.left = `${Math.max(0, pos.x)}px`;
          pane.style.top = `${Math.max(0, pos.y)}px`;
          pane.style.right = "auto";
          pane.style.bottom = "auto";
          lastSavedPanePosition = {
            x: Math.max(0, Math.round(pos.x)),
            y: Math.max(0, Math.round(pos.y))
          };
          clampPaneToViewport();
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
  let currentLoadedVideoTitle: string | null = null; // Track the currently loaded video title
  let titleObserver: MutationObserver | null = null; // Observer for title changes
  let visibilityAnimationTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let headerButtonImage: HTMLImageElement | null = null;
  let isHeaderButtonHovered = false;
  let lastSavedPanePosition: { x: number; y: number } | null = null;

  // Event listener references for cleanup to prevent memory leaks
  let documentMousemoveHandler: ((e: MouseEvent) => void) | null = null;
  let documentMouseupHandler: (() => void) | null = null;
  let windowResizeHandler: (() => void) | null = null;
  let videoTimeupdateHandler: (() => void) | null = null;
  let videoPauseHandler: (() => void) | null = null;
  let keydownHandler: ((e: KeyboardEvent) => void) | null = null;

  type TimestampRecord = {
    start: number;
    comment: string;
    guid: string;
  };


  // Global cache for latest timestamp value
  let latestTimestampValue: number | null = null;


  function getTimestampItems(): HTMLLIElement[] {
    return list ? Array.from(list.querySelectorAll<HTMLLIElement>('li')) : [];
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

  function getTimestampSuffix() {
    const now = new Date();
    return now.getUTCFullYear() +
      '-' + String(now.getUTCMonth() + 1).padStart(2, '0') +
      '-' + String(now.getUTCDate()).padStart(2, '0') +
      '--' + String(now.getUTCHours()).padStart(2, '0') +
      '-' + String(now.getUTCMinutes()).padStart(2, '0') +
      '-' + String(now.getUTCSeconds()).padStart(2, '0');
  }

  function clearTimestampsDisplay() {
    if (!list) return;
    while (list.firstChild) { // Clear the existing timestamps
      list.removeChild(list.firstChild);
    }
  }

  function setLoadingState(loading: boolean) {
    if (!pane || !list) return;

    isLoadingTimestamps = loading;

    if (loading) {
      // Fade out the pane during loading
      pane.classList.add("ytls-fade-out");
      pane.classList.remove("ytls-fade-in");
      // Hide after fade completes
      setTimeout(() => {
        pane.style.display = "none";
      }, 300);
    } else {
      // Show the pane when loading is done
      pane.style.display = "";
      // Fade in after showing
      pane.classList.remove("ytls-fade-out");
      pane.classList.add("ytls-fade-in");

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

          const timestamps = list ? Array.from(list.children).map(li => {
            const timeLink = li.querySelector('a[data-time]');
            return timeLink ? parseFloat(timeLink.getAttribute('data-time')) : 0;
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

    syncToggleButtons();
  }

  // Helper function to format timestamps based on total duration
  function formatTimeString(seconds, videoDuration = seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = String(seconds % 60).padStart(2, "0");

    // For times under 1 hour, show M:SS or MM:SS
    if (videoDuration < 3600) {
      return `${m < 10 ? m : String(m).padStart(2, "0")}:${s}`;
    }

    // For times with hours, show H:MM:SS or HH:MM:SS
    return `${videoDuration >= 36000 ? String(h).padStart(2, "0") : h}:${String(m).padStart(2, "0")}:${s}`;
  }

  function isTimestampRecord(value: TimestampRecord | null | undefined): value is TimestampRecord {
    return !!value && Number.isFinite(value.start) && typeof value.comment === "string" && typeof value.guid === "string";
  }

  // Helper function to build YouTube URL with timestamp parameter
  function buildYouTubeUrlWithTimestamp(timeInSeconds: number, currentUrl: string = window.location.href): string {
    // Try to reuse the original URL structure
    try {
      const url = new URL(currentUrl);
      url.searchParams.set('t', `${timeInSeconds}s`);
      return url.toString();
    } catch {
      // Fallback if URL parsing fails: extract video ID and build from scratch
      const vid = currentUrl.search(/[?&]v=/) >= 0
        ? currentUrl.split(/[?&]v=/)[1].split(/&/)[0]
        : currentUrl.split(/\/live\/|\/shorts\/|\?|&/)[1];
      return `https://www.youtube.com/watch?v=${vid}&t=${timeInSeconds}s`;
    }
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
  let manualHighlightGuid: string | null = null;
  let manualHighlightTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastAutoHighlightedGuid: string | null = null;
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
    const nearestGuid = nearestLi?.dataset.guid ?? null;

    if (nearestGuid) {
      lastAutoHighlightedGuid = nearestGuid;
    }

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
    let smallestDifference = Infinity;

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
      const difference = Math.abs(currentTime - timestamp);
      if (difference < smallestDifference) {
        smallestDifference = difference;
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
          manualHighlightGuid = clickedLi.dataset.guid ?? null;
          if (manualHighlightTimeoutId) {
            clearTimeout(manualHighlightTimeoutId);
          }
          manualHighlightTimeoutId = setTimeout(() => {
            manualHighlightGuid = null;
            manualHighlightTimeoutId = null;
          }, 10000); // Clear manual highlight after 10 seconds
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
      if (timestampLi) {
        manualHighlightGuid = timestampLi.dataset.guid ?? null;
        if (manualHighlightTimeoutId) {
          clearTimeout(manualHighlightTimeoutId);
        }
        manualHighlightTimeoutId = setTimeout(() => {
          manualHighlightGuid = null;
          manualHighlightTimeoutId = null;
        }, 10000);
      }

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
        }
      }
    } else if (target.dataset.action === "clear") {
      event.preventDefault();
      log('Timestamps changed: All timestamps cleared from UI');
      list.textContent = "";
      invalidateLatestTimestampValue();
      updateSeekbarMarkers();
      updateScroll();
      saveTimestamps(currentLoadedVideoId);
    }
  }

  function addTimestamp(start: number, comment = "", doNotSave = false, guid: string | null = null) {
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
    indentGutter.title = "Click to toggle indent";

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

    commentInput.value = comment || "";
    commentInput.style.cssText = "width:100%;margin-top:5px;display:block;";
    commentInput.addEventListener("input", () => {
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
    record.title = "Set to current playback time";
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

    const items = getTimestampItems();
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
    log('Timestamps changed: Timestamps sorted');
    saveTimestamps(currentLoadedVideoId);
  }

  function updateScroll() {
    if (!list) return;
    const tsCount = list.children.length;
    if (tsCount > 2) {
      list.style.maxHeight = "200px";
      list.style.overflowY = "auto";
    } else {
      list.style.maxHeight = "none";
      list.style.overflowY = "hidden";
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

  function saveTimestamps(videoId: string) {
    if (!list || list.querySelector('.ytls-error-message')) return;
    if (!videoId) return;
    // Prevent saving during loading state to avoid race conditions
    if (isLoadingTimestamps) {
      log('Save blocked: timestamps are currently loading');
      return;
    }
    updateIndentMarkers();
    const currentTimestampsFromUI = extractTimestampRecords().sort((a, b) => a.start - b.start);
    saveToIndexedDB(videoId, currentTimestampsFromUI)
      .then(() => log(`Successfully saved ${currentTimestampsFromUI.length} timestamps for ${videoId} to IndexedDB`))
      .catch(err => log(`Failed to save timestamps for ${videoId} to IndexedDB:`, err, 'error'));
    safePostMessage({ type: 'timestamps_updated', videoId: videoId, action: 'saved' });
  }

  function extractSingleTimestampFromLi(li: HTMLLIElement): TimestampRecord | null {
    const anchor = li.querySelector<HTMLAnchorElement>('a[data-time]');
    const commentInput = li.querySelector<HTMLInputElement>('input');
    const guid = li.dataset.guid;

    if (!anchor || !commentInput || !guid) {
      return null;
    }

    const time = Number.parseInt(anchor.dataset.time ?? "0", 10);
    return {
      start: time,
      comment: commentInput.value,
      guid: guid
    };
  }

  function saveSingleTimestamp(videoId: string | null | undefined, li: HTMLLIElement) {
    if (!videoId || isLoadingTimestamps) return;

    const timestamp = extractSingleTimestampFromLi(li);
    if (!timestamp) return;

    saveSingleTimestampToIndexedDB(videoId, timestamp)
      .catch(err => log(`Failed to save timestamp ${timestamp.guid}:`, err, 'error'));

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

    if (manualHighlightTimeoutId) {
      clearTimeout(manualHighlightTimeoutId);
      manualHighlightTimeoutId = null;
    }

    manualHighlightGuid = null;
    lastAutoHighlightedGuid = null;

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
    currentLoadedVideoTitle = null;

    // Disconnect title observer
    if (titleObserver) {
      titleObserver.disconnect();
      titleObserver = null;
    }

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

      // Update the video title tooltip on the time display
      if (timeDisplay && currentLoadedVideoTitle) {
        timeDisplay.title = currentLoadedVideoTitle;
      }

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
        clearTimestampsDisplay();
        updateSeekbarMarkers();
        return;
      }

      if (finalTimestampsToDisplay.length > 0) {
        finalTimestampsToDisplay.sort((a, b) => a.start - b.start); // Sort by start time
        clearTimestampsDisplay();
        finalTimestampsToDisplay.forEach(ts => {
          // Pass the GUID when loading timestamps (indent is now embedded in comment)
          addTimestamp(ts.start, ts.comment, true, ts.guid);
        });
        updateIndentMarkers();
        updateSeekbarMarkers();

        const playerForHighlight = getActivePlayer();
        const currentTimeForHighlight = playerForHighlight
          ? Math.floor(playerForHighlight.getCurrentTime())
          : getLatestTimestampValue();
        if (Number.isFinite(currentTimeForHighlight)) {
          highlightNearestTimestampAtTime(currentTimeForHighlight, true);
          shouldRestoreScroll = false;
        }
      } else {
        clearTimestampsDisplay(); // Ensure UI is cleared if no timestamps are found
        updateSeekbarMarkers(); // Ensure seekbar markers are cleared
      }
    } catch (err) {
      log("Unexpected error while loading timestamps:", err, 'error');
      displayPaneError("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.");
    } finally {
      requestAnimationFrame(restoreScrollPosition);
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

  function getVideoTitle(): string {
    // Get the video title from the meta tag
    const titleMeta = document.querySelector<HTMLMetaElement>('meta[name="title"]');
    if (titleMeta?.content) {
      return titleMeta.content;
    }
    // Fallback to document.title if meta tag not found
    return document.title.replace(' - YouTube', '');
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

  // Standalone export function to export all timestamps to a timekeeper-data file
  async function exportAllTimestamps(): Promise<void> {
    const exportData = {} as Record<string, unknown>;

    try {
      // Get all timestamps from v2 store
      const allTimestamps = await getAllFromIndexedDB(STORE_NAME_V2);

      // Group timestamps by video_id
      const videoGroups = new Map<string, TimestampRecord[]>();
      for (const record of allTimestamps) {
        const ts = record as {guid: string; video_id: string; start: number; comment: string};
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

      // Create a JSON file for export
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const timestampSuffix = getTimestampSuffix();
      a.download = `timekeeper-data-${timestampSuffix}.json`;
      a.click();
      URL.revokeObjectURL(url);

      log(`Exported ${videoGroups.size} videos with ${allTimestamps.length} timestamps`);
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
            const existingGuids = new Set(existingRecords.map(r => r.guid));
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
      return new Promise<TimestampRecord[] | null>((resolve, reject) => {
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
    if (!pane) return;

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
    } else {
      pane.classList.remove("ytls-fade-in");
      pane.classList.remove("ytls-zoom-in");
      pane.classList.add("ytls-zoom-out");
      syncToggleButtons(false);
      visibilityAnimationTimeoutId = setTimeout(() => {
        if (!pane) return;
        pane.style.display = "none";
        saveUIVisibilityState();
        visibilityAnimationTimeoutId = null;
      }, 400);
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
    if (pane && document.body.contains(pane)) {
      return;
    }

    // Remove any stray panes before creating a new one
    document.querySelectorAll("#ytls-pane").forEach(el => el.remove());

    pane = document.createElement("div");
    header = document.createElement("div");
    list = document.createElement("ul");
    btns = document.createElement("div");
    timeDisplay = document.createElement("span");
    style = document.createElement("style");
    versionDisplay = document.createElement("span");

    // Add event listeners to `list` after it is initialized
    list.addEventListener("mouseenter", () => {
      isMouseOverTimestamps = true;
       });

    list.addEventListener("mouseleave", () => {
      isMouseOverTimestamps = false;
      const player = getActivePlayer();
      const currentTime = player ? Math.floor(player.getCurrentTime()) : getLatestTimestampValue();
      highlightNearestTimestampAtTime(currentTime, true);
      sortTimestampsAndUpdateDisplay();
    });

  pane.id = "ytls-pane";
  header.id = "ytls-pane-header";

  header.addEventListener("dblclick", (event) => {
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (target && (target.closest("a") || target.closest("button") || target.closest("#ytls-current-time") || target.closest(".ytls-version-display"))) {
      return;
    }
    event.preventDefault();
    togglePaneVisibility(false);
  });

    const scriptVersion = GM_info.script.version; // Get script version
    versionDisplay.textContent = `v${scriptVersion}`;
    versionDisplay.classList.add("ytls-version-display"); // Add class for CSS targeting

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

      const timestamps = list ? Array.from(list.children).map(li => {
        const timeLink = li.querySelector('a[data-time]');
        return timeLink ? parseFloat(timeLink.getAttribute('data-time')) : 0;
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
        modal.id = "ytls-save-modal";
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

        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel";
        cancelButton.classList.add("ytls-save-modal-cancel-button");
        cancelButton.onclick = () => {
          modal.classList.remove("ytls-fade-in");
          modal.classList.add("ytls-fade-out");
          setTimeout(() => {
            if (document.body.contains(modal)) {
              document.body.removeChild(modal);
            }
          }, 300);
        };

        modal.appendChild(message);
        modal.appendChild(videoIdDisplay);
        modal.appendChild(confirmButton);
        modal.appendChild(cancelButton);
        document.body.appendChild(modal);
      };

    // Configuration for main buttons
    const mainButtonConfigs = [
      { label: "🐣", title: "Add timestamp", action: handleAddTimestamp },
      { label: "⚙️", title: "Settings", action: toggleSettingsModal }, // Changed action
      { label: "📋", title: "Copy timestamps to clipboard", action: handleCopyTimestamps },
        { label: "⏱️", title: "Offset all timestamps", action: handleBulkOffset },
      { label: "🗑️", title: "Delete all timestamps for current video", action: handleDeleteAll }
    ];

    // Create and append main buttons
    mainButtonConfigs.forEach(config => {
      const button = document.createElement("button");
      button.textContent = config.label;
      button.title = config.title;
      button.classList.add("ytls-main-button");
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
      button.title = title;
      button.classList.add("ytls-settings-modal-button");
      button.onclick = onClick;
      return button;
    }

    // Function to create and toggle the settings modal
    function toggleSettingsModal() {
      if (settingsModalInstance && settingsModalInstance.parentNode === document.body) {
        // Modal exists and is visible, so close it with fade-out
        settingsModalInstance.classList.remove("ytls-fade-in");
        settingsModalInstance.classList.add("ytls-fade-out");
        setTimeout(() => {
          if (document.body.contains(settingsModalInstance)) {
            document.body.removeChild(settingsModalInstance);
          }
          settingsModalInstance = null;
          document.removeEventListener('click', handleClickOutsideSettingsModal, true); // Remove click-outside listener
        }, 300); // Match animation duration
        return;
      }

      // Modal doesn't exist or isn't visible, so create and show it
      settingsModalInstance = document.createElement("div");
      settingsModalInstance.id = "ytls-settings-modal";
      settingsModalInstance.classList.remove("ytls-fade-out");
      settingsModalInstance.classList.add("ytls-fade-in");

      const settingsContent = document.createElement("div");
      settingsContent.id = "ytls-settings-content";

      const buttonConfigs = [
        { label: "💾 Save", title: "Save As...", action: saveBtn.onclick }, // Assuming saveBtn.onclick shows another modal
        { label: "📂 Load", title: "Load", action: loadBtn.onclick },
        { label: "📤 Export All", title: "Export All Data", action: exportBtn.onclick },
        { label: "📥 Import All", title: "Import All Data", action: importBtn.onclick },
        {
          label: "Close", title: "Close", action: () => {
            if (settingsModalInstance && settingsModalInstance.parentNode === document.body) {
              settingsModalInstance.classList.remove("ytls-fade-in");
              settingsModalInstance.classList.add("ytls-fade-out");
              setTimeout(() => {
                if (document.body.contains(settingsModalInstance)) {
                  document.body.removeChild(settingsModalInstance);
                }
                settingsModalInstance = null;
                document.removeEventListener('click', handleClickOutsideSettingsModal, true);
              }, 300); // Match animation duration
            }
          }
        }
      ];

      buttonConfigs.forEach(({ label, title, action }) => {
        const button = createButton(label, title, action);
        settingsContent.appendChild(button);
      });

      settingsModalInstance.appendChild(settingsContent);
      document.body.appendChild(settingsModalInstance);

      // Add click-outside listener
      // Use setTimeout to ensure this listener is added after the current click event cycle
      setTimeout(() => {
        document.addEventListener('click', handleClickOutsideSettingsModal, true);
      }, 0);
    }

    function handleClickOutsideSettingsModal(event) {
      // If the click is on the cog button itself, let toggleSettingsModal handle it
      if (settingsCogButtonElement && settingsCogButtonElement.contains(event.target)) {
        return;
      }

      if (settingsModalInstance && !settingsModalInstance.contains(event.target)) {
        // Clicked outside the modal
        if (settingsModalInstance.parentNode === document.body) {
          settingsModalInstance.classList.remove("ytls-fade-in");
          settingsModalInstance.classList.add("ytls-fade-out");
          setTimeout(() => {
            if (document.body.contains(settingsModalInstance)) {
              document.body.removeChild(settingsModalInstance);
            }
            settingsModalInstance = null;
            document.removeEventListener('click', handleClickOutsideSettingsModal, true);
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
      modal.id = "ytls-save-modal"; // Added ID
      modal.classList.remove("ytls-fade-out");
      modal.classList.add("ytls-fade-in");

      const message = document.createElement("p");
      message.textContent = "Save as:";

      const jsonButton = document.createElement("button");
      jsonButton.textContent = "JSON";
      jsonButton.classList.add("ytls-save-modal-button"); // Added class
      jsonButton.onclick = () => {
        modal.classList.remove("ytls-fade-in");
        modal.classList.add("ytls-fade-out");
        setTimeout(() => {
          saveTimestampsAs("json");
          if (document.body.contains(modal)) {
            document.body.removeChild(modal);
          }
        }, 300); // Match animation duration
      };

      const textButton = document.createElement("button");
      textButton.textContent = "Plain Text";
      textButton.classList.add("ytls-save-modal-button"); // Added class
      textButton.onclick = () => {
        modal.classList.remove("ytls-fade-in");
        modal.classList.add("ytls-fade-out");
        setTimeout(() => {
          saveTimestampsAs("text");
          if (document.body.contains(modal)) {
            document.body.removeChild(modal);
          }
        }, 300); // Match animation duration
      };

      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Cancel";
      cancelButton.classList.add("ytls-save-modal-cancel-button"); // Added class
      cancelButton.onclick = () => {
        modal.classList.remove("ytls-fade-in");
        modal.classList.add("ytls-fade-out");
        setTimeout(() => {
          if (document.body.contains(modal)) {
            document.body.removeChild(modal);
          }
        }, 300); // Match animation duration
      };

      modal.appendChild(message);
      modal.appendChild(jsonButton);
      modal.appendChild(textButton);
      modal.appendChild(cancelButton);
      document.body.appendChild(modal);
    };

    // Add a load button to the buttons section
    const loadBtn = document.createElement("button");
    loadBtn.textContent = "📂 Load";
    loadBtn.classList.add("ytls-file-operation-button");
    loadBtn.onclick = () => {
      // Create a modal for choosing load source
      const loadModal = document.createElement("div");
      loadModal.id = "ytls-load-modal"; // Added ID
      loadModal.classList.remove("ytls-fade-out");
      loadModal.classList.add("ytls-fade-in");

      const loadMessage = document.createElement("p");
      loadMessage.textContent = "Load from:";

      const fromFileButton = document.createElement("button");
      fromFileButton.textContent = "File";
  fromFileButton.classList.add("ytls-save-modal-button");
      fromFileButton.onclick = () => {
        loadModal.classList.remove("ytls-fade-in");
        loadModal.classList.add("ytls-fade-out");
        setTimeout(() => {
          if (document.body.contains(loadModal)) {
            document.body.removeChild(loadModal);
          }
          // Create a hidden file input element
          const fileInput = document.createElement("input");
          fileInput.type = "file";
          fileInput.accept = ".json,.txt"; // Accept JSON and plain text files
          fileInput.classList.add("ytls-hidden-file-input"); // Added class

          fileInput.onchange = (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
              const content = String(reader.result).trim();
              processImportedData(content);
            };
            reader.readAsText(file);
          };
          fileInput.click();
        }, 300); // Match animation duration
      };

      const fromClipboardButton = document.createElement("button");
      fromClipboardButton.textContent = "Clipboard";
  fromClipboardButton.classList.add("ytls-save-modal-button");
      fromClipboardButton.onclick = async () => {
        loadModal.classList.remove("ytls-fade-in");
        loadModal.classList.add("ytls-fade-out");
        setTimeout(async () => {
          if (document.body.contains(loadModal)) {
            document.body.removeChild(loadModal);
          }
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
        }, 300); // Match animation duration
      };

      const cancelLoadButton = document.createElement("button");
      cancelLoadButton.textContent = "Cancel";
  cancelLoadButton.classList.add("ytls-save-modal-cancel-button");
      cancelLoadButton.onclick = () => {
        loadModal.classList.remove("ytls-fade-in");
        loadModal.classList.add("ytls-fade-out");
        setTimeout(() => {
          if (document.body.contains(loadModal)) {
            document.body.removeChild(loadModal);
          }
        }, 300); // Match animation duration
      };

      loadModal.appendChild(loadMessage);
      loadModal.appendChild(fromFileButton);
      loadModal.appendChild(fromClipboardButton);
      loadModal.appendChild(cancelLoadButton);
      document.body.appendChild(loadModal);
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

    // Load pane position from IndexedDB settings
    function loadPanePosition() {
      if (!pane) return;
      log('Loading window position from IndexedDB');
      loadGlobalSettings('windowPosition').then(value => {
        if (value && typeof (value as any).x === 'number' && typeof (value as any).y === 'number') {
          const pos = value as { x: number; y: number };
          pane.style.left = `${pos.x}px`;
          pane.style.top = `${pos.y}px`;
          pane.style.right = "auto";
          pane.style.bottom = "auto";
          lastSavedPanePosition = {
            x: Math.max(0, Math.round(pos.x)),
            y: Math.max(0, Math.round(pos.y))
          };
        } else {
          log('No window position found in IndexedDB, leaving default position');
          lastSavedPanePosition = null;
        }
        clampPaneToViewport();
        const rect = pane.getBoundingClientRect();
        if (rect.width || rect.height) {
          lastSavedPanePosition = {
            x: Math.max(0, Math.round(rect.left)),
            y: Math.max(0, Math.round(rect.top))
          };
        }
      }).catch(err => {
        log("failed to load pane position from IndexedDB:", err, 'warn');
        clampPaneToViewport();
        const rect = pane.getBoundingClientRect();
        if (rect.width || rect.height) {
          lastSavedPanePosition = {
            x: Math.max(0, Math.round(rect.left)),
            y: Math.max(0, Math.round(rect.top))
          };
        }
      });
    }
    function savePanePosition() {
      if (!pane) return;

      const rect = pane.getBoundingClientRect();
      const positionData = {
        x: Math.max(0, Math.round(rect.left)),
        y: Math.max(0, Math.round(rect.top))
      };

      if (lastSavedPanePosition &&
        lastSavedPanePosition.x === positionData.x &&
        lastSavedPanePosition.y === positionData.y) {
        log('Skipping window position save; position unchanged');
        return;
      }

      lastSavedPanePosition = { ...positionData };
      log(`Saving window position to IndexedDB: x=${positionData.x}, y=${positionData.y}`);
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

    // Ensure the timestamps window is fully onscreen after resizing
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    window.addEventListener("resize", windowResizeHandler = () => {
      // Debounce position save - only save after resize is finished
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        clampPaneToViewport();
        savePanePosition();
        resizeTimeout = null;
      }, 200);
    });

    header.appendChild(timeDisplay); // Add timeDisplay
    header.appendChild(versionDisplay); // Add versionDisplay to header

    const content = document.createElement("div"); content.id = "ytls-content";
    content.append(list, btns); // list and btns are now directly in content; header is separate

    pane.append(header, content, style); // Append header, then content, then style to the pane
  }

  // Append the pane to the DOM and set up final UI
  async function displayPane() {
    if (!pane) return;

    // Load the global UI visibility state BEFORE appending to DOM
    await loadUIVisibilityState();

    // Now append the pane with the correct minimized state already applied
    document.body.appendChild(pane);
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
    headerButton.title = "Toggle Timekeeper UI";
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
      togglePaneVisibility();
    });

    logoElement.insertAdjacentElement("afterend", headerButton);
    syncToggleButtons();
    log("Timekeeper header button added next to YouTube logo");
  }

  // Setup observer to watch for title changes
  function setupTitleObserver() {
    if (titleObserver) {
      return; // Already set up
    }

    titleObserver = new MutationObserver(() => {
      const newTitle = getVideoTitle();
      if (newTitle !== currentLoadedVideoTitle) {
        currentLoadedVideoTitle = newTitle;
        if (timeDisplay) {
          timeDisplay.title = currentLoadedVideoTitle;
          log("Video title changed, updated tooltip:", currentLoadedVideoTitle);
        }
      }
    });

    // Watch for changes to the title meta tag
    const titleMeta = document.querySelector('meta[name="title"]');
    if (titleMeta) {
      titleObserver.observe(titleMeta, { attributes: true, attributeFilter: ['content'] });
    }
    // Also watch document.title changes as fallback
    const titleElement = document.querySelector('title');
    if (titleElement) {
      titleObserver.observe(titleElement, { childList: true, characterData: true, subtree: true });
    }

    log("Title observer initialized");
  }

  // Add a function to handle URL changes
  async function handleUrlChange() {
    if (!isSupportedUrl()) {
      unloadTimekeeper();
      return;
    }

    await waitForYouTubeReady();
    await initializePaneIfNeeded();

    // Remove any duplicate panes before proceeding
    document.querySelectorAll("#ytls-pane").forEach((el, idx) => {
      if (idx > 0) el.remove();
    });

    currentLoadedVideoId = getVideoId(); // Update global video ID
    currentLoadedVideoTitle = getVideoTitle(); // Update global video title
    const pageTitle = document.title;
    log("Page Title:", pageTitle);
    log("Video ID:", currentLoadedVideoId);
    log("Video Title:", currentLoadedVideoTitle);
    log("Current URL:", window.location.href);

    // Update the video title tooltip whenever video changes
    if (timeDisplay && currentLoadedVideoTitle) {
      timeDisplay.title = currentLoadedVideoTitle;
    }

    // Setup title observer on first run
    setupTitleObserver();

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
    handleUrlChange();
  });

  // Timekeeper initialization will occur on first yt-navigate-finish event
  log("Timekeeper initialized and waiting for navigation events");
})();
