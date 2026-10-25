import type { Store, VideoInfo } from './store.ts';

/** Looks up public details for up to 50 video IDs; IDs YouTube doesn't return are simply absent. */
export type VideoLookup = (videoIds: string[]) => Promise<Map<string, VideoInfo>>;

const VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';

/** Hits and misses are both re-checked after this long, so edited titles show up and quota use stays tiny. */
export const VIDEO_INFO_TTL_MS = 24 * 60 * 60 * 1000;

interface VideosResponse {
  items?: Array<{
    id: string;
    snippet?: {
      title?: string;
      channelTitle?: string;
      publishedAt?: string;
      thumbnails?: Record<string, { url?: string } | undefined>;
    };
  }>;
}

/** YouTube Data API `videos.list`: one quota unit per call. The key goes in a header, not the URL, so it stays out of logs. */
export function createYouTubeClient(apiKey: string, fetchFn: typeof fetch = fetch): VideoLookup {
  return async (videoIds) => {
    const url = new URL(VIDEOS_URL);
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('id', videoIds.join(','));
    url.searchParams.set('fields', 'items(id,snippet(title,channelTitle,publishedAt,thumbnails))');

    const res = await fetchFn(url, { headers: { 'x-goog-api-key': apiKey }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`YouTube API responded ${res.status}`);

    const body = (await res.json()) as VideosResponse;
    const found = new Map<string, VideoInfo>();
    for (const item of body.items ?? []) {
      if (!item.snippet?.title) continue;
      found.set(item.id, {
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle ?? '',
        thumbnailUrl: item.snippet.thumbnails?.medium?.url ?? item.snippet.thumbnails?.default?.url ?? null,
        publishedAt: item.snippet.publishedAt ?? null,
      });
    }
    return found;
  };
}

/**
 * Video details for the landing page, from the cache where fresh and from YouTube otherwise. Never
 * throws: if YouTube is unreachable the stale copy is used, and videos with none are left out.
 */
export async function resolveVideoInfo(
  store: Store,
  lookup: VideoLookup,
  videoIds: string[],
  log: { warn: (obj: object, msg: string) => void },
  now = Date.now(),
): Promise<Map<string, VideoInfo>> {
  const cached = new Map(store.getCachedVideoInfo(videoIds).map((entry) => [entry.videoId, entry]));
  const stale = videoIds.filter((id) => {
    const entry = cached.get(id);
    return !entry || now - entry.fetchedAt >= VIDEO_INFO_TTL_MS;
  });

  if (stale.length > 0) {
    try {
      const found = await lookup(stale);
      const fresh = stale.map((videoId) => ({ videoId, info: found.get(videoId) ?? null }));
      store.saveVideoInfo(fresh, now);
      for (const { videoId, info } of fresh) cached.set(videoId, { videoId, fetchedAt: now, info });
    } catch (err) {
      log.warn({ err: (err as Error).message }, 'youtube lookup failed; using cached video info');
    }
  }

  const result = new Map<string, VideoInfo>();
  for (const [videoId, entry] of cached) if (entry.info) result.set(videoId, entry.info);
  return result;
}
