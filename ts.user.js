// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      2.3.6
// @description  Enhanced timestamp tool for YouTube videos
// @author       Silent Shout
// @author       Vat5aL, original author (https://openuserjs.org/install/Vat5aL/YouTube_Timestamp_Tool_by_Vat5aL.user.js)
// @match        https://www.youtube.com/*
// @noframes
// @icon         data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%2272px%22 font-size=%2272px%22>⏲️</text></svg>
// @grant        GM.getValue
// @grant        GM.setValue
// @homepageURL  https://github.com/KamoTimestamps/timekeeper
// @supportURL   https://github.com/KamoTimestamps/timekeeper/issue
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
    } catch (err) {
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

  function hasRequiredPlayerMethods(playerInstance) {
    return !!playerInstance && REQUIRED_PLAYER_METHODS.every(method => typeof playerInstance[method] === "function");
  }

  function missingPlayerMethods(playerInstance) {
    return REQUIRED_PLAYER_METHODS.filter(method => typeof playerInstance?.[method] !== "function");
  }

  async function waitForPlayerWithMethods(timeoutMs = PLAYER_METHOD_CHECK_TIMEOUT_MS) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const playerInstance = document.getElementById("movie_player");
      if (hasRequiredPlayerMethods(playerInstance)) {
        return playerInstance;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return document.getElementById("movie_player") || null;
  }

  let lastValidatedPlayer = null;

  // Configuration for timestamp offset
  const OFFSET_KEY = "timestampOffsetSeconds";
  const DEFAULT_OFFSET = -5;

  // Configuration for shift-click time skip interval
  const SHIFT_SKIP_KEY = "shiftClickTimeSkipSeconds";
  const DEFAULT_SHIFT_SKIP = 10;

  // Create a BroadcastChannel for cross-tab communication
  const channel = new BroadcastChannel('ytls_timestamp_channel');

  // Listen for messages from other tabs
  channel.onmessage = (event) => {
    console.log('Received message from another tab:', event.data);
    if (!isSupportedUrl() || !list || !pane) {
      return;
    }
    if (event.data && event.data.type === 'timestamps_updated' && event.data.videoId === getVideoId()) {
      console.log('Debouncing timestamp load due to external update for video:', event.data.videoId);
      clearTimeout(loadTimeoutId); // Clear existing load timeout
      loadTimeoutId = setTimeout(() => {
        console.log('Reloading timestamps due to external update for video:', event.data.videoId);
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
  ]

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
  if (typeof configuredOffset === 'undefined') {
    await GM.setValue(OFFSET_KEY, DEFAULT_OFFSET);
    configuredOffset = DEFAULT_OFFSET;
  }

  let configuredShiftSkip = await GM.getValue(SHIFT_SKIP_KEY);
  if (typeof configuredShiftSkip === 'undefined') {
    await GM.setValue(SHIFT_SKIP_KEY, DEFAULT_SHIFT_SKIP);
    configuredShiftSkip = DEFAULT_SHIFT_SKIP;
  }

  let saveTimeoutId = null; // Variable to hold the timeout ID for debouncing
  let loadTimeoutId = null; // Variable to hold the timeout ID for debouncing loads from broadcast
  let isMouseOverTimestamps = false; // Default to false
  let settingsModalInstance = null; // To keep a reference to the settings modal
  let settingsCogButtonElement = null; // To keep a reference to the settings cog button

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

  // Update existing calls to formatTimeString to pass video duration
  function formatTime(e, t) {
    const video = document.querySelector("video");
    const videoDuration = video ? Math.floor(video.duration) : 0;
    e.textContent = formatTimeString(t, videoDuration);
    e.dataset.time = t;
    const vid = location.search.split(/.+v=|&/)[1] || location.href.split(/\/live\/|\/shorts\/|\?|&/)[1];
    e.href = "https://www.youtube.com/watch?v=" + vid + "&t=" + t;
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

  function handleClick(e) {
    const player = document.getElementById("movie_player");

    if (e.target.dataset.time) {
      e.preventDefault();
      const newTime = e.target.dataset.time;
      if (player) {
        player.seekTo(newTime);
      }
      // Highlight the clicked timestamp immediately
      const clickedLi = e.target.closest('li');
      if (clickedLi) {
        Array.from(list.children).forEach(li => {
          if (li.style.background !== "darkred") {
            li.style.background = "rgba(255, 255, 255, 0.05)";
          }
        });
        if (clickedLi.style.background !== "darkred") {
          clickedLi.style.background = "rgba(0, 128, 255, 0.2)";
        }
      }
    } else if (e.target.dataset.increment) {
      e.preventDefault();
      var t_link = e.target.parentElement.querySelector('a[data-time]'); // Link element
      var currTime = parseInt(t_link.dataset.time);
      var increment = parseInt(e.target.dataset.increment);

      // Check if Shift key is pressed
      if (e.shiftKey) {
        increment *= configuredShiftSkip; // Use configured shift skip interval
      }

      var newTime = Math.max(0, currTime + increment);
      formatTime(t_link, newTime); // Update the link's display and data-time
      if (player) {
        pendingSeekTime = newTime;
        if (seekTimeoutId) clearTimeout(seekTimeoutId);
        seekTimeoutId = setTimeout(() => {
          player.seekTo(pendingSeekTime);
          if (player.getPlayerState() === 2){
            document.querySelector(".ytp-play-button").click();
          }
          seekTimeoutId = null;
        }, 500);
      }

      // Update time differences for all timestamps
      updateTimeDifferences();

      // No automatic reordering here. User will click the sort button.
      updateSeekbarMarkers();
      saveTimestamps();
    } else if (e.target.dataset.action === "clear") {
      e.preventDefault();
      list.textContent = "";
      // No need to call updateTimeDifferences() since all timestamps are removed
      updateSeekbarMarkers();
      updateScroll();
      saveTimestamps();
    }
  }

  function addTimestamp(e, t, doNotSave = false, guid = null) {
    if (!list) return null;
    // Ensure timestamp is not negative. Usually occurs for pre-live videos.
    e = Math.max(0, e);

    // Generate or use provided GUID
    const timestampGuid = guid || crypto.randomUUID();

    var li = document.createElement("li"), timeRow = document.createElement("div"), minus = document.createElement("span"),
      record = document.createElement("span"), plus = document.createElement("span"), a = document.createElement("a"),
      timeDiff = document.createElement("span"), commentInput = document.createElement("input"), del = document.createElement("button");

    // Store GUID as a data attribute
    li.dataset.guid = timestampGuid;

    timeRow.className = "time-row";
    minus.textContent = "➖"; minus.dataset.increment = -1; minus.style.cursor = "pointer";
    plus.textContent = "➕"; plus.dataset.increment = 1; plus.style.cursor = "pointer";
    record.textContent = "⏺️"; record.style.cursor = "pointer"; record.style.margin = "0 5px;";
    record.title = "Set to current playback time";

    // Add click event to the record button
    record.onclick = () => {
      const player = document.getElementById("movie_player");
      if (player) {
        const currentTime = Math.floor(player.getCurrentTime());
        formatTime(a, currentTime);
        updateTimeDifferences();
        saveTimestamps();
      }
    };

    formatTime(a, e);
    commentInput.value = t || "";
    commentInput.style = "width:100%;margin-top:5px;display:block;";
    commentInput.addEventListener("input", () => {
      clearTimeout(saveTimeoutId); // Clear existing timeout
      saveTimeoutId = setTimeout(saveTimestamps, 500); // Set new timeout
    });
    del.textContent = "🗑️"; del.style = "background:transparent;border:none;color:white;cursor:pointer;margin-left:5px;";
    del.onclick = () => {
      if (li.dataset.deleteConfirmed === "true") {
        li.remove(); // Remove the timestamp
        updateTimeDifferences(); // Update time differences after deletion
        updateSeekbarMarkers();
        updateScroll();
        saveTimestamps();
      } else {
        li.dataset.deleteConfirmed = "true"; // Mark as ready for deletion
        li.style.background = "darkred"; // Change background to dark red

        // Reset deletion state after 5 seconds
        setTimeout(() => {
          if (li.dataset.deleteConfirmed === "true") {
            li.dataset.deleteConfirmed = "false"; // Reset the flag
            li.style.background = "rgba(255, 255, 255, 0.05)"; // Reset background
          }
        }, 5000);
      }
    };

    // Setup time difference span
    timeDiff.className = 'time-diff';
    timeDiff.style.color = '#888';
    timeDiff.style.marginLeft = '5px';

    timeRow.append(minus, record, plus, a, timeDiff, del);
    li.append(timeRow, commentInput);
    li.style = "display:flex;flex-direction:column;gap:5px;padding:5px;background:rgba(255,255,255,0.05);border-radius:3px;";

    // Insert the new timestamp in the correct sorted position
    const newTime = parseInt(a.dataset.time);
    let inserted = false;
    const existingItems = Array.from(list.children);

    for (let i = 0; i < existingItems.length; i++) {
      const existingLi = existingItems[i];
      const existingTime = parseInt(existingLi.querySelector('a[data-time]').dataset.time);

      if (newTime < existingTime) {
        // Insert before this item
        list.insertBefore(li, existingLi);
        inserted = true;

        // Update time difference for the new timestamp
        const prevLi = existingItems[i - 1];
        if (prevLi) {
          const prevTime = parseInt(prevLi.querySelector('a[data-time]').dataset.time);
          const diff = newTime - prevTime;
          timeDiff.textContent = `${formatTimeString(diff)}`;
        }

        // Update time difference for the next timestamp
        const nextTimeDiff = existingLi.querySelector('.time-diff');
        if (nextTimeDiff) {
          const diff = existingTime - newTime;
          nextTimeDiff.textContent = `${formatTimeString(diff)}`;
        }
        break;
      }
    }

    if (!inserted) {
      // Append to the end if it's the latest or list is empty
      list.appendChild(li);

      // Update time difference if there's a previous timestamp
      if (existingItems.length > 0) {
        const lastLi = existingItems[existingItems.length - 1];
        const lastTime = parseInt(lastLi.querySelector('a[data-time]').dataset.time);
        const diff = newTime - lastTime;
        timeDiff.textContent = `${formatTimeString(diff)}`;
      }
    }

    // Scroll to the newly added timestamp
    li.scrollIntoView({ behavior: "smooth", block: "center" });

    updateScroll();
    updateSeekbarMarkers();
    if (!doNotSave) {
      saveTimestamps();
    }
    return commentInput;
  }

  // Helper function to update time differences for timestamps
  function updateTimeDifferences(startIndex = 0) {
    if (!list || list.querySelector('.ytls-error-message')) {
      return;
    }

    const items = Array.from(list.children);
    items.forEach((item, index) => {
      const timeDiffSpan = item.querySelector('.time-diff');
      if (timeDiffSpan) {
        const timeLink = item.querySelector('a[data-time]');
        if (!timeLink) {
          timeDiffSpan.textContent = '';
          return;
        }
        if (index > 0) {
          const currentTime = parseInt(timeLink.dataset.time);
          const previousLink = items[index - 1].querySelector('a[data-time]');
          if (!previousLink) {
            timeDiffSpan.textContent = '';
            return;
          }
          const prevTime = parseInt(previousLink.dataset.time);
          const diff = currentTime - prevTime;
          const sign = diff < 0 ? '-' : '';
          timeDiffSpan.textContent = ` ${sign}${formatTimeString(Math.abs(diff))}`;
        } else {
          timeDiffSpan.textContent = '';
        }
      }
    });
  }

  function sortTimestampsAndUpdateDisplay() {
    if (!list || list.querySelector('.ytls-error-message')) {
      return;
    }

    const items = Array.from(list.children);
    const sortedItems = items.map(li => {
      const timeLink = li.querySelector('a[data-time]');
      if (!timeLink) {
        return null;
      }
      const time = parseInt(timeLink.dataset.time);
      const guid = li.dataset.guid;
      return { time, guid, element: li };
    }).filter(Boolean).sort((a, b) => {
      // First sort by time
      const timeDiff = a.time - b.time;
      if (timeDiff !== 0) return timeDiff;
      // If times are equal, sort by GUID to maintain consistent order
      return (a.guid || '').localeCompare(b.guid || '');
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
    saveTimestamps(); // Save after sorting
  }

  function updateScroll() {
    if (!list) return;
    var tsCount = list.children.length;
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
    var video = document.querySelector("video");
    var progressBar = document.querySelector(".ytp-progress-bar");
    var player = document.getElementById("movie_player");

    // Skip if video isn't ready, progress bar isn't found, or if it's a live stream
    if (!video || !progressBar || !isFinite(video.duration) ||
        (player && player.getVideoData && player.getVideoData().isLive)) return;

    removeSeekbarMarkers();

    var timestamps = Array.from(list.children).map(li => {
      var startLink = li.querySelector('a[data-time]');
      if (!startLink) {
        return null;
      }
      var commentInput = li.querySelector('input');
      var comment = commentInput ? commentInput.value : "";
      var startTime = parseInt(startLink.dataset.time);
      var guid = li.dataset.guid || crypto.randomUUID();
      // Update the element's GUID if it was missing
      if (!li.dataset.guid) li.dataset.guid = guid;
      return { start: startTime, comment: comment, guid: guid };
    }).filter(Boolean);

    timestamps.forEach(ts => {
      if (ts.start) {
        var marker = document.createElement("div");
        marker.className = "ytls-marker";
        marker.style.position = "absolute";
        marker.style.height = "100%";
        marker.style.width = "2px";
        marker.style.backgroundColor = "#ff0000";
        marker.style.cursor = "pointer";
        marker.style.left = (ts.start / video.duration * 100) + "%";
        marker.dataset.time = ts.start;
        marker.addEventListener("click", () => video.currentTime = ts.start);
        progressBar.appendChild(marker);
      }
    });
  }

  function saveTimestamps() {
    if (!list) return;
    if (list.querySelector('.ytls-error-message')) {
      return; // Skip saving when displaying an error message
    }

    const videoId = getVideoId();
    if (!videoId) return;

    const currentTimestampsFromUI = Array.from(list.children).map(li => {
      const startLink = li.querySelector('a[data-time]');
      if (!startLink) {
        return null;
      }
      const commentInput = li.querySelector('input');
      const comment = commentInput ? commentInput.value : '';
      const startTime = parseInt(startLink.dataset.time);
      const guid = li.dataset.guid || crypto.randomUUID(); // Use existing GUID or generate new one
      return { start: startTime, comment: comment, guid: guid };
    }).filter(Boolean);

    // Sort timestamps from UI just in case, though they should generally be in order.
    currentTimestampsFromUI.sort((a, b) => a.start - b.start);

    if (currentTimestampsFromUI.length === 0) {
      // If there are no timestamps in the UI, remove the IndexedDB entry
      removeFromIndexedDB(videoId)
        .then(() => console.log(`Removed timestamps for ${videoId} from IndexedDB`))
        .catch(err => console.error(`Failed to remove timestamps for ${videoId} from IndexedDB:`, err));
      // Notify other tabs about the update
      channel.postMessage({ type: 'timestamps_updated', videoId: videoId, action: 'removed' });
    } else {
      // Save UI timestamps directly to IndexedDB
      saveToIndexedDB(videoId, currentTimestampsFromUI)
        .then(() => console.log(`Saved timestamps for ${videoId} to IndexedDB`))
        .catch(err => console.error(`Failed to save timestamps for ${videoId} to IndexedDB:`, err));
      // Notify other tabs about the update
      channel.postMessage({ type: 'timestamps_updated', videoId: videoId, action: 'saved' });
    }
  }

  async function saveTimestampsAs(format) {
    if (!list) return;
    if (list.querySelector('.ytls-error-message')) {
      alert("Cannot export timestamps while displaying an error message.");
      return;
    }

    const videoId = getVideoId();
    if (!videoId) return;

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
    } else {
      console.log(`Exporting timestamps for video ID: ${videoId}`);
    }

    const player = document.getElementById("movie_player");
    const videoDuration = player ? Math.floor(player.getDuration()) : 0;

    const timestamps = Array.from(list.children).map(li => {
      const startLink = li.querySelector('a[data-time]');
      if (!startLink) {
        return null;
      }
      const commentInput = li.querySelector('input');
      const comment = commentInput ? commentInput.value : '';
      const startTime = parseInt(startLink.dataset.time);
      const guid = li.dataset.guid || crypto.randomUUID(); // Use existing GUID or generate new one
      return {
        start: startTime,
        comment: comment,
        guid: guid
      };
    }).filter(Boolean);

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
        } else {
          console.log(`No timestamps found in IndexedDB for ${videoId}`);
          // Attempt to load from localStorage as a fallback (for migration)
          const savedDataRaw = localStorage.getItem(`ytls-${videoId}`);
          if (savedDataRaw) {
            console.log(`Found data in localStorage for ${videoId}, attempting to migrate.`);
            try {
              let parsedData = JSON.parse(savedDataRaw);
              if (parsedData && parsedData.video_id === videoId && Array.isArray(parsedData.timestamps)) {
                finalTimestampsToDisplay = parsedData.timestamps.filter(ts =>
                  ts && typeof ts.start === 'number' && typeof ts.comment === 'string'
                ).map(ts => ({
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
              } else {
                console.warn(`localStorage data for ${videoId} is not in the expected format. Ignoring.`);
              }
            } catch (e) {
              console.error("Failed to parse localStorage data during migration:", e);
            }
          }
        }
      } catch (dbError) {
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
        pane.classList.remove("minimized");
        updateSeekbarMarkers();
      } else {
        pane.classList.add("minimized");
        clearTimestampsDisplay(); // Ensure UI is cleared if no timestamps are found
        updateSeekbarMarkers(); // Ensure seekbar markers are cleared
      }
    } catch (err) {
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
    if (clipIdMeta) {
      return clipIdMeta.content; // Return the clip identifier if available
    }

    // Return null if no video ID or clip identifier is found
    return null;
  }

  function highlightNearestTimestamp() {
    const video = document.querySelector("video");
    if (!video || !list) return;

    video.addEventListener("timeupdate", () => {
      if (!list) return;
      if (isMouseOverTimestamps) return; // Skip auto-scrolling if the mouse is over the timestamps window

      const playerInstance = document.getElementById("movie_player");
      if (!hasRequiredPlayerMethods(playerInstance)) return;

      const currentTime = Math.floor(playerInstance.getCurrentTime());
      let nearestTimestamp = null;
      let smallestDifference = Infinity;

      // Find the nearest timestamp
      Array.from(list.children).forEach(li => {
        const timeLink = li.querySelector('a[data-time]');
        if (!timeLink) {
          return;
        }
        const timestamp = parseInt(timeLink.dataset.time);
        const difference = Math.abs(currentTime - timestamp);
        if (difference < smallestDifference) {
          smallestDifference = difference;
          nearestTimestamp = li;
        }
      });

      // Highlight the nearest timestamp
      Array.from(list.children).forEach(li => {
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
  const DB_VERSION = 1;
  const STORE_NAME = 'timestamps';

  function openIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'video_id' });
        }
      };
      request.onsuccess = function (event) {
        resolve(event.target.result);
      };
      request.onerror = function (event) {
        reject(event.target.error);
      };
    });
  }

  function saveToIndexedDB(videoId, data) {
    return openIndexedDB().then(db => {
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put({ video_id: videoId, timestamps: data });
        tx.oncomplete = () => resolve();
        tx.onerror = (e) => reject(e);
      });
    });
  }

  function loadFromIndexedDB(videoId) {
    return openIndexedDB().then(db => {
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(videoId);
        req.onsuccess = () => resolve(req.result ? req.result.timestamps : null);
        req.onerror = (e) => reject(e);
      });
    });
  }

  function removeFromIndexedDB(videoId) {
    return openIndexedDB().then(db => {
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.delete(videoId);
        tx.oncomplete = () => resolve();
        tx.onerror = (e) => reject(e);
      });
    });
  }

  function processImportedData(contentString) {
    if (!list) {
      console.warn("Timekeeper UI is not initialized; cannot import timestamps.");
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
              // Look for exact GUID match first
              const existingLi = Array.from(list.children).find(li => li.dataset.guid === ts.guid);
              if (existingLi) {
                const commentInput = existingLi.querySelector('input');
                if (commentInput) commentInput.value = ts.comment;
              } else {
                // Use the original GUID when creating new timestamp
                addTimestamp(ts.start, ts.comment, false, ts.guid);
              }
            } else {
              // Only generate new GUID if timestamp doesn't have one
              addTimestamp(ts.start, ts.comment, false, crypto.randomUUID());
            }
          });
          processedSuccessfully = true;
        } else {
          console.warn("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.");
        }
      } else {
        console.warn("Parsed JSON, but it's not an array. Trying as plain text.");
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
            let existingLi = null;
            if (guid) {
              existingLi = Array.from(list.children).find(li => li.dataset.guid === guid);
            }
            if (!existingLi && !guid) {
              // Only try timestamp matching if no GUID is present
              existingLi = Array.from(list.children).find(li => {
                if (li.dataset.guid) return false; // Skip entries that already have GUIDs
                const timeLink = li.querySelector('a[data-time]');
                return timeLink && parseInt(timeLink.dataset.time) === start;
              });
            }
            if (existingLi) {
              const commentInput = existingLi.querySelector('input');
              if (commentInput) commentInput.value = comment;
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
      saveTimestamps();
      updateSeekbarMarkers();
      updateScroll();
      // alert("Timestamps loaded and merged successfully!");
    } else {
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
        document.body.removeChild(modal);
        resolve(true); // User chose to include
      };

      const noButton = document.createElement("button");
      noButton.textContent = "No, Exclude";
      noButton.style = "background:#f44336;color:white;padding:12px 22px;border:none;border-radius:8px;cursor:pointer;font-size:15px;flex-grow:1;";
      noButton.onmouseover = () => noButton.style.background = "#e53935";
      noButton.onmouseout = () => noButton.style.background = "#f44336";
      noButton.onclick = () => {
        document.body.removeChild(modal);
        resolve(false); // User chose to exclude
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
      const playerInstance = lastValidatedPlayer || document.getElementById("movie_player");
      if (playerInstance && typeof playerInstance.seekToLiveHead === "function") {
        playerInstance.seekToLiveHead();
      }
    };

    minimizeBtn.textContent = "▶️";
    minimizeBtn.classList.add("ytls-minimize-button");
    minimizeBtn.id = "ytls-minimize";
    function updateTime() {
      const player = document.getElementById("movie_player");
      const video = document.querySelector("video");
      if (player && video) {
        var t = Math.floor(player.getCurrentTime());
        var h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, s = t % 60;

        // Get video data to check if it's a live stream
        const isLive = player.getVideoData && player.getVideoData().isLive;

        // Get all timestamps
        const timestamps = list ? Array.from(list.children).map(li => {
          const timeLink = li.querySelector('a[data-time]');
          return timeLink ? parseFloat(timeLink.getAttribute('data-time')) : 0;
        }) : [];

        let timestampDisplay = "";
        if (timestamps.length > 0) {  // Only calculate and show rate if there are timestamps
          if (isLive) {
            // For live streams: calc ts/min based on current play head position,
            // since we can't get an accurate total duration during live streams.
            const currentTimeMinutes = Math.max(1, t / 60);
            const liveTimestamps = timestamps.filter(time => time <= t);
            if (liveTimestamps.length > 0) {
              const timestampsPerMin = (liveTimestamps.length / currentTimeMinutes).toFixed(2);
              if (parseFloat(timestampsPerMin) > 0) {
                timestampDisplay = ` (${timestampsPerMin}/min)`;
              }
            }
          } else {
            // For regular videos: calculate ts/min based on total duration
            const totalMinutes = Math.max(1, video.duration / 60);
            const timestampsPerMin = (timestamps.length / totalMinutes).toFixed(1);
            if (parseFloat(timestampsPerMin) > 0) {
              timestampDisplay = ` (${timestampsPerMin}/min)`;
            }
          }
        }

        timeDisplay.textContent = `CT: ${h ? h + ":" + String(m).padStart(2, "0") : m}:${String(s).padStart(2, "0")}${timestampDisplay}`;
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
      if (!list || list.querySelector('.ytls-error-message')) {
        return;
      }

      const player = document.getElementById("movie_player");
      if (player) {
        // Use configuredOffset if available, otherwise default to 0
        const offset = typeof configuredOffset !== 'undefined' ? configuredOffset : 0;
        const currentTime = Math.floor(player.getCurrentTime() + offset);
        // Call addTimestamp with doNotSave = true to prevent immediate save
        const newCommentInput = addTimestamp(currentTime, "", true);
        if (newCommentInput) { // addTimestamp returns the input element
          newCommentInput.focus();
        }
        // No direct saveTimestamps() call here; debounced save on input will handle it.
      }
    };

    const handleCopyTimestamps = function (e) { // Accept event parameter to check Ctrl key
      if (!list || list.querySelector('.ytls-error-message')) {
        this.textContent = "❌";
        setTimeout(() => { this.textContent = "📋"; }, 2000);
        return;
      }

      const video = document.querySelector("video");
      const videoDuration = video ? Math.floor(video.duration) : 0;

      const timestamps = Array.from(list.children).map(li => {
        const startLink = li.querySelector('a[data-time]');
        if (!startLink) {
          return null;
        }
        const commentInput = li.querySelector('input');
        const comment = commentInput ? commentInput.value : '';
        const startTime = parseInt(startLink.dataset.time);
        const guid = li.dataset.guid || crypto.randomUUID(); // Use existing GUID or generate new one
        return { start: startTime, comment: comment, guid: guid };
      }).filter(Boolean);

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
        } else {
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
        button.onclick = function(e) { config.action.call(this, e); };
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
        // Modal exists and is visible, so close it
        document.body.removeChild(settingsModalInstance);
        settingsModalInstance = null;
        document.removeEventListener('click', handleClickOutsideSettingsModal, true); // Remove click-outside listener
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
                document.body.removeChild(settingsModalInstance);
                settingsModalInstance = null;
                document.removeEventListener('click', handleClickOutsideSettingsModal, true);
            }
        }}
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
            document.body.removeChild(settingsModalInstance);
            settingsModalInstance = null;
            document.removeEventListener('click', handleClickOutsideSettingsModal, true);
        }
      }
    }

    // Add a save button to the buttons section
    var saveBtn = document.createElement("button");
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
        saveTimestampsAs("json");
        document.body.removeChild(modal);
      };

      const textButton = document.createElement("button");
      textButton.textContent = "Plain Text";
      textButton.classList.add("ytls-save-modal-button"); // Added class
      textButton.onclick = () => {
        saveTimestampsAs("text");
        document.body.removeChild(modal);
      };

      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Cancel";
      cancelButton.classList.add("ytls-save-modal-cancel-button"); // Added class
      cancelButton.onclick = () => {
        document.body.removeChild(modal);
      };

      modal.appendChild(message);
      modal.appendChild(jsonButton);
      modal.appendChild(textButton);
      modal.appendChild(cancelButton);
      document.body.appendChild(modal);
    };

    // Add a load button to the buttons section
    var loadBtn = document.createElement("button");
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
        document.body.removeChild(loadModal);
        // Create a hidden file input element
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".json,.txt"; // Accept JSON and plain text files
        fileInput.classList.add("ytls-hidden-file-input"); // Added class

        fileInput.onchange = (event) => {
          const file = event.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = () => {
            const content = reader.result.trim();
            processImportedData(content);
          };
          reader.readAsText(file);
        };
        fileInput.click();
      };

      const fromClipboardButton = document.createElement("button");
      fromClipboardButton.textContent = "Clipboard";
      fromClipboardButton.style = "background:#555;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;";
      fromClipboardButton.onclick = async () => {
        document.body.removeChild(loadModal);
        try {
          const clipboardText = await navigator.clipboard.readText();
          if (clipboardText) {
            processImportedData(clipboardText.trim());
          } else {
            alert("Clipboard is empty.");
          }
        } catch (err) {
          console.error("Failed to read from clipboard: ", err);
          alert("Failed to read from clipboard. Ensure you have granted permission.");
        }
      };

      const cancelLoadButton = document.createElement("button");
      cancelLoadButton.textContent = "Cancel";
      cancelLoadButton.style = "background:#444;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;margin-top:15px;display:block;width:100%;";
      cancelLoadButton.onclick = () => {
        document.body.removeChild(loadModal);
      };

      loadModal.appendChild(loadMessage);
      loadModal.appendChild(fromFileButton);
      loadModal.appendChild(fromClipboardButton);
      loadModal.appendChild(cancelLoadButton);
      document.body.appendChild(loadModal);
    };

    // Add export button to the buttons section
    var exportBtn = document.createElement("button");
    exportBtn.textContent = "📤 Export";
    exportBtn.classList.add("ytls-file-operation-button");
    exportBtn.onclick = async () => {
      const exportData = {};
      const db = await openIndexedDB().catch(err => {
        console.error("Failed to open IndexedDB for export:", err);
        alert("Failed to export data: Could not open database.");
        return null;
      });

      if (!db) return;

      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getAllReq = store.getAll();

      getAllReq.onsuccess = async () => { // Make this async to await calculateSHA256
        const allTimestamps = getAllReq.result;
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
              if (isUnlisted) isUnlistedRestrictedFound = true;
              if (isMembers) isMembersOnlyRestrictedFound = true;
            }
          }
        }

        let videoType = "";
        if (isUnlistedRestrictedFound && isMembersOnlyRestrictedFound) {
            videoType = "unlisted and members-only";
        } else if (isUnlistedRestrictedFound) {
            videoType = "unlisted";
        } else if (isMembersOnlyRestrictedFound) {
            videoType = "members-only";
        }

        if (restrictedCount > 0) {
          const userChoice = await showRestrictedExportConfirmationModal(restrictedCount, videoType);
          if (userChoice) {
            includeRestricted = true;
          } else {
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
            } else {
              let restrictedTypeInfo = [];
              if (isUnlisted) restrictedTypeInfo.push("Unlisted");
              if (isMembers) restrictedTypeInfo.push("Members-Only");
              console.log(`Skipping export for restricted video ID: ${videoData.video_id} (Type: ${restrictedTypeInfo.join('/')})`);
            }
          } else {
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
      };

      getAllReq.onerror = (event) => {
        console.error("Error fetching data from IndexedDB for export:", event.target.error);
        alert("Failed to export data: Could not read from database.");
      };
    };

    // Add import button to the buttons section
    var importBtn = document.createElement("button");
    importBtn.textContent = "📥 Import";
    importBtn.classList.add("ytls-file-operation-button");
    importBtn.onclick = () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".json";
      fileInput.classList.add("ytls-hidden-file-input"); // Added class

      fileInput.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
          try {
            const importedData = JSON.parse(reader.result);
            let importPromises = [];

            for (let key in importedData) {
              if (key.startsWith("ytls-")) {
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
                } else {
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
          } catch (e) {
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
    `;

    minimizeBtn.onclick = () => {
      if (!dragOccurredSinceLastMouseDown) { // Check the flag before toggling
        pane.classList.toggle("minimized");
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

    // Load pane position from localStorage
    const panePositionKey = "ytls-pane-position";
    function loadPanePosition() {
      if (!pane) return;
      const pos = localStorage.getItem(panePositionKey);
      if (pos) {
        try {
          const { left, top, right, bottom } = JSON.parse(pos);
          if (left !== undefined && top !== undefined) {
            pane.style.left = left;
            pane.style.top = top;
            pane.style.right = right;
            pane.style.bottom = bottom;
          }
        } catch { }
      }
    }
    function savePanePosition() {
      if (!pane) return;
      const style = pane.style;
      localStorage.setItem(panePositionKey, JSON.stringify({
        left: style.left,
        top: style.top,
        right: style.right,
        bottom: style.bottom
      }));
    }

    // Enable dragging and edge snapping for the pane
    pane.style.position = "fixed";
    pane.style.bottom = "0";
    pane.style.right = "0";
    pane.style.transition = "all 0.2s ease";
    loadPanePosition();

    let isDragging = false;
    let offsetX, offsetY;
    let dragOccurredSinceLastMouseDown = false; // Flag to track if a drag occurred

    pane.addEventListener("mousedown", (e) => {
      // Prevent dragging if the target is an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Prevent dragging if the cursor is a pointer
      if (window.getComputedStyle(e.target).cursor === 'pointer') {
        return;
      }

      isDragging = true;
      dragOccurredSinceLastMouseDown = false;
      offsetX = e.clientX - pane.getBoundingClientRect().left;
      offsetY = e.clientY - pane.getBoundingClientRect().top;

      pane.style.transition = "none";
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      dragOccurredSinceLastMouseDown = true; // Set flag if mouse moves while dragging

      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;

      pane.style.left = `${x}px`;
      pane.style.top = `${y}px`;
      pane.style.right = "auto";
      pane.style.bottom = "auto";
    });

    document.addEventListener("mouseup", () => {
      if (!isDragging) return;

      isDragging = false;
      setTimeout(() => {
        dragOccurredSinceLastMouseDown = false; // Reset the flag after a short delay
      }, 50);
      pane.style.transition = "all 0.2s ease"; // Re-enable transition

      // Snap to the nearest edge
      const rect = pane.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Calculate distances to edges
      const distanceToLeft = rect.left;
      const distanceToRight = windowWidth - rect.right;
      const distanceToTop = rect.top;
      const distanceToBottom = windowHeight - rect.bottom;

      // Find the closest edge
      const minDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);

      if (minDistance === distanceToLeft) {
        pane.style.left = "0";
        pane.style.right = "auto";
      } else if (minDistance === distanceToRight) {
        pane.style.left = "auto";
        pane.style.right = "0";
      } else if (minDistance === distanceToTop) {
        pane.style.top = "0";
        pane.style.bottom = "auto";
      } else if (minDistance === distanceToBottom) {
        pane.style.top = "auto";
        pane.style.bottom = "0";
      }
      savePanePosition();
    });

    // Prevent text selection during drag
    pane.addEventListener("dragstart", (e) => e.preventDefault());

    // Ensure the timestamps window is fully onscreen after resizing
    window.addEventListener("resize", () => {
      if (!pane) return;
      const rect = pane.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Adjust the pane's position if it goes offscreen
      if (rect.right > windowWidth) {
        pane.style.left = `${windowWidth - rect.width}px`;
        pane.style.right = "auto";
      }
      if (rect.bottom > windowHeight) {
        pane.style.top = `${windowHeight - rect.height}px`;
        pane.style.bottom = "auto";
      }
      if (rect.left < 0) {
        pane.style.left = "0";
        pane.style.right = "auto";
      }
      if (rect.top < 0) {
        pane.style.top = "0";
        pane.style.bottom = "auto";
      }
      savePanePosition();
    });

    header.appendChild(minimizeBtn); // Add minimize button to the header first
    header.appendChild(timeDisplay); // Then add timeDisplay
    header.appendChild(versionDisplay); // Add versionDisplay to header

    var content = document.createElement("div"); content.id = "ytls-content";
    content.append(list, btns); // list and btns are now directly in content; header is separate

  pane.append(header, content, style); // Append header, then content, then style to the pane
  document.body.appendChild(pane);

    // Add event listener for video pause to update URL
    const video = document.querySelector("video");
    if (video) {
      video.addEventListener("pause", () => {
        const playerInstance = lastValidatedPlayer || document.getElementById("movie_player");
        if (playerInstance && typeof playerInstance.getCurrentTime === "function") {
          const currentTime = Math.floor(playerInstance.getCurrentTime());
          updateBrowserUrlWithTimestamp(currentTime); // Use helper function
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
      // Only save if focus leaves the list or its children
      if (!list.contains(e.relatedTarget)) {
        saveTimestamps();
      }
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
      if (idx > 0) el.remove();
    });

    const currentVideoId = getVideoId(); // Still useful for logging
    const pageTitle = document.title;
    console.log("Page Title:", pageTitle);
    console.log("Video ID:", currentVideoId);
    console.log("Current URL:", window.location.href);

    clearTimestampsDisplay();
    updateSeekbarMarkers();

    // loadTimestamps will get the videoId itself, load data from IndexedDB (migrating from localStorage if needed),
    // and manage pane visibility (minimized or not) based on whether timestamps are found.
    await loadTimestamps();

    // highlightNearestTimestamp sets up listeners on the video element if present
    // for continuous highlighting of the nearest timestamp.
    highlightNearestTimestamp();
  }

  window.addEventListener("yt-navigate-finish", handleUrlChange);

  // Initial call to handle the current URL
  await handleUrlChange();
})();
