/**
 * Spots members-only videos from the data YouTube loads for a watch page. The Data API doesn't say
 * whether a video is members-only, but the page's primary info carries a "Members only" badge whose
 * style is language independent.
 */

const MEMBERS_ONLY_BADGE_STYLE = "BADGE_STYLE_TYPE_MEMBERS_ONLY";
const MAX_DEPTH = 8;

export interface WatchPageAccess {
  videoId: string;
  channelId: string;
  membersOnly: boolean;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasMembersBadge(node: unknown, depth = 0): boolean {
  if (!isObject(node) || depth > MAX_DEPTH) return false;
  if (node.style === MEMBERS_ONLY_BADGE_STYLE) return true;
  return Object.values(node).some((child) => hasMembersBadge(child, depth + 1));
}

/**
 * `response` and `playerResponse` are the two halves of a watch-page load (`ytInitialData` and
 * `ytInitialPlayerResponse` on first load, `event.detail.response` on later navigations). Only the
 * video's own primary info is searched: the sidebar's other videos carry the same badge.
 */
export function readWatchPageAccess(response: unknown, playerResponse: unknown): WatchPageAccess | null {
  const details = isObject(playerResponse) ? playerResponse.videoDetails : undefined;
  if (!isObject(details) || typeof details.videoId !== "string" || typeof details.channelId !== "string") return null;

  const results = (response as any)?.contents?.twoColumnWatchNextResults?.results?.results?.contents;
  // Without the page data we can't tell, and "not members-only" would be a claim, not a default.
  if (!Array.isArray(results)) return null;

  const primary = results.find((entry) => isObject(entry) && isObject(entry.videoPrimaryInfoRenderer));
  if (!primary) return null;

  return {
    videoId: details.videoId,
    channelId: details.channelId,
    membersOnly: hasMembersBadge(primary.videoPrimaryInfoRenderer),
  };
}
