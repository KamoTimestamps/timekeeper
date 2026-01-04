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
  const previousState = JSON.parse(JSON.stringify(appState));

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
 * Auth State Getters/Setters
 */
export function getGoogleAuthState(): GoogleAuthStateParsed {
  return getState().auth.googleAuthState;
}

export function setGoogleAuthState(authState: GoogleAuthStateParsed): void {
  setState({
    auth: {
      ...appState.auth,
      googleAuthState: authState,
    },
  });
}

export function setAutoBackupEnabled(enabled: boolean): void {
  setState({
    auth: {
      ...appState.auth,
      autoBackupEnabled: enabled,
    },
  });
}

export function setAutoBackupIntervalMinutes(minutes: number): void {
  setState({
    auth: {
      ...appState.auth,
      autoBackupIntervalMinutes: minutes,
    },
  });
}

export function setAutoBackupRunning(running: boolean): void {
  setState({
    auth: {
      ...appState.auth,
      isAutoBackupRunning: running,
    },
  });
}

export function setAutoBackupRetryAttempts(attempts: number): void {
  setState({
    auth: {
      ...appState.auth,
      autoBackupRetryAttempts: attempts,
    },
  });
}

export function setAutoBackupBackoffMs(backoff: number | null): void {
  setState({
    auth: {
      ...appState.auth,
      autoBackupBackoffMs: backoff,
    },
  });
}

export function setLastAutoBackupAt(timestamp: number | null): void {
  setState({
    auth: {
      ...appState.auth,
      lastAutoBackupAt: timestamp,
    },
  });
}

/**
 * UI State Getters/Setters
 */
export function getUiState() {
  return getState().ui;
}

export function setCurrentVideoId(videoId: string): void {
  setState({
    ui: {
      ...appState.ui,
      currentVideoId: videoId,
    },
  });
}

export function setMinPaneHeight(height: number): void {
  setState({
    ui: {
      ...appState.ui,
      minPaneHeight: height,
    },
  });
}

export function setPanePosition(position: PanePosition | null): void {
  setState({
    ui: {
      ...appState.ui,
      panePosition: position,
    },
  });
}

export function setLastHandledUrl(url: string | null): void {
  setState({
    ui: {
      ...appState.ui,
      lastHandledUrl: url,
    },
  });
}

export function setUrlChangeHandlersSetup(setup: boolean): void {
  setState({
    ui: {
      ...appState.ui,
      urlChangeHandlersSetup: setup,
    },
  });
}

/**
 * Timestamps State Getters/Setters
 */
export function getTimestamps(): TimestampRecord[] {
  return getState().timestamps.items;
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
