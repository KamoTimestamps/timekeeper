/**
 * Timekeeper Sync client
 * Google sign-in against the Timekeeper backend plus live timestamp sync.
 *
 * Sync model: every committed local write bumps a Lamport write_counter, so "what still needs
 * pushing" is simply "rows with write_counter above the last pushed counter". Pulls are
 * cursor-based on the server's per-user seq. The WebSocket only delivers other devices' changes
 * as they happen; if it drops, reconnecting runs a normal pull/push cycle, so nothing is lost.
 */

import { log } from './util';
import {
  SIGNED_OUT_SYNC_AUTH_STATE,
  SyncAuthStateSchema,
  SyncAuthStateParsed,
  TimestampRowSchema,
  TimestampRow,
  boolean,
  nullable,
  number,
  object,
  optional,
  string,
} from './schema';
import { setIconLabel } from './icons';
import * as AppState from './services/state';
import * as TimestampModel from './timestamp-model';

// ============================================================================
// Configuration
// ============================================================================

// Deployment of the sync backend (see server/README.md), injected per release channel by
// build-tools/channels.js. Sync is unavailable until both are set; other builds leave them unset.
declare const __SYNC_API_URL__: string | undefined; // no trailing slash
declare const __SYNC_GOOGLE_CLIENT_ID__: string | undefined; // Web OAuth client with https://www.youtube.com/ as a redirect URI
const SYNC_API_URL = typeof __SYNC_API_URL__ === 'string' ? __SYNC_API_URL__ : '';
const SYNC_GOOGLE_CLIENT_ID = typeof __SYNC_GOOGLE_CLIENT_ID__ === 'string' ? __SYNC_GOOGLE_CLIENT_ID__ : '';

const GOOGLE_REDIRECT_URI = 'https://www.youtube.com/';
const OAUTH_STATE = 'timekeeper_sync_auth';
const OAUTH_CHANNEL = 'timekeeper_sync_oauth';

const SETTINGS_AUTH_KEY = 'syncAuthState';
const SETTINGS_CURSORS_KEY = 'syncCursors';

const PUSH_DEBOUNCE_MS = 1500;
const PUSH_CHUNK_SIZE = 200;
const PULL_PAGE_SIZE = 500;
const TOKEN_REFRESH_MARGIN_MS = 60 * 1000;
const MAX_BACKOFF_MS = 60 * 1000;
const SIGN_IN_TIMEOUT_MS = 5 * 60 * 1000;

export function isSyncConfigured(): boolean {
  return Boolean(SYNC_API_URL && SYNC_GOOGLE_CLIENT_ID);
}

// ============================================================================
// Wire schemas
// ============================================================================

interface SessionResponse {
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
  user: { id: string; email: string; name: string | null };
}

const SessionResponseSchema = object<SessionResponse>({
  accessToken: string(),
  accessTokenExpiresAt: number({ finite: true }),
  refreshToken: string(),
  user: object<SessionResponse['user']>({
    id: string(),
    email: string(),
    name: nullable(string()),
  }),
});

const PullResponseSchema = object<{ records: TimestampRow[]; seq: number; hasMore: boolean }>({
  records: TimestampRowSchema.array(),
  seq: number({ int: true, nonnegative: true }),
  hasMore: boolean(),
});

const PushResponseSchema = object<{ rejected: TimestampRow[]; fromSeq: number; seq: number }>({
  rejected: TimestampRowSchema.array(),
  fromSeq: number({ int: true, nonnegative: true }),
  seq: number({ int: true, nonnegative: true }),
});

const ServerMessageSchema = object<{
  type: string;
  seq: number | undefined;
  fromSeq: number | undefined;
  records: TimestampRow[] | undefined;
}>({
  type: string(),
  seq: optional(number({ int: true, nonnegative: true })),
  fromSeq: optional(number({ int: true, nonnegative: true })),
  records: optional(TimestampRowSchema.array()),
});

const OAuthMessageSchema = object<{ type: string; idToken: string | undefined; error: string | undefined }>({
  type: string(),
  idToken: optional(string()),
  error: optional(string()),
});

// ============================================================================
// State
// ============================================================================

type SyncStatus = 'signed-out' | 'connecting' | 'online' | 'offline' | 'error';

/** Thrown when the backend no longer accepts our session; the user has to sign in again. */
class SyncAuthError extends Error {}

interface Cursors {
  /** Rows with a write_counter above this have not been pushed yet. */
  pushCounter: number;
  /** The server seq we have pulled up to. */
  pullSeq: number;
}

let status: SyncStatus = 'signed-out';
let statusMessage = '';
let syncing = false;
let lastSyncedAt: number | null = null;

let stopped = true;
let socket: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempts = 0;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
let retryAttempts = 0;
let unsubscribeWrites: (() => void) | null = null;
let onlineListenerAdded = false;

let cursors: Cursors = { pushCounter: 0, pullSeq: 0 };
/** guid -> write_counter of the version the server is known to hold, so pulled rows aren't echoed back. */
const serverKnown = new Map<string, number>();

let queue: Promise<void> = Promise.resolve();
let cyclePending = false;
let refreshInFlight: Promise<string> | null = null;
let deviceId = '';
let signInInFlight = false;
/** An access token the server refused although it looked valid; never reused, forces a refresh. */
let rejectedAccessToken: string | null = null;

let onRemoteChange: ((videoIds: string[]) => void) | null = null;
let authStatusDisplay: HTMLElement | null = null;
let syncStatusDisplay: HTMLElement | null = null;
let uiRefresher: (() => void) | null = null;

export function getSyncAuthState(): SyncAuthStateParsed {
  return AppState.getSyncAuthState();
}

export function setOnRemoteChange(fn: (videoIds: string[]) => void) {
  onRemoteChange = fn;
}

export function setSyncAuthStatusDisplay(el: HTMLElement | null) {
  authStatusDisplay = el;
}

export function setSyncStatusDisplay(el: HTMLElement | null) {
  syncStatusDisplay = el;
}

/** Called whenever sign-in state or sync status changes, so the settings buttons can relabel. */
export function setSyncUiRefresher(fn: (() => void) | null) {
  uiRefresher = fn;
}

// ============================================================================
// Display
// ============================================================================

const GREEN = '#52c41a';
const RED = '#ff4d4f';
const ORANGE = '#ffa500';

export function updateSyncStatusDisplay() {
  const auth = getSyncAuthState();

  if (authStatusDisplay) {
    const display = authStatusDisplay;
    display.style.fontWeight = 'bold';
    display.onmouseenter = null;
    display.onmouseleave = null;
    if (!isSyncConfigured()) {
      setIconLabel(display, 'alert-triangle', 'Sync backend is not configured in this build');
      display.style.color = ORANGE;
    } else if (!auth.isSignedIn) {
      setIconLabel(display, 'circle-x', 'Not signed in');
      display.style.color = RED;
    } else {
      setIconLabel(display, 'circle-check', 'Signed in');
      display.style.color = GREEN;
      const who = auth.userName || auth.email;
      if (who) {
        display.onmouseenter = () => setIconLabel(display, 'circle-check', `Signed in as ${who}`);
        display.onmouseleave = () => setIconLabel(display, 'circle-check', 'Signed in');
      }
    }
  }

  if (syncStatusDisplay) {
    let text = '';
    let color = '#aaa';
    if (status === 'error') {
      text = statusMessage || 'Sync error';
      color = RED;
    } else if (status === 'connecting') {
      text = statusMessage || 'Connecting…';
      color = ORANGE;
    } else if (auth.isSignedIn && status === 'offline') {
      text = statusMessage || 'Offline. Retrying…';
      color = ORANGE;
    } else if (auth.isSignedIn && status === 'online') {
      text = syncing ? 'Syncing…' : 'Live sync on';
      if (!syncing && lastSyncedAt) text += ` · last synced ${new Date(lastSyncedAt).toLocaleTimeString()}`;
      color = syncing ? ORANGE : GREEN;
    }
    syncStatusDisplay.textContent = text;
    syncStatusDisplay.style.color = color;
  }

  uiRefresher?.();
}

function setStatus(next: SyncStatus, message = '') {
  status = next;
  statusMessage = message;
  updateSyncStatusDisplay();
}

// ============================================================================
// Persistence
// ============================================================================

// The session (notably the long-lived refresh token) is kept in the userscript manager's own
// storage, which page scripts on youtube.com cannot read. The page's IndexedDB is readable by
// any script running on the origin, so it is only a fallback for environments without GM.*.
interface GMStorage {
  getValue(key: string): Promise<unknown>;
  setValue(key: string, value: unknown): Promise<void>;
}
declare const GM: GMStorage | undefined;

function gmStorage(): GMStorage | null {
  return typeof GM !== 'undefined' && GM && typeof GM.getValue === 'function' && typeof GM.setValue === 'function' ? GM : null;
}

/** The stored session, or undefined when nothing could be read (which is not the same as signed out). */
async function readStoredAuth(): Promise<unknown> {
  const gm = gmStorage();
  if (!gm) return TimestampModel.loadGlobalSettings(SETTINGS_AUTH_KEY);

  const value = await gm.getValue(SETTINGS_AUTH_KEY);
  if (value !== undefined && value !== null) return value;

  // One-time move of a session saved by earlier builds in page-readable IndexedDB.
  const legacy = await TimestampModel.loadGlobalSettings(SETTINGS_AUTH_KEY);
  if (legacy) {
    await gm.setValue(SETTINGS_AUTH_KEY, legacy);
    await TimestampModel.saveGlobalSettings(SETTINGS_AUTH_KEY, null);
  }
  return legacy ?? undefined;
}

/** Resolves once the session is durably stored, so a rotated refresh token is never lost to another tab. */
async function saveAuthState(): Promise<void> {
  try {
    const gm = gmStorage();
    if (gm) await gm.setValue(SETTINGS_AUTH_KEY, getSyncAuthState());
    else await TimestampModel.saveGlobalSettings(SETTINGS_AUTH_KEY, getSyncAuthState());
  } catch (err) {
    log('Failed to save sync auth state:', err, 'error');
  }
}

function saveCursors() {
  TimestampModel.saveGlobalSettings(SETTINGS_CURSORS_KEY, { userId: getSyncAuthState().userId, ...cursors });
}

async function loadCursors() {
  const stored = (await TimestampModel.loadGlobalSettings(SETTINGS_CURSORS_KEY)) as
    | { userId?: unknown; pushCounter?: unknown; pullSeq?: unknown }
    | undefined;
  if (
    stored &&
    stored.userId === getSyncAuthState().userId &&
    typeof stored.pushCounter === 'number' &&
    typeof stored.pullSeq === 'number'
  ) {
    cursors = { pushCounter: stored.pushCounter, pullSeq: stored.pullSeq };
  } else {
    cursors = { pushCounter: 0, pullSeq: 0 };
  }
}

// ============================================================================
// HTTP + session
// ============================================================================

function postJson(path: string, body: unknown): Promise<Response> {
  return fetch(`${SYNC_API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function storeSession(session: SessionResponse) {
  rejectedAccessToken = null;
  AppState.setSyncAuthState({
    isSignedIn: true,
    accessToken: session.accessToken,
    accessTokenExpiresAt: session.accessTokenExpiresAt,
    refreshToken: session.refreshToken,
    userId: session.user.id,
    userName: session.user.name,
    email: session.user.email,
  });
}

const isFresh = (auth: SyncAuthStateParsed) =>
  Boolean(auth.accessToken) &&
  auth.accessToken !== rejectedAccessToken &&
  Boolean(auth.accessTokenExpiresAt) &&
  auth.accessTokenExpiresAt - Date.now() > TOKEN_REFRESH_MARGIN_MS;

/**
 * Refresh tokens are single-use, and every YouTube tab runs this client against one shared stored
 * session. A Web Lock makes tabs refresh one at a time; each tab then re-reads the stored session
 * inside the lock, so it either adopts the tokens another tab just obtained or rotates the latest
 * refresh token, never a stale one.
 */
async function withRefreshLock<T>(fn: () => Promise<T>): Promise<T> {
  if (typeof navigator !== 'undefined' && navigator.locks) {
    return await navigator.locks.request('timekeeper-sync-refresh', fn);
  }
  return fn();
}

/** Adopts the session another tab stored. Does nothing if storage could not be read. */
async function adoptStoredAuth() {
  const stored = await readStoredAuth();
  if (stored === undefined || stored === null) return;
  const parsed = SyncAuthStateSchema.safeParse(stored);
  if (parsed.success) AppState.setSyncAuthState(parsed.data);
}

function refreshAccessToken(): Promise<string> {
  refreshInFlight ??= withRefreshLock(async () => {
    await adoptStoredAuth();
    const auth = getSyncAuthState();
    if (!auth.isSignedIn || !auth.refreshToken) throw new SyncAuthError('Not signed in');
    if (isFresh(auth)) return auth.accessToken; // another tab already refreshed

    const res = await postJson('/auth/refresh', { refreshToken: auth.refreshToken });
    if (res.status === 401) throw new SyncAuthError('Session expired');
    if (!res.ok) throw new Error(`Token refresh failed (HTTP ${res.status})`);

    const parsed = SessionResponseSchema.safeParse(await res.json());
    if (!parsed.success) throw new Error('Unexpected token refresh response');
    storeSession(parsed.data);
    // Persist before releasing the lock: the next tab must see the rotated refresh token.
    await saveAuthState();
    return parsed.data.accessToken;
  }).finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

async function getAccessToken(): Promise<string> {
  const auth = getSyncAuthState();
  if (!auth.isSignedIn || !auth.refreshToken) throw new SyncAuthError('Not signed in');
  if (isFresh(auth)) return auth.accessToken;
  return refreshAccessToken();
}

async function apiFetch(path: string, init: { method: string; body?: unknown }, allowRefresh = true): Promise<Response> {
  const token = await getAccessToken();
  const res = await fetch(`${SYNC_API_URL}${path}`, {
    method: init.method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  if (res.status === 401) {
    if (!allowRefresh) throw new SyncAuthError('Session expired');
    // The access token was rejected despite looking valid (e.g. the server's signing secret changed).
    rejectedAccessToken = token;
    return apiFetch(path, init, false);
  }
  return res;
}

async function apiJson<T>(
  path: string,
  init: { method: string; body?: unknown },
  schema: { safeParse(v: unknown): { success: boolean; data?: T } },
): Promise<T> {
  const res = await apiFetch(path, init);
  if (!res.ok) throw new Error(`${init.method} ${path} failed (HTTP ${res.status})`);
  const parsed = schema.safeParse(await res.json());
  if (!parsed.success) throw new Error(`Unexpected response from ${path}`);
  return parsed.data;
}

// ============================================================================
// Sign-in / sign-out
// ============================================================================

function decodeJwtClaims(jwt: string): Record<string, unknown> | null {
  try {
    const payload = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')));
  } catch {
    return null;
  }
}

/** Resolves with the Google ID token whose nonce matches ours; ignores anything else on the channel. */
function waitForIdToken(channel: BroadcastChannel, popup: Window, nonce: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const finish = () => {
      clearTimeout(timeout);
      channel.close();
      try { popup.close(); } catch { /* popup already gone */ }
    };
    const timeout = setTimeout(() => {
      finish();
      reject(new Error('Sign-in timed out'));
    }, SIGN_IN_TIMEOUT_MS);

    channel.onmessage = (event) => {
      const parsed = OAuthMessageSchema.safeParse(event.data);
      if (!parsed.success) return;

      if (parsed.data.type === 'timekeeper_sync_oauth_error') {
        finish();
        reject(new Error(parsed.data.error || 'Google sign-in failed'));
      } else if (parsed.data.type === 'timekeeper_sync_oauth_token' && parsed.data.idToken) {
        // Binds the token to this sign-in attempt, so a crafted link can't log us into someone else's account.
        if (decodeJwtClaims(parsed.data.idToken)?.nonce !== nonce) return;
        finish();
        resolve(parsed.data.idToken);
      }
    };
  });
}

/**
 * Runs in the OAuth popup after Google redirects back to youtube.com with the ID token in the
 * URL fragment. Hands the token to the opener tab over a BroadcastChannel and closes the popup.
 * Synchronous so it can run before the rest of the script starts. Returns true if it handled
 * the redirect.
 */
export function handleSyncOAuthRedirect(): boolean {
  const hash = window.location.hash;
  if (!hash || hash.length <= 1) return false;
  const params = new URLSearchParams(hash.substring(1));
  if (params.get('state') !== OAUTH_STATE) return false;

  const idToken = params.get('id_token');
  const error = params.get('error_description') || params.get('error');
  if (!idToken && !error) return false;

  try {
    const channel = new BroadcastChannel(OAUTH_CHANNEL);
    channel.postMessage(
      idToken
        ? { type: 'timekeeper_sync_oauth_token', idToken }
        : { type: 'timekeeper_sync_oauth_error', error },
    );
    channel.close();
  } catch (err) {
    console.error('[Timekeeper] Failed to hand sync sign-in result to the opener:', err);
  }

  if (history.replaceState) history.replaceState(null, '', window.location.pathname + window.location.search);
  window.close();
  return true;
}

export async function signInToSync() {
  if (!isSyncConfigured()) {
    setStatus('error', 'Sync backend is not configured in this build');
    return;
  }
  if (getSyncAuthState().isSignedIn || signInInFlight) return;
  signInInFlight = true;

  setStatus('connecting', 'Opening Google sign-in…');
  const nonce = crypto.randomUUID();
  // Listening before the popup opens guarantees we can't miss its message.
  const channel = new BroadcastChannel(OAUTH_CHANNEL);

  try {
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', SYNC_GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'id_token');
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('nonce', nonce);
    authUrl.searchParams.set('state', OAUTH_STATE);
    authUrl.searchParams.set('prompt', 'select_account');

    const popup = window.open(authUrl.toString(), 'TimekeeperSyncAuth', 'width=500,height=600,menubar=no,toolbar=no,location=no');
    if (!popup) throw new Error('Popup blocked. Please enable popups for YouTube.');

    setStatus('connecting', 'Waiting for Google sign-in…');
    const idToken = await waitForIdToken(channel, popup, nonce);

    setStatus('connecting', 'Signing in to Timekeeper Sync…');
    const res = await postJson('/auth/google', { idToken });
    if (!res.ok) throw new Error(res.status === 401 ? 'Google sign-in was rejected by the server' : `Sign-in failed (HTTP ${res.status})`);
    const session = SessionResponseSchema.safeParse(await res.json());
    if (!session.success) throw new Error('Unexpected response from the sync server');

    storeSession(session.data);
    await saveAuthState();
    // A fresh sign-in always starts from scratch: push everything local, pull everything remote.
    cursors = { pushCounter: 0, pullSeq: 0 };
    saveCursors();
    log(`Signed in to Timekeeper Sync as ${session.data.user.email}`);
    await startSync();
  } catch (err) {
    channel.close();
    log('Sync sign-in failed:', err, 'error');
    setStatus('error', err instanceof Error ? err.message : 'Sign-in failed');
  } finally {
    signInInFlight = false;
  }
}

export async function signOutFromSync() {
  const { refreshToken } = getSyncAuthState();
  stopSync();
  AppState.setSyncAuthState(SIGNED_OUT_SYNC_AUTH_STATE);
  cursors = { pushCounter: 0, pullSeq: 0 };
  serverKnown.clear();
  await saveAuthState();
  saveCursors();
  setStatus('signed-out');

  // Revoke server-side so the stored refresh token is useless; a failure just leaves it to expire.
  if (refreshToken && isSyncConfigured()) {
    try {
      await postJson('/auth/logout', { refreshToken });
    } catch (err) {
      log('Sync logout request failed:', err, 'warn');
    }
  }
}

function handleSessionExpired() {
  stopSync();
  AppState.setSyncAuthState(SIGNED_OUT_SYNC_AUTH_STATE);
  void saveAuthState();
  setStatus('error', 'Session expired. Please sign in again.');
}

// ============================================================================
// Sync cycle
// ============================================================================

/** Runs `fn` after everything queued so far; keeps cursor updates and merges strictly ordered. */
function enqueue(fn: () => Promise<void>): Promise<void> {
  const run = queue.then(fn);
  queue = run.catch(() => undefined);
  return run;
}

function requestSync() {
  if (stopped || cyclePending) return;
  cyclePending = true;
  enqueue(async () => {
    cyclePending = false;
    await syncCycle();
  }).catch((err) => log('Sync: cycle crashed:', err, 'error'));
}

async function applyRemote(records: TimestampRow[]) {
  if (records.length === 0) return;
  for (const record of records) serverKnown.set(record.guid, record.write_counter ?? 0);
  await TimestampModel.mergeRemoteRecords(records);
  onRemoteChange?.([...new Set(records.map((r) => r.video_id))]);
}

/**
 * Server seqs for one batch are contiguous (fromSeq, seq]. If that range starts at or below our
 * cursor we've seen everything before it, so the cursor can jump to seq; otherwise something is
 * missing and a pull is needed.
 */
function noteSeqRange(fromSeq: number, seq: number): boolean {
  if (fromSeq > cursors.pullSeq) return false;
  if (seq > cursors.pullSeq) {
    cursors.pullSeq = seq;
    saveCursors();
  }
  return true;
}

async function pullAll() {
  for (;;) {
    const page = await apiJson(`/sync/pull?since=${cursors.pullSeq}&limit=${PULL_PAGE_SIZE}`, { method: 'GET' }, PullResponseSchema);
    await applyRemote(page.records);
    const advanced = page.seq !== cursors.pullSeq;
    cursors.pullSeq = page.seq;
    saveCursors();
    if (!page.hasMore || !advanced) return;
  }
}

async function pushPending() {
  const changed = await TimestampModel.getRecordsChangedSince(cursors.pushCounter);
  if (changed.length === 0) return;

  const toPush = changed.filter((row) => (serverKnown.get(row.guid) ?? 0) < row.write_counter);
  for (let i = 0; i < toPush.length; i += PUSH_CHUNK_SIZE) {
    const result = await apiJson(
      '/sync/push',
      { method: 'POST', body: { deviceId, records: toPush.slice(i, i + PUSH_CHUNK_SIZE) } },
      PushResponseSchema,
    );
    // Server copies that beat ours: adopt them (the normal merge rules decide).
    await applyRemote(result.rejected);
    if (!noteSeqRange(result.fromSeq, result.seq)) requestSync();
  }

  // Only after every chunk succeeded: rows can share a counter, so a partial advance could skip one.
  cursors.pushCounter = Math.max(cursors.pushCounter, changed[changed.length - 1].write_counter);
  saveCursors();
}

async function syncCycle() {
  if (stopped) return;
  syncing = true;
  updateSyncStatusDisplay();
  try {
    await pullAll();
    await pushPending();
    lastSyncedAt = Date.now();
    retryAttempts = 0;
  } catch (err) {
    if (err instanceof SyncAuthError) {
      handleSessionExpired();
      return;
    }
    log('Sync cycle failed:', err, 'warn');
    scheduleRetry();
  } finally {
    syncing = false;
    updateSyncStatusDisplay();
  }
}

function backoffDelay(attempts: number): number {
  return Math.min(MAX_BACKOFF_MS, 1000 * 2 ** attempts) * (0.5 + Math.random() / 2);
}

function scheduleRetry() {
  if (stopped || retryTimer) return;
  retryTimer = setTimeout(() => {
    retryTimer = null;
    requestSync();
  }, backoffDelay(retryAttempts++));
}

function onLocalWrite() {
  if (stopped) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    requestSync();
  }, PUSH_DEBOUNCE_MS);
}

/** Manual "Sync Now": reconnects immediately if offline and runs a cycle. */
export function syncNow() {
  if (stopped) return;
  if (!socket) {
    reconnectAttempts = 0;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    reconnectTimer = null;
    void connect();
  }
  requestSync();
}

// ============================================================================
// WebSocket
// ============================================================================

function scheduleReconnect() {
  if (stopped || reconnectTimer) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    void connect();
  }, backoffDelay(reconnectAttempts++));
}

async function connect() {
  if (stopped || socket) return;
  setStatus('connecting');

  let token: string;
  try {
    token = await getAccessToken();
  } catch (err) {
    if (err instanceof SyncAuthError) return handleSessionExpired();
    log('Sync: could not get an access token:', err, 'warn');
    setStatus('offline');
    return scheduleReconnect();
  }
  if (stopped || socket) return;

  const ws = new WebSocket(`${SYNC_API_URL.replace(/^http/, 'ws')}/sync/ws`);
  socket = ws;

  ws.onopen = () => ws.send(JSON.stringify({ type: 'auth', token, deviceId }));
  ws.onmessage = (event) => {
    let data: unknown;
    try {
      data = JSON.parse(String(event.data));
    } catch {
      return;
    }
    const message = ServerMessageSchema.safeParse(data);
    if (!message.success) return;

    if (message.data.type === 'ready') {
      reconnectAttempts = 0;
      setStatus('online');
      requestSync(); // catch up on anything missed while disconnected
    } else if (message.data.type === 'changes' && message.data.records) {
      const { fromSeq, seq, records } = message.data;
      void enqueue(async () => {
        await applyRemote(records);
        if (fromSeq === undefined || seq === undefined || !noteSeqRange(fromSeq, seq)) requestSync();
      }).catch((err) => log('Sync: failed to apply live changes:', err, 'error'));
    }
  };
  ws.onclose = (event) => {
    if (socket === ws) socket = null;
    if (stopped) return;
    // 4401: the server rejected our access token; force a refresh before reconnecting.
    if (event.code === 4401) rejectedAccessToken = token;
    setStatus('offline');
    scheduleReconnect();
  };
  ws.onerror = () => {
    /* onclose always follows and handles the retry */
  };
}

// ============================================================================
// Lifecycle
// ============================================================================

async function startSync() {
  if (!stopped) return;
  if (!deviceId) {
    const stored = await TimestampModel.loadGlobalSettings('device_id');
    deviceId = typeof stored === 'string' && stored ? stored : crypto.randomUUID();
  }
  stopped = false;
  retryAttempts = 0;
  reconnectAttempts = 0;
  unsubscribeWrites = TimestampModel.onTimestampsWritten(onLocalWrite);

  if (!onlineListenerAdded) {
    onlineListenerAdded = true;
    window.addEventListener('online', () => syncNow());
  }
  await connect();
}

function stopSync() {
  stopped = true;
  unsubscribeWrites?.();
  unsubscribeWrites = null;
  for (const timer of [pushTimer, retryTimer, reconnectTimer]) if (timer) clearTimeout(timer);
  pushTimer = retryTimer = reconnectTimer = null;
  cyclePending = false;
  const ws = socket;
  socket = null;
  try { ws?.close(); } catch { /* already closed */ }
}

/** Restores a saved session on startup and resumes live sync. */
export async function loadSyncAuthState() {
  if (!isSyncConfigured()) {
    updateSyncStatusDisplay();
    return;
  }
  try {
    const parsed = SyncAuthStateSchema.safeParse(await readStoredAuth());
    if (parsed.success) AppState.setSyncAuthState(parsed.data);
    const auth = getSyncAuthState();
    if (auth.isSignedIn && auth.refreshToken) {
      await loadCursors();
      await startSync();
    } else {
      setStatus('signed-out');
    }
  } catch (err) {
    log('Failed to load sync auth state:', err, 'error');
  }
}
