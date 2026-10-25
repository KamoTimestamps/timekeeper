/** The search box's query language: plain words, plus `title:` and `channel:` to look in one field. */

export interface ParsedSearch {
  /** Match the comment, the video ID, or the title or channel. */
  words: string[];
  /** Must be in the video's title. */
  title: string[];
  /** Must be in the channel's name. */
  channel: string[];
  /** Air-date terms, still as typed (a day, month, year or range; see dates.ts). */
  date: string[];
}

/** A value is one word, or a "quoted phrase" (so it can hold spaces): `title:boss`, `channel:"Kanna Yanagi"`. */
const TOKEN = /(?:(title|channel|date):)?(?:"([^"]*)"?|([^\s"]+))/gi;

/**
 * Splits a query into what to match where. Every term must match (AND), at most `maxTerms` of them.
 * A bare `title:` or `channel:` with nothing after it (someone mid-typing) is ignored rather than
 * searched for as text.
 */
export function parseSearch(query: string, maxTerms = 8): ParsedSearch {
  const parsed: ParsedSearch = { words: [], title: [], channel: [], date: [] };
  let count = 0;
  for (const match of query.matchAll(TOKEN)) {
    if (count >= maxTerms) break;
    const [, field, quoted, bare] = match;
    const value = (quoted ?? bare).trim();
    if (!value || (!field && /^(?:title|channel|date):$/i.test(value))) continue;
    (field ? parsed[field.toLowerCase() as 'title' | 'channel' | 'date'] : parsed.words).push(value);
    count++;
  }
  return parsed;
}

/** `value` as a LIKE pattern matching it anywhere, with %, _ and \ taken literally (use ESCAPE '\'). */
export const likeContains = (value: string) => `%${value.replace(/[\\%_]/g, '\\$&')}%`;
