import { boolean } from "./schema";
import { createIcon, setIcon, setIconLabel, TablerIconName } from "./icons";
import {
  log,
  formatTimeString,
  formatTimeDisplay,
  formatTimestampLines,
  getTimestampSuffix,
} from "./util";
import { DISPLAY_VERSION } from "./build-info";
import { PANE_STYLES } from "./styles";
import { HEADER_ICON_DEFAULT_URL, HEADER_ICON_HOVER_URL } from "./header-icons";
import { addTooltip, hideActiveTooltip, cleanupAllTooltips } from "./tooltip";
import * as TimestampModel from "./timestamp-model";
import * as TimestampView from "./timestamp-view";
import * as AppState from "./services/state";
import { initializeDvrEnablement } from "./dvr-enablement";
import { readWatchPageAccess } from "./members-only";

declare const unsafeWindow: Window | undefined;
import { initializeChatHandleCleanup, isLiveChatFrame } from "./chat-handles";

function getExtensionStorageValue<T = unknown>(
  key: string,
  defaultValue?: T,
): Promise<T | undefined> {
  return TimestampModel.loadGlobalSettings(key).then(
    (v) => (v !== undefined ? v : defaultValue) as T | undefined,
  );
}

function setExtensionStorageValue(key: string, value: unknown): Promise<void> {
  TimestampModel.saveGlobalSettings(key, value);
  return Promise.resolve();
}

import * as GoogleDrive from "./google-drive";
import * as SyncClient from "./sync-client";
import {
  PanePositionSchema,
  TimestampRecord,
} from "./schema";

// OAuth detection - always check URL for auth token, runs synchronously before any async operations
const hash = window.location.hash;
if (hash && hash.length > 1) {
  const params = new URLSearchParams(hash.substring(1));
  const state = params.get("state");

  if (state === "timekeeper_auth") {
    const token = params.get("access_token");
    if (token) {
      console.log(
        "[Timekeeper] Auth token detected in URL, broadcasting token",
      );
      console.log("[Timekeeper] Token length:", token.length, "characters");

      // Broadcast via BroadcastChannel (primary method)
      try {
        const channel = new BroadcastChannel("timekeeper_oauth");
        const message = { type: "timekeeper_oauth_token", token: token };
        console.log("[Timekeeper] Sending auth message via BroadcastChannel:", {
          type: message.type,
          tokenLength: token.length,
        });
        channel.postMessage(message);
        channel.close();
        console.log(
          "[Timekeeper] Token broadcast via BroadcastChannel completed",
        );
      } catch (e) {
        console.log(
          "[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",
          e,
        );
        // Fallback to IndexedDB for cross-tab communication
        const message = {
          type: "timekeeper_oauth_token",
          token: token,
          timestamp: Date.now(),
        };
        // Direct IndexedDB write (can't use async helper here as it's not defined yet)
        const openReq = indexedDB.open("ytls-timestamps-db", 4);
        openReq.onsuccess = () => {
          const db = openReq.result;
          const tx = db.transaction("settings", "readwrite");
          const store = tx.objectStore("settings");
          store.put({ key: "oauth_message", value: message });
          tx.oncomplete = () => {
            console.log(
              "[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",
              message.timestamp,
            );
            db.close();
          };
        };
      }

      // Clean up the hash from the URL
      if (history.replaceState) {
        const cleanUrl = window.location.pathname + window.location.search;
        history.replaceState(null, "", cleanUrl);
      }

      // Close window after broadcasting auth token
      console.log("[Timekeeper] Closing window after broadcasting auth token");
      window.close();
      // Exit the module by throwing - this prevents the IIFE from running
      throw new Error("OAuth window closed");
    }
  }
}

// Timekeeper Sync sign-in popup: hand the Google ID token to the opener tab, then stop here.
if (SyncClient.handleSyncOAuthRedirect()) {
  throw new Error("OAuth window closed");
}

// Handles in live chat (iframe) and comments (top frame)
initializeChatHandleCleanup();
if (!isLiveChatFrame()) {
  // Initialize DVR/Rewind enablement for live streams
  initializeDvrEnablement();
}

(async function () {
  "use strict";

  if (window.top !== window.self) {
    return; // Don't run the main app in iframes (live chat only needs handle cleanup)
  }

  // Setup minimal logging and storage functions early for OAuth handling
  function earlyLoadGlobalSettings(key: string): Promise<unknown> {
    return getExtensionStorageValue(key, undefined);
  }

  function earlySaveGlobalSettings(key: string, value: unknown): Promise<void> {
    return setExtensionStorageValue(key, value);
  }

  // Initialize GoogleDrive callbacks early for OAuth handling
  (GoogleDrive as any).setLoadGlobalSettings(earlyLoadGlobalSettings);
  (GoogleDrive as any).setSaveGlobalSettings(earlySaveGlobalSettings);

  // Initialize Lamport device_id so all write operations have a stable identifier
  try {
    const deviceId = await TimestampModel.loadGlobalSettings('device_id');
    const id = typeof deviceId === 'string' && deviceId.length > 0
      ? deviceId
      : crypto.randomUUID();
    await TimestampModel.saveGlobalSettings('device_id', id);
    log(`Lamport: device_id = ${id}`);
  } catch (err) {
    log('Lamport: failed to initialize device_id:', err, 'warn');
  }

  // Check if we're in an OAuth popup and handle it
  const isOAuthPopup = await GoogleDrive.handleOAuthPopup();
  if (isOAuthPopup) {
    log("OAuth popup detected, broadcasting token and closing");
    return; // Exit script, popup will close
  }

  // Load auth state early so user remains signed in
  await GoogleDrive.loadGoogleAuthState();

  const SUPPORTED_PATH_PREFIXES = ["/watch", "/live"] as const;

  function isSupportedUrl(url = window.location.href) {
    try {
      const parsed = new URL(url);
      if (parsed.origin !== "https://www.youtube.com") {
        return false;
      }
      return SUPPORTED_PATH_PREFIXES.some((prefix) => {
        return (
          parsed.pathname === prefix || parsed.pathname.startsWith(`${prefix}/`)
        );
      });
    } catch (err) {
      log("Timekeeper failed to parse URL for support check:", err, "error");
      return false;
    }
  }

  let pane: HTMLDivElement | null = null;
  let header: HTMLDivElement | null = null;
  let list: HTMLUListElement | null = null;
  let btns: HTMLDivElement | null = null;
  let timeDisplay: HTMLSpanElement | null = null;
  let playbackSpeedDisplay: HTMLSpanElement | null = null;
  let lastSavedSpeed: number = (() => {
    try {
      const v = parseFloat(localStorage.getItem("ytls-last-speed") ?? "");
      return Number.isFinite(v) && v > 0 && v !== 1 ? Math.min(v, 4) : 2;
    } catch {
      return 2;
    }
  })();
  // True while Timekeeper's own toggle (indicator click / Z shortcut) is
  // changing the rate, so the resulting "ratechange" event isn't mistaken
  // for a fresh manual speed selection.
  let isTogglingPlaybackSpeed = false;

  let versionDisplay: HTMLSpanElement | null = null;
  let backupStatusIndicator: HTMLSpanElement | null = null;
  // Used for dynamic min-height calculation
  let minPaneHeight = 250;

  // Track last handled URL to avoid duplicate reloads from history events
  let lastHandledUrl: string | null = null;

  // ============================================================================
  // UI State Getters/Setters (using centralized AppState)
  // ============================================================================

  function getMinPaneHeight(): number {
    return AppState.getState().ui.minPaneHeight;
  }

  function setMinPaneHeight(height: number): void {
    AppState.setMinPaneHeight(height);
  }

  function setLastHandledUrl(url: string | null): void {
    AppState.setLastHandledUrl(url);
  }

  function getUrlChangeHandlersSetup(): boolean {
    return AppState.getState().ui.urlChangeHandlersSetup;
  }

  function setUrlChangeHandlersSetup(setup: boolean): void {
    AppState.setUrlChangeHandlersSetup(setup);
  }

  function getPanePositionState(): {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  } | null {
    return AppState.getState().ui.panePosition as any;
  }

  function setPanePositionState(
    position: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
    } | null,
  ): void {
    AppState.setPanePosition(position as any);
  }

  function setTimestampsInState(items: TimestampRecord[]): void {
    AppState.setTimestamps(items);
  }

  // --- Pane sizing helpers (available across module) ---
  function getPaneRect() {
    if (!pane) return null;
    return pane.getBoundingClientRect();
  }

  function updateLastSavedPanePositionFromRect(
    rect: DOMRect | null,
    xOverride?: number,
    yOverride?: number,
  ) {
    if (!rect) return;
    setPanePositionState({
      x:
        typeof xOverride === "number"
          ? Math.round(xOverride)
          : Math.round(rect.left),
      y:
        typeof yOverride === "number"
          ? Math.round(yOverride)
          : Math.round(rect.top),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    });
  }

  function clampAndSavePanePosition(save = true) {
    if (!pane) return;
    clampPaneToViewport();
    const rect = getPaneRect();
    if (rect && (rect.width || rect.height)) {
      updateLastSavedPanePositionFromRect(rect);
      if (save) {
        const position = getPanePositionState();
        saveGlobalSettings("windowPosition", position);
        safePostMessage({
          type: "window_position_updated",
          position: position,
          timestamp: Date.now(),
        });
      }
    }
  }

  function ensureMinPaneHeight() {
    if (!pane || !header || !btns || !list) return;
    let liH = 40;
    const itemsForSize = getTimestampItems();
    if (itemsForSize.length > 0) {
      liH = (itemsForSize[0] as HTMLElement).offsetHeight;
    } else {
      const tempLi = document.createElement("li");
      tempLi.style.visibility = "hidden";
      tempLi.style.position = "absolute";
      tempLi.textContent = "00:00 Example";
      // Append temporarily so we can measure
      list.appendChild(tempLi);
      liH = tempLi.offsetHeight;
      list.removeChild(tempLi);
    }
    minPaneHeight = header.offsetHeight + btns.offsetHeight + liH;
    setMinPaneHeight(minPaneHeight);
    pane.style.minHeight = getMinPaneHeight() + "px";
  }

  // Append any timestamps that were built while the pane was animating open.
  function performSizingAndSave() {
    // Run a layout recalc then ensure pane sizing/clamping are applied
    requestAnimationFrame(() => {
      recalculateTimestampsAreaFn?.();
      ensureMinPaneHeight();
      clampAndSavePanePosition(true);
    });
  }

  function scheduleShowFinalizer(delay = 450) {
    if (visibilitySizingTimeoutId) {
      clearTimeout(visibilitySizingTimeoutId);
      visibilitySizingTimeoutId = null;
    }
    visibilitySizingTimeoutId = setTimeout(() => {
      // If timestamps were deferred while animating, append them first so sizing sees them
      appendPendingTimestamps();
      performSizingAndSave();
      visibilitySizingTimeoutId = null;
    }, delay);
  }

  function cancelScheduledShowFinalizer() {
    if (visibilitySizingTimeoutId) {
      clearTimeout(visibilitySizingTimeoutId);
      visibilitySizingTimeoutId = null;
    }
  }

  function startShowAnimation() {
    if (list) {
      list.style.visibility = "hidden";
      log("Hiding timestamps during show animation");
    }
    performSizingAndSave();
    scheduleShowFinalizer();
  }

  function startHideAnimation() {
    // If any deferred timestamps exist, append them now (they'll remain hidden)
    appendPendingTimestamps();
    // Cancel any scheduled show finalizer since we're hiding instead
    cancelScheduledShowFinalizer();

    if (visibilityAnimationTimeoutId) {
      clearTimeout(visibilityAnimationTimeoutId);
      visibilityAnimationTimeoutId = null;
    }
    visibilityAnimationTimeoutId = setTimeout(() => {
      if (!pane) return;
      pane.style.display = "none";
      saveUIVisibilityState();
      visibilityAnimationTimeoutId = null;
    }, 400);
  }

  function appendPendingTimestamps() {
    if (!list) {
      // Resolve any pending promise so awaiters don't hang
      if (pendingTimestampsResolve) {
        pendingTimestampsResolve();
        pendingTimestampsResolve = null;
        pendingTimestampsPromise = null;
        pendingTimestampsFragment = null;
      }
      return;
    }

    // If there's nothing pending, ensure visibility is restored
    if (!pendingTimestampsFragment) {
      if (list.style.visibility === "hidden") {
        list.style.visibility = "";
        log("Restoring timestamp visibility (no deferred fragment)");
      }
      if (pendingTimestampsResolve) {
        pendingTimestampsResolve();
        pendingTimestampsResolve = null;
        pendingTimestampsPromise = null;
      }
      return;
    }

    log("Appending deferred timestamps after animation");
    list.appendChild(pendingTimestampsFragment);
    pendingTimestampsFragment = null;
    invalidateLatestTimestampValue();
    updateTimeDifferences();

    // Restore visibility now that nodes are present
    if (list.style.visibility === "hidden") {
      list.style.visibility = "";
      log("Restoring timestamp visibility after append");
    }

    // Resolve promise so loadTimestamps can continue
    if (pendingTimestampsResolve) {
      pendingTimestampsResolve();
      pendingTimestampsResolve = null;
      pendingTimestampsPromise = null;
    }

    updateIndentMarkers();
    updateSeekbarMarkers();
    if (recalculateTimestampsAreaFn)
      requestAnimationFrame(recalculateTimestampsAreaFn);

    autoHighlightNearest(true);
  }

  let timeUpdateIntervalId: ReturnType<typeof setInterval> | null = null;
  let isLoadingTimestamps = false; // Track if timestamps are currently loading
  const TIMESTAMP_DELETE_CLASS = "ytls-timestamp-pending-delete";
  const TIMESTAMP_HIGHLIGHT_CLASS = "ytls-timestamp-highlight";

  // Wait for YouTube interface to load completely
  async function waitForYouTubeReady() {
    // Wait for the main video element and controls to be present
    while (
      !document.querySelector("video") ||
      !document.querySelector("#movie_player")
    ) {
      await new Promise((r) => setTimeout(r, 100));
    }
    // Optionally, wait for the progress bar and other UI elements
    while (!document.querySelector(".ytp-progress-bar")) {
      await new Promise((r) => setTimeout(r, 100));
    }
    // Wait a little extra to ensure dynamic elements are ready
    await new Promise((r) => setTimeout(r, 200));
  }

  const REQUIRED_PLAYER_METHODS = [
    "getCurrentTime",
    "seekTo",
    "getPlayerState",
    "seekToLiveHead",
    "getVideoData",
    "getDuration",
  ];
  const PLAYER_METHOD_CHECK_TIMEOUT_MS = 5000;
  const PLAYER_METHODS_WITH_FALLBACK = new Set([
    "getCurrentTime",
    "seekTo",
    "getPlayerState",
    "seekToLiveHead",
    "getVideoData",
    "getDuration",
  ]);

  function methodHasFallback(method) {
    return PLAYER_METHODS_WITH_FALLBACK.has(method);
  }

  function getVideoElement() {
    return document.querySelector("video");
  }

  let lastValidatedPlayer = null;

  function getActivePlayer() {
    if (lastValidatedPlayer && document.contains(lastValidatedPlayer)) {
      return lastValidatedPlayer;
    }
    const player = document.getElementById("movie_player");
    if (player && document.contains(player)) {
      return player;
    }
    return null;
  }

  function formatPlaybackSpeed(rate: number): string {
    const roundedRate = Math.round(rate * 100) / 100;
    return roundedRate
      .toFixed(2)
      .replace(/\.0+?$|(?<=\.[0-9])0+$/g, "");
  }

  function syncPlaybackSpeedState(rate: number) {
    // If the last *manually* set speed was 1x, fall back to 2x as the toggle target.
    const speedToSave = rate === 1 ? 2 : rate;
    lastSavedSpeed = speedToSave;
    try {
      localStorage.setItem("ytls-last-speed", String(speedToSave));
    } catch (_) { }
  }

  function updatePlaybackSpeedUI(rateOverride?: number) {
    if (!playbackSpeedDisplay) return;

    const rate =
      typeof rateOverride === "number"
        ? rateOverride
        : getVideoElement()?.playbackRate ?? 1;
    const display = formatPlaybackSpeed(rate);

    // Called every playback tick; only touch the DOM when the rendered speed changes.
    if (playbackSpeedDisplay.dataset.speed !== display) {
      playbackSpeedDisplay.dataset.speed = display;
      playbackSpeedDisplay.textContent = `${display}x`;
      playbackSpeedDisplay.setAttribute(
        "aria-label",
        `Playback speed ${display}x`,
      );
    }

    // Add active class when speed is not 1x for glow effect
    if (Math.abs(rate - 1.0) > 0.01) {
      playbackSpeedDisplay.classList.add("ytls-playback-speed-active");
    } else {
      playbackSpeedDisplay.classList.remove("ytls-playback-speed-active");
    }
  }

  function setVideoSpeed(rate: number): boolean {
    const player = getActivePlayer();
    const video = getVideoElement();

    // Toggling (via the indicator or the Z shortcut) fires a native
    // "ratechange" event too; mark it so handleRatechange doesn't treat
    // our own toggle-off as a fresh manual speed selection.
    isTogglingPlaybackSpeed = true;

    if (player && typeof player.setPlaybackRate === "function") {
      player.setPlaybackRate(rate);
    } else if (video) {
      video.playbackRate = rate;
    } else {
      isTogglingPlaybackSpeed = false;
      return false;
    }

    updatePlaybackSpeedUI(rate);
    return true;
  }

  function togglePlaybackSpeed(): boolean {
    const currentRate = getVideoElement()?.playbackRate;
    if (!Number.isFinite(currentRate)) {
      return false;
    }

    return setVideoSpeed(Math.abs(currentRate - 1) <= 0.001 ? lastSavedSpeed : 1);
  }

  function isEditableTarget(target: EventTarget | null): boolean {
    if (!(target instanceof Element)) {
      return false;
    }
    return !!target.closest(
      'input, textarea, select, [contenteditable], [role="textbox"]',
    );
  }

  function hasRequiredPlayerMethods(playerInstance) {
    return REQUIRED_PLAYER_METHODS.every((method) => {
      if (typeof playerInstance?.[method] === "function") {
        return true;
      }
      if (!methodHasFallback(method)) {
        return false;
      }
      return !!getVideoElement();
    });
  }

  function missingPlayerMethods(playerInstance) {
    return REQUIRED_PLAYER_METHODS.filter((method) => {
      if (typeof playerInstance?.[method] === "function") {
        return false;
      }
      if (!methodHasFallback(method)) {
        return true;
      }
      return !getVideoElement();
    });
  }

  async function waitForPlayerWithMethods(
    timeoutMs = PLAYER_METHOD_CHECK_TIMEOUT_MS,
  ) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const playerInstance = getActivePlayer();
      if (hasRequiredPlayerMethods(playerInstance)) {
        return playerInstance;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    const fallbackPlayer = getActivePlayer();
    if (hasRequiredPlayerMethods(fallbackPlayer)) {
      return fallbackPlayer;
    }
    return fallbackPlayer;
  }

  // Configuration for timestamp offset
  const OFFSET_KEY = "timestampOffsetSeconds";
  const DEFAULT_OFFSET = -5;

  // Configuration for shift-click time skip interval
  const SHIFT_SKIP_KEY = "shiftClickTimeSkipSeconds";
  const DEFAULT_SHIFT_SKIP = 10;

  // Default pane size when none is stored in the DB
  const DEFAULT_PANE_WIDTH = 300;
  const DEFAULT_PANE_HEIGHT = 300;

  // Create a BroadcastChannel for cross-tab communication only when on www.youtube.com
  let channel: BroadcastChannel | null = null;

  function isYouTubeOrigin() {
    try {
      return new URL(window.location.href).origin === "https://www.youtube.com";
    } catch (err) {
      return false;
    }
  }

  function ensureChannel() {
    if (!isYouTubeOrigin()) return;
    if (!channel) {
      try {
        channel = new BroadcastChannel("ytls_timestamp_channel");
        channel.onmessage = handleChannelMessage;
      } catch (err) {
        log("Failed to create BroadcastChannel:", err, "warn");
        channel = null;
      }
    }
  }

  // Safe wrapper for posting messages to avoid "Channel is closed" errors
  function safePostMessage(message: unknown) {
    if (!isYouTubeOrigin()) {
      log(
        "Skipping BroadcastChannel message: not on https://www.youtube.com",
        "warn",
      );
      return;
    }
    ensureChannel();
    if (!channel) {
      log("No BroadcastChannel available to post message", "warn");
      return;
    }
    try {
      channel.postMessage(message);
    } catch (err) {
      log("BroadcastChannel error, reopening:", err, "warn");
      try {
        channel = new BroadcastChannel("ytls_timestamp_channel");
        channel.onmessage = handleChannelMessage;
        channel.postMessage(message);
      } catch (reopenErr) {
        log("Failed to reopen BroadcastChannel:", reopenErr, "error");
      }
    }
  }

  // Listen for messages from other tabs
  function handleChannelMessage(event: MessageEvent) {
    log("Received message from another tab:", event.data);
    if (!isSupportedUrl() || !list || !pane) {
      return;
    }
    if (event.data) {
      if (
        event.data.type === "timestamps_updated" &&
        event.data.videoId === currentLoadedVideoId
      ) {
        log(
          "Debouncing timestamp load due to external update for video:",
          event.data.videoId,
        );
        clearTimeout(loadTimeoutId);
        loadTimeoutId = setTimeout(() => {
          log(
            "Reloading timestamps due to external update for video:",
            event.data.videoId,
          );
          loadTimestamps();
        }, 500);
      } else if (event.data.type === "window_position_updated" && pane) {
        const pos = event.data.position;
        if (pos && typeof pos.x === "number" && typeof pos.y === "number") {
          pane.style.left = `${pos.x}px`;
          pane.style.top = `${pos.y}px`;
          pane.style.right = "auto";
          pane.style.bottom = "auto";
          if (typeof pos.width === "number" && pos.width > 0) {
            pane.style.width = `${pos.width}px`;
          }
          if (typeof pos.height === "number" && pos.height > 0) {
            pane.style.height = `${pos.height}px`;
          }
          const rect = pane.getBoundingClientRect();
          setPanePositionState({
            x: Math.round(pos.x),
            y: Math.round(pos.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          });
          // Only clamp if pane is outside viewport
          const viewportWidth = document.documentElement.clientWidth;
          const viewportHeight = document.documentElement.clientHeight;
          if (
            rect.left < 0 ||
            rect.top < 0 ||
            rect.right > viewportWidth ||
            rect.bottom > viewportHeight
          ) {
            clampPaneToViewport();
          }
        }
      }
    }
  }
  // Initialize BroadcastChannel listener if on www.youtube.com
  ensureChannel();

  // The user can configure 'timestampOffsetSeconds' in ViolentMonkey's script values.
  // A positive value will make it after current time, negative before.
  let configuredOffset = await getExtensionStorageValue<number>(OFFSET_KEY);
  if (typeof configuredOffset !== "number" || Number.isNaN(configuredOffset)) {
    configuredOffset = DEFAULT_OFFSET;
    await setExtensionStorageValue(OFFSET_KEY, configuredOffset);
  }

  let configuredShiftSkip =
    await getExtensionStorageValue<number>(SHIFT_SKIP_KEY);
  if (
    typeof configuredShiftSkip !== "number" ||
    Number.isNaN(configuredShiftSkip)
  ) {
    configuredShiftSkip = DEFAULT_SHIFT_SKIP;
    await setExtensionStorageValue(SHIFT_SKIP_KEY, configuredShiftSkip);
  }

  let loadTimeoutId: ReturnType<typeof setTimeout> | null = null; // Variable to hold the timeout ID for debouncing loads from broadcast
  // Debounced comment saves still waiting on their timer, per GUID. `flush` persists
  // immediately with the video id captured when the user typed, so navigation or page
  // unload can neither drop an edit nor file it under the next video.
  const pendingCommentSaves = new Map<
    string,
    { timeoutId: ReturnType<typeof setTimeout>; flush: () => void }
  >();
  let isMouseOverTimestamps = false; // Default to false
  let settingsModalInstance: HTMLDivElement | null = null; // To keep a reference to the settings modal
  let settingsCogButtonElement: HTMLButtonElement | null = null; // To keep a reference to the settings cog button
  let currentLoadedVideoId: string | null = null; // Track the currently loaded video to prevent duplicate loads
  let visibilityAnimationTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let visibilitySizingTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let scrollbarHideTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let scrollbarTrack: HTMLDivElement | null = null;
  let scrollbarThumb: HTMLDivElement | null = null;
  let isScrollbarDragging = false;
  // Module-level ref set by initializePane; avoids polluting window globals
  let recalculateTimestampsAreaFn: (() => void) | null = null;
  // When timestamps are loaded while a show animation is running, build the DOM nodes
  // but defer appending them to the visible list until the animation completes.
  let pendingTimestampsFragment: DocumentFragment | null = null;
  let pendingTimestampsPromise: Promise<void> | null = null;
  let pendingTimestampsResolve: (() => void) | null = null;
  let headerButtonImage: HTMLImageElement | null = null;
  let isHeaderButtonHovered = false;
  let isPaneInitializing = false; // Lock flag to prevent concurrent pane initialization

  // Event listener references for cleanup to prevent memory leaks
  let documentMousemoveHandler: ((e: MouseEvent) => void) | null = null;
  let documentMouseupHandler: (() => void) | null = null;
  let windowResizeHandler: (() => void) | null = null;
  let videoTimeupdateHandler: (() => void) | null = null;
  let videoPauseHandler: (() => void) | null = null;
  let videoPlayHandler: (() => void) | null = null;
  let videoSeekingHandler: (() => void) | null = null;
  let videoRatechangeHandler: (() => void) | null = null;
  let keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  // Track pointer activity to distinguish intentional blur from OS UI (emoji picker)
  let docPointerDownHandler: ((e: PointerEvent) => void) | null = null;
  let docPointerUpHandler: ((e: PointerEvent) => void) | null = null;
  // Observers for pane layout and mutation - stored so they can be disconnected to avoid leaks
  let paneObserver: MutationObserver | null = null;
  let paneResizeObserver: ResizeObserver | null = null;
  let lastPointerDownTs = 0;
  // Suppress list-driven sorts while focus is temporarily lost to OS UI (e.g., emoji picker)
  let suppressSortUntilRefocus = false;
  // Track the most recently modified timestamp (GUID) for negative-diff-based sorting
  let mostRecentlyModifiedTimestampGuid: string | null = null;

  // Global cache for latest timestamp value
  let latestTimestampValue: number | null = null;

  /**
   * Cached snapshot of the timestamp rows and their start times, so the per-second
   * playback tick doesn't re-query and re-parse the DOM for every row.
   *  - items:    the row elements, in DOM order
   *  - starts:   parseInt(data-time) per row, NaN when missing/invalid (used for highlighting)
   *  - rawTimes: parseFloat(data-time) per row, 0 when missing (used for per-minute stats)
   * Callers must treat the arrays as read-only.
   */
  type TimestampIndex = {
    items: HTMLLIElement[];
    starts: number[];
    rawTimes: number[];
  };
  let timestampIndex: TimestampIndex | null = null;
  let timestampIndexList: HTMLUListElement | null = null;
  let timestampIndexObserver: MutationObserver | null = null;

  function getTimestampIndex(): TimestampIndex {
    if (!list) {
      return { items: [], starts: [], rawTimes: [] };
    }
    if (timestampIndexList !== list || !timestampIndexObserver) {
      timestampIndexObserver?.disconnect();
      timestampIndexObserver = new MutationObserver(() => {
        timestampIndex = null;
      });
      timestampIndexObserver.observe(list, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["data-time"],
      });
      timestampIndexList = list;
      timestampIndex = null;
    } else if (timestampIndexObserver.takeRecords().length > 0) {
      // Observer callbacks are async; draining here keeps same-tick reads fresh.
      timestampIndex = null;
    }
    if (!timestampIndex) {
      const items = TimestampView.getTimestampItems(list);
      const starts: number[] = new Array(items.length);
      const rawTimes: number[] = new Array(items.length);
      for (let i = 0; i < items.length; i++) {
        const timeValue = items[i].querySelector<HTMLElement>("[data-time]")
          ?.dataset.time;
        starts[i] = timeValue ? Number.parseInt(timeValue, 10) : NaN;
        rawTimes[i] = timeValue ? parseFloat(timeValue) : 0;
      }
      timestampIndex = { items, starts, rawTimes };
    }
    return timestampIndex;
  }

  // Using view module for UI operations
  function getTimestampItems(): HTMLLIElement[] {
    return getTimestampIndex().items;
  }

  // Utility to extract timestamp records from UI
  function extractTimestampRecords(): TimestampRecord[] {
    return TimestampView.extractTimestampRecords(list);
  }

  function getLatestTimestampValue(): number {
    if (latestTimestampValue !== null) {
      return latestTimestampValue;
    }
    latestTimestampValue = TimestampView.getLatestTimestampValue(list);
    return latestTimestampValue;
  }

  function invalidateLatestTimestampValue() {
    latestTimestampValue = null;
  }

  // Video length in seconds, or 0 when unknown (e.g. metadata not loaded).
  function getVideoDuration(
    player: any = getActivePlayer(),
    video: HTMLVideoElement | null = getVideoElement(),
  ): number {
    const playerDuration = player?.getDuration?.();
    if (Number.isFinite(playerDuration) && playerDuration > 0) {
      return playerDuration;
    }
    return Number.isFinite(video?.duration) && video.duration > 0
      ? video.duration
      : 0;
  }

  // Width reference for displayed times: the video length, else the latest timestamp.
  function getDisplayMaxTime(): number {
    return getVideoDuration() || getLatestTimestampValue();
  }

  function hasNegativeTimeDifference(li: HTMLLIElement): boolean {
    const timeDiffSpan = li.querySelector<HTMLSpanElement>(".time-diff");
    if (!timeDiffSpan) return false;
    const text = timeDiffSpan.textContent?.trim() || "";
    return text.startsWith("-");
  }

  // Indent marker constants
  const INDENT_MARKER_BRANCH = "├─ ";
  const INDENT_MARKER_CORNER = "└─ ";
  const INDENT_REGEX = /^[├└]─\s/;

  function isIndented(commentText: string): boolean {
    return INDENT_REGEX.test(commentText);
  }

  function removeIndentMarker(commentText: string): string {
    return commentText.replace(INDENT_REGEX, "");
  }

  /**
   * Get the appropriate indent marker for an item at the given index.
   * Returns the branch marker (├─ ) if there's another indented item following,
   * or the corner marker (└─ ) if this is the last indented item.
   */
  function getMarkerForIndex(itemIndex: number): string {
    const items = getTimestampItems();
    const isLastItem = itemIndex >= items.length - 1;

    if (isLastItem) {
      return INDENT_MARKER_CORNER;
    }

    const nextItem = items[itemIndex + 1];
    const nextInput = nextItem.querySelector<HTMLInputElement>("input");
    const nextIsIndented = nextInput && isIndented(nextInput.value);

    return nextIsIndented ? INDENT_MARKER_BRANCH : INDENT_MARKER_CORNER;
  }

  /**
   * Get the full comment text with the appropriate indent marker.
   */
  function getIndentedComment(cleanComment: string, itemIndex: number): string {
    return `${getMarkerForIndex(itemIndex)}${cleanComment}`;
  }

  function updateIndentMarkers() {
    if (!list) return;
    const items = getTimestampItems();

    // Single forward pass is sufficient: each item's marker depends only on whether
    // the *next* item is indented, which we read but never modify in this pass.
    items.forEach((item, index) => {
      const input = item.querySelector<HTMLInputElement>("input");
      if (!input || !isIndented(input.value)) return;

      const cleanComment = removeIndentMarker(input.value);
      const newValue = getIndentedComment(cleanComment, index);

      if (input.value !== newValue) {
        input.value = newValue;
      }
    });
  }

  function clearTimestampsDisplay() {
    TimestampView.clearTimestampsDisplay(list);

    // If there's a pending fragment (timestamps built but not yet appended because the UI
    // is animating), clear it and resolve any awaiting promise so callers don't hang.
    if (pendingTimestampsFragment) {
      pendingTimestampsFragment = null;
    }
    if (pendingTimestampsResolve) {
      pendingTimestampsResolve();
      pendingTimestampsResolve = null;
      pendingTimestampsPromise = null;
    }
  }

  // Ensure that when there are no timestamps shown, a friendly placeholder appears
  function ensureEmptyPlaceholder() {
    TimestampView.ensureEmptyPlaceholder(list, isLoadingTimestamps);
  }

  // Display a centered placeholder message inside the timestamps list
  function showListPlaceholder(message: string) {
    TimestampView.showListPlaceholder(list, message);
  }

  function clearListPlaceholder() {
    TimestampView.clearListPlaceholder(list);
  }

  function setLoadingState(loading: boolean) {
    if (!pane || !list) return;

    isLoadingTimestamps = loading;

    if (loading) {
      // Show the pane and display a placeholder message while we load timestamps
      pane.style.display = "";
      pane.classList.remove("ytls-fade-out");
      pane.classList.add("ytls-fade-in");
      showListPlaceholder("Loading timestamps...");
    } else {
      // Remove any loading placeholder and show the pane
      clearListPlaceholder();
      pane.style.display = "";
      pane.classList.remove("ytls-fade-out");
      pane.classList.add("ytls-fade-in");

      // Update CT display now that loading is done
      if (timeDisplay) {
        const playerInstance = getActivePlayer();
        if (playerInstance) {
          const rawTime = playerInstance.getCurrentTime();
          const currentSeconds = Number.isFinite(rawTime)
            ? Math.max(0, Math.floor(rawTime))
            : Math.max(0, getLatestTimestampValue());

          const timestamps = list ? getTimestampIndex().rawTimes : [];

          timeDisplay.textContent = formatTimeDisplay(
            currentSeconds,
            timestamps,
            getVideoDuration(playerInstance),
          );
        }
      }
    }

    // Ensure empty placeholder is shown now that loading finished
    if (
      !isLoadingTimestamps &&
      list &&
      !TimestampView.hasPaneError(list)
    ) {
      ensureEmptyPlaceholder();
    }

    syncToggleButtons();
  }

  function formatTime(anchor: HTMLElement, timeInSeconds: number) {
    anchor.dataset.time = String(timeInSeconds);
    anchor.textContent = formatTimeString(timeInSeconds, getDisplayMaxTime());
  }

  // Debounce state for seeking
  let seekTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let pendingSeekTime: number | null = null;

  let isSeeking = false;

  // Detect whether playback is behind the live edge using YouTube player internals.
  // `knownIsLive` lets per-tick callers that already read getVideoData() skip a second call
  // (YouTube builds a fresh ~30-key object on every getVideoData()).
  function isBehindLiveEdge(playerInstance: any, knownIsLive?: boolean): boolean {
    if (!playerInstance || typeof playerInstance.getVideoData !== "function") {
      return false;
    }
    const isLive =
      knownIsLive !== undefined
        ? knownIsLive
        : !!playerInstance.getVideoData()?.isLive;
    if (!isLive) {
      return false;
    }

    // Use YouTube's progress state if available to avoid relying on the HTML5 video element.
    if (typeof playerInstance.getProgressState === "function") {
      const state = playerInstance.getProgressState();
      const liveHead = Number(
        state?.seekableEnd ?? state?.liveHead ?? state?.head ?? state?.duration,
      );
      const current = Number(
        state?.current ?? playerInstance.getCurrentTime?.(),
      );

      if (Number.isFinite(liveHead) && Number.isFinite(current)) {
        // Consider a small threshold to avoid flicker at the edge.
        return liveHead - current > 2;
      }
    }

    return false;
  }

  function highlightNearestTimestampAtTime(
    currentSeconds: number,
    shouldScroll: boolean,
  ) {
    if (!Number.isFinite(currentSeconds)) {
      return;
    }

    const nearestLi = findNearestTimestamp(currentSeconds);
    highlightTimestamp(nearestLi, shouldScroll);
  }

  /**
   * Auto highlight helper: computes the proper current time (player or latest) and highlights
   * the nearest timestamp unless the pointer is over the Timekeeper UI. Optionally accepts a
   * precomputed `currentSeconds` to avoid recomputing.
   */
  function autoHighlightNearest(shouldScroll = false, currentSeconds?: number) {
    // If pointer is over the UI, skip automatic highlight unless caller explicitly requests scrolling
    if (isMouseOverTimestamps && !shouldScroll) return;

    let currentTime: number;
    if (typeof currentSeconds === "number" && Number.isFinite(currentSeconds)) {
      currentTime = Math.max(0, Math.floor(currentSeconds));
    } else {
      const player = getActivePlayer();
      const rawTime = player ? player.getCurrentTime() : NaN;
      currentTime = Number.isFinite(rawTime)
        ? Math.max(0, Math.floor(rawTime))
        : Math.max(0, getLatestTimestampValue());
    }

    if (Number.isFinite(currentTime)) {
      highlightNearestTimestampAtTime(currentTime, shouldScroll);
    }
  }

  // Find and return the nearest timestamp at or before the given time
  function findNearestTimestamp(currentTime: number): HTMLLIElement | null {
    if (!Number.isFinite(currentTime)) {
      return null;
    }

    const { items, starts } = getTimestampIndex();

    let nearestIndex = -1;
    let largestTimestamp = -Infinity;

    for (let i = 0; i < starts.length; i++) {
      const timestamp = starts[i];
      // Only consider timestamps at or before the current time (NaN never matches)
      if (timestamp <= currentTime && timestamp > largestTimestamp) {
        largestTimestamp = timestamp;
        nearestIndex = i;
      }
    }

    return nearestIndex >= 0 ? items[nearestIndex] : null;
  }

  // Highlight a timestamp and optionally scroll it into view
  function highlightTimestamp(li: HTMLLIElement | null, shouldScroll = false) {
    // Fast path: the DOM already shows exactly this highlight (the common case on every
    // playback tick), so skip the O(rows) clear. Checked against the DOM rather than a
    // cached "last highlighted" because several other code paths also toggle the class.
    const highlighted = list
      ? list.getElementsByClassName(TIMESTAMP_HIGHLIGHT_CLASS)
      : null;
    const alreadyHighlighted =
      !!highlighted &&
      (li
        ? highlighted.length === 1 && highlighted[0] === li
        : highlighted.length === 0);

    if (!alreadyHighlighted && highlighted) {
      // Only the rows that carry the class need clearing; the live collection shrinks as
      // we remove it, so snapshot first.
      for (const item of Array.from(highlighted)) {
        if (!item.classList.contains(TIMESTAMP_DELETE_CLASS)) {
          item.classList.remove(TIMESTAMP_HIGHLIGHT_CLASS);
        }
      }
    }

    if (!li) return;

    if (!li.classList.contains(TIMESTAMP_DELETE_CLASS)) {
      li.classList.add(TIMESTAMP_HIGHLIGHT_CLASS);

      if (shouldScroll) {
        try {
          // If the timestamp list is present, only scroll when the element is not already visible
          if (list instanceof HTMLElement) {
            const liRect = li.getBoundingClientRect();
            const listRect = list.getBoundingClientRect();
            const isVisible = !(
              liRect.bottom < listRect.top || liRect.top > listRect.bottom
            );
            if (!isVisible) {
              li.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          } else {
            // Fallback: if we don't have a list container reference, just scroll
            li.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } catch (e) {
          // Be defensive: if geometry checks fail for any reason, fallback to scrolling
          try {
            li.scrollIntoView({ behavior: "smooth", block: "center" });
          } catch (_) { }
        }
      }
    }
  }

  function offsetAllTimestamps(delta: number): boolean {
    if (isEditingBlocked()) return false;

    if (!Number.isFinite(delta) || delta === 0) {
      return false;
    }

    const items = getTimestampItems();
    if (items.length === 0) {
      return false;
    }

    const changedRows: TimestampRecord[] = [];

    items.forEach((li) => {
      const anchor = li.querySelector<HTMLElement>("[data-time]");
      const timeValue = anchor?.dataset.time;
      if (!anchor || !timeValue) {
        return;
      }

      const currentTime = Number.parseInt(timeValue, 10);
      if (!Number.isFinite(currentTime)) {
        return;
      }

      const newTime = Math.max(0, currentTime + delta);
      if (newTime !== currentTime) {
        formatTime(anchor, newTime);
        const guid = li.dataset.guid;
        if (guid) {
          changedRows.push({
            guid,
            start: newTime,
            comment: li.querySelector<HTMLInputElement>("input")?.value ?? "",
          });
        }
      }
    });

    if (changedRows.length === 0) {
      return false;
    }

    updateTimeDifferences();
    updateIndentMarkers();
    updateSeekbarMarkers();
    syncTimestampStateFromUI();
    saveTimestampRows(currentLoadedVideoId, changedRows);
    mostRecentlyModifiedTimestampGuid = null;
    return true;
  }

  type OffsetApplicationOptions = {
    alertOnNoChange?: boolean;
    failureMessage?: string;
    logLabel?: string;
  };

  function applyOffsetToAllTimestamps(
    delta: number,
    options: OffsetApplicationOptions = {},
  ): boolean {
    if (!Number.isFinite(delta) || delta === 0) {
      return false;
    }

    const applied = offsetAllTimestamps(delta);
    if (!applied) {
      if (options.alertOnNoChange) {
        const message =
          options.failureMessage ?? "Offset did not change any timestamps.";
        alert(message);
      }
      return false;
    }

    const label = options.logLabel ?? "bulk offset";
    log(
      `Timestamps changed: Offset all timestamps by ${delta > 0 ? "+" : ""}${delta} seconds (${label})`,
    );

    const player = getActivePlayer();
    const currentTime = player ? Math.floor(player.getCurrentTime()) : 0;
    if (Number.isFinite(currentTime)) {
      const nearestLi = findNearestTimestamp(currentTime);
      highlightTimestamp(nearestLi, false);
    }

    return true;
  }

  function handleClick(event: MouseEvent | TouchEvent) {
    if (!list || isLoadingTimestamps) {
      return;
    }

    const target = event.target instanceof Element ? event.target : null;
    if (!target) {
      return;
    }

    const timeTarget = target.closest<HTMLElement>("[data-time]");
    const incrementTarget = target.closest<HTMLElement>("[data-increment]");
    const actionTarget = target.closest<HTMLElement>("[data-action]");

    if (timeTarget?.dataset.time) {
      event.preventDefault();
      const newTime = Number(timeTarget.dataset.time);
      if (Number.isFinite(newTime)) {
        log(`Seeking to timestamp ${newTime}`);
        isSeeking = true;
        const player = getActivePlayer();
        if (player) { player.seekTo(newTime); }
        setTimeout(() => {
          isSeeking = false;
        }, 500);
      }
      const clickedLi = timeTarget.closest("li") as HTMLLIElement | null;
      if (clickedLi) {
        getTimestampItems().forEach((item) => {
          if (!item.classList.contains(TIMESTAMP_DELETE_CLASS)) {
            item.classList.remove(TIMESTAMP_HIGHLIGHT_CLASS);
          }
        });
        if (!clickedLi.classList.contains(TIMESTAMP_DELETE_CLASS)) {
          clickedLi.classList.add(TIMESTAMP_HIGHLIGHT_CLASS);
          clickedLi.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    } else if (incrementTarget?.dataset.increment) {
      event.preventDefault();

      const timestampLi = incrementTarget.closest("li");
      const timeLink =
        timestampLi?.querySelector<HTMLElement>("[data-time]");
      if (!timeLink || !timeLink.dataset.time) {
        return;
      }

      const currTime = parseInt(timeLink.dataset.time, 10);
      let increment = parseInt(incrementTarget.dataset.increment, 10);

      const shiftPressed = "shiftKey" in event ? event.shiftKey : false;
      if (shiftPressed) {
        increment *= configuredShiftSkip;
      }

      const altPressed = "altKey" in event ? event.altKey : false;
      if (altPressed) {
        applyOffsetToAllTimestamps(increment, { logLabel: "Alt adjust" });
        return;
      }

      const newTime = Math.max(0, currTime + increment);
      log(
        `Timestamps changed: Timestamp time incremented from ${currTime} to ${newTime}`,
      );
      invalidateLatestTimestampValue();
      formatTime(timeLink, newTime);

      pendingSeekTime = newTime;
      if (seekTimeoutId) {
        clearTimeout(seekTimeoutId);
      }
      isSeeking = true;
      seekTimeoutId = setTimeout(() => {
        if (pendingSeekTime !== null) {
          const player = getActivePlayer();
          if (player) player.seekTo(pendingSeekTime);
        }
        seekTimeoutId = null;
        pendingSeekTime = null;
        setTimeout(() => {
          isSeeking = false;
        }, 500);
      }, 500);

      updateTimeDifferences();
      updateIndentMarkers();
      updateSeekbarMarkers();

      // Save the modified timestamp
      if (timestampLi) {
        const tsCommentInput =
          timestampLi.querySelector<HTMLInputElement>("input");
        const tsGuid = timestampLi.dataset.guid;
        if (tsCommentInput && tsGuid) {
          saveSingleTimestampDirect(
            currentLoadedVideoId,
            tsGuid,
            newTime,
            tsCommentInput.value,
          );
          mostRecentlyModifiedTimestampGuid = tsGuid;
        }
      }
    } else if (actionTarget?.dataset.action === "clear") {
      event.preventDefault();
      log("Timestamps changed: All timestamps cleared from UI");
      list.textContent = "";
      invalidateLatestTimestampValue();
      updateSeekbarMarkers();
      updateScroll();
      // Drop typed-but-unsaved edits so they can't resurrect the rows we're clearing
      cancelPendingCommentSaves();
      setTimestampsInState([]);
      clearVideoTimestamps(currentLoadedVideoId);
      mostRecentlyModifiedTimestampGuid = null;
      // Show placeholder when the list is empty after a clear
      ensureEmptyPlaceholder();
    }
  }

  function addTimestamp(
    start: number,
    comment = "",
    doNotSave = false,
    guid: string | null = null,
    appendToList = true,
  ) {
    if (!list) {
      return null;
    }

    const sanitizedStart = Math.max(0, start);
    const timestampGuid = guid ?? crypto.randomUUID();

    const li = document.createElement("li");
    const timeRow = document.createElement("div");
    const minus = document.createElement("span");
    const record = document.createElement("span");
    const plus = document.createElement("span");
    const controlsWrap = document.createElement("div");
    const anchor = document.createElement("span");
    const timeDiff = document.createElement("span");
    const commentInput = document.createElement("input");
    const del = document.createElement("button");

    li.dataset.guid = timestampGuid;

    timeRow.className = "time-row";
    controlsWrap.className = "ytls-row-controls";

    // Setup indent gutter - displays in left margin without affecting layout
    const indentGutter = document.createElement("div");
    indentGutter.style.cssText =
      "position:absolute;left:0;top:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;";
    addTooltip(indentGutter, "Click to toggle indent");

    const indentToggle = document.createElement("span");
    indentToggle.style.cssText =
      "color:#f4ba78;pointer-events:none;display:none;line-height:0;";

    const syncIndentGutterPosition = () => {
      const inputTop = commentInput.offsetTop;
      const inputHeight = commentInput.offsetHeight || 20;
      indentGutter.style.top = `${inputTop}px`;
      indentGutter.style.height = `${inputHeight}px`;
    };

    // Helper function to update arrow icon based on current indent state
    const updateArrowIcon = () => {
      setIcon(
        indentToggle,
        isIndented(commentInput.value) ? "indent-decrease" : "indent-increase",
        18,
      );
    };

    const indentIconGlow =
      "drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)";
    const setIndentIconGlow = (enabled: boolean) => {
      const icon = indentToggle.querySelector<SVGElement>("svg");
      if (icon) {
        icon.style.transition = "filter 0.15s ease";
        icon.style.filter = enabled ? indentIconGlow : "none";
      }
    };

    // Handle indent toggle on entire gutter click
    const handleIndentToggle = (e: Event) => {
      e.stopPropagation();
      const currentlyIndented = isIndented(commentInput.value);
      const cleanComment = removeIndentMarker(commentInput.value);

      // Determine marker based on list context when indenting
      let marker = "";
      if (!currentlyIndented) {
        const items = getTimestampItems();
        const currentIndex = items.indexOf(li);
        marker = getMarkerForIndex(currentIndex);
      }

      commentInput.value = marker ? `${marker}${cleanComment}` : cleanComment;

      // Immediately update arrow icon
      updateArrowIcon();
      updateIndentMarkers();
      const currentTime = Number.parseInt(anchor.dataset.time ?? "0", 10);
      saveSingleTimestampDirect(
        currentLoadedVideoId,
        timestampGuid,
        currentTime,
        commentInput.value,
      );
    };

    indentGutter.onclick = handleIndentToggle;
    indentGutter.append(indentToggle);
    indentGutter.addEventListener("mouseenter", () => {
      setIndentIconGlow(true);
    });
    indentGutter.addEventListener("mouseleave", () => {
      setIndentIconGlow(false);
    });

    // Add padding to li for gutter space
    li.style.cssText = "position:relative;padding-left:20px;";

    li.addEventListener("mouseenter", () => {
      // Update arrow direction based on current indent state
      syncIndentGutterPosition();
      updateArrowIcon();
      indentToggle.style.display = "inline";
    });

    li.addEventListener("mouseleave", () => {
      setIndentIconGlow(false);
      indentToggle.style.display = "none";
    });

    // Add mouseleave listener to check for negative time diff and sort if needed
    li.addEventListener("mouseleave", () => {
      // Only sort immediately if this is the most recently modified timestamp and it has a negative diff
      if (
        li.dataset.guid === mostRecentlyModifiedTimestampGuid &&
        hasNegativeTimeDifference(li)
      ) {
        sortTimestampsAndUpdateDisplay();
      }
    });

    commentInput.value = comment || "";
    commentInput.style.cssText = "width:100%;margin-top:5px;display:block;";
    commentInput.type = "text";
    commentInput.setAttribute("inputmode", "text");
    commentInput.autocapitalize = "off" as any;
    commentInput.autocomplete = "off";
    commentInput.spellcheck = false;
    requestAnimationFrame(syncIndentGutterPosition);

    // Track when Escape key is used to blur, to prevent auto-refocus
    let blurredViaEscape = false;

    commentInput.addEventListener("focusin", () => {
      suppressSortUntilRefocus = false;
      blurredViaEscape = false; // Reset flag when input is focused
    });
    // If blur occurs without recent pointer interaction and without a local focus target, restore focus
    commentInput.addEventListener("focusout", (ev) => {
      const rt = (ev as FocusEvent).relatedTarget as Element | null;
      const recentPointer = Date.now() - lastPointerDownTs < 250;
      const movingWithinPane = !!rt && !!pane && pane.contains(rt);
      // Don't refocus if user pressed Escape to blur
      if (!recentPointer && !movingWithinPane && !blurredViaEscape) {
        suppressSortUntilRefocus = true;
        setTimeout(() => {
          // If nothing else took focus, restore here
          if (
            document.activeElement === document.body ||
            document.activeElement == null
          ) {
            commentInput.focus({ preventScroll: true });
            suppressSortUntilRefocus = false;
          }
        }, 0);
      }
    });
    // Remove focus on Escape key so hotkeys can be used
    commentInput.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" || ev.key === "Esc") {
        ev.preventDefault();
        blurredViaEscape = true; // Set flag before blurring
        commentInput.blur();
      }
    });
    // Debounced save of this row's comment. The video id is captured now rather than when
    // the timer fires, and flushPendingCommentSaves() can run the save early.
    const scheduleCommentSave = (delayMs: number) => {
      const existing = pendingCommentSaves.get(timestampGuid);
      if (existing) {
        clearTimeout(existing.timeoutId);
      }

      const videoIdAtEdit = currentLoadedVideoId;
      const flush = () => {
        const entry = pendingCommentSaves.get(timestampGuid);
        if (entry) {
          clearTimeout(entry.timeoutId);
          pendingCommentSaves.delete(timestampGuid);
        }
        persistTimestamp(
          videoIdAtEdit,
          timestampGuid,
          Number.parseInt(anchor.dataset.time ?? "0", 10),
          commentInput.value,
        );
      };
      pendingCommentSaves.set(timestampGuid, {
        timeoutId: setTimeout(flush, delayMs),
        flush,
      });
    };
    // Save on input, but avoid saving mid-composition (IME/emoji picker)
    commentInput.addEventListener("input", (ev) => {
      const ie = ev as InputEvent;
      if (ie && (ie.isComposing || ie.inputType === "insertCompositionText")) {
        return;
      }
      // Debounce comment saves with 500ms delay
      scheduleCommentSave(500);
    });
    // Commit a quick save when composition ends (e.g., emoji/IME finalized)
    commentInput.addEventListener("compositionend", () => {
      // Let the finalized character land, then save
      scheduleCommentSave(50);
    });

    const rowIconColor = "#f4ba78";
    const rowIconGlow =
      "drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)";
    const trashIconColor = "#c8452d";
    const trashIconGlow =
      "drop-shadow(0 0 4px #e36a52) drop-shadow(0 0 8px #e36a52)";
    const applyRowIconInteraction = (
      element: HTMLElement,
      color = rowIconColor,
      glow = rowIconGlow,
    ) => {
      element.style.color = color;
      const icon = element.querySelector<SVGElement>("svg");
      if (icon) {
        icon.style.transition = "filter 0.15s ease";
      }
      element.addEventListener("mouseenter", () => {
        if (icon) {
          icon.style.filter = glow;
        }
      });
      element.addEventListener("mouseleave", () => {
        if (icon) {
          icon.style.filter = "none";
        }
      });
    };

    setIcon(minus, "circle-minus", 18);
    minus.classList.add("ytls-row-control");
    minus.dataset.increment = "-1";
    minus.style.cursor = "pointer";
    minus.style.margin = "0px";
    applyRowIconInteraction(minus);

    setIcon(plus, "circle-plus", 18);
    plus.classList.add("ytls-row-control");
    plus.dataset.increment = "1";
    plus.style.cursor = "pointer";
    plus.style.margin = "0px";
    applyRowIconInteraction(plus);

    setIcon(record, "current-location", 18);
    record.classList.add("ytls-row-control");
    record.style.cursor = "pointer";
    record.style.margin = "0px";
    addTooltip(record, "Set to current playback time");
    applyRowIconInteraction(record);
    record.onclick = () => {
      const player = getActivePlayer();
      const currentTime = player ? Math.floor(player.getCurrentTime()) : 0;
      if (Number.isFinite(currentTime)) {
        log(`Timestamps changed: set to current playback time ${currentTime}`);
        invalidateLatestTimestampValue();
        formatTime(anchor, currentTime);
        updateTimeDifferences();
        updateIndentMarkers();
        saveSingleTimestampDirect(
          currentLoadedVideoId,
          timestampGuid,
          currentTime,
          commentInput.value,
        );
        mostRecentlyModifiedTimestampGuid = timestampGuid;
      }
    };

    invalidateLatestTimestampValue();
    formatTime(anchor, sanitizedStart);

    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const newTime = Number(anchor.dataset.time);
      if (!Number.isFinite(newTime)) return;
      log(`Seeking to timestamp ${newTime}`);
      isSeeking = true;
      const player = getActivePlayer();
      if (player) { player.seekTo(newTime); }
      const videoElement = getVideoElement();
      if (videoElement?.paused) videoElement.play();
      setTimeout(() => { isSeeking = false; }, 500);
      list
        ?.querySelectorAll<HTMLElement>(`.${TIMESTAMP_HIGHLIGHT_CLASS}`)
        .forEach((item) => item.classList.remove(TIMESTAMP_HIGHLIGHT_CLASS));
      if (!li.classList.contains(TIMESTAMP_DELETE_CLASS)) {
        li.classList.add(TIMESTAMP_HIGHLIGHT_CLASS);
        li.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });

    setIcon(del, "trash", 16);
    del.classList.add("ytls-row-control");
    del.style.cssText =
      "background:transparent;border:none;cursor:pointer;margin-left:5px;display:inline-flex;align-items:center;";
    applyRowIconInteraction(del, trashIconColor, trashIconGlow);
    del.onclick = () => {
      // Track the timeout so we can cancel it if the timestamp is removed early
      let cancelTimeoutId: ReturnType<typeof setTimeout> | null = null;

      // Forward declarations so cleanup works in all branches
      let cancelDeleteOnClick: ((event: Event) => void) | null = null;
      let cancelDeleteOnMouseLeave: (() => void) | null = null;

      // Helper to clean up listeners and timeout
      const cleanupDeleteListeners = () => {
        try {
          li.removeEventListener("click", cancelDeleteOnClick!, true);
        } catch (_) { }
        try {
          document.removeEventListener("click", cancelDeleteOnClick!, true);
        } catch (_) { }
        if (list) {
          try {
            list.removeEventListener("mouseleave", cancelDeleteOnMouseLeave!);
          } catch (_) { }
        }
        if (cancelTimeoutId) {
          clearTimeout(cancelTimeoutId);
          cancelTimeoutId = null;
        }
      };

      if (li.dataset.deleteConfirmed === "true") {
        log("Timestamps changed: Timestamp deleted");
        const guid = li.dataset.guid ?? "";

        // Remove any pending comment save for this GUID
        const pendingSave = pendingCommentSaves.get(guid);
        if (pendingSave) {
          clearTimeout(pendingSave.timeoutId);
          pendingCommentSaves.delete(guid);
        }

        // Clean up listeners immediately to avoid dangling document handlers
        cleanupDeleteListeners();

        li.remove();
        invalidateLatestTimestampValue();
        updateTimeDifferences();
        updateIndentMarkers();
        updateSeekbarMarkers();
        updateScroll();
        deleteSingleTimestamp(currentLoadedVideoId, guid);
        mostRecentlyModifiedTimestampGuid = null;
        // If this was the last timestamp, show the empty placeholder
        ensureEmptyPlaceholder();
      } else {
        li.dataset.deleteConfirmed = "true";
        li.classList.add(TIMESTAMP_DELETE_CLASS);
        li.classList.remove(TIMESTAMP_HIGHLIGHT_CLASS);

        // Helper function to cancel delete and restore previous state
        const doCancelDelete = () => {
          li.dataset.deleteConfirmed = "false";
          li.classList.remove(TIMESTAMP_DELETE_CLASS);
          // Restore highlight if the item should be highlighted
          const player = getActivePlayer();
          const currentTime = player ? player.getCurrentTime() : 0;
          const itemTime = Number.parseInt(
            li.querySelector<HTMLElement>("[data-time]")?.dataset.time ??
            "0",
            10,
          );
          if (
            Number.isFinite(currentTime) &&
            Number.isFinite(itemTime) &&
            currentTime >= itemTime
          ) {
            li.classList.add(TIMESTAMP_HIGHLIGHT_CLASS);
          }

          // Perform listener cleanup
          cleanupDeleteListeners();
        };

        // Add a click listener to cancel delete if clicking anywhere except the delete button
        cancelDeleteOnClick = (event: Event) => {
          const target = event.target as Element;
          // Only cancel if clicking on something that's not the delete button itself
          if (target !== del) {
            doCancelDelete();
          }
        };

        // Cancel delete if cursor leaves the full timestamp UI (the list)
        cancelDeleteOnMouseLeave = () => {
          if (li.dataset.deleteConfirmed === "true") {
            doCancelDelete();
          }
        };

        // Add listeners for this timestamp's li and the document
        li.addEventListener("click", cancelDeleteOnClick!, true);
        document.addEventListener("click", cancelDeleteOnClick!, true);
        if (list) {
          list.addEventListener("mouseleave", cancelDeleteOnMouseLeave!);
        }

        // Auto-cancel delete after a short timeout; store timeout id so it can be cancelled upon confirmed delete
        cancelTimeoutId = setTimeout(() => {
          if (li.dataset.deleteConfirmed === "true") {
            doCancelDelete();
          }
          // Clean up listeners even if timeout expires
          cleanupDeleteListeners();
        }, 5000);
      }
    };

    timeDiff.className = "time-diff";
    timeDiff.style.color = "#888";
    timeDiff.style.marginLeft = "5px";

    controlsWrap.append(minus, record, plus, del);
    timeRow.append(anchor, controlsWrap, timeDiff);
    li.append(indentGutter, timeRow, commentInput);

    const newTime = Number.parseInt(anchor.dataset.time ?? "0", 10);
    if (appendToList) {
      // If a placeholder is present (e.g., "No timestamps for this video"), remove it
      // immediately so the first timestamp replaces the placeholder.
      clearListPlaceholder();

      let inserted = false;
      const existingItems = getTimestampItems();

      for (let i = 0; i < existingItems.length; i++) {
        const existingLi = existingItems[i];
        const existingLink =
          existingLi.querySelector<HTMLElement>("[data-time]");
        const existingTimeStr = existingLink?.dataset.time;
        if (!existingTimeStr) {
          continue;
        }
        const existingTime = Number.parseInt(existingTimeStr, 10);
        if (!Number.isFinite(existingTime)) {
          continue;
        }

        if (newTime < existingTime) {
          list.insertBefore(li, existingLi);
          inserted = true;
          break;
        }
      }

      if (!inserted) {
        list.appendChild(li);
      }

      li.scrollIntoView({ behavior: "smooth", block: "center" });

      invalidateLatestTimestampValue();
      updateTimeDifferences();
      updateScroll();
      updateIndentMarkers();
      updateSeekbarMarkers();
      if (!doNotSave) {
        saveSingleTimestampDirect(
          currentLoadedVideoId,
          timestampGuid,
          sanitizedStart,
          comment,
        );
        mostRecentlyModifiedTimestampGuid = timestampGuid;
        // Immediately highlight the newly created timestamp
        highlightTimestamp(li, false);
      }
    } else {
      // Do not append to the live DOM yet; expose the constructed li for callers that are
      // building a fragment to append later.
      (commentInput as any).__ytls_li = li;
    }

    return commentInput;
  }

  function updateTimeDifferences() {
    if (isEditingBlocked()) return;

    const maxTime = getDisplayMaxTime();
    const items = getTimestampItems();
    items.forEach((item, index) => {
      const timeDiffSpan = item.querySelector<HTMLSpanElement>(".time-diff");
      const timeLink = item.querySelector<HTMLElement>("[data-time]");
      const currentTimeStr = timeLink?.dataset.time;

      // Reformat anchor text with shared maxTime (video length) so all timestamps use consistent width
      if (timeLink && currentTimeStr) {
        const t = Number.parseInt(currentTimeStr, 10);
        if (Number.isFinite(t)) {
          timeLink.textContent = formatTimeString(t, maxTime);
        }
      }

      if (!timeDiffSpan) {
        return;
      }
      if (!currentTimeStr) {
        timeDiffSpan.textContent = "";
        return;
      }
      const currentTime = Number.parseInt(currentTimeStr, 10);
      if (!Number.isFinite(currentTime)) {
        timeDiffSpan.textContent = "";
        return;
      }
      if (index === 0) {
        timeDiffSpan.textContent = "";
        return;
      }
      const prevItem = items[index - 1];
      const prevLink =
        prevItem.querySelector<HTMLElement>("[data-time]");
      const prevTimeStr = prevLink?.dataset.time;
      if (!prevTimeStr) {
        timeDiffSpan.textContent = "";
        return;
      }
      const prevTime = Number.parseInt(prevTimeStr, 10);
      if (!Number.isFinite(prevTime)) {
        timeDiffSpan.textContent = "";
        return;
      }
      const diff = currentTime - prevTime;
      const sign = diff < 0 ? "-" : "";
      timeDiffSpan.textContent = ` ${sign}${formatTimeString(Math.abs(diff))}`;
    });
  }

  function sortTimestampsAndUpdateDisplay() {
    if (isEditingBlocked()) return;

    // Capture caret/scroll for the currently focused input so we can restore after sorting
    let restoreState: {
      guid: string;
      start: number;
      end: number;
      scroll: number;
    } | null = null;
    if (
      document.activeElement instanceof HTMLInputElement &&
      list.contains(document.activeElement)
    ) {
      const activeInput = document.activeElement as HTMLInputElement;
      const activeLi = activeInput.closest("li");
      const guid = activeLi?.dataset.guid;
      if (guid) {
        const start = activeInput.selectionStart ?? activeInput.value.length;
        const end = activeInput.selectionEnd ?? start;
        const scroll = activeInput.scrollLeft;
        restoreState = { guid, start, end, scroll };
      }
    }

    const items = getTimestampItems();
    if (items.length === 0) return; // Nothing to sort when there are no timestamps

    // Capture original order to detect if reordering occurred
    const originalOrder = items.map((li) => li.dataset.guid);

    const sortedItems = items
      .map((li) => {
        const timeLink = li.querySelector<HTMLElement>("[data-time]");
        const timeValue = timeLink?.dataset.time;
        if (!timeLink || !timeValue) {
          return null;
        }
        const time = Number.parseInt(timeValue, 10);
        if (!Number.isFinite(time)) {
          return null;
        }
        const guid = li.dataset.guid ?? "";
        return { time, guid, element: li };
      })
      .filter(
        (
          item,
        ): item is { time: number; guid: string; element: HTMLLIElement } =>
          item !== null,
      )
      .sort((a, b) => {
        const timeDiff = a.time - b.time;
        if (timeDiff !== 0) {
          return timeDiff;
        }
        return a.guid.localeCompare(b.guid);
      });

    // Check if order changed
    const newOrder = sortedItems.map((item) => item.guid);
    const orderChanged =
      originalOrder.length !== newOrder.length ||
      originalOrder.some((guid, idx) => guid !== newOrder[idx]);

    // Clear current list and append sorted items
    list.replaceChildren();
    sortedItems.forEach((item) => {
      list.appendChild(item.element);
    });

    // Update all time differences
    updateTimeDifferences();
    updateIndentMarkers();

    updateSeekbarMarkers();

    // Restore focus to the previously focused input if it still exists
    if (restoreState) {
      const targetLi = getTimestampItems().find(
        (li) => li.dataset.guid === restoreState!.guid,
      );
      const targetInput = targetLi?.querySelector<HTMLInputElement>("input");
      if (targetInput) {
        try {
          targetInput.focus({ preventScroll: true });
        } catch {
          // If focus fails, continue without breaking sort
        }
      }
    }

    // Row order isn't stored (rows load sorted by start time), so a re-sort has nothing
    // to persist; just keep the centralized state in step with the view.
    if (orderChanged) {
      log("Timestamps changed: Timestamps sorted");
      syncTimestampStateFromUI();
    }
  }

  function updateScroll() {
    if (!list || !pane || !header || !btns) return;
    const tsCount = getTimestampItems().length;

    // Always size the list to fill the available pane height, let the resize observer
    // and recalculateTimestampsArea handle the exact maxHeight calculation.
    recalculateTimestampsAreaFn?.();

    // Decide whether to show a scrollbar based on content height vs available height
    const paneRect = pane.getBoundingClientRect();
    const headerRect = header.getBoundingClientRect();
    const btnsRect = btns.getBoundingClientRect();
    const available = Math.max(
      0,
      paneRect.height - (headerRect.height + btnsRect.height),
    );

    if (tsCount === 0) {
      // If empty, show the placeholder message and hide overflow
      ensureEmptyPlaceholder();
      list.style.overflowY = "hidden";
    } else {
      // Show scrollbar only if content exceeds available area
      list.style.overflowY = list.scrollHeight > available ? "auto" : "hidden";
    }
  }

  function updateSeekbarMarkers() {
    if (!list) return;
    const video = getVideoElement();
    const progressBar =
      document.querySelector<HTMLDivElement>(".ytp-progress-bar");
    const player = getActivePlayer();
    const videoData = player ? player.getVideoData() : null;
    const isLiveStream = !!videoData && !!videoData.isLive;

    // Skip if video isn't ready, progress bar isn't found, or if it's a live stream
    if (!video || !progressBar || !isFinite(video.duration) || isLiveStream)
      return;

    removeSeekbarMarkers();

    // Static look lives in styles.css (.ytp-progress-bar .ytls-marker); only `left`
    // varies per marker. Build into a fragment so the progress bar reflows once.
    const { items, starts } = getTimestampIndex();
    const duration = video.duration;
    const fragment = document.createDocumentFragment();
    items.forEach((li, i) => {
      const start = starts[i];
      if (!Number.isFinite(start)) {
        return;
      }
      // Every row that gets a marker is guaranteed a guid.
      if (!li.dataset.guid) {
        li.dataset.guid = crypto.randomUUID();
      }
      const marker = document.createElement("div");
      marker.className = "ytls-marker";
      marker.style.left = (start / duration) * 100 + "%";
      marker.dataset.time = String(start);
      fragment.appendChild(marker);
    });
    progressBar.appendChild(fragment);
    bindSeekbarMarkerClicks(progressBar);
  }

  // One delegated listener per progress bar instead of one per marker.
  function bindSeekbarMarkerClicks(progressBar: HTMLElement) {
    if (progressBar.dataset.ytlsMarkerClicks) return;
    progressBar.dataset.ytlsMarkerClicks = "1";
    progressBar.addEventListener("click", (e) => {
      const marker = (e.target as HTMLElement | null)?.closest?.(
        ".ytls-marker",
      ) as HTMLElement | null;
      if (!marker) return;
      const time = Number(marker.dataset.time);
      const player = getActivePlayer();
      if (player && Number.isFinite(time)) player.seekTo(time);
    });
  }

  // Mirror the rows currently shown into the centralized state.
  function syncTimestampStateFromUI() {
    setTimestampsInState(
      extractTimestampRecords().sort((a, b) => a.start - b.start),
    );
  }

  // Persist exactly these rows. Saves are row-level on purpose: the view is never treated
  // as the full list, so a stale pane (another tab or a sync merge just added rows) can't
  // tombstone rows it hasn't shown yet.
  function saveTimestampRows(
    videoId: string | null | undefined,
    rows: TimestampRecord[],
  ) {
    if (!videoId || rows.length === 0 || isLoadingTimestamps) return;
    if (isEditingBlocked()) return;

    saveRowsToIndexedDB(videoId, rows)
      .then(() => {
        log(`Saved ${rows.length} timestamps for ${videoId} to IndexedDB`);
        // Clear any previous DB error on successful save
        if (list) clearPaneError();
      })
      .catch((err) => {
        const errorMsg = `Failed to save timestamps: ${err.message}`;
        log(`Failed to save timestamps for ${videoId} to IndexedDB:`, err, "error");
        displayPaneError(errorMsg);
      });

    safePostMessage({
      type: "timestamps_updated",
      videoId: videoId,
      action: "saved",
    });
  }

  // Soft-delete every timestamp of the video ("clear all").
  function clearVideoTimestamps(videoId: string | null | undefined) {
    if (!videoId || isLoadingTimestamps) return;
    if (isEditingBlocked()) return;

    removeFromIndexedDB(videoId)
      .then(() => {
        if (list) clearPaneError();
      })
      .catch((err) => {
        const errorMsg = `Failed to clear timestamps: ${err.message}`;
        log(`Failed to clear timestamps for ${videoId}:`, err, "error");
        displayPaneError(errorMsg);
      });

    safePostMessage({
      type: "timestamps_updated",
      videoId: videoId,
      action: "saved",
    });
  }

  // Run every debounced comment save now. Called before anything that would drop or
  // block them: navigation, page hide/unload, and tearing the UI down.
  function flushPendingCommentSaves() {
    for (const { flush } of [...pendingCommentSaves.values()]) {
      flush();
    }
  }

  function cancelPendingCommentSaves() {
    pendingCommentSaves.forEach(({ timeoutId }) => clearTimeout(timeoutId));
    pendingCommentSaves.clear();
  }

  // Guarded entry point for user edits made while the pane is live.
  function saveSingleTimestampDirect(
    videoId: string | null | undefined,
    guid: string,
    start: number,
    comment: string,
  ) {
    if (!videoId || isLoadingTimestamps) return;
    if (isEditingBlocked()) return;

    persistTimestamp(videoId, guid, start, comment);
  }

  // Unguarded write used by flushes: it must run even while a navigation has locked the
  // pane, using the video id that was current when the user typed.
  function persistTimestamp(
    videoId: string | null | undefined,
    guid: string,
    start: number,
    comment: string,
  ) {
    if (!videoId) return;

    const timestamp: TimestampRecord = { guid, start, comment };
    log(`Saving timestamp: guid=${guid}, start=${start}, comment="${comment}"`);

    saveSingleTimestampToIndexedDB(videoId, timestamp)
      .then(() => {
        // Clear any previous DB error on successful save
        if (list) clearPaneError();
      })
      .catch((err) => {
        const errorMsg = `Failed to save timestamp: ${err.message}`;
        log(`Failed to save timestamp ${guid}:`, err, "error");
        displayPaneError(errorMsg);
      });

    safePostMessage({
      type: "timestamps_updated",
      videoId: videoId,
      action: "saved",
    });
  }

  function deleteSingleTimestamp(
    videoId: string | null | undefined,
    guid: string,
  ) {
    if (!videoId || isLoadingTimestamps) return;
    if (isEditingBlocked()) return;

    deleteSingleTimestampFromIndexedDB(videoId, guid)
      .then(() => {
        // Clear any previous DB error on successful delete
        if (list) clearPaneError();
      })
      .catch((err) => {
        const errorMsg = `Failed to delete timestamp: ${err.message}`;
        log(`Failed to delete timestamp ${guid}:`, err, "error");
        displayPaneError(errorMsg);
      });

    safePostMessage({
      type: "timestamps_updated",
      videoId: videoId,
      action: "saved",
    });
  }

  async function saveTimestampsAs(format) {
    if (isEditingBlocked()) {
      alert("Cannot export timestamps while an error is being displayed.");
      return;
    }
    const videoId = currentLoadedVideoId;
    if (!videoId) return;
    log(`Exporting timestamps for video ID: ${videoId}`);
    const timestamps = extractTimestampRecords();
    const timestampSuffix = getTimestampSuffix();
    if (format === "json") {
      const blob = new Blob([JSON.stringify(timestamps, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `timestamps-${videoId}-${timestampSuffix}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "text") {
      const plainText = formatTimestampLines(timestamps, true);
      const blob = new Blob([plainText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `timestamps-${videoId}-${timestampSuffix}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  function displayPaneError(message) {
    if (!pane || !list) {
      log("Timekeeper error:", message, "error");
      return;
    }

    TimestampView.displayPaneError(list, message);
    // Set the dbError state so editing is globally blocked
    AppState.setTimestampsDbError(message);
    updateSeekbarMarkers();
  }

  /**
   * Clear any error from the timestamp list and re-enable editing.
   */
  function clearPaneError() {
    if (!list) return;
    TimestampView.clearPaneError(list);
    AppState.setTimestampsDbError(null);
  }

  /**
   * Check if all editing is currently blocked (due to loading or DB errors).
   */
  function isEditingBlocked(): boolean {
    if (!list) return true;
    if (TimestampView.hasPaneError(list)) return true;
    if (isLoadingTimestamps) return true;
    if (AppState.getTimestampsDbError() !== null) return true;
    return false;
  }

  function removeSeekbarMarkers() {
    document
      .querySelectorAll(".ytls-marker")
      .forEach((marker) => marker.remove());
  }

  function clampPaneToViewport() {
    if (!pane || !document.body.contains(pane)) return;

    const rect = pane.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const paneWidth = rect.width;
    const paneHeight = rect.height;

    if (rect.left < 0) {
      pane.style.left = "0";
      pane.style.right = "auto";
    }

    if (rect.right > viewportWidth) {
      const adjustedLeft = Math.max(0, viewportWidth - paneWidth);
      pane.style.left = `${adjustedLeft}px`;
      pane.style.right = "auto";
    }

    if (rect.top < 0) {
      pane.style.top = "0";
      pane.style.bottom = "auto";
    }

    if (rect.bottom > viewportHeight) {
      const adjustedTop = Math.max(0, viewportHeight - paneHeight);
      pane.style.top = `${adjustedTop}px`;
      pane.style.bottom = "auto";
    }
  }

  function removeAllEventListeners() {
    // Remove document listeners
    if (documentMousemoveHandler) {
      document.removeEventListener("mousemove", documentMousemoveHandler);
      documentMousemoveHandler = null;
    }
    if (documentMouseupHandler) {
      document.removeEventListener("mouseup", documentMouseupHandler);
      documentMouseupHandler = null;
    }
    if (keydownHandler) {
      document.removeEventListener("keydown", keydownHandler);
      keydownHandler = null;
    }
    if (windowResizeHandler) {
      window.removeEventListener("resize", windowResizeHandler);
      windowResizeHandler = null;
    }
    if (docPointerDownHandler) {
      document.removeEventListener("pointerdown", docPointerDownHandler, true);
      docPointerDownHandler = null;
    }
    if (docPointerUpHandler) {
      document.removeEventListener("pointerup", docPointerUpHandler, true);
      docPointerUpHandler = null;
    }

    // Disconnect any observers that may have been created for the pane
    if (paneObserver) {
      try {
        paneObserver.disconnect();
      } catch (_) { }
      paneObserver = null;
    }
    if (paneResizeObserver) {
      try {
        paneResizeObserver.disconnect();
      } catch (_) { }
      paneResizeObserver = null;
    }

    // Remove video listeners
    const video = getVideoElement();
    if (video) {
      if (videoTimeupdateHandler) {
        video.removeEventListener("timeupdate", videoTimeupdateHandler);
        videoTimeupdateHandler = null;
      }
      if (videoPauseHandler) {
        video.removeEventListener("pause", videoPauseHandler);
        videoPauseHandler = null;
      }
      if (videoPlayHandler) {
        video.removeEventListener("play", videoPlayHandler);
        videoPlayHandler = null;
      }
      if (videoSeekingHandler) {
        video.removeEventListener("seeking", videoSeekingHandler);
        videoSeekingHandler = null;
      }
      if (videoRatechangeHandler) {
        video.removeEventListener("ratechange", videoRatechangeHandler);
        videoRatechangeHandler = null;
      }
    }
  }

  function unloadTimekeeper() {
    removeSeekbarMarkers();

    // Persist (not discard) any comment edits still waiting on their debounce timer
    flushPendingCommentSaves();

    if (loadTimeoutId) {
      clearTimeout(loadTimeoutId);
      loadTimeoutId = null;
    }
    if (timeUpdateIntervalId) {
      clearInterval(timeUpdateIntervalId);
      timeUpdateIntervalId = null;
    }
    if (visibilityAnimationTimeoutId) {
      clearTimeout(visibilityAnimationTimeoutId);
      visibilityAnimationTimeoutId = null;
    }

    // Remove all event listeners to prevent memory leaks
    removeAllEventListeners();

    // Disconnect all tooltip MutationObservers to prevent zombie observers accumulating
    // across navigations (they observed document.body with subtree:true and were never cleaned up)
    cleanupAllTooltips();

    // Close the BroadcastChannel to prevent memory leaks
    try {
      channel.close();
    } catch (err) {
      // Channel may already be closed
    }

    if (
      settingsModalInstance &&
      settingsModalInstance.parentNode === document.body
    ) {
      document.body.removeChild(settingsModalInstance);
    }
    settingsModalInstance = null;
    settingsCogButtonElement = null;
    isMouseOverTimestamps = false;
    currentLoadedVideoId = null;

    if (paneObserver) {
      try {
        paneObserver.disconnect();
      } catch (_) { }
      paneObserver = null;
    }
    if (paneResizeObserver) {
      try {
        paneResizeObserver.disconnect();
      } catch (_) { }
      paneResizeObserver = null;
    }
    if (pane && pane.parentNode) {
      pane.remove();
    }

    const headerButton = document.getElementById("ytls-header-button");
    if (headerButton && headerButton.parentNode) {
      headerButton.remove();
    }
    headerButtonImage = null;
    isHeaderButtonHovered = false;
    setPanePositionState(null);

    clearTimestampsDisplay();
    pane = null;
    header = null;
    list = null;
    btns = null;
    scrollbarTrack = null;
    scrollbarThumb = null;
    recalculateTimestampsAreaFn = null;
    timeDisplay = null;
    playbackSpeedDisplay = null;
    versionDisplay = null;

    lastValidatedPlayer = null;
  }

  async function validatePlayerAndVideoId() {
    const videoId = getVideoId();
    if (!videoId) {
      lastValidatedPlayer = null;
      return {
        ok: false,
        message:
          "Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL.",
      };
    }

    const playerInstance = await waitForPlayerWithMethods();
    if (!hasRequiredPlayerMethods(playerInstance)) {
      const missingMethods = missingPlayerMethods(playerInstance);
      const missingDetail = missingMethods.length
        ? ` Missing methods: ${missingMethods.join(", ")}.`
        : "";
      const baseMessage = playerInstance
        ? "Timekeeper cannot access the YouTube player API."
        : "Timekeeper cannot find the YouTube player on this page.";
      lastValidatedPlayer = null;
      return {
        ok: false,
        message: `${baseMessage}${missingDetail} Try refreshing once playback is ready.`,
      };
    }

    lastValidatedPlayer = playerInstance;

    return {
      ok: true,
      player: playerInstance,
      videoId,
    };
  }

  async function loadTimestamps() {
    if (!pane || !list) {
      return;
    }
    const previousScrollTop = list.scrollTop;
    let shouldRestoreScroll = true;
    const restoreScrollPosition = () => {
      if (!list || !shouldRestoreScroll) return;
      const maxScrollTop = Math.max(0, list.scrollHeight - list.clientHeight);
      list.scrollTop = Math.min(previousScrollTop, maxScrollTop);
    };
    try {
      const validation = await validatePlayerAndVideoId();
      if (!validation.ok) {
        displayPaneError(validation.message);
        clearTimestampsDisplay();
        updateSeekbarMarkers();
        return;
      }

      const { videoId } = validation;

      let finalTimestampsToDisplay = [];

      try {
        const dbTimestamps = await loadFromIndexedDB(videoId);
        if (dbTimestamps) {
          // Ensure all timestamps from DB have GUIDs
          finalTimestampsToDisplay = dbTimestamps.map((ts) => ({
            ...ts,
            guid: ts.guid || crypto.randomUUID(),
          }));
          log(
            `Loaded ${finalTimestampsToDisplay.length} timestamps from IndexedDB for ${videoId}`,
          );
          // Clear any previous DB error on successful load
          clearPaneError();
        } else {
          log(`No timestamps found in IndexedDB for ${videoId}`);
        }
      } catch (dbError) {
        const errorMsg = `Failed to load timestamps: ${dbError.message}`;
        log(
          `Failed to load timestamps from IndexedDB for ${videoId}:`,
          dbError,
          "error",
        );
        displayPaneError(errorMsg);
        updateSeekbarMarkers();
        return;
      }

      if (finalTimestampsToDisplay.length > 0) {
        finalTimestampsToDisplay.sort((a, b) => a.start - b.start); // Sort by start time
        clearTimestampsDisplay();
        clearListPlaceholder();

        // Build as a document fragment so we can defer appending to the live DOM
        // while show animations are running.
        const frag = document.createDocumentFragment();
        finalTimestampsToDisplay.forEach((ts) => {
          // Construct LI without appending to the live list
          const input = addTimestamp(
            ts.start,
            ts.comment,
            true,
            ts.guid,
            false,
          );
          const li = (input as any).__ytls_li as HTMLLIElement | undefined;
          if (li) frag.appendChild(li);
        });

        // If showing animation is running, defer appending until animation completes
        const isShowingAnimation =
          pane &&
          pane.classList.contains("ytls-zoom-in") &&
          visibilitySizingTimeoutId != null;
        if (isShowingAnimation) {
          log("Deferring timestamp DOM append until show animation completes");
          pendingTimestampsFragment = frag;
          if (!pendingTimestampsPromise) {
            pendingTimestampsPromise = new Promise<void>((resolve) => {
              pendingTimestampsResolve = resolve;
            });
          }
          // Wait until the fragment is appended by the visibility timeout handler
          await pendingTimestampsPromise;
        } else {
          // Append immediately
          if (list) {
            list.appendChild(frag);
            invalidateLatestTimestampValue();
            updateTimeDifferences();
            updateIndentMarkers();
            updateSeekbarMarkers();
            // Ensure scroll area is recalculated after DOM updates
            if (recalculateTimestampsAreaFn)
              requestAnimationFrame(recalculateTimestampsAreaFn);
          }
        }

        // Sync loaded timestamps to centralized state
        setTimestampsInState(finalTimestampsToDisplay);

        autoHighlightNearest(true);
        shouldRestoreScroll = false;
      } else {
        clearTimestampsDisplay(); // Ensure UI is cleared if no timestamps are found
        showListPlaceholder("No timestamps for this video");
        updateSeekbarMarkers(); // Ensure seekbar markers are cleared
        // Sync empty timestamps to centralized state
        setTimestampsInState([]);
        // Still recalculate area in case list is now empty
        if (recalculateTimestampsAreaFn)
          requestAnimationFrame(recalculateTimestampsAreaFn);
      }
    } catch (err) {
      log("Unexpected error while loading timestamps:", err, "error");
      displayPaneError(
        "Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.",
      );
    } finally {
      // If timestamps were deferred for animation, wait until they're appended before restoring scroll
      if (pendingTimestampsPromise) {
        await pendingTimestampsPromise;
      }
      requestAnimationFrame(restoreScrollPosition);
      // Ensure scroll area is recalculated after loading timestamps
      if (recalculateTimestampsAreaFn)
        requestAnimationFrame(recalculateTimestampsAreaFn);
      // If there is no error being shown, ensure a friendly placeholder appears when the list is empty
      if (list && !TimestampView.hasPaneError(list)) {
        ensureEmptyPlaceholder();
      }
    }
  }

  function getVideoId() {
    // Try to get the video ID from the URL first
    const urlParams = new URLSearchParams(location.search);
    const videoId = urlParams.get("v");
    if (videoId) {
      return videoId; // Return the video ID if found in the URL
    }

    // Fallback to the clip method using the meta property
    const clipIdMeta = document.querySelector<HTMLMetaElement>(
      'meta[itemprop="identifier"]',
    );
    if (clipIdMeta?.content) {
      return clipIdMeta.content; // Return the clip identifier if available
    }

    // Return null if no video ID or clip identifier is found
    return null;
  }

  // Helper function to update time display with current video time
  function updateTimeDisplay(
    currentSeconds: number | null = null,
    playerInstance: any = null,
  ) {
    if (!timeDisplay) return;

    const video = getVideoElement();
    const player = playerInstance || getActivePlayer();

    if (!video && !player) {
      return;
    }

    // Get current time from parameter or player
    const rawTime =
      currentSeconds !== null
        ? currentSeconds
        : player
          ? player.getCurrentTime()
          : 0;
    const seconds = Number.isFinite(rawTime)
      ? Math.max(0, Math.floor(rawTime))
      : Math.max(0, getLatestTimestampValue());

    const { isLive } = player
      ? player.getVideoData() || { isLive: false }
      : { isLive: false };
    const behindLive = player ? isBehindLiveEdge(player, !!isLive) : false;

    const timestamps = list ? getTimestampIndex().rawTimes : [];

    timeDisplay.textContent = formatTimeDisplay(
      seconds,
      timestamps,
      getVideoDuration(player, video),
    );
    timeDisplay.style.color = behindLive ? "#ff4d4f" : "";
  }

  function setupVideoEventListeners() {
    const video = getVideoElement();
    if (!video) return;

    // Handler for timeupdate: keep nearest timestamp highlighted during playback
    let lastTickSecond = NaN;
    let lastTickIndex: TimestampIndex | null = null;
    const handleTimeUpdate = () => {
      if (!list) return;

      const player = getActivePlayer();
      const currentTime = player ? Math.floor(player.getCurrentTime()) : 0;
      if (!Number.isFinite(currentTime)) return;

      // timeupdate fires ~4x/s but the display and highlight are second-granular.
      // Skip unless the second changed or the rows changed (index is rebuilt then).
      const index = getTimestampIndex();
      if (currentTime === lastTickSecond && index === lastTickIndex) return;

      // Update time display to stay in sync with video
      const canUpdateDisplay = !!timeDisplay && !isLoadingTimestamps && !isSeeking;
      if (canUpdateDisplay) {
        updateTimeDisplay(currentTime, player);
      }

      // Use centralized helper to perform highlight (respects hover and forces scroll when requested)
      autoHighlightNearest(false, currentTime);

      // Only remember this tick as handled when nothing was deferred, so a seek/load
      // in progress or a hovered list is retried on the next timeupdate.
      if (canUpdateDisplay && !isMouseOverTimestamps) {
        lastTickSecond = currentTime;
        lastTickIndex = index;
      }
    };

    // Helper function to update URL t parameter
    const updateUrlTimeParam = (seconds: number | null) => {
      try {
        const url = new URL(window.location.href);
        if (seconds !== null && Number.isFinite(seconds)) {
          url.searchParams.set("t", `${Math.floor(seconds)}s`);
        } else {
          url.searchParams.delete("t");
        }
        // Preserve YouTube's router state (endpoint, saved component state)
        window.history.replaceState(window.history.state, "", url.toString());
      } catch (err) {
        // Silently fail if URL manipulation doesn't work
      }
    };

    // Handler for pause: add t parameter with current time and scroll to nearest timestamp
    const handlePause = () => {
      const player = getActivePlayer();
      const rawTime = player ? player.getCurrentTime() : NaN;
      const currentTime = Number.isFinite(rawTime)
        ? Math.max(0, Math.floor(rawTime))
        : Math.max(0, getLatestTimestampValue());
      if (Number.isFinite(currentTime)) {
        updateUrlTimeParam(currentTime);
        try {
          // Only update highlight automatically if the pointer is not over the UI
          autoHighlightNearest(true);
        } catch (e) {
          log("Failed to highlight nearest timestamp on pause:", e, "warn");
        }
      }
    };

    // Handler for play: remove t parameter and scroll to nearest timestamp
    const handlePlay = () => {
      updateUrlTimeParam(null);
      try {
        const player = getActivePlayer();
        const rawTime = player ? player.getCurrentTime() : NaN;
        const currentTime = Number.isFinite(rawTime)
          ? Math.max(0, Math.floor(rawTime))
          : Math.max(0, getLatestTimestampValue());
        if (Number.isFinite(currentTime)) {
          autoHighlightNearest(true);
        }
      } catch (e) {
        log("Failed to highlight nearest timestamp on play:", e, "warn");
      }
    };

    // Handler for seeking: highlight immediately on seek
    const handleSeeking = () => {
      const video = getVideoElement();
      if (!video) return;

      const player = getActivePlayer();
      const currentTime = player ? Math.floor(player.getCurrentTime()) : 0;
      if (!Number.isFinite(currentTime)) return;

      // Update URL when paused
      if (video.paused) {
        updateUrlTimeParam(currentTime);
      }

      // Always highlight and scroll immediately on seek, regardless of pause state
      autoHighlightNearest(true, currentTime);
    };

    const handleRatechange = () => {
      const rate = video.playbackRate;
      if (isTogglingPlaybackSpeed) {
        isTogglingPlaybackSpeed = false;
      } else {
        syncPlaybackSpeedState(rate);
      }
      updatePlaybackSpeedUI(rate);
    };

    // Store handlers for cleanup
    videoTimeupdateHandler = handleTimeUpdate;
    videoPauseHandler = handlePause;
    videoPlayHandler = handlePlay;
    videoSeekingHandler = handleSeeking;
    videoRatechangeHandler = handleRatechange;

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("pause", handlePause);
    video.addEventListener("play", handlePlay);
    video.addEventListener("seeking", handleSeeking);
    video.addEventListener("ratechange", handleRatechange);

  }

  // === IndexedDB Helper Functions ===
  // Using model functions from timestamp-model module
  const {
    saveToIndexedDB,
    saveRowsToIndexedDB,
    saveSingleTimestampToIndexedDB,
    deleteSingleTimestampFromIndexedDB,
    loadFromIndexedDB,
    removeFromIndexedDB,
    saveGlobalSettings,
    loadGlobalSettings,
    buildExportPayload,
    mergeBackupData,
    exportAllTimestamps,
    exportAllTimestampsCsv,
  } = TimestampModel;

  function saveUIVisibilityState() {
    if (!pane) return;

    const isVisible = pane.style.display !== "none";
    saveGlobalSettings("uiVisible", isVisible);
  }

  function syncToggleButtons(visibilityOverride?: boolean) {
    const isVisible =
      typeof visibilityOverride === "boolean"
        ? visibilityOverride
        : !!pane && pane.style.display !== "none";

    const headerButton = document.getElementById("ytls-header-button");
    if (headerButton instanceof HTMLButtonElement) {
      headerButton.setAttribute("aria-pressed", String(isVisible));
    }

    if (headerButtonImage && !isHeaderButtonHovered) {
      if (headerButtonImage.src !== HEADER_ICON_DEFAULT_URL) {
        headerButtonImage.src = HEADER_ICON_DEFAULT_URL;
      }
    }
  }

  function loadUIVisibilityState() {
    if (!pane) return;

    loadGlobalSettings("uiVisible")
      .then((value) => {
        const parsed = boolean().safeParse(value);
        const isVisible = parsed.success ? parsed.data : undefined;

        if (typeof isVisible === "boolean") {
          if (isVisible) {
            pane.style.display = "flex";
            // Apply zoom-in animation when showing initially
            pane.classList.remove("ytls-zoom-out");
            pane.classList.add("ytls-zoom-in");
          } else {
            pane.style.display = "none";
          }
          syncToggleButtons(isVisible);
        } else {
          if (!parsed.success && value !== undefined) {
            log(
              "UI visibility state failed validation, defaulting to visible",
              parsed.error.message,
              "warn",
            );
          }
          // Default to visible if not found
          pane.style.display = "flex";
          // Apply zoom-in animation when showing initially
          pane.classList.remove("ytls-zoom-out");
          pane.classList.add("ytls-zoom-in");
          syncToggleButtons(true);
        }
      })
      .catch((err) => {
        log("Failed to load UI visibility state:", err, "error");
        // Default to visible on error
        pane.style.display = "flex";
        // Apply zoom-in animation when showing initially
        pane.classList.remove("ytls-zoom-out");
        pane.classList.add("ytls-zoom-in");
        syncToggleButtons(true);
      });
  }

  function togglePaneVisibility(force?: boolean) {
    if (!pane) {
      log("ERROR: togglePaneVisibility called but pane is null");
      return;
    }

    // If pane is not in DOM, append it before toggling
    if (!document.body.contains(pane)) {
      log("Pane not in DOM during toggle, appending it");
      // Remove any stray panes first
      document.querySelectorAll("#ytls-pane").forEach((el) => {
        if (el !== pane) el.remove();
      });
      document.body.appendChild(pane);
    }

    // Verify no duplicate panes exist
    const allPanes = document.querySelectorAll("#ytls-pane");
    if (allPanes.length > 1) {
      log(
        `ERROR: Multiple panes detected in togglePaneVisibility (${allPanes.length}), cleaning up`,
      );
      allPanes.forEach((el) => {
        if (el !== pane) el.remove();
      });
    }

    if (visibilityAnimationTimeoutId) {
      clearTimeout(visibilityAnimationTimeoutId);
      visibilityAnimationTimeoutId = null;
    }

    const isHidden = pane.style.display === "none";
    const shouldShow = typeof force === "boolean" ? force : isHidden;

    if (shouldShow) {
      pane.style.display = "flex";
      pane.classList.remove("ytls-fade-out");
      pane.classList.remove("ytls-zoom-out");
      pane.classList.add("ytls-zoom-in");
      syncToggleButtons(true);
      saveUIVisibilityState();
      // Hide timestamps until the show animation completes and schedule final sizing
      startShowAnimation();
      if (visibilitySizingTimeoutId) {
        clearTimeout(visibilitySizingTimeoutId);
        visibilitySizingTimeoutId = null;
      }
      visibilitySizingTimeoutId = setTimeout(() => {
        // If timestamps were deferred while animating, append them first so sizing sees them
        appendPendingTimestamps();
        recalculateTimestampsAreaFn?.();
        ensureMinPaneHeight();
        clampAndSavePanePosition(true);

        // Scroll to the nearest timestamp now that the layout is settled
        try {
          autoHighlightNearest(true);
        } catch (e) {
          // Be resilient if player isn't ready; swallow errors
          log("Failed to scroll to nearest timestamp after toggle:", e, "warn");
        }

        visibilitySizingTimeoutId = null;
      }, 450);
    } else {
      pane.classList.remove("ytls-fade-in");
      pane.classList.remove("ytls-zoom-in");
      pane.classList.add("ytls-zoom-out");
      syncToggleButtons(false);
      // Start hide animation (append any deferred timestamps hidden, cancel finalizer, and schedule hide)
      startHideAnimation();
      // Clear any scheduled sizing followups when hiding (startHideAnimation handles it)
    }
  }

  function processImportedData(contentString) {
    if (!list) {
      log("UI is not initialized; cannot import timestamps.", "warn");
      return;
    }
    let processedSuccessfully = false;
    // New rows save themselves in addTimestamp(); rows whose comment is overwritten here
    // are collected so only those get persisted afterwards.
    const editedRows: TimestampRecord[] = [];
    const overwriteComment = (li: HTMLLIElement, comment: string) => {
      const commentInput = li.querySelector<HTMLInputElement>("input");
      if (!commentInput) return;
      commentInput.value = comment;
      const guid = li.dataset.guid;
      const start = Number.parseInt(
        li.querySelector<HTMLElement>("[data-time]")?.dataset.time ?? "",
        10,
      );
      if (guid && Number.isFinite(start)) {
        editedRows.push({ guid, start, comment });
      }
    };
    // Try parsing as JSON first
    try {
      const parsed = JSON.parse(contentString);
      let timestamps = null;

      // Check if it's a direct array of timestamps
      if (Array.isArray(parsed)) {
        timestamps = parsed;
      } else if (typeof parsed === "object" && parsed !== null) {
        // Check if it's the full export format with ytls- keys
        const currentVideoId = currentLoadedVideoId;
        if (currentVideoId) {
          const key = `timekeeper-${currentVideoId}`;
          if (parsed[key] && Array.isArray(parsed[key].timestamps)) {
            timestamps = parsed[key].timestamps;
            log(
              `Found timestamps for current video (${currentVideoId}) in export format`,
              "info",
            );
          }
        }

        // If we didn't find a matching video, check if there's only one video in the export
        if (!timestamps) {
          const keys = Object.keys(parsed).filter((k) => k.startsWith("ytls-"));
          if (keys.length === 1 && Array.isArray(parsed[keys[0]].timestamps)) {
            timestamps = parsed[keys[0]].timestamps;
            const videoId = parsed[keys[0]].video_id;
            log(
              `Found timestamps for video ${videoId} in export format`,
              "info",
            );
          }
        }
      }

      if (timestamps && Array.isArray(timestamps)) {
        // Check if all items are valid timestamp objects
        const isValidJsonData = timestamps.every(
          (ts) =>
            typeof ts.start === "number" && typeof ts.comment === "string",
        );
        if (isValidJsonData) {
          // Single pass: Process each timestamp
          timestamps.forEach((ts) => {
            if (ts.guid) {
              const existingLi = getTimestampItems().find(
                (li) => li.dataset.guid === ts.guid,
              );
              if (existingLi) {
                overwriteComment(existingLi, ts.comment);
              } else {
                addTimestamp(ts.start, ts.comment, false, ts.guid);
              }
            } else {
              addTimestamp(ts.start, ts.comment, false, crypto.randomUUID());
            }
          });
          processedSuccessfully = true;
        } else {
          log(
            "Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.",
            "warn",
          );
        }
      } else {
        log(
          "Parsed JSON, but couldn't find valid timestamps. Trying as plain text.",
          "warn",
        );
      }
    } catch (e) {
      // JSON parsing failed or was not the correct structure, proceed to plain text parsing
    }

    if (!processedSuccessfully) {
      // Handle plain text input
      const lines = contentString
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line);
      if (lines.length > 0) {
        let matchedAnyLine = false;
        lines.forEach((line) => {
          const match = line.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);
          if (match) {
            matchedAnyLine = true;
            const hours = parseInt(match[1]) || 0;
            const minutes = parseInt(match[2]);
            const seconds = parseInt(match[3]);
            const start = hours * 3600 + minutes * 60 + seconds;
            const remainingText = match[4] ? match[4].trim() : "";

            // Parse GUID if present in HTML comment format <!-- guid:xyz -->
            let guid = null;
            let comment = remainingText;
            const guidMatch = remainingText.match(/<!--\s*guid:([^>]+?)\s*-->/);
            if (guidMatch) {
              guid = guidMatch[1].trim();
              comment = remainingText
                .replace(/<!--\s*guid:[^>]+?\s*-->/, "")
                .trim();
            }

            // First try to match by GUID if available, then fall back to timestamp matching
            let existingLi: HTMLLIElement | undefined;
            if (guid) {
              existingLi = getTimestampItems().find(
                (li) => li.dataset.guid === guid,
              );
            }
            if (!existingLi && !guid) {
              existingLi = getTimestampItems().find((li) => {
                if (li.dataset.guid) {
                  return false;
                }
                const timeLink =
                  li.querySelector<HTMLElement>("[data-time]");
                const timeValue = timeLink?.dataset.time;
                if (!timeValue) {
                  return false;
                }
                const time = Number.parseInt(timeValue, 10);
                return Number.isFinite(time) && time === start;
              });
            }
            if (existingLi) {
              overwriteComment(existingLi, comment);
            } else {
              addTimestamp(start, comment, false, guid || crypto.randomUUID()); // Use existing GUID or generate new one
            }
          }
        });
        if (matchedAnyLine) {
          processedSuccessfully = true;
        }
      }
    }

    if (processedSuccessfully) {
      log("Timestamps changed: Imported timestamps from file/clipboard");
      updateIndentMarkers();
      syncTimestampStateFromUI();
      saveTimestampRows(currentLoadedVideoId, editedRows);
      updateSeekbarMarkers();
      updateScroll();
      // alert("Timestamps loaded and merged successfully!");
    } else {
      alert(
        "Failed to parse content. Please ensure it is in the correct JSON or plain text format.",
      );
    }
  }

  async function initializePaneIfNeeded() {
    // Prevent concurrent initialization
    if (isPaneInitializing) {
      log("Pane initialization already in progress, skipping duplicate call");
      return;
    }

    if (pane && document.body.contains(pane)) {
      return;
    }

    isPaneInitializing = true;

    try {
      // Remove any stray panes before creating a new one
      document.querySelectorAll("#ytls-pane").forEach((el) => el.remove());

      // Inject styles if not already present (required for userscript; harmless no-op for extension)
      if (!document.getElementById("ytls-styles")) {
        const styleEl = document.createElement("style");
        styleEl.id = "ytls-styles";
        styleEl.textContent = PANE_STYLES;
        document.head.appendChild(styleEl);
      }

      pane = document.createElement("div");
      header = document.createElement("div");
      list = document.createElement("ul");
      btns = document.createElement("div");
      timeDisplay = document.createElement("span");
      versionDisplay = document.createElement("span");
      backupStatusIndicator = document.createElement("span");
      backupStatusIndicator.classList.add("ytls-backup-indicator");
      backupStatusIndicator.style.cursor = "pointer";
      backupStatusIndicator.style.backgroundColor = "#666"; // Default gray color
      backupStatusIndicator.onclick = (e) => {
        e.stopPropagation();
        // The light shows sync status while signed in to sync (see updateBackupStatusIndicator), so open the matching tab.
        toggleSettingsModal(SyncClient.getSyncIndicator() ? "sync" : "drive");
      };

      // Add event listeners to `list` after it is initialized
      list.addEventListener("mouseenter", () => {
        isMouseOverTimestamps = true;
        suppressSortUntilRefocus = false;
      });

      list.addEventListener("mouseleave", () => {
        isMouseOverTimestamps = false;
        // Hide any visible tooltips when leaving the list
        try {
          hideActiveTooltip();
        } catch (_) { }
        if (suppressSortUntilRefocus) {
          return;
        }
        autoHighlightNearest(false);

        // Preserve focus on the currently focused timestamp when sorting
        let focusedTimestampGuid: string | null = null;
        if (
          document.activeElement instanceof HTMLInputElement &&
          list.contains(document.activeElement)
        ) {
          const activeLi = document.activeElement.closest("li");
          focusedTimestampGuid = activeLi?.dataset.guid ?? null;
        }

        // Sort and restore focus
        sortTimestampsAndUpdateDisplay();

        if (focusedTimestampGuid) {
          const targetLi = getTimestampItems().find(
            (li) => li.dataset.guid === focusedTimestampGuid,
          );
          const targetInput =
            targetLi?.querySelector<HTMLInputElement>("input");
          if (targetInput) {
            try {
              targetInput.focus({ preventScroll: true });
            } catch {
              // Focus restoration failed, continue
            }
          }
        }
      });

      pane.id = "ytls-pane";
      header.id = "ytls-pane-header";

      header.addEventListener("dblclick", (event) => {
        const target = event.target instanceof Element ? event.target : null;
        if (target) {
          let el: Element | null = target;
          while (el && el !== pane) {
            if (window.getComputedStyle(el).cursor === "pointer") return;
            el = el.parentElement;
          }
        }
        event.preventDefault();
        togglePaneVisibility(false);
      });

      // --- Prevent events from the Timekeeper UI reaching the YouTube UI ---
      // Stop propagation for common user interactions so underlying YouTube handlers don't react.
      // IMPORTANT: use bubble-phase listeners (default) so the event reaches Timekeeper's inner
      // controls first, then is stopped from reaching the page-level handlers.
      const stopPropagation = (e: Event) => {
        try {
          e.stopPropagation();
        } catch (_) { }
      };
      // Don't block 'mouseup'/'pointerup'/'touchend' so document-level handlers (drag end) still run.
      [
        "click",
        "dblclick",
        "mousedown",
        "pointerdown",
        "touchstart",
        "wheel",
      ].forEach((ev) => {
        pane.addEventListener(ev, stopPropagation); // default: bubble phase
      });
      // Also prevent keyboard events from reaching the page after Timekeeper handles them
      pane.addEventListener("keydown", (e) => {
        try {
          e.stopPropagation();
        } catch (_) { }
      });
      pane.addEventListener("keyup", (e) => {
        try {
          e.stopPropagation();
        } catch (_) { }
      });
      // focus/blur don't bubble reliably - keep capture to prevent page from reacting
      pane.addEventListener(
        "focus",
        (e) => {
          try {
            e.stopPropagation();
          } catch (_) { }
        },
        true,
      );
      pane.addEventListener(
        "blur",
        (e) => {
          try {
            e.stopPropagation();
          } catch (_) { }
        },
        true,
      );

      versionDisplay.textContent = `v${DISPLAY_VERSION}`;
      versionDisplay.classList.add("ytls-version-display"); // Add class for CSS targeting

      // Create a wrapper for version and backup indicator
      const versionWrapper = document.createElement("span");
      versionWrapper.style.display = "inline-flex";
      versionWrapper.style.alignItems = "center";
      versionWrapper.style.gap = "6px";
      versionWrapper.appendChild(versionDisplay);
      versionWrapper.appendChild(backupStatusIndicator);

      timeDisplay.id = "ytls-current-time";
      timeDisplay.textContent = "—";
      timeDisplay.style.cursor = "default";

      // Dynamic tooltip getter for timeDisplay - shows tooltip only during live streams
      const getTimeDisplayTooltip = () => {
        const player = getActivePlayer();
        const { isLive } = player
          ? player.getVideoData() || { isLive: false }
          : { isLive: false };
        return isLive ? "Skip to live" : "";
      };

      // Add tooltip to timeDisplay with dynamic text
      addTooltip(timeDisplay, getTimeDisplayTooltip);

      // Create playback speed display that toggles between 1x and the last saved speed
      playbackSpeedDisplay = document.createElement("span");
      playbackSpeedDisplay.id = "ytls-playback-speed";
      playbackSpeedDisplay.textContent = "1x"; // initial display
      playbackSpeedDisplay.style.cursor = "pointer";
      playbackSpeedDisplay.style.userSelect = "none";
      addTooltip(
        playbackSpeedDisplay,
        () =>
          `Current playback speed. Click to toggle between 1x and ${formatPlaybackSpeed(lastSavedSpeed)}x.`,
      );
      playbackSpeedDisplay.onclick = () => {
        togglePlaybackSpeed();
      };
      // Prevent dragging and double-click from the clickable text itself
      playbackSpeedDisplay.addEventListener("mousedown", (e) => {
        e.stopPropagation();
      });
      playbackSpeedDisplay.addEventListener("click", (e) => {
        e.stopPropagation();
      });

      // Enable clicking on the current timestamp to jump to the latest point in the live stream (only for live streams)
      timeDisplay.onclick = () => {
        const player = getActivePlayer();
        if (!player) return;
        const { isLive } = player.getVideoData() || { isLive: false };
        if (!isLive) return; // Only allow clicking during live streams

        isSeeking = true;
        player.seekToLiveHead();
        setTimeout(() => {
          isSeeking = false;
        }, 500);
      };

      // Update cursor and interaction state based on live stream status
      const updateTimeDisplayInteractivity = (isLive: boolean) => {
        timeDisplay.style.cursor = isLive ? "pointer" : "default";
      };

      // Helper function to update time display with current video time
      function updateTimeDisplay(
        currentSeconds: number | null = null,
        playerInstance: any = null,
      ) {
        if (!timeDisplay) return;

        const video = getVideoElement();
        const player = playerInstance || getActivePlayer();

        if (!video && !player) {
          return;
        }

        // Get current time from parameter or player
        const rawTime =
          currentSeconds !== null
            ? currentSeconds
            : player
              ? player.getCurrentTime()
              : 0;
        const seconds = Number.isFinite(rawTime)
          ? Math.max(0, Math.floor(rawTime))
          : Math.max(0, getLatestTimestampValue());

        const { isLive } = player
          ? player.getVideoData() || { isLive: false }
          : { isLive: false };
        const behindLive = player ? isBehindLiveEdge(player, !!isLive) : false;

        const timestamps = list ? getTimestampIndex().rawTimes : [];

        timeDisplay.textContent = formatTimeDisplay(
          seconds,
          timestamps,
          getVideoDuration(player, video),
        );
        timeDisplay.style.color = behindLive ? "#ff4d4f" : "";

        // Update cursor state based on live stream status
        updateTimeDisplayInteractivity(!!isLive);
        // Update playback speed UI to reflect actual video rate
        try {
          updatePlaybackSpeedUI();
        } catch (_) { }
      }

      function updateTime() {
        // Skip updates during loading or seeking
        if (isLoadingTimestamps || isSeeking) {
          return;
        }

        const playerInstance = getActivePlayer();
        if (!playerInstance) {
          return;
        }

        const rawTime = playerInstance.getCurrentTime();
        const currentSeconds = Number.isFinite(rawTime)
          ? Math.max(0, Math.floor(rawTime))
          : Math.max(0, getLatestTimestampValue());

        updateTimeDisplay(currentSeconds, playerInstance);

        // Only auto-highlight when the pointer is not over the UI; defer scrolling to mouse leave
        const timestamps = list ? getTimestampItems() : [];
        if (timestamps.length > 0) {
          autoHighlightNearest(false, currentSeconds);
        }
      }
      updateTime();
      if (timeUpdateIntervalId) {
        clearInterval(timeUpdateIntervalId);
      }
      timeUpdateIntervalId = setInterval(updateTime, 1000);
      btns.id = "ytls-buttons";

      // Reusable modal helper functions
      const createModalCloseHandler = (
        modal: HTMLElement,
        onClose?: () => void,
      ) => {
        return () => {
          modal.classList.remove("ytls-fade-in");
          modal.classList.add("ytls-fade-out");
          setTimeout(() => {
            if (document.body.contains(modal)) {
              document.body.removeChild(modal);
            }
            if (onClose) {
              onClose();
            }
          }, 300);
        };
      };

      const createEscapeKeyHandler = (closeHandler: () => void) => {
        return (event: KeyboardEvent) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            closeHandler();
          }
        };
      };

      const registerModalEscapeHandler = (
        escapeHandler: (event: KeyboardEvent) => void,
      ) => {
        setTimeout(() => {
          document.addEventListener("keydown", escapeHandler);
        }, 0);
      };

      const createClickOutsideHandler = (
        modal: HTMLElement,
        closeHandler: () => void,
      ) => {
        return (event: MouseEvent) => {
          if (!modal.contains(event.target as Node)) {
            closeHandler();
          }
        };
      };

      const registerModalClickOutsideHandler = (
        clickOutsideHandler: (event: MouseEvent) => void,
      ) => {
        setTimeout(() => {
          document.addEventListener("click", clickOutsideHandler, true);
        }, 0);
      };

      // Define handlers for main buttons
      const handleAddTimestamp = () => {
        if (isEditingBlocked()) return;

        // Use configuredOffset if available, otherwise default to 0
        const offset =
          typeof configuredOffset !== "undefined" ? configuredOffset : 0;
        const player = getActivePlayer();
        const currentTime = player
          ? Math.floor(player.getCurrentTime() + offset)
          : 0;
        if (!Number.isFinite(currentTime)) {
          return;
        }
        const newCommentInput = addTimestamp(currentTime, "");
        if (newCommentInput) {
          newCommentInput.focus();
        }
      };

      const handleCopyTimestamps = function (e) {
        if (isEditingBlocked()) {
          setIcon(this as Element, "circle-x", 20);
          setTimeout(() => {
            setIcon(this as Element, "clipboard", 20);
          }, 2000);
          return;
        }
        const timestamps = extractTimestampRecords();
        if (timestamps.length === 0) {
          setIcon(this as Element, "circle-x", 20);
          setTimeout(() => {
            setIcon(this as Element, "clipboard", 20);
          }, 2000);
          return;
        }
        const includeGuids = e.ctrlKey;
        const plainText = formatTimestampLines(timestamps, includeGuids);
        navigator.clipboard
          .writeText(plainText)
          .then(() => {
            setIcon(this as Element, "circle-check", 20);
            setTimeout(() => {
              setIcon(this as Element, "clipboard", 20);
            }, 2000);
          })
          .catch((err) => {
            log("Failed to copy timestamps: ", err, "error");
            setIcon(this as Element, "circle-x", 20);
            setTimeout(() => {
              setIcon(this as Element, "clipboard", 20);
            }, 2000);
          });
      };

      const handleBulkOffset = () => {
        if (isEditingBlocked()) {
          return;
        }

        const items = getTimestampItems();
        if (items.length === 0) {
          alert("No timestamps available to offset.");
          return;
        }

        const input = prompt(
          "Enter the number of seconds to offset all timestamps (positive or negative integer):",
          "0",
        );
        if (input === null) {
          return;
        }

        const trimmed = input.trim();
        if (trimmed.length === 0) {
          return;
        }

        const offsetSeconds = Number.parseInt(trimmed, 10);
        if (!Number.isFinite(offsetSeconds)) {
          alert("Please enter a valid integer number of seconds.");
          return;
        }

        if (offsetSeconds === 0) {
          return;
        }

        if (
          !applyOffsetToAllTimestamps(offsetSeconds, {
            alertOnNoChange: true,
            failureMessage:
              "Offset had no effect because timestamps are already at the requested bounds.",
            logLabel: "bulk offset",
          })
        ) {
          return;
        }
      };

      const handleDeleteAll = async () => {
        const currentVideoId = getVideoId();
        if (!currentVideoId) {
          alert("Unable to determine current video ID.");
          return;
        }

        // Create a styled modal for confirmation
        const modal = document.createElement("div");
        modal.id = "ytls-delete-all-modal";
        modal.classList.remove("ytls-fade-out");
        modal.classList.add("ytls-fade-in");

        const message = document.createElement("p");
        message.textContent = `Hold the button to delete all timestamps for:`;
        message.style.marginBottom = "10px";

        const videoIdDisplay = document.createElement("p");
        videoIdDisplay.textContent = currentVideoId;
        videoIdDisplay.style.fontFamily = "monospace";
        videoIdDisplay.style.fontSize = "12px";
        videoIdDisplay.style.marginBottom = "15px";
        videoIdDisplay.style.color = "#aaa";

        const confirmButton = document.createElement("button");
        confirmButton.classList.add("ytls-save-modal-button");
        confirmButton.style.background = "#d32f2f";
        confirmButton.style.position = "relative";
        confirmButton.style.overflow = "hidden";

        let holdTimer: ReturnType<typeof setTimeout> | null = null;
        let holdStartTime = 0;
        let progressAnimationFrame: number | null = null;

        const progressBar = document.createElement("div");
        progressBar.style.position = "absolute";
        progressBar.style.left = "0";
        progressBar.style.top = "0";
        progressBar.style.height = "100%";
        progressBar.style.width = "0%";
        progressBar.style.background = "#ff6b6b";
        progressBar.style.transition = "none";
        progressBar.style.pointerEvents = "none";
        confirmButton.appendChild(progressBar);

        const buttonText = document.createElement("span");
        buttonText.textContent = "Hold to Delete All";
        buttonText.style.position = "relative";
        buttonText.style.zIndex = "1";
        confirmButton.appendChild(buttonText);

        const updateProgress = () => {
          if (!holdStartTime) return;
          const elapsed = Date.now() - holdStartTime;
          const progress = Math.min((elapsed / 5000) * 100, 100);
          progressBar.style.width = `${progress}%`;

          if (progress < 100) {
            progressAnimationFrame = requestAnimationFrame(updateProgress);
          }
        };

        const resetButton = () => {
          if (holdTimer) {
            clearTimeout(holdTimer);
            holdTimer = null;
          }
          if (progressAnimationFrame) {
            cancelAnimationFrame(progressAnimationFrame);
            progressAnimationFrame = null;
          }
          holdStartTime = 0;
          progressBar.style.width = "0%";
          buttonText.textContent = "Hold to Delete All";
        };

        confirmButton.onmousedown = () => {
          holdStartTime = Date.now();
          buttonText.textContent = "Deleting...";
          progressAnimationFrame = requestAnimationFrame(updateProgress);

          holdTimer = setTimeout(async () => {
            // 5 seconds elapsed, proceed with deletion
            resetButton();
            modal.classList.remove("ytls-fade-in");
            modal.classList.add("ytls-fade-out");
            setTimeout(async () => {
              if (document.body.contains(modal)) {
                document.body.removeChild(modal);
              }
              try {
                await removeFromIndexedDB(currentVideoId);
                handleUrlChange(); // Refresh the tool to reflect deletion
              } catch (err) {
                log("Failed to delete all timestamps:", err, "error");
                alert(
                  "Failed to delete timestamps. Check console for details.",
                );
              }
            }, 300);
          }, 5000);
        };

        confirmButton.onmouseup = resetButton;
        confirmButton.onmouseleave = resetButton;

        let escapeHandler: ((event: KeyboardEvent) => void) | null = null;
        let clickOutsideHandler: ((event: MouseEvent) => void) | null = null;
        const closeDeleteModal = createModalCloseHandler(modal, () => {
          resetButton();
          if (escapeHandler) {
            document.removeEventListener("keydown", escapeHandler);
          }
          if (clickOutsideHandler) {
            document.removeEventListener("click", clickOutsideHandler, true);
          }
        });

        escapeHandler = createEscapeKeyHandler(closeDeleteModal);
        clickOutsideHandler = createClickOutsideHandler(
          modal,
          closeDeleteModal,
        );

        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel";
        cancelButton.classList.add("ytls-save-modal-cancel-button");
        cancelButton.onclick = closeDeleteModal;

        modal.appendChild(message);
        modal.appendChild(videoIdDisplay);
        modal.appendChild(confirmButton);
        modal.appendChild(cancelButton);
        document.body.appendChild(modal);

        registerModalEscapeHandler(escapeHandler);
        registerModalClickOutsideHandler(clickOutsideHandler);
      };

      // Configuration for main buttons
      const mainButtonConfigs: {
        id: string;
        icon: TablerIconName;
        title: string;
        action: (...args: any[]) => any;
      }[] = [
          {
            id: "add",
            icon: "alarm-plus",
            title: "Add timestamp",
            action: handleAddTimestamp,
          },
          {
            id: "settings",
            icon: "settings",
            title: "Settings",
            action: () => toggleSettingsModal(),
          },
          {
            id: "copy",
            icon: "clipboard",
            title: "Copy timestamps to clipboard",
            action: handleCopyTimestamps,
          },
          {
            id: "offset",
            icon: "clock-plus",
            title: "Offset all timestamps",
            action: handleBulkOffset,
          },
          {
            id: "delete",
            icon: "trash",
            title: "Delete all timestamps for current video",
            action: handleDeleteAll,
          },
        ];

      // Create and append main buttons
      mainButtonConfigs.forEach((config) => {
        const button = document.createElement("button");
        setIcon(button, config.icon, 20);
        addTooltip(button, config.title);
        button.classList.add("ytls-main-button");

        if (config.id === "copy") {
          // For copy button, bind to an event handler that includes the event object
          button.onclick = function (e) {
            config.action.call(this, e);
          };
        } else {
          button.onclick = config.action;
        }
        if (config.id === "settings") {
          // Store a reference to the settings cog button
          settingsCogButtonElement = button;
        }
        btns.appendChild(button);
      });

      // Helper function to create a button with common styles and actions (for settings modal)
      function createButton(
        label: string,
        title: string,
        onClick: (...args: any[]) => any,
        icon?: TablerIconName,
      ) {
        const button = document.createElement("button");
        if (icon) {
          setIconLabel(button, icon, label);
        } else {
          button.textContent = label;
        }
        addTooltip(button, title);
        button.classList.add("ytls-settings-modal-button");
        button.onclick = onClick;
        return button;
      }

      // Function to create and toggle the settings modal
      function toggleSettingsModal(
        initialTab: "general" | "google" | "sync" | "drive" = "general",
      ) {
        if (
          settingsModalInstance &&
          settingsModalInstance.parentNode === document.body
        ) {
          // Close all subdialogs first
          const saveModal = document.getElementById("ytls-save-modal");
          const loadModal = document.getElementById("ytls-load-modal");
          const deleteModal = document.getElementById("ytls-delete-all-modal");
          if (saveModal && document.body.contains(saveModal)) {
            document.body.removeChild(saveModal);
          }
          if (loadModal && document.body.contains(loadModal)) {
            document.body.removeChild(loadModal);
          }
          if (deleteModal && document.body.contains(deleteModal)) {
            document.body.removeChild(deleteModal);
          }

          // Modal exists and is visible, so close it with fade-out
          settingsModalInstance.classList.remove("ytls-fade-in");
          settingsModalInstance.classList.add("ytls-fade-out");
          setTimeout(() => {
            if (document.body.contains(settingsModalInstance)) {
              document.body.removeChild(settingsModalInstance);
            }
            settingsModalInstance = null;
            document.removeEventListener(
              "click",
              handleClickOutsideSettingsModal,
              true,
            ); // Remove click-outside listener
            document.removeEventListener("keydown", handleSettingsModalEscape); // Remove escape key listener
          }, 300); // Match animation duration
          return;
        }

        // Modal doesn't exist or isn't visible, so create and show it
        settingsModalInstance = document.createElement("div");
        settingsModalInstance.id = "ytls-settings-modal";
        settingsModalInstance.classList.remove("ytls-fade-out");
        settingsModalInstance.classList.add("ytls-fade-in");

        // Create header container with tabs and close button
        const header = document.createElement("div");
        header.className = "ytls-modal-header";

        const nav = document.createElement("div");
        nav.id = "ytls-settings-nav";

        const closeButton = document.createElement("button");
        closeButton.className = "ytls-modal-close-button";
        setIcon(closeButton, "x", 14);
        closeButton.onclick = () => {
          if (
            settingsModalInstance &&
            settingsModalInstance.parentNode === document.body
          ) {
            // Close all subdialogs first
            const saveModal = document.getElementById("ytls-save-modal");
            const loadModal = document.getElementById("ytls-load-modal");
            const deleteModal = document.getElementById(
              "ytls-delete-all-modal",
            );
            if (saveModal && document.body.contains(saveModal)) {
              document.body.removeChild(saveModal);
            }
            if (loadModal && document.body.contains(loadModal)) {
              document.body.removeChild(loadModal);
            }
            if (deleteModal && document.body.contains(deleteModal)) {
              document.body.removeChild(deleteModal);
            }

            settingsModalInstance.classList.remove("ytls-fade-in");
            settingsModalInstance.classList.add("ytls-fade-out");
            setTimeout(() => {
              if (document.body.contains(settingsModalInstance)) {
                document.body.removeChild(settingsModalInstance);
              }
              settingsModalInstance = null;
              document.removeEventListener(
                "click",
                handleClickOutsideSettingsModal,
                true,
              );
              document.removeEventListener(
                "keydown",
                handleSettingsModalEscape,
              );
            }, 300);
          }
        };

        const settingsContent = document.createElement("div");
        settingsContent.id = "ytls-settings-content";

        const sectionHeading = document.createElement("h3");
        sectionHeading.className = "ytls-section-heading";
        sectionHeading.textContent = "General";
        sectionHeading.style.display = "none";

        const generalSection = document.createElement("div");
        const googleSection = document.createElement("div");
        googleSection.className = "ytls-button-grid";
        const syncSection = document.createElement("div");
        syncSection.className = "ytls-button-grid";

        function showSection(section: "general" | "google" | "sync") {
          generalSection.style.display =
            section === "general" ? "block" : "none";
          googleSection.style.display = section === "google" ? "block" : "none";
          syncSection.style.display = section === "sync" ? "block" : "none";
          generalTab.classList.toggle("active", section === "general");
          googleTab.classList.toggle("active", section === "google");
          syncTab.classList.toggle("active", section === "sync");
          sectionHeading.textContent =
            section === "general"
              ? "General"
              : section === "google"
                ? "Google"
                : "Sync";
        }

        const generalTab = document.createElement("button");
        generalTab.appendChild(createIcon("adjustments-horizontal", 16));
        const generalTabText = document.createElement("span");
        generalTabText.className = "ytls-tab-text";
        generalTabText.textContent = " General";
        generalTab.appendChild(generalTabText);
        addTooltip(generalTab, "General settings");
        generalTab.classList.add("ytls-settings-modal-button");
        generalTab.onclick = () => showSection("general");

        const googleTab = document.createElement("button");
        googleTab.appendChild(createIcon("cloud", 16));
        const googleTabText = document.createElement("span");
        googleTabText.className = "ytls-tab-text";
        googleTabText.textContent = " Google";
        googleTab.appendChild(googleTabText);
        addTooltip(googleTab, "Google Drive backup settings");
        googleTab.classList.add("ytls-settings-modal-button");
        googleTab.onclick = async () => {
          // Verify auth state when opening Google settings
          if (GoogleDrive.googleAuthState.isSignedIn) {
            await GoogleDrive.verifySignedIn();
          }
          showSection("google");
        };
        const syncTab = document.createElement("button");
        syncTab.appendChild(createIcon("server", 16));
        const syncTabText = document.createElement("span");
        syncTabText.className = "ytls-tab-text";
        syncTabText.textContent = " Sync";
        syncTab.appendChild(syncTabText);
        addTooltip(syncTab, "Live sync across devices");
        syncTab.classList.add("ytls-settings-modal-button");
        syncTab.onclick = () => showSection("sync");
        nav.appendChild(generalTab);
        nav.appendChild(googleTab);
        nav.appendChild(syncTab);

        header.appendChild(nav);
        header.appendChild(closeButton);
        settingsModalInstance.appendChild(header);

        // Build General section
        generalSection.className = "ytls-button-grid";
        generalSection.appendChild(
          createButton("Save", "Save As...", saveBtn.onclick, "device-floppy"),
        );
        generalSection.appendChild(
          createButton("Load", "Load", loadBtn.onclick, "folder-open"),
        );
        generalSection.appendChild(
          createButton(
            "Export All",
            "Export All Data",
            exportBtn.onclick,
            "file-export",
          ),
        );
        generalSection.appendChild(
          createButton(
            "Import All",
            "Import All Data",
            importBtn.onclick,
            "file-import",
          ),
        );
        // Export all timestamps as CSV (Tag,Timestamp,URL)
        generalSection.appendChild(
          createButton(
            "Export All (CSV)",
            "Export All Timestamps to CSV",
            async () => {
              try {
                await exportAllTimestampsCsv();
              } catch (err) {
                alert("Failed to export CSV: Could not read from database.");
              }
            },
            "file-spreadsheet",
          ),
        );

        // Build Google Drive section
        const signButton = createButton(
          GoogleDrive.googleAuthState.isSignedIn ? "Sign Out" : "Sign In",
          GoogleDrive.googleAuthState.isSignedIn
            ? "Sign out from Google Drive"
            : "Sign in to Google Drive",
          async () => {
            if (GoogleDrive.googleAuthState.isSignedIn) {
              await GoogleDrive.signOutFromGoogle();
            } else {
              await GoogleDrive.signInToGoogle();
            }
            // Update label after action
            setIconLabel(
              signButton,
              GoogleDrive.googleAuthState.isSignedIn ? "logout" : "login",
              GoogleDrive.googleAuthState.isSignedIn ? "Sign Out" : "Sign In",
            );
            addTooltip(
              signButton,
              GoogleDrive.googleAuthState.isSignedIn
                ? "Sign out from Google Drive"
                : "Sign in to Google Drive",
            );
            // Ensure main backup status indicator updates immediately
            GoogleDrive.updateBackupStatusDisplay();
          },
          GoogleDrive.googleAuthState.isSignedIn ? "logout" : "login",
        );

        const autoToggleButton = createButton(
          GoogleDrive.getAutoBackupEnabled()
            ? "Auto Backup: On"
            : "Auto Backup: Off",
          "Toggle Auto Backup",
          async () => {
            await GoogleDrive.toggleAutoBackup();
            refreshBackupButtons();
            GoogleDrive.updateBackupStatusDisplay();
          },
          "refresh",
        );

        const intervalButton = createButton(
          `Backup Interval: ${GoogleDrive.getAutoBackupIntervalMinutes()}min`,
          "Set periodic backup interval (minutes)",
          async () => {
            await GoogleDrive.setAutoBackupIntervalPrompt();
            refreshBackupButtons();
            GoogleDrive.updateBackupStatusDisplay();
          },
          "clock-plus",
        );

        const refreshBackupButtons = () => {
          setIconLabel(
            signButton,
            GoogleDrive.googleAuthState.isSignedIn ? "logout" : "login",
            GoogleDrive.googleAuthState.isSignedIn ? "Sign Out" : "Sign In",
          );
          addTooltip(
            signButton,
            GoogleDrive.googleAuthState.isSignedIn
              ? "Sign out from Google Drive"
              : "Sign in to Google Drive",
          );
          setIconLabel(
            autoToggleButton,
            "refresh",
            GoogleDrive.getAutoBackupEnabled()
              ? "Auto Backup: On"
              : "Auto Backup: Off",
          );
          setIconLabel(
            intervalButton,
            "clock-plus",
            `Backup Interval: ${GoogleDrive.getAutoBackupIntervalMinutes()}min`,
          );
          if (
            typeof (GoogleDrive as any).updateBackupStatusDisplay === "function"
          ) {
            (GoogleDrive as any).updateBackupStatusDisplay();
          }
        };

        googleSection.appendChild(signButton);
        googleSection.appendChild(autoToggleButton);
        googleSection.appendChild(intervalButton);

        googleSection.appendChild(
          createButton(
            "Backup Now",
            "Run a backup immediately",
            async () => {
              await GoogleDrive.runAutoBackupOnce({
                silent: false,
                skipBackoff: true,
              });
              refreshBackupButtons();
            },
            "database",
          ),
        );

        // Add status info displays at the bottom
        const infoContainer = document.createElement("div");
        infoContainer.style.marginTop = "15px";
        infoContainer.style.paddingTop = "10px";
        infoContainer.style.borderTop = "1px solid #555";
        infoContainer.style.fontSize = "12px";
        infoContainer.style.color = "#aaa";

        // Sign-in status indicator
        const statusDiv = document.createElement("div");
        statusDiv.style.marginBottom = "8px";
        statusDiv.style.fontWeight = "bold";
        infoContainer.appendChild(statusDiv);
        GoogleDrive.setAuthStatusDisplay(statusDiv);

        // User info
        const userInfoDiv = document.createElement("div");
        userInfoDiv.style.marginBottom = "8px";
        GoogleDrive.setGoogleUserDisplay(userInfoDiv);
        infoContainer.appendChild(userInfoDiv);

        // Backup status info
        const backupInfoDiv = document.createElement("div");
        GoogleDrive.setBackupStatusDisplay(backupInfoDiv);
        infoContainer.appendChild(backupInfoDiv);

        googleSection.appendChild(infoContainer);

        // Update status display based on sign-in state
        GoogleDrive.updateAuthStatusDisplay();
        GoogleDrive.updateGoogleUserDisplay();
        GoogleDrive.updateBackupStatusDisplay();
        refreshBackupButtons();

        // Build Timekeeper Sync section
        const syncSignButton = createButton(
          "Sign In",
          "Sign in to Timekeeper Sync with Google",
          async () => {
            if (SyncClient.getSyncAuthState().isSignedIn) {
              await SyncClient.signOutFromSync();
            } else {
              await SyncClient.signInToSync();
            }
          },
          "login",
        );
        const syncNowButton = createButton(
          "Sync Now",
          "Sync with the server immediately",
          () => SyncClient.syncNow(),
          "refresh",
        );
        const shareSubscriptionsButton = createButton(
          "Share Subscriptions",
          "Let Timekeeper Sync read which channels you subscribe to (read-only), to work out which members-only videos you can access",
          async () => {
            try {
              await SyncClient.shareSubscriptions();
            } catch {
              // Already logged; the popup being closed or denied is not worth an alert.
            }
          },
          "users",
        );
        const refreshSyncButtons = () => {
          const signedIn = SyncClient.getSyncAuthState().isSignedIn;
          setIconLabel(
            syncSignButton,
            signedIn ? "logout" : "login",
            signedIn ? "Sign Out" : "Sign In",
          );
          addTooltip(
            syncSignButton,
            signedIn
              ? "Sign out of Timekeeper Sync"
              : "Sign in to Timekeeper Sync with Google",
          );
          syncSignButton.disabled = !signedIn && !SyncClient.isSyncConfigured();
          syncNowButton.disabled = !signedIn;
          shareSubscriptionsButton.disabled = !signedIn;
        };
        SyncClient.setSyncUiRefresher(refreshSyncButtons);

        syncSection.appendChild(syncSignButton);
        syncSection.appendChild(syncNowButton);
        syncSection.appendChild(shareSubscriptionsButton);

        const syncInfoContainer = document.createElement("div");
        syncInfoContainer.style.marginTop = "15px";
        syncInfoContainer.style.paddingTop = "10px";
        syncInfoContainer.style.borderTop = "1px solid #555";
        syncInfoContainer.style.fontSize = "12px";
        syncInfoContainer.style.color = "#aaa";

        const syncAuthDiv = document.createElement("div");
        syncAuthDiv.style.marginBottom = "8px";
        syncAuthDiv.style.fontWeight = "bold";
        syncInfoContainer.appendChild(syncAuthDiv);
        SyncClient.setSyncAuthStatusDisplay(syncAuthDiv);

        const syncStatusDiv = document.createElement("div");
        syncInfoContainer.appendChild(syncStatusDiv);
        SyncClient.setSyncStatusDisplay(syncStatusDiv);

        syncSection.appendChild(syncInfoContainer);
        SyncClient.updateSyncStatusDisplay();

        // Append sections
        settingsContent.appendChild(sectionHeading);
        settingsContent.appendChild(generalSection);
        settingsContent.appendChild(googleSection);
        settingsContent.appendChild(syncSection);
        const normalizedInitialTab = initialTab === "drive" ? "google" : initialTab;
        showSection(normalizedInitialTab);

        settingsModalInstance.appendChild(settingsContent);
        document.body.appendChild(settingsModalInstance);

        // Calculate centered position and fix top edge
        requestAnimationFrame(() => {
          const rect = settingsModalInstance.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const centeredTop = (viewportHeight - rect.height) / 2;
          settingsModalInstance.style.top = `${Math.max(20, centeredTop)}px`;
          settingsModalInstance.style.transform = "translateX(-50%)";
        });

        // Add click-outside listener
        // Use setTimeout to ensure this listener is added after the current click event cycle
        setTimeout(() => {
          document.addEventListener(
            "click",
            handleClickOutsideSettingsModal,
            true,
          );
          document.addEventListener("keydown", handleSettingsModalEscape);
        }, 0);
      }

      function handleSettingsModalEscape(event: KeyboardEvent) {
        if (
          event.key === "Escape" &&
          settingsModalInstance &&
          settingsModalInstance.parentNode === document.body
        ) {
          // Check if any subdialogs are open - if so, let their handlers deal with it
          const saveModal = document.getElementById("ytls-save-modal");
          const loadModal = document.getElementById("ytls-load-modal");
          const deleteModal = document.getElementById("ytls-delete-all-modal");
          if (saveModal || loadModal || deleteModal) {
            // Let the subdialog's escape handler handle this
            return;
          }

          event.preventDefault();

          // Close all subdialogs before closing settings
          if (saveModal && document.body.contains(saveModal)) {
            document.body.removeChild(saveModal);
          }
          if (loadModal && document.body.contains(loadModal)) {
            document.body.removeChild(loadModal);
          }
          if (deleteModal && document.body.contains(deleteModal)) {
            document.body.removeChild(deleteModal);
          }

          settingsModalInstance.classList.remove("ytls-fade-in");
          settingsModalInstance.classList.add("ytls-fade-out");
          setTimeout(() => {
            if (document.body.contains(settingsModalInstance)) {
              document.body.removeChild(settingsModalInstance);
            }
            settingsModalInstance = null;
            document.removeEventListener(
              "click",
              handleClickOutsideSettingsModal,
              true,
            );
            document.removeEventListener("keydown", handleSettingsModalEscape);
          }, 300);
        }
      }

      function handleClickOutsideSettingsModal(event) {
        // If the click is on the cog button itself, let toggleSettingsModal handle it
        if (
          settingsCogButtonElement &&
          settingsCogButtonElement.contains(event.target)
        ) {
          return;
        }

        // Check if clicked outside all modals
        const saveModal = document.getElementById("ytls-save-modal");
        const loadModal = document.getElementById("ytls-load-modal");
        const deleteModal = document.getElementById("ytls-delete-all-modal");

        const clickedInsideAnyModal =
          (saveModal && saveModal.contains(event.target)) ||
          (loadModal && loadModal.contains(event.target)) ||
          (deleteModal && deleteModal.contains(event.target)) ||
          (settingsModalInstance &&
            settingsModalInstance.contains(event.target));

        if (!clickedInsideAnyModal) {
          // Close all subdialogs first
          if (saveModal && document.body.contains(saveModal)) {
            document.body.removeChild(saveModal);
          }
          if (loadModal && document.body.contains(loadModal)) {
            document.body.removeChild(loadModal);
          }
          if (deleteModal && document.body.contains(deleteModal)) {
            document.body.removeChild(deleteModal);
          }

          // Then close settings modal
          if (
            settingsModalInstance &&
            settingsModalInstance.parentNode === document.body
          ) {
            settingsModalInstance.classList.remove("ytls-fade-in");
            settingsModalInstance.classList.add("ytls-fade-out");
            setTimeout(() => {
              if (document.body.contains(settingsModalInstance)) {
                document.body.removeChild(settingsModalInstance);
              }
              settingsModalInstance = null;
              document.removeEventListener(
                "click",
                handleClickOutsideSettingsModal,
                true,
              );
              document.removeEventListener(
                "keydown",
                handleSettingsModalEscape,
              );
            }, 300); // Match animation duration
          }
        }
      }

      // Add a save button to the buttons section
      const saveBtn = document.createElement("button");
      setIconLabel(saveBtn, "device-floppy", "Save");
      saveBtn.classList.add("ytls-file-operation-button");
      saveBtn.onclick = () => {
        // Create a styled modal for the save format choice
        const modal = document.createElement("div");
        modal.id = "ytls-save-modal";
        modal.classList.remove("ytls-fade-out");
        modal.classList.add("ytls-fade-in");

        const message = document.createElement("p");
        message.textContent = "Save as:";

        let escapeHandler: ((event: KeyboardEvent) => void) | null = null;
        let clickOutsideHandler: ((event: MouseEvent) => void) | null = null;
        const closeSaveModal = createModalCloseHandler(modal, () => {
          if (escapeHandler) {
            document.removeEventListener("keydown", escapeHandler);
          }
          if (clickOutsideHandler) {
            document.removeEventListener("click", clickOutsideHandler, true);
          }
        });

        escapeHandler = createEscapeKeyHandler(closeSaveModal);
        clickOutsideHandler = createClickOutsideHandler(modal, closeSaveModal);

        const jsonButton = document.createElement("button");
        jsonButton.textContent = "JSON";
        jsonButton.classList.add("ytls-save-modal-button");
        jsonButton.onclick = () => {
          if (escapeHandler) {
            document.removeEventListener("keydown", escapeHandler);
          }
          if (clickOutsideHandler) {
            document.removeEventListener("click", clickOutsideHandler, true);
          }
          createModalCloseHandler(modal, () => saveTimestampsAs("json"))();
        };

        const textButton = document.createElement("button");
        textButton.textContent = "Plain Text";
        textButton.classList.add("ytls-save-modal-button");
        textButton.onclick = () => {
          if (escapeHandler) {
            document.removeEventListener("keydown", escapeHandler);
          }
          if (clickOutsideHandler) {
            document.removeEventListener("click", clickOutsideHandler, true);
          }
          createModalCloseHandler(modal, () => saveTimestampsAs("text"))();
        };

        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel";
        cancelButton.classList.add("ytls-save-modal-cancel-button");
        cancelButton.onclick = closeSaveModal;

        modal.appendChild(message);
        modal.appendChild(jsonButton);
        modal.appendChild(textButton);
        modal.appendChild(cancelButton);
        document.body.appendChild(modal);

        registerModalEscapeHandler(escapeHandler);
        registerModalClickOutsideHandler(clickOutsideHandler);
      };

      // Add a load button to the buttons section
      const loadBtn = document.createElement("button");
      setIconLabel(loadBtn, "folder-open", "Load");
      loadBtn.classList.add("ytls-file-operation-button");
      loadBtn.onclick = () => {
        // Create a modal for choosing load source
        const loadModal = document.createElement("div");
        loadModal.id = "ytls-load-modal";
        loadModal.classList.remove("ytls-fade-out");
        loadModal.classList.add("ytls-fade-in");

        const loadMessage = document.createElement("p");
        loadMessage.textContent = "Load from:";

        let escapeHandler: ((event: KeyboardEvent) => void) | null = null;
        let clickOutsideHandler: ((event: MouseEvent) => void) | null = null;
        const closeLoadModal = createModalCloseHandler(loadModal, () => {
          if (escapeHandler) {
            document.removeEventListener("keydown", escapeHandler);
          }
          if (clickOutsideHandler) {
            document.removeEventListener("click", clickOutsideHandler, true);
          }
        });

        escapeHandler = createEscapeKeyHandler(closeLoadModal);
        clickOutsideHandler = createClickOutsideHandler(
          loadModal,
          closeLoadModal,
        );

        const fromFileButton = document.createElement("button");
        fromFileButton.textContent = "File";
        fromFileButton.classList.add("ytls-save-modal-button");
        fromFileButton.onclick = () => {
          // Create a hidden file input element
          const fileInput = document.createElement("input");
          fileInput.type = "file";
          fileInput.accept = ".json,.txt";
          fileInput.classList.add("ytls-hidden-file-input");

          fileInput.onchange = (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file) return;

            // Close modal as soon as file is selected
            if (escapeHandler) {
              document.removeEventListener("keydown", escapeHandler);
            }
            if (clickOutsideHandler) {
              document.removeEventListener("click", clickOutsideHandler, true);
            }
            closeLoadModal();

            const reader = new FileReader();
            reader.onload = () => {
              const content = String(reader.result).trim();
              processImportedData(content);
            };
            reader.readAsText(file);
          };
          fileInput.click();
        };

        const fromClipboardButton = document.createElement("button");
        fromClipboardButton.textContent = "Clipboard";
        fromClipboardButton.classList.add("ytls-save-modal-button");
        fromClipboardButton.onclick = async () => {
          if (escapeHandler) {
            document.removeEventListener("keydown", escapeHandler);
          }
          if (clickOutsideHandler) {
            document.removeEventListener("click", clickOutsideHandler, true);
          }
          createModalCloseHandler(loadModal, async () => {
            try {
              const clipboardText = await navigator.clipboard.readText();
              if (clipboardText) {
                processImportedData(clipboardText.trim());
              } else {
                alert("Clipboard is empty.");
              }
            } catch (err) {
              log("Failed to read from clipboard: ", err, "error");
              alert(
                "Failed to read from clipboard. Ensure you have granted permission.",
              );
            }
          })();
        };

        const cancelLoadButton = document.createElement("button");
        cancelLoadButton.textContent = "Cancel";
        cancelLoadButton.classList.add("ytls-save-modal-cancel-button");
        cancelLoadButton.onclick = closeLoadModal;

        loadModal.appendChild(loadMessage);
        loadModal.appendChild(fromFileButton);
        loadModal.appendChild(fromClipboardButton);
        loadModal.appendChild(cancelLoadButton);
        document.body.appendChild(loadModal);

        registerModalEscapeHandler(escapeHandler);
        registerModalClickOutsideHandler(clickOutsideHandler);
      };

      // Add export button to the buttons section
      const exportBtn = document.createElement("button");
      setIconLabel(exportBtn, "file-export", "Export");
      exportBtn.classList.add("ytls-file-operation-button");
      exportBtn.onclick = async () => {
        try {
          await exportAllTimestamps();
        } catch (err) {
          alert("Failed to export data: Could not read from database.");
        }
      };

      // Add import button to the buttons section
      const importBtn = document.createElement("button");
      setIconLabel(importBtn, "file-import", "Import");
      importBtn.classList.add("ytls-file-operation-button");
      importBtn.onclick = () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".json";
        fileInput.classList.add("ytls-hidden-file-input"); // Added class

        fileInput.onchange = (event) => {
          const file = (event.target as HTMLInputElement).files?.[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = () => {
            try {
              const importedData = JSON.parse(String(reader.result));
              const importPromises = [] as Promise<unknown>[];

              for (const key in importedData) {
                if (
                  Object.prototype.hasOwnProperty.call(importedData, key) &&
                  key.startsWith("ytls-")
                ) {
                  const videoId = key.substring(5); // Extract videoId from "ytls-videoId"
                  const videoData = importedData[key];

                  // Ensure videoData has the expected structure before saving
                  if (
                    videoData &&
                    typeof videoData.video_id === "string" &&
                    Array.isArray(videoData.timestamps)
                  ) {
                    // Ensure each timestamp has a guid
                    const timestampsWithGuids = videoData.timestamps.map(
                      (ts) => ({
                        ...ts,
                        guid: ts.guid || crypto.randomUUID(),
                      }),
                    );
                    // Save to IndexedDB
                    const promise = saveToIndexedDB(
                      videoId,
                      timestampsWithGuids,
                    )
                      .then(() => log(`Imported ${videoId} to IndexedDB`))
                      .catch((err) =>
                        log(
                          `Failed to import ${videoId} to IndexedDB:`,
                          err,
                          "error",
                        ),
                      );
                    importPromises.push(promise);
                  } else {
                    log(
                      `Skipping key ${key} during import due to unexpected data format.`,
                      "warn",
                    );
                  }
                }
              }
              Promise.all(importPromises)
                .then(() => {
                  // alert("Data imported successfully! Refreshing tool...");
                  handleUrlChange(); // Refresh the tool to reflect imported data
                })
                .catch((err) => {
                  alert(
                    "An error occurred during import to IndexedDB. Check console for details.",
                  );
                  log("Overall import error:", err, "error");
                });
            } catch (e) {
              alert(
                "Failed to import data. Please ensure the file is in the correct format.\n" +
                (e as Error).message,
              );
              log("Import error:", e, "error");
            }
          };

          reader.readAsText(file);
        };

        fileInput.click();
      };

      list.onclick = (e) => {
        handleClick(e);
      };
      list.ontouchstart = (e) => {
        handleClick(e);
      };

      // Pane helpers are declared at module scope above

      // Load pane position from IndexedDB settings
      function loadPanePosition() {
        if (!pane) return;
        log("Loading window position from IndexedDB");
        loadGlobalSettings("windowPosition")
          .then((value) => {
            const parsed = PanePositionSchema.safeParse(value);
            if (parsed.success) {
              const pos = parsed.data;
              pane.style.left = `${pos.x}px`;
              pane.style.top = `${pos.y}px`;
              pane.style.right = "auto";
              pane.style.bottom = "auto";
              // Apply stored size when provided, otherwise fall back to defaults
              if (typeof pos.width === "number" && pos.width > 0) {
                pane.style.width = `${pos.width}px`;
              } else {
                pane.style.width = `${DEFAULT_PANE_WIDTH}px`;
                log(
                  `No stored window width found, using default width ${DEFAULT_PANE_WIDTH}px`,
                );
              }
              if (typeof pos.height === "number" && pos.height > 0) {
                pane.style.height = `${pos.height}px`;
              } else {
                pane.style.height = `${DEFAULT_PANE_HEIGHT}px`;
                log(
                  `No stored window height found, using default height ${DEFAULT_PANE_HEIGHT}px`,
                );
              }
              // Get rect after applying position and size
              const rect = getPaneRect();
              updateLastSavedPanePositionFromRect(rect, pos.x, pos.y);
              log(
                "Restored window position from IndexedDB:",
                getPanePositionState(),
              );
            } else {
              if (!parsed.success) {
                log(
                  "Window position in IndexedDB failed validation:",
                  parsed.error.message,
                  "warn",
                );
              } else {
                log(
                  "No window position found in IndexedDB, applying default size and leaving default position",
                );
              }
              // Ensure default size is applied when no stored position exists
              pane.style.width = `${DEFAULT_PANE_WIDTH}px`;
              pane.style.height = `${DEFAULT_PANE_HEIGHT}px`;
              setPanePositionState(null);
            }
            clampPaneToViewport();
            const rect = getPaneRect();
            if (rect && (rect.width || rect.height)) {
              updateLastSavedPanePositionFromRect(rect);
            }
            // Ensure the scroll area is sized after restoring position/size
            recalculateTimestampsAreaFn?.();
          })
          .catch((err) => {
            log("failed to load pane position from IndexedDB:", err, "warn");
            clampPaneToViewport();
            const rect = getPaneRect();
            if (rect && (rect.width || rect.height)) {
              setPanePositionState({
                x: Math.max(0, Math.round(rect.left)),
                y: 0, // Fixed at bottom
                width: Math.round(rect.width),
                height: Math.round(rect.height),
              });
            }
            recalculateTimestampsAreaFn?.();
          });
      }

      function savePanePosition() {
        if (!pane) return;

        const rect = getPaneRect();
        if (!rect) return;

        const positionData = {
          x: Math.max(0, Math.round(rect.left)),
          y: Math.max(0, Math.round(rect.top)),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };

        const savedPos = getPanePositionState();
        if (
          savedPos &&
          savedPos.x === positionData.x &&
          savedPos.y === positionData.y &&
          savedPos.width === positionData.width &&
          savedPos.height === positionData.height
        ) {
          log("Skipping window position save; position and size unchanged");
          return;
        }

        setPanePositionState({ ...positionData });
        log(
          `Saving window position and size to IndexedDB: x=${positionData.x}, y=${positionData.y}, width=${positionData.width}, height=${positionData.height}`,
        );
        saveGlobalSettings("windowPosition", positionData);

        safePostMessage({
          type: "window_position_updated",
          position: positionData,
          timestamp: Date.now(),
        });
      }
      // Enable dragging for the pane
      pane.style.position = "fixed";
      pane.style.bottom = "0";
      pane.style.right = "0";
      pane.style.transition = "none"; // Disable transition during initial position restore
      loadPanePosition();
      // Ensure initial position is clamped to viewport
      setTimeout(() => clampPaneToViewport(), 10);

      let isDragging = false;
      let offsetX = 0;
      let offsetY = 0;
      let dragCachedPaneWidth = 0;
      let dragCachedPaneHeight = 0;
      let dragCachedViewportWidth = 0;
      let dragCachedViewportHeight = 0;
      let dragRafId: number | null = null;
      let dragOccurredSinceLastMouseDown = false; // Flag to track if a drag occurred

      pane.addEventListener("mousedown", (e) => {
        const target = e.target;
        if (!(target instanceof Element)) {
          return;
        }

        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement
        ) {
          return;
        }

        // Prevent starting a drag when clicking inside the playback speed controls (they should not move the pane)
        if (
          target instanceof Element &&
          (target.closest("#ytls-playback-speed-group") ||
            target.closest("#ytls-playback-speed"))
        ) {
          return;
        }

        // Allow dragging from the header region
        if (
          target !== header &&
          !header.contains(target) &&
          window.getComputedStyle(target).cursor === "pointer"
        ) {
          return;
        }

        isDragging = true;
        dragOccurredSinceLastMouseDown = false;
        // Read layout once at drag start; reuse for clamping throughout the drag
        const rect = pane.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        dragCachedPaneWidth = rect.width;
        dragCachedPaneHeight = rect.height;
        dragCachedViewportWidth = document.documentElement.clientWidth;
        dragCachedViewportHeight = document.documentElement.clientHeight;

        pane.style.transition = "none";
      });

      document.addEventListener(
        "mousemove",
        (documentMousemoveHandler = (e) => {
          if (!isDragging) return;

          dragOccurredSinceLastMouseDown = true;

          // Capture coordinates before yielding to RAF to get the latest pointer position
          const clientX = e.clientX;
          const clientY = e.clientY;

          // Skip if a frame is already queued; the captured coords will be applied next frame
          if (dragRafId !== null) return;

          dragRafId = requestAnimationFrame(() => {
            dragRafId = null;
            if (!isDragging) return;

            let x = Math.max(
              0,
              Math.min(
                clientX - offsetX,
                dragCachedViewportWidth - dragCachedPaneWidth,
              ),
            );
            let y = Math.max(
              0,
              Math.min(
                clientY - offsetY,
                dragCachedViewportHeight - dragCachedPaneHeight,
              ),
            );

            pane.style.left = `${x}px`;
            pane.style.top = `${y}px`;
            pane.style.right = "auto";
            pane.style.bottom = "auto";
          });
        }),
      );

      document.addEventListener(
        "mouseup",
        (documentMouseupHandler = () => {
          if (!isDragging) return;

          isDragging = false;
          if (dragRafId !== null) {
            cancelAnimationFrame(dragRafId);
            dragRafId = null;
          }
          const didDrag = dragOccurredSinceLastMouseDown;
          setTimeout(() => {
            dragOccurredSinceLastMouseDown = false; // Reset the flag after a short delay
          }, 50);

          // Ensure the pane remains fully visible and persist its position
          clampPaneToViewport();
          setTimeout(() => {
            if (didDrag) {
              savePanePosition();
            }
          }, 200);
        }),
      );

      // Prevent text selection during drag
      pane.addEventListener("dragstart", (e) => e.preventDefault());

      // Create corner resize handles (top-left, top-right, bottom-left, bottom-right)
      const resizeTL = document.createElement("div");
      const resizeTR = document.createElement("div");
      const resizeBL = document.createElement("div");
      const resizeBR = document.createElement("div");
      resizeTL.id = "ytls-resize-tl";
      resizeTR.id = "ytls-resize-tr";
      resizeBL.id = "ytls-resize-bl";
      resizeBR.id = "ytls-resize-br";

      // Resize state
      let isResizing = false;
      let resizeStartX: number = 0;
      let resizeStartY: number = 0;
      let resizeStartWidth: number = 0;
      let resizeStartHeight: number = 0;
      let resizeStartLeft: number = 0;
      let resizeStartTop: number = 0;
      let resizeCachedViewportWidth: number = 0;
      let resizeCachedViewportHeight: number = 0;
      let resizeRafId: number | null = null;
      let resizeEdge:
        | "top-left"
        | "top-right"
        | "bottom-left"
        | "bottom-right"
        | null = null;

      function setupCorner(
        handle: HTMLElement,
        edge: "top-left" | "top-right" | "bottom-left" | "bottom-right",
      ) {
        handle.addEventListener("dblclick", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          if (pane) {
            pane.style.width = "300px";
            pane.style.height = "300px";
            savePanePosition();
            recalculateTimestampsArea();
          }
        });
        handle.addEventListener("mousedown", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          isResizing = true;
          resizeEdge = edge;
          resizeStartX = ev.clientX;
          resizeStartY = ev.clientY;
          const rect = pane.getBoundingClientRect();
          resizeStartWidth = rect.width;
          resizeStartHeight = rect.height;
          resizeStartLeft = rect.left;
          resizeStartTop = rect.top;
          // Cache viewport dimensions once at resize start
          resizeCachedViewportWidth = document.documentElement.clientWidth;
          resizeCachedViewportHeight = document.documentElement.clientHeight;
          // Set diagonal cursor indicator
          if (edge === "top-left" || edge === "bottom-right")
            document.body.style.cursor = "nwse-resize";
          else document.body.style.cursor = "nesw-resize";
        });
      }

      setupCorner(resizeTL, "top-left");
      setupCorner(resizeTR, "top-right");
      setupCorner(resizeBL, "bottom-left");
      setupCorner(resizeBR, "bottom-right");

      document.addEventListener("mousemove", (e) => {
        if (!isResizing || !pane || !resizeEdge) return;

        const clientX = e.clientX;
        const clientY = e.clientY;

        if (resizeRafId !== null) return;

        resizeRafId = requestAnimationFrame(() => {
          resizeRafId = null;
          if (!isResizing || !pane || !resizeEdge) return;

          const deltaX = clientX - resizeStartX;
          const deltaY = clientY - resizeStartY;
          const vw = resizeCachedViewportWidth;
          const vh = resizeCachedViewportHeight;

          let newWidth = resizeStartWidth;
          let newHeight = resizeStartHeight;
          let newLeft = resizeStartLeft;
          let newTop = resizeStartTop;

          if (resizeEdge === "bottom-right") {
            newWidth = Math.max(200, Math.min(800, resizeStartWidth + deltaX));
            newHeight = Math.max(250, Math.min(vh, resizeStartHeight + deltaY));
          } else if (resizeEdge === "top-left") {
            newWidth = Math.max(200, Math.min(800, resizeStartWidth - deltaX));
            newLeft = resizeStartLeft + deltaX;
            newHeight = Math.max(250, Math.min(vh, resizeStartHeight - deltaY));
            newTop = resizeStartTop + deltaY;
          } else if (resizeEdge === "top-right") {
            newWidth = Math.max(200, Math.min(800, resizeStartWidth + deltaX));
            newHeight = Math.max(250, Math.min(vh, resizeStartHeight - deltaY));
            newTop = resizeStartTop + deltaY;
          } else if (resizeEdge === "bottom-left") {
            newWidth = Math.max(200, Math.min(800, resizeStartWidth - deltaX));
            newLeft = resizeStartLeft + deltaX;
            newHeight = Math.max(250, Math.min(vh, resizeStartHeight + deltaY));
          }

          // Clamp to viewport
          newLeft = Math.max(0, Math.min(newLeft, vw - newWidth));
          newTop = Math.max(0, Math.min(newTop, vh - newHeight));

          pane.style.width = `${newWidth}px`;
          pane.style.height = `${newHeight}px`;
          pane.style.left = `${newLeft}px`;
          pane.style.top = `${newTop}px`;
          pane.style.right = "auto";
          pane.style.bottom = "auto";
        });
      });

      document.addEventListener("mouseup", () => {
        if (isResizing) {
          isResizing = false;
          if (resizeRafId !== null) {
            cancelAnimationFrame(resizeRafId);
            resizeRafId = null;
          }
          resizeEdge = null;
          document.body.style.cursor = "";
          clampAndSavePanePosition(true);
        }
      });

      // Ensure the timestamps window is fully onscreen after resizing
      let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
      window.addEventListener(
        "resize",
        (windowResizeHandler = () => {
          // Debounce position save - only save after resize is finished
          if (resizeTimeout) {
            clearTimeout(resizeTimeout);
          }
          resizeTimeout = setTimeout(() => {
            // After resize finishes, clamp, save, and recalculate layout in a single debounced pass
            clampAndSavePanePosition(true);
            recalculateTimestampsAreaFn?.();
            resizeTimeout = null;
          }, 200);
        }),
      );

      header.appendChild(timeDisplay); // Add timeDisplay
      // Add playback speed display with arrow buttons
      const playbackGroup = document.createElement("span");
      playbackGroup.id = "ytls-playback-speed-group";
      playbackGroup.style.display = "inline-flex";
      playbackGroup.style.alignItems = "center";
      playbackGroup.style.marginLeft = "4px";

      if (playbackSpeedDisplay) playbackGroup.appendChild(playbackSpeedDisplay);

      header.appendChild(playbackGroup);

      header.appendChild(versionWrapper); // Add version wrapper with indicator to header

      const listWrapper = document.createElement("div");
      listWrapper.id = "ytls-list-wrapper";
      scrollbarTrack = document.createElement("div");
      scrollbarTrack.className = "ytls-scrollbar-track";
      scrollbarThumb = document.createElement("div");
      scrollbarThumb.className = "ytls-scrollbar-thumb";
      scrollbarTrack.append(scrollbarThumb);
      listWrapper.append(list, scrollbarTrack);

      const content = document.createElement("div");
      content.id = "ytls-content";
      content.append(listWrapper); // list is inside its own positioned wrapper
      content.append(btns); // Buttons are always at the bottom of content

      pane.append(header, content, resizeTL, resizeTR, resizeBL, resizeBR); // Append header, content, and corner resize handles to the pane

      // Show diagonal cursors only on corners (no edge cursors)
      let lastPaneCursor = "";
      pane.addEventListener("mousemove", (ev) => {
        if (isDragging || isResizing) return;
        const rect = pane.getBoundingClientRect();
        const threshold = 20; // matches corner grab size
        const x = ev.clientX;
        const y = ev.clientY;
        const inLeft = x - rect.left <= threshold;
        const inRight = rect.right - x <= threshold;
        const inTop = y - rect.top <= threshold;
        const inBottom = rect.bottom - y <= threshold;
        let c = "";
        if ((inTop && inLeft) || (inBottom && inRight)) c = "nwse-resize";
        else if ((inTop && inRight) || (inBottom && inLeft)) c = "nesw-resize";
        if (c !== lastPaneCursor) {
          lastPaneCursor = c;
          document.body.style.cursor = c;
        }
      });

      let scrollThumbRafId: number | null = null;

      function updateScrollbarThumb() {
        if (!list || !scrollbarThumb) return;
        const { scrollTop, scrollHeight, clientHeight } = list;
        if (scrollHeight <= clientHeight) return;
        const thumbHeight = Math.max(
          30,
          (clientHeight / scrollHeight) * clientHeight,
        );
        const thumbTop =
          (scrollTop / (scrollHeight - clientHeight)) *
          (clientHeight - thumbHeight);
        scrollbarThumb.style.height = `${thumbHeight}px`;
        scrollbarThumb.style.top = `${thumbTop}px`;
      }

      function showScrollbar() {
        if (!scrollbarTrack) return;
        // Batch thumb geometry update with the next paint
        if (scrollThumbRafId === null) {
          scrollThumbRafId = requestAnimationFrame(() => {
            scrollThumbRafId = null;
            updateScrollbarThumb();
          });
        }
        scrollbarTrack.classList.add("ytls-scrollbar-visible");
        if (scrollbarHideTimeoutId) clearTimeout(scrollbarHideTimeoutId);
        scrollbarHideTimeoutId = setTimeout(() => {
          scrollbarTrack?.classList.remove("ytls-scrollbar-visible");
          scrollbarHideTimeoutId = null;
        }, 500);
      }

      // Keep scrollbar visible while hovering the track gutter
      scrollbarTrack.addEventListener("mouseenter", () => {
        if (scrollbarHideTimeoutId) {
          clearTimeout(scrollbarHideTimeoutId);
          scrollbarHideTimeoutId = null;
        }
        scrollbarTrack!.classList.add("ytls-scrollbar-visible");
      });
      scrollbarTrack.addEventListener("mouseleave", () => {
        if (isScrollbarDragging) return;
        scrollbarHideTimeoutId = setTimeout(() => {
          scrollbarTrack?.classList.remove("ytls-scrollbar-visible");
          scrollbarHideTimeoutId = null;
        }, 500);
      });

      // Drag scrollbar thumb
      scrollbarThumb.addEventListener("mousedown", (e) => {
        if (!list) return;
        e.preventDefault();
        e.stopPropagation();
        isScrollbarDragging = true;
        const startY = e.clientY;
        const startScrollTop = list.scrollTop;
        const { scrollHeight, clientHeight } = list;
        const thumbHeight = Math.max(30, (clientHeight / scrollHeight) * clientHeight);
        const scrollRange = scrollHeight - clientHeight;
        const thumbRange = clientHeight - thumbHeight;

        function onMouseMove(ev: MouseEvent) {
          if (!list) return;
          const delta = ev.clientY - startY;
          list.scrollTop = Math.max(0, Math.min(scrollRange, startScrollTop + delta * (scrollRange / thumbRange)));
          updateScrollbarThumb();
        }
        function onMouseUp() {
          isScrollbarDragging = false;
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
          // If the mouse is no longer over the track, start the hide timer
          if (!scrollbarTrack?.matches(":hover")) {
            scrollbarHideTimeoutId = setTimeout(() => {
              scrollbarTrack?.classList.remove("ytls-scrollbar-visible");
              scrollbarHideTimeoutId = null;
            }, 500);
          }
        }
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });

      pane.addEventListener("mouseenter", () => {
        isMouseOverTimestamps = true;
        showScrollbar();
      });

      list.addEventListener("scroll", showScrollbar);

      pane.addEventListener("mouseleave", () => {
        if (!isResizing && !isDragging) document.body.style.cursor = "";
        isMouseOverTimestamps = false;
        // Hide any visible tooltips when leaving the pane
        try {
          hideActiveTooltip();
        } catch (_) { }
        // Restore highlight when leaving the pane
        try {
          autoHighlightNearest(false);
        } catch (e) {
          // ignore
        }
      });

      // Dynamically set min-height: header + buttons + 1 li row
      function recalculateTimestampsArea() {
        if (pane && header && btns && list) {
          // Get bounding rectangles
          const paneRect = pane.getBoundingClientRect();
          const headerRect = header.getBoundingClientRect();
          const btnsRect = btns.getBoundingClientRect();
          // Calculate available height for the list
          const available =
            paneRect.height - (headerRect.height + btnsRect.height);
          list.style.maxHeight = available > 0 ? available + "px" : "0px";
          list.style.overflowY = available > 0 ? "auto" : "hidden";
        }
      }
      recalculateTimestampsAreaFn = recalculateTimestampsArea;

      setTimeout(() => {
        recalculateTimestampsArea();
        // Also set minPaneHeight for drag/resize logic
        if (pane && header && btns && list) {
          let liH = 40;
          const itemsForSize = getTimestampItems();
          if (itemsForSize.length > 0) {
            liH = (itemsForSize[0] as HTMLElement).offsetHeight;
          } else {
            const tempLi = document.createElement("li");
            tempLi.style.visibility = "hidden";
            tempLi.style.position = "absolute";
            tempLi.textContent = "00:00 Example";
            // Append temporarily so we can measure
            list.appendChild(tempLi);
            liH = tempLi.offsetHeight;
            list.removeChild(tempLi);
          }
          setMinPaneHeight(header.offsetHeight + btns.offsetHeight + liH);
          pane.style.minHeight = getMinPaneHeight() + "px";
        }
      }, 0);

      // Recalculate when the pane itself changes size (drag-resize); window resize is handled
      // by the debounced windowResizeHandler above which already calls recalculateTimestampsAreaFn.
      if (paneResizeObserver) {
        try {
          paneResizeObserver.disconnect();
        } catch (_) { }
        paneResizeObserver = null;
      }
      paneResizeObserver = new ResizeObserver(recalculateTimestampsArea);
      paneResizeObserver.observe(pane);

      // Track pointer interactions globally to differentiate user-initiated focus changes
      if (!docPointerDownHandler) {
        document.addEventListener(
          "pointerdown",
          (docPointerDownHandler = () => {
            lastPointerDownTs = Date.now();
          }),
          true,
        );
      }
      if (!docPointerUpHandler) {
        document.addEventListener(
          "pointerup",
          (docPointerUpHandler = () => {
            // no-op placeholder; reserved for future heuristics
          }),
          true,
        );
      }
    } finally {
      isPaneInitializing = false;
    }
  }

  // Append the pane to the DOM and set up final UI
  async function displayPane() {
    if (!pane) return;

    // Remove any existing panes in the DOM (safety check)
    const existingPanes = document.querySelectorAll("#ytls-pane");
    existingPanes.forEach((el) => {
      if (el !== pane) {
        log("Removing duplicate pane element from DOM");
        el.remove();
      }
    });

    // Prevent duplicate pane instances in the DOM
    if (document.body.contains(pane)) {
      log("Pane already in DOM, skipping append");
      return;
    }

    // Load the global UI visibility state BEFORE appending to DOM
    await loadUIVisibilityState();

    // Initialize Google Drive module callbacks
    GoogleDrive.setBuildExportPayload(buildExportPayload);
    GoogleDrive.setMergeBackupData(mergeBackupData);
    GoogleDrive.setSaveGlobalSettings(saveGlobalSettings);
    GoogleDrive.setLoadGlobalSettings(loadGlobalSettings);
    GoogleDrive.setReloadCurrentVideoTimestamps(loadTimestamps);
    GoogleDrive.setBackupStatusIndicator(backupStatusIndicator);
    SyncClient.setOnSyncStatusChange(() => GoogleDrive.updateBackupStatusIndicator());

    // Load Google auth state
    await GoogleDrive.loadGoogleAuthState();

    // Load auto backup settings and schedule if applicable
    await GoogleDrive.loadAutoBackupSettings();
    await GoogleDrive.scheduleAutoBackup();

    // Update backup status indicator after everything is loaded
    GoogleDrive.updateBackupStatusIndicator();

    // Aggressively ensure no duplicate panes exist before appending
    const allExistingPanes = document.querySelectorAll("#ytls-pane");
    if (allExistingPanes.length > 0) {
      log(
        `WARNING: Found ${allExistingPanes.length} existing pane(s) in DOM, removing all`,
      );
      allExistingPanes.forEach((el) => el.remove());
    }

    // Final safety check before append
    if (document.body.contains(pane)) {
      log("ERROR: Pane already in body, aborting append");
      return;
    }

    // Now append the pane with the correct minimized state already applied
    document.body.appendChild(pane);
    log("Pane successfully appended to DOM");
    // Hide timestamps until the initial display animation completes and schedule final sizing
    startShowAnimation();
    // Also schedule a follow-up after animation to catch final layout
    if (visibilitySizingTimeoutId) {
      clearTimeout(visibilitySizingTimeoutId);
      visibilitySizingTimeoutId = null;
    }
    visibilitySizingTimeoutId = setTimeout(() => {
      // If timestamps were deferred while animating, append them first so sizing sees them
      appendPendingTimestamps();
      recalculateTimestampsAreaFn?.();
      ensureMinPaneHeight();
      clampAndSavePanePosition(true);
      visibilitySizingTimeoutId = null;
    }, 450);

    // Install mutation observer to detect and prevent duplicate panes
    if (paneObserver) {
      try {
        paneObserver.disconnect();
      } catch (_) { }
      paneObserver = null;
    }
    paneObserver = new MutationObserver(() => {
      const panes = document.querySelectorAll("#ytls-pane");
      if (panes.length > 1) {
        log(
          `CRITICAL: Multiple panes detected (${panes.length}), removing duplicates`,
        );
        panes.forEach((el, index) => {
          if (index > 0 || (pane && el !== pane)) {
            el.remove();
          }
        });
      }
    });
    // Pane is always a direct child of body — no need to watch the entire subtree
    paneObserver.observe(document.body, { childList: true });
  }

  function addHeaderButton(attempt = 0) {
    // Avoid creating duplicates
    if (document.getElementById("ytls-header-button")) {
      syncToggleButtons();
      return;
    }

    const logoElement = document.querySelector<HTMLElement>("#logo");
    if (!logoElement || !logoElement.parentElement) {
      if (attempt < 10) {
        setTimeout(() => addHeaderButton(attempt + 1), 300);
      }
      return;
    }

    const headerButton = document.createElement("button");
    headerButton.id = "ytls-header-button";
    headerButton.type = "button";
    headerButton.className = "ytls-header-button";
    addTooltip(headerButton, "Toggle Timekeeper UI");
    headerButton.setAttribute("aria-label", "Toggle Timekeeper UI");

    const headerIcon = document.createElement("img");
    headerIcon.src = HEADER_ICON_DEFAULT_URL;
    headerIcon.alt = "";
    headerIcon.decoding = "async";

    headerButton.appendChild(headerIcon);
    headerButtonImage = headerIcon;
    headerButton.addEventListener("mouseenter", () => {
      if (!headerButtonImage) return;
      isHeaderButtonHovered = true;
      headerButtonImage.src = HEADER_ICON_HOVER_URL;
    });
    headerButton.addEventListener("mouseleave", () => {
      if (!headerButtonImage) return;
      isHeaderButtonHovered = false;
      syncToggleButtons();
    });
    headerButton.addEventListener("click", () => {
      // Ensure pane is in DOM before toggling
      if (pane && !document.body.contains(pane)) {
        log("Pane not in DOM, re-appending before toggle");
        document.body.appendChild(pane);
      }
      togglePaneVisibility();
    });

    logoElement.insertAdjacentElement("afterend", headerButton);
    syncToggleButtons();
    log("Timekeeper header button added next to YouTube logo");
  }

  function setupUrlChangeHandlers() {
    if (getUrlChangeHandlersSetup()) return;
    setUrlChangeHandlersSetup(true);

    const origPush = history.pushState;
    const origReplace = history.replaceState;

    function dispatchLocationChange() {
      try {
        const ev = new Event("locationchange");
        window.dispatchEvent(ev);
      } catch (e) {
        // ignore
      }
    }

    history.pushState = function () {
      const res = origPush.apply(this, arguments as any);
      dispatchLocationChange();
      return res;
    } as any;

    history.replaceState = function () {
      const res = origReplace.apply(this, arguments as any);
      dispatchLocationChange();
      return res;
    } as any;

    window.addEventListener("popstate", dispatchLocationChange);

    window.addEventListener("locationchange", () => {
      if (window.location.href !== lastHandledUrl) {
        log(
          "Location changed (locationchange event) — deferring UI update until navigation finish",
        );
      }
    });
  }

  // Add a function to handle URL changes
  async function handleUrlChange() {
    if (!isSupportedUrl()) {
      unloadTimekeeper();
      return;
    }

    // Track last handled URL so repeated history events don't trigger duplicate work
    setLastHandledUrl(window.location.href);

    // Remove any duplicate panes BEFORE initialization
    document.querySelectorAll("#ytls-pane").forEach((el, idx) => {
      if (idx > 0 || (pane && el !== pane)) el.remove();
    });

    await waitForYouTubeReady();
    await initializePaneIfNeeded();

    currentLoadedVideoId = getVideoId(); // Update global video ID
    const pageTitle = document.title;
    log("Page Title:", pageTitle);
    log("Video ID:", currentLoadedVideoId);
    log("Current URL:", window.location.href);

    // Ensure the UI is locked and shows the loading placeholder while we fetch data for the new video
    setLoadingState(true);

    clearTimestampsDisplay();
    updateSeekbarMarkers();

    // loadTimestamps will get the videoId itself, load data from IndexedDB (migrating from localStorage if needed),
    await loadTimestamps();

    // Ensure seekbar markers are updated after timestamps are loaded
    updateSeekbarMarkers();

    // Set loading state to false after timestamps are loaded
    setLoadingState(false);
    log("Timestamps loaded and UI unlocked for video:", currentLoadedVideoId);

    // Display the pane after loading timestamps (with correct visibility state)
    await displayPane();

    try {
      autoHighlightNearest(true);
    } catch (e) {
      // ignore errors when trying to compute or highlight on navigation
    }

    addHeaderButton();

    // Setup video event listeners for highlighting and URL updates
    setupVideoEventListeners();
  }

  // Setup history-based URL handlers (pushState/replaceState/popstate) so SPA navigation triggers full redraw
  setupUrlChangeHandlers();

  // Listen for navigation start and lock UI with loading state
  window.addEventListener("yt-navigate-start", () => {
    log("Navigation started (yt-navigate-start event fired)");
    // Persist typed-but-unsaved comments before the loading lock below blocks saves
    flushPendingCommentSaves();
    if (isSupportedUrl() && pane && list) {
      log("Locking UI and showing loading state for navigation");
      setLoadingState(true);
    }
  });

  // Keyboard shortcut: Ctrl+Alt+Shift+T to toggle Timekeeper UI
  keydownHandler = (e: KeyboardEvent) => {
    if (
      !e.repeat &&
      !e.ctrlKey &&
      !e.altKey &&
      !e.metaKey &&
      !e.shiftKey &&
      (e.key === "z" || e.key === "Z")
    ) {
      if (isEditableTarget(e.target)) {
        return;
      }

      if (togglePlaybackSpeed()) {
        e.preventDefault();
        log("Playback speed toggled via keyboard shortcut (Z)");
      }
      return;
    }

    if (
      e.ctrlKey &&
      e.altKey &&
      e.shiftKey &&
      (e.key === "T" || e.key === "t")
    ) {
      e.preventDefault();
      togglePaneVisibility();
      log("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)");
    }
  };
  document.addEventListener("keydown", keydownHandler);

  // Persist pending comment edits when the page is closed, reloaded, or backgrounded
  // (on mobile and bfcache pages `pagehide` may be the only chance we get).
  window.addEventListener("pagehide", flushPendingCommentSaves);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushPendingCommentSaves();
    }
  });

  // Tell the sync server whether this video is members-only; it answers whether the account can access it.
  function reportWatchPageAccess(navigation: any) {
    const pageWindow: any = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
    const page = readWatchPageAccess(
      navigation?.response ?? pageWindow.ytInitialData,
      navigation?.playerResponse ?? pageWindow.ytInitialPlayerResponse,
    );
    if (!page) return;
    void SyncClient.reportWatchPageAccess(page).then((access) => {
      if (access) log(`Video ${page.videoId}: members-only=${access.membersOnly}, can access=${access.canAccess}`);
    });
  }

  // Listen for navigation completion and load timestamps when navigation finishes
  window.addEventListener("yt-navigate-finish", (event) => {
    log("Navigation finished (yt-navigate-finish event fired)");
    reportWatchPageAccess((event as CustomEvent).detail?.response);
    // Only handle if the URL changed since last handled
    if (window.location.href !== lastHandledUrl) {
      handleUrlChange();
    } else {
      log("Navigation finished but URL already handled, skipping.");
    }
  });

  // Comment timestamp links: YouTube seeks and then scrolls the page to the top. Seek directly instead.
  function parseTimeParam(value: string): number | null {
    const m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(value);
    if (m && (m[1] || m[2] || m[3])) {
      return Number(m[1] || 0) * 3600 + Number(m[2] || 0) * 60 + Number(m[3] || 0);
    }
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  document.addEventListener(
    "click",
    (e) => {
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement | null)?.closest?.(
        "ytd-comments a[href]",
      ) as HTMLAnchorElement | null;
      if (!link) return;
      const url = new URL(link.href, location.href);
      const t = url.searchParams.get("t");
      if (url.pathname !== "/watch" || !t || url.searchParams.get("v") !== getVideoId()) return;
      const time = parseTimeParam(t);
      const player = getActivePlayer();
      if (time === null || !player) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      player.seekTo(time);
    },
    true,
  );

  // Live sync: show remote changes in the open video (and other tabs), then resume the saved session.
  SyncClient.setOnRemoteChange((videoIds) => {
    for (const videoId of videoIds) {
      safePostMessage({ type: "timestamps_updated", videoId, action: "synced" });
    }
    if (currentLoadedVideoId && videoIds.includes(currentLoadedVideoId)) {
      loadTimestamps();
    }
  });
  // Not awaited: a slow or unreachable sync server must never delay the UI.
  void SyncClient.loadSyncAuthState();

  // Timekeeper initialization: ensure handlers are active and wait for navigation finish before drawing UI
  setupUrlChangeHandlers();

  log("Timekeeper initialized and waiting for navigation events");
})();
