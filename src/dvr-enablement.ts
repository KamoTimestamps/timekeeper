/**
 * DVR/Rewind Enablement for YouTube Live Streams
 *
 * Patches YouTube's playerResponse to enable DVR and extend rewind capabilities
 * for live streams, even when disabled by the broadcaster or exceeding 12 hours.
 *
 * Based on: https://greasyfork.org/en/scripts/485020-dvr-chan-force-enable-youtube-dvr-rewind
 *
 * WHY we don't define playerResponse on Object.prototype:
 *   Old versions used Object.defineProperty(Object.prototype, "playerResponse", ...).
 *   That made `"playerResponse" in <anything>` return true for EVERY object on the page.
 *   YouTube's internal response router does exactly that check to decide what a
 *   response is, so it mistook comment/feed responses for player data and threw their
 *   contents away (comments stopped loading for everyone).
 *
 *   Instead, we hook two real interception points:
 *   1. ytInitialPlayerResponse  – the inline page global on first load
 *   2. JSON.parse               – for later in-site navigations (API responses)
 *   3. ytcfg.set                – to lift the DVR-cap experiment flag
 *
 * This module must be loaded early (at document-start).
 */

import { log } from './util';

/**
 * Default live DVR window is 12 hours (43 200 s). We open it up to 7 days (14×).
 */
const MAX_DVR_SECS = 43200 * 14; // 604 800
const DVR_FLAG = "html5_max_live_dvr_window_plus_margin_secs";

/* ── Core: patch one player-response object in place ─────────────────────────────── */

function isObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object";
}

function modifyPlayerResponse(pr: Record<string, unknown>): void {
  const {
    streamingData,
    videoDetails,
    playerConfig,
    microformat,
  } = pr as { streamingData?: unknown; videoDetails?: unknown; playerConfig?: unknown; microformat?: unknown };

  // Only live streams have DVR. Leave normal videos / finished VODs alone.
  if (!isObject(videoDetails) || !videoDetails.isLive) return;

  // 1) Enable rewind even when the broadcaster turned DVR off.
  (videoDetails as Record<string, unknown>).isLiveDvrEnabled = true;

  // 2) Disable server-driven playback that blocks client-side seeking.
  if (isObject(playerConfig)) {
    const mc = (playerConfig as Record<string, unknown>).mediaCommonConfig;
    if (isObject(mc)) {
      (mc as Record<string, unknown>).useServerDrivenAbr = false;
      const spsc = (mc as Record<string, unknown>).serverPlaybackStartConfig;
      if (isObject(spsc)) {
        (spsc as Record<string, unknown>).enable = false;
      }
    }
  }

  if (isObject(streamingData)) {
    // 3) Drop the ad-carrying server-ABR stream URL when a clean manifest exists.
    const sd = streamingData as Record<string, unknown>;
    if (
      sd.serverAbrStreamingUrl &&
      (sd.hlsManifestUrl || sd.dashManifestUrl)
    ) {
      delete sd.serverAbrStreamingUrl;
    }

    // 4) For streams already running > 12 h, widen each format's DVR window.
    if (
      Array.isArray(sd.adaptiveFormats) &&
      streamRunningOver12h(microformat)
    ) {
      for (const format of sd.adaptiveFormats) {
        (format as Record<string, unknown>).maxDvrDurationSec = MAX_DVR_SECS;
      }
    }
  }
}

function streamRunningOver12h(microformat: unknown): boolean {
  if (!isObject(microformat)) return false;
  const pmf = microformat.playerMicroformatRenderer;
  if (!isObject(pmf)) return false;
  const live = pmf.liveBroadcastDetails;
  if (!isObject(live)) return false;
  const startTs = (live as Record<string, unknown>).startTimestamp;
  if (!startTs || typeof startTs !== "string") return false;
  const seconds = (Date.now() - new Date(startTs).getTime()) / 1000;
  return seconds > 43200;
}

/**
 * A player response can arrive on its own or wrapped under a `playerResponse` key.
 * Returns true if something was patched.
 */
function patchResponse(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  if (obj.videoDetails) {
    modifyPlayerResponse(obj);
    return true;
  }
  if (
    obj.playerResponse &&
    isObject(obj.playerResponse) &&
    (obj.playerResponse as Record<string, unknown>).videoDetails
  ) {
    modifyPlayerResponse(obj.playerResponse as Record<string, unknown>);
    return true;
  }
  return false;
}

/* ── Source 1: the inline global `ytInitialPlayerResponse` on first page load ─────── */

function hookYtInitialPlayerResponse(): void {
  const previousInitialDescriptor = Object.getOwnPropertyDescriptor(
    window,
    "ytInitialPlayerResponse",
  );
  const previousInitialSetter =
    previousInitialDescriptor && previousInitialDescriptor.set;

  let initialResponse = (window as any).ytInitialPlayerResponse;

  if (!patchResponse(initialResponse)) {
    try {
      Object.defineProperty(window, "ytInitialPlayerResponse", {
        configurable: true,
        get() {
          return initialResponse;
        },
        set(value: unknown) {
          if (previousInitialSetter) {
            previousInitialSetter.call(this, value);
          }
          initialResponse = value;
          if (patchResponse(value)) {
            // Once patched, replace the descriptor so uBO / other scriptlets
            // can keep editing the global normally.
            Object.defineProperty(window, "ytInitialPlayerResponse", {
              configurable: true,
              writable: true,
              value: value,
            });
          }
        },
      });
    } catch { /* already a non-configurable global — data likely already available */ }
  }
}

/* ── Source 2: JSON.parse for later in-site navigations ──────────────────────────── */

let jsonParseHooked = false;

function hookJsonParse(): void {
  if (jsonParseHooked) return;
  jsonParseHooked = true;

  const nativeParse = JSON.parse;
  JSON.parse = function (this: unknown, text: string, reviver?: (this: unknown, key: string, value: unknown) => unknown) {
    const data = nativeParse.call(this, text, reviver);
    try {
      patchResponse(data);
    } catch { /* never let our code break the page */ }
    return data;
  };
}

/* ── Source 3: ytcfg.set to lift the DVR experiment-cap ──────────────────────────── */

function liftDvrCap(ytcfg: Record<string, unknown>): void {
  if (ytcfg.__dvrCapLifted) return;
  const store = typeof ytcfg.d === "function" ? ytcfg.d() : undefined;
  const players = (store as Record<string, unknown>)?.WEB_PLAYER_CONTEXT_CONFIGS;
  if (!players) return; // config not loaded yet; retry on next set()

  const playerMap = players as Record<string, unknown>;
  for (const id in playerMap) {
    const cfg = playerMap[id];
    if (
      cfg &&
      typeof (cfg as Record<string, unknown>).serializedExperimentFlags === "string"
    ) {
      const serialized = (cfg as Record<string, unknown>)
        .serializedExperimentFlags as string;
      const updated = serialized.replace(
        new RegExp(`${DVR_FLAG}=[\\d.]+`),
        `${DVR_FLAG}=${MAX_DVR_SECS}`,
      );
      if (updated !== serialized) {
        (cfg as Record<string, unknown>).serializedExperimentFlags = updated;
      }
    }
  }
  (ytcfg as Record<string, unknown>).__dvrCapLifted = true;
}

function hookYtcfg(ytcfg: Record<string, unknown>): Record<string, unknown> {
  if (!ytcfg || (ytcfg as Record<string, unknown>).__dvrHooked) return ytcfg;
  (ytcfg as Record<string, unknown>).__dvrHooked = true;

  const nativeSet = ytcfg.set;
  if (typeof nativeSet === "function") {
    (ytcfg as any).set = function (this: unknown, ...args: unknown[]) {
      const result = nativeSet.apply(this, args);
      try {
        liftDvrCap(ytcfg);
      } catch { /* ignore */ }
      return result;
    };
  }

  try {
    liftDvrCap(ytcfg);
  } catch { /* config may not be loaded yet */ }
  return ytcfg;
}

function hookYtcfgGlobal(): void {
  let cfgRef: Record<string, unknown> = {} as Record<string, unknown>;

  if ((window as any).ytcfg) {
    cfgRef = hookYtcfg((window as any).ytcfg);
  }

  try {
    Object.defineProperty(window, "ytcfg", {
      configurable: true,
      get() {
        return cfgRef;
      },
      set(value: unknown) {
        cfgRef = hookYtcfg(value as Record<string, unknown>);
      },
    });
  } catch { /* already non-configurable — already hooked above */ }
}

/* ── Public entry point ──────────────────────────────────────────────────────────── */

/**
 * Initialize DVR/Rewind enablement for YouTube live streams.
 * Must be called at document-start (before YouTube's player initializes).
 */
export function initializeDvrEnablement(): void {
  hookYtInitialPlayerResponse();
  hookJsonParse();
  hookYtcfgGlobal();

  log("[Timekeeper] DVR/Rewind enablement initialized for live streams");
}
