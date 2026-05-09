/**
 * Google Drive integration module for Timekeeper
 * Handles OAuth2 authentication, backup scheduling, and Drive uploads
 */

import { log } from './util';
import { addTooltip } from './tooltip';
import { BackupSettingsSchema, GoogleAuthStateSchema, GoogleAuthStateParsed } from './schema';
import { createIcon, setIcon, setIconLabel } from './icons';
import { showToast } from './toast';
import { showTextInputModal } from './modals';
import {
  getTimekeeperBackendHostNormalized,
  getTimekeeperBackendBearerTokenNormalized,
  getTimekeeperBackendBaseUrl,
  hasGoogleDriveBackupDestination,
  hasTimekeeperBackendBackupConfiguration,
  hasTimekeeperBackendBackupDestination,
  hasAnyBackupDestination,
  getConfiguredDestinationLabels,
  fetchWithTimeout,
  sendUserscriptRequest,
  decodeFirstZipEntry,
  createZipFromJson,
  ensureDriveFolder,
  findFileInFolder,
  fetchLatestDriveBackup,
  fetchLatestBackendBackup,
  uploadJsonToDrive,
  uploadJsonToTimekeeperBackend,
} from './google-drive-upload';
import { GOOGLE_CLIENT_ID, GOOGLE_SCOPES, GOOGLE_REDIRECT_URI } from './google-oauth-constants';
import * as AppState from './services/state';

// Types
export interface ExportPayload {
  json: string;
  filename: string;
  totalVideos: number;
  totalTimestamps: number;
}

// ============================================================================
// State Management - Using Centralized AppState
// ============================================================================
// These getters/setters provide backward compatibility while routing through
// the centralized state management in services/state.ts

export function getGoogleAuthState() {
  return AppState.getGoogleAuthState();
}

// For backwards compatibility, export as a getter object
export const googleAuthState: GoogleAuthStateParsed = {
  get isSignedIn() { return AppState.getGoogleAuthState().isSignedIn; },
  get accessToken() { return AppState.getGoogleAuthState().accessToken; },
  get userName() { return AppState.getGoogleAuthState().userName; },
  get email() { return AppState.getGoogleAuthState().email; },
  set isSignedIn(value: boolean) {
    const current = AppState.getGoogleAuthState();
    AppState.setGoogleAuthState({ ...current, isSignedIn: value });
  },
  set accessToken(value: string | null) {
    const current = AppState.getGoogleAuthState();
    AppState.setGoogleAuthState({ ...current, accessToken: value });
  },
  set userName(value: string | null) {
    const current = AppState.getGoogleAuthState();
    AppState.setGoogleAuthState({ ...current, userName: value });
  },
  set email(value: string | null) {
    const current = AppState.getGoogleAuthState();
    AppState.setGoogleAuthState({ ...current, email: value });
  },
};

export function getAutoBackupEnabled() {
  return AppState.getState().auth.autoBackupEnabled;
}

export function getAutoBackupIntervalMinutes() {
  return AppState.getState().auth.autoBackupIntervalMinutes;
}

export function getTimekeeperBackendBackupEnabled() {
  return AppState.getState().auth.timekeeperBackendBackupEnabled;
}

export function getTimekeeperBackendHost() {
  return AppState.getState().auth.timekeeperBackendHost;
}

export function getTimekeeperBackendPort() {
  return AppState.getState().auth.timekeeperBackendPort;
}

export function getTimekeeperBackendBearerToken() {
  return AppState.getState().auth.timekeeperBackendBearerToken;
}

// Display elements (set from main script)
export let googleUserDisplay: HTMLElement | null = null;
export let backupStatusDisplay: HTMLElement | null = null;
export let authStatusDisplay: HTMLElement | null = null;
export let backupStatusIndicator: HTMLElement | null = null;

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
  } catch (err) { log('Failed to inject auth spinner styles', err, 'debug'); }
}

// Callbacks (set from main script)
export let buildExportPayload: ((opts: { includeDeleted: boolean }) => Promise<ExportPayload>) | null = null;
export let mergeBackupData: ((json: string) => Promise<{ mergedVideos: number; mergedTimestamps: number }>) | null = null;
export let saveGlobalSettings: ((key: string, value: unknown) => Promise<void>) | null = null;
export let loadGlobalSettings: ((key: string) => Promise<unknown>) | null = null;
export let reloadCurrentVideoTimestamps: (() => void) | null = null;

// Helper functions to set callbacks
export function setBuildExportPayload(fn: (opts: { includeDeleted: boolean }) => Promise<ExportPayload>) {
  buildExportPayload = fn;
}

export function setMergeBackupData(fn: (json: string) => Promise<{ mergedVideos: number; mergedTimestamps: number }>) {
  mergeBackupData = fn;
}

export function setSaveGlobalSettings(fn: (key: string, value: unknown) => Promise<void>) {
  saveGlobalSettings = fn;
}

export function setLoadGlobalSettings(fn: (key: string) => Promise<unknown>) {
  loadGlobalSettings = fn;
}

export function setReloadCurrentVideoTimestamps(fn: () => void) {
  reloadCurrentVideoTimestamps = fn;
}

// Re-export OAuth constants from shared module
export { GOOGLE_CLIENT_ID, GOOGLE_SCOPES, GOOGLE_REDIRECT_URI } from './google-oauth-constants';

// Auto-backup constants
const AUTO_BACKUP_INITIAL_BACKOFF_MS = 30 * 1000; // 30s
const AUTO_BACKUP_MAX_BACKOFF_MS = 30 * 60 * 1000; // 30m
const AUTO_BACKUP_MAX_RETRY_ATTEMPTS = 5;
let autoBackupIntervalId: ReturnType<typeof setInterval> | null = null;
let autoBackupBackoffTimeoutId: ReturnType<typeof setTimeout> | null = null;

type BackupDestinationErrorKind = 'auth' | 'other';

interface BackupDestination {
  type: 'google' | 'timekeeper-backend';
  label: string;
  exportPayload: (payload: ExportPayload) => Promise<void>;
}

interface RunAutoBackupOptions {
  silent?: boolean;
  skipBackoff?: boolean;
}

// Load Google auth state from storage
export async function loadGoogleAuthState() {
  try {
    const stored = await loadGlobalSettings('googleAuthState');
    const storedRedacted = stored && typeof stored === 'object' ? { ...stored, accessToken: stored.accessToken ? '[REDACTED]' : null } : stored;
    log('Loading Google auth state from IndexedDB:', storedRedacted);
    const parsed = GoogleAuthStateSchema.safeParse(stored);
    if (parsed.success) {
      const currentState = getGoogleAuthState();
      AppState.setGoogleAuthState({ ...currentState, ...parsed.data });

      // Log when reusing stored auth token
      const updatedState = getGoogleAuthState();
      if (updatedState.isSignedIn && updatedState.accessToken) {
        log(`Reusing stored Google auth token for ${updatedState.userName || updatedState.email || 'user'}`);
      }

      updateGoogleUserDisplay();

      // If user is signed in, schedule auto-backup (skip immediate check on init)
      const state = getGoogleAuthState();
      if (state.isSignedIn && state.accessToken) {
        await scheduleAutoBackup(true);
      }
    } else if (stored !== undefined) {
      const storedRedacted = stored && typeof stored === 'object' ? { ...stored, accessToken: stored.accessToken ? '[REDACTED]' : null } : stored;
      log('Google auth state failed validation:', { stored: storedRedacted, errors: parsed.error.format() }, 'warn');
    }
  } catch (err) {
    log('Failed to load Google auth state:', err, 'error');
  }
}

// Save Google auth state to storage
export async function saveGoogleAuthState() {
  try {
    // Validate state before saving
    const currentAuthState = getGoogleAuthState();
    const validationResult = GoogleAuthStateSchema.safeParse(currentAuthState);
    if (!validationResult.success) {
      const stateRedacted = { ...currentAuthState, accessToken: currentAuthState.accessToken ? '[REDACTED]' : null };
      log('Invalid auth state, cannot save', { state: stateRedacted, errors: validationResult.error.format() }, 'error');
      return;
    }

    await saveGlobalSettings('googleAuthState', currentAuthState);
    if (currentAuthState.isSignedIn && currentAuthState.accessToken) {
      log(`Saved Google auth state to IndexedDB for ${currentAuthState.userName || currentAuthState.email || 'user'}`);
    } else {
      log('Cleared Google auth state in IndexedDB (signed out)');
    }
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
    authStatusDisplay.replaceChildren();
    const spinner = document.createElement('span');
    spinner.className = 'tk-auth-spinner';
    const text = document.createTextNode(` ${message || 'Authorizing with Google…'}`);
    authStatusDisplay.appendChild(spinner);
    authStatusDisplay.appendChild(text);
    return;
  }
  if (status === 'error') {
    setIconLabel(authStatusDisplay, 'circle-x', message || 'Authorization failed');
    authStatusDisplay.style.color = '#ff4d4f';
    updateBackupStatusDisplay();
    return;
  }
  const state = getGoogleAuthState();
  if (!state.isSignedIn) {
    setIconLabel(authStatusDisplay, 'circle-x', 'Not signed in');
    authStatusDisplay.style.color = '#ff4d4f';
    authStatusDisplay.removeAttribute('title');
    authStatusDisplay.onmouseenter = null;
    authStatusDisplay.onmouseleave = null;
  } else {
    setIconLabel(authStatusDisplay, 'circle-check', 'Signed in');
    authStatusDisplay.style.color = '#52c41a';
    authStatusDisplay.removeAttribute('title');

    // Change text on hover to show username
    if (state.userName) {
      authStatusDisplay.onmouseenter = () => {
        setIconLabel(authStatusDisplay, 'circle-check', `Signed in as ${state.userName}`);
      };
      authStatusDisplay.onmouseleave = () => {
        setIconLabel(authStatusDisplay, 'circle-check', 'Signed in');
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

// Re-export OAuth functions from google-oauth.ts
export { signInToGoogle, signOutFromGoogle, handleOAuthPopup } from './google-oauth';
import { handleAuthExpiration } from './google-oauth';

// Verify that the user is still signed in by making a lightweight API call
export async function verifySignedIn(): Promise<boolean> {
  const authState = getGoogleAuthState();
  if (!authState.isSignedIn || !authState.accessToken) {
    return false;
  }

  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${authState.accessToken}` }
    });

    if (response.status === 401) {
      // Token expired - sign out
      await handleAuthExpiration({ silent: true });
      await scheduleAutoBackup();
      return false;
    }

    return response.ok;
  } catch (err) {
    log('Failed to verify auth state:', err, 'error');
    return false;
  }
}

// Fetch and merge the latest remote backup from all configured destinations before uploading.
// Errors during fetch/merge are logged but never block the backup.
async function mergeFromAllRemotesBeforeBackup(): Promise<void> {
  if (!mergeBackupData) return;

  const fetches: Array<Promise<string | null>> = [];

  if (hasGoogleDriveBackupDestination()) {
    const authState = getGoogleAuthState();
    if (authState.isSignedIn && authState.accessToken) {
      const token = authState.accessToken;
      fetches.push(
        fetchLatestDriveBackup(token).catch(async (err: Error) => {
          if (err.message === 'unauthorized') {
            await handleAuthExpiration({ silent: true });
            await scheduleAutoBackup();
           }
          return null;
        })
      );
    }
  }

  if (hasTimekeeperBackendBackupDestination()) {
    fetches.push(
      fetchLatestBackendBackup().catch((err: Error) => {
        if (err.message === 'unauthorized') {
          log('Backend backup: unauthorized during pre-merge fetch', null, 'warn');
        }
        return null;
      })
    );
  }

  const jsons = await Promise.all(fetches);

  let totalMergedTimestamps = 0;
  for (const json of jsons) {
    if (!json) continue;
    try {
      const { mergedVideos, mergedTimestamps } = await mergeBackupData(json);
      if (mergedTimestamps > 0) {
        log(`Pre-backup merge: added ${mergedTimestamps} timestamps from ${mergedVideos} videos from remote`);
        totalMergedTimestamps += mergedTimestamps;
      }
    } catch (err) {
      log('Failed to merge remote backup data:', err, 'warn');
    }
  }

  if (totalMergedTimestamps > 0 && reloadCurrentVideoTimestamps) {
    reloadCurrentVideoTimestamps();
  }
}
// Export all timestamps to Google Drive
export async function exportAllTimestampsToGoogleDrive(opts?: { silent?: boolean; isRetry?: boolean }): Promise<void> {
  void opts;

  const authState = getGoogleAuthState();
  if (!authState.isSignedIn || !authState.accessToken) {
    throw new Error('unauthorized');
  }

  await mergeFromAllRemotesBeforeBackup();

  const payload = await buildExportPayload({ includeDeleted: true });
  if (payload.totalTimestamps === 0) {
    return;
  }

  const folderId = await ensureDriveFolder(authState.accessToken);
  await uploadJsonToDrive(payload.filename, payload.json, folderId, authState.accessToken);
  log(`Exported to Google Drive (${payload.filename}) with ${payload.totalVideos} videos / ${payload.totalTimestamps} timestamps.`);
}

async function exportAllTimestampsToConfiguredDestinations(opts?: { silent?: boolean }): Promise<void> {
  const destinations: BackupDestination[] = [];

  if (hasGoogleDriveBackupDestination()) {
    destinations.push({
      type: 'google',
      label: 'Google Drive',
      exportPayload: async (payload) => {
        const authState = getGoogleAuthState();
        if (!authState.accessToken) {
          throw new Error('unauthorized');
        }
        const folderId = await ensureDriveFolder(authState.accessToken);
        await uploadJsonToDrive(payload.filename, payload.json, folderId, authState.accessToken);
      },
    });
  }

  if (hasTimekeeperBackendBackupDestination()) {
    destinations.push({
      type: 'timekeeper-backend',
      label: 'Timekeeper backend',
      exportPayload: async (payload) => {
        await uploadJsonToTimekeeperBackend(payload.filename, payload.json);
      },
    });
  }

  if (destinations.length === 0) {
    if (!opts?.silent) {
      updateAuthStatusDisplay('error', 'Configure a backup destination first');
    }
    throw new Error('no-backup-destination');
  }

  await mergeFromAllRemotesBeforeBackup();

  const payload = await buildExportPayload({ includeDeleted: true });
  if (payload.totalTimestamps === 0) {
    if (!opts?.silent) {
      log('Skipping export: no timestamps to back up');
    }
    return;
  }

  const failures: Array<{ label: string; kind: BackupDestinationErrorKind; error: unknown }> = [];
  const successes: string[] = [];

  const results = await Promise.allSettled(
    destinations.map(destination => destination.exportPayload(payload))
  );

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const destination = destinations[i];
    if (result.status === 'fulfilled') {
      log(`Exported backup to ${destination.label} (${payload.filename}) with ${payload.totalVideos} videos / ${payload.totalTimestamps} timestamps.`);
      successes.push(destination.label);
    } else {
      const error = result.reason as Error;
      const kind: BackupDestinationErrorKind = error.message === 'unauthorized' ? 'auth' : 'other';
      failures.push({ label: destination.label, kind, error: result.reason });

      if (destination.type === 'google' && kind === 'auth') {
        await handleAuthExpiration({ silent: opts?.silent });
        await scheduleAutoBackup();
      } else {
        log(`${destination.label} export failed:`, result.reason, 'error');
      }
    }
  }

  if (successes.length > 0) {
    if (failures.length > 0) {
      log(`Backup partially succeeded. Successful destinations: ${successes.join(', ')}. Failed destinations: ${failures.map(failure => failure.label).join(', ')}`, null, 'warn');
    }
    return;
  }

  if (failures.every(failure => failure.kind === 'auth')) {
    throw new Error('unauthorized');
  }

  throw new Error('backup failed');
}

// Auto-backup settings
export async function loadAutoBackupSettings() {
  try {
    const [
      storedLastAutoBackupAt,
      autoBackupEnabled,
      autoBackupIntervalMinutes,
      timekeeperBackendBackupEnabled,
      timekeeperBackendHost,
      timekeeperBackendPort,
      timekeeperBackendBearerToken,
    ] = await Promise.all([
      loadGlobalSettings('lastAutoBackupAt'),
      loadGlobalSettings('autoBackupEnabled'),
      loadGlobalSettings('autoBackupIntervalMinutes'),
      loadGlobalSettings('timekeeperBackendBackupEnabled'),
      loadGlobalSettings('timekeeperBackendHost'),
      loadGlobalSettings('timekeeperBackendPort'),
      loadGlobalSettings('timekeeperBackendBearerToken'),
    ]);
    const parsed = BackupSettingsSchema.partial().safeParse({
      autoBackupEnabled,
      autoBackupIntervalMinutes,
      lastAutoBackupAt: typeof storedLastAutoBackupAt === 'number' && storedLastAutoBackupAt > 0 ? storedLastAutoBackupAt : null,
      timekeeperBackendBackupEnabled,
      timekeeperBackendHost,
      timekeeperBackendPort,
      timekeeperBackendBearerToken,
    });

    if (parsed.success) {
      if (typeof parsed.data.autoBackupEnabled === 'boolean') AppState.setAutoBackupEnabled(parsed.data.autoBackupEnabled);
      if (typeof parsed.data.autoBackupIntervalMinutes === 'number') AppState.setAutoBackupIntervalMinutes(parsed.data.autoBackupIntervalMinutes);
      if (typeof parsed.data.lastAutoBackupAt === 'number') AppState.setLastAutoBackupAt(parsed.data.lastAutoBackupAt);
      if (typeof parsed.data.timekeeperBackendBackupEnabled === 'boolean') AppState.setTimekeeperBackendBackupEnabled(parsed.data.timekeeperBackendBackupEnabled);
      if (typeof parsed.data.timekeeperBackendHost === 'string') AppState.setTimekeeperBackendHost(parsed.data.timekeeperBackendHost);
      if (typeof parsed.data.timekeeperBackendPort === 'number') AppState.setTimekeeperBackendPort(parsed.data.timekeeperBackendPort);
      if (typeof parsed.data.timekeeperBackendBearerToken === 'string' || parsed.data.timekeeperBackendBearerToken === null) {
        AppState.setTimekeeperBackendBearerToken(parsed.data.timekeeperBackendBearerToken);
      }
    } else {
      log('Failed to validate auto backup settings:', parsed.error.format(), 'warn');
    }
  } catch (err) {
    log('Failed to load auto backup settings:', err, 'error');
  }
}

export async function saveAutoBackupSettings() {
  try {
    // Validate settings before saving
    const auth = AppState.getState().auth;
    const settings = {
      autoBackupEnabled: auth.autoBackupEnabled,
      autoBackupIntervalMinutes: auth.autoBackupIntervalMinutes,
      lastAutoBackupAt: auth.lastAutoBackupAt,
      timekeeperBackendBackupEnabled: auth.timekeeperBackendBackupEnabled,
      timekeeperBackendHost: getTimekeeperBackendHostNormalized(),
      timekeeperBackendPort: auth.timekeeperBackendPort,
      timekeeperBackendBearerToken: getTimekeeperBackendBearerTokenNormalized(),
    };

    const validationResult = BackupSettingsSchema.safeParse(settings);
    if (!validationResult.success) {
      log('Invalid auto backup settings, cannot save', { settings, errors: validationResult.error.format() }, 'error');
      return;
    }

    await Promise.all([
      saveGlobalSettings('autoBackupEnabled', auth.autoBackupEnabled),
      saveGlobalSettings('autoBackupIntervalMinutes', auth.autoBackupIntervalMinutes),
      saveGlobalSettings('lastAutoBackupAt', auth.lastAutoBackupAt),
      saveGlobalSettings('timekeeperBackendBackupEnabled', auth.timekeeperBackendBackupEnabled),
      saveGlobalSettings('timekeeperBackendHost', getTimekeeperBackendHostNormalized()),
      saveGlobalSettings('timekeeperBackendPort', auth.timekeeperBackendPort),
      saveGlobalSettings('timekeeperBackendBearerToken', getTimekeeperBackendBearerTokenNormalized()),
    ]);
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

function getDestinationSummaryText(): string {
  const configured = getConfiguredDestinationLabels();
  if (configured.length > 0) {
    return `Destinations: ${configured.join(', ')}`;
  }

  if (getTimekeeperBackendBackupEnabled() && !hasTimekeeperBackendBackupConfiguration()) {
    return 'Timekeeper backend is enabled but incomplete';
  }

  return 'No backup destination configured';
}

function getBackupStatusColor(): string {
  const auth = AppState.getState().auth;
  // Determine color consistent with updateBackupStatusIndicator logic
  if (!auth.autoBackupEnabled) {
    return '#ff4d4f'; // Red - off
  } else if (auth.isAutoBackupRunning) {
    return '#4285f4'; // Blue - in progress
  } else if (auth.autoBackupBackoffMs && auth.autoBackupBackoffMs > 0) {
    return '#ffa500'; // Yellow - retrying
  } else if (hasAnyBackupDestination() && auth.lastAutoBackupAt) {
    return '#52c41a'; // Green - healthy
  } else if (hasAnyBackupDestination()) {
    return '#ffa500'; // Yellow - no backup yet
  } else {
    return '#ff4d4f'; // Red - not signed in
  }
}

export function updateBackupStatusDisplay() {
  // Always keep the header indicator in sync, even when the settings panel is closed
  updateBackupStatusIndicator();

  if (!backupStatusDisplay) return;

  const auth = AppState.getState().auth;

  if (!auth.autoBackupEnabled) {
    setIconLabel(backupStatusDisplay, 'refresh', 'Backup: Off');
    backupStatusDisplay.onmouseenter = null;
    backupStatusDisplay.onmouseleave = null;
  } else if (auth.isAutoBackupRunning) {
    setIconLabel(backupStatusDisplay, 'refresh', 'Backing up…');
    backupStatusDisplay.onmouseenter = null;
    backupStatusDisplay.onmouseleave = null;
  } else if (auth.autoBackupBackoffMs && auth.autoBackupBackoffMs > 0) {
    const mins = Math.ceil(auth.autoBackupBackoffMs / 60000);
    setIconLabel(backupStatusDisplay, 'alert-triangle', `Retry in ${mins}m`);
    backupStatusDisplay.onmouseenter = null;
    backupStatusDisplay.onmouseleave = null;
  } else if (!hasAnyBackupDestination()) {
    setIconLabel(backupStatusDisplay, 'alert-triangle', 'Backup target missing');
    backupStatusDisplay.onmouseenter = null;
    backupStatusDisplay.onmouseleave = null;
  } else if (auth.lastAutoBackupAt) {
    const lastAt = auth.lastAutoBackupAt;
    const nextBackupAt = lastAt + (Math.max(1, getAutoBackupIntervalMinutes()) * 60 * 1000);
    const nextBackupTime = formatBackupTime(nextBackupAt);

    backupStatusDisplay.onmouseenter = () => {
      setIconLabel(backupStatusDisplay, 'database', `Next backup: ${nextBackupTime}`);
    };
    backupStatusDisplay.onmouseleave = () => {
      setIconLabel(backupStatusDisplay, 'database', `Last backup: ${formatBackupTime(lastAt)}`);
    };
    setIconLabel(backupStatusDisplay, 'database', `Last backup: ${formatBackupTime(lastAt)}`);
  } else {
    const nextBackupAt = Date.now() + (Math.max(1, getAutoBackupIntervalMinutes()) * 60 * 1000);
    const nextBackupTime = formatBackupTime(nextBackupAt);

    backupStatusDisplay.onmouseenter = () => {
      setIconLabel(backupStatusDisplay, 'database', `Next backup: ${nextBackupTime}`);
    };
    backupStatusDisplay.onmouseleave = () => {
      setIconLabel(backupStatusDisplay, 'database', 'Last backup: never');
    };
    setIconLabel(backupStatusDisplay, 'database', 'Last backup: never');
  }

  backupStatusDisplay.style.display = 'inline';

  // Apply matching color to settings display so it matches main UI indicator
  const color = getBackupStatusColor();
  backupStatusDisplay.style.color = color;
}

const PULSING_CLASS = 'ytls-backup-indicator--pulsing';
const BLUE_COLOR = '#4285f4';
let pendingColorChange: (() => void) | null = null;

function applyIndicatorColor(el: HTMLElement, color: string) {
  // Cancel any previously scheduled deferred color change
  if (pendingColorChange) {
    el.removeEventListener('animationiteration', pendingColorChange);
    pendingColorChange = null;
  }

  if (color === BLUE_COLOR) {
    el.style.backgroundColor = color;
    el.classList.add(PULSING_CLASS);
  } else if (el.classList.contains(PULSING_CLASS)) {
    // Let the current pulse cycle finish before switching color
    pendingColorChange = () => {
      if (!backupStatusIndicator) return;
      backupStatusIndicator.classList.remove(PULSING_CLASS);
      backupStatusIndicator.style.backgroundColor = color;
      pendingColorChange = null;
    };
    el.addEventListener('animationiteration', pendingColorChange, { once: true });
  } else {
    el.style.backgroundColor = color;
  }
}

export function updateBackupStatusIndicator() {
  if (!backupStatusIndicator) return;

  const color = getBackupStatusColor();

  applyIndicatorColor(backupStatusIndicator, color);
  addTooltip(backupStatusIndicator, () => {
    // Recalculate tooltip text dynamically
    const auth = AppState.getState().auth;
    let tooltipText = '';
    if (!auth.autoBackupEnabled) {
      tooltipText = 'Auto backup is disabled';
    } else if (auth.isAutoBackupRunning) {
      tooltipText = 'Backup in progress';
    } else if (auth.autoBackupBackoffMs && auth.autoBackupBackoffMs > 0) {
      const mins = Math.ceil(auth.autoBackupBackoffMs / 60000);
      tooltipText = `Retrying backup in ${mins}m`;
    } else if (!hasAnyBackupDestination()) {
      tooltipText = getDestinationSummaryText();
    } else if (auth.lastAutoBackupAt) {
      const nextBackupAt = auth.lastAutoBackupAt + (Math.max(1, getAutoBackupIntervalMinutes()) * 60 * 1000);
      const nextBackupTime = formatBackupTime(nextBackupAt);
      tooltipText = `Last backup: ${formatBackupTime(auth.lastAutoBackupAt)}\nNext backup: ${nextBackupTime}\n${getDestinationSummaryText()}`;
    } else {
      const nextBackupAt = Date.now() + (Math.max(1, getAutoBackupIntervalMinutes()) * 60 * 1000);
      const nextBackupTime = formatBackupTime(nextBackupAt);
      tooltipText = `No backup yet\nNext backup: ${nextBackupTime}\n${getDestinationSummaryText()}`;
    }
    return tooltipText;
  });
}

export async function runAutoBackupOnce(options: RunAutoBackupOptions = {}) {
  const { silent = true, skipBackoff = false } = options;

  if (!hasAnyBackupDestination()) {
    if (!silent) {
      updateBackupStatusDisplay();
      if (!hasGoogleDriveBackupDestination()) {
        blinkAuthStatusDisplay();
      }
    }
    return;
  }

  // Scheduled runs should respect backoff; manual runs may explicitly clear it.
  if (autoBackupBackoffTimeoutId) {
    if (!skipBackoff) {
      log('Auto backup: backoff in progress, skipping scheduled run');
      return;
    }

    clearTimeout(autoBackupBackoffTimeoutId);
    autoBackupBackoffTimeoutId = null;
    AppState.setAutoBackupBackoffMs(null);
    log('Auto backup: manual run cleared backoff and will proceed immediately');
  }

  if (AppState.getState().auth.isAutoBackupRunning) return;
  AppState.setAutoBackupRunning(true);
  updateBackupStatusDisplay();
  try {
    await exportAllTimestampsToConfiguredDestinations({ silent });
    // Only update last backup time if the backup succeeded
    AppState.setLastAutoBackupAt(Date.now());
    AppState.setAutoBackupRetryAttempts(0);
    AppState.setAutoBackupBackoffMs(null);
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
      const currentAuth = getGoogleAuthState();
      AppState.setGoogleAuthState({ ...currentAuth, accessToken: null, isSignedIn: false });
      await saveGoogleAuthState();
      updateAuthStatusDisplay('error', 'Authorization expired. Please sign in again.');
      updateBackupStatusDisplay();
      // Reset retry state
      AppState.setAutoBackupRetryAttempts(0);
      AppState.setAutoBackupBackoffMs(null);
      if (autoBackupBackoffTimeoutId) {
        clearTimeout(autoBackupBackoffTimeoutId);
        autoBackupBackoffTimeoutId = null;
      }
    } else if (AppState.getState().auth.autoBackupRetryAttempts < AUTO_BACKUP_MAX_RETRY_ATTEMPTS) {
      // Non-auth error - retry with exponential backoff
      const nextAttempts = AppState.getState().auth.autoBackupRetryAttempts + 1;
      AppState.setAutoBackupRetryAttempts(nextAttempts);
      const base = AUTO_BACKUP_INITIAL_BACKOFF_MS;
      const next = Math.min(base * Math.pow(2, nextAttempts - 1), AUTO_BACKUP_MAX_BACKOFF_MS);
      AppState.setAutoBackupBackoffMs(next);
      if (autoBackupBackoffTimeoutId) clearTimeout(autoBackupBackoffTimeoutId);
      autoBackupBackoffTimeoutId = setTimeout(() => {
        runAutoBackupOnce({ silent: true });
      }, next);
      log(`Scheduling backup retry ${nextAttempts}/${AUTO_BACKUP_MAX_RETRY_ATTEMPTS} in ${Math.round(next/1000)}s`);
      updateBackupStatusDisplay(); // Update backup status indicator to show retry state
    } else {
      // All retries exhausted for non-auth errors
      AppState.setAutoBackupBackoffMs(null);
    }
  } finally {
    AppState.setAutoBackupRunning(false);
    updateBackupStatusDisplay();
  }
}

export async function scheduleAutoBackup(skipImmediateCheck = false) {
  clearAutoBackupSchedule();
  if (!getAutoBackupEnabled()) return;
  if (!hasAnyBackupDestination()) return;

  autoBackupIntervalId = setInterval(() => {
    runAutoBackupOnce({ silent: true });
  }, Math.max(1, getAutoBackupIntervalMinutes()) * 60 * 1000);

  // Only run immediate backup if not skipped and interval has elapsed
  if (!skipImmediateCheck) {
    const now = Date.now();
    const intervalMs = Math.max(1, getAutoBackupIntervalMinutes()) * 60 * 1000;
    const last = AppState.getState().auth.lastAutoBackupAt;
    if (!last || now - last >= intervalMs) {
      runAutoBackupOnce({ silent: true });
    }
  }
  updateBackupStatusDisplay();
}

export async function toggleAutoBackup() {
  const current = getAutoBackupEnabled();
  AppState.setAutoBackupEnabled(!current);
  await saveAutoBackupSettings();
  await scheduleAutoBackup();
  updateBackupStatusDisplay();
}

export async function setAutoBackupIntervalPrompt() {
  const currentInterval = getAutoBackupIntervalMinutes();
  const input = await showTextInputModal('Set Auto Backup interval (minutes):', String(currentInterval));
  if (input === null) return;
  const minutes = Math.floor(Number(input));
  if (!Number.isFinite(minutes) || minutes < 5 || minutes > 1440) {
    showToast('Please enter a number between 5 and 1440 minutes.', 'warn');
    return;
  }
  AppState.setAutoBackupIntervalMinutes(minutes);
  await saveAutoBackupSettings();
  await scheduleAutoBackup();
  updateBackupStatusDisplay();
}

export async function toggleTimekeeperBackendBackup() {
  AppState.setTimekeeperBackendBackupEnabled(!getTimekeeperBackendBackupEnabled());
  await saveAutoBackupSettings();
  await scheduleAutoBackup();
  updateBackupStatusDisplay();
}

export async function setTimekeeperBackendHostPrompt() {
  const input = await showTextInputModal('Set the Timekeeper backend host:', getTimekeeperBackendHostNormalized());
  if (input === null) return;

  const host = input.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');
  if (!host) {
    showToast('Please enter a host name or IP address.', 'warn');
    return;
  }

  AppState.setTimekeeperBackendHost(host);
  await saveAutoBackupSettings();
  await scheduleAutoBackup();
  updateBackupStatusDisplay();
}

export async function setTimekeeperBackendPortPrompt() {
  const input = await showTextInputModal('Set the Timekeeper backend port:', String(getTimekeeperBackendPort()));
  if (input === null) return;

  const port = Number.parseInt(input.trim(), 10);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    showToast('Please enter a valid port between 1 and 65535.', 'warn');
    return;
  }

  AppState.setTimekeeperBackendPort(port);
  await saveAutoBackupSettings();
  await scheduleAutoBackup();
  updateBackupStatusDisplay();
}

export async function setTimekeeperBackendBearerTokenPrompt() {
  const currentToken = getTimekeeperBackendBearerTokenNormalized();
  const promptMessage = currentToken
    ? 'Set the Timekeeper backend bearer token (leave blank to clear it):'
    : 'Set the Timekeeper backend bearer token:';
  const input = await showTextInputModal(promptMessage, currentToken ?? '');
  if (input === null) return;

  const token = input.trim();
  AppState.setTimekeeperBackendBearerToken(token.length > 0 ? token : null);
  await saveAutoBackupSettings();
  await scheduleAutoBackup();
  updateBackupStatusDisplay();
}
