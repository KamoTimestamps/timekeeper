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
export let autoBackupIntervalMinutes = 60;
export let lastAutoBackupAt: number | null = null;
export let isAutoBackupRunning = false;
export let autoBackupRetryAttempts = 0;
export let autoBackupBackoffMs: number | null = null;

// Display elements (set from main script)
export let googleUserDisplay: any = null;
export let backupStatusDisplay: any = null;

// Helper functions to set display elements
export function setGoogleUserDisplay(el: HTMLElement | null) {
  googleUserDisplay = el;
}

export function setBackupStatusDisplay(el: HTMLElement | null) {
  backupStatusDisplay = el;
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
  if (googleAuthState.isSignedIn && googleAuthState.userName) {
    googleUserDisplay.textContent = `👤 ${googleAuthState.userName}`;
    googleUserDisplay.style.display = 'inline';
    googleUserDisplay.title = googleAuthState.email || googleAuthState.userName;
  } else {
    googleUserDisplay.style.display = 'none';
  }
}

// Check if current page load is an OAuth redirect
export async function checkOAuthRedirect() {
  const hash = window.location.hash;
  if (!hash.includes('access_token=') || !hash.includes('state=timekeeper_auth')) {
    return false;
  }

  try {
    const fragment = hash.substring(1);
    const params = new URLSearchParams(fragment);
    const accessToken = params.get('access_token');
    const state = params.get('state');

    if (accessToken && state === 'timekeeper_auth') {
      googleAuthState.accessToken = accessToken;
      googleAuthState.isSignedIn = true;

      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (userInfoResponse.ok) {
        const userInfo = await userInfoResponse.json();
        googleAuthState.userName = userInfo.name;
        googleAuthState.email = userInfo.email;
      }

      await saveGoogleAuthState();
      const returnUrl = await GM.getValue('oauth_return_url', '/watch');
      window.location.replace(returnUrl);
      return true;
    }
  } catch (err) {
    log('Failed to process OAuth redirect:', err, 'error');
  }
  return false;
}

// Sign in to Google Drive
export async function signInToGoogle() {
  if (!GOOGLE_CLIENT_ID) {
    alert('Google Client ID not configured. Please set GOOGLE_CLIENT_ID in the script.');
    return;
  }

  try {
    await GM.setValue('oauth_return_url', window.location.href);
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'token');
    authUrl.searchParams.set('scope', GOOGLE_SCOPES);
    authUrl.searchParams.set('include_granted_scopes', 'true');
    authUrl.searchParams.set('state', 'timekeeper_auth');
    window.location.href = authUrl.toString();
  } catch (err) {
    log('Failed to sign in to Google:', err, 'error');
    alert('Failed to sign in to Google Drive.');
  }
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
  alert('Signed out from Google Drive.');
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

// Upload JSON content to Google Drive
async function uploadJsonToDrive(filename: string, json: string, folderId: string, accessToken: string): Promise<void> {
  const boundary = '-------314159265358979';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;

  const metadata = {
    name: filename,
    mimeType: 'application/json',
    parents: [folderId]
  };

  const multipartBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    json +
    closeDelim;

  const resp = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name', {
    method: 'POST',
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
    if (!opts?.silent) alert('Please sign in to Google Drive in Settings first.');
    return;
  }
  try {
    const { json, filename, totalVideos, totalTimestamps } = await buildExportPayload();
    const folderId = await ensureDriveFolder(googleAuthState.accessToken);
    await uploadJsonToDrive(filename, json, folderId, googleAuthState.accessToken);
    log(`Exported to Google Drive (${filename}) with ${totalVideos} videos / ${totalTimestamps} timestamps.`);
    if (!opts?.silent) alert('Exported to Google Drive: ' + filename);
  } catch (err) {
    if ((err as Error).message === 'unauthorized') {
      if (!opts?.silent) alert('Google authorization expired. Please sign in again in Settings.');
    } else {
      log('Drive export failed:', err, 'error');
      if (!opts?.silent) alert('Failed to export to Google Drive.');
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
  if (!googleAuthState.isSignedIn || !googleAuthState.accessToken) return;
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
  alert(`Auto Backup ${autoBackupEnabled ? 'Enabled' : 'Disabled'}`);
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
  alert(`Auto Backup interval set to ${minutes} minutes.`);
  updateBackupStatusDisplay();
}
