/** Lists the channel IDs the Google account behind an OAuth access token (scope `youtube.readonly`) subscribes to. */
export type SubscriptionsLookup = (accessToken: string) => Promise<string[]>;

/** Raised when Google refuses the token itself (expired, revoked, or missing the YouTube scope). */
export class SubscriptionsAuthError extends Error {}

const SUBSCRIPTIONS_URL = 'https://www.googleapis.com/youtube/v3/subscriptions';

/** 50 per page and one quota unit per page, so this covers 5,000 subscriptions. */
const MAX_PAGES = 100;

interface SubscriptionsResponse {
  nextPageToken?: string;
  items?: Array<{ snippet?: { resourceId?: { channelId?: string } } }>;
}

export function createSubscriptionsClient(fetchFn: typeof fetch = fetch): SubscriptionsLookup {
  return async (accessToken) => {
    const channelIds = new Set<string>();
    let pageToken: string | undefined;

    for (let page = 0; page < MAX_PAGES; page++) {
      const url = new URL(SUBSCRIPTIONS_URL);
      url.searchParams.set('part', 'snippet');
      url.searchParams.set('mine', 'true');
      url.searchParams.set('maxResults', '50');
      url.searchParams.set('fields', 'nextPageToken,items(snippet(resourceId(channelId)))');
      if (pageToken) url.searchParams.set('pageToken', pageToken);

      const res = await fetchFn(url, { headers: { authorization: `Bearer ${accessToken}` }, signal: AbortSignal.timeout(5000) });
      if (res.status === 401 || res.status === 403) throw new SubscriptionsAuthError(`YouTube API responded ${res.status}`);
      if (!res.ok) throw new Error(`YouTube API responded ${res.status}`);

      const body = (await res.json()) as SubscriptionsResponse;
      for (const item of body.items ?? []) {
        const channelId = item.snippet?.resourceId?.channelId;
        if (channelId) channelIds.add(channelId);
      }
      pageToken = body.nextPageToken;
      if (!pageToken) break;
    }
    return [...channelIds];
  };
}
