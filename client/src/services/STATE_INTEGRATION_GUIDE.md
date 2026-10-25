/**
 * Centralized State Integration Guide
 *
 * The state.ts module provides a single source of truth for application state
 * across all Timekeeper modules. This document explains how to integrate it
 * into existing modules and best practices for state management.
 */

// =============================================================================
// OVERVIEW
// =============================================================================

/**
 * The centralized AppState interface contains:
 *
 * {
 *   auth: {
 *     googleAuthState: GoogleAuthStateParsed,
 *     autoBackupEnabled: boolean,
 *     autoBackupIntervalMinutes: number,
 *     autoBackupRetryAttempts: number,
 *     autoBackupBackoffMs: number | null,
 *     lastAutoBackupAt: number | null,
 *     isAutoBackupRunning: boolean,
 *   },
 *   ui: {
 *     panePosition: PanePosition | null,
 *     currentVideoId: string,
 *     minPaneHeight: number,
 *     lastHandledUrl: string | null,
 *     urlChangeHandlersSetup: boolean,
 *   },
 *   timestamps: {
 *     items: TimestampRecord[],
 *     currentIndex: number | null,
 *   },
 * }
 */

// =============================================================================
// READING STATE
// =============================================================================

/**
 * Option 1: Get the entire state object
 */
import * as AppState from './services/state';

const state = AppState.getState();
console.log(state.auth.autoBackupEnabled);
console.log(state.ui.minPaneHeight);

/**
 * Option 2: Use specific getter functions (preferred for auth state)
 */
const authState = AppState.getGoogleAuthState();
if (authState.isSignedIn) {
  console.log(`User: ${authState.userName}`);
}

/**
 * Option 3: Subscribe to state changes
 */
const unsubscribe = AppState.subscribe((newState, previousState) => {
  if (newState.auth.autoBackupEnabled !== previousState.auth.autoBackupEnabled) {
    console.log('Auto-backup setting changed!');
  }
});

// Clean up subscription
unsubscribe();

// =============================================================================
// UPDATING STATE
// =============================================================================

/**
 * For auth state (use dedicated setter)
 */
AppState.setGoogleAuthState({
  isSignedIn: true,
  accessToken: 'token...',
  userName: 'User',
  email: 'user@example.com',
});

/**
 * For backup settings (use dedicated setters)
 */
AppState.setAutoBackupEnabled(true);
AppState.setAutoBackupIntervalMinutes(30);
AppState.setAutoBackupRunning(false);
AppState.setAutoBackupRetryAttempts(0);
AppState.setAutoBackupBackoffMs(null);
AppState.setLastAutoBackupAt(Date.now());

/**
 * For UI state (use dedicated setters)
 */
AppState.setCurrentVideoId('dQw4w9WgXcQ');
AppState.setMinPaneHeight(300);
AppState.setPanePosition({ x: 100, y: 100, width: 400, height: 600 });
AppState.setLastHandledUrl(window.location.href);
AppState.setUrlChangeHandlersSetup(true);

/**
 * For timestamps
 */
AppState.setTimestamps([
  { guid: 'abc123', start: 0, comment: 'Intro' },
  { guid: 'def456', start: 60, comment: 'Main content' },
]);
AppState.setCurrentTimestampIndex(0);

/**
 * Bulk update (for multiple related changes)
 */
AppState.setState({
  ui: {
    ...AppState.getState().ui,
    minPaneHeight: 400,
    currentVideoId: 'new_video_id',
  },
});

// =============================================================================
// MIGRATION GUIDE: Converting modules to use centralized state
// =============================================================================

/**
 * BEFORE: Module with local state variables
 * =========================================
 *
 * export let autoBackupEnabled = true;
 * export let isAutoBackupRunning = false;
 * export let lastAutoBackupAt: number | null = null;
 *
 * // Scattered state updates
 * export async function startBackup() {
 *   isAutoBackupRunning = true;
 *   try {
 *     // ... do backup ...
 *   } finally {
 *     isAutoBackupRunning = false;
 *     lastAutoBackupAt = Date.now();
 *   }
 * }
 */

/**
 * AFTER: Module using centralized state
 * ======================================
 *
 * import * as AppState from './services/state';
 *
 * // Getter function - maintains same interface
 * export function getAutoBackupEnabled(): boolean {
 *   return AppState.getState().auth.autoBackupEnabled;
 * }
 *
 * // Cleaner state updates
 * export async function startBackup() {
 *   AppState.setAutoBackupRunning(true);
 *   try {
 *     // ... do backup ...
 *   } finally {
 *     AppState.setAutoBackupRunning(false);
 *     AppState.setLastAutoBackupAt(Date.now());
 *   }
 * }
 */

// =============================================================================
// PHASED MIGRATION STRATEGY
// =============================================================================

/**
 * Phase 1: Create wrapper functions in modules
 * - Keep existing exported module variables
 * - Add getters/setters that read from centralized state
 * - No need to change call sites
 * - Example: google-drive.ts can keep exporting googleAuthState,
 *   but it becomes a getter that reads from AppState
 *
 * Phase 2: Add state change subscriptions
 * - Subscribe to state changes for UI updates
 * - Use subscribe() to react to specific state changes
 * - Reduces manual synchronization logic
 *
 * Phase 3: Direct integration
 * - Import AppState directly in modules
 * - Replace local state variables completely
 * - Update function signatures to use centralized getters
 */

// =============================================================================
// BEST PRACTICES
// =============================================================================

/**
 * 1. Always use getters when reading, setters when writing
 * ✓ GOOD
 * const isRunning = AppState.getState().auth.isAutoBackupRunning;
 * AppState.setAutoBackupRunning(false);
 *
 * ✗ AVOID
 * const state = AppState.getState();
 * state.auth.isAutoBackupRunning = false; // This mutates a copy, doesn't persist!
 */

/**
 * 2. Group related state updates
 * ✓ GOOD
 * AppState.setAutoBackupRunning(true);
 * AppState.setAutoBackupRetryAttempts(0);
 * AppState.setAutoBackupBackoffMs(null);
 *
 * ✗ AVOID - Creates 3 separate notifications
 * AppState.setState({ auth: { ...state.auth, isAutoBackupRunning: true }});
 * AppState.setState({ auth: { ...state.auth, autoBackupRetryAttempts: 0 }});
 * AppState.setState({ auth: { ...state.auth, autoBackupBackoffMs: null }});
 */

/**
 * 3. Use subscriptions for reactive updates
 * ✓ GOOD - Automatically stays in sync
 * AppState.subscribe((newState, prevState) => {
 *   if (newState.ui.minPaneHeight !== prevState.ui.minPaneHeight) {
 *     recalculateLayout();
 *   }
 * });
 *
 * ✗ AVOID - Manual synchronization, easy to miss updates
 * const oldSetMinHeight = setMinPaneHeight;
 * setMinPaneHeight = (h) => {
 *   oldSetMinHeight(h);
 *   recalculateLayout();
 * };
 */

/**
 * 4. Keep derived state out of central store
 * ✗ DON'T STORE
 * const isBackupInProgress = state.auth.isAutoBackupRunning && state.auth.autoBackupBackoffMs === null;
 *
 * ✓ COMPUTE WHEN NEEDED
 * function isBackupInProgress(): boolean {
 *   const state = AppState.getState();
 *   return state.auth.isAutoBackupRunning && state.auth.autoBackupBackoffMs === null;
 * }
 */

// =============================================================================
// NEXT STEPS FOR GOOGLE-DRIVE.TS INTEGRATION
// =============================================================================

/**
 * 1. Replace 7 exported state variables with getters
 *    - googleAuthState → getGoogleAuthState() / setGoogleAuthState()
 *    - autoBackupEnabled → getter/setter functions
 *    - autoBackupIntervalMinutes → getter/setter functions
 *    - lastAutoBackupAt → getter/setter functions
 *    - isAutoBackupRunning → getter/setter functions
 *    - autoBackupRetryAttempts → getter/setter functions
 *    - autoBackupBackoffMs → getter/setter functions
 *
 * 2. Update all 100+ state variable references to use getters/setters
 *
 * 3. Update saveGoogleAuthState() and loadGoogleAuthState() to sync with central state
 *
 * 4. Test backup workflow and auth flow
 */

// =============================================================================
// NEXT STEPS FOR TIMEKEEPER.TS INTEGRATION
// =============================================================================

/**
 * 1. Replace local UI state variables
 *    - lastSavedPanePosition → AppState.getPanePosition() / setPanePosition()
 *    - minPaneHeight → AppState.getState().ui.minPaneHeight / setMinPaneHeight()
 *    - lastHandledUrl → AppState.getState().ui.lastHandledUrl / setLastHandledUrl()
 *    - urlChangeHandlersSetup → AppState.getState().ui.urlChangeHandlersSetup / setUrlChangeHandlersSetup()
 *
 * 2. Optionally subscribe to pane position changes for cross-tab sync
 *    - Use AppState.subscribe() to detect pane position changes
 *    - Broadcast changes via BroadcastChannel or postMessage
 *
 * 3. Test UI state persistence across page reloads
 */

// =============================================================================
// DEBUGGING CENTRALIZED STATE
// =============================================================================

/**
 * Check current state in browser console
 */
// window.__AppState__.getState()

/**
 * Subscribe to all state changes (for debugging)
 */
// window.__AppState__.subscribe((newState, prevState) => {
//   console.log('State changed:', { from: prevState, to: newState });
// });

export {};
