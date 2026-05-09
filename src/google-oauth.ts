/**
 * Google OAuth2 popup handling module for Timekeeper
 * Extracted from google-drive.ts for better modularity.
 *
 * Handles the OAuth2 popup flow: opening the popup, monitoring for the
 * returned token via BroadcastChannel/IndexedDB, and fetching user info.
 */

import { z } from 'zod';
import { log } from './util';
import { GoogleAuthStateSchema } from './schema';
import { setGoogleAuthState } from './services/state';
import { GOOGLE_CLIENT_ID, GOOGLE_SCOPES, GOOGLE_REDIRECT_URI } from './google-oauth-constants';
import {
  getGoogleAuthState,
  saveGoogleAuthState,
  updateGoogleUserDisplay,
  updateAuthStatusDisplay,
  updateBackupStatusDisplay,
  scheduleAutoBackup,
} from './google-drive';

// ============================================================================
// monitorOAuthPopup
// ============================================================================

/**
 * Monitor an OAuth popup window for the returned access token.
 * Uses BroadcastChannel as primary transport, IndexedDB polling as fallback.
 */
function monitorOAuthPopup(popup: Window | null, timeoutMs = 5 * 60 * 1000): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!popup) {
      if (log) log('OAuth monitor: popup is null', null, 'error');
      reject(new Error('Failed to open popup'));
      return;
     }

    if (log) log('OAuth monitor: starting to monitor popup for token');
    const start = Date.now();
    const channelName = 'timekeeper_oauth';
    let channel: BroadcastChannel | null = null;
    let storagePollIntervalId: ReturnType<typeof setInterval> | null = null;
    let checkInterval: ReturnType<typeof setInterval> | null = null;

    const cleanup = () => {
      if (channel) {
        try { channel.close(); } catch (err) { log("OAuth cleanup: " + (err instanceof Error ? err.message : String(err)), null, "debug"); }
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
        const dataRedacted = event.data?.token ? { ...event.data, token: '[REDACTED]' } : event.data;
        if (log) log('OAuth monitor: received BroadcastChannel message', dataRedacted);

         // Validate message structure
        const parsed = z.object({
          type: z.string(),
          token: z.string().optional(),
          error: z.string().optional(),
         }).safeParse(event.data);

        if (!parsed.success) {
          if (log) log('OAuth monitor: invalid message format', parsed.error, 'warn');
          return;
         }

        if (parsed.data.type === 'timekeeper_oauth_token' && parsed.data.token) {
          if (log) log('OAuth monitor: token received via BroadcastChannel');
          cleanup();
          try { popup.close(); } catch (err) { log("OAuth cleanup: " + (err instanceof Error ? err.message : String(err)), null, "debug"); }
          resolve(parsed.data.token);
         } else if (parsed.data.type === 'timekeeper_oauth_error') {
          if (log) log('OAuth monitor: error received via BroadcastChannel', parsed.data.error, 'error');
          cleanup();
          try { popup.close(); } catch (err) { log("OAuth cleanup: " + (err instanceof Error ? err.message : String(err)), null, "debug"); }
          reject(new Error(parsed.data.error || 'OAuth failed'));
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

               // Validate message structure
              const parsed = z.object({
                type: z.string(),
                token: z.string().optional(),
                error: z.string().optional(),
                timestamp: z.number().optional(),
               }).safeParse(data);

              if (!parsed.success) {
                if (log) log('OAuth monitor: invalid IndexedDB message format', parsed.error, 'warn');
                return;
               }

              if (parsed.data.timestamp && parsed.data.timestamp > lastCheckedTimestamp) {
                const dataRedacted = parsed.data.token ? { ...parsed.data, token: '[REDACTED]' } : parsed.data;
                if (log) log('OAuth monitor: received IndexedDB message', dataRedacted);
                if (parsed.data.type === 'timekeeper_oauth_token' && parsed.data.token) {
                  if (log) log('OAuth monitor: token received via IndexedDB');
                  cleanup();
                  try { popup.close(); } catch (err) { log("OAuth cleanup: " + (err instanceof Error ? err.message : String(err)), null, "debug"); }
                   // Delete the message
                  const delTx = db.transaction('settings', 'readwrite');
                  delTx.objectStore('settings').delete('oauth_message');
                  resolve(parsed.data.token);
                 } else if (parsed.data.type === 'timekeeper_oauth_error') {
                  if (log) log('OAuth monitor: error received via IndexedDB', parsed.data.error, 'error');
                  cleanup();
                  try { popup.close(); } catch (err) { log("OAuth cleanup: " + (err instanceof Error ? err.message : String(err)), null, "debug"); }
                   // Delete the message
                  const delTx = db.transaction('settings', 'readwrite');
                  delTx.objectStore('settings').delete('oauth_message');
                  reject(new Error(parsed.data.error || 'OAuth failed'));
                 }
                lastCheckedTimestamp = parsed.data.timestamp || Date.now();
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
        try { popup.close(); } catch (err) { log("OAuth cleanup: " + (err instanceof Error ? err.message : String(err)), null, "debug"); }
        reject(new Error('OAuth popup timed out'));
        return;
       }
     }, 1000);
   });
}

// ============================================================================
// signInToGoogle
// ============================================================================

/**
 * Sign in to Google Drive using an OAuth popup (no page redirect).
 */
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
        const userInfoJson = await userInfoResponse.json();

         // Validate user info response
        const userInfoParsed = z.object({
          name: z.string().optional(),
          email: z.string().optional(),
         }).safeParse(userInfoJson);

        if (!userInfoParsed.success) {
          if (log) log('Failed to validate user info response', userInfoParsed.error, 'error');
          throw new Error('Invalid user info response');
         }

        const userInfo = userInfoParsed.data;

         // Update auth state
        const currentAuth = getGoogleAuthState();
        setGoogleAuthState({
          ...currentAuth,
          isSignedIn: true,
          accessToken,
          userName: userInfo.name || null,
          email: userInfo.email || null,
         });

         // Save auth state
        await saveGoogleAuthState();
        updateGoogleUserDisplay();
        updateAuthStatusDisplay();
        updateBackupStatusDisplay();

         // Check if backup is needed and schedule auto-backup
        await scheduleAutoBackup();

        log(`Successfully authenticated as ${userInfo.name}`);
       } else {
        throw new Error('Failed to fetch user info');
       }
     } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      log('OAuth failed:', err, 'error');
      updateAuthStatusDisplay('error', errorMessage);
      return;
     }
   } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
    log('Failed to sign in to Google:', err, 'error');
    updateAuthStatusDisplay('error', `Failed to sign in: ${errorMessage}`);
   }
}

// ============================================================================
// silentSignInToGoogle
// ============================================================================

/**
 * Silently refresh the Google access token using prompt=none (no user interaction).
 * Returns true if a new token was obtained, false if the user needs to sign in manually.
 */
async function silentSignInToGoogle(): Promise<boolean> {
  const currentState = getGoogleAuthState();
  const loginHint = currentState.email;
  if (!GOOGLE_CLIENT_ID || !loginHint) return false;

  log('Silent OAuth: attempting silent token refresh for ' + loginHint);
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'token');
  authUrl.searchParams.set('scope', GOOGLE_SCOPES);
  authUrl.searchParams.set('include_granted_scopes', 'true');
  authUrl.searchParams.set('state', 'timekeeper_auth');
  authUrl.searchParams.set('prompt', 'none');
  authUrl.searchParams.set('login_hint', loginHint);

  const popup = window.open(
    authUrl.toString(),
     'TimekeeperGoogleAuthSilent',
     'width=1,height=1,left=-2000,top=-2000,menubar=no,toolbar=no,location=no'
   );

  if (!popup) {
    log('Silent OAuth: popup blocked', null, 'warn');
    return false;
   }

  try {
    const accessToken = await monitorOAuthPopup(popup, 15 * 1000);
    setGoogleAuthState({ ...currentState, isSignedIn: true, accessToken });
    await saveGoogleAuthState();
    updateGoogleUserDisplay();
    updateAuthStatusDisplay();
    log('Silent OAuth: token refreshed successfully for ' + loginHint);
    return true;
   } catch (err) {
    log('Silent OAuth: silent refresh failed', err, 'warn');
    try { popup.close(); } catch (err) { log("OAuth cleanup: " + (err instanceof Error ? err.message : String(err)), null, "debug"); }
    return false;
   }
}

// ============================================================================
// handleOAuthPopup
// ============================================================================

/**
 * Detect if we're in an OAuth popup and broadcast the token to the opener.
 * Returns true if this window was handled as an OAuth popup.
 */
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
      if (log) log('OAuth popup: error broadcast via BroadcastChannel');
     } catch (_) {
       // Fallback to IndexedDB
      const message = {
        type: 'timekeeper_oauth_error',
        error: params.get('error_description') || error,
        timestamp: Date.now()
       };
      if (log) log('OAuth popup: writing error to IndexedDB', message);
      const openReq = indexedDB.open('ytls-timestamps-db', 3);
      openReq.onsuccess = () => {
        const db = openReq.result;
        const tx = db.transaction('settings', 'readwrite');
        const putReq = tx.objectStore('settings').put({ key: 'oauth_message', value: message });
        putReq.onsuccess = () => {
          if (log) log('OAuth popup: error written to IndexedDB successfully');
         };
        putReq.onerror = () => {
          if (log) log('OAuth popup: failed to write error to IndexedDB', putReq.error, 'error');
         };
        db.close();
       };
      openReq.onerror = () => {
        if (log) log('OAuth popup: failed to open IndexedDB', openReq.error, 'error');
       };
     }

     // Close popup after a brief delay
    setTimeout(() => {
      try { window.close(); } catch (err) { log("OAuth cleanup: " + (err instanceof Error ? err.message : String(err)), null, "debug"); }
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
      const messageRedacted = { ...message, token: '[REDACTED]' };
      if (log) log('OAuth popup: writing token to IndexedDB', messageRedacted);
      const openReq = indexedDB.open('ytls-timestamps-db', 3);
      openReq.onsuccess = () => {
        const db = openReq.result;
        const tx = db.transaction('settings', 'readwrite');
        const putReq = tx.objectStore('settings').put({ key: 'oauth_message', value: message });
        putReq.onsuccess = () => {
          if (log) log('OAuth popup: token written to IndexedDB successfully');
         };
        putReq.onerror = () => {
          if (log) log('OAuth popup: failed to write token to IndexedDB', putReq.error, 'error');
         };
        db.close();
       };
      openReq.onerror = () => {
        if (log) log('OAuth popup: failed to open IndexedDB', openReq.error, 'error');
       };
     }

     // Close popup after a brief delay
    setTimeout(() => {
      try { window.close(); } catch (err) { log("OAuth cleanup: " + (err instanceof Error ? err.message : String(err)), null, "debug"); }
     }, 500);
    return true;
   }

  return false;
}

// ============================================================================
// handleAuthExpiration (moved with silentSignInToGoogle)
// ============================================================================

/**
 * Handle authentication expiration: attempt silent refresh, then sign out if that fails.
 */
export async function handleAuthExpiration(opts?: { silent?: boolean }): Promise<void> {
  void opts;
  log('Auth expired, attempting silent token refresh', null, 'warn');

  const refreshed = await silentSignInToGoogle();
  if (refreshed) return;

  log('Silent OAuth: falling back to sign-out', null, 'warn');
  setGoogleAuthState({
    isSignedIn: false,
    accessToken: null,
    userName: null,
    email: null,
   });
  await saveGoogleAuthState();
  await scheduleAutoBackup();
  updateAuthStatusDisplay('error', 'Authorization expired. Please sign in again.');
  updateBackupStatusDisplay();
}

// ============================================================================
// signOutFromGoogle
// ============================================================================

/**
 * Sign out from Google Drive.
 */
export async function signOutFromGoogle() {
  setGoogleAuthState({
    isSignedIn: false,
    accessToken: null,
    userName: null,
    email: null,
   });
  await saveGoogleAuthState();
  await scheduleAutoBackup();
  updateGoogleUserDisplay();
  updateAuthStatusDisplay();
  updateBackupStatusDisplay();
}
