// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      3.1.5
// @description  Enhanced timestamp tool for YouTube videos
// @author       Silent Shout
// @match        https://www.youtube.com/*
// @run-at       document-idle
// @noframes
// @icon         data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%2272px%22 font-size=%2272px%22>⏲️</text></svg>
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.setClipboard
// @homepageURL  https://github.com/KamoTimestamps/timekeeper
// @supportURL   https://github.com/KamoTimestamps/timekeeper/issues
// @downloadURL  https://raw.githubusercontent.com/KamoTimestamps/timekeeper/main/ts.user.js
// @updateURL    https://raw.githubusercontent.com/KamoTimestamps/timekeeper/main/ts.user.js
// @license MIT
// ==/UserScript==

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
            console.error("Timekeeper failed to parse URL for support check:", err);
            return false;
        }
    }
    let pane = null;
    let header = null;
    let list = null;
    let btns = null;
    let timeDisplay = null;
    let style = null;
    let minimizeBtn = null;
    let versionDisplay = null;
    let timeUpdateIntervalId = null;
    let lastViewportWidth = window.innerWidth;
    let lastViewportHeight = window.innerHeight;
    let pendingStoredViewport = null;
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
    function getCurrentTimeCompat() {
        const player = getActivePlayer();
        if (player && typeof player.getCurrentTime === "function") {
            try {
                return player.getCurrentTime();
            }
            catch (err) {
                logWarn("fallback: player.getCurrentTime failed, using video element.", err);
            }
        }
        const video = getVideoElement();
        return video ? video.currentTime || 0 : 0;
    }
    function seekToCompat(seconds, allowSeekAhead = true) {
        const player = getActivePlayer();
        if (player && typeof player.seekTo === "function") {
            try {
                player.seekTo(seconds, allowSeekAhead);
                return true;
            }
            catch (err) {
                logWarn("fallback: player.seekTo failed, using video element.", err);
            }
        }
        const video = getVideoElement();
        if (video) {
            video.currentTime = seconds;
            return true;
        }
        return false;
    }
    function getPlayerStateCompat() {
        const player = getActivePlayer();
        if (player && typeof player.getPlayerState === "function") {
            try {
                return player.getPlayerState();
            }
            catch (err) {
                logWarn("fallback: player.getPlayerState failed, using video element.", err);
            }
        }
        const video = getVideoElement();
        if (!video) {
            return -1; // unstarted/unknown
        }
        if (video.ended) {
            return 0; // ended
        }
        if (video.paused) {
            return 2; // paused
        }
        return 1; // playing
    }
    function seekToLiveHeadCompat() {
        const player = getActivePlayer();
        if (player && typeof player.seekToLiveHead === "function") {
            try {
                player.seekToLiveHead();
                return true;
            }
            catch (err) {
                logWarn("fallback: player.seekToLiveHead failed, using video element.", err);
            }
        }
        // TODO: Need a way to detect whether or not the video is a live stream before attempting this
        // As is, it just seeks to the end of the video, which you don't want for VODs.
        // const video = getVideoElement();
        // if (video && video.seekable && video.seekable.length > 0) {
        //   const liveEdge = video.seekable.end(video.seekable.length - 1);
        //   video.currentTime = liveEdge;
        //   return true;
        // }
        return false;
    }
    function getVideoDataCompat() {
        const player = getActivePlayer();
        if (player && typeof player.getVideoData === "function") {
            try {
                return player.getVideoData();
            }
            catch (err) {
                logWarn("fallback: player.getVideoData failed, using video element.", err);
            }
        }
        const video = getVideoElement();
        if (!video) {
            return { isLive: false };
        }
        const duration = video.duration;
        const isLive = !Number.isFinite(duration) || duration === Infinity;
        return { isLive };
    }
    function getDurationCompat() {
        const player = getActivePlayer();
        if (player && typeof player.getDuration === "function") {
            try {
                return player.getDuration();
            }
            catch (err) {
                logWarn("fallback: player.getDuration failed, using video element.", err);
            }
        }
        const video = getVideoElement();
        return video ? video.duration || 0 : 0;
    }
    // Configuration for timestamp offset
    const OFFSET_KEY = "timestampOffsetSeconds";
    const DEFAULT_OFFSET = -5;
    // Configuration for shift-click time skip interval
    const SHIFT_SKIP_KEY = "shiftClickTimeSkipSeconds";
    const DEFAULT_SHIFT_SKIP = 10;
    // Logging function that prefixes all messages with [Timekeeper]
    function log(message, ...args) {
        console.log(`[Timekeeper] ${message}`, ...args);
    }
    function logWarn(message, ...args) {
        console.warn(`[Timekeeper] ${message}`, ...args);
    }
    // Create a BroadcastChannel for cross-tab communication
    const channel = new BroadcastChannel('ytls_timestamp_channel');
    // Listen for messages from other tabs
    channel.onmessage = (event) => {
        log('Received message from another tab:', event.data);
        if (!isSupportedUrl() || !list || !pane) {
            return;
        }
        if (event.data && event.data.type === 'timestamps_updated' && event.data.videoId === getVideoId()) {
            log('Debouncing timestamp load due to external update for video:', event.data.videoId);
            clearTimeout(loadTimeoutId); // Clear existing load timeout
            loadTimeoutId = setTimeout(() => {
                log('Reloading timestamps due to external update for video:', event.data.videoId);
                loadTimestamps();
            }, 500); // Set new timeout to load after 500ms
        }
    };
    // Function to calculate SHA-256 checksum for a string using Web Crypto API
    async function calculateSHA256(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
        return hashHex;
    }
    // SHA-256 checksums of unlisted video IDs
    const unlistedVideos = [
        "0f56203c7e6752d8eb5841402ce4d8d92911e34bcccf659b55b00b8c4984e8e2",
        "4d71f8bfd4e8e313a04f8dfa02e193555b996381b398d90b6b57812a634cbb38",
        "79946442e52bb1a58c403abf0afad9b100f1138564a27f7317be7b60c9414de5",
        "e0724969699f84ed462938ffa8ee400ca1618036ef8eba63c9144afc58db426f",
        "ea6a60748c857f61b57f4674b17df30d8bb45ad8a4073dceb69eec5e87ab0518",
        "74a37dc5af3e3ef371407bfe11c15d335666cf247eda2089a0bdcce087aae222",
        "d4b2c0477a4064d3df5389751bb94a417b52acdcf9001fdecbaf8cf9600b1709",
        "e9c2da2a44cd011c8a8f0304a54918658e04285f172313c4f4c68a0bde2dcd85",
        "2e65c921f773133a58e8e230aca54b935e11dcf131371fcde7871787af170be6",
        "d321d25925cda8542c75bb698d1d5024d59befde0c2c18c174c2eda4f9d0222b",
        "336e7f9a2723fc3f24722a686fc5e15a45185bdfda7f844389fb70784e109fdb",
        "8a56bf2876f2e16feb6009c2638f821dc4e053e0d6169eae1b0ae91161ad5b97",
        "e121e1c02c691df273e965d9dfb82aac880f8b26fde816f722d825f1c279db39",
        "590bd83ca5f5f6e3871f0f96136bd23721aac6e4d2be67acf69a6c269f38e7f3",
        "c4dd9fdf15af44255e939607f373977d4b59c583690e8747b437a3443887c83b",
        "66c0422eadb640dadb3abb1de3d07dcfa5f58e5f134ce1b7278f04fdf5be39fd",
        "0df446f1832be948120e1d86034fba90d58b1c4c445e85e91ebbe80d65e9e702",
        "ec3a5466558bf18f3541ddfa57e3f7a278070debdae4ba8aad757230c6dbfb93",
        "6b65b77895ded8a274691207787ee3cd543ab0556c07f2f420783de07b1de26c",
        "9139db27a4fade29cca1ffc53573f89aa9fa6cffe08c3487cab8db1cbd7bb1ea",
        "a6437fd71ac65eb1fa0c4eac39433be00aec45ff7fd64976697f35e7c920094b",
        "4bf77ad4863b4dd22cd59415cc85af3cebbdbfeb2637c8b58cfbd2015ef8bb7b",
        "2947f746580463d08ccd57e41a35925376a4bde0f78dfcde940295f04a48c41b",
        "9bd7e4a54cdd6fd1bce97ff2ac14f272cc5c7b44165a61320efd939247c878fd",
        "02efb0ecb86135a382490d9ebf5fb5c99d4b701afc4a55dfe4d69121712e2c10",
        "d4d44d5f0c285df5d70ce6e214370857eb09c0f0d82ebb9959f30e53277362c3",
    ];
    const membersOnlyVideos = [
        '6qRwsGJXV2k',
        '7tq1YGVdPx4',
        '7xpy9DhEdDo',
        'DDMh3FTUAGA',
        'dZSuq11ChGk',
        'eGwpa2OmQMY',
        'GQ89hSaSff4',
        'I6xrkDABPw4',
        'J8Da7DgGgtM',
        'N1dFWp2rdvo',
        'QYlDf09X4FE',
        'scnoaETm-Bc',
        'teWSxSxIws0',
        'ttayh3dZXTk',
        'vh2Kb-DFkY0',
        'YT0AahfOhYg'
    ];
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
    let saveTimeoutId = null; // Variable to hold the timeout ID for debouncing
    let loadTimeoutId = null; // Variable to hold the timeout ID for debouncing loads from broadcast
    let isMouseOverTimestamps = false; // Default to false
    let settingsModalInstance = null; // To keep a reference to the settings modal
    let settingsCogButtonElement = null; // To keep a reference to the settings cog button
    function getTimestampItems() {
        if (!list) {
            return [];
        }
        return Array.from(list.querySelectorAll('li'));
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
    // Update existing calls to formatTimeString to pass video duration
    function formatTime(anchor, timeInSeconds) {
        const video = document.querySelector("video");
        const rawDuration = video?.duration;
        const videoDuration = rawDuration && Number.isFinite(rawDuration) ? Math.floor(rawDuration) : 0;
        anchor.textContent = formatTimeString(timeInSeconds, videoDuration);
        anchor.dataset.time = String(timeInSeconds);
        const vid = location.search.split(/.+v=|&/)[1] || location.href.split(/\/live\/|\/shorts\/|\?|&/)[1];
        anchor.href = `https://www.youtube.com/watch?v=${vid}&t=${timeInSeconds}`;
    }
    // Helper function to update browser URL with timestamp
    function updateBrowserUrlWithTimestamp(timeInSeconds) {
        const pathname = window.location.pathname;
        const search = window.location.search;
        const isValidPath = (pathname.startsWith('/watch') && search != "") || pathname.startsWith('/live/');
        if (!isValidPath) {
            return;
        }
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('t', `${timeInSeconds}s`);
        history.replaceState({}, '', currentUrl.toString()); // Use replaceState to avoid adding a new history entry
    }
    // Debounce state for seeking
    let seekTimeoutId = null;
    let pendingSeekTime = null;
    function handleClick(event) {
        if (!list) {
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
                seekToCompat(newTime);
            }
            const clickedLi = target.closest('li');
            if (clickedLi) {
                getTimestampItems().forEach(item => {
                    if (item.style.background !== "darkred") {
                        item.style.background = "rgba(255, 255, 255, 0.05)";
                    }
                });
                if (clickedLi.style.background !== "darkred") {
                    clickedLi.style.background = "rgba(0, 128, 255, 0.2)";
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
            const newTime = Math.max(0, currTime + increment);
            console.log(`Timestamps changed: Timestamp time incremented from ${currTime} to ${newTime}`);
            formatTime(timeLink, newTime);
            pendingSeekTime = newTime;
            if (seekTimeoutId) {
                clearTimeout(seekTimeoutId);
            }
            seekTimeoutId = setTimeout(() => {
                if (pendingSeekTime !== null) {
                    seekToCompat(pendingSeekTime);
                }
                if (getPlayerStateCompat() === 2) {
                    const playButton = document.querySelector(".ytp-play-button");
                    playButton?.click();
                }
                seekTimeoutId = null;
                pendingSeekTime = null;
            }, 500);
            updateTimeDifferences();
            updateSeekbarMarkers();
            debouncedSaveTimestamps();
        }
        else if (target.dataset.action === "clear") {
            event.preventDefault();
            console.log('Timestamps changed: All timestamps cleared from UI');
            list.textContent = "";
            updateSeekbarMarkers();
            updateScroll();
            debouncedSaveTimestamps();
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
        minus.textContent = "➖";
        minus.dataset.increment = "-1";
        minus.style.cursor = "pointer";
        plus.textContent = "➕";
        plus.dataset.increment = "1";
        plus.style.cursor = "pointer";
        record.textContent = "⏺️";
        record.style.cursor = "pointer";
        record.style.margin = "0 5px";
        record.title = "Set to current playback time";
        record.onclick = () => {
            const currentTime = Math.floor(getCurrentTimeCompat());
            if (Number.isFinite(currentTime)) {
                console.log(`Timestamps changed: Timestamp time set to current playback time ${currentTime}`);
                formatTime(anchor, currentTime);
                updateTimeDifferences();
                debouncedSaveTimestamps();
            }
        };
        formatTime(anchor, sanitizedStart);
        commentInput.value = comment || "";
        commentInput.style.cssText = "width:100%;margin-top:5px;display:block;";
        commentInput.addEventListener("input", () => {
            console.log('Timestamps changed: Comment modified');
            debouncedSaveTimestamps();
        });
        del.textContent = "🗑️";
        del.style.cssText = "background:transparent;border:none;color:white;cursor:pointer;margin-left:5px;";
        del.onclick = () => {
            if (li.dataset.deleteConfirmed === "true") {
                console.log('Timestamps changed: Timestamp deleted');
                li.remove();
                updateTimeDifferences();
                updateSeekbarMarkers();
                updateScroll();
                debouncedSaveTimestamps();
            }
            else {
                li.dataset.deleteConfirmed = "true";
                li.style.background = "darkred";
                // Add a click listener to cancel delete if clicking anywhere except the delete button
                const cancelDeleteOnClick = (event) => {
                    const target = event.target;
                    // Only cancel if clicking on something that's not the delete button itself
                    if (target !== del) {
                        li.dataset.deleteConfirmed = "false";
                        li.style.background = "rgba(255, 255, 255, 0.05)";
                        li.removeEventListener("click", cancelDeleteOnClick, true);
                        document.removeEventListener("click", cancelDeleteOnClick, true);
                    }
                };
                // Add listeners for this timestamp's li and the document
                li.addEventListener("click", cancelDeleteOnClick, true);
                document.addEventListener("click", cancelDeleteOnClick, true);
                setTimeout(() => {
                    if (li.dataset.deleteConfirmed === "true") {
                        li.dataset.deleteConfirmed = "false";
                        li.style.background = "rgba(255, 255, 255, 0.05)";
                    }
                    // Clean up listeners even if timeout expires
                    li.removeEventListener("click", cancelDeleteOnClick, true);
                    document.removeEventListener("click", cancelDeleteOnClick, true);
                }, 5000);
            }
        };
        timeDiff.className = "time-diff";
        timeDiff.style.color = "#888";
        timeDiff.style.marginLeft = "5px";
        timeRow.append(minus, record, plus, anchor, timeDiff, del);
        li.append(timeRow, commentInput);
        li.style.cssText = "display:flex;flex-direction:column;gap:5px;padding:5px;background:rgba(255,255,255,0.05);border-radius:3px;";
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
        updateSeekbarMarkers();
        if (!doNotSave) {
            saveTimestamps();
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
        if (!list || list.querySelector('.ytls-error-message')) {
            return;
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
        updateSeekbarMarkers();
        console.log('Timestamps changed: Timestamps sorted');
        debouncedSaveTimestamps(); // Save after sorting
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
        const videoData = getVideoDataCompat();
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
            marker.addEventListener("click", () => seekToCompat(ts.start));
            progressBar.appendChild(marker);
        });
    }
    function saveTimestamps() {
        if (!list)
            return;
        if (list.querySelector('.ytls-error-message')) {
            return; // Skip saving when displaying an error message
        }
        const videoId = getVideoId();
        if (!videoId)
            return;
        const currentTimestampsFromUI = getTimestampItems()
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
            const comment = commentInput?.value ?? '';
            const guid = li.dataset.guid ?? crypto.randomUUID();
            if (!li.dataset.guid) {
                li.dataset.guid = guid;
            }
            return { start: startTime, comment, guid };
        })
            .filter(isTimestampRecord);
        // Sort timestamps from UI just in case, though they should generally be in order.
        currentTimestampsFromUI.sort((a, b) => a.start - b.start);
        if (currentTimestampsFromUI.length === 0) {
            // If there are no timestamps in the UI, don't clear the database
            // This preserves the timestamps in case they were accidentally cleared from the UI
            console.log(`Timestamps changed: No timestamps in UI for ${videoId}; keeping database entry intact`);
            return;
        }
        else {
            // Save UI timestamps directly to IndexedDB
            console.log(`Timestamps changed: Saving ${currentTimestampsFromUI.length} timestamps for ${videoId} to IndexedDB`);
            saveToIndexedDB(videoId, currentTimestampsFromUI)
                .then(() => console.log(`Successfully saved timestamps for ${videoId} to IndexedDB`))
                .catch(err => console.error(`Failed to save timestamps for ${videoId} to IndexedDB:`, err));
            // Notify other tabs about the update
            channel.postMessage({ type: 'timestamps_updated', videoId: videoId, action: 'saved' });
        }
    }
    // Debounced save function that waits 250ms after last change before saving
    function debouncedSaveTimestamps() {
        if (saveTimeoutId) {
            clearTimeout(saveTimeoutId);
        }
        saveTimeoutId = setTimeout(() => {
            console.log('Timestamps changed: Executing debounced save');
            saveTimestamps();
            saveTimeoutId = null;
        }, 250);
    }
    async function saveTimestampsAs(format) {
        if (!list)
            return;
        if (list.querySelector('.ytls-error-message')) {
            alert("Cannot export timestamps while displaying an error message.");
            return;
        }
        const videoId = getVideoId();
        if (!videoId)
            return;
        const hashedVideoId = await calculateSHA256(videoId);
        const isUnlisted = unlistedVideos.includes(hashedVideoId);
        const isMembersOnly = membersOnlyVideos.includes(videoId); // Direct check for members-only
        if (isUnlisted || isMembersOnly) {
            const videoType = isUnlisted && isMembersOnly ? "unlisted and members-only" : isUnlisted ? "unlisted" : "members-only";
            const userChoice = await showRestrictedExportConfirmationModal(1, videoType);
            if (!userChoice) {
                alert("Export cancelled by user.");
                return;
            }
            console.log(`User confirmed export for ${videoType} video ID: ${videoId}`);
        }
        else {
            console.log(`Exporting timestamps for video ID: ${videoId}`);
        }
        const videoDuration = Math.floor(getDurationCompat());
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
            const comment = commentInput?.value ?? '';
            const guid = li.dataset.guid ?? crypto.randomUUID();
            if (!li.dataset.guid) {
                li.dataset.guid = guid;
            }
            return { start: startTime, comment, guid };
        })
            .filter(isTimestampRecord);
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
            console.error("Timekeeper error:", message);
            return;
        }
        pane.classList.remove("minimized");
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
    function unloadTimekeeper() {
        if (saveTimeoutId) {
            clearTimeout(saveTimeoutId);
            saveTimeoutId = null;
        }
        if (loadTimeoutId) {
            clearTimeout(loadTimeoutId);
            loadTimeoutId = null;
        }
        if (timeUpdateIntervalId) {
            clearInterval(timeUpdateIntervalId);
            timeUpdateIntervalId = null;
        }
        if (settingsModalInstance && settingsModalInstance.parentNode === document.body) {
            document.body.removeChild(settingsModalInstance);
        }
        settingsModalInstance = null;
        settingsCogButtonElement = null;
        isMouseOverTimestamps = false;
        if (pane && pane.parentNode) {
            pane.remove();
        }
        clearTimestampsDisplay();
        pane = null;
        header = null;
        list = null;
        btns = null;
        timeDisplay = null;
        style = null;
        minimizeBtn = null;
        versionDisplay = null;
        pendingStoredViewport = null;
        lastValidatedPlayer = null;
        removeSeekbarMarkers();
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
        try {
            const validation = await validatePlayerAndVideoId();
            if (!validation.ok) {
                displayPaneError(validation.message);
                return;
            }
            const { videoId } = validation;
            console.log(`loadTimestamps for ${videoId}`);
            let finalTimestampsToDisplay = [];
            try {
                const dbTimestamps = await loadFromIndexedDB(videoId);
                if (dbTimestamps) {
                    // Ensure all timestamps from DB have GUIDs
                    finalTimestampsToDisplay = dbTimestamps.map(ts => ({
                        ...ts,
                        guid: ts.guid || crypto.randomUUID()
                    }));
                    console.log(`Loaded timestamps from IndexedDB for ${videoId}`);
                }
                else {
                    console.log(`No timestamps found in IndexedDB for ${videoId}`);
                    // Attempt to load from localStorage as a fallback (for migration)
                    const savedDataRaw = localStorage.getItem(`ytls-${videoId}`);
                    if (savedDataRaw) {
                        console.log(`Found data in localStorage for ${videoId}, attempting to migrate.`);
                        try {
                            const parsedData = JSON.parse(savedDataRaw);
                            if (parsedData && parsedData.video_id === videoId && Array.isArray(parsedData.timestamps)) {
                                finalTimestampsToDisplay = parsedData.timestamps.filter(ts => ts && typeof ts.start === 'number' && typeof ts.comment === 'string').map(ts => ({
                                    ...ts,
                                    guid: ts.guid || crypto.randomUUID() // Ensure each timestamp has a GUID
                                }));
                                // Save to IndexedDB and remove from localStorage after successful migration
                                if (finalTimestampsToDisplay.length > 0) {
                                    saveToIndexedDB(videoId, finalTimestampsToDisplay)
                                        .then(() => {
                                        console.log(`Successfully migrated localStorage data to IndexedDB for ${videoId}`);
                                        localStorage.removeItem(`ytls-${videoId}`); // Remove from localStorage after migration
                                    })
                                        .catch(err => console.error(`Error migrating localStorage to IndexedDB for ${videoId}:`, err));
                                }
                            }
                            else {
                                console.warn(`localStorage data for ${videoId} is not in the expected format. Ignoring.`);
                            }
                        }
                        catch (e) {
                            console.error("Failed to parse localStorage data during migration:", e);
                        }
                    }
                }
            }
            catch (dbError) {
                console.error(`Failed to load timestamps from IndexedDB for ${videoId}:`, dbError);
                pane.classList.add("minimized");
                clearTimestampsDisplay();
                updateSeekbarMarkers();
                return;
            }
            if (finalTimestampsToDisplay.length > 0) {
                finalTimestampsToDisplay.sort((a, b) => a.start - b.start); // Sort by start time
                clearTimestampsDisplay();
                finalTimestampsToDisplay.forEach(ts => {
                    // Pass the GUID when loading timestamps
                    addTimestamp(ts.start, ts.comment, true, ts.guid);
                });
                updateSeekbarMarkers();
            }
            else {
                clearTimestampsDisplay(); // Ensure UI is cleared if no timestamps are found
                updateSeekbarMarkers(); // Ensure seekbar markers are cleared
            }
        }
        catch (err) {
            console.error("Unexpected error while loading timestamps:", err);
            displayPaneError("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.");
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
    function highlightNearestTimestamp() {
        const video = getVideoElement();
        if (!video || !list)
            return;
        video.addEventListener("timeupdate", () => {
            if (!list)
                return;
            if (isMouseOverTimestamps)
                return; // Skip auto-scrolling if the mouse is over the timestamps window
            const currentTime = Math.floor(getCurrentTimeCompat());
            if (!Number.isFinite(currentTime))
                return;
            let nearestTimestamp = null;
            let smallestDifference = Infinity;
            // Find the nearest timestamp
            getTimestampItems().forEach(li => {
                const timeLink = li.querySelector('a[data-time]');
                const timeValue = timeLink?.dataset.time;
                if (!timeValue) {
                    return;
                }
                const timestamp = Number.parseInt(timeValue, 10);
                if (!Number.isFinite(timestamp)) {
                    return;
                }
                const difference = Math.abs(currentTime - timestamp);
                if (difference < smallestDifference) {
                    smallestDifference = difference;
                    nearestTimestamp = li;
                }
            });
            // Highlight the nearest timestamp
            getTimestampItems().forEach(li => {
                // Skip resetting the background if it's marked for deletion (dark red)
                if (li.style.background !== "darkred") {
                    li.style.background = "rgba(255, 255, 255, 0.05)"; // Reset background
                }
            });
            if (nearestTimestamp && nearestTimestamp.style.background !== "darkred") {
                nearestTimestamp.style.background = "rgba(0, 128, 255, 0.2)"; // Highlight nearest timestamp
                nearestTimestamp.scrollIntoView({ behavior: "smooth", block: "center" }); // Scroll to it
            }
        });
    }
    // === IndexedDB Helper Functions ===
    const DB_NAME = 'ytls-timestamps-db';
    const DB_VERSION = 2;
    const STORE_NAME = 'timestamps';
    const SETTINGS_STORE_NAME = 'settings';
    function openIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = event => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'video_id' });
                }
                if (!db.objectStoreNames.contains(SETTINGS_STORE_NAME)) {
                    db.createObjectStore(SETTINGS_STORE_NAME, { keyPath: 'key' });
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
        return openIndexedDB().then(db => {
            return new Promise((resolve, reject) => {
                const tx = db.transaction(storeName, mode);
                const store = tx.objectStore(storeName);
                const request = operation(store);
                if (request) {
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error ?? new Error(`IndexedDB ${mode} operation failed`));
                }
                tx.oncomplete = () => {
                    if (!request)
                        resolve(undefined);
                };
                tx.onerror = () => reject(tx.error ?? new Error(`IndexedDB transaction failed`));
            });
        });
    }
    function saveToIndexedDB(videoId, data) {
        return executeTransaction(STORE_NAME, 'readwrite', (store) => {
            store.put({ video_id: videoId, timestamps: data });
        }).then(() => undefined);
    }
    function loadFromIndexedDB(videoId) {
        return executeTransaction(STORE_NAME, 'readonly', (store) => {
            return store.get(videoId);
        }).then(result => {
            const videoData = result;
            return Array.isArray(videoData?.timestamps) ? videoData.timestamps : null;
        });
    }
    function removeFromIndexedDB(videoId) {
        return executeTransaction(STORE_NAME, 'readwrite', (store) => {
            store.delete(videoId);
        }).then(() => undefined);
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
            console.error(`Failed to save setting '${key}' to IndexedDB:`, err);
        });
    }
    function loadGlobalSettings(key) {
        return executeTransaction(SETTINGS_STORE_NAME, 'readonly', (store) => {
            return store.get(key);
        }).then(result => {
            return result?.value;
        }).catch(err => {
            console.error(`Failed to load setting '${key}' from IndexedDB:`, err);
            return undefined;
        });
    }
    function saveMinimizedState() {
        if (!pane)
            return;
        const isMinimized = pane.classList.contains("minimized");
        saveGlobalSettings('isMinimized', isMinimized);
    }
    function loadMinimizedState() {
        if (!pane)
            return;
        loadGlobalSettings('isMinimized').then(value => {
            const isMinimized = value;
            if (typeof isMinimized === 'boolean') {
                if (isMinimized) {
                    pane.classList.add("minimized");
                }
                else {
                    pane.classList.remove("minimized");
                }
            }
            else {
                // Default to minimized if not found
                pane.classList.add("minimized");
            }
        }).catch(err => {
            console.error("Failed to load minimized state:", err);
            // Default to minimized on error
            pane.classList.add("minimized");
        });
    }
    function processImportedData(contentString) {
        if (!list) {
            logWarn("UI is not initialized; cannot import timestamps.");
            return;
        }
        let processedSuccessfully = false;
        // Try parsing as JSON first
        try {
            const timestamps = JSON.parse(contentString);
            if (Array.isArray(timestamps)) {
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
                                    commentInput.value = ts.comment;
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
                    console.warn("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.");
                }
            }
            else {
                console.warn("Parsed JSON, but it's not an array. Trying as plain text.");
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
            console.log('Timestamps changed: Imported timestamps from file/clipboard');
            debouncedSaveTimestamps();
            updateSeekbarMarkers();
            updateScroll();
            // alert("Timestamps loaded and merged successfully!");
        }
        else {
            alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.");
        }
    }
    // Helper function to show confirmation modal for exporting restricted videos
    async function showRestrictedExportConfirmationModal(restrictedCount, videoType) {
        return new Promise((resolve) => {
            const modalId = "ytls-restricted-export-confirm-modal";
            // Remove existing modal if any
            const existingModal = document.getElementById(modalId);
            if (existingModal) {
                existingModal.remove();
            }
            const modal = document.createElement("div");
            modal.id = modalId;
            modal.style = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#2c2c2c;padding:25px;border-radius:12px;z-index:10002;color:white;text-align:center;width:380px;box-shadow:0 4px 15px rgba(0,0,0,0.2);border:1px solid #444;";
            const message = document.createElement("p");
            message.textContent = `This export includes ${restrictedCount} video(s) marked as ${videoType}. Do you want to include their data in the export?`;
            message.style = "margin-bottom:20px;font-size:16px;line-height:1.5;";
            const buttonContainer = document.createElement("div");
            buttonContainer.style = "display:flex;justify-content:space-around;gap:15px;";
            const yesButton = document.createElement("button");
            yesButton.textContent = "Yes, Include";
            yesButton.style = "background:#4CAF50;color:white;padding:12px 22px;border:none;border-radius:8px;cursor:pointer;font-size:15px;flex-grow:1;";
            yesButton.onmouseover = () => yesButton.style.background = "#45a049";
            yesButton.onmouseout = () => yesButton.style.background = "#4CAF50";
            yesButton.onclick = () => {
                modal.classList.add("fade-out");
                setTimeout(() => {
                    if (document.body.contains(modal)) {
                        document.body.removeChild(modal);
                    }
                    resolve(true); // User chose to include
                }, 300); // Match animation duration
            };
            const noButton = document.createElement("button");
            noButton.textContent = "No, Exclude";
            noButton.style = "background:#f44336;color:white;padding:12px 22px;border:none;border-radius:8px;cursor:pointer;font-size:15px;flex-grow:1;";
            noButton.onmouseover = () => noButton.style.background = "#e53935";
            noButton.onmouseout = () => noButton.style.background = "#f44336";
            noButton.onclick = () => {
                modal.classList.add("fade-out");
                setTimeout(() => {
                    if (document.body.contains(modal)) {
                        document.body.removeChild(modal);
                    }
                    resolve(false); // User chose to exclude
                }, 300); // Match animation duration
            };
            buttonContainer.appendChild(yesButton);
            buttonContainer.appendChild(noButton);
            modal.appendChild(message);
            modal.appendChild(buttonContainer);
            document.body.appendChild(modal);
        });
    }
    async function initializePaneIfNeeded() {
        if (pane && document.body.contains(pane)) {
            return;
        }
        // Remove any stray minimized icons before creating a new pane
        document.querySelectorAll("#ytls-pane").forEach(el => el.remove());
        pane = document.createElement("div");
        header = document.createElement("div");
        list = document.createElement("ul");
        btns = document.createElement("div");
        timeDisplay = document.createElement("span");
        style = document.createElement("style");
        minimizeBtn = document.createElement("button");
        versionDisplay = document.createElement("span");
        // Add event listeners to `list` after it is initialized
        list.addEventListener("mouseenter", () => {
            isMouseOverTimestamps = true;
        });
        list.addEventListener("mouseleave", () => {
            isMouseOverTimestamps = false;
        });
        pane.id = "ytls-pane";
        pane.classList.add("minimized");
        header.style = "display:flex;justify-content:space-between;align-items:center;padding:5px;nowrap;";
        const scriptVersion = GM_info.script.version; // Get script version
        versionDisplay.textContent = `v${scriptVersion}`;
        versionDisplay.style = "font-size:12px; color: #aaa; margin-left: auto; padding-right: 5px; cursor: default"; // Style for version
        versionDisplay.classList.add("ytls-version-display"); // Add class for CSS targeting
        timeDisplay.id = "ytls-current-time";
        timeDisplay.textContent = "CT: ";
        timeDisplay.style = "color:white;font-size:14px;cursor:pointer;"; // Add pointer cursor
        // Enable clicking on the current timestamp to jump to the latest point in the live stream
        timeDisplay.onclick = () => {
            seekToLiveHeadCompat();
        };
        minimizeBtn.textContent = "▶️";
        minimizeBtn.classList.add("ytls-minimize-button");
        minimizeBtn.id = "ytls-minimize";
        function updateTime() {
            const video = getVideoElement();
            const playerInstance = getActivePlayer();
            if (!video && !playerInstance) {
                return;
            }
            const currentSeconds = Math.max(0, Math.floor(getCurrentTimeCompat()));
            const h = Math.floor(currentSeconds / 3600);
            const m = Math.floor(currentSeconds / 60) % 60;
            const s = currentSeconds % 60;
            const { isLive } = getVideoDataCompat() || { isLive: false };
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
                    const durationSeconds = getDurationCompat();
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
            timeDisplay.textContent = `CT: ${h ? h + ":" + String(m).padStart(2, "0") : m}:${String(s).padStart(2, "0")}${timestampDisplay}`;
        }
        updateTime();
        if (timeUpdateIntervalId) {
            clearInterval(timeUpdateIntervalId);
        }
        timeUpdateIntervalId = setInterval(updateTime, 1000);
        btns.id = "ytls-buttons";
        // Define handlers for main buttons
        const handleAddTimestamp = () => {
            if (!list || list.querySelector('.ytls-error-message')) {
                return;
            }
            // Use configuredOffset if available, otherwise default to 0
            const offset = typeof configuredOffset !== 'undefined' ? configuredOffset : 0;
            const currentTime = Math.floor(getCurrentTimeCompat() + offset);
            if (!Number.isFinite(currentTime)) {
                return;
            }
            const newCommentInput = addTimestamp(currentTime, "");
            if (newCommentInput) {
                newCommentInput.focus();
            }
        };
        const handleCopyTimestamps = function (e) {
            if (!list || list.querySelector('.ytls-error-message')) {
                this.textContent = "❌";
                setTimeout(() => { this.textContent = "📋"; }, 2000);
                return;
            }
            const video = document.querySelector("video");
            const videoDuration = video ? Math.floor(video.duration) : 0;
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
                const comment = commentInput?.value ?? '';
                const guid = li.dataset.guid ?? crypto.randomUUID();
                if (!li.dataset.guid) {
                    li.dataset.guid = guid;
                }
                return { start: startTime, comment, guid };
            })
                .filter(isTimestampRecord);
            if (timestamps.length === 0) {
                this.textContent = "❌";
                setTimeout(() => { this.textContent = "📋"; }, 2000);
                return; // Do not copy if empty
            }
            const includeGuids = e.ctrlKey; // Check if Ctrl key is held
            const plainText = timestamps.map(ts => {
                const timeString = formatTimeString(ts.start, videoDuration);
                if (includeGuids) {
                    // Use HTML comment style for GUIDs, same as file export format
                    return `${timeString} ${ts.comment} <!-- guid:${ts.guid} -->`.trimStart();
                }
                else {
                    return `${timeString} ${ts.comment}`;
                }
            }).join("\n");
            navigator.clipboard.writeText(plainText).then(() => {
                this.textContent = "✅";
                setTimeout(() => { this.textContent = "📋"; }, 2000);
            }).catch(err => {
                console.error("Failed to copy timestamps: ", err);
                this.textContent = "❌";
                setTimeout(() => { this.textContent = "📋"; }, 2000);
            });
        };
        // Configuration for main buttons
        const mainButtonConfigs = [
            { label: "🐣", title: "Add timestamp", action: handleAddTimestamp },
            { label: "⚙️", title: "Settings", action: toggleSettingsModal }, // Changed action
            { label: "📋", title: "Copy timestamps to clipboard", action: handleCopyTimestamps },
            { label: "🔀", title: "Sort timestamps by time", action: sortTimestampsAndUpdateDisplay }
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
                settingsModalInstance.classList.add("fade-out");
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
            const settingsContent = document.createElement("div");
            settingsContent.id = "ytls-settings-content";
            const buttonConfigs = [
                { label: "💾 Save", title: "Save As...", action: saveBtn.onclick }, // Assuming saveBtn.onclick shows another modal
                { label: "📂 Load", title: "Load", action: loadBtn.onclick },
                { label: "📤 Export", title: "Export All Data", action: exportBtn.onclick },
                { label: "📥 Import", title: "Import All Data", action: importBtn.onclick },
                { label: "Close", title: "Close", action: () => {
                        if (settingsModalInstance && settingsModalInstance.parentNode === document.body) {
                            settingsModalInstance.classList.add("fade-out");
                            setTimeout(() => {
                                if (document.body.contains(settingsModalInstance)) {
                                    document.body.removeChild(settingsModalInstance);
                                }
                                settingsModalInstance = null;
                                document.removeEventListener('click', handleClickOutsideSettingsModal, true);
                            }, 300); // Match animation duration
                        }
                    } }
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
                    settingsModalInstance.classList.add("fade-out");
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
            const message = document.createElement("p");
            message.textContent = "Save as:";
            const jsonButton = document.createElement("button");
            jsonButton.textContent = "JSON";
            jsonButton.classList.add("ytls-save-modal-button"); // Added class
            jsonButton.onclick = () => {
                modal.classList.add("fade-out");
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
                modal.classList.add("fade-out");
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
                modal.classList.add("fade-out");
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
            loadModal.style = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#333;padding:20px;border-radius:10px;z-index:10001;color:white;text-align:center;width:300px;box-shadow:0 0 10px rgba(0,0,0,0.5);";
            const loadMessage = document.createElement("p");
            loadMessage.textContent = "Load from:";
            loadMessage.style = "margin-bottom:15px;font-size:16px;";
            const fromFileButton = document.createElement("button");
            fromFileButton.textContent = "File";
            fromFileButton.style = "background:#555;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;margin-right:10px;";
            fromFileButton.onclick = () => {
                loadModal.classList.add("fade-out");
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
            fromClipboardButton.style = "background:#555;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;";
            fromClipboardButton.onclick = async () => {
                loadModal.classList.add("fade-out");
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
                        console.error("Failed to read from clipboard: ", err);
                        alert("Failed to read from clipboard. Ensure you have granted permission.");
                    }
                }, 300); // Match animation duration
            };
            const cancelLoadButton = document.createElement("button");
            cancelLoadButton.textContent = "Cancel";
            cancelLoadButton.style = "background:#444;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;margin-top:15px;display:block;width:100%;";
            cancelLoadButton.onclick = () => {
                loadModal.classList.add("fade-out");
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
            const exportData = {};
            try {
                const allTimestamps = await getAllFromIndexedDB(STORE_NAME);
                let restrictedCount = 0;
                let isUnlistedRestrictedFound = false;
                let isMembersOnlyRestrictedFound = false;
                let includeRestricted = false; // Default to not including restricted data
                // First loop: Count restricted videos and determine their types
                for (const videoData of allTimestamps) {
                    if (videoData && typeof videoData.video_id === 'string') {
                        const videoIdHash = await calculateSHA256(videoData.video_id);
                        // Assume unlistedVideos and membersOnlyVideos are defined in an accessible scope
                        const isUnlisted = typeof unlistedVideos !== 'undefined' && unlistedVideos.includes(videoIdHash);
                        const isMembers = typeof membersOnlyVideos !== 'undefined' && membersOnlyVideos.includes(videoData.video_id);
                        if (isUnlisted || isMembers) {
                            restrictedCount++;
                            if (isUnlisted)
                                isUnlistedRestrictedFound = true;
                            if (isMembers)
                                isMembersOnlyRestrictedFound = true;
                        }
                    }
                }
                let videoType = "";
                if (isUnlistedRestrictedFound && isMembersOnlyRestrictedFound) {
                    videoType = "unlisted and members-only";
                }
                else if (isUnlistedRestrictedFound) {
                    videoType = "unlisted";
                }
                else if (isMembersOnlyRestrictedFound) {
                    videoType = "members-only";
                }
                if (restrictedCount > 0) {
                    const userChoice = await showRestrictedExportConfirmationModal(restrictedCount, videoType);
                    if (userChoice) {
                        includeRestricted = true;
                    }
                    else {
                        // User chose No or closed the modal
                        console.log(`User chose to exclude ${videoType ? videoType : 'restricted'} videos from export.`);
                    }
                }
                // Second loop: Populate exportData based on user's choice and restriction checks
                for (const videoData of allTimestamps) {
                    if (videoData && typeof videoData.video_id === 'string' && Array.isArray(videoData.timestamps)) {
                        const videoIdHash = await calculateSHA256(videoData.video_id);
                        const isUnlisted = typeof unlistedVideos !== 'undefined' && unlistedVideos.includes(videoIdHash);
                        const isMembers = typeof membersOnlyVideos !== 'undefined' && membersOnlyVideos.includes(videoData.video_id);
                        const currentVideoIsRestricted = isUnlisted || isMembers;
                        if (includeRestricted || !currentVideoIsRestricted) {
                            exportData[`ytls-${videoData.video_id}`] = videoData;
                        }
                        else {
                            const restrictedTypeInfo = [];
                            if (isUnlisted)
                                restrictedTypeInfo.push("Unlisted");
                            if (isMembers)
                                restrictedTypeInfo.push("Members-Only");
                            console.log(`Skipping export for restricted video ID: ${videoData.video_id} (Type: ${restrictedTypeInfo.join('/')})`);
                        }
                    }
                    else {
                        console.warn(`Skipping data for video_id ${videoData && videoData.video_id ? videoData.video_id : 'unknown'} during export due to unexpected format.`);
                    }
                }
                // Create a JSON file for export
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                const timestampSuffix = getTimestampSuffix();
                a.download = `ytls-data-${timestampSuffix}.json`;
                a.click();
                URL.revokeObjectURL(url);
            }
            catch (err) {
                console.error("Failed to export data:", err);
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
                                        .then(() => console.log(`Imported ${videoId} to IndexedDB`))
                                        .catch(err => console.error(`Failed to import ${videoId} to IndexedDB:`, err));
                                    importPromises.push(promise);
                                }
                                else {
                                    console.warn(`Skipping key ${key} during import due to unexpected data format.`);
                                }
                            }
                        }
                        Promise.all(importPromises).then(() => {
                            // alert("Data imported successfully! Refreshing tool...");
                            handleUrlChange(); // Refresh the tool to reflect imported data
                        }).catch(err => {
                            alert("An error occurred during import to IndexedDB. Check console for details.");
                            console.error("Overall import error:", err);
                        });
                    }
                    catch (e) {
                        alert("Failed to import data. Please ensure the file is in the correct format.\n" + e.message);
                        console.error("Import error:", e);
                    }
                };
                reader.readAsText(file);
            };
            fileInput.click();
        };
        style.textContent = `
      #ytls-pane {
        background: rgba(0, 0, 0, 0.8);
        text-align: left;
        position: fixed;
        bottom: 0;
        right: 0;
        padding: 5px 10px 10px 10px;
        border-radius: 12px; /* Add rounded corners */
        border: 1px solid rgba(85, 85, 85, 0.8); /* Add a thin grey border */
        opacity: 0.9;
        z-index: 5000;
        font-family: Arial, sans-serif;
        width: 300px;
        user-select: none; /* Prevent text selection in pane */
      }
      #ytls-pane.minimized {
        width: 3em; /* Size relative to the icon */
        height: 3em; /* Size relative to the icon */
        overflow: hidden;
        background: rgba(0, 0, 0, 0.8);
        padding: 0;
        border-radius: 1em; /* Fully rounded corners */
        border: 1px solid grey; /* Add a thin grey border */
        display: flex;
        justify-content: center; /* Center the content horizontally */
        align-items: center; /* Center the content vertically */
      }
      #ytls-pane.minimized #ytls-content {
        display: none;
      }
      #ytls-pane.minimized #ytls-minimize {
        display: block;
        font-size: 1.5em; /* Adjust font size for better visibility */
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
      }
      #ytls-pane.minimized #ytls-current-time,
      #ytls-pane.minimized .ytls-version-display {
        display: none;
      }
      #ytls-pane:hover {
        opacity: 1;
      }
      #ytls-pane ul {
        list-style: none;
        padding: 0;
        margin: 0;
        user-select: none; /* Prevent text selection in timestamp list */
      }
      #ytls-pane li {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin: 5px 0;
        background: rgba(255, 255, 255, 0.05);
        padding: 5px;
        border-radius: 3px;
        user-select: none; /* Prevent text selection in timestamp items */
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
      #ytls-pane .ytls-marker.end {
        background-color: #00ff00;
      }
      #ytls-pane .ytls-ts-bar {
        position: absolute;
        height: 100%;
        background-color: rgba(255, 255, 0, 0.3);
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
      #ytls-buttons {
        display: flex;
        gap: 5px;
        justify-content: space-between;
        margin-top: 10px;
      }
      #ytls-buttons button:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      /* Styles for main control buttons */
      .ytls-main-button {
        background: #555;
        color: white;
        font-size: 24px;
        border: none;
        border-radius: 5px;
        padding: 5px;
        cursor: pointer;
      }
      .ytls-main-button:hover {
        background: #777; /* Example hover effect */
      }

      /* Style for the minimize button */
      .ytls-minimize-button {
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
        padding: 0px;
      }

      /* Styles for settings modal */
      #ytls-settings-modal {
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

      /* Style for the save format choice modal */
      #ytls-save-modal {
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
      #ytls-save-modal p {
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

      /* Apply fade-in to modals when they appear */
      #ytls-restricted-export-confirm-modal,
      #ytls-settings-modal,
      #ytls-save-modal,
      #ytls-load-modal {
        animation: fadeIn 0.3s ease-in-out;
      }

      /* Apply fade-out class to modals when they disappear */
      #ytls-restricted-export-confirm-modal.fade-out,
      #ytls-settings-modal.fade-out,
      #ytls-save-modal.fade-out,
      #ytls-load-modal.fade-out {
        animation: fadeOut 0.3s ease-in-out forwards;
      }
    `;
        // Helper function to ensure pane is fully clamped within viewport
        function clampPaneToViewport() {
            if (!pane || !document.body.contains(pane))
                return;
            const rect = pane.getBoundingClientRect();
            const viewportWidth = document.documentElement.clientWidth;
            const viewportHeight = document.documentElement.clientHeight;
            const paneWidth = rect.width;
            const paneHeight = rect.height;
            // Clamp left
            if (rect.left < 0) {
                pane.style.left = "0";
                pane.style.right = "auto";
            }
            // Clamp right
            if (rect.right > viewportWidth) {
                const adjustedLeft = Math.max(0, viewportWidth - paneWidth);
                pane.style.left = `${adjustedLeft}px`;
                pane.style.right = "auto";
            }
            // Clamp top
            if (rect.top < 0) {
                pane.style.top = "0";
                pane.style.bottom = "auto";
            }
            // Clamp bottom
            if (rect.bottom > viewportHeight) {
                const adjustedTop = Math.max(0, viewportHeight - paneHeight);
                pane.style.top = `${adjustedTop}px`;
                pane.style.bottom = "auto";
            }
        }
        // Helper function to snap pane to nearest edge, accounting for scrollbars
        function snapPaneToNearestEdge() {
            if (!pane || !document.body.contains(pane))
                return;
            pane.style.transition = "all 0.2s ease";
            const rect = pane.getBoundingClientRect();
            // Use document.documentElement.clientWidth/Height to account for scrollbars
            const viewportWidth = document.documentElement.clientWidth;
            const viewportHeight = document.documentElement.clientHeight;
            const paneWidth = rect.width;
            const paneHeight = rect.height;
            // Calculate distances to edges
            const distanceToLeft = rect.left;
            const distanceToRight = viewportWidth - rect.right;
            const distanceToTop = rect.top;
            const distanceToBottom = viewportHeight - rect.bottom;
            // Find the closest edge
            const minDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);
            if (minDistance === distanceToLeft) {
                pane.style.left = "0";
                pane.style.right = "auto";
            }
            else if (minDistance === distanceToRight) {
                // Ensure right snap doesn't push pane off-screen, accounting for scrollbars
                const rightPosition = Math.max(0, viewportWidth - paneWidth);
                pane.style.left = `${rightPosition}px`;
                pane.style.right = "auto";
            }
            else if (minDistance === distanceToTop) {
                pane.style.top = "0";
                pane.style.bottom = "auto";
            }
            else if (minDistance === distanceToBottom) {
                // Ensure bottom snap doesn't push pane off-screen, accounting for scrollbars
                const bottomPosition = Math.max(0, viewportHeight - paneHeight);
                pane.style.top = `${bottomPosition}px`;
                pane.style.bottom = "auto";
            }
            // Final safety check to ensure pane is fully on screen
            clampPaneToViewport();
        }
        minimizeBtn.onclick = () => {
            if (!dragOccurredSinceLastMouseDown) { // Check the flag before toggling
                pane.classList.toggle("minimized");
                saveMinimizedState(); // Save the new minimized state
                // Wait for CSS transition to complete (0.2s), then clamp to ensure full visibility
                setTimeout(() => {
                    clampPaneToViewport();
                    snapPaneToNearestEdge();
                }, 250);
            }
        };
        list.onclick = (e) => {
            handleClick(e);
            saveTimestamps();
        };
        list.ontouchstart = (e) => {
            handleClick(e);
            saveTimestamps();
        };
        // Load pane position from IndexedDB settings
        function loadPanePosition() {
            if (!pane)
                return;
            log('Loading window position from IndexedDB');
            loadGlobalSettings('windowPosition').then(value => {
                if (!value) {
                    // Default to 0,0 if no position stored
                    log('No window position found in IndexedDB, using default position (0,0)');
                    pane.style.left = "0";
                    pane.style.top = "0";
                    pane.style.right = "auto";
                    pane.style.bottom = "auto";
                    // Apply clamp and reposition after loading default
                    clampPaneToViewport();
                    return;
                }
                try {
                    const pos = value;
                    const currentViewportWidth = document.documentElement.clientWidth;
                    const currentViewportHeight = document.documentElement.clientHeight;
                    log(`Loaded window position from IndexedDB: x=${pos.x}, y=${pos.y}`);
                    // Restore from x/y ratios (measured from top-left)
                    if (typeof pos.x === 'number' && typeof pos.y === 'number') {
                        pane.style.left = `${pos.x * currentViewportWidth}px`;
                        pane.style.top = `${pos.y * currentViewportHeight}px`;
                        pane.style.right = "auto";
                        pane.style.bottom = "auto";
                    }
                    else {
                        // Fallback: use default position
                        pane.style.left = "0";
                        pane.style.top = "0";
                        pane.style.right = "auto";
                        pane.style.bottom = "auto";
                    }
                    // Apply clamp and reposition after loading position
                    clampPaneToViewport();
                }
                catch (err) {
                    logWarn("failed to parse stored pane position:", err);
                    pane.style.left = "0";
                    pane.style.top = "0";
                    pane.style.right = "auto";
                    pane.style.bottom = "auto";
                    // Apply clamp and reposition after error
                    clampPaneToViewport();
                }
            }).catch(err => {
                logWarn("failed to load pane position from IndexedDB:", err);
                pane.style.left = "0";
                pane.style.top = "0";
                pane.style.right = "auto";
                pane.style.bottom = "auto";
                // Apply clamp and reposition after error
                clampPaneToViewport();
            });
        }
        function savePanePosition() {
            if (!pane)
                return;
            const styleObj = pane.style;
            // Calculate viewport dimensions (accounting for scrollbars)
            const viewportWidth = document.documentElement.clientWidth;
            const viewportHeight = document.documentElement.clientHeight;
            // Get current position
            const rect = pane.getBoundingClientRect();
            // Calculate ratios from left and top edges
            // We store distance from left and top edges as ratios of viewport size
            const x = Math.max(0, Math.min(1, rect.left / viewportWidth));
            const y = Math.max(0, Math.min(1, rect.top / viewportHeight));
            // Store only position ratios (no edge info)
            const positionData = {
                x, // horizontal position ratio (0-1, from left edge)
                y // vertical position ratio (0-1, from top edge)
            };
            log(`Saving window position to IndexedDB: x=${x}, y=${y}`);
            saveGlobalSettings('windowPosition', positionData);
            // Notify other tabs of the position change
            channel.postMessage({
                type: 'window_position_updated',
                position: positionData,
                timestamp: Date.now()
            });
        }
        function isEdgePinned(value) {
            if (!value || value === "auto") {
                return false;
            }
            const parsed = parseFloat(value);
            return Number.isFinite(parsed) && Math.abs(parsed) < 0.5;
        }
        function adjustPanePositionForViewportChange() {
            if (!pane || !document.body.contains(pane)) {
                lastViewportWidth = window.innerWidth;
                lastViewportHeight = window.innerHeight;
                return;
            }
            const rect = pane.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const paneWidth = rect.width;
            const paneHeight = rect.height;
            const pinnedLeft = isEdgePinned(pane.style.left);
            const pinnedRight = isEdgePinned(pane.style.right);
            const pinnedTop = isEdgePinned(pane.style.top);
            const pinnedBottom = isEdgePinned(pane.style.bottom);
            if (paneWidth >= windowWidth) {
                pane.style.left = "0";
                pane.style.right = "auto";
            }
            else if (pinnedLeft && !pinnedRight) {
                pane.style.left = "0";
                pane.style.right = "auto";
            }
            else if (pinnedRight && !pinnedLeft) {
                pane.style.right = "0";
                pane.style.left = "auto";
            }
            else {
                const prevAvailableWidth = Math.max(1, lastViewportWidth - paneWidth);
                const clampedLeft = Math.max(0, Math.min(rect.left, prevAvailableWidth));
                const ratioX = prevAvailableWidth > 0 ? clampedLeft / prevAvailableWidth : 0;
                const newAvailableWidth = Math.max(0, windowWidth - paneWidth);
                const newLeft = ratioX * newAvailableWidth;
                pane.style.left = `${newLeft}px`;
                pane.style.right = "auto";
            }
            if (paneHeight >= windowHeight) {
                pane.style.top = "0";
                pane.style.bottom = "auto";
            }
            else if (pinnedTop && !pinnedBottom) {
                pane.style.top = "0";
                pane.style.bottom = "auto";
            }
            else if (pinnedBottom && !pinnedTop) {
                pane.style.bottom = "0";
                pane.style.top = "auto";
            }
            else {
                const prevAvailableHeight = Math.max(1, lastViewportHeight - paneHeight);
                const clampedTop = Math.max(0, Math.min(rect.top, prevAvailableHeight));
                const ratioY = prevAvailableHeight > 0 ? clampedTop / prevAvailableHeight : 0;
                const newAvailableHeight = Math.max(0, windowHeight - paneHeight);
                const newTop = ratioY * newAvailableHeight;
                pane.style.top = `${newTop}px`;
                pane.style.bottom = "auto";
            }
            const finalRect = pane.getBoundingClientRect();
            if (finalRect.left < 0) {
                pane.style.left = "0";
                pane.style.right = "auto";
            }
            if (finalRect.top < 0) {
                pane.style.top = "0";
                pane.style.bottom = "auto";
            }
            if (finalRect.right > windowWidth) {
                const adjustedLeft = Math.max(0, windowWidth - finalRect.width);
                pane.style.left = `${adjustedLeft}px`;
                pane.style.right = "auto";
            }
            if (finalRect.bottom > windowHeight) {
                const adjustedTop = Math.max(0, windowHeight - finalRect.height);
                pane.style.top = `${adjustedTop}px`;
                pane.style.bottom = "auto";
            }
            lastViewportWidth = window.innerWidth;
            lastViewportHeight = window.innerHeight;
        }
        // Enable dragging and edge snapping for the pane
        pane.style.position = "fixed";
        pane.style.bottom = "0";
        pane.style.right = "0";
        pane.style.transition = "none"; // Disable transition during initial position restore
        loadPanePosition();
        // Re-enable transition after initial position is loaded
        pane.style.transition = "all 0.2s ease";
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
            // Allow dragging from the minimize button in both minimized and maximized states
            const isMinimizeButton = target === minimizeBtn || minimizeBtn.contains(target);
            if (!isMinimizeButton && window.getComputedStyle(target).cursor === 'pointer') {
                return;
            }
            isDragging = true;
            dragOccurredSinceLastMouseDown = false;
            offsetX = e.clientX - pane.getBoundingClientRect().left;
            offsetY = e.clientY - pane.getBoundingClientRect().top;
            pane.style.transition = "none";
        });
        document.addEventListener("mousemove", (e) => {
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
        document.addEventListener("mouseup", () => {
            if (!isDragging)
                return;
            isDragging = false;
            setTimeout(() => {
                dragOccurredSinceLastMouseDown = false; // Reset the flag after a short delay
            }, 50);
            // Snap to nearest edge using the helper function
            snapPaneToNearestEdge();
            // Save position after edge snapping animation completes (0.2s transition)
            setTimeout(() => {
                savePanePosition();
            }, 200);
        });
        // Prevent text selection during drag
        pane.addEventListener("dragstart", (e) => e.preventDefault());
        // Ensure the timestamps window is fully onscreen after resizing
        let resizeTimeout = null;
        window.addEventListener("resize", () => {
            // Debounce position save - only save after resize is finished
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(() => {
                adjustPanePositionForViewportChange();
                clampPaneToViewport(); // Also clamp to ensure full visibility after resize
                snapPaneToNearestEdge(); // Reapply snapping logic after resize
                savePanePosition(); // Save position after resize completes
                resizeTimeout = null;
            }, 200);
        });
        header.appendChild(minimizeBtn); // Add minimize button to the header first
        header.appendChild(timeDisplay); // Then add timeDisplay
        header.appendChild(versionDisplay); // Add versionDisplay to header
        const content = document.createElement("div");
        content.id = "ytls-content";
        content.append(list, btns); // list and btns are now directly in content; header is separate
        pane.append(header, content, style); // Append header, then content, then style to the pane
        document.body.appendChild(pane);
        // Load the global minimized state
        loadMinimizedState();
        if (pendingStoredViewport) {
            lastViewportWidth = pendingStoredViewport.width;
            lastViewportHeight = pendingStoredViewport.height;
            pendingStoredViewport = null;
        }
        else {
            lastViewportWidth = window.innerWidth;
            lastViewportHeight = window.innerHeight;
        }
        adjustPanePositionForViewportChange();
        // Add event listener for video pause to update URL
        const video = getVideoElement();
        if (video) {
            video.addEventListener("pause", () => {
                const currentTime = Math.floor(getCurrentTimeCompat());
                if (Number.isFinite(currentTime)) {
                    updateBrowserUrlWithTimestamp(currentTime);
                }
            });
            // Remove timestamp from URL during playback
            video.addEventListener("play", () => {
                const currentUrl = new URL(window.location.href);
                if (currentUrl.searchParams.has('t')) {
                    currentUrl.searchParams.delete('t');
                    history.replaceState({}, '', currentUrl.toString());
                }
            });
        }
        // Commit changes to IndexedDB when window or timestamp UI loses focus
        window.addEventListener("blur", () => {
            saveTimestamps();
        });
        list.addEventListener("focusout", (e) => {
            const relatedTarget = e.relatedTarget;
            if (relatedTarget && relatedTarget instanceof Node && list.contains(relatedTarget)) {
                return;
            }
            saveTimestamps();
        });
    }
    // Add a function to handle URL changes
    async function handleUrlChange() {
        if (!isSupportedUrl()) {
            unloadTimekeeper();
            return;
        }
        await waitForYouTubeReady();
        await initializePaneIfNeeded();
        // Remove any stray minimized icons or duplicate panes before proceeding
        document.querySelectorAll("#ytls-pane").forEach((el, idx) => {
            if (idx > 0)
                el.remove();
        });
        const currentVideoId = getVideoId(); // Still useful for logging
        const pageTitle = document.title;
        console.log("Page Title:", pageTitle);
        console.log("Video ID:", currentVideoId);
        console.log("Current URL:", window.location.href);
        clearTimestampsDisplay();
        updateSeekbarMarkers();
        // loadTimestamps will get the videoId itself, load data from IndexedDB (migrating from localStorage if needed),
        await loadTimestamps();
        // highlightNearestTimestamp sets up listeners on the video element if present
        // for continuous highlighting of the nearest timestamp.
        highlightNearestTimestamp();
    }
    window.addEventListener("yt-navigate-finish", handleUrlChange);
    // Initial call to handle the current URL
    await handleUrlChange();
})();

