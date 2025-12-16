// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      4.0.14
// @description  Enhanced timestamp tool for YouTube videos
// @author       Silent Shout
// @match        https://www.youtube.com/*
// @run-at       document-idle
// @noframes
// @icon         https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.setClipboard
// @homepageURL  https://github.com/KamoTimestamps/timekeeper
// @supportURL   https://github.com/KamoTimestamps/timekeeper/issues
// @downloadURL  https://raw.githubusercontent.com/KamoTimestamps/timekeeper/main/ts.user.js
// @updateURL    https://raw.githubusercontent.com/KamoTimestamps/timekeeper/main/ts.user.js
// @license MIT
// ==/UserScript==

const PANE_STYLES = `
  #ytls-pane {
    background: rgba(19, 19, 19, 0.8);
    text-align: left;
    position: fixed;
    bottom: 0;
    right: 0;
    padding: 0;
    margin: 0;
    border-radius: 12px; /* Add rounded corners */
    border: 1px solid rgba(85, 85, 85, 0.8); /* Add a thin grey border */
    opacity: 0.9;
    z-index: 5000;
    font-family: Arial, sans-serif;
    width: 300px;
    user-select: none; /* Prevent text selection in pane */
    display: flex;
    flex-direction: column;
  }
  #ytls-pane:hover {
    opacity: 1;
  }
  #ytls-pane ul {
    list-style: none;
    padding: 0;
    margin: 0;
    user-select: none; /* Prevent text selection in timestamp list */
    position: relative; /* Enable absolute positioning for loading message */
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  }
  #ytls-pane li {
    display: flex;
    flex-direction: column;
    padding: 8px 12px;
    margin: 0;
    border: none;
    border-top: 1px solid rgba(85, 85, 85, 0.8);
    user-select: none; /* Prevent text selection in timestamp items */
    box-sizing: border-box;
  }
  #ytls-pane li:first-child {
    border-top: none;
  }
  #ytls-pane li.ytls-timestamp-highlight {
    background: rgb(31, 37, 29);
  }
  #ytls-pane li.ytls-timestamp-pending-delete {
    background: rgba(128, 0, 0, 0.8);
  }
  #ytls-pane .time-row {
    display: flex;
    gap: 5px;
    align-items: center;
  }
  #ytls-pane .time-row a {
    flex-grow: 1; /* Allow the timestamp text to take up available space */
    max-width: 100%; /* Constrain the width to the parent container */
    text-align: left; /* Align the text to the left */
    overflow: hidden; /* Prevent overflow */
    text-overflow: ellipsis; /* Add ellipsis for long text */
    white-space: nowrap; /* Prevent wrapping */
  }
  #ytls-pane .ytls-marker {
    position: absolute;
    height: 100%;
    width: 2px;
    background-color: #ff0000;
    cursor: pointer;
  }
  #ytls-pane span,
  #ytls-pane a,
  #ytls-pane input {
    background: none;
    color: white;
    font-family: inherit;
    font-size: 14px;
    text-decoration: none;
    border: none;
    outline: none;
  }
  /* Ensure editing controls behave like editable fields despite parent user-select:none */
  #ytls-pane input,
  #ytls-pane textarea {
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
    caret-color: white;
  }
  #ytls-buttons {
    display: flex;
    gap: 5px;
    justify-content: space-between;
    padding: 10px;
  }
  #ytls-buttons button:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  /* Styles for main control buttons */
  .ytls-main-button {
    background: rgb(39, 39, 39);
    color: white;
    font-size: 24px;
    border: none;
    border-radius: 5px;
    padding: 5px;
    cursor: pointer;
  }
  .ytls-main-button:hover {
    background: rgb(63, 63, 63);
  }

  /* Pane header and utility styles */
  #ytls-pane-header {
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding: 10px 16px;
    white-space:nowrap;
    cursor:default;
    border-radius: 12px 12px 0px 0px;
    border: none;
    background:rgb(33, 33, 33);
  }
  #ytls-pane .ytls-version-display {
    font-size:14px;
    color:#666;
    margin-left:auto;
    padding-right:5px;
    cursor:default;
  }
  #ytls-current-time {
    color:white;
    font-size:14px;
    cursor:pointer;
    position:relative;
  }

  /* Shared modal container styles */
  #ytls-settings-modal,
  #ytls-save-modal,
  #ytls-load-modal {
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    background:#333;
    padding:20px;
    border-radius:10px;
    z-index:10000;
    color:white;
    text-align:center;
    width:300px;
    box-shadow:0 0 10px rgba(0,0,0,0.5);
  }

  /* Styles for settings modal */
  #ytls-settings-content {
    display:flex;
    flex-direction:column;
    gap:10px;
    align-items:center;
  }

  /* Styles for buttons in the settings modal */
  .ytls-settings-modal-button {
    width: 100%;
    height: 50px;
    background: #555;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5px; /* Add some spacing if needed */
  }
  .ytls-settings-modal-button:hover {
    background: #777; /* Example hover effect */
  }

  /* Shared styles for modal copy */
  #ytls-save-modal p,
  #ytls-load-modal p {
    margin-bottom:15px;
    font-size:16px;
  }
  .ytls-save-modal-button {
    background:#555;
    color:white;
    padding:10px 20px;
    border:none;
    border-radius:5px;
    cursor:pointer;
    margin-right:10px; /* Applied to both JSON and Text buttons, last one will have extra margin if not overridden */
  }
  .ytls-save-modal-button:last-of-type { /* Remove margin from the last button of this type in the modal */
    margin-right:0;
  }
  .ytls-save-modal-cancel-button {
    background:#444;
    color:white;
    padding:10px 20px;
    border:none;
    border-radius:5px;
    cursor:pointer;
    margin-top:15px;
    display:block;
    width:100%;
  }

  /* Styles for file operation buttons (Save, Load, Export, Import) if they were to be displayed directly */
  /* Note: These buttons (saveBtn, loadBtn, etc.) are not directly added to the UI with these styles. */
  /* Their onclick handlers are used by the settings modal buttons which use .ytls-settings-modal-button. */
  .ytls-file-operation-button {
    background: #555;
    color: white;
    font-size: 12px;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .ytls-file-operation-button:hover {
    background: #777; /* Example hover effect */
  }

  .ytls-hidden-file-input {
    display:none;
  }

  #ytls-header-button {
    align-items:center;
    background:transparent;
    border:none;
    color:var(--yt-spec-text-primary, currentColor);
    cursor:pointer;
    display:inline-flex;
    font-size:20px;
    height:40px;
    margin-left:6px;
    padding:0 6px;
    text-decoration:none;
  }
  #ytls-header-button:hover {
    color:var(--yt-spec-call-to-action, #3ea6ff);
  }
  #ytls-header-button:focus-visible {
    outline:2px solid var(--yt-spec-call-to-action, #3ea6ff);
    outline-offset:2px;
  }
  #ytls-header-button img {
    display:block;
    height:32px;
    max-width:48px;
    pointer-events:none;
    width:auto;
  }

  /* Shared fade animations for pane and modals */
  .ytls-fade-in {
    animation: fadeIn 0.3s ease-in-out forwards;
  }

  .ytls-fade-out {
    animation: fadeOut 0.3s ease-in-out forwards;
  }

  /* Zoom animations for pane expand/collapse */
  .ytls-zoom-in {
    animation: zoomIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    transform-origin: center center;
  }

  .ytls-zoom-out {
    animation: zoomOut 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    transform-origin: center center;
  }

  /* Fade-in animation for modals */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Fade-out animation for modals */
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  /* Zoom-in animation - expand from point */
  @keyframes zoomIn {
    from {
      opacity: 0;
      transform: scale(0.1);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Zoom-out animation - collapse to point */
  @keyframes zoomOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.1);
    }
  }

`;

(async function () {
    'use strict';
    if (window.top !== window.self) {
        return; // Don't run in iframes
    }
    const SUPPORTED_PATH_PREFIXES = ["/watch", "/live"];
    function isSupportedUrl(url = window.location.href) {
        try {
            const parsed = new URL(url);
            if (parsed.origin !== "https://www.youtube.com") {
                return false;
            }
            return SUPPORTED_PATH_PREFIXES.some(prefix => {
                return parsed.pathname === prefix || parsed.pathname.startsWith(`${prefix}/`);
            });
        }
        catch (err) {
            log("Timekeeper failed to parse URL for support check:", err, 'error');
            return false;
        }
    }
    let pane = null;
    let header = null;
    let list = null;
    let btns = null;
    let timeDisplay = null;
    let style = null;
    let versionDisplay = null;
    let timeUpdateIntervalId = null;
    let isLoadingTimestamps = false; // Track if timestamps are currently loading
    const TIMESTAMP_DELETE_CLASS = "ytls-timestamp-pending-delete";
    const TIMESTAMP_HIGHLIGHT_CLASS = "ytls-timestamp-highlight";
    const HEADER_ICON_DEFAULT_URL = "https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png";
    const HEADER_ICON_HOVER_URL = "https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_Eyebrow_64px_Indexed.png";
    // Preload header images once at script startup so they're cached for later use
    function preloadHeaderIcons() {
        const preloadImage = (url) => {
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
    function log(message, ...args) {
        // Check if last argument is a LogLevel
        let logLevel = 'debug';
        const consoleArgs = [...args];
        if (args.length > 0 && typeof args[args.length - 1] === 'string' &&
            ['debug', 'info', 'warn', 'error'].includes(args[args.length - 1])) {
            logLevel = consoleArgs.pop();
        }
        const version = GM_info.script.version;
        const prefix = `[Timekeeper v${version}]`;
        // Map LogLevel to console methods
        const methodMap = {
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
    function safePostMessage(message) {
        try {
            channel.postMessage(message);
        }
        catch (err) {
            log('BroadcastChannel error, reopening:', err, 'warn');
            try {
                channel = new BroadcastChannel('ytls_timestamp_channel');
                channel.onmessage = handleChannelMessage;
                channel.postMessage(message);
            }
            catch (reopenErr) {
                log('Failed to reopen BroadcastChannel:', reopenErr, 'error');
            }
        }
    }
    // Listen for messages from other tabs
    function handleChannelMessage(event) {
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
            }
            else if (event.data.type === 'window_position_updated' && pane) {
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
    let configuredOffset = await GM.getValue(OFFSET_KEY);
    if (typeof configuredOffset !== 'number' || Number.isNaN(configuredOffset)) {
        configuredOffset = DEFAULT_OFFSET;
        await GM.setValue(OFFSET_KEY, configuredOffset);
    }
    let configuredShiftSkip = await GM.getValue(SHIFT_SKIP_KEY);
    if (typeof configuredShiftSkip !== 'number' || Number.isNaN(configuredShiftSkip)) {
        configuredShiftSkip = DEFAULT_SHIFT_SKIP;
        await GM.setValue(SHIFT_SKIP_KEY, configuredShiftSkip);
    }
    let loadTimeoutId = null; // Variable to hold the timeout ID for debouncing loads from broadcast
    let commentSaveTimeouts = new Map(); // Track comment save timeouts per GUID
    let isMouseOverTimestamps = false; // Default to false
    let settingsModalInstance = null; // To keep a reference to the settings modal
    let settingsCogButtonElement = null; // To keep a reference to the settings cog button
    let currentLoadedVideoId = null; // Track the currently loaded video to prevent duplicate loads
    let currentLoadedVideoTitle = null; // Track the currently loaded video title
    let titleObserver = null; // Observer for title changes
    let visibilityAnimationTimeoutId = null;
    let headerButtonImage = null;
    let isHeaderButtonHovered = false;
    let lastSavedPanePosition = null;
    // Event listener references for cleanup to prevent memory leaks
    let documentMousemoveHandler = null;
    let documentMouseupHandler = null;
    let windowResizeHandler = null;
    let videoTimeupdateHandler = null;
    let videoPauseHandler = null;
    let keydownHandler = null;
    // Track pointer activity to distinguish intentional blur from OS UI (emoji picker)
    let docPointerDownHandler = null;
    let docPointerUpHandler = null;
    let lastPointerDownTs = 0;
    // Cache selection positions for inputs to restore after refocus
    const selectionCache = new WeakMap();
    // Cache horizontal scroll for inputs so we can restore it after value changes/focus changes
    const scrollCache = new WeakMap();
    // Suppress list-driven sorts while focus is temporarily lost to OS UI (e.g., emoji picker)
    let suppressSortUntilRefocus = false;
    // Track the most recently modified timestamp (GUID) for negative-diff-based sorting
    let mostRecentlyModifiedTimestampGuid = null;
    // Global cache for latest timestamp value
    let latestTimestampValue = null;
    function getTimestampItems() {
        return list ? Array.from(list.querySelectorAll('li')) : [];
    }
    // Utility to extract timestamp records from UI
    function extractTimestampRecords() {
        return getTimestampItems()
            .map(li => {
            const startLink = li.querySelector('a[data-time]');
            const timeValue = startLink?.dataset.time;
            if (!startLink || !timeValue)
                return null;
            const startTime = Number.parseInt(timeValue, 10);
            if (!Number.isFinite(startTime))
                return null;
            const commentInput = li.querySelector('input');
            const comment = commentInput?.value ?? '';
            const guid = li.dataset.guid ?? crypto.randomUUID();
            if (!li.dataset.guid)
                li.dataset.guid = guid;
            return { start: startTime, comment, guid };
        })
            .filter(isTimestampRecord);
    }
    function getLatestTimestampValue() {
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
    function hasNegativeTimeDifference(li) {
        const timeDiffSpan = li.querySelector('.time-diff');
        if (!timeDiffSpan)
            return false;
        const text = timeDiffSpan.textContent?.trim() || '';
        return text.startsWith('-');
    }
    function getIndentMarker(isIndented, isLast) {
        if (!isIndented)
            return "";
        return isLast ? "└─ " : "├─ ";
    }
    function extractIndentLevel(commentText) {
        // Check if comment starts with indent marker (├─ or └─)
        return (commentText.startsWith("├─ ") || commentText.startsWith("└─ ")) ? 1 : 0;
    }
    function removeIndentMarker(commentText) {
        return commentText.replace(/^[├└]─\s/, "");
    }
    /**
     * Determine the appropriate indent marker for a timestamp based on its position in the list.
     * @param itemIndex - The index of the timestamp to evaluate
     * @returns The marker to use when indenting: "├─ " (branch) or "└─ " (corner)
     */
    function determineIndentMarkerForIndex(itemIndex) {
        const items = getTimestampItems();
        // If it's the final item or no next item exists, use └─ (corner)
        if (itemIndex >= items.length - 1) {
            return "└─ ";
        }
        // Check if next item is indented
        const nextCommentInput = items[itemIndex + 1].querySelector('input');
        if (!nextCommentInput) {
            return "└─ ";
        }
        const nextIsIndented = extractIndentLevel(nextCommentInput.value) === 1;
        // Use ├─ (branch) if next is indented, └─ (corner) if unindented
        return nextIsIndented ? "├─ " : "└─ ";
    }
    function updateIndentMarkers() {
        if (!list)
            return;
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
                const commentInput = item.querySelector('input');
                if (!commentInput)
                    return;
                const isIndented = extractIndentLevel(commentInput.value) === 1;
                if (!isIndented)
                    return; // Skip non-indented items
                // Determine the marker based on what comes next
                // Default to ├─ (branch), only use └─ if next item is unindented or if this is the final item
                let isLastInSeries = false;
                if (index < items.length - 1) {
                    const nextCommentInput = items[index + 1].querySelector('input');
                    if (nextCommentInput) {
                        const nextIsIndented = extractIndentLevel(nextCommentInput.value) === 1;
                        // Use └─ (corner) only if next item is unindented, otherwise ├─ (branch)
                        isLastInSeries = !nextIsIndented;
                    }
                }
                else {
                    // Final item in list: treat as if followed by unindented, so use └─
                    isLastInSeries = true;
                }
                const cleanComment = removeIndentMarker(commentInput.value);
                const marker = getIndentMarker(true, isLastInSeries);
                const newValue = `${marker}${cleanComment}`;
                // If the marker changed, track that we made a change
                if (commentInput.value !== newValue) {
                    // Preserve caret and horizontal scroll if this is the active element
                    const wasActive = document.activeElement === commentInput;
                    const selStart = commentInput.selectionStart ?? commentInput.value.length;
                    const selEnd = commentInput.selectionEnd ?? selStart;
                    const prevScroll = commentInput.scrollLeft;
                    commentInput.value = newValue;
                    if (wasActive) {
                        try {
                            commentInput.setSelectionRange(selStart, selEnd);
                        }
                        catch { }
                        commentInput.scrollLeft = prevScroll;
                        selectionCache.set(commentInput, { start: selStart, end: selEnd });
                        scrollCache.set(commentInput, prevScroll);
                    }
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
        if (!list)
            return;
        while (list.firstChild) { // Clear the existing timestamps
            list.removeChild(list.firstChild);
        }
    }
    function setLoadingState(loading) {
        if (!pane || !list)
            return;
        isLoadingTimestamps = loading;
        if (loading) {
            // Fade out the pane during loading
            pane.classList.add("ytls-fade-out");
            pane.classList.remove("ytls-fade-in");
            // Hide after fade completes
            setTimeout(() => {
                pane.style.display = "none";
            }, 300);
        }
        else {
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
                        }
                        else {
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
    function isTimestampRecord(value) {
        return !!value && Number.isFinite(value.start) && typeof value.comment === "string" && typeof value.guid === "string";
    }
    // Helper function to build YouTube URL with timestamp parameter
    function buildYouTubeUrlWithTimestamp(timeInSeconds, currentUrl = window.location.href) {
        // Try to reuse the original URL structure
        try {
            const url = new URL(currentUrl);
            url.searchParams.set('t', `${timeInSeconds}s`);
            return url.toString();
        }
        catch {
            // Fallback if URL parsing fails: extract video ID and build from scratch
            const vid = currentUrl.search(/[?&]v=/) >= 0
                ? currentUrl.split(/[?&]v=/)[1].split(/&/)[0]
                : currentUrl.split(/\/live\/|\/shorts\/|\?|&/)[1];
            return `https://www.youtube.com/watch?v=${vid}&t=${timeInSeconds}s`;
        }
    }
    // Update existing calls to formatTimeString to pass only the timestamp value itself
    function formatTime(anchor, timeInSeconds) {
        // Format the timestamp based solely on its own value.
        anchor.textContent = formatTimeString(timeInSeconds);
        anchor.dataset.time = String(timeInSeconds);
        anchor.href = buildYouTubeUrlWithTimestamp(timeInSeconds, window.location.href);
    }
    // Debounce state for seeking
    let seekTimeoutId = null;
    let pendingSeekTime = null;
    let lastAutoHighlightedGuid = null;
    let isSeeking = false;
    // Detect whether playback is behind the live edge using YouTube player internals.
    function isBehindLiveEdge(playerInstance) {
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
    function highlightNearestTimestampAtTime(currentSeconds, shouldScroll) {
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
    function findNearestTimestamp(currentTime) {
        if (!Number.isFinite(currentTime)) {
            return null;
        }
        const items = getTimestampItems();
        if (items.length === 0) {
            return null;
        }
        let nearestLi = null;
        let largestTimestamp = -Infinity;
        for (const li of items) {
            const timeLink = li.querySelector('a[data-time]');
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
    function highlightTimestamp(li, shouldScroll = false) {
        if (!li)
            return;
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
    function offsetAllTimestamps(delta) {
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
            const anchor = li.querySelector('a[data-time]');
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
    function applyOffsetToAllTimestamps(delta, options = {}) {
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
    function handleClick(event) {
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
                if (player)
                    player.seekTo(newTime);
                setTimeout(() => { isSeeking = false; }, 500);
            }
            const clickedLi = target.closest('li');
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
        }
        else if (target.dataset.increment) {
            event.preventDefault();
            const linkContainer = target.parentElement;
            const timeLink = linkContainer?.querySelector('a[data-time]');
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
                    if (player)
                        player.seekTo(pendingSeekTime);
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
                const tsCommentInput = timestampLi.querySelector('input');
                const tsGuid = timestampLi.dataset.guid;
                if (tsCommentInput && tsGuid) {
                    saveSingleTimestampDirect(currentLoadedVideoId, tsGuid, newTime, tsCommentInput.value);
                    mostRecentlyModifiedTimestampGuid = tsGuid;
                }
            }
        }
        else if (target.dataset.action === "clear") {
            event.preventDefault();
            log('Timestamps changed: All timestamps cleared from UI');
            list.textContent = "";
            invalidateLatestTimestampValue();
            updateSeekbarMarkers();
            updateScroll();
            saveTimestamps(currentLoadedVideoId);
            mostRecentlyModifiedTimestampGuid = null;
        }
    }
    function addTimestamp(start, comment = "", doNotSave = false, guid = null) {
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
        const handleIndentToggle = (e) => {
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
            // Preserve caret and horizontal scroll for the active input
            const wasActive = document.activeElement === commentInput;
            const selStart = commentInput.selectionStart ?? commentInput.value.length;
            const selEnd = commentInput.selectionEnd ?? selStart;
            const prevScroll = commentInput.scrollLeft;
            commentInput.value = `${marker}${cleanComment}`;
            // Immediately update arrow icon
            updateArrowIcon();
            updateIndentMarkers();
            if (wasActive) {
                try {
                    commentInput.setSelectionRange(selStart, selEnd);
                }
                catch { }
                commentInput.scrollLeft = prevScroll;
                scrollCache.set(commentInput, prevScroll);
                selectionCache.set(commentInput, { start: selStart, end: selEnd });
            }
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
        commentInput.autocapitalize = "off";
        commentInput.autocomplete = "off";
        commentInput.spellcheck = false;
        // Keep selection cached to restore after OS-driven blur (e.g., emoji picker)
        const updateSelectionCache = () => {
            const start = commentInput.selectionStart ?? commentInput.value.length;
            const end = commentInput.selectionEnd ?? start;
            selectionCache.set(commentInput, { start, end });
        };
        const updateScrollCache = () => {
            scrollCache.set(commentInput, commentInput.scrollLeft);
        };
        commentInput.addEventListener("keyup", updateSelectionCache);
        commentInput.addEventListener("select", updateSelectionCache);
        commentInput.addEventListener("scroll", updateScrollCache);
        commentInput.addEventListener("input", updateScrollCache);
        commentInput.addEventListener("focusin", () => {
            suppressSortUntilRefocus = false;
        });
        // If blur occurs without recent pointer interaction and without a local focus target, restore focus
        commentInput.addEventListener("focusout", (ev) => {
            const rt = ev.relatedTarget;
            const recentPointer = Date.now() - lastPointerDownTs < 250;
            const movingWithinPane = !!rt && !!pane && pane.contains(rt);
            if (!recentPointer && !movingWithinPane) {
                suppressSortUntilRefocus = true;
                setTimeout(() => {
                    // If nothing else took focus, restore here
                    if (document.activeElement === document.body || document.activeElement == null) {
                        commentInput.focus({ preventScroll: true });
                        const sel = selectionCache.get(commentInput);
                        if (sel) {
                            try {
                                commentInput.setSelectionRange(sel.start, sel.end);
                            }
                            catch { }
                        }
                        const sl = scrollCache.get(commentInput);
                        if (typeof sl === 'number') {
                            commentInput.scrollLeft = sl;
                        }
                        suppressSortUntilRefocus = false;
                    }
                }, 0);
            }
        });
        // Save on input, but avoid saving mid-composition (IME/emoji picker)
        commentInput.addEventListener("input", (ev) => {
            const ie = ev;
            if (ie && (ie.isComposing || ie.inputType === "insertCompositionText")) {
                // Still refresh caret/scroll caches so focus restoration lands correctly post-emoji
                const start = commentInput.selectionStart ?? commentInput.value.length;
                const end = commentInput.selectionEnd ?? start;
                selectionCache.set(commentInput, { start, end });
                scrollCache.set(commentInput, commentInput.scrollLeft);
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
            // Let the finalized character land, then refresh caret and save
            setTimeout(() => {
                const start = commentInput.selectionStart ?? commentInput.value.length;
                const end = commentInput.selectionEnd ?? start;
                selectionCache.set(commentInput, { start, end });
                scrollCache.set(commentInput, commentInput.scrollLeft);
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
            }
            else {
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
                    const itemTime = Number.parseInt(li.querySelector('a[data-time]')?.dataset.time ?? "0", 10);
                    if (Number.isFinite(currentTime) && Number.isFinite(itemTime) && currentTime >= itemTime) {
                        li.classList.add(TIMESTAMP_HIGHLIGHT_CLASS);
                    }
                };
                // Add a click listener to cancel delete if clicking anywhere except the delete button
                const cancelDeleteOnClick = (event) => {
                    const target = event.target;
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
            const existingLink = existingLi.querySelector('a[data-time]');
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
                    const prevLink = prevLi.querySelector('a[data-time]');
                    const prevTimeStr = prevLink?.dataset.time;
                    if (prevTimeStr) {
                        const prevTime = Number.parseInt(prevTimeStr, 10);
                        if (Number.isFinite(prevTime)) {
                            timeDiff.textContent = formatTimeString(newTime - prevTime);
                        }
                    }
                }
                else {
                    timeDiff.textContent = "";
                }
                const nextTimeDiff = existingLi.querySelector('.time-diff');
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
                const lastLink = lastLi.querySelector('a[data-time]');
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
        return commentInput;
    }
    function updateTimeDifferences() {
        if (!list || list.querySelector('.ytls-error-message')) {
            return;
        }
        const items = getTimestampItems();
        items.forEach((item, index) => {
            const timeDiffSpan = item.querySelector('.time-diff');
            if (!timeDiffSpan) {
                return;
            }
            const timeLink = item.querySelector('a[data-time]');
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
            const prevLink = prevItem.querySelector('a[data-time]');
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
        let restoreState = null;
        if (document.activeElement instanceof HTMLInputElement && list.contains(document.activeElement)) {
            const activeInput = document.activeElement;
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
        const sortedItems = items
            .map(li => {
            const timeLink = li.querySelector('a[data-time]');
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
            .filter((item) => item !== null)
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
        // Restore caret/scroll to the previously focused input if it still exists
        if (restoreState) {
            const targetLi = getTimestampItems().find(li => li.dataset.guid === restoreState.guid);
            const targetInput = targetLi?.querySelector('input');
            if (targetInput) {
                try {
                    targetInput.focus({ preventScroll: true });
                    targetInput.setSelectionRange(restoreState.start, restoreState.end);
                    targetInput.scrollLeft = restoreState.scroll;
                    selectionCache.set(targetInput, { start: restoreState.start, end: restoreState.end });
                    scrollCache.set(targetInput, restoreState.scroll);
                }
                catch {
                    // If focus/selection fails, continue without breaking sort
                }
            }
        }
        log('Timestamps changed: Timestamps sorted');
        saveTimestamps(currentLoadedVideoId);
    }
    function updateScroll() {
        if (!list)
            return;
        const tsCount = list.children.length;
        if (tsCount > 2) {
            list.style.maxHeight = "200px";
            list.style.overflowY = "auto";
        }
        else {
            list.style.maxHeight = "none";
            list.style.overflowY = "hidden";
        }
    }
    function updateSeekbarMarkers() {
        if (!list)
            return;
        const video = getVideoElement();
        const progressBar = document.querySelector(".ytp-progress-bar");
        const player = getActivePlayer();
        const videoData = player ? player.getVideoData() : null;
        const isLiveStream = !!videoData && !!videoData.isLive;
        // Skip if video isn't ready, progress bar isn't found, or if it's a live stream
        if (!video || !progressBar || !isFinite(video.duration) || isLiveStream)
            return;
        removeSeekbarMarkers();
        const timestamps = getTimestampItems()
            .map(li => {
            const startLink = li.querySelector('a[data-time]');
            const timeValue = startLink?.dataset.time;
            if (!startLink || !timeValue) {
                return null;
            }
            const startTime = Number.parseInt(timeValue, 10);
            if (!Number.isFinite(startTime)) {
                return null;
            }
            const commentInput = li.querySelector('input');
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
                if (player)
                    player.seekTo(ts.start);
            });
            progressBar.appendChild(marker);
        });
    }
    function saveTimestamps(videoId) {
        if (!list || list.querySelector('.ytls-error-message'))
            return;
        if (!videoId)
            return;
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
    function extractSingleTimestampFromLi(li) {
        const anchor = li.querySelector('a[data-time]');
        const commentInput = li.querySelector('input');
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
    function saveSingleTimestamp(videoId, li) {
        if (!videoId || isLoadingTimestamps)
            return;
        const timestamp = extractSingleTimestampFromLi(li);
        if (!timestamp)
            return;
        saveSingleTimestampToIndexedDB(videoId, timestamp)
            .catch(err => log(`Failed to save timestamp ${timestamp.guid}:`, err, 'error'));
        safePostMessage({ type: 'timestamps_updated', videoId: videoId, action: 'saved' });
    }
    function saveSingleTimestampDirect(videoId, guid, start, comment) {
        if (!videoId || isLoadingTimestamps)
            return;
        const timestamp = { guid, start, comment };
        log(`Saving timestamp: guid=${guid}, start=${start}, comment="${comment}"`);
        saveSingleTimestampToIndexedDB(videoId, timestamp)
            .catch(err => log(`Failed to save timestamp ${guid}:`, err, 'error'));
        safePostMessage({ type: 'timestamps_updated', videoId: videoId, action: 'saved' });
    }
    function deleteSingleTimestamp(videoId, guid) {
        if (!videoId || isLoadingTimestamps)
            return;
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
        if (!videoId)
            return;
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
        }
        else if (format === "text") {
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
        if (!pane || !document.body.contains(pane))
            return;
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
        lastAutoHighlightedGuid = null;
        // Remove all event listeners to prevent memory leaks
        removeAllEventListeners();
        // Close the BroadcastChannel to prevent memory leaks
        try {
            channel.close();
        }
        catch (err) {
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
            if (!list || !shouldRestoreScroll)
                return;
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
                }
                else {
                    log(`No timestamps found in IndexedDB for ${videoId}`);
                }
            }
            catch (dbError) {
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
            }
            else {
                clearTimestampsDisplay(); // Ensure UI is cleared if no timestamps are found
                updateSeekbarMarkers(); // Ensure seekbar markers are cleared
            }
        }
        catch (err) {
            log("Unexpected error while loading timestamps:", err, 'error');
            displayPaneError("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.");
        }
        finally {
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
        const clipIdMeta = document.querySelector('meta[itemprop="identifier"]');
        if (clipIdMeta?.content) {
            return clipIdMeta.content; // Return the clip identifier if available
        }
        // Return null if no video ID or clip identifier is found
        return null;
    }
    function getVideoTitle() {
        // Get the video title from the meta tag
        const titleMeta = document.querySelector('meta[name="title"]');
        if (titleMeta?.content) {
            return titleMeta.content;
        }
        // Fallback to document.title if meta tag not found
        return document.title.replace(' - YouTube', '');
    }
    function setupVideoEventListeners() {
        const video = getVideoElement();
        if (!video)
            return;
        // Handler for timeupdate: always highlight the nearest timestamp
        const handleTimeUpdate = () => {
            if (!list)
                return;
            const player = getActivePlayer();
            const currentTime = player ? Math.floor(player.getCurrentTime()) : 0;
            if (!Number.isFinite(currentTime))
                return;
            const nearestLi = findNearestTimestamp(currentTime);
            highlightTimestamp(nearestLi, false);
        };
        // Helper function to update URL t parameter
        const updateUrlTimeParam = (seconds) => {
            try {
                const url = new URL(window.location.href);
                if (seconds !== null && Number.isFinite(seconds)) {
                    url.searchParams.set('t', `${Math.floor(seconds)}s`);
                }
                else {
                    url.searchParams.delete('t');
                }
                window.history.replaceState({}, '', url.toString());
            }
            catch (err) {
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
            if (!video)
                return;
            const player = getActivePlayer();
            const currentTime = player ? Math.floor(player.getCurrentTime()) : 0;
            if (!Number.isFinite(currentTime))
                return;
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
    let dbConnection = null;
    let dbConnectionPromise = null;
    // Get or create the database connection
    function getDB() {
        // If we have a valid connection, return it
        if (dbConnection) {
            try {
                // Verify the connection is actually usable by checking objectStoreNames
                // This will throw if the connection is closed
                const isValid = dbConnection.objectStoreNames.length >= 0;
                if (isValid) {
                    return Promise.resolve(dbConnection);
                }
            }
            catch (err) {
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
    async function exportAllTimestamps() {
        const exportData = {};
        try {
            // Get all timestamps from v2 store
            const allTimestamps = await getAllFromIndexedDB(STORE_NAME_V2);
            // Group timestamps by video_id
            const videoGroups = new Map();
            for (const record of allTimestamps) {
                const ts = record;
                if (!videoGroups.has(ts.video_id)) {
                    videoGroups.set(ts.video_id, []);
                }
                videoGroups.get(ts.video_id).push({
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
        }
        catch (err) {
            log("Failed to export data:", err, 'error');
            throw err;
        }
    }
    function openIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = event => {
                const db = event.target.result;
                const oldVersion = event.oldVersion;
                const transaction = event.target.transaction;
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
                            const v1Records = exportRequest.result;
                            if (v1Records.length > 0) {
                                try {
                                    const exportData = {};
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
                                }
                                catch (err) {
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
                            const v1Records = getAllRequest.result;
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
                resolve(event.target.result);
            };
            request.onerror = event => {
                const error = event.target.error;
                reject(error ?? new Error('Failed to open IndexedDB'));
            };
        });
    }
    // Helper to execute a transaction with error handling
    function executeTransaction(storeName, mode, operation) {
        return getDB().then(db => {
            return new Promise((resolve, reject) => {
                let tx;
                try {
                    tx = db.transaction(storeName, mode);
                }
                catch (err) {
                    reject(new Error(`Failed to create transaction for ${storeName}: ${err}`));
                    return;
                }
                const store = tx.objectStore(storeName);
                let request;
                try {
                    request = operation(store);
                }
                catch (err) {
                    reject(new Error(`Failed to execute operation on ${storeName}: ${err}`));
                    return;
                }
                if (request) {
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error ?? new Error(`IndexedDB ${mode} operation failed`));
                }
                tx.oncomplete = () => {
                    if (!request)
                        resolve(undefined);
                };
                tx.onerror = () => reject(tx.error ?? new Error(`IndexedDB transaction failed`));
                tx.onabort = () => reject(tx.error ?? new Error(`IndexedDB transaction aborted`));
            });
        });
    }
    function saveToIndexedDB(videoId, data) {
        // Save to v2 store only
        return getDB().then(db => {
            return new Promise((resolve, reject) => {
                let tx;
                try {
                    tx = db.transaction([STORE_NAME_V2], 'readwrite');
                }
                catch (err) {
                    reject(new Error(`Failed to create transaction: ${err}`));
                    return;
                }
                const v2Store = tx.objectStore(STORE_NAME_V2);
                const v2Index = v2Store.index('video_id');
                // Get existing records for this video
                const getRequest = v2Index.getAll(IDBKeyRange.only(videoId));
                getRequest.onsuccess = () => {
                    try {
                        const existingRecords = getRequest.result;
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
                    }
                    catch (err) {
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
    function saveSingleTimestampToIndexedDB(videoId, timestamp) {
        // Save single timestamp to v2 store only
        return getDB().then(db => {
            return new Promise((resolve, reject) => {
                let tx;
                try {
                    tx = db.transaction([STORE_NAME_V2], 'readwrite');
                }
                catch (err) {
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
    function deleteSingleTimestampFromIndexedDB(videoId, guid) {
        // Delete single timestamp from v2 store only
        return getDB().then(db => {
            return new Promise((resolve, reject) => {
                let tx;
                try {
                    tx = db.transaction([STORE_NAME_V2], 'readwrite');
                }
                catch (err) {
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
    function loadFromIndexedDB(videoId) {
        // Load from v2 store only
        return getDB().then(db => {
            return new Promise((resolve, reject) => {
                let tx;
                try {
                    tx = db.transaction([STORE_NAME_V2], 'readonly');
                }
                catch (err) {
                    log('Failed to create read transaction:', err, 'warn');
                    resolve(null);
                    return;
                }
                const v2Store = tx.objectStore(STORE_NAME_V2);
                const v2Index = v2Store.index('video_id');
                const v2Request = v2Index.getAll(IDBKeyRange.only(videoId));
                v2Request.onsuccess = () => {
                    const v2Records = v2Request.result;
                    if (v2Records.length > 0) {
                        // Found data in v2 store
                        const timestamps = v2Records.map(r => ({
                            guid: r.guid,
                            start: r.start,
                            comment: r.comment
                        })).sort((a, b) => a.start - b.start);
                        resolve(timestamps);
                    }
                    else {
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
    function removeFromIndexedDB(videoId) {
        // Remove all timestamps for a video from v2 store
        return getDB().then(db => {
            return new Promise((resolve, reject) => {
                let tx;
                try {
                    tx = db.transaction([STORE_NAME_V2], 'readwrite');
                }
                catch (err) {
                    reject(new Error(`Failed to create transaction: ${err}`));
                    return;
                }
                const v2Store = tx.objectStore(STORE_NAME_V2);
                const v2Index = v2Store.index('video_id');
                const getRequest = v2Index.getAll(IDBKeyRange.only(videoId));
                getRequest.onsuccess = () => {
                    try {
                        const records = getRequest.result;
                        records.forEach(record => {
                            v2Store.delete(record.guid);
                        });
                    }
                    catch (err) {
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
    function getAllFromIndexedDB(storeName) {
        return executeTransaction(storeName, 'readonly', (store) => {
            return store.getAll();
        }).then(result => {
            return Array.isArray(result) ? result : [];
        });
    }
    function saveGlobalSettings(key, value) {
        executeTransaction(SETTINGS_STORE_NAME, 'readwrite', (store) => {
            store.put({ key, value });
        }).catch(err => {
            log(`Failed to save setting '${key}' to IndexedDB:`, err, 'error');
        });
    }
    function loadGlobalSettings(key) {
        return executeTransaction(SETTINGS_STORE_NAME, 'readonly', (store) => {
            return store.get(key);
        }).then(result => {
            return result?.value;
        }).catch(err => {
            log(`Failed to load setting '${key}' from IndexedDB:`, err, 'error');
            return undefined;
        });
    }
    function saveUIVisibilityState() {
        if (!pane)
            return;
        const isVisible = pane.style.display !== "none";
        saveGlobalSettings('uiVisible', isVisible);
    }
    function syncToggleButtons(visibilityOverride) {
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
        if (!pane)
            return;
        loadGlobalSettings('uiVisible').then(value => {
            const isVisible = value;
            if (typeof isVisible === 'boolean') {
                if (isVisible) {
                    pane.style.display = "flex";
                    // Apply zoom-in animation when showing initially
                    pane.classList.remove("ytls-zoom-out");
                    pane.classList.add("ytls-zoom-in");
                }
                else {
                    pane.style.display = "none";
                }
                syncToggleButtons(isVisible);
            }
            else {
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
    function togglePaneVisibility(force) {
        if (!pane)
            return;
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
        }
        else {
            pane.classList.remove("ytls-fade-in");
            pane.classList.remove("ytls-zoom-in");
            pane.classList.add("ytls-zoom-out");
            syncToggleButtons(false);
            visibilityAnimationTimeoutId = setTimeout(() => {
                if (!pane)
                    return;
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
            }
            else if (typeof parsed === 'object' && parsed !== null) {
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
                                const commentInput = existingLi.querySelector('input');
                                if (commentInput) {
                                    // Preserve horizontal scroll if focused element matches this input
                                    const wasActive = document.activeElement === commentInput;
                                    const selStart = commentInput.selectionStart ?? commentInput.value.length;
                                    const selEnd = commentInput.selectionEnd ?? selStart;
                                    const prevScroll = commentInput.scrollLeft;
                                    commentInput.value = ts.comment;
                                    if (wasActive) {
                                        try {
                                            commentInput.setSelectionRange(selStart, selEnd);
                                        }
                                        catch { }
                                        commentInput.scrollLeft = prevScroll;
                                        selectionCache.set(commentInput, { start: selStart, end: selEnd });
                                        scrollCache.set(commentInput, prevScroll);
                                    }
                                }
                            }
                            else {
                                addTimestamp(ts.start, ts.comment, false, ts.guid);
                            }
                        }
                        else {
                            addTimestamp(ts.start, ts.comment, false, crypto.randomUUID());
                        }
                    });
                    processedSuccessfully = true;
                }
                else {
                    log("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.", 'warn');
                }
            }
            else {
                log("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.", 'warn');
            }
        }
        catch (e) {
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
                        let existingLi;
                        if (guid) {
                            existingLi = getTimestampItems().find(li => li.dataset.guid === guid);
                        }
                        if (!existingLi && !guid) {
                            existingLi = getTimestampItems().find(li => {
                                if (li.dataset.guid) {
                                    return false;
                                }
                                const timeLink = li.querySelector('a[data-time]');
                                const timeValue = timeLink?.dataset.time;
                                if (!timeValue) {
                                    return false;
                                }
                                const time = Number.parseInt(timeValue, 10);
                                return Number.isFinite(time) && time === start;
                            });
                        }
                        if (existingLi) {
                            const commentInput = existingLi.querySelector('input');
                            if (commentInput) {
                                commentInput.value = comment;
                            }
                        }
                        else {
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
        }
        else {
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
            suppressSortUntilRefocus = false;
        });
        list.addEventListener("mouseleave", () => {
            isMouseOverTimestamps = false;
            if (suppressSortUntilRefocus) {
                return;
            }
            const player = getActivePlayer();
            const currentTime = player ? Math.floor(player.getCurrentTime()) : getLatestTimestampValue();
            highlightNearestTimestampAtTime(currentTime, true);
            // Preserve focus on the currently focused timestamp when sorting
            let focusedTimestampGuid = null;
            if (document.activeElement instanceof HTMLInputElement && list.contains(document.activeElement)) {
                const activeLi = document.activeElement.closest('li');
                focusedTimestampGuid = activeLi?.dataset.guid ?? null;
            }
            // Sort and restore focus
            sortTimestampsAndUpdateDisplay();
            if (focusedTimestampGuid) {
                const targetLi = getTimestampItems().find(li => li.dataset.guid === focusedTimestampGuid);
                const targetInput = targetLi?.querySelector('input');
                if (targetInput) {
                    try {
                        targetInput.focus({ preventScroll: true });
                    }
                    catch {
                        // Focus restoration failed, continue
                    }
                }
            }
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
            if (player)
                player.seekToLiveHead();
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
                }
                else {
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
            let holdTimer = null;
            let holdStartTime = 0;
            let progressAnimationFrame = null;
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
                if (!holdStartTime)
                    return;
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
                        }
                        catch (err) {
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
            }
            else {
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
                        const file = event.target.files?.[0];
                        if (!file)
                            return;
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
                        }
                        else {
                            alert("Clipboard is empty.");
                        }
                    }
                    catch (err) {
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
            }
            catch (err) {
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
                const file = event.target.files?.[0];
                if (!file)
                    return;
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const importedData = JSON.parse(String(reader.result));
                        const importPromises = [];
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
                                }
                                else {
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
                    }
                    catch (e) {
                        alert("Failed to import data. Please ensure the file is in the correct format.\n" + e.message);
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
            if (!pane)
                return;
            log('Loading window position from IndexedDB');
            loadGlobalSettings('windowPosition').then(value => {
                if (value && typeof value.x === 'number' && typeof value.y === 'number') {
                    const pos = value;
                    pane.style.left = `${pos.x}px`;
                    pane.style.top = `${pos.y}px`;
                    pane.style.right = "auto";
                    pane.style.bottom = "auto";
                    lastSavedPanePosition = {
                        x: Math.max(0, Math.round(pos.x)),
                        y: Math.max(0, Math.round(pos.y))
                    };
                }
                else {
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
            if (!pane)
                return;
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
        let offsetX;
        let offsetY;
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
            if (!isDragging)
                return;
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
            if (!isDragging)
                return;
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
        let resizeTimeout = null;
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
        const content = document.createElement("div");
        content.id = "ytls-content";
        content.append(list, btns); // list and btns are now directly in content; header is separate
        pane.append(header, content, style); // Append header, then content, then style to the pane
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
    }
    // Append the pane to the DOM and set up final UI
    async function displayPane() {
        if (!pane)
            return;
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
        const logoElement = document.querySelector("#logo");
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
            if (!headerButtonImage)
                return;
            isHeaderButtonHovered = true;
            headerButtonImage.src = HEADER_ICON_HOVER_URL;
        });
        headerButton.addEventListener("mouseleave", () => {
            if (!headerButtonImage)
                return;
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
            if (idx > 0)
                el.remove();
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
    keydownHandler = (e) => {
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

