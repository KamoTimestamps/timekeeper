/**
 * Centralized State Management
 * Single source of truth for application state across all modules
 */

import {
  SIGNED_OUT_SYNC_AUTH_STATE,
  SyncAuthStateParsed,
  TimestampRecord,
  PanePosition,
} from '../schema';

/**
 * Complete application state structure
 */
export interface AppState {
  // Authentication state
  auth: {
    syncAuthState: SyncAuthStateParsed;
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
    dbError: string | null;
  };
}

/**
 * Default state
 */
const DEFAULT_STATE: AppState = {
  auth: {
    syncAuthState: SIGNED_OUT_SYNC_AUTH_STATE,
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
    dbError: null,
  },
};

/**
 * Internal state storage
 */
let appState: AppState = JSON.parse(JSON.stringify(DEFAULT_STATE));

/**
 * Get the current complete state.
 * Returns the live state object — callers must not mutate it.
 * All writes must go through setState() or the typed setters.
 */
export function getState(): AppState {
  return appState;
}

/**
 * Update state with partial changes
 */
export function setState(updates: Partial<AppState>): void {
  appState = {
    ...appState,
    ...updates,
    auth: { ...appState.auth, ...(updates.auth || {}) },
    ui: { ...appState.ui, ...(updates.ui || {}) },
    timestamps: { ...appState.timestamps, ...(updates.timestamps || {}) },
  };
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
export function getSyncAuthState(): SyncAuthStateParsed {
  return appState.auth.syncAuthState;
}

export function setSyncAuthState(authState: SyncAuthStateParsed): void {
  setAuth('syncAuthState', authState);
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

export function setTimestamps(items: TimestampRecord[]): void {
  setState({
    timestamps: {
      ...appState.timestamps,
      items,
    },
  });
}

/**
 * Set an IndexedDB error message. When set, timestamp editing is disabled
 * until the error is cleared (set to null).
 */
export function setTimestampsDbError(message: string | null): void {
  setState({
    timestamps: {
      ...appState.timestamps,
      dbError: message,
    },
  });
}

/**
 * Get the current IndexedDB error, if any.
 */
export function getTimestampsDbError(): string | null {
  return appState.timestamps.dbError;
}
