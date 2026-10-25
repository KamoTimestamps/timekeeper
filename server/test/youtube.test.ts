import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Store, type VideoInfo } from '../src/store.ts';
import { createYouTubeClient, resolveVideoInfo, VIDEO_INFO_TTL_MS, type VideoLookup } from '../src/youtube.ts';

const info = (title: string): VideoInfo => ({ title, channelTitle: 'Chan', thumbnailUrl: 'https://i.ytimg.com/vi/x/mqdefault.jpg', publishedAt: '2026-01-01T00:00:00Z' });
const log = { warn: () => {} };

describe('YouTube client', () => {
  it('asks videos.list for the snippet, sends the key as a header, and maps the response', async () => {
    let seen: { url: URL; headers: Record<string, string> } | undefined;
    const fakeFetch = (async (url: URL, init: RequestInit) => {
      seen = { url, headers: init.headers as Record<string, string> };
      return Response.json({
        items: [
          { id: 'a', snippet: { title: 'Hello', channelTitle: 'Chan', publishedAt: '2026-01-01T00:00:00Z', thumbnails: { default: { url: 'd' }, medium: { url: 'm' } } } },
          { id: 'b', snippet: { title: 'No thumbs' } },
        ],
      });
    }) as unknown as typeof fetch;

    const found = await createYouTubeClient('secret', fakeFetch)(['a', 'b', 'gone']);

    assert.equal(seen?.url.searchParams.get('id'), 'a,b,gone');
    assert.equal(seen?.url.searchParams.get('part'), 'snippet');
    assert.equal(seen?.headers['x-goog-api-key'], 'secret');
    assert.ok(!seen?.url.href.includes('secret'), 'key must not be in the URL');
    assert.deepEqual(found.get('a'), { title: 'Hello', channelTitle: 'Chan', thumbnailUrl: 'm', publishedAt: '2026-01-01T00:00:00Z' });
    assert.deepEqual(found.get('b'), { title: 'No thumbs', channelTitle: '', thumbnailUrl: null, publishedAt: null });
    assert.equal(found.has('gone'), false);
  });

  it('throws on an API error without leaking the key', async () => {
    const fakeFetch = (async () => new Response('{}', { status: 403 })) as unknown as typeof fetch;
    await assert.rejects(createYouTubeClient('secret', fakeFetch)(['a']), (err: Error) => /403/.test(err.message) && !err.message.includes('secret'));
  });
});

describe('resolveVideoInfo', () => {
  it('fetches only what is missing or stale, and caches misses too', async () => {
    const store = new Store(':memory:');
    const calls: string[][] = [];
    const lookup: VideoLookup = async (ids) => {
      calls.push(ids);
      return new Map(ids.filter((id) => id !== 'gone').map((id) => [id, info(`title ${id}`)]));
    };

    const first = await resolveVideoInfo(store, lookup, ['a', 'gone'], log, 1000);
    assert.deepEqual([...first.keys()], ['a']);

    const second = await resolveVideoInfo(store, lookup, ['a', 'b', 'gone'], log, 2000);
    assert.deepEqual(calls, [['a', 'gone'], ['b']], 'cached hits and cached misses are not asked for again');
    assert.deepEqual([...second.keys()].sort(), ['a', 'b']);

    await resolveVideoInfo(store, lookup, ['a'], log, 1000 + VIDEO_INFO_TTL_MS);
    assert.deepEqual(calls[2], ['a'], 'refreshed after the TTL');
  });

  it('falls back to the stale copy when YouTube fails, and never throws', async () => {
    const store = new Store(':memory:');
    await resolveVideoInfo(store, async () => new Map([['a', info('old')]]), ['a'], log, 0);

    const warnings: object[] = [];
    const broken: VideoLookup = async () => {
      throw new Error('quota');
    };
    const result = await resolveVideoInfo(store, broken, ['a', 'b'], { warn: (o) => warnings.push(o) }, VIDEO_INFO_TTL_MS + 1);

    assert.equal(result.get('a')?.title, 'old');
    assert.equal(result.has('b'), false);
    assert.equal(warnings.length, 1);
  });
});
