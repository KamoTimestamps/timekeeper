import type { Store } from './store.ts';

/** What an anonymous viewer is told about a video; null when YouTube gives no usable answer (private, deleted, blocked). */
export type VideoAccessCheck = (videoId: string) => Promise<{ channelId: string; membersOnly: boolean } | null>;

const WATCH_URL = 'https://www.youtube.com/watch';

// A plain browser's headers: consent cookies keep EU servers from answering with a consent page.
const WATCH_HEADERS = {
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  'accept-language': 'en-US,en;q=0.9',
  cookie: 'CONSENT=YES+1; SOCS=CAI',
};

/** `offerId` YouTube puts on the join prompt that replaces the player of a members-only video. */
const MEMBERS_ONLY_OFFER_ID = 'sponsors_only_video';

/** A video's status can change (members-only videos are often opened to everyone later), so it is re-checked after this long. */
export const VIDEO_ACCESS_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** Pause between lookups, so a backfill of many videos doesn't hammer YouTube. */
const CHECK_DELAY_MS = 300;

interface PlayerResponse {
  playabilityStatus?: { status?: string; errorScreen?: { playerLegacyDesktopYpcOfferRenderer?: { offerId?: string } } };
  videoDetails?: { channelId?: string };
}

/** The JSON object assigned to `ytInitialPlayerResponse` in a watch page, or null. Braces inside strings don't count. */
export function extractPlayerResponse(html: string): PlayerResponse | null {
  const marker = html.indexOf('ytInitialPlayerResponse =');
  const start = marker < 0 ? -1 : html.indexOf('{', marker);
  if (start < 0) return null;

  let depth = 0;
  let inString = false;
  for (let i = start; i < html.length; i++) {
    const c = html[i];
    if (inString) {
      if (c === '\\') i++;
      else if (c === '"') inString = false;
    } else if (c === '"') inString = true;
    else if (c === '{') depth++;
    else if (c === '}' && --depth === 0) {
      try {
        return JSON.parse(html.slice(start, i + 1)) as PlayerResponse;
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * Loads the watch page signed out, as a logged-out visitor's browser does: a members-only video comes back
 * UNPLAYABLE with a join offer, a public one comes back OK. (InnerTube's `/player` endpoint called bare
 * answers "Video unavailable" for public videos too, so it can't tell them apart.) This is page scraping,
 * not a documented API, so a change on YouTube's side shows up as null results, not errors.
 */
export function createVideoAccessCheck(fetchFn: typeof fetch = fetch): VideoAccessCheck {
  return async (videoId) => {
    const url = new URL(WATCH_URL);
    url.searchParams.set('v', videoId);
    const res = await fetchFn(url, { headers: WATCH_HEADERS, signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`YouTube watch page responded ${res.status}`);

    const player = extractPlayerResponse(await res.text());
    const channelId = player?.videoDetails?.channelId;
    const status = player?.playabilityStatus;
    if (status?.errorScreen?.playerLegacyDesktopYpcOfferRenderer?.offerId === MEMBERS_ONLY_OFFER_ID) {
      return channelId ? { channelId, membersOnly: true } : null;
    }
    return status?.status === 'OK' && channelId ? { channelId, membersOnly: false } : null;
  };
}

export interface VideoAccessChecker {
  /** Checks, in the background, any of these videos not yet checked by the server. Returns immediately. */
  enqueue(videoIds: string[]): void;
  /** Drops what is still queued, so shutdown doesn't wait out a long backfill. */
  stop(): void;
  /** Resolves once nothing is queued or in flight. */
  idle(): Promise<void>;
}

/**
 * Records, for each video users add timestamps to, whether it is members-only. A failed lookup drops the
 * queue (the next sighting retries); a video YouTube won't describe is skipped until the process restarts.
 */
export function createVideoAccessChecker(
  store: Store,
  check: VideoAccessCheck,
  log: { warn: (obj: object, msg: string) => void },
  delayMs = CHECK_DELAY_MS,
): VideoAccessChecker {
  const queued = new Set<string>();
  const unanswerable = new Set<string>();
  let draining: Promise<void> | null = null;

  const drain = async () => {
    try {
      while (queued.size > 0) {
        const videoId = queued.values().next().value as string;
        queued.delete(videoId);
        try {
          const result = await check(videoId);
          if (result) store.saveVideoAccess(videoId, result.channelId, result.membersOnly, Date.now(), 'server');
          else unanswerable.add(videoId);
        } catch (err) {
          log.warn({ err: (err as Error).message }, 'video access check failed');
          queued.clear();
          return;
        }
        if (queued.size > 0 && delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    } finally {
      draining = null;
    }
  };

  return {
    enqueue(videoIds) {
      const done = store.serverCheckedVideoIds(videoIds);
      for (const videoId of videoIds) if (!done.has(videoId) && !unanswerable.has(videoId)) queued.add(videoId);
      if (queued.size > 0 && !draining) draining = drain();
    },
    stop: () => queued.clear(),
    idle: async () => {
      while (draining) await draining;
    },
  };
}
