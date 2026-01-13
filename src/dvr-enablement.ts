/**
 * DVR/Rewind Enablement for YouTube Live Streams
 *
 * Intercepts YouTube's playerResponse to enable DVR and extend rewind capabilities
 * for live streams, even when disabled by the broadcaster or exceeding 12 hours.
 *
 * Based on: https://greasyfork.org/en/scripts/485020-ytbetter-enable-rewind-dvr
 *
 * This module must be loaded early (at document-start) to intercept the playerResponse
 * property before YouTube's player initializes.
 */

import { log } from './util';

/**
 * Initialize the DVR/Rewind enablement by intercepting YouTube's playerResponse.
 * This function sets up a property descriptor that modifies live stream configurations
 * to enable DVR and extend rewind capabilities.
 */
export function initializeDvrEnablement(): void {
  // Interop with "Simple YouTube Age Restriction Bypass" and other scripts
  const {
    get: playerResponseGetter,
    set: playerResponseSetter,
  } = Object.getOwnPropertyDescriptor(Object.prototype, "playerResponse") ?? {
    set(value: any) {
      (this as any)[Symbol.for("YTBetter")] = value;
    },
    get() {
      return (this as any)[Symbol.for("YTBetter")];
    },
  };

  const isObject = (value: any): boolean => value != null && typeof value === "object";

  const getKeyByPropName = (object: any, value: string): string | undefined =>
    Object.keys(object).find(key => object[key] && object[key][value]);

  // Define the playerResponse property interceptor
  Object.defineProperty(Object.prototype, "playerResponse", {
    set(value: any) {
      if (isObject(value)) {
        const { streamingData, videoDetails, playerConfig, microformat } = value;

        // Only affect live streams
        if (isObject(videoDetails) && videoDetails.isLive) {
          // Enable DVR if it's disabled
          videoDetails.isLiveDvrEnabled = true;

          // Disable server-side ads that block live rewind
          if (isObject(playerConfig) && playerConfig.mediaCommonConfig) {
            const mcConf = playerConfig.mediaCommonConfig;
            mcConf.useServerDrivenAbr = false;

            // Disable server playback start config
            if (mcConf.serverPlaybackStartConfig) {
              mcConf.serverPlaybackStartConfig.enable = false;
            }
          }

          if (isObject(streamingData)) {
            // Remove the stream URL with server-side ads if others are available
            if (streamingData.serverAbrStreamingUrl &&
                (streamingData.hlsManifestUrl || streamingData.dashManifestUrl)) {
              delete streamingData.serverAbrStreamingUrl;
            }

            // Unlock rewind past 12 hours (43200 seconds), up to 14 days
            const maxDefault = 43200;
            const maxDvrSecs = maxDefault * 14; // ~7 days worth doubled
            let durationSecs = 0;

            const s1 = 'playerMicroformatRenderer';
            const s2 = 'liveBroadcastDetails';
            const s3 = 'html5_max_live_dvr_window_plus_margin_secs';

            // Calculate stream duration from start timestamp
            if (isObject(microformat) &&
                isObject(microformat[s1]) &&
                isObject(microformat[s1][s2])) {
              const nowMs = Date.now();
              const startMs = new Date(microformat[s1][s2].startTimestamp).getTime();
              durationSecs = Math.floor((nowMs - startMs) / 1000);
            }

            // Proceed if the stream is longer than 12 hours
            if (durationSecs > maxDefault) {
              // Set max DVR duration on all adaptive formats
              if (Array.isArray(streamingData.adaptiveFormats)) {
                for (const format of streamingData.adaptiveFormats) {
                  format.maxDvrDurationSec = maxDvrSecs;
                }
              }

              // Update experiment flags for DVR window
              const key = getKeyByPropName(this, 'experiments');
              if (key && (this as any)[key]?.experiments?.flags) {
                (this as any)[key].experiments.flags[s3] = maxDvrSecs;
              }
            }
          }
        }
      }
      playerResponseSetter.call(this, value);
    },
    get() {
      return playerResponseGetter.call(this);
    },
    configurable: true,
  });

  log("[Timekeeper] DVR/Rewind enablement initialized for live streams");
}
