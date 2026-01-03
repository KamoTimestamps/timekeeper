/**
 * Google Drive integration module for Timekeeper
 * Handles OAuth2 authentication, backup scheduling, and Drive uploads
 */

import { log } from './util';
import { addTooltip } from './tooltip';
import { zipSync, strToU8 } from 'fflate';

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
export let autoBackupIntervalMinutes = 30;
export let lastAutoBackupAt: number | null = null;
export let isAutoBackupRunning = false;
export let autoBackupRetryAttempts = 0;
export let autoBackupBackoffMs: number | null = null;

// Display elements (set from main script)
export let googleUserDisplay: any = null;
export let backupStatusDisplay: any = null;
export let authStatusDisplay: any = null;
export let backupStatusIndicator: any = null;

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

export function setBackupStatusIndicator(el: HTMLElement | null) {
  backupStatusIndicator = el;
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

      // If user is signed in, schedule auto-backup (skip immediate check on init)
      if (googleAuthState.isSignedIn && googleAuthState.accessToken) {
        await scheduleAutoBackup(true);
      }
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
    updateBackupStatusDisplay();
    return;
  }
  if (!googleAuthState.isSignedIn) {
    authStatusDisplay.textContent = '❌ Not signed in';
    authStatusDisplay.style.color = '#ff4d4f';
    authStatusDisplay.removeAttribute('title');
    authStatusDisplay.onmouseenter = null;
    authStatusDisplay.onmouseleave = null;
  } else {
    authStatusDisplay.textContent = `✅ Signed in`;
    authStatusDisplay.style.color = '#52c41a';
    authStatusDisplay.removeAttribute('title');

    // Change text on hover to show username
    if (googleAuthState.userName) {
      authStatusDisplay.onmouseenter = () => {
        authStatusDisplay.textContent = `✅ Signed in as ${googleAuthState.userName}`;
      };
      authStatusDisplay.onmouseleave = () => {
        authStatusDisplay.textContent = `✅ Signed in`;
      };
    } else {
      authStatusDisplay.onmouseenter = null;
      authStatusDisplay.onmouseleave = null;
    }
  }
  updateBackupStatusDisplay();
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
    let storagePollIntervalId: ReturnType<typeof setInterval> | null = null;
    let checkInterval: ReturnType<typeof setInterval> | null = null;

    const cleanup = () => {
      if (channel) {
        try { channel.close(); } catch (_) {}
        channel = null;
      }
      if (storagePollIntervalId) {
        clearInterval(storagePollIntervalId);
        storagePollIntervalId = null;
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
      if (log) log('OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback', err);
    }

    // Fallback: Poll IndexedDB for messages (works across tabs in all browsers)
    if (log) log('OAuth monitor: setting up IndexedDB polling');
    let lastCheckedTimestamp = Date.now();
    const pollIndexedDB = async () => {
      try {
        const openReq = indexedDB.open('ytls-timestamps-db', 3);
        openReq.onsuccess = () => {
          const db = openReq.result;
          const tx = db.transaction('settings', 'readonly');
          const store = tx.objectStore('settings');
          const getReq = store.get('oauth_message');
          getReq.onsuccess = () => {
            const result = getReq.result;
            if (result && result.value) {
              const data = result.value;
              if (data.timestamp && data.timestamp > lastCheckedTimestamp) {
                if (log) log('OAuth monitor: received IndexedDB message', data);
                if (data.type === 'timekeeper_oauth_token' && data.token) {
                  if (log) log('OAuth monitor: token received via IndexedDB');
                  cleanup();
                  try { popup.close(); } catch (_) {}
                  // Delete the message
                  const delTx = db.transaction('settings', 'readwrite');
                  delTx.objectStore('settings').delete('oauth_message');
                  resolve(data.token);
                } else if (data.type === 'timekeeper_oauth_error') {
                  if (log) log('OAuth monitor: error received via IndexedDB', data.error, 'error');
                  cleanup();
                  try { popup.close(); } catch (_) {}
                  // Delete the message
                  const delTx = db.transaction('settings', 'readwrite');
                  delTx.objectStore('settings').delete('oauth_message');
                  reject(new Error(data.error || 'OAuth failed'));
                }
                lastCheckedTimestamp = data.timestamp;
              }
            }
            db.close();
          };
        };
      } catch (err) {
        if (log) log('OAuth monitor: IndexedDB polling error', err, 'error');
      }
    };
    // Poll every 500ms
    storagePollIntervalId = setInterval(pollIndexedDB, 500);

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
        updateBackupStatusDisplay(); // Update backup status indicator immediately

        // Check if backup is needed and schedule auto-backup
        await scheduleAutoBackup();

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
      // Fallback to IndexedDB
      const message = {
        type: 'timekeeper_oauth_error',
        error: params.get('error_description') || error,
        timestamp: Date.now()
      };
      const openReq = indexedDB.open('ytls-timestamps-db', 3);
      openReq.onsuccess = () => {
        const db = openReq.result;
        const tx = db.transaction('settings', 'readwrite');
        tx.objectStore('settings').put({ key: 'oauth_message', value: message });
        db.close();
      };
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
      if (log) log('OAuth popup: BroadcastChannel failed, using IndexedDB', err);
      // Fallback to IndexedDB
      const message = {
        type: 'timekeeper_oauth_token',
        token: token,
        timestamp: Date.now()
      };
      const openReq = indexedDB.open('ytls-timestamps-db', 3);
      openReq.onsuccess = () => {
        const db = openReq.result;
        const tx = db.transaction('settings', 'readwrite');
        tx.objectStore('settings').put({ key: 'oauth_message', value: message });
        db.close();
      };
      if (log) log('OAuth popup: token broadcast via IndexedDB');
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
  updateBackupStatusDisplay(); // Update backup status indicator immediately
}

// Verify that the user is still signed in by making a lightweight API call
export async function verifySignedIn(): Promise<boolean> {
  if (!googleAuthState.isSignedIn || !googleAuthState.accessToken) {
    return false;
  }

  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${googleAuthState.accessToken}` }
    });

    if (response.status === 401) {
      // Token expired - sign out
      await handleAuthExpiration({ silent: true });
      return false;
    }

    return response.ok;
  } catch (err) {
    log('Failed to verify auth state:', err, 'error');
    return false;
  }
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

// Helper function to create a ZIP archive containing the JSON file
// Creates a well-formed standard ZIP format compatible with Windows, macOS, and Linux
// The ZIP file includes proper headers: local file header, central directory header, and EOCD record
function createZipFromJson(json: string, filename: string): Uint8Array {
  const jsonBytes = strToU8(json);

  // Normalize filename for ZIP standard:
  // - Use forward slashes only (not backslashes)
  // - No leading slash
  // - Preserve the .json extension
  let normalizedFilename = filename.replace(/\\/g, '/').replace(/^\/+/, '');

  // Ensure filename ends with .json
  if (!normalizedFilename.endsWith('.json')) {
    normalizedFilename += '.json';
  }

  // Create a ZIP archive with proper PKZip headers and metadata
  // fflate automatically generates:
  // - Local file header (signature 0x04034b50) with correct CRC32
  // - File data compressed with DEFLATE (method 8)
  // - Central directory file header (signature 0x02014b50)
  // - End of central directory record (signature 0x06054b50)
  //
  // IMPORTANT: Use simple options to avoid Google Drive "encrypted or multi-volume" error
  // - No encryption (bit 0 of general purpose flag = 0)
  // - Standard DEFLATE compression only (method 8)
  // - No multi-volume features
  const zipData = zipSync({
    [normalizedFilename]: [jsonBytes, {
      level: 6,           // Standard deflate compression level (method 8)
      mtime: new Date(),  // DOS timestamp for file metadata
      os: 0               // OS flag: 0 = FAT/NTFS (most compatible with Windows/Google Drive)
    }]
  });

  return zipData;
}



// Upload JSON content to Google Drive (creates new or updates existing)
async function uploadJsonToDrive(filename: string, json: string, folderId: string, accessToken: string): Promise<void> {
  // Convert JSON filename to ZIP filename
  // e.g., "timekeeper-data-20231219.json" -> "timekeeper-data-20231219.zip"
  // or "timekeeper-data.json" -> "timekeeper-data.zip"
  const zipFilename = filename.replace(/\.json$/, '.zip');

  // Check if file already exists
  const existingFileId = await findFileInFolder(zipFilename, folderId, accessToken);

  // Create a ZIP archive containing the JSON file
  // The ZIP will contain one file: the original JSON filename (e.g., "timekeeper-data.json")
  const originalSize = new TextEncoder().encode(json).length;
  const zipData = createZipFromJson(json, filename);
  const compressedSize = zipData.length;
  log(`Compressing data: ${originalSize} bytes -> ${compressedSize} bytes (${Math.round(100 - (compressedSize / originalSize * 100))}% reduction)`);

  const boundary = '-------314159265358979';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;

  // For updates, don't include parents field
  const metadata = existingFileId
    ? { name: zipFilename, mimeType: 'application/zip' }
    : { name: zipFilename, mimeType: 'application/zip', parents: [folderId] };

  // Convert Uint8Array to base64 for safe multipart upload
  // Process in chunks to avoid call stack overflow for large files
  const chunkSize = 8192;
  let binaryString = '';
  for (let i = 0; i < zipData.length; i += chunkSize) {
    const chunk = zipData.subarray(i, Math.min(i + chunkSize, zipData.length));
    binaryString += String.fromCharCode.apply(null, Array.from(chunk));
  }
  const base64Data = btoa(binaryString);

  // Create multipart request body with proper headers
  // Content-Transfer-Encoding: base64 ensures data integrity during transmission
  const multipartBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/zip\r\n' +
    'Content-Transfer-Encoding: base64\r\n\r\n' +
    base64Data +
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

// Helper function to handle auth expiration
async function handleAuthExpiration(opts?: { silent?: boolean }): Promise<void> {
  void opts;
  log('Auth expired, clearing token', null, 'warn');

  // Clear expired auth state immediately
  googleAuthState.isSignedIn = false;
  googleAuthState.accessToken = null;
  await saveGoogleAuthState();
  updateAuthStatusDisplay('error', 'Authorization expired. Please sign in again.');
  updateBackupStatusDisplay();
}

// Export all timestamps to Google Drive
export async function exportAllTimestampsToGoogleDrive(opts?: { silent?: boolean; isRetry?: boolean }): Promise<void> {
  if (!googleAuthState.isSignedIn || !googleAuthState.accessToken) {
    if (!opts?.silent) {
      updateAuthStatusDisplay('error', 'Please sign in to Google Drive first');
    }
    return;
  }
  try {
    const { json, filename, totalVideos, totalTimestamps } = await buildExportPayload();

    // Don't export if there are no entries
    if (totalTimestamps === 0) {
      if (!opts?.silent) {
        log('Skipping export: no timestamps to back up');
      }
      return;
    }

    const folderId = await ensureDriveFolder(googleAuthState.accessToken);
    await uploadJsonToDrive(filename, json, folderId, googleAuthState.accessToken);
    log(`Exported to Google Drive (${filename}) with ${totalVideos} videos / ${totalTimestamps} timestamps.`);
  } catch (err) {
    if ((err as Error).message === 'unauthorized') {
      // Auth expired - clear state without prompting user
      await handleAuthExpiration({ silent: opts?.silent });
      throw err; // Re-throw to trigger retry logic in runAutoBackupOnce
    } else {
      log('Drive export failed:', err, 'error');
      if (!opts?.silent) updateAuthStatusDisplay('error', 'Failed to export to Google Drive.');
      throw err;
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
    const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return sameDay ? time : `${d.toLocaleDateString()} ${time}`;
  } catch {
    return '';
  }
}

export function updateBackupStatusDisplay() {
  if (!backupStatusDisplay) return;
  let text = '';
  let hoverText = '';

  if (!autoBackupEnabled) {
    text = '🔁 Backup: Off';
    backupStatusDisplay.onmouseenter = null;
    backupStatusDisplay.onmouseleave = null;
  } else if (isAutoBackupRunning) {
    text = '🔁 Backing up…';
    backupStatusDisplay.onmouseenter = null;
    backupStatusDisplay.onmouseleave = null;
  } else if (autoBackupBackoffMs && autoBackupBackoffMs > 0) {
    const mins = Math.ceil(autoBackupBackoffMs / 60000);
    text = `⚠️ Retry in ${mins}m`;
    backupStatusDisplay.onmouseenter = null;
    backupStatusDisplay.onmouseleave = null;
  } else if (lastAutoBackupAt) {
    text = `🗄️ Last backup: ${formatBackupTime(lastAutoBackupAt)}`;
    const nextBackupAt = lastAutoBackupAt + (Math.max(1, autoBackupIntervalMinutes) * 60 * 1000);
    const nextBackupTime = formatBackupTime(nextBackupAt);
    hoverText = `🗄️ Next backup: ${nextBackupTime}`;

    backupStatusDisplay.onmouseenter = () => {
      backupStatusDisplay.textContent = hoverText;
    };
    backupStatusDisplay.onmouseleave = () => {
      backupStatusDisplay.textContent = text;
    };
  } else {
    text = '🗄️ Last backup: never';
    const nextBackupAt = Date.now() + (Math.max(1, autoBackupIntervalMinutes) * 60 * 1000);
    const nextBackupTime = formatBackupTime(nextBackupAt);
    hoverText = `🗄️ Next backup: ${nextBackupTime}`;

    backupStatusDisplay.onmouseenter = () => {
      backupStatusDisplay.textContent = hoverText;
    };
    backupStatusDisplay.onmouseleave = () => {
      backupStatusDisplay.textContent = text;
    };
  }

  backupStatusDisplay.textContent = text;
  backupStatusDisplay.style.display = text ? 'inline' : 'none';

  updateBackupStatusIndicator();
}

export function updateBackupStatusIndicator() {
  if (!backupStatusIndicator) return;

  let color = '';

  if (!autoBackupEnabled) {
    color = '#ff4d4f'; // Red - off
  } else if (isAutoBackupRunning) {
    color = '#4285f4'; // Blue - in progress
  } else if (autoBackupBackoffMs && autoBackupBackoffMs > 0) {
    color = '#ffa500'; // Yellow - retrying
  } else if (googleAuthState.isSignedIn && lastAutoBackupAt) {
    color = '#52c41a'; // Green - healthy
  } else if (googleAuthState.isSignedIn) {
    color = '#ffa500'; // Yellow - no backup yet
  } else {
    color = '#ff4d4f'; // Red - not signed in
  }

  backupStatusIndicator.style.backgroundColor = color;
  addTooltip(backupStatusIndicator, () => {
    // Recalculate tooltip text dynamically
    let tooltipText = '';
    if (!autoBackupEnabled) {
      tooltipText = 'Auto backup is disabled';
    } else if (isAutoBackupRunning) {
      tooltipText = 'Backup in progress';
    } else if (autoBackupBackoffMs && autoBackupBackoffMs > 0) {
      const mins = Math.ceil(autoBackupBackoffMs / 60000);
      tooltipText = `Retrying backup in ${mins}m`;
    } else if (googleAuthState.isSignedIn && lastAutoBackupAt) {
      const nextBackupAt = lastAutoBackupAt + (Math.max(1, autoBackupIntervalMinutes) * 60 * 1000);
      const nextBackupTime = formatBackupTime(nextBackupAt);
      tooltipText = `Last backup: ${formatBackupTime(lastAutoBackupAt)}\nNext backup: ${nextBackupTime}`;
    } else if (googleAuthState.isSignedIn) {
      const nextBackupAt = Date.now() + (Math.max(1, autoBackupIntervalMinutes) * 60 * 1000);
      const nextBackupTime = formatBackupTime(nextBackupAt);
      tooltipText = `No backup yet\nNext backup: ${nextBackupTime}`;
    } else {
      tooltipText = 'Not signed in to Google Drive';
    }
    return tooltipText;
  });
}

export async function runAutoBackupOnce(silent = true) {
  if (!googleAuthState.isSignedIn || !googleAuthState.accessToken) {
    if (!silent) {
      blinkAuthStatusDisplay();
    }
    return;
  }

  // If a backoff retry is scheduled, skip immediate runs to avoid retry storms and overlapping attempts
  if (autoBackupBackoffTimeoutId) {
    log('Auto backup: backoff in progress, skipping scheduled run');
    return;
  }

  if (isAutoBackupRunning) return;
  isAutoBackupRunning = true;
  updateBackupStatusDisplay();
  try {
    await exportAllTimestampsToGoogleDrive({ silent });
    // Only update last backup time if the backup succeeded
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

    // Check if this is an auth error - don't retry unauthorized requests
    const isAuthError = (err as Error).message === 'unauthorized';

    if (isAuthError) {
      // Auth error - clear token immediately and don't retry
      log('Auth error detected, clearing token and stopping retries', null, 'warn');
      googleAuthState.isSignedIn = false;
      googleAuthState.accessToken = null;
      await saveGoogleAuthState();
      updateAuthStatusDisplay('error', 'Authorization expired. Please sign in again.');
      updateBackupStatusDisplay(); // Update backup status indicator immediately
      // Reset retry state
      autoBackupRetryAttempts = 0;
      autoBackupBackoffMs = null;
      if (autoBackupBackoffTimeoutId) {
        clearTimeout(autoBackupBackoffTimeoutId);
        autoBackupBackoffTimeoutId = null;
      }
    } else if (autoBackupRetryAttempts < AUTO_BACKUP_MAX_RETRY_ATTEMPTS) {
      // Non-auth error - retry with exponential backoff
      autoBackupRetryAttempts += 1;
      const base = AUTO_BACKUP_INITIAL_BACKOFF_MS;
      const next = Math.min(base * Math.pow(2, autoBackupRetryAttempts - 1), AUTO_BACKUP_MAX_BACKOFF_MS);
      autoBackupBackoffMs = next;
      if (autoBackupBackoffTimeoutId) clearTimeout(autoBackupBackoffTimeoutId);
      autoBackupBackoffTimeoutId = setTimeout(() => {
        runAutoBackupOnce(true);
      }, next);
      log(`Scheduling backup retry ${autoBackupRetryAttempts}/${AUTO_BACKUP_MAX_RETRY_ATTEMPTS} in ${Math.round(next/1000)}s`);
      updateBackupStatusDisplay(); // Update backup status indicator to show retry state
    } else {
      // All retries exhausted for non-auth errors
      autoBackupBackoffMs = null;
    }
  } finally {
    isAutoBackupRunning = false;
    updateBackupStatusDisplay();
  }
}

export async function scheduleAutoBackup(skipImmediateCheck = false) {
  clearAutoBackupSchedule();
  if (!autoBackupEnabled) return;
  if (!googleAuthState.isSignedIn || !googleAuthState.accessToken) return;

  autoBackupIntervalId = setInterval(() => {
    runAutoBackupOnce(true);
  }, Math.max(1, autoBackupIntervalMinutes) * 60 * 1000);

  // Only run immediate backup if not skipped and interval has elapsed
  if (!skipImmediateCheck) {
    const now = Date.now();
    const intervalMs = Math.max(1, autoBackupIntervalMinutes) * 60 * 1000;
    if (!lastAutoBackupAt || now - lastAutoBackupAt >= intervalMs) {
      runAutoBackupOnce(true);
    }
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
