// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      4.1.2
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

(() => {
  // src/styles.ts
  var PANE_STYLES = `
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
    position: relative;
  }
  .ytls-main-button:hover {
    background: rgb(63, 63, 63);
  }
  .ytls-holiday-emoji {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 0.25em;
    pointer-events: none;
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
  #ytls-pane .ytls-google-user-display {
    font-size:12px;
    color:#4285f4;
    margin-left:8px;
    padding:2px 6px;
    cursor:default;
    background:rgba(66, 133, 244, 0.1);
    border-radius:4px;
  }
  #ytls-pane .ytls-backup-status-display {
    font-size:12px;
    color:#9acd32; /* yellowgreen */
    margin-left:8px;
    padding:2px 6px;
    cursor:default;
    background:rgba(154, 205, 50, 0.12);
    border-radius:4px;
  }
  #ytls-current-time {
    color:white;
    font-size:14px;
    cursor:pointer;
    position:relative;
  }

  /* Shared modal container styles */
  #ytls-settings-modal {
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    background:#1a1a1a;
    padding:8px;
    border-radius:10px;
    z-index:10000;
    color:white;
    text-align:center;
    width:200px;
    box-shadow:0 0 10px rgba(0,0,0,0.5);
  }
  #ytls-save-modal,
  #ytls-load-modal {
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    background:#333;
    padding:8px;
    border-radius:10px;
    z-index:10000;
    color:white;
    text-align:center;
    width:fit-content;
    max-width:90vw;
    box-shadow:0 0 10px rgba(0,0,0,0.5);
  }

  /* Modal header with tabs and close button */
  .ytls-modal-header {
    display:flex;
    align-items:flex-end;
    margin-bottom:0;
    gap:10px;
  }

  /* Modal close button (X in header) */
  .ytls-modal-close-button {
    position:absolute;
    top:8px;
    right:8px;
    width:16px;
    height:16px;
    background:#ff4444;
    color:white;
    border:none;
    border-radius:3px;
    font-size:14px;
    font-weight:bold;
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    line-height:1;
    padding:0;
    flex-shrink:0;
    z-index:1;
  }
  .ytls-modal-close-button:hover {
    background:#ff6666;
  }

  /* Styles for settings modal */
  #ytls-settings-content {
    display:flex;
    flex-direction:column;
    gap:10px;
    align-items:center;
    background:#2a2a2a;
    border:2px solid #3a3a3a;
    border-radius:0 4px 4px 4px;
    padding:10px;
    margin-top:-2px;
    position:relative;
    z-index:1;
  }

  /* Section heading */
  .ytls-section-heading {
    margin:0 0 10px 0;
    padding:0;
    font-size:16px;
    font-weight:bold;
    color:#fff;
    text-align:center;
  }

  /* Settings nav (tabs) */
  #ytls-settings-nav {
    display:flex;
    gap:6px;
    flex:0;
  }
  #ytls-settings-nav .ytls-settings-modal-button {
    flex:0;
    width:auto;
    height:24px;
    margin-bottom:0;
    background: #2a2a2a;
    font-size:13px;
    padding:0 8px;
    display:flex;
    align-items:center;
    justify-content:center;
    line-height:1;
    border:2px solid transparent;
    border-radius:4px 4px 0 0;
    border-bottom:2px solid transparent;
    white-space:nowrap;
    position:relative;
  }
  #ytls-settings-nav .ytls-settings-modal-button .ytls-tab-text {
    display:none;
  }
  #ytls-settings-nav .ytls-settings-modal-button.active .ytls-tab-text {
    display:inline;
  }
  #ytls-settings-nav .ytls-settings-modal-button:hover {
    background: #3a3a3a;
  }
  #ytls-settings-nav .ytls-settings-modal-button.active {
    background:#2a2a2a;
    border:2px solid #3a3a3a;
    border-bottom:2px solid #2a2a2a;
    z-index:2;
  }

  /* Button grid container */
  .ytls-button-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 5px;
    width: 100%;
  }

  /* Styles for buttons in the settings modal */
  .ytls-settings-modal-button {
    width: 100%;
    height: 32px;
    background: #555;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 13px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5px;
    padding: 0 8px;
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

  // src/google-drive.ts
  var googleAuthState = {
    isSignedIn: false,
    accessToken: null,
    userName: null,
    email: null
  };
  var autoBackupEnabled = true;
  var autoBackupIntervalMinutes = 30;
  var lastAutoBackupAt = null;
  var isAutoBackupRunning = false;
  var autoBackupRetryAttempts = 0;
  var autoBackupBackoffMs = null;
  var googleUserDisplay = null;
  var backupStatusDisplay = null;
  var authStatusDisplay = null;
  function setGoogleUserDisplay(el) {
    googleUserDisplay = el;
  }
  function setBackupStatusDisplay(el) {
    backupStatusDisplay = el;
  }
  function setAuthStatusDisplay(el) {
    authStatusDisplay = el;
  }
  var authSpinnerStylesInjected = false;
  function ensureAuthSpinnerStyles() {
    if (authSpinnerStylesInjected) return;
    try {
      const style = document.createElement("style");
      style.textContent = `
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`;
      document.head.appendChild(style);
      authSpinnerStylesInjected = true;
    } catch {
    }
  }
  var buildExportPayload = null;
  var saveGlobalSettings = null;
  var loadGlobalSettings = null;
  var log = null;
  var getTimestampSuffix = null;
  function setBuildExportPayload(fn) {
    buildExportPayload = fn;
  }
  function setSaveGlobalSettings(fn) {
    saveGlobalSettings = fn;
  }
  function setLoadGlobalSettings(fn) {
    loadGlobalSettings = fn;
  }
  function setLog(fn) {
    log = fn;
  }
  function setGetTimestampSuffix(fn) {
    getTimestampSuffix = fn;
  }
  var GOOGLE_CLIENT_ID = "1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com";
  var GOOGLE_SCOPES = "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile";
  var GOOGLE_REDIRECT_URI = "https://www.youtube.com/";
  var AUTO_BACKUP_INITIAL_BACKOFF_MS = 30 * 1e3;
  var AUTO_BACKUP_MAX_BACKOFF_MS = 30 * 60 * 1e3;
  var AUTO_BACKUP_MAX_RETRY_ATTEMPTS = 5;
  var autoBackupIntervalId = null;
  var autoBackupBackoffTimeoutId = null;
  async function loadGoogleAuthState() {
    try {
      const stored = await loadGlobalSettings("googleAuthState");
      if (stored && typeof stored === "object") {
        googleAuthState = { ...googleAuthState, ...stored };
        updateGoogleUserDisplay();
      }
    } catch (err) {
      log("Failed to load Google auth state:", err, "error");
    }
  }
  async function saveGoogleAuthState() {
    try {
      await saveGlobalSettings("googleAuthState", googleAuthState);
    } catch (err) {
      log("Failed to save Google auth state:", err, "error");
    }
  }
  function updateGoogleUserDisplay() {
    if (!googleUserDisplay) return;
    googleUserDisplay.style.display = "none";
  }
  function updateAuthStatusDisplay(status, message) {
    if (!authStatusDisplay) return;
    authStatusDisplay.style.fontWeight = "bold";
    if (status === "authenticating") {
      ensureAuthSpinnerStyles();
      authStatusDisplay.style.color = "#ffa500";
      while (authStatusDisplay.firstChild) authStatusDisplay.removeChild(authStatusDisplay.firstChild);
      const spinner = document.createElement("span");
      spinner.className = "tk-auth-spinner";
      const text = document.createTextNode(` ${message || "Authorizing with Google\u2026"}`);
      authStatusDisplay.appendChild(spinner);
      authStatusDisplay.appendChild(text);
      return;
    }
    if (status === "error") {
      authStatusDisplay.textContent = `\u274C ${message || "Authorization failed"}`;
      authStatusDisplay.style.color = "#ff4d4f";
      return;
    }
    if (!googleAuthState.isSignedIn) {
      authStatusDisplay.textContent = "\u274C Not signed in";
      authStatusDisplay.style.color = "#ff4d4f";
      authStatusDisplay.removeAttribute("title");
    } else {
      const displayName = googleAuthState.userName || "Signed in";
      authStatusDisplay.textContent = `\u2705 ${displayName}`;
      authStatusDisplay.style.color = "#52c41a";
      if (googleAuthState.email) {
        authStatusDisplay.title = googleAuthState.email;
      }
    }
  }
  function blinkAuthStatusDisplay() {
    if (!authStatusDisplay) return;
    ensureAuthSpinnerStyles();
    authStatusDisplay.classList.remove("tk-auth-blink");
    void authStatusDisplay.offsetWidth;
    authStatusDisplay.classList.add("tk-auth-blink");
    setTimeout(() => {
      authStatusDisplay.classList.remove("tk-auth-blink");
    }, 1200);
  }
  function monitorOAuthPopup(popup) {
    return new Promise((resolve, reject) => {
      if (!popup) {
        if (log) log("OAuth monitor: popup is null", null, "error");
        reject(new Error("Failed to open popup"));
        return;
      }
      if (log) log("OAuth monitor: starting to monitor popup for token");
      const start = Date.now();
      const timeoutMs = 5 * 60 * 1e3;
      const channelName = "timekeeper_oauth";
      let channel = null;
      let storageListener = null;
      let checkInterval = null;
      const cleanup = () => {
        if (channel) {
          try {
            channel.close();
          } catch (_) {
          }
          channel = null;
        }
        if (storageListener) {
          clearInterval(storageListener);
          storageListener = null;
        }
        if (checkInterval) {
          clearInterval(checkInterval);
          checkInterval = null;
        }
      };
      try {
        channel = new BroadcastChannel(channelName);
        if (log) log("OAuth monitor: BroadcastChannel created successfully");
        channel.onmessage = (event) => {
          if (log) log("OAuth monitor: received BroadcastChannel message", event.data);
          if (event.data?.type === "timekeeper_oauth_token" && event.data?.token) {
            if (log) log("OAuth monitor: token received via BroadcastChannel");
            cleanup();
            try {
              popup.close();
            } catch (_) {
            }
            resolve(event.data.token);
          } else if (event.data?.type === "timekeeper_oauth_error") {
            if (log) log("OAuth monitor: error received via BroadcastChannel", event.data.error, "error");
            cleanup();
            try {
              popup.close();
            } catch (_) {
            }
            reject(new Error(event.data.error || "OAuth failed"));
          }
        };
      } catch (err) {
        if (log) log("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback", err);
      }
      if (log) log("OAuth monitor: setting up IndexedDB polling");
      let lastCheckedTimestamp = Date.now();
      const pollIndexedDB = async () => {
        try {
          const openReq = indexedDB.open("ytls-timestamps-db", 3);
          openReq.onsuccess = () => {
            const db = openReq.result;
            const tx = db.transaction("settings", "readonly");
            const store = tx.objectStore("settings");
            const getReq = store.get("oauth_message");
            getReq.onsuccess = () => {
              const result = getReq.result;
              if (result && result.value) {
                const data = result.value;
                if (data.timestamp && data.timestamp > lastCheckedTimestamp) {
                  if (log) log("OAuth monitor: received IndexedDB message", data);
                  if (data.type === "timekeeper_oauth_token" && data.token) {
                    if (log) log("OAuth monitor: token received via IndexedDB");
                    cleanup();
                    try {
                      popup.close();
                    } catch (_) {
                    }
                    const delTx = db.transaction("settings", "readwrite");
                    delTx.objectStore("settings").delete("oauth_message");
                    resolve(data.token);
                  } else if (data.type === "timekeeper_oauth_error") {
                    if (log) log("OAuth monitor: error received via IndexedDB", data.error, "error");
                    cleanup();
                    try {
                      popup.close();
                    } catch (_) {
                    }
                    const delTx = db.transaction("settings", "readwrite");
                    delTx.objectStore("settings").delete("oauth_message");
                    reject(new Error(data.error || "OAuth failed"));
                  }
                  lastCheckedTimestamp = data.timestamp;
                }
              }
              db.close();
            };
          };
        } catch (err) {
          if (log) log("OAuth monitor: IndexedDB polling error", err, "error");
        }
      };
      storageListener = setInterval(pollIndexedDB, 500);
      checkInterval = setInterval(() => {
        const elapsed = Date.now() - start;
        if (elapsed > timeoutMs) {
          if (log) log("OAuth monitor: popup timed out after 5 minutes", null, "error");
          cleanup();
          try {
            popup.close();
          } catch (_) {
          }
          reject(new Error("OAuth popup timed out"));
          return;
        }
      }, 1e3);
    });
  }
  async function signInToGoogle() {
    if (!GOOGLE_CLIENT_ID) {
      updateAuthStatusDisplay("error", "Google Client ID not configured");
      return;
    }
    try {
      if (log) log("OAuth signin: starting OAuth flow");
      updateAuthStatusDisplay("authenticating", "Opening authentication window...");
      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
      authUrl.searchParams.set("redirect_uri", GOOGLE_REDIRECT_URI);
      authUrl.searchParams.set("response_type", "token");
      authUrl.searchParams.set("scope", GOOGLE_SCOPES);
      authUrl.searchParams.set("include_granted_scopes", "true");
      authUrl.searchParams.set("state", "timekeeper_auth");
      if (log) log("OAuth signin: opening popup");
      const popup = window.open(
        authUrl.toString(),
        "TimekeeperGoogleAuth",
        "width=500,height=600,menubar=no,toolbar=no,location=no"
      );
      if (!popup) {
        if (log) log("OAuth signin: popup blocked by browser", null, "error");
        updateAuthStatusDisplay("error", "Popup blocked. Please enable popups for YouTube.");
        return;
      }
      if (log) log("OAuth signin: popup opened successfully");
      updateAuthStatusDisplay("authenticating", "Waiting for authentication...");
      try {
        const accessToken = await monitorOAuthPopup(popup);
        const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: { "Authorization": `Bearer ${accessToken}` }
        });
        if (userInfoResponse.ok) {
          const userInfo = await userInfoResponse.json();
          googleAuthState.accessToken = accessToken;
          googleAuthState.isSignedIn = true;
          googleAuthState.userName = userInfo.name;
          googleAuthState.email = userInfo.email;
          await saveGoogleAuthState();
          updateGoogleUserDisplay();
          updateAuthStatusDisplay();
          if (log) {
            log(`Successfully authenticated as ${userInfo.name}`);
          } else {
            console.log(`[Timekeeper] Successfully authenticated as ${userInfo.name}`);
          }
        } else {
          throw new Error("Failed to fetch user info");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Authentication failed";
        if (log) {
          log("OAuth failed:", err, "error");
        } else {
          console.error("[Timekeeper] OAuth failed:", err);
        }
        updateAuthStatusDisplay("error", errorMessage);
        return;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Sign in failed";
      if (log) {
        log("Failed to sign in to Google:", err, "error");
      } else {
        console.error("[Timekeeper] Failed to sign in to Google:", err);
      }
      updateAuthStatusDisplay("error", `Failed to sign in: ${errorMessage}`);
    }
  }
  async function handleOAuthPopup() {
    if (!window.opener || window.opener === window) {
      return false;
    }
    if (log) log("OAuth popup: detected popup window, checking for OAuth response");
    const hash2 = window.location.hash;
    if (!hash2 || hash2.length <= 1) {
      if (log) log("OAuth popup: no hash params found");
      return false;
    }
    const hashContent = hash2.startsWith("#") ? hash2.substring(1) : hash2;
    const params = new URLSearchParams(hashContent);
    const state = params.get("state");
    if (log) log("OAuth popup: hash params found, state=" + state);
    if (state !== "timekeeper_auth") {
      if (log) log("OAuth popup: not our OAuth flow (wrong state)");
      return false;
    }
    const error = params.get("error");
    const token = params.get("access_token");
    const channelName = "timekeeper_oauth";
    if (error) {
      try {
        const channel = new BroadcastChannel(channelName);
        channel.postMessage({
          type: "timekeeper_oauth_error",
          error: params.get("error_description") || error
        });
        channel.close();
      } catch (_) {
        const message = {
          type: "timekeeper_oauth_error",
          error: params.get("error_description") || error,
          timestamp: Date.now()
        };
        const openReq = indexedDB.open("ytls-timestamps-db", 3);
        openReq.onsuccess = () => {
          const db = openReq.result;
          const tx = db.transaction("settings", "readwrite");
          tx.objectStore("settings").put({ key: "oauth_message", value: message });
          db.close();
        };
      }
      setTimeout(() => {
        try {
          window.close();
        } catch (_) {
        }
      }, 500);
      return true;
    }
    if (token) {
      if (log) log("OAuth popup: access token found, broadcasting to opener");
      try {
        const channel = new BroadcastChannel(channelName);
        channel.postMessage({
          type: "timekeeper_oauth_token",
          token
        });
        channel.close();
        if (log) log("OAuth popup: token broadcast via BroadcastChannel");
      } catch (err) {
        if (log) log("OAuth popup: BroadcastChannel failed, using IndexedDB", err);
        const message = {
          type: "timekeeper_oauth_token",
          token,
          timestamp: Date.now()
        };
        const openReq = indexedDB.open("ytls-timestamps-db", 3);
        openReq.onsuccess = () => {
          const db = openReq.result;
          const tx = db.transaction("settings", "readwrite");
          tx.objectStore("settings").put({ key: "oauth_message", value: message });
          db.close();
        };
        if (log) log("OAuth popup: token broadcast via IndexedDB");
      }
      setTimeout(() => {
        try {
          window.close();
        } catch (_) {
        }
      }, 500);
      return true;
    }
    return false;
  }
  async function signOutFromGoogle() {
    googleAuthState = {
      isSignedIn: false,
      accessToken: null,
      userName: null,
      email: null
    };
    await saveGoogleAuthState();
    updateGoogleUserDisplay();
    updateAuthStatusDisplay();
  }
  async function ensureDriveFolder(accessToken) {
    const headers = { Authorization: `Bearer ${accessToken}` };
    const q = encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)&pageSize=10`;
    const searchResp = await fetch(searchUrl, { headers });
    if (searchResp.status === 401) throw new Error("unauthorized");
    if (!searchResp.ok) throw new Error("drive search failed");
    const searchJson = await searchResp.json();
    if (Array.isArray(searchJson.files) && searchJson.files.length > 0) {
      return searchJson.files[0].id;
    }
    const createResp = await fetch("https://www.googleapis.com/drive/v3/files", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Timekeeper", mimeType: "application/vnd.google-apps.folder" })
    });
    if (createResp.status === 401) throw new Error("unauthorized");
    if (!createResp.ok) throw new Error("drive folder create failed");
    const createJson = await createResp.json();
    return createJson.id;
  }
  async function findFileInFolder(filename, folderId, accessToken) {
    const query = `name='${filename}' and '${folderId}' in parents and trashed=false`;
    const encodedQuery = encodeURIComponent(query);
    const resp = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodedQuery}&fields=files(id,name)`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (resp.status === 401) throw new Error("unauthorized");
    if (!resp.ok) return null;
    const data = await resp.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
    return null;
  }
  async function uploadJsonToDrive(filename, json, folderId, accessToken) {
    const existingFileId = await findFileInFolder(filename, folderId, accessToken);
    const boundary = "-------314159265358979";
    const delimiter = `\r
--${boundary}\r
`;
    const closeDelim = `\r
--${boundary}--`;
    const metadata = existingFileId ? { name: filename, mimeType: "application/json" } : { name: filename, mimeType: "application/json", parents: [folderId] };
    const multipartBody = delimiter + "Content-Type: application/json; charset=UTF-8\r\n\r\n" + JSON.stringify(metadata) + delimiter + "Content-Type: application/json; charset=UTF-8\r\n\r\n" + json + closeDelim;
    let url;
    let method;
    if (existingFileId) {
      url = `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=multipart&fields=id,name`;
      method = "PATCH";
    } else {
      url = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name";
      method = "POST";
    }
    const resp = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`
      },
      body: multipartBody
    });
    if (resp.status === 401) throw new Error("unauthorized");
    if (!resp.ok) throw new Error("drive upload failed");
  }
  async function exportAllTimestampsToGoogleDrive(opts) {
    if (!googleAuthState.isSignedIn || !googleAuthState.accessToken) {
      if (!opts?.silent) {
        updateAuthStatusDisplay("error", "Please sign in to Google Drive first");
      }
      return;
    }
    try {
      const { json, filename, totalVideos, totalTimestamps } = await buildExportPayload();
      const folderId = await ensureDriveFolder(googleAuthState.accessToken);
      await uploadJsonToDrive(filename, json, folderId, googleAuthState.accessToken);
      log(`Exported to Google Drive (${filename}) with ${totalVideos} videos / ${totalTimestamps} timestamps.`);
    } catch (err) {
      if (err.message === "unauthorized") {
        if (!opts?.silent) updateAuthStatusDisplay("error", "Authorization expired. Please sign in again.");
      } else {
        log("Drive export failed:", err, "error");
        if (!opts?.silent) updateAuthStatusDisplay("error", "Failed to export to Google Drive.");
      }
    }
  }
  async function loadAutoBackupSettings() {
    try {
      const enabled = await loadGlobalSettings("autoBackupEnabled");
      const interval = await loadGlobalSettings("autoBackupIntervalMinutes");
      const lastAt = await loadGlobalSettings("lastAutoBackupAt");
      if (typeof enabled === "boolean") autoBackupEnabled = enabled;
      if (typeof interval === "number" && interval > 0) autoBackupIntervalMinutes = interval;
      if (typeof lastAt === "number" && lastAt > 0) lastAutoBackupAt = lastAt;
    } catch (err) {
      log("Failed to load auto backup settings:", err, "error");
    }
  }
  async function saveAutoBackupSettings() {
    try {
      await saveGlobalSettings("autoBackupEnabled", autoBackupEnabled);
      await saveGlobalSettings("autoBackupIntervalMinutes", autoBackupIntervalMinutes);
      await saveGlobalSettings("lastAutoBackupAt", lastAutoBackupAt ?? 0);
    } catch (err) {
      log("Failed to save auto backup settings:", err, "error");
    }
  }
  function clearAutoBackupSchedule() {
    if (autoBackupIntervalId) {
      clearInterval(autoBackupIntervalId);
      autoBackupIntervalId = null;
    }
    if (autoBackupBackoffTimeoutId) {
      clearTimeout(autoBackupBackoffTimeoutId);
      autoBackupBackoffTimeoutId = null;
    }
  }
  function formatBackupTime(ts) {
    try {
      const d = new Date(ts);
      const now = /* @__PURE__ */ new Date();
      const sameDay = d.toDateString() === now.toDateString();
      const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      return sameDay ? time : `${d.toLocaleDateString()} ${time}`;
    } catch {
      return "";
    }
  }
  function updateBackupStatusDisplay() {
    if (!backupStatusDisplay) return;
    let text = "";
    if (!autoBackupEnabled) {
      text = "\u{1F501} Backup: Off";
    } else if (isAutoBackupRunning) {
      text = "\u{1F501} Backing up\u2026";
    } else if (autoBackupBackoffMs && autoBackupBackoffMs > 0) {
      const mins = Math.ceil(autoBackupBackoffMs / 6e4);
      text = `\u26A0\uFE0F Retry in ${mins}m`;
    } else if (lastAutoBackupAt) {
      text = `\u{1F5C4}\uFE0F Last backup: ${formatBackupTime(lastAutoBackupAt)}`;
    } else {
      text = "\u{1F5C4}\uFE0F Last backup: never";
    }
    backupStatusDisplay.textContent = text;
    backupStatusDisplay.style.display = text ? "inline" : "none";
  }
  async function runAutoBackupOnce(silent = true) {
    if (!googleAuthState.isSignedIn || !googleAuthState.accessToken) {
      if (!silent) {
        blinkAuthStatusDisplay();
      }
      return;
    }
    if (isAutoBackupRunning) return;
    isAutoBackupRunning = true;
    updateBackupStatusDisplay();
    try {
      await exportAllTimestampsToGoogleDrive({ silent });
      lastAutoBackupAt = Date.now();
      autoBackupRetryAttempts = 0;
      autoBackupBackoffMs = null;
      if (autoBackupBackoffTimeoutId) {
        clearTimeout(autoBackupBackoffTimeoutId);
        autoBackupBackoffTimeoutId = null;
      }
      await saveAutoBackupSettings();
    } catch (err) {
      log("Auto backup failed:", err, "error");
      if (autoBackupRetryAttempts < AUTO_BACKUP_MAX_RETRY_ATTEMPTS) {
        autoBackupRetryAttempts += 1;
        const base = AUTO_BACKUP_INITIAL_BACKOFF_MS;
        const next = Math.min(base * Math.pow(2, autoBackupRetryAttempts - 1), AUTO_BACKUP_MAX_BACKOFF_MS);
        autoBackupBackoffMs = next;
        if (autoBackupBackoffTimeoutId) clearTimeout(autoBackupBackoffTimeoutId);
        autoBackupBackoffTimeoutId = setTimeout(() => {
          runAutoBackupOnce(true);
        }, next);
      } else {
        autoBackupBackoffMs = null;
      }
    } finally {
      isAutoBackupRunning = false;
      updateBackupStatusDisplay();
    }
  }
  async function scheduleAutoBackup() {
    clearAutoBackupSchedule();
    if (!autoBackupEnabled) return;
    if (!googleAuthState.isSignedIn || !googleAuthState.accessToken) return;
    autoBackupIntervalId = setInterval(() => {
      runAutoBackupOnce(true);
    }, Math.max(1, autoBackupIntervalMinutes) * 60 * 1e3);
    const now = Date.now();
    const intervalMs = Math.max(1, autoBackupIntervalMinutes) * 60 * 1e3;
    if (!lastAutoBackupAt || now - lastAutoBackupAt >= intervalMs) {
      runAutoBackupOnce(true);
    }
    updateBackupStatusDisplay();
  }
  async function toggleAutoBackup() {
    autoBackupEnabled = !autoBackupEnabled;
    await saveAutoBackupSettings();
    await scheduleAutoBackup();
    updateBackupStatusDisplay();
  }
  async function setAutoBackupIntervalPrompt() {
    const input = prompt("Set Auto Backup interval (minutes):", String(autoBackupIntervalMinutes));
    if (input === null) return;
    const minutes = Math.floor(Number(input));
    if (!Number.isFinite(minutes) || minutes < 5 || minutes > 1440) {
      alert("Please enter a number between 5 and 1440 minutes.");
      return;
    }
    autoBackupIntervalMinutes = minutes;
    await saveAutoBackupSettings();
    await scheduleAutoBackup();
    updateBackupStatusDisplay();
  }

  // src/timekeeper.ts
  var hash = window.location.hash;
  if (hash && hash.length > 1) {
    const params = new URLSearchParams(hash.substring(1));
    const state = params.get("state");
    if (state === "timekeeper_auth") {
      const token = params.get("access_token");
      if (token) {
        console.log("[Timekeeper] Auth token detected in URL, broadcasting token");
        console.log("[Timekeeper] Token length:", token.length, "characters");
        try {
          const channel = new BroadcastChannel("timekeeper_oauth");
          const message = { type: "timekeeper_oauth_token", token };
          console.log("[Timekeeper] Sending auth message via BroadcastChannel:", { type: message.type, tokenLength: token.length });
          channel.postMessage(message);
          channel.close();
          console.log("[Timekeeper] Token broadcast via BroadcastChannel completed");
        } catch (e) {
          console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:", e);
          const message = {
            type: "timekeeper_oauth_token",
            token,
            timestamp: Date.now()
          };
          const openReq = indexedDB.open("ytls-timestamps-db", 3);
          openReq.onsuccess = () => {
            const db = openReq.result;
            const tx = db.transaction("settings", "readwrite");
            const store = tx.objectStore("settings");
            store.put({ key: "oauth_message", value: message });
            tx.oncomplete = () => {
              console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:", message.timestamp);
              db.close();
            };
          };
        }
        if (history.replaceState) {
          const cleanUrl = window.location.pathname + window.location.search;
          history.replaceState(null, "", cleanUrl);
        }
        console.log("[Timekeeper] Closing window after broadcasting auth token");
        window.close();
        throw new Error("OAuth window closed");
      }
    }
  }
  (async function() {
    "use strict";
    if (window.top !== window.self) {
      return;
    }
    function earlyLog(message, ...args) {
      let logLevel = "debug";
      const consoleArgs = [...args];
      if (args.length > 0 && typeof args[args.length - 1] === "string" && ["debug", "info", "warn", "error"].includes(args[args.length - 1])) {
        logLevel = consoleArgs.pop();
      }
      const version = GM_info.script.version;
      const prefix = `[Timekeeper v${version}]`;
      const methodMap = {
        "debug": console.log,
        "info": console.info,
        "warn": console.warn,
        "error": console.error
      };
      methodMap[logLevel](`${prefix} ${message}`, ...consoleArgs);
    }
    function earlyLoadGlobalSettings(key) {
      return GM.getValue(`timekeeper_${key}`, void 0);
    }
    function earlySaveGlobalSettings(key, value) {
      return GM.setValue(`timekeeper_${key}`, JSON.stringify(value));
    }
    setLog(earlyLog);
    setLoadGlobalSettings(earlyLoadGlobalSettings);
    setSaveGlobalSettings(earlySaveGlobalSettings);
    const isOAuthPopup = await handleOAuthPopup();
    if (isOAuthPopup) {
      earlyLog("OAuth popup detected, broadcasting token and closing");
      return;
    }
    await loadGoogleAuthState();
    const SUPPORTED_PATH_PREFIXES = ["/watch", "/live"];
    function isSupportedUrl(url = window.location.href) {
      try {
        const parsed = new URL(url);
        if (parsed.origin !== "https://www.youtube.com") {
          return false;
        }
        return SUPPORTED_PATH_PREFIXES.some((prefix) => {
          return parsed.pathname === prefix || parsed.pathname.startsWith(`${prefix}/`);
        });
      } catch (err) {
        earlyLog("Timekeeper failed to parse URL for support check:", err, "error");
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
    let isLoadingTimestamps = false;
    const TIMESTAMP_DELETE_CLASS = "ytls-timestamp-pending-delete";
    const TIMESTAMP_HIGHLIGHT_CLASS = "ytls-timestamp-highlight";
    const HEADER_ICON_DEFAULT_URL = "https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png";
    const HEADER_ICON_HOVER_URL = "https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_Eyebrow_64px_Indexed.png";
    function preloadHeaderIcons() {
      const preloadImage = (url) => {
        const img = new Image();
        img.src = url;
      };
      preloadImage(HEADER_ICON_DEFAULT_URL);
      preloadImage(HEADER_ICON_HOVER_URL);
    }
    preloadHeaderIcons();
    async function waitForYouTubeReady() {
      while (!document.querySelector("video") || !document.querySelector("#movie_player")) {
        await new Promise((r) => setTimeout(r, 100));
      }
      while (!document.querySelector(".ytp-progress-bar")) {
        await new Promise((r) => setTimeout(r, 100));
      }
      await new Promise((r) => setTimeout(r, 200));
    }
    const REQUIRED_PLAYER_METHODS = [
      "getCurrentTime",
      "seekTo",
      "getPlayerState",
      "seekToLiveHead",
      "getVideoData",
      "getDuration"
    ];
    const PLAYER_METHOD_CHECK_TIMEOUT_MS = 5e3;
    const PLAYER_METHODS_WITH_FALLBACK = /* @__PURE__ */ new Set([
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
      return REQUIRED_PLAYER_METHODS.every((method) => {
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
      return REQUIRED_PLAYER_METHODS.filter((method) => {
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
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      const fallbackPlayer = getActivePlayer();
      if (hasRequiredPlayerMethods(fallbackPlayer)) {
        return fallbackPlayer;
      }
      return fallbackPlayer;
    }
    const OFFSET_KEY = "timestampOffsetSeconds";
    const DEFAULT_OFFSET = -5;
    const SHIFT_SKIP_KEY = "shiftClickTimeSkipSeconds";
    const DEFAULT_SHIFT_SKIP = 10;
    function log2(message, ...args) {
      return earlyLog(message, ...args);
    }
    let channel = new BroadcastChannel("ytls_timestamp_channel");
    function safePostMessage(message) {
      try {
        channel.postMessage(message);
      } catch (err) {
        log2("BroadcastChannel error, reopening:", err, "warn");
        try {
          channel = new BroadcastChannel("ytls_timestamp_channel");
          channel.onmessage = handleChannelMessage;
          channel.postMessage(message);
        } catch (reopenErr) {
          log2("Failed to reopen BroadcastChannel:", reopenErr, "error");
        }
      }
    }
    function handleChannelMessage(event) {
      log2("Received message from another tab:", event.data);
      if (!isSupportedUrl() || !list || !pane) {
        return;
      }
      if (event.data) {
        if (event.data.type === "timestamps_updated" && event.data.videoId === currentLoadedVideoId) {
          log2("Debouncing timestamp load due to external update for video:", event.data.videoId);
          clearTimeout(loadTimeoutId);
          loadTimeoutId = setTimeout(() => {
            log2("Reloading timestamps due to external update for video:", event.data.videoId);
            loadTimestamps();
          }, 500);
        } else if (event.data.type === "window_position_updated" && pane) {
          const pos = event.data.position;
          if (pos && typeof pos.x === "number" && typeof pos.y === "number") {
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
    let configuredOffset = await GM.getValue(OFFSET_KEY);
    if (typeof configuredOffset !== "number" || Number.isNaN(configuredOffset)) {
      configuredOffset = DEFAULT_OFFSET;
      await GM.setValue(OFFSET_KEY, configuredOffset);
    }
    let configuredShiftSkip = await GM.getValue(SHIFT_SKIP_KEY);
    if (typeof configuredShiftSkip !== "number" || Number.isNaN(configuredShiftSkip)) {
      configuredShiftSkip = DEFAULT_SHIFT_SKIP;
      await GM.setValue(SHIFT_SKIP_KEY, configuredShiftSkip);
    }
    let loadTimeoutId = null;
    let commentSaveTimeouts = /* @__PURE__ */ new Map();
    let isMouseOverTimestamps = false;
    let settingsModalInstance = null;
    let settingsCogButtonElement = null;
    let currentLoadedVideoId = null;
    let currentLoadedVideoTitle = null;
    let titleObserver = null;
    let visibilityAnimationTimeoutId = null;
    let headerButtonImage = null;
    let isHeaderButtonHovered = false;
    let lastSavedPanePosition = null;
    let documentMousemoveHandler = null;
    let documentMouseupHandler = null;
    let windowResizeHandler = null;
    let videoTimeupdateHandler = null;
    let videoPauseHandler = null;
    let videoPlayHandler = null;
    let videoSeekingHandler = null;
    let keydownHandler = null;
    let docPointerDownHandler = null;
    let docPointerUpHandler = null;
    let lastPointerDownTs = 0;
    let suppressSortUntilRefocus = false;
    let mostRecentlyModifiedTimestampGuid = null;
    let latestTimestampValue = null;
    function getTimestampItems() {
      return list ? Array.from(list.querySelectorAll("li")) : [];
    }
    function extractTimestampRecords() {
      return getTimestampItems().map((li) => {
        const startLink = li.querySelector("a[data-time]");
        const timeValue = startLink?.dataset.time;
        if (!startLink || !timeValue) return null;
        const startTime = Number.parseInt(timeValue, 10);
        if (!Number.isFinite(startTime)) return null;
        const commentInput = li.querySelector("input");
        const comment = commentInput?.value ?? "";
        const guid = li.dataset.guid ?? crypto.randomUUID();
        if (!li.dataset.guid) li.dataset.guid = guid;
        return { start: startTime, comment, guid };
      }).filter(isTimestampRecord);
    }
    function getLatestTimestampValue() {
      if (latestTimestampValue !== null) {
        return latestTimestampValue;
      }
      const items = getTimestampItems();
      latestTimestampValue = items.length > 0 ? Math.max(...items.map((li) => {
        const t = li.querySelector("a[data-time]")?.getAttribute("data-time");
        return t ? Number.parseInt(t, 10) : 0;
      })) : 0;
      return latestTimestampValue;
    }
    function invalidateLatestTimestampValue() {
      latestTimestampValue = null;
    }
    function hasNegativeTimeDifference(li) {
      const timeDiffSpan = li.querySelector(".time-diff");
      if (!timeDiffSpan) return false;
      const text = timeDiffSpan.textContent?.trim() || "";
      return text.startsWith("-");
    }
    function getIndentMarker(isIndented, isLast) {
      if (!isIndented) return "";
      return isLast ? "\u2514\u2500 " : "\u251C\u2500 ";
    }
    function extractIndentLevel(commentText) {
      return commentText.startsWith("\u251C\u2500 ") || commentText.startsWith("\u2514\u2500 ") ? 1 : 0;
    }
    function removeIndentMarker(commentText) {
      return commentText.replace(/^[├└]─\s/, "");
    }
    function determineIndentMarkerForIndex(itemIndex) {
      const items = getTimestampItems();
      if (itemIndex >= items.length - 1) {
        return "\u2514\u2500 ";
      }
      const nextCommentInput = items[itemIndex + 1].querySelector("input");
      if (!nextCommentInput) {
        return "\u2514\u2500 ";
      }
      const nextIsIndented = extractIndentLevel(nextCommentInput.value) === 1;
      return nextIsIndented ? "\u251C\u2500 " : "\u2514\u2500 ";
    }
    function updateIndentMarkers() {
      if (!list) return;
      const items = getTimestampItems();
      let changed = true;
      let iterations = 0;
      const maxIterations = items.length;
      while (changed && iterations < maxIterations) {
        changed = false;
        iterations++;
        items.forEach((item, index) => {
          const commentInput = item.querySelector("input");
          if (!commentInput) return;
          const isIndented = extractIndentLevel(commentInput.value) === 1;
          if (!isIndented) return;
          let isLastInSeries = false;
          if (index < items.length - 1) {
            const nextCommentInput = items[index + 1].querySelector("input");
            if (nextCommentInput) {
              const nextIsIndented = extractIndentLevel(nextCommentInput.value) === 1;
              isLastInSeries = !nextIsIndented;
            }
          } else {
            isLastInSeries = true;
          }
          const cleanComment = removeIndentMarker(commentInput.value);
          const marker = getIndentMarker(true, isLastInSeries);
          const newValue = `${marker}${cleanComment}`;
          if (commentInput.value !== newValue) {
            commentInput.value = newValue;
            changed = true;
          }
        });
      }
    }
    function getTimestampSuffix2() {
      const now = /* @__PURE__ */ new Date();
      return now.getUTCFullYear() + "-" + String(now.getUTCMonth() + 1).padStart(2, "0") + "-" + String(now.getUTCDate()).padStart(2, "0") + "--" + String(now.getUTCHours()).padStart(2, "0") + "-" + String(now.getUTCMinutes()).padStart(2, "0") + "-" + String(now.getUTCSeconds()).padStart(2, "0");
    }
    function clearTimestampsDisplay() {
      if (!list) return;
      while (list.firstChild) {
        list.removeChild(list.firstChild);
      }
    }
    function setLoadingState(loading) {
      if (!pane || !list) return;
      isLoadingTimestamps = loading;
      if (loading) {
        pane.classList.add("ytls-fade-out");
        pane.classList.remove("ytls-fade-in");
        setTimeout(() => {
          pane.style.display = "none";
        }, 300);
      } else {
        pane.style.display = "";
        pane.classList.remove("ytls-fade-out");
        pane.classList.add("ytls-fade-in");
        if (timeDisplay) {
          const playerInstance = getActivePlayer();
          if (playerInstance) {
            const rawTime = playerInstance.getCurrentTime();
            const currentSeconds = Number.isFinite(rawTime) ? Math.max(0, Math.floor(rawTime)) : Math.max(0, getLatestTimestampValue());
            const h = Math.floor(currentSeconds / 3600);
            const m = Math.floor(currentSeconds / 60) % 60;
            const s = currentSeconds % 60;
            const { isLive } = playerInstance.getVideoData() || { isLive: false };
            const timestamps = list ? Array.from(list.children).map((li) => {
              const timeLink = li.querySelector("a[data-time]");
              return timeLink ? parseFloat(timeLink.getAttribute("data-time")) : 0;
            }) : [];
            let timestampDisplay = "";
            if (timestamps.length > 0) {
              if (isLive) {
                const currentTimeMinutes = Math.max(1, currentSeconds / 60);
                const liveTimestamps = timestamps.filter((time) => time <= currentSeconds);
                if (liveTimestamps.length > 0) {
                  const timestampsPerMin = (liveTimestamps.length / currentTimeMinutes).toFixed(2);
                  if (parseFloat(timestampsPerMin) > 0) {
                    timestampDisplay = ` (${timestampsPerMin}/min)`;
                  }
                }
              } else {
                const durationSeconds = playerInstance.getDuration();
                const validDuration = Number.isFinite(durationSeconds) && durationSeconds > 0 ? durationSeconds : 0;
                const totalMinutes = Math.max(1, validDuration / 60);
                const timestampsPerMin = (timestamps.length / totalMinutes).toFixed(1);
                if (parseFloat(timestampsPerMin) > 0) {
                  timestampDisplay = ` (${timestampsPerMin}/min)`;
                }
              }
            }
            timeDisplay.textContent = `\u23F3${h ? h + ":" + String(m).padStart(2, "0") : m}:${String(s).padStart(2, "0")}${timestampDisplay}`;
          }
        }
      }
      syncToggleButtons();
    }
    function formatTimeString(seconds, videoDuration = seconds) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor(seconds % 3600 / 60);
      const s = String(seconds % 60).padStart(2, "0");
      if (videoDuration < 3600) {
        return `${m < 10 ? m : String(m).padStart(2, "0")}:${s}`;
      }
      return `${videoDuration >= 36e3 ? String(h).padStart(2, "0") : h}:${String(m).padStart(2, "0")}:${s}`;
    }
    function isTimestampRecord(value) {
      return !!value && Number.isFinite(value.start) && typeof value.comment === "string" && typeof value.guid === "string";
    }
    function buildYouTubeUrlWithTimestamp(timeInSeconds, currentUrl = window.location.href) {
      try {
        const url = new URL(currentUrl);
        url.searchParams.set("t", `${timeInSeconds}s`);
        return url.toString();
      } catch {
        const vid = currentUrl.search(/[?&]v=/) >= 0 ? currentUrl.split(/[?&]v=/)[1].split(/&/)[0] : currentUrl.split(/\/live\/|\/shorts\/|\?|&/)[1];
        return `https://www.youtube.com/watch?v=${vid}&t=${timeInSeconds}s`;
      }
    }
    function formatTime(anchor, timeInSeconds) {
      anchor.textContent = formatTimeString(timeInSeconds);
      anchor.dataset.time = String(timeInSeconds);
      anchor.href = buildYouTubeUrlWithTimestamp(timeInSeconds, window.location.href);
    }
    let seekTimeoutId = null;
    let pendingSeekTime = null;
    let lastAutoHighlightedGuid = null;
    let isSeeking = false;
    function isBehindLiveEdge(playerInstance) {
      if (!playerInstance || typeof playerInstance.getVideoData !== "function") {
        return false;
      }
      const videoData = playerInstance.getVideoData();
      if (!videoData?.isLive) {
        return false;
      }
      if (typeof playerInstance.getProgressState === "function") {
        const state = playerInstance.getProgressState();
        const liveHead = Number(state?.seekableEnd ?? state?.liveHead ?? state?.head ?? state?.duration);
        const current = Number(state?.current ?? playerInstance.getCurrentTime?.());
        if (Number.isFinite(liveHead) && Number.isFinite(current)) {
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
        const timeLink = li.querySelector("a[data-time]");
        const timeValue = timeLink?.dataset.time;
        if (!timeValue) {
          continue;
        }
        const timestamp = Number.parseInt(timeValue, 10);
        if (!Number.isFinite(timestamp)) {
          continue;
        }
        if (timestamp <= currentTime && timestamp > largestTimestamp) {
          largestTimestamp = timestamp;
          nearestLi = li;
        }
      }
      return nearestLi;
    }
    function highlightTimestamp(li, shouldScroll = false) {
      if (!li) return;
      const items = getTimestampItems();
      items.forEach((item) => {
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
      if (!list || list.querySelector(".ytls-error-message")) {
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
      items.forEach((li) => {
        const anchor = li.querySelector("a[data-time]");
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
      log2(`Timestamps changed: Offset all timestamps by ${delta > 0 ? "+" : ""}${delta} seconds (${label})`);
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
          if (player) player.seekTo(newTime);
          setTimeout(() => {
            isSeeking = false;
          }, 500);
        }
        const clickedLi = target.closest("li");
        if (clickedLi) {
          getTimestampItems().forEach((item) => {
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
        const timeLink = linkContainer?.querySelector("a[data-time]");
        if (!timeLink || !timeLink.dataset.time) {
          return;
        }
        const currTime = parseInt(timeLink.dataset.time, 10);
        let increment = parseInt(target.dataset.increment, 10);
        const shiftPressed = "shiftKey" in event ? event.shiftKey : false;
        if (shiftPressed) {
          increment *= configuredShiftSkip;
        }
        const altPressed = "altKey" in event ? event.altKey : false;
        if (altPressed) {
          applyOffsetToAllTimestamps(increment, { logLabel: "Alt adjust" });
          return;
        }
        const newTime = Math.max(0, currTime + increment);
        log2(`Timestamps changed: Timestamp time incremented from ${currTime} to ${newTime}`);
        formatTime(timeLink, newTime);
        invalidateLatestTimestampValue();
        const timestampLi = target.closest("li");
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
          setTimeout(() => {
            isSeeking = false;
          }, 500);
        }, 500);
        updateTimeDifferences();
        updateIndentMarkers();
        updateSeekbarMarkers();
        if (timestampLi) {
          const tsCommentInput = timestampLi.querySelector("input");
          const tsGuid = timestampLi.dataset.guid;
          if (tsCommentInput && tsGuid) {
            saveSingleTimestampDirect(currentLoadedVideoId, tsGuid, newTime, tsCommentInput.value);
            mostRecentlyModifiedTimestampGuid = tsGuid;
          }
        }
      } else if (target.dataset.action === "clear") {
        event.preventDefault();
        log2("Timestamps changed: All timestamps cleared from UI");
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
      const indentGutter = document.createElement("div");
      indentGutter.style.cssText = "position:absolute;left:0;top:0;width:20px;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;";
      indentGutter.title = "Click to toggle indent";
      const indentToggle = document.createElement("span");
      indentToggle.style.cssText = "color:#999;font-size:12px;pointer-events:none;display:none;";
      const updateArrowIcon = () => {
        const currentIndent = extractIndentLevel(commentInput.value);
        indentToggle.textContent = currentIndent === 1 ? "\u25C0" : "\u25B6";
      };
      const handleIndentToggle = (e) => {
        e.stopPropagation();
        const currentIndent = extractIndentLevel(commentInput.value);
        const cleanComment = removeIndentMarker(commentInput.value);
        const newIndent = currentIndent === 0 ? 1 : 0;
        let marker = "";
        if (newIndent === 1) {
          const items = getTimestampItems();
          const currentIndex = items.indexOf(li);
          marker = determineIndentMarkerForIndex(currentIndex);
        }
        commentInput.value = `${marker}${cleanComment}`;
        updateArrowIcon();
        updateIndentMarkers();
        const currentTime = Number.parseInt(anchor.dataset.time ?? "0", 10);
        saveSingleTimestampDirect(currentLoadedVideoId, timestampGuid, currentTime, commentInput.value);
      };
      indentGutter.onclick = handleIndentToggle;
      indentGutter.append(indentToggle);
      li.style.cssText = "position:relative;padding-left:20px;";
      li.addEventListener("mouseenter", () => {
        updateArrowIcon();
        indentToggle.style.display = "inline";
      });
      li.addEventListener("mouseleave", () => {
        indentToggle.style.display = "none";
      });
      li.addEventListener("mouseleave", () => {
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
      commentInput.addEventListener("focusin", () => {
        suppressSortUntilRefocus = false;
      });
      commentInput.addEventListener("focusout", (ev) => {
        const rt = ev.relatedTarget;
        const recentPointer = Date.now() - lastPointerDownTs < 250;
        const movingWithinPane = !!rt && !!pane && pane.contains(rt);
        if (!recentPointer && !movingWithinPane) {
          suppressSortUntilRefocus = true;
          setTimeout(() => {
            if (document.activeElement === document.body || document.activeElement == null) {
              commentInput.focus({ preventScroll: true });
              suppressSortUntilRefocus = false;
            }
          }, 0);
        }
      });
      commentInput.addEventListener("input", (ev) => {
        const ie = ev;
        if (ie && (ie.isComposing || ie.inputType === "insertCompositionText")) {
          return;
        }
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
      commentInput.addEventListener("compositionend", () => {
        const currentTime = Number.parseInt(anchor.dataset.time ?? "0", 10);
        setTimeout(() => {
          saveSingleTimestampDirect(currentLoadedVideoId, timestampGuid, currentTime, commentInput.value);
        }, 50);
      });
      minus.textContent = "\u2796";
      minus.dataset.increment = "-1";
      minus.style.cursor = "pointer";
      minus.style.margin = "0px";
      minus.addEventListener("mouseenter", () => {
        minus.style.textShadow = "0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)";
      });
      minus.addEventListener("mouseleave", () => {
        minus.style.textShadow = "none";
      });
      plus.textContent = "\u2795";
      plus.dataset.increment = "1";
      plus.style.cursor = "pointer";
      plus.style.margin = "0px";
      plus.addEventListener("mouseenter", () => {
        plus.style.textShadow = "0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)";
      });
      plus.addEventListener("mouseleave", () => {
        plus.style.textShadow = "none";
      });
      record.textContent = "\u23FA\uFE0F";
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
          log2(`Timestamps changedset to current playback time ${currentTime}`);
          formatTime(anchor, currentTime);
          updateTimeDifferences();
          updateIndentMarkers();
          saveSingleTimestampDirect(currentLoadedVideoId, timestampGuid, currentTime, commentInput.value);
          mostRecentlyModifiedTimestampGuid = timestampGuid;
        }
      };
      formatTime(anchor, sanitizedStart);
      invalidateLatestTimestampValue();
      del.textContent = "\u{1F5D1}\uFE0F";
      del.style.cssText = "background:transparent;border:none;color:white;cursor:pointer;margin-left:5px;";
      del.addEventListener("mouseenter", () => {
        del.style.textShadow = "0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 100, 100, 0.6)";
      });
      del.addEventListener("mouseleave", () => {
        del.style.textShadow = "none";
      });
      del.onclick = () => {
        if (li.dataset.deleteConfirmed === "true") {
          log2("Timestamps changed: Timestamp deleted");
          const guid2 = li.dataset.guid ?? "";
          li.remove();
          invalidateLatestTimestampValue();
          updateTimeDifferences();
          updateIndentMarkers();
          updateSeekbarMarkers();
          updateScroll();
          deleteSingleTimestamp(currentLoadedVideoId, guid2);
          mostRecentlyModifiedTimestampGuid = null;
        } else {
          li.dataset.deleteConfirmed = "true";
          li.classList.add(TIMESTAMP_DELETE_CLASS);
          li.classList.remove(TIMESTAMP_HIGHLIGHT_CLASS);
          const doCancelDelete = () => {
            li.dataset.deleteConfirmed = "false";
            li.classList.remove(TIMESTAMP_DELETE_CLASS);
            const player = getActivePlayer();
            const currentTime = player ? player.getCurrentTime() : 0;
            const itemTime = Number.parseInt(li.querySelector("a[data-time]")?.dataset.time ?? "0", 10);
            if (Number.isFinite(currentTime) && Number.isFinite(itemTime) && currentTime >= itemTime) {
              li.classList.add(TIMESTAMP_HIGHLIGHT_CLASS);
            }
          };
          const cancelDeleteOnClick = (event) => {
            const target = event.target;
            if (target !== del) {
              doCancelDelete();
              li.removeEventListener("click", cancelDeleteOnClick, true);
              document.removeEventListener("click", cancelDeleteOnClick, true);
            }
          };
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
          li.addEventListener("click", cancelDeleteOnClick, true);
          document.addEventListener("click", cancelDeleteOnClick, true);
          if (list) {
            list.addEventListener("mouseleave", cancelDeleteOnMouseLeave);
          }
          setTimeout(() => {
            if (li.dataset.deleteConfirmed === "true") {
              doCancelDelete();
            }
            li.removeEventListener("click", cancelDeleteOnClick, true);
            document.removeEventListener("click", cancelDeleteOnClick, true);
            if (list) {
              list.removeEventListener("mouseleave", cancelDeleteOnMouseLeave);
            }
          }, 5e3);
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
        const existingLink = existingLi.querySelector("a[data-time]");
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
            const prevLink = prevLi.querySelector("a[data-time]");
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
          const nextTimeDiff = existingLi.querySelector(".time-diff");
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
          const lastLink = lastLi.querySelector("a[data-time]");
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
        highlightTimestamp(li, false);
      }
      return commentInput;
    }
    function updateTimeDifferences() {
      if (!list || list.querySelector(".ytls-error-message")) {
        return;
      }
      const items = getTimestampItems();
      items.forEach((item, index) => {
        const timeDiffSpan = item.querySelector(".time-diff");
        if (!timeDiffSpan) {
          return;
        }
        const timeLink = item.querySelector("a[data-time]");
        const currentTimeStr = timeLink?.dataset.time;
        if (!currentTimeStr) {
          timeDiffSpan.textContent = "";
          return;
        }
        const currentTime = Number.parseInt(currentTimeStr, 10);
        if (!Number.isFinite(currentTime)) {
          timeDiffSpan.textContent = "";
          return;
        }
        if (index === 0) {
          timeDiffSpan.textContent = "";
          return;
        }
        const prevItem = items[index - 1];
        const prevLink = prevItem.querySelector("a[data-time]");
        const prevTimeStr = prevLink?.dataset.time;
        if (!prevTimeStr) {
          timeDiffSpan.textContent = "";
          return;
        }
        const prevTime = Number.parseInt(prevTimeStr, 10);
        if (!Number.isFinite(prevTime)) {
          timeDiffSpan.textContent = "";
          return;
        }
        const diff = currentTime - prevTime;
        const sign = diff < 0 ? "-" : "";
        timeDiffSpan.textContent = ` ${sign}${formatTimeString(Math.abs(diff))}`;
      });
    }
    function sortTimestampsAndUpdateDisplay() {
      if (!list || list.querySelector(".ytls-error-message") || isLoadingTimestamps) {
        return;
      }
      let restoreState = null;
      if (document.activeElement instanceof HTMLInputElement && list.contains(document.activeElement)) {
        const activeInput = document.activeElement;
        const activeLi = activeInput.closest("li");
        const guid = activeLi?.dataset.guid;
        if (guid) {
          const start = activeInput.selectionStart ?? activeInput.value.length;
          const end = activeInput.selectionEnd ?? start;
          const scroll = activeInput.scrollLeft;
          restoreState = { guid, start, end, scroll };
        }
      }
      const items = getTimestampItems();
      const originalOrder = items.map((li) => li.dataset.guid);
      const sortedItems = items.map((li) => {
        const timeLink = li.querySelector("a[data-time]");
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
      }).filter((item) => item !== null).sort((a, b) => {
        const timeDiff = a.time - b.time;
        if (timeDiff !== 0) {
          return timeDiff;
        }
        return a.guid.localeCompare(b.guid);
      });
      const newOrder = sortedItems.map((item) => item.guid);
      const orderChanged = originalOrder.length !== newOrder.length || originalOrder.some((guid, idx) => guid !== newOrder[idx]);
      while (list.firstChild) {
        list.removeChild(list.firstChild);
      }
      sortedItems.forEach((item) => {
        list.appendChild(item.element);
      });
      updateTimeDifferences();
      updateIndentMarkers();
      updateSeekbarMarkers();
      if (restoreState) {
        const targetLi = getTimestampItems().find((li) => li.dataset.guid === restoreState.guid);
        const targetInput = targetLi?.querySelector("input");
        if (targetInput) {
          try {
            targetInput.focus({ preventScroll: true });
          } catch {
          }
        }
      }
      if (orderChanged) {
        log2("Timestamps changed: Timestamps sorted");
        saveTimestamps(currentLoadedVideoId);
      }
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
      const progressBar = document.querySelector(".ytp-progress-bar");
      const player = getActivePlayer();
      const videoData = player ? player.getVideoData() : null;
      const isLiveStream = !!videoData && !!videoData.isLive;
      if (!video || !progressBar || !isFinite(video.duration) || isLiveStream) return;
      removeSeekbarMarkers();
      const timestamps = getTimestampItems().map((li) => {
        const startLink = li.querySelector("a[data-time]");
        const timeValue = startLink?.dataset.time;
        if (!startLink || !timeValue) {
          return null;
        }
        const startTime = Number.parseInt(timeValue, 10);
        if (!Number.isFinite(startTime)) {
          return null;
        }
        const commentInput = li.querySelector("input");
        const comment = commentInput?.value ?? "";
        const guid = li.dataset.guid ?? crypto.randomUUID();
        if (!li.dataset.guid) {
          li.dataset.guid = guid;
        }
        return { start: startTime, comment, guid };
      }).filter(isTimestampRecord);
      timestamps.forEach((ts) => {
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
        marker.style.left = ts.start / video.duration * 100 + "%";
        marker.dataset.time = String(ts.start);
        marker.addEventListener("click", () => {
          const player2 = getActivePlayer();
          if (player2) player2.seekTo(ts.start);
        });
        progressBar.appendChild(marker);
      });
    }
    function saveTimestamps(videoId) {
      if (!list || list.querySelector(".ytls-error-message")) return;
      if (!videoId) return;
      if (isLoadingTimestamps) {
        log2("Save blocked: timestamps are currently loading");
        return;
      }
      updateIndentMarkers();
      const currentTimestampsFromUI = extractTimestampRecords().sort((a, b) => a.start - b.start);
      saveToIndexedDB(videoId, currentTimestampsFromUI).then(() => log2(`Successfully saved ${currentTimestampsFromUI.length} timestamps for ${videoId} to IndexedDB`)).catch((err) => log2(`Failed to save timestamps for ${videoId} to IndexedDB:`, err, "error"));
      safePostMessage({ type: "timestamps_updated", videoId, action: "saved" });
    }
    function extractSingleTimestampFromLi(li) {
      const anchor = li.querySelector("a[data-time]");
      const commentInput = li.querySelector("input");
      const guid = li.dataset.guid;
      if (!anchor || !commentInput || !guid) {
        return null;
      }
      const time = Number.parseInt(anchor.dataset.time ?? "0", 10);
      return {
        start: time,
        comment: commentInput.value,
        guid
      };
    }
    function saveSingleTimestamp(videoId, li) {
      if (!videoId || isLoadingTimestamps) return;
      const timestamp = extractSingleTimestampFromLi(li);
      if (!timestamp) return;
      saveSingleTimestampToIndexedDB(videoId, timestamp).catch((err) => log2(`Failed to save timestamp ${timestamp.guid}:`, err, "error"));
      safePostMessage({ type: "timestamps_updated", videoId, action: "saved" });
    }
    function saveSingleTimestampDirect(videoId, guid, start, comment) {
      if (!videoId || isLoadingTimestamps) return;
      const timestamp = { guid, start, comment };
      log2(`Saving timestamp: guid=${guid}, start=${start}, comment="${comment}"`);
      saveSingleTimestampToIndexedDB(videoId, timestamp).catch((err) => log2(`Failed to save timestamp ${guid}:`, err, "error"));
      safePostMessage({ type: "timestamps_updated", videoId, action: "saved" });
    }
    function deleteSingleTimestamp(videoId, guid) {
      if (!videoId || isLoadingTimestamps) return;
      log2(`Deleting timestamp: guid=${guid}`);
      deleteSingleTimestampFromIndexedDB(videoId, guid).catch((err) => log2(`Failed to delete timestamp ${guid}:`, err, "error"));
      safePostMessage({ type: "timestamps_updated", videoId, action: "saved" });
    }
    async function saveTimestampsAs(format) {
      if (!list || list.querySelector(".ytls-error-message")) {
        alert("Cannot export timestamps while displaying an error message.");
        return;
      }
      const videoId = currentLoadedVideoId;
      if (!videoId) return;
      log2(`Exporting timestamps for video ID: ${videoId}`);
      const timestamps = extractTimestampRecords();
      const videoDuration = Math.max(getLatestTimestampValue(), 0);
      const timestampSuffix = getTimestampSuffix2();
      if (format === "json") {
        const blob = new Blob([JSON.stringify(timestamps, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `timestamps-${videoId}-${timestampSuffix}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === "text") {
        const plainText = timestamps.map((ts) => {
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
        log2("Timekeeper error:", message, "error");
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
      document.querySelectorAll(".ytls-marker").forEach((marker) => marker.remove());
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
      commentSaveTimeouts.forEach((timeout) => clearTimeout(timeout));
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
      removeAllEventListeners();
      try {
        channel.close();
      } catch (err) {
      }
      if (settingsModalInstance && settingsModalInstance.parentNode === document.body) {
        document.body.removeChild(settingsModalInstance);
      }
      settingsModalInstance = null;
      settingsCogButtonElement = null;
      isMouseOverTimestamps = false;
      currentLoadedVideoId = null;
      currentLoadedVideoTitle = null;
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
        const baseMessage = playerInstance ? "Timekeeper cannot access the YouTube player API." : "Timekeeper cannot find the YouTube player on this page.";
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
        if (timeDisplay && currentLoadedVideoTitle) {
          timeDisplay.title = currentLoadedVideoTitle;
        }
        let finalTimestampsToDisplay = [];
        try {
          const dbTimestamps = await loadFromIndexedDB(videoId);
          if (dbTimestamps) {
            finalTimestampsToDisplay = dbTimestamps.map((ts) => ({
              ...ts,
              guid: ts.guid || crypto.randomUUID()
            }));
            log2(`Loaded ${finalTimestampsToDisplay.length} timestamps from IndexedDB for ${videoId}`);
          } else {
            log2(`No timestamps found in IndexedDB for ${videoId}`);
          }
        } catch (dbError) {
          log2(`Failed to load timestamps from IndexedDB for ${videoId}:`, dbError, "error");
          clearTimestampsDisplay();
          updateSeekbarMarkers();
          return;
        }
        if (finalTimestampsToDisplay.length > 0) {
          finalTimestampsToDisplay.sort((a, b) => a.start - b.start);
          clearTimestampsDisplay();
          finalTimestampsToDisplay.forEach((ts) => {
            addTimestamp(ts.start, ts.comment, true, ts.guid);
          });
          updateIndentMarkers();
          updateSeekbarMarkers();
          const playerForHighlight = getActivePlayer();
          const currentTimeForHighlight = playerForHighlight ? Math.floor(playerForHighlight.getCurrentTime()) : getLatestTimestampValue();
          if (Number.isFinite(currentTimeForHighlight)) {
            highlightNearestTimestampAtTime(currentTimeForHighlight, true);
            shouldRestoreScroll = false;
          }
        } else {
          clearTimestampsDisplay();
          updateSeekbarMarkers();
        }
      } catch (err) {
        log2("Unexpected error while loading timestamps:", err, "error");
        displayPaneError("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.");
      } finally {
        requestAnimationFrame(restoreScrollPosition);
      }
    }
    function getVideoId() {
      const urlParams = new URLSearchParams(location.search);
      const videoId = urlParams.get("v");
      if (videoId) {
        return videoId;
      }
      const clipIdMeta = document.querySelector('meta[itemprop="identifier"]');
      if (clipIdMeta?.content) {
        return clipIdMeta.content;
      }
      return null;
    }
    function getVideoTitle() {
      const titleMeta = document.querySelector('meta[name="title"]');
      if (titleMeta?.content) {
        return titleMeta.content;
      }
      return document.title.replace(" - YouTube", "");
    }
    function setupVideoEventListeners() {
      const video = getVideoElement();
      if (!video) return;
      const handleTimeUpdate = () => {
        if (!list) return;
        const player = getActivePlayer();
        const currentTime = player ? Math.floor(player.getCurrentTime()) : 0;
        if (!Number.isFinite(currentTime)) return;
        const nearestLi = findNearestTimestamp(currentTime);
        highlightTimestamp(nearestLi, false);
      };
      const updateUrlTimeParam = (seconds) => {
        try {
          const url = new URL(window.location.href);
          if (seconds !== null && Number.isFinite(seconds)) {
            url.searchParams.set("t", `${Math.floor(seconds)}s`);
          } else {
            url.searchParams.delete("t");
          }
          window.history.replaceState({}, "", url.toString());
        } catch (err) {
        }
      };
      const handlePause = () => {
        const player = getActivePlayer();
        const currentTime = player ? Math.floor(player.getCurrentTime()) : 0;
        if (Number.isFinite(currentTime)) {
          updateUrlTimeParam(currentTime);
        }
      };
      const handlePlay = () => {
        updateUrlTimeParam(null);
      };
      const handleSeeking = () => {
        const video2 = getVideoElement();
        if (!video2) return;
        const player = getActivePlayer();
        const currentTime = player ? Math.floor(player.getCurrentTime()) : 0;
        if (!Number.isFinite(currentTime)) return;
        if (video2.paused) {
          updateUrlTimeParam(currentTime);
        }
        const nearestLi = findNearestTimestamp(currentTime);
        highlightTimestamp(nearestLi, true);
      };
      videoTimeupdateHandler = handleTimeUpdate;
      videoPauseHandler = handlePause;
      videoPlayHandler = handlePlay;
      videoSeekingHandler = handleSeeking;
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("pause", handlePause);
      video.addEventListener("play", handlePlay);
      video.addEventListener("seeking", handleSeeking);
    }
    const DB_NAME = "ytls-timestamps-db";
    const DB_VERSION = 3;
    const STORE_NAME = "timestamps";
    const STORE_NAME_V2 = "timestamps_v2";
    const SETTINGS_STORE_NAME = "settings";
    let dbConnection = null;
    let dbConnectionPromise = null;
    function getDB() {
      if (dbConnection) {
        try {
          const isValid = dbConnection.objectStoreNames.length >= 0;
          if (isValid) {
            return Promise.resolve(dbConnection);
          }
        } catch (err) {
          log2("IndexedDB connection is no longer usable:", err, "warn");
          dbConnection = null;
        }
      }
      if (dbConnectionPromise) {
        return dbConnectionPromise;
      }
      dbConnectionPromise = openIndexedDB().then((db) => {
        dbConnection = db;
        dbConnectionPromise = null;
        db.onclose = () => {
          log2("IndexedDB connection closed unexpectedly", "warn");
          dbConnection = null;
        };
        db.onerror = (event) => {
          log2("IndexedDB connection error:", event, "error");
        };
        return db;
      }).catch((err) => {
        dbConnectionPromise = null;
        throw err;
      });
      return dbConnectionPromise;
    }
    async function buildExportPayload2() {
      const exportData = {};
      const allTimestamps = await getAllFromIndexedDB(STORE_NAME_V2);
      const videoGroups = /* @__PURE__ */ new Map();
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
    async function exportAllTimestamps() {
      try {
        const { json, filename, totalVideos, totalTimestamps } = await buildExportPayload2();
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        log2(`Exported ${totalVideos} videos with ${totalTimestamps} timestamps`);
      } catch (err) {
        log2("Failed to export data:", err, "error");
        throw err;
      }
    }
    function openIndexedDB() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          const oldVersion = event.oldVersion;
          const transaction = event.target.transaction;
          if (oldVersion < 1) {
            db.createObjectStore(STORE_NAME, { keyPath: "video_id" });
          }
          if (oldVersion < 2 && !db.objectStoreNames.contains(SETTINGS_STORE_NAME)) {
            db.createObjectStore(SETTINGS_STORE_NAME, { keyPath: "key" });
          }
          if (oldVersion < 3) {
            if (db.objectStoreNames.contains(STORE_NAME)) {
              log2("Exporting backup before v2 migration...");
              const v1Store = transaction.objectStore(STORE_NAME);
              const exportRequest = v1Store.getAll();
              exportRequest.onsuccess = () => {
                const v1Records = exportRequest.result;
                if (v1Records.length > 0) {
                  try {
                    const exportData = {};
                    let totalTimestamps = 0;
                    v1Records.forEach((record) => {
                      if (Array.isArray(record.timestamps) && record.timestamps.length > 0) {
                        const timestampsWithGuids = record.timestamps.map((ts) => ({
                          guid: ts.guid || crypto.randomUUID(),
                          start: ts.start,
                          comment: ts.comment
                        }));
                        exportData[`ytls-${record.video_id}`] = {
                          video_id: record.video_id,
                          timestamps: timestampsWithGuids.sort((a2, b) => a2.start - b.start)
                        };
                        totalTimestamps += timestampsWithGuids.length;
                      }
                    });
                    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `timekeeper-data-${getTimestampSuffix2()}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    log2(`Pre-migration backup exported: ${v1Records.length} videos, ${totalTimestamps} timestamps`);
                  } catch (err) {
                    log2("Failed to export pre-migration backup:", err, "error");
                  }
                }
              };
            }
            const v2Store = db.createObjectStore(STORE_NAME_V2, { keyPath: "guid" });
            v2Store.createIndex("video_id", "video_id", { unique: false });
            v2Store.createIndex("video_start", ["video_id", "start"], { unique: false });
            if (db.objectStoreNames.contains(STORE_NAME)) {
              const v1Store = transaction.objectStore(STORE_NAME);
              const getAllRequest = v1Store.getAll();
              getAllRequest.onsuccess = () => {
                const v1Records = getAllRequest.result;
                if (v1Records.length > 0) {
                  let totalMigrated = 0;
                  v1Records.forEach((record) => {
                    if (Array.isArray(record.timestamps) && record.timestamps.length > 0) {
                      record.timestamps.forEach((ts) => {
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
                  log2(`Migrated ${totalMigrated} timestamps from ${v1Records.length} videos to v2 store`);
                }
              };
              db.deleteObjectStore(STORE_NAME);
              log2("Deleted old timestamps store after migration to v2");
            }
          }
        };
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
        request.onerror = (event) => {
          const error = event.target.error;
          reject(error ?? new Error("Failed to open IndexedDB"));
        };
      });
    }
    function executeTransaction(storeName, mode, operation) {
      return getDB().then((db) => {
        return new Promise((resolve, reject) => {
          let tx;
          try {
            tx = db.transaction(storeName, mode);
          } catch (err) {
            reject(new Error(`Failed to create transaction for ${storeName}: ${err}`));
            return;
          }
          const store = tx.objectStore(storeName);
          let request;
          try {
            request = operation(store);
          } catch (err) {
            reject(new Error(`Failed to execute operation on ${storeName}: ${err}`));
            return;
          }
          if (request) {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error ?? new Error(`IndexedDB ${mode} operation failed`));
          }
          tx.oncomplete = () => {
            if (!request) resolve(void 0);
          };
          tx.onerror = () => reject(tx.error ?? new Error(`IndexedDB transaction failed`));
          tx.onabort = () => reject(tx.error ?? new Error(`IndexedDB transaction aborted`));
        });
      });
    }
    function saveToIndexedDB(videoId, data) {
      return getDB().then((db) => {
        return new Promise((resolve, reject) => {
          let tx;
          try {
            tx = db.transaction([STORE_NAME_V2], "readwrite");
          } catch (err) {
            reject(new Error(`Failed to create transaction: ${err}`));
            return;
          }
          const v2Store = tx.objectStore(STORE_NAME_V2);
          const v2Index = v2Store.index("video_id");
          const getRequest = v2Index.getAll(IDBKeyRange.only(videoId));
          getRequest.onsuccess = () => {
            try {
              const existingRecords = getRequest.result;
              const existingGuids = new Set(existingRecords.map((r) => r.guid));
              const newGuids = new Set(data.map((ts) => ts.guid));
              existingRecords.forEach((record) => {
                if (!newGuids.has(record.guid)) {
                  v2Store.delete(record.guid);
                }
              });
              data.forEach((ts) => {
                v2Store.put({
                  guid: ts.guid,
                  video_id: videoId,
                  start: ts.start,
                  comment: ts.comment
                });
              });
            } catch (err) {
              log2("Error during save operation:", err, "error");
            }
          };
          getRequest.onerror = () => {
            reject(getRequest.error ?? new Error("Failed to get existing records"));
          };
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error ?? new Error("Failed to save to IndexedDB"));
          tx.onabort = () => reject(tx.error ?? new Error("Transaction aborted during save"));
        });
      });
    }
    function saveSingleTimestampToIndexedDB(videoId, timestamp) {
      return getDB().then((db) => {
        return new Promise((resolve, reject) => {
          let tx;
          try {
            tx = db.transaction([STORE_NAME_V2], "readwrite");
          } catch (err) {
            reject(new Error(`Failed to create transaction: ${err}`));
            return;
          }
          const v2Store = tx.objectStore(STORE_NAME_V2);
          const putRequest = v2Store.put({
            guid: timestamp.guid,
            video_id: videoId,
            start: timestamp.start,
            comment: timestamp.comment
          });
          putRequest.onerror = () => {
            reject(putRequest.error ?? new Error("Failed to put timestamp"));
          };
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error ?? new Error("Failed to save single timestamp to IndexedDB"));
          tx.onabort = () => reject(tx.error ?? new Error("Transaction aborted during single timestamp save"));
        });
      });
    }
    function deleteSingleTimestampFromIndexedDB(videoId, guid) {
      return getDB().then((db) => {
        return new Promise((resolve, reject) => {
          let tx;
          try {
            tx = db.transaction([STORE_NAME_V2], "readwrite");
          } catch (err) {
            reject(new Error(`Failed to create transaction: ${err}`));
            return;
          }
          const v2Store = tx.objectStore(STORE_NAME_V2);
          const deleteRequest = v2Store.delete(guid);
          deleteRequest.onerror = () => {
            reject(deleteRequest.error ?? new Error("Failed to delete timestamp"));
          };
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error ?? new Error("Failed to delete single timestamp from IndexedDB"));
          tx.onabort = () => reject(tx.error ?? new Error("Transaction aborted during timestamp deletion"));
        });
      });
    }
    function loadFromIndexedDB(videoId) {
      return getDB().then((db) => {
        return new Promise((resolve, reject) => {
          let tx;
          try {
            tx = db.transaction([STORE_NAME_V2], "readonly");
          } catch (err) {
            log2("Failed to create read transaction:", err, "warn");
            resolve(null);
            return;
          }
          const v2Store = tx.objectStore(STORE_NAME_V2);
          const v2Index = v2Store.index("video_id");
          const v2Request = v2Index.getAll(IDBKeyRange.only(videoId));
          v2Request.onsuccess = () => {
            const v2Records = v2Request.result;
            if (v2Records.length > 0) {
              const timestamps = v2Records.map((r) => ({
                guid: r.guid,
                start: r.start,
                comment: r.comment
              })).sort((a, b) => a.start - b.start);
              resolve(timestamps);
            } else {
              resolve(null);
            }
          };
          v2Request.onerror = () => {
            log2("Failed to load timestamps:", v2Request.error, "warn");
            resolve(null);
          };
          tx.onabort = () => {
            log2("Transaction aborted during load:", tx.error, "warn");
            resolve(null);
          };
        });
      });
    }
    function removeFromIndexedDB(videoId) {
      return getDB().then((db) => {
        return new Promise((resolve, reject) => {
          let tx;
          try {
            tx = db.transaction([STORE_NAME_V2], "readwrite");
          } catch (err) {
            reject(new Error(`Failed to create transaction: ${err}`));
            return;
          }
          const v2Store = tx.objectStore(STORE_NAME_V2);
          const v2Index = v2Store.index("video_id");
          const getRequest = v2Index.getAll(IDBKeyRange.only(videoId));
          getRequest.onsuccess = () => {
            try {
              const records = getRequest.result;
              records.forEach((record) => {
                v2Store.delete(record.guid);
              });
            } catch (err) {
              log2("Error during remove operation:", err, "error");
            }
          };
          getRequest.onerror = () => {
            reject(getRequest.error ?? new Error("Failed to get records for removal"));
          };
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error ?? new Error("Failed to remove timestamps"));
          tx.onabort = () => reject(tx.error ?? new Error("Transaction aborted during timestamp removal"));
        });
      });
    }
    function getAllFromIndexedDB(storeName) {
      return executeTransaction(storeName, "readonly", (store) => {
        return store.getAll();
      }).then((result) => {
        return Array.isArray(result) ? result : [];
      });
    }
    function saveGlobalSettings2(key, value) {
      executeTransaction(SETTINGS_STORE_NAME, "readwrite", (store) => {
        store.put({ key, value });
      }).catch((err) => {
        log2(`Failed to save setting '${key}' to IndexedDB:`, err, "error");
      });
    }
    function loadGlobalSettings2(key) {
      return executeTransaction(SETTINGS_STORE_NAME, "readonly", (store) => {
        return store.get(key);
      }).then((result) => {
        return result?.value;
      }).catch((err) => {
        log2(`Failed to load setting '${key}' from IndexedDB:`, err, "error");
        return void 0;
      });
    }
    async function saveOAuthMessage(message) {
      try {
        await executeTransaction(SETTINGS_STORE_NAME, "readwrite", (store) => {
          store.put({ key: "oauth_message", value: message });
        });
      } catch (err) {
        log2("Failed to save OAuth message to IndexedDB:", err, "error");
      }
    }
    async function loadOAuthMessage() {
      try {
        const result = await executeTransaction(SETTINGS_STORE_NAME, "readonly", (store) => {
          return store.get("oauth_message");
        });
        return result?.value ?? null;
      } catch (err) {
        log2("Failed to load OAuth message from IndexedDB:", err, "error");
        return null;
      }
    }
    async function deleteOAuthMessage() {
      try {
        await executeTransaction(SETTINGS_STORE_NAME, "readwrite", (store) => {
          store.delete("oauth_message");
        });
      } catch (err) {
        log2("Failed to delete OAuth message from IndexedDB:", err, "error");
      }
    }
    function saveUIVisibilityState() {
      if (!pane) return;
      const isVisible = pane.style.display !== "none";
      saveGlobalSettings2("uiVisible", isVisible);
    }
    function syncToggleButtons(visibilityOverride) {
      const isVisible = typeof visibilityOverride === "boolean" ? visibilityOverride : !!pane && pane.style.display !== "none";
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
      loadGlobalSettings2("uiVisible").then((value) => {
        const isVisible = value;
        if (typeof isVisible === "boolean") {
          if (isVisible) {
            pane.style.display = "flex";
            pane.classList.remove("ytls-zoom-out");
            pane.classList.add("ytls-zoom-in");
          } else {
            pane.style.display = "none";
          }
          syncToggleButtons(isVisible);
        } else {
          pane.style.display = "flex";
          pane.classList.remove("ytls-zoom-out");
          pane.classList.add("ytls-zoom-in");
          syncToggleButtons(true);
        }
      }).catch((err) => {
        log2("Failed to load UI visibility state:", err, "error");
        pane.style.display = "flex";
        pane.classList.remove("ytls-zoom-out");
        pane.classList.add("ytls-zoom-in");
        syncToggleButtons(true);
      });
    }
    function togglePaneVisibility(force) {
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
        log2("UI is not initialized; cannot import timestamps.", "warn");
        return;
      }
      let processedSuccessfully = false;
      try {
        const parsed = JSON.parse(contentString);
        let timestamps = null;
        if (Array.isArray(parsed)) {
          timestamps = parsed;
        } else if (typeof parsed === "object" && parsed !== null) {
          const currentVideoId = currentLoadedVideoId;
          if (currentVideoId) {
            const key = `timekeeper-${currentVideoId}`;
            if (parsed[key] && Array.isArray(parsed[key].timestamps)) {
              timestamps = parsed[key].timestamps;
              log2(`Found timestamps for current video (${currentVideoId}) in export format`, "info");
            }
          }
          if (!timestamps) {
            const keys = Object.keys(parsed).filter((k) => k.startsWith("ytls-"));
            if (keys.length === 1 && Array.isArray(parsed[keys[0]].timestamps)) {
              timestamps = parsed[keys[0]].timestamps;
              const videoId = parsed[keys[0]].video_id;
              log2(`Found timestamps for video ${videoId} in export format`, "info");
            }
          }
        }
        if (timestamps && Array.isArray(timestamps)) {
          const isValidJsonData = timestamps.every((ts) => typeof ts.start === "number" && typeof ts.comment === "string");
          if (isValidJsonData) {
            timestamps.forEach((ts) => {
              if (ts.guid) {
                const existingLi = getTimestampItems().find((li) => li.dataset.guid === ts.guid);
                if (existingLi) {
                  const commentInput = existingLi.querySelector("input");
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
            log2("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.", "warn");
          }
        } else {
          log2("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.", "warn");
        }
      } catch (e) {
      }
      if (!processedSuccessfully) {
        const lines = contentString.split("\n").map((line) => line.trim()).filter((line) => line);
        if (lines.length > 0) {
          let matchedAnyLine = false;
          lines.forEach((line) => {
            const match = line.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);
            if (match) {
              matchedAnyLine = true;
              const hours = parseInt(match[1]) || 0;
              const minutes = parseInt(match[2]);
              const seconds = parseInt(match[3]);
              const start = hours * 3600 + minutes * 60 + seconds;
              const remainingText = match[4] ? match[4].trim() : "";
              let guid = null;
              let comment = remainingText;
              const guidMatch = remainingText.match(/<!--\s*guid:([^>]+?)\s*-->/);
              if (guidMatch) {
                guid = guidMatch[1].trim();
                comment = remainingText.replace(/<!--\s*guid:[^>]+?\s*-->/, "").trim();
              }
              let existingLi;
              if (guid) {
                existingLi = getTimestampItems().find((li) => li.dataset.guid === guid);
              }
              if (!existingLi && !guid) {
                existingLi = getTimestampItems().find((li) => {
                  if (li.dataset.guid) {
                    return false;
                  }
                  const timeLink = li.querySelector("a[data-time]");
                  const timeValue = timeLink?.dataset.time;
                  if (!timeValue) {
                    return false;
                  }
                  const time = Number.parseInt(timeValue, 10);
                  return Number.isFinite(time) && time === start;
                });
              }
              if (existingLi) {
                const commentInput = existingLi.querySelector("input");
                if (commentInput) {
                  commentInput.value = comment;
                }
              } else {
                addTimestamp(start, comment, false, guid || crypto.randomUUID());
              }
            }
          });
          if (matchedAnyLine) {
            processedSuccessfully = true;
          }
        }
      }
      if (processedSuccessfully) {
        log2("Timestamps changed: Imported timestamps from file/clipboard");
        updateIndentMarkers();
        saveTimestamps(currentLoadedVideoId);
        updateSeekbarMarkers();
        updateScroll();
      } else {
        alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.");
      }
    }
    async function initializePaneIfNeeded() {
      if (pane && document.body.contains(pane)) {
        return;
      }
      document.querySelectorAll("#ytls-pane").forEach((el) => el.remove());
      pane = document.createElement("div");
      header = document.createElement("div");
      list = document.createElement("ul");
      btns = document.createElement("div");
      timeDisplay = document.createElement("span");
      style = document.createElement("style");
      versionDisplay = document.createElement("span");
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
        let focusedTimestampGuid = null;
        if (document.activeElement instanceof HTMLInputElement && list.contains(document.activeElement)) {
          const activeLi = document.activeElement.closest("li");
          focusedTimestampGuid = activeLi?.dataset.guid ?? null;
        }
        sortTimestampsAndUpdateDisplay();
        if (focusedTimestampGuid) {
          const targetLi = getTimestampItems().find((li) => li.dataset.guid === focusedTimestampGuid);
          const targetInput = targetLi?.querySelector("input");
          if (targetInput) {
            try {
              targetInput.focus({ preventScroll: true });
            } catch {
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
      const scriptVersion = GM_info.script.version;
      versionDisplay.textContent = `v${scriptVersion}`;
      versionDisplay.classList.add("ytls-version-display");
      timeDisplay.id = "ytls-current-time";
      timeDisplay.textContent = "\u23F3";
      timeDisplay.onclick = () => {
        isSeeking = true;
        const player = getActivePlayer();
        if (player) player.seekToLiveHead();
        setTimeout(() => {
          isSeeking = false;
        }, 500);
      };
      function updateTime() {
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
        const { isLive } = playerInstance ? playerInstance.getVideoData() || { isLive: false } : { isLive: false };
        const behindLive = playerInstance ? isBehindLiveEdge(playerInstance) : false;
        const timestamps = list ? Array.from(list.children).map((li) => {
          const timeLink = li.querySelector("a[data-time]");
          return timeLink ? parseFloat(timeLink.getAttribute("data-time")) : 0;
        }) : [];
        let timestampDisplay = "";
        if (timestamps.length > 0) {
          if (isLive) {
            const currentTimeMinutes = Math.max(1, currentSeconds / 60);
            const liveTimestamps = timestamps.filter((time) => time <= currentSeconds);
            if (liveTimestamps.length > 0) {
              const timestampsPerMin = (liveTimestamps.length / currentTimeMinutes).toFixed(2);
              if (parseFloat(timestampsPerMin) > 0) {
                timestampDisplay = ` (${timestampsPerMin}/min)`;
              }
            }
          } else {
            const durationSeconds = playerInstance ? playerInstance.getDuration() : 0;
            const validDuration = Number.isFinite(durationSeconds) && durationSeconds > 0 ? durationSeconds : video && Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
            const totalMinutes = Math.max(1, validDuration / 60);
            const timestampsPerMin = (timestamps.length / totalMinutes).toFixed(1);
            if (parseFloat(timestampsPerMin) > 0) {
              timestampDisplay = ` (${timestampsPerMin}/min)`;
            }
          }
        }
        timeDisplay.textContent = `\u23F3${h ? h + ":" + String(m).padStart(2, "0") : m}:${String(s).padStart(2, "0")}${timestampDisplay}`;
        timeDisplay.style.color = behindLive ? "#ff4d4f" : "";
        if (timestamps.length > 0) {
          highlightNearestTimestampAtTime(currentSeconds, false);
        }
      }
      updateTime();
      if (timeUpdateIntervalId) {
        clearInterval(timeUpdateIntervalId);
      }
      timeUpdateIntervalId = setInterval(updateTime, 1e3);
      btns.id = "ytls-buttons";
      const handleAddTimestamp = () => {
        if (!list || list.querySelector(".ytls-error-message") || isLoadingTimestamps) {
          return;
        }
        const offset = typeof configuredOffset !== "undefined" ? configuredOffset : 0;
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
      const handleCopyTimestamps = function(e) {
        if (!list || list.querySelector(".ytls-error-message") || isLoadingTimestamps) {
          this.textContent = "\u274C";
          setTimeout(() => {
            this.textContent = "\u{1F4CB}";
          }, 2e3);
          return;
        }
        const timestamps = extractTimestampRecords();
        const videoDuration = Math.max(getLatestTimestampValue(), 0);
        if (timestamps.length === 0) {
          this.textContent = "\u274C";
          setTimeout(() => {
            this.textContent = "\u{1F4CB}";
          }, 2e3);
          return;
        }
        const includeGuids = e.ctrlKey;
        const plainText = timestamps.map((ts) => {
          const timeString = formatTimeString(ts.start, videoDuration);
          return includeGuids ? `${timeString} ${ts.comment} <!-- guid:${ts.guid} -->`.trimStart() : `${timeString} ${ts.comment}`;
        }).join("\n");
        navigator.clipboard.writeText(plainText).then(() => {
          this.textContent = "\u2705";
          setTimeout(() => {
            this.textContent = "\u{1F4CB}";
          }, 2e3);
        }).catch((err) => {
          log2("Failed to copy timestamps: ", err, "error");
          this.textContent = "\u274C";
          setTimeout(() => {
            this.textContent = "\u{1F4CB}";
          }, 2e3);
        });
      };
      const handleBulkOffset = () => {
        if (!list || list.querySelector(".ytls-error-message") || isLoadingTimestamps) {
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
          if (!holdStartTime) return;
          const elapsed = Date.now() - holdStartTime;
          const progress = Math.min(elapsed / 5e3 * 100, 100);
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
            resetButton();
            modal.classList.remove("ytls-fade-in");
            modal.classList.add("ytls-fade-out");
            setTimeout(async () => {
              if (document.body.contains(modal)) {
                document.body.removeChild(modal);
              }
              try {
                await removeFromIndexedDB(currentVideoId);
                handleUrlChange();
              } catch (err) {
                log2("Failed to delete all timestamps:", err, "error");
                alert("Failed to delete timestamps. Check console for details.");
              }
            }, 300);
          }, 5e3);
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
      const holidayEmojis = [
        {
          baseEmoji: "\u{1F423}",
          holidayEmoji: "\u{1F332}",
          month: 12,
          // December
          day: 25,
          name: "Christmas"
        }
        // Add more holidays here in the future
      ];
      function getHolidayEmojiForBase(baseEmoji) {
        const now = /* @__PURE__ */ new Date();
        const currentYear = now.getFullYear();
        for (const holiday of holidayEmojis) {
          if (holiday.baseEmoji !== baseEmoji) continue;
          const holidayDate = new Date(currentYear, holiday.month - 1, holiday.day);
          const diffTime = holidayDate.getTime() - now.getTime();
          const diffDays = diffTime / (1e3 * 60 * 60 * 24);
          if (Math.abs(diffDays) <= 7) {
            return holiday.holidayEmoji;
          }
        }
        return null;
      }
      const mainButtonConfigs = [
        { label: "\u{1F423}", title: "Add timestamp", action: handleAddTimestamp },
        { label: "\u2699\uFE0F", title: "Settings", action: toggleSettingsModal },
        // Changed action
        { label: "\u{1F4CB}", title: "Copy timestamps to clipboard", action: handleCopyTimestamps },
        { label: "\u23F1\uFE0F", title: "Offset all timestamps", action: handleBulkOffset },
        { label: "\u{1F5D1}\uFE0F", title: "Delete all timestamps for current video", action: handleDeleteAll }
      ];
      mainButtonConfigs.forEach((config) => {
        const button = document.createElement("button");
        button.textContent = config.label;
        button.title = config.title;
        button.classList.add("ytls-main-button");
        const holidayEmoji = getHolidayEmojiForBase(config.label);
        if (holidayEmoji) {
          const holidayEmojiSpan = document.createElement("span");
          holidayEmojiSpan.textContent = holidayEmoji;
          holidayEmojiSpan.classList.add("ytls-holiday-emoji");
          button.appendChild(holidayEmojiSpan);
        }
        if (config.label === "\u{1F4CB}") {
          button.onclick = function(e) {
            config.action.call(this, e);
          };
        } else {
          button.onclick = config.action;
        }
        if (config.label === "\u2699\uFE0F") {
          settingsCogButtonElement = button;
        }
        btns.appendChild(button);
      });
      function createButton(label, title, onClick) {
        const button = document.createElement("button");
        button.textContent = label;
        button.title = title;
        button.classList.add("ytls-settings-modal-button");
        button.onclick = onClick;
        return button;
      }
      function toggleSettingsModal() {
        if (settingsModalInstance && settingsModalInstance.parentNode === document.body) {
          settingsModalInstance.classList.remove("ytls-fade-in");
          settingsModalInstance.classList.add("ytls-fade-out");
          setTimeout(() => {
            if (document.body.contains(settingsModalInstance)) {
              document.body.removeChild(settingsModalInstance);
            }
            settingsModalInstance = null;
            document.removeEventListener("click", handleClickOutsideSettingsModal, true);
          }, 300);
          return;
        }
        settingsModalInstance = document.createElement("div");
        settingsModalInstance.id = "ytls-settings-modal";
        settingsModalInstance.classList.remove("ytls-fade-out");
        settingsModalInstance.classList.add("ytls-fade-in");
        const header2 = document.createElement("div");
        header2.className = "ytls-modal-header";
        const nav = document.createElement("div");
        nav.id = "ytls-settings-nav";
        const closeButton = document.createElement("button");
        closeButton.className = "ytls-modal-close-button";
        closeButton.textContent = "\u2715";
        closeButton.title = "Close";
        closeButton.onclick = () => {
          if (settingsModalInstance && settingsModalInstance.parentNode === document.body) {
            settingsModalInstance.classList.remove("ytls-fade-in");
            settingsModalInstance.classList.add("ytls-fade-out");
            setTimeout(() => {
              if (document.body.contains(settingsModalInstance)) {
                document.body.removeChild(settingsModalInstance);
              }
              settingsModalInstance = null;
              document.removeEventListener("click", handleClickOutsideSettingsModal, true);
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
        function showSection(section) {
          generalSection.style.display = section === "general" ? "block" : "none";
          driveSection.style.display = section === "drive" ? "block" : "none";
          generalTab.classList.toggle("active", section === "general");
          driveTab.classList.toggle("active", section === "drive");
          sectionHeading.textContent = section === "general" ? "General" : "Google Drive";
        }
        const generalTab = document.createElement("button");
        generalTab.textContent = "\u{1F6E0}\uFE0F";
        const generalTabText = document.createElement("span");
        generalTabText.className = "ytls-tab-text";
        generalTabText.textContent = " General";
        generalTab.appendChild(generalTabText);
        generalTab.title = "General settings";
        generalTab.classList.add("ytls-settings-modal-button");
        generalTab.onclick = () => showSection("general");
        const driveTab = document.createElement("button");
        driveTab.textContent = "\u2601\uFE0F";
        const driveTabText = document.createElement("span");
        driveTabText.className = "ytls-tab-text";
        driveTabText.textContent = " Backup";
        driveTab.appendChild(driveTabText);
        driveTab.title = "Google Drive sign-in and backup";
        driveTab.classList.add("ytls-settings-modal-button");
        driveTab.onclick = () => showSection("drive");
        nav.appendChild(generalTab);
        nav.appendChild(driveTab);
        header2.appendChild(nav);
        header2.appendChild(closeButton);
        settingsModalInstance.appendChild(header2);
        generalSection.className = "ytls-button-grid";
        generalSection.appendChild(createButton("\u{1F4BE} Save", "Save As...", saveBtn.onclick));
        generalSection.appendChild(createButton("\u{1F4C2} Load", "Load", loadBtn.onclick));
        generalSection.appendChild(createButton("\u{1F4E4} Export All", "Export All Data", exportBtn.onclick));
        generalSection.appendChild(createButton("\u{1F4E5} Import All", "Import All Data", importBtn.onclick));
        const signButton = createButton(
          googleAuthState.isSignedIn ? "\u{1F513} Sign Out" : "\u{1F510} Sign In",
          googleAuthState.isSignedIn ? "Sign out from Google Drive" : "Sign in to Google Drive",
          async () => {
            if (googleAuthState.isSignedIn) {
              await signOutFromGoogle();
            } else {
              await signInToGoogle();
            }
            signButton.textContent = googleAuthState.isSignedIn ? "\u{1F513} Sign Out" : "\u{1F510} Sign In";
            signButton.title = googleAuthState.isSignedIn ? "Sign out from Google Drive" : "Sign in to Google Drive";
          }
        );
        driveSection.appendChild(signButton);
        const autoToggleButton = createButton(
          autoBackupEnabled ? "\u{1F501} Auto Backup: On" : "\u{1F501} Auto Backup: Off",
          "Toggle Auto Backup",
          async () => {
            await toggleAutoBackup();
            autoToggleButton.textContent = autoBackupEnabled ? "\u{1F501} Auto Backup: On" : "\u{1F501} Auto Backup: Off";
          }
        );
        driveSection.appendChild(autoToggleButton);
        const intervalButton = createButton(
          `\u23F1\uFE0F Backup Interval: ${autoBackupIntervalMinutes}min`,
          "Set periodic backup interval (minutes)",
          async () => {
            await setAutoBackupIntervalPrompt();
            intervalButton.textContent = `\u23F1\uFE0F Backup Interval: ${autoBackupIntervalMinutes}min`;
          }
        );
        driveSection.appendChild(intervalButton);
        driveSection.appendChild(createButton("\u{1F5C4}\uFE0F Backup Now", "Run a backup immediately", async () => {
          await runAutoBackupOnce(false);
        }));
        const infoContainer = document.createElement("div");
        infoContainer.style.marginTop = "15px";
        infoContainer.style.paddingTop = "10px";
        infoContainer.style.borderTop = "1px solid #555";
        infoContainer.style.fontSize = "12px";
        infoContainer.style.color = "#aaa";
        const statusDiv = document.createElement("div");
        statusDiv.style.marginBottom = "8px";
        statusDiv.style.fontWeight = "bold";
        infoContainer.appendChild(statusDiv);
        setAuthStatusDisplay(statusDiv);
        const userInfoDiv = document.createElement("div");
        userInfoDiv.style.marginBottom = "8px";
        setGoogleUserDisplay(userInfoDiv);
        infoContainer.appendChild(userInfoDiv);
        const backupInfoDiv = document.createElement("div");
        setBackupStatusDisplay(backupInfoDiv);
        infoContainer.appendChild(backupInfoDiv);
        driveSection.appendChild(infoContainer);
        updateAuthStatusDisplay();
        updateGoogleUserDisplay();
        updateBackupStatusDisplay();
        settingsContent.appendChild(sectionHeading);
        settingsContent.appendChild(generalSection);
        settingsContent.appendChild(driveSection);
        showSection("general");
        settingsModalInstance.appendChild(settingsContent);
        document.body.appendChild(settingsModalInstance);
        requestAnimationFrame(() => {
          const rect = settingsModalInstance.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const centeredTop = (viewportHeight - rect.height) / 2;
          settingsModalInstance.style.top = `${Math.max(20, centeredTop)}px`;
          settingsModalInstance.style.transform = "translateX(-50%)";
        });
        setTimeout(() => {
          document.addEventListener("click", handleClickOutsideSettingsModal, true);
        }, 0);
      }
      function handleClickOutsideSettingsModal(event) {
        if (settingsCogButtonElement && settingsCogButtonElement.contains(event.target)) {
          return;
        }
        if (settingsModalInstance && !settingsModalInstance.contains(event.target)) {
          if (settingsModalInstance.parentNode === document.body) {
            settingsModalInstance.classList.remove("ytls-fade-in");
            settingsModalInstance.classList.add("ytls-fade-out");
            setTimeout(() => {
              if (document.body.contains(settingsModalInstance)) {
                document.body.removeChild(settingsModalInstance);
              }
              settingsModalInstance = null;
              document.removeEventListener("click", handleClickOutsideSettingsModal, true);
            }, 300);
          }
        }
      }
      const saveBtn = document.createElement("button");
      saveBtn.textContent = "\u{1F4BE} Save";
      saveBtn.classList.add("ytls-file-operation-button");
      saveBtn.onclick = () => {
        const modal = document.createElement("div");
        modal.id = "ytls-save-modal";
        modal.classList.remove("ytls-fade-out");
        modal.classList.add("ytls-fade-in");
        const message = document.createElement("p");
        message.textContent = "Save as:";
        const jsonButton = document.createElement("button");
        jsonButton.textContent = "JSON";
        jsonButton.classList.add("ytls-save-modal-button");
        jsonButton.onclick = () => {
          modal.classList.remove("ytls-fade-in");
          modal.classList.add("ytls-fade-out");
          setTimeout(() => {
            saveTimestampsAs("json");
            if (document.body.contains(modal)) {
              document.body.removeChild(modal);
            }
          }, 300);
        };
        const textButton = document.createElement("button");
        textButton.textContent = "Plain Text";
        textButton.classList.add("ytls-save-modal-button");
        textButton.onclick = () => {
          modal.classList.remove("ytls-fade-in");
          modal.classList.add("ytls-fade-out");
          setTimeout(() => {
            saveTimestampsAs("text");
            if (document.body.contains(modal)) {
              document.body.removeChild(modal);
            }
          }, 300);
        };
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
        modal.appendChild(jsonButton);
        modal.appendChild(textButton);
        modal.appendChild(cancelButton);
        document.body.appendChild(modal);
      };
      const loadBtn = document.createElement("button");
      loadBtn.textContent = "\u{1F4C2} Load";
      loadBtn.classList.add("ytls-file-operation-button");
      loadBtn.onclick = () => {
        const loadModal = document.createElement("div");
        loadModal.id = "ytls-load-modal";
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
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = ".json,.txt";
            fileInput.classList.add("ytls-hidden-file-input");
            fileInput.onchange = (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                const content2 = String(reader.result).trim();
                processImportedData(content2);
              };
              reader.readAsText(file);
            };
            fileInput.click();
          }, 300);
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
              log2("Failed to read from clipboard: ", err, "error");
              alert("Failed to read from clipboard. Ensure you have granted permission.");
            }
          }, 300);
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
          }, 300);
        };
        loadModal.appendChild(loadMessage);
        loadModal.appendChild(fromFileButton);
        loadModal.appendChild(fromClipboardButton);
        loadModal.appendChild(cancelLoadButton);
        document.body.appendChild(loadModal);
      };
      const exportBtn = document.createElement("button");
      exportBtn.textContent = "\u{1F4E4} Export";
      exportBtn.classList.add("ytls-file-operation-button");
      exportBtn.onclick = async () => {
        try {
          await exportAllTimestamps();
        } catch (err) {
          alert("Failed to export data: Could not read from database.");
        }
      };
      const importBtn = document.createElement("button");
      importBtn.textContent = "\u{1F4E5} Import";
      importBtn.classList.add("ytls-file-operation-button");
      importBtn.onclick = () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".json";
        fileInput.classList.add("ytls-hidden-file-input");
        fileInput.onchange = (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const importedData = JSON.parse(String(reader.result));
              const importPromises = [];
              for (const key in importedData) {
                if (Object.prototype.hasOwnProperty.call(importedData, key) && key.startsWith("ytls-")) {
                  const videoId = key.substring(5);
                  const videoData = importedData[key];
                  if (videoData && typeof videoData.video_id === "string" && Array.isArray(videoData.timestamps)) {
                    const timestampsWithGuids = videoData.timestamps.map((ts) => ({
                      ...ts,
                      guid: ts.guid || crypto.randomUUID()
                    }));
                    const promise = saveToIndexedDB(videoId, timestampsWithGuids).then(() => log2(`Imported ${videoId} to IndexedDB`)).catch((err) => log2(`Failed to import ${videoId} to IndexedDB:`, err, "error"));
                    importPromises.push(promise);
                  } else {
                    log2(`Skipping key ${key} during import due to unexpected data format.`, "warn");
                  }
                }
              }
              Promise.all(importPromises).then(() => {
                handleUrlChange();
              }).catch((err) => {
                alert("An error occurred during import to IndexedDB. Check console for details.");
                log2("Overall import error:", err, "error");
              });
            } catch (e) {
              alert("Failed to import data. Please ensure the file is in the correct format.\n" + e.message);
              log2("Import error:", e, "error");
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
      function loadPanePosition() {
        if (!pane) return;
        log2("Loading window position from IndexedDB");
        loadGlobalSettings2("windowPosition").then((value) => {
          if (value && typeof value.x === "number" && typeof value.y === "number") {
            const pos = value;
            pane.style.left = `${pos.x}px`;
            pane.style.top = `${pos.y}px`;
            pane.style.right = "auto";
            pane.style.bottom = "auto";
            lastSavedPanePosition = {
              x: Math.max(0, Math.round(pos.x)),
              y: Math.max(0, Math.round(pos.y))
            };
          } else {
            log2("No window position found in IndexedDB, leaving default position");
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
        }).catch((err) => {
          log2("failed to load pane position from IndexedDB:", err, "warn");
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
        if (lastSavedPanePosition && lastSavedPanePosition.x === positionData.x && lastSavedPanePosition.y === positionData.y) {
          log2("Skipping window position save; position unchanged");
          return;
        }
        lastSavedPanePosition = { ...positionData };
        log2(`Saving window position to IndexedDB: x=${positionData.x}, y=${positionData.y}`);
        saveGlobalSettings2("windowPosition", positionData);
        safePostMessage({
          type: "window_position_updated",
          position: positionData,
          timestamp: Date.now()
        });
      }
      pane.style.position = "fixed";
      pane.style.bottom = "0";
      pane.style.right = "0";
      pane.style.transition = "none";
      loadPanePosition();
      setTimeout(() => clampPaneToViewport(), 10);
      let isDragging = false;
      let offsetX;
      let offsetY;
      let dragOccurredSinceLastMouseDown = false;
      pane.addEventListener("mousedown", (e) => {
        const target = e.target;
        if (!(target instanceof Element)) {
          return;
        }
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
          return;
        }
        if (target !== header && !header.contains(target) && window.getComputedStyle(target).cursor === "pointer") {
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
        dragOccurredSinceLastMouseDown = true;
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;
        const paneRect = pane.getBoundingClientRect();
        const paneWidth = paneRect.width;
        const paneHeight = paneRect.height;
        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = document.documentElement.clientHeight;
        x = Math.max(0, Math.min(x, viewportWidth - paneWidth));
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
          dragOccurredSinceLastMouseDown = false;
        }, 50);
        clampPaneToViewport();
        setTimeout(() => {
          if (didDrag) {
            savePanePosition();
          }
        }, 200);
      });
      pane.addEventListener("dragstart", (e) => e.preventDefault());
      let resizeTimeout = null;
      window.addEventListener("resize", windowResizeHandler = () => {
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(() => {
          clampPaneToViewport();
          savePanePosition();
          resizeTimeout = null;
        }, 200);
      });
      header.appendChild(timeDisplay);
      header.appendChild(versionDisplay);
      const content = document.createElement("div");
      content.id = "ytls-content";
      content.append(list, btns);
      pane.append(header, content, style);
      if (!docPointerDownHandler) {
        document.addEventListener("pointerdown", docPointerDownHandler = () => {
          lastPointerDownTs = Date.now();
        }, true);
      }
      if (!docPointerUpHandler) {
        document.addEventListener("pointerup", docPointerUpHandler = () => {
        }, true);
      }
    }
    async function displayPane() {
      if (!pane) return;
      await loadUIVisibilityState();
      if (typeof setBuildExportPayload === "function") {
        setBuildExportPayload(buildExportPayload2);
      }
      if (typeof setSaveGlobalSettings === "function") {
        setSaveGlobalSettings(saveGlobalSettings2);
      }
      if (typeof setLoadGlobalSettings === "function") {
        setLoadGlobalSettings(loadGlobalSettings2);
      }
      if (typeof setLog === "function") {
        setLog(log2);
      }
      if (typeof setGetTimestampSuffix === "function") {
        setGetTimestampSuffix(getTimestampSuffix2);
      }
      await loadGoogleAuthState();
      await loadAutoBackupSettings();
      await scheduleAutoBackup();
      document.body.appendChild(pane);
    }
    function addHeaderButton(attempt = 0) {
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
      log2("Timekeeper header button added next to YouTube logo");
    }
    function setupTitleObserver() {
      if (titleObserver) {
        return;
      }
      titleObserver = new MutationObserver(() => {
        const newTitle = getVideoTitle();
        if (newTitle !== currentLoadedVideoTitle) {
          currentLoadedVideoTitle = newTitle;
          if (timeDisplay) {
            timeDisplay.title = currentLoadedVideoTitle;
            log2("Video title changed, updated tooltip:", currentLoadedVideoTitle);
          }
        }
      });
      const titleMeta = document.querySelector('meta[name="title"]');
      if (titleMeta) {
        titleObserver.observe(titleMeta, { attributes: true, attributeFilter: ["content"] });
      }
      const titleElement = document.querySelector("title");
      if (titleElement) {
        titleObserver.observe(titleElement, { childList: true, characterData: true, subtree: true });
      }
      log2("Title observer initialized");
    }
    async function handleUrlChange() {
      if (!isSupportedUrl()) {
        unloadTimekeeper();
        return;
      }
      await waitForYouTubeReady();
      await initializePaneIfNeeded();
      document.querySelectorAll("#ytls-pane").forEach((el, idx) => {
        if (idx > 0) el.remove();
      });
      currentLoadedVideoId = getVideoId();
      currentLoadedVideoTitle = getVideoTitle();
      const pageTitle = document.title;
      log2("Page Title:", pageTitle);
      log2("Video ID:", currentLoadedVideoId);
      log2("Video Title:", currentLoadedVideoTitle);
      log2("Current URL:", window.location.href);
      if (timeDisplay && currentLoadedVideoTitle) {
        timeDisplay.title = currentLoadedVideoTitle;
      }
      setupTitleObserver();
      clearTimestampsDisplay();
      updateSeekbarMarkers();
      await loadTimestamps();
      updateSeekbarMarkers();
      setLoadingState(false);
      log2("Timestamps loaded and UI unlocked for video:", currentLoadedVideoId);
      await displayPane();
      addHeaderButton();
      setupVideoEventListeners();
    }
    window.addEventListener("yt-navigate-start", () => {
      log2("Navigation started (yt-navigate-start event fired)");
      if (isSupportedUrl() && pane && list) {
        log2("Locking UI and showing loading state for navigation");
        setLoadingState(true);
      }
    });
    keydownHandler = (e) => {
      if (e.ctrlKey && e.altKey && e.shiftKey && (e.key === "T" || e.key === "t")) {
        e.preventDefault();
        togglePaneVisibility();
        log2("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)");
      }
    };
    document.addEventListener("keydown", keydownHandler);
    window.addEventListener("yt-navigate-finish", () => {
      log2("Navigation finished (yt-navigate-finish event fired)");
      handleUrlChange();
    });
    log2("Timekeeper initialized and waiting for navigation events");
  })();
})();

