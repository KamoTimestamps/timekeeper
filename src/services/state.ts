/**
 * Centralized State Management
 * Single source of truth for application state across all modules
 */

import { GoogleAuthStateParsed, AutoBackupSettings, TimestampRecord, PanePosition } from '../schema';

/**
 * Complete application state structure
 */
export interface AppState {
  // Authentication & Backup state
  auth: {
    googleAuthState: GoogleAuthStateParsed;
    autoBackupEnabled: boolean;
    autoBackupIntervalMinutes: number;
    autoBackupRetryAttempts: number;
    autoBackupBackoffMs: number | null;
    lastAutoBackupAt: number | null;
    isAutoBackupRunning: boolean;
    timekeeperBackendBackupEnabled: boolean;
    timekeeperBackendHost: string;
    timekeeperBackendPort: number;
    timekeeperBackendBearerToken: string | null;
  };

  // UI state
  ui: {
    panePosition: PanePosition | null;
    currentVideoId: string;
    minPaneHeight: number;
    lastHandledUrl: string | null;
    urlChangeHandlersSetup: boolean;
  };

  // Timestamp data state
  timestamps: {
    items: TimestampRecord[];
    currentIndex: number | null;
  };
}

/**
 * Default state
 */
const DEFAULT_STATE: AppState = {
  auth: {
    googleAuthState: {
      isSignedIn: false,
      accessToken: null,
      userName: null,
      email: null,
    },
    autoBackupEnabled: true,
    autoBackupIntervalMinutes: 30,
    autoBackupRetryAttempts: 0,
    autoBackupBackoffMs: null,
    lastAutoBackupAt: null,
    isAutoBackupRunning: false,
    timekeeperBackendBackupEnabled: false,
    timekeeperBackendHost: 'localhost',
    timekeeperBackendPort: 8443,
    timekeeperBackendBearerToken: null,
  },
  ui: {
    panePosition: null,
    currentVideoId: '',
    minPaneHeight: 250,
    lastHandledUrl: null,
    urlChangeHandlersSetup: false,
  },
  timestamps: {
    items: [],
    currentIndex: null,
  },
};

/**
 * Internal state storage
 */
let appState: AppState = JSON.parse(JSON.stringify(DEFAULT_STATE));

/**
 * State change listeners
 */
type StateListener = (state: AppState, previousState: AppState) => void;
const listeners: Set<StateListener> = new Set();

/**
 * Get the current complete state
 */
export function getState(): AppState {
  return JSON.parse(JSON.stringify(appState));
}

/**
 * Update state with partial changes
 */
export function setState(updates: Partial<AppState>): void {
  const previousState = listeners.size > 0 ? JSON.parse(JSON.stringify(appState)) : appState;

  appState = {
    ...appState,
    ...updates,
    auth: { ...appState.auth, ...(updates.auth || {}) },
    ui: { ...appState.ui, ...(updates.ui || {}) },
    timestamps: { ...appState.timestamps, ...(updates.timestamps || {}) },
  };

  notifyListeners(previousState);
}

/**
 * Private helper: update a single key inside appState.auth
 */
function setAuth<K extends keyof AppState['auth']>(key: K, value: AppState['auth'][K]): void {
  setState({ auth: { ...appState.auth, [key]: value } });
}

/**
 * Private helper: update a single key inside appState.ui
 */
function setUi<K extends keyof AppState['ui']>(key: K, value: AppState['ui'][K]): void {
  setState({ ui: { ...appState.ui, [key]: value } });
}

/**
 * Auth State Getters/Setters
 */
export function getGoogleAuthState(): GoogleAuthStateParsed {
  return appState.auth.googleAuthState;
}

export function setGoogleAuthState(authState: GoogleAuthStateParsed): void {
  setAuth('googleAuthState', authState);
}

export function setAutoBackupEnabled(enabled: boolean): void {
  setAuth('autoBackupEnabled', enabled);
}

export function setAutoBackupIntervalMinutes(minutes: number): void {
  setAuth('autoBackupIntervalMinutes', minutes);
}

export function setAutoBackupRunning(running: boolean): void {
  setAuth('isAutoBackupRunning', running);
}

export function setAutoBackupRetryAttempts(attempts: number): void {
  setAuth('autoBackupRetryAttempts', attempts);
}

export function setAutoBackupBackoffMs(backoff: number | null): void {
  setAuth('autoBackupBackoffMs', backoff);
}

export function setLastAutoBackupAt(timestamp: number | null): void {
  setAuth('lastAutoBackupAt', timestamp);
}

export function setTimekeeperBackendBackupEnabled(enabled: boolean): void {
  setAuth('timekeeperBackendBackupEnabled', enabled);
}

export function setTimekeeperBackendHost(host: string): void {
  setAuth('timekeeperBackendHost', host);
}

export function setTimekeeperBackendPort(port: number): void {
  setAuth('timekeeperBackendPort', port);
}

export function setTimekeeperBackendBearerToken(token: string | null): void {
  setAuth('timekeeperBackendBearerToken', token);
}

/**
 * UI State Getters/Setters
 */
export function getUiState() {
  return appState.ui;
}

export function setCurrentVideoId(videoId: string): void {
  setUi('currentVideoId', videoId);
}

export function setMinPaneHeight(height: number): void {
  setUi('minPaneHeight', height);
}

export function setPanePosition(position: PanePosition | null): void {
  setUi('panePosition', position);
}

export function setLastHandledUrl(url: string | null): void {
  setUi('lastHandledUrl', url);
}

export function setUrlChangeHandlersSetup(setup: boolean): void {
  setUi('urlChangeHandlersSetup', setup);
}

/**
 * Timestamps State Getters/Setters
 */
export function getTimestamps(): TimestampRecord[] {
  return appState.timestamps.items;
}

export function setTimestamps(items: TimestampRecord[]): void {
  setState({
    timestamps: {
      ...appState.timestamps,
      items,
    },
  });
}

export function setCurrentTimestampIndex(index: number | null): void {
  setState({
    timestamps: {
      ...appState.timestamps,
      currentIndex: index,
    },
  });
}

/**
 * Subscribe to state changes
 */
export function subscribe(listener: StateListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Notify all listeners of state changes
 */
function notifyListeners(previousState: AppState): void {
  listeners.forEach(listener => {
    try {
      listener(appState, previousState);
    } catch (error) {
      console.error('Error in state listener:', error);
    }
  });
}

/**
 * Reset state to defaults (useful for testing or clearing)
 */
export function resetState(): void {
  appState = JSON.parse(JSON.stringify(DEFAULT_STATE));
  notifyListeners(JSON.parse(JSON.stringify(DEFAULT_STATE)));
}
