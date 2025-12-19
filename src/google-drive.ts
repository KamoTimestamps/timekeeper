/**
 * Google Drive integration module for Timekeeper
 * Handles OAuth2 authentication, backup scheduling, and Drive uploads
 */

declare const GM: {
  getValue<T = unknown>(key: string, defaultValue?: T): Promise<T>;
  setValue<T = unknown>(key: string, value: T): Promise<void>;
};

// Types
export interface GoogleAuthState {
  isSignedIn: boolean;
  accessToken: string | null;
  userName: string | null;
  email: string | null;
}

export interface ExportPayload {
  json: string;
  filename: string;
  totalVideos: number;
  totalTimestamps: number;
}

// State
export let googleAuthState: GoogleAuthState = {
  isSignedIn: false,
  accessToken: null,
  userName: null,
  email: null
};

export let autoBackupEnabled = true;
export let autoBackupIntervalMinutes = 15;
export let lastAutoBackupAt: number | null = null;
export let isAutoBackupRunning = false;
export let autoBackupRetryAttempts = 0;
export let autoBackupBackoffMs: number | null = null;

// Display elements (set from main script)
export let googleUserDisplay: any = null;
export let backupStatusDisplay: any = null;
export let authStatusDisplay: any = null;

// Helper functions to set display elements
export function setGoogleUserDisplay(el: HTMLElement | null) {
  googleUserDisplay = el;
}

export function setBackupStatusDisplay(el: HTMLElement | null) {
  backupStatusDisplay = el;
}

export function setAuthStatusDisplay(el: HTMLElement | null) {
  authStatusDisplay = el;
}

let authSpinnerStylesInjected = false;
function ensureAuthSpinnerStyles() {
  if (authSpinnerStylesInjected) return;
  try {
    const style = document.createElement('style');
    style.textContent = `
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`;
    document.head.appendChild(style);
    authSpinnerStylesInjected = true;
  } catch {}
}

// Callbacks (set from main script)
export let buildExportPayload: any = null;
export let saveGlobalSettings: any = null;
export let loadGlobalSettings: any = null;
export let log: any = null;
export let getTimestampSuffix: any = null;

// Helper functions to set callbacks
export function setBuildExportPayload(fn: any) {
  buildExportPayload = fn;
}

export function setSaveGlobalSettings(fn: any) {
  saveGlobalSettings = fn;
}

export function setLoadGlobalSettings(fn: any) {
  loadGlobalSettings = fn;
}

export function setLog(fn: any) {
  log = fn;
}

export function setGetTimestampSuffix(fn: any) {
  getTimestampSuffix = fn;
}

// Google OAuth2 Configuration
const GOOGLE_CLIENT_ID = '1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com';
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile';
const GOOGLE_REDIRECT_URI = 'https://www.youtube.com/';

// Auto-backup constants
const AUTO_BACKUP_INITIAL_BACKOFF_MS = 30 * 1000; // 30s
const AUTO_BACKUP_MAX_BACKOFF_MS = 30 * 60 * 1000; // 30m
const AUTO_BACKUP_MAX_RETRY_ATTEMPTS = 5;
let autoBackupIntervalId: ReturnType<typeof setInterval> | null = null;
let autoBackupBackoffTimeoutId: ReturnType<typeof setTimeout> | null = null;

// Load Google auth state from storage
export async function loadGoogleAuthState() {
  try {
    const stored = await loadGlobalSettings('googleAuthState');
    if (stored && typeof stored === 'object') {
      googleAuthState = { ...googleAuthState, ...stored as GoogleAuthState };
      updateGoogleUserDisplay();
    }
  } catch (err) {
    log('Failed to load Google auth state:', err, 'error');
  }
}

// Save Google auth state to storage
export async function saveGoogleAuthState() {
  try {
    await saveGlobalSettings('googleAuthState', googleAuthState);
  } catch (err) {
    log('Failed to save Google auth state:', err, 'error');
  }
}

// Update the username display
export function updateGoogleUserDisplay() {
  if (!googleUserDisplay) return;
  // User info is now shown in auth status display, so hide this separate element
  googleUserDisplay.style.display = 'none';
}

export function updateAuthStatusDisplay(status?: 'authenticating' | 'error', message?: string) {
  if (!authStatusDisplay) return;
  authStatusDisplay.style.fontWeight = 'bold';
  if (status === 'authenticating') {
    ensureAuthSpinnerStyles();
    authStatusDisplay.style.color = '#ffa500';
    while (authStatusDisplay.firstChild) authStatusDisplay.removeChild(authStatusDisplay.firstChild);
    const spinner = document.createElement('span');
    spinner.className = 'tk-auth-spinner';
    const text = document.createTextNode(` ${message || 'Authorizing with Google…'}`);
    authStatusDisplay.appendChild(spinner);
    authStatusDisplay.appendChild(text);
    return;
  }
  if (status === 'error') {
    authStatusDisplay.textContent = `❌ ${message || 'Authorization failed'}`;
    authStatusDisplay.style.color = '#ff4d4f';
    return;
  }
  if (!googleAuthState.isSignedIn) {
    authStatusDisplay.textContent = '❌ Not signed in';
    authStatusDisplay.style.color = '#ff4d4f';
    authStatusDisplay.removeAttribute('title');
  } else {
    const displayName = googleAuthState.userName || 'Signed in';
    authStatusDisplay.textContent = `✅ ${displayName}`;
    authStatusDisplay.style.color = '#52c41a';
    if (googleAuthState.email) {
      authStatusDisplay.title = googleAuthState.email;
    }
  }
}

export function blinkAuthStatusDisplay() {
  if (!authStatusDisplay) return;
  ensureAuthSpinnerStyles();
  authStatusDisplay.classList.remove('tk-auth-blink');
  // Trigger reflow to restart animation
  void authStatusDisplay.offsetWidth;
  authStatusDisplay.classList.add('tk-auth-blink');
  setTimeout(() => {
    authStatusDisplay.classList.remove('tk-auth-blink');
  }, 1200); // 3 blinks * 0.4s
}

// Monitor popup for OAuth token via BroadcastChannel and localStorage fallback
function monitorOAuthPopup(popup: Window | null): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!popup) {
      if (log) log('OAuth monitor: popup is null', null, 'error');
      reject(new Error('Failed to open popup'));
      return;
    }

    if (log) log('OAuth monitor: starting to monitor popup for token');
    const start = Date.now();
    const timeoutMs = 5 * 60 * 1000; // 5 minutes
    const channelName = 'timekeeper_oauth';
    let channel: BroadcastChannel | null = null;
    let storageListener: ((e: StorageEvent) => void) | null = null;
    let checkInterval: ReturnType<typeof setInterval> | null = null;

    const cleanup = () => {
      if (channel) {
        try { channel.close(); } catch (_) {}
        channel = null;
      }
      if (storageListener) {
        window.removeEventListener('storage', storageListener);
        storageListener = null;
      }
      if (checkInterval) {
        clearInterval(checkInterval);
        checkInterval = null;
      }
    };

    // Try BroadcastChannel (modern browsers)
    try {
      channel = new BroadcastChannel(channelName);
      if (log) log('OAuth monitor: BroadcastChannel created successfully');
      channel.onmessage = (event) => {
        if (log) log('OAuth monitor: received BroadcastChannel message', event.data);
        if (event.data?.type === 'timekeeper_oauth_token' && event.data?.token) {
          if (log) log('OAuth monitor: token received via BroadcastChannel');
          cleanup();
          try { popup.close(); } catch (_) {}
          resolve(event.data.token);
        } else if (event.data?.type === 'timekeeper_oauth_error') {
          if (log) log('OAuth monitor: error received via BroadcastChannel', event.data.error, 'error');
          cleanup();
          try { popup.close(); } catch (_) {}
          reject(new Error(event.data.error || 'OAuth failed'));
        }
      };
    } catch (err) {
      if (log) log('OAuth monitor: BroadcastChannel not supported, using localStorage fallback', err);
    }

    // Fallback: localStorage event listener (works across tabs in all browsers)
    if (log) log('OAuth monitor: setting up localStorage listener');
    storageListener = (event: StorageEvent) => {
      if (event.key === 'timekeeper_oauth_message' && event.newValue) {
        if (log) log('OAuth monitor: received localStorage message', event.newValue);
        try {
          const data = JSON.parse(event.newValue);
          if (data.type === 'timekeeper_oauth_token' && data.token) {
            if (log) log('OAuth monitor: token received via localStorage');
            cleanup();
            try { popup.close(); } catch (_) {}
            localStorage.removeItem('timekeeper_oauth_message');
            resolve(data.token);
          } else if (data.type === 'timekeeper_oauth_error') {
            if (log) log('OAuth monitor: error received via localStorage', data.error, 'error');
            cleanup();
            try { popup.close(); } catch (_) {}
            localStorage.removeItem('timekeeper_oauth_message');
            reject(new Error(data.error || 'OAuth failed'));
          }
        } catch (err) {
          if (log) log('OAuth monitor: failed to parse localStorage message', err, 'error');
        }
      }
    };
    window.addEventListener('storage', storageListener);

    // Only check for timeout - don't check popup.closed as it's unreliable during cross-origin navigation
    // Rely on BroadcastChannel/localStorage messages to know when OAuth completes or fails
    checkInterval = setInterval(() => {
      const elapsed = Date.now() - start;

      if (elapsed > timeoutMs) {
        if (log) log('OAuth monitor: popup timed out after 5 minutes', null, 'error');
        cleanup();
        try { popup.close(); } catch (_) {}
        reject(new Error('OAuth popup timed out'));
        return;
      }
    }, 1000);
  });
}

// Sign in to Google Drive using popup (no page redirect)
export async function signInToGoogle() {
  if (!GOOGLE_CLIENT_ID) {
    updateAuthStatusDisplay('error', 'Google Client ID not configured');
    return;
  }

  try {
    if (log) log('OAuth signin: starting OAuth flow');
    updateAuthStatusDisplay('authenticating', 'Opening authentication window...');
    // Build the OAuth URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'token');
    authUrl.searchParams.set('scope', GOOGLE_SCOPES);
    authUrl.searchParams.set('include_granted_scopes', 'true');
    authUrl.searchParams.set('state', 'timekeeper_auth');

    if (log) log('OAuth signin: opening popup');
    // Open popup for OAuth
    const popup = window.open(
      authUrl.toString(),
      'TimekeeperGoogleAuth',
      'width=500,height=600,menubar=no,toolbar=no,location=no'
    );

    if (!popup) {
      if (log) log('OAuth signin: popup blocked by browser', null, 'error');
      updateAuthStatusDisplay('error', 'Popup blocked. Please enable popups for YouTube.');
      return;
    }
    if (log) log('OAuth signin: popup opened successfully');
    updateAuthStatusDisplay('authenticating', 'Waiting for authentication...');

    try {
      // Wait for OAuth token from popup via postMessage
      const accessToken = await monitorOAuthPopup(popup);

      // Fetch user info with the access token
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (userInfoResponse.ok) {
        const userInfo = await userInfoResponse.json();

        // Update auth state
        googleAuthState.accessToken = accessToken;
        googleAuthState.isSignedIn = true;
        googleAuthState.userName = userInfo.name;
        googleAuthState.email = userInfo.email;

        // Save auth state
        await saveGoogleAuthState();
        updateGoogleUserDisplay();
        updateAuthStatusDisplay();

        if (log) {
          log(`Successfully authenticated as ${userInfo.name}`);
        } else {
          console.log(`[Timekeeper] Successfully authenticated as ${userInfo.name}`);
        }
      } else {
        throw new Error('Failed to fetch user info');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      if (log) {
        log('OAuth failed:', err, 'error');
      } else {
        console.error('[Timekeeper] OAuth failed:', err);
      }
      updateAuthStatusDisplay('error', errorMessage);
      return;
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
    if (log) {
      log('Failed to sign in to Google:', err, 'error');
    } else {
      console.error('[Timekeeper] Failed to sign in to Google:', err);
    }
    updateAuthStatusDisplay('error', `Failed to sign in: ${errorMessage}`);
  }
}

// Detect if we're in an OAuth popup and broadcast the token to the opener
export async function handleOAuthPopup() {
  // Check if we're in a popup with OAuth response
  if (!window.opener || window.opener === window) {
    return false; // Not a popup
  }

  if (log) log('OAuth popup: detected popup window, checking for OAuth response');
  const hash = window.location.hash;
  if (!hash || hash.length <= 1) {
    if (log) log('OAuth popup: no hash params found');
    return false; // No hash params
  }

  const hashContent = hash.startsWith('#') ? hash.substring(1) : hash;
  const params = new URLSearchParams(hashContent);
  const state = params.get('state');

  if (log) log('OAuth popup: hash params found, state=' + state);
  // Check if this is our OAuth response
  if (state !== 'timekeeper_auth') {
    if (log) log('OAuth popup: not our OAuth flow (wrong state)');
    return false; // Not our OAuth flow
  }

  const error = params.get('error');
  const token = params.get('access_token');

  const channelName = 'timekeeper_oauth';

  if (error) {
    // Broadcast error
    try {
      const channel = new BroadcastChannel(channelName);
      channel.postMessage({
        type: 'timekeeper_oauth_error',
        error: params.get('error_description') || error
      });
      channel.close();
    } catch (_) {
      // Fallback to localStorage
      localStorage.setItem('timekeeper_oauth_message', JSON.stringify({
        type: 'timekeeper_oauth_error',
        error: params.get('error_description') || error
      }));
    }

    // Close popup after a brief delay
    setTimeout(() => {
      try { window.close(); } catch (_) {}
    }, 500);
    return true;
  }

  if (token) {
    if (log) log('OAuth popup: access token found, broadcasting to opener');
    // Broadcast token
    try {
      const channel = new BroadcastChannel(channelName);
      channel.postMessage({
        type: 'timekeeper_oauth_token',
        token: token
      });
      channel.close();
      if (log) log('OAuth popup: token broadcast via BroadcastChannel');
    } catch (err) {
      if (log) log('OAuth popup: BroadcastChannel failed, using localStorage', err);
      // Fallback to localStorage
      localStorage.setItem('timekeeper_oauth_message', JSON.stringify({
        type: 'timekeeper_oauth_token',
        token: token
      }));
      if (log) log('OAuth popup: token broadcast via localStorage');
    }

    // Close popup after a brief delay
    setTimeout(() => {
      try { window.close(); } catch (_) {}
    }, 500);
    return true;
  }

  return false;
}

// OAuth redirect handler no longer needed (removed for popup-based flow)
export async function handleOAuthRedirect() {
  return false;
}
// Sign out from Google Drive
export async function signOutFromGoogle() {
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

// Ensure a folder named "Timekeeper" exists in Google Drive
async function ensureDriveFolder(accessToken: string): Promise<string> {
  const headers = { Authorization: `Bearer ${accessToken}` };
  const q = encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)&pageSize=10`;
  const searchResp = await fetch(searchUrl, { headers });
  if (searchResp.status === 401) throw new Error('unauthorized');
  if (!searchResp.ok) throw new Error('drive search failed');
  const searchJson = await searchResp.json();
  if (Array.isArray(searchJson.files) && searchJson.files.length > 0) {
    return searchJson.files[0].id;
  }

  const createResp = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Timekeeper', mimeType: 'application/vnd.google-apps.folder' })
  });
  if (createResp.status === 401) throw new Error('unauthorized');
  if (!createResp.ok) throw new Error('drive folder create failed');
  const createJson = await createResp.json();
  return createJson.id;
}

// Search for an existing file by name in a folder
async function findFileInFolder(filename: string, folderId: string, accessToken: string): Promise<string | null> {
  const query = `name='${filename}' and '${folderId}' in parents and trashed=false`;
  const encodedQuery = encodeURIComponent(query);
  const resp = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodedQuery}&fields=files(id,name)`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (resp.status === 401) throw new Error('unauthorized');
  if (!resp.ok) return null;
  const data = await resp.json();
  if (data.files && data.files.length > 0) {
    return data.files[0].id;
  }
  return null;
}

// Upload JSON content to Google Drive (creates new or updates existing)
async function uploadJsonToDrive(filename: string, json: string, folderId: string, accessToken: string): Promise<void> {
  // Check if file already exists
  const existingFileId = await findFileInFolder(filename, folderId, accessToken);

  const boundary = '-------314159265358979';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;

  // For updates, don't include parents field
  const metadata = existingFileId
    ? { name: filename, mimeType: 'application/json' }
    : { name: filename, mimeType: 'application/json', parents: [folderId] };

  const multipartBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    json +
    closeDelim;

  let url: string;
  let method: string;

  if (existingFileId) {
    // Update existing file
    url = `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=multipart&fields=id,name`;
    method = 'PATCH';
  } else {
    // Create new file
    url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name';
    method = 'POST';
  }

  const resp = await fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body: multipartBody
  });
  if (resp.status === 401) throw new Error('unauthorized');
  if (!resp.ok) throw new Error('drive upload failed');
}

// Export all timestamps to Google Drive
export async function exportAllTimestampsToGoogleDrive(opts?: { silent?: boolean }): Promise<void> {
  if (!googleAuthState.isSignedIn || !googleAuthState.accessToken) {
    if (!opts?.silent) {
      updateAuthStatusDisplay('error', 'Please sign in to Google Drive first');
    }
    return;
  }
  try {
    const { json, filename, totalVideos, totalTimestamps } = await buildExportPayload();
    const folderId = await ensureDriveFolder(googleAuthState.accessToken);
    await uploadJsonToDrive(filename, json, folderId, googleAuthState.accessToken);
    log(`Exported to Google Drive (${filename}) with ${totalVideos} videos / ${totalTimestamps} timestamps.`);
  } catch (err) {
    if ((err as Error).message === 'unauthorized') {
      if (!opts?.silent) updateAuthStatusDisplay('error', 'Authorization expired. Please sign in again.');
    } else {
      log('Drive export failed:', err, 'error');
      if (!opts?.silent) updateAuthStatusDisplay('error', 'Failed to export to Google Drive.');
    }
  }
}

// Auto-backup settings
export async function loadAutoBackupSettings() {
  try {
    const enabled = await loadGlobalSettings('autoBackupEnabled');
    const interval = await loadGlobalSettings('autoBackupIntervalMinutes');
    const lastAt = await loadGlobalSettings('lastAutoBackupAt');
    if (typeof enabled === 'boolean') autoBackupEnabled = enabled;
    if (typeof interval === 'number' && interval > 0) autoBackupIntervalMinutes = interval;
    if (typeof lastAt === 'number' && lastAt > 0) lastAutoBackupAt = lastAt;
  } catch (err) {
    log('Failed to load auto backup settings:', err, 'error');
  }
}

export async function saveAutoBackupSettings() {
  try {
    await saveGlobalSettings('autoBackupEnabled', autoBackupEnabled);
    await saveGlobalSettings('autoBackupIntervalMinutes', autoBackupIntervalMinutes);
    await saveGlobalSettings('lastAutoBackupAt', lastAutoBackupAt ?? 0);
  } catch (err) {
    log('Failed to save auto backup settings:', err, 'error');
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

export function formatBackupTime(ts: number): string {
  try {
    const d = new Date(ts);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return sameDay ? time : `${d.toLocaleDateString()} ${time}`;
  } catch {
    return '';
  }
}

export function updateBackupStatusDisplay() {
  if (!backupStatusDisplay) return;
  let text = '';
  if (!autoBackupEnabled) {
    text = '🔁 Backup: Off';
  } else if (isAutoBackupRunning) {
    text = '🔁 Backing up…';
  } else if (autoBackupBackoffMs && autoBackupBackoffMs > 0) {
    const mins = Math.ceil(autoBackupBackoffMs / 60000);
    text = `⚠️ Retry in ${mins}m`;
  } else if (lastAutoBackupAt) {
    text = `🗄️ Last backup: ${formatBackupTime(lastAutoBackupAt)}`;
  } else {
    text = '🗄️ Last backup: never';
  }
  backupStatusDisplay.textContent = text;
  backupStatusDisplay.style.display = text ? 'inline' : 'none';
}

export async function runAutoBackupOnce(silent = true) {
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
    log('Auto backup failed:', err, 'error');
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

export async function scheduleAutoBackup() {
  clearAutoBackupSchedule();
  if (!autoBackupEnabled) return;
  if (!googleAuthState.isSignedIn || !googleAuthState.accessToken) return;

  autoBackupIntervalId = setInterval(() => {
    runAutoBackupOnce(true);
  }, Math.max(1, autoBackupIntervalMinutes) * 60 * 1000);

  const now = Date.now();
  const intervalMs = Math.max(1, autoBackupIntervalMinutes) * 60 * 1000;
  if (!lastAutoBackupAt || now - lastAutoBackupAt >= intervalMs) {
    runAutoBackupOnce(true);
  }
  updateBackupStatusDisplay();
}

export async function toggleAutoBackup() {
  autoBackupEnabled = !autoBackupEnabled;
  await saveAutoBackupSettings();
  await scheduleAutoBackup();
  updateBackupStatusDisplay();
}

export async function setAutoBackupIntervalPrompt() {
  const input = prompt('Set Auto Backup interval (minutes):', String(autoBackupIntervalMinutes));
  if (input === null) return;
  const minutes = Math.floor(Number(input));
  if (!Number.isFinite(minutes) || minutes < 5 || minutes > 1440) {
    alert('Please enter a number between 5 and 1440 minutes.');
    return;
  }
  autoBackupIntervalMinutes = minutes;
  await saveAutoBackupSettings();
  await scheduleAutoBackup();
  updateBackupStatusDisplay();
}
