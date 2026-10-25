import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Store, type VideoInfo } from '../src/store.ts';
import { createVideoPrefetcher, createYouTubeClient, resolveVideoInfo, VIDEO_INFO_TTL_MS, type VideoLookup } from '../src/youtube.ts';

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

describe('video prefetcher', () => {
  const lookupOf = (calls: string[][]): VideoLookup => async (ids) => {
    calls.push(ids);
    return new Map(ids.filter((id) => id !== 'gone').map((id) => [id, info(`title ${id}`)]));
  };

  it('looks up only never-seen videos, in batches of 50, without blocking the caller', async () => {
    const store = new Store(':memory:');
    store.saveVideoInfo([{ videoId: 'known', info: null }], 1);
    const calls: string[][] = [];
    const prefetcher = createVideoPrefetcher(store, lookupOf(calls), log);

    const ids = Array.from({ length: 120 }, (_, i) => `v${i}`);
    prefetcher.enqueue(['known', ...ids]);
    assert.equal(store.getCachedVideoInfo(ids).length, 0, 'enqueue returns before any lookup finishes');
    await prefetcher.idle();

    assert.deepEqual(calls.map((c) => c.length), [50, 50, 20]);
    assert.ok(!calls.flat().includes('known'));
    assert.equal(store.getCachedVideoInfo(ids).length, 120);

    prefetcher.enqueue(ids);
    await prefetcher.idle();
    assert.equal(calls.length, 3, 'cached videos are not asked for again');
  });

  it('picks up videos enqueued while a lookup is in flight', async () => {
    const store = new Store(':memory:');
    const calls: string[][] = [];
    const prefetcher = createVideoPrefetcher(store, lookupOf(calls), log);
    prefetcher.enqueue(['a']);
    prefetcher.enqueue(['b']);
    await prefetcher.idle();
    assert.deepEqual(calls.flat().sort(), ['a', 'b']);
    assert.equal(store.getCachedVideoInfo(['a', 'b']).length, 2);
  });

  it('drops the queue on failure and tries again on the next sighting', async () => {
    const store = new Store(':memory:');
    let failing = true;
    const warnings: object[] = [];
    const lookup: VideoLookup = async (ids) => {
      if (failing) throw new Error('quota');
      return new Map(ids.map((id) => [id, info(id)]));
    };
    const prefetcher = createVideoPrefetcher(store, lookup, { warn: (o) => warnings.push(o) });

    prefetcher.enqueue(['a', 'b']);
    await prefetcher.idle();
    assert.equal(warnings.length, 1);
    assert.equal(store.getCachedVideoInfo(['a', 'b']).length, 0);

    failing = false;
    prefetcher.enqueue(['a']);
    await prefetcher.idle();
    assert.equal(store.getCachedVideoInfo(['a']).length, 1);
  });

  it('finds synced videos that were never cached', () => {
    const store = new Store(':memory:');
    const { user } = store.upsertGoogleUser({ sub: 's', email: 'e@example.com' });
    store.applyPush(user.id, 'd', [
      { guid: 'g1', video_id: 'old', start: 1, comment: '', write_counter: 1 },
      { guid: 'g2', video_id: 'cached', start: 1, comment: '', write_counter: 2 },
      { guid: 'g3', video_id: 'dead', start: 1, comment: '', write_counter: 3, deleted_at: 5 },
    ]);
    store.saveVideoInfo([{ videoId: 'cached', info: null }], 1);
    assert.deepEqual(store.uncachedVideoIds(), ['old']);
  });
});
