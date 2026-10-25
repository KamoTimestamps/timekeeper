import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { Store, type VideoInfo } from '../src/store.ts';
import { createVideoPrefetcher, createYouTubeClient, parseIsoDuration, resolveVideoInfo, VIDEO_INFO_TTL_MS, type VideoLookup } from '../src/youtube.ts';

const info = (title: string): VideoInfo => ({ title, channelTitle: 'Chan', thumbnailUrl: 'https://i.ytimg.com/vi/x/mqdefault.jpg', publishedAt: '2026-01-01T00:00:00Z', durationSeconds: 3600 });
const log = { warn: () => {} };

describe('YouTube client', () => {
  it('asks videos.list for the snippet, sends the key as a header, and maps the response', async () => {
    let seen: { url: URL; headers: Record<string, string> } | undefined;
    const fakeFetch = (async (url: URL, init: RequestInit) => {
      seen = { url, headers: init.headers as Record<string, string> };
      return Response.json({
        items: [
          { id: 'a', snippet: { title: 'Hello', channelTitle: 'Chan', publishedAt: '2026-01-01T00:00:00Z', thumbnails: { default: { url: 'd' }, medium: { url: 'm' } } }, contentDetails: { duration: 'PT4H10M11S' } },
          { id: 'b', snippet: { title: 'No thumbs' } },
          { id: 'live', snippet: { title: 'Live now', publishedAt: '2026-10-24T21:56:35Z' }, contentDetails: { duration: 'P0D' }, liveStreamingDetails: { actualStartTime: '2026-10-25T17:46:02Z' } },
        ],
      });
    }) as unknown as typeof fetch;

    const found = await createYouTubeClient('secret', fakeFetch)(['a', 'b', 'gone']);

    assert.equal(seen?.url.searchParams.get('id'), 'a,b,gone');
    assert.equal(seen?.url.searchParams.get('part'), 'snippet,contentDetails,liveStreamingDetails');
    assert.equal(seen?.headers['x-goog-api-key'], 'secret');
    assert.ok(!seen?.url.href.includes('secret'), 'key must not be in the URL');
    assert.deepEqual(found.get('a'), { title: 'Hello', channelTitle: 'Chan', thumbnailUrl: 'm', publishedAt: '2026-01-01T00:00:00Z', durationSeconds: 15011 });
    assert.deepEqual(found.get('b'), { title: 'No thumbs', channelTitle: '', thumbnailUrl: null, publishedAt: null, durationSeconds: null });
    assert.equal(found.get('live')?.durationSeconds, null, 'a live video has no length yet');
    assert.equal(found.get('live')?.publishedAt, '2026-10-25T17:46:02Z', 'a stream is dated by when it went live, not when it was created');
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

describe('parseIsoDuration', () => {
  it('reads hours, minutes, seconds and days, and treats zero or junk as unknown', () => {
    assert.equal(parseIsoDuration('PT4H10M11S'), 15011);
    assert.equal(parseIsoDuration('PT57M'), 3420);
    assert.equal(parseIsoDuration('PT45S'), 45);
    assert.equal(parseIsoDuration('P1DT2H'), 93600);
    assert.equal(parseIsoDuration('P0D'), null);
    assert.equal(parseIsoDuration('nonsense'), null);
    assert.equal(parseIsoDuration(undefined), null);
  });
});

describe('video length refresh', () => {
  it('marks details cached before lengths existed as stale, so they are fetched again', () => {
    const dir = mkdtempSync(join(tmpdir(), 'tk-migrate-'));
    const path = join(dir, 'legacy.db');
    try {
      const legacy = new DatabaseSync(path);
      legacy.exec(`CREATE TABLE video_info (video_id TEXT PRIMARY KEY, title TEXT, channel_title TEXT, thumbnail_url TEXT, published_at TEXT, fetched_at INTEGER NOT NULL) WITHOUT ROWID;
                   INSERT INTO video_info VALUES ('old', 'Old title', 'Chan', NULL, '2026-01-01T00:00:00Z', 5000);`);
      legacy.close();

      const store = new Store(path);
      const [entry] = store.getCachedVideoInfo(['old']);
      assert.equal(entry.fetchedAt, 0, 'forced stale');
      assert.equal(entry.info?.title, 'Old title');
      assert.equal(entry.info?.durationSeconds, null);
      store.close();

      const again = new Store(path); // a second start must not reset fresh rows
      again.saveVideoInfo([{ videoId: 'old', info: { ...info('Old title'), durationSeconds: 15011 } }], 9000);
      again.close();
      const third = new Store(path);
      assert.deepEqual([third.getCachedVideoInfo(['old'])[0].fetchedAt, third.getCachedVideoInfo(['old'])[0].info?.durationSeconds], [9000, 15011]);
      third.close();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('prefetches already-cached videos only when forced', async () => {
    const store = new Store(':memory:');
    const { user } = store.upsertGoogleUser({ sub: 's', email: 'e@example.com' });
    store.applyPush(user.id, 'd', [{ guid: 'g', video_id: 'v', start: 1, comment: '', write_counter: 1 }]);
    store.saveVideoInfo([{ videoId: 'v', info: info('cached') }], 0);
    assert.deepEqual(store.staleVideoIds(1000), ['v']);
    assert.deepEqual(store.staleVideoIds(0), []);

    const calls: string[][] = [];
    const prefetcher = createVideoPrefetcher(store, async (ids) => (calls.push(ids), new Map(ids.map((id) => [id, { ...info('fresh'), durationSeconds: 7200 }]))), log);
    prefetcher.enqueue(['v']);
    await prefetcher.idle();
    assert.equal(calls.length, 0, 'cached, so not fetched');
    prefetcher.enqueue(['v'], true);
    await prefetcher.idle();
    assert.deepEqual(calls, [['v']]);
    assert.equal(store.getCachedVideoInfo(['v'])[0].info?.durationSeconds, 7200);
  });
});

describe('prefetcher notification', () => {
  it('reports each saved batch so open pages can refresh', async () => {
    const store = new Store(':memory:');
    const saved: string[][] = [];
    const prefetcher = createVideoPrefetcher(store, async (ids) => new Map(ids.map((id) => [id, info(`t ${id}`)])), log, (ids) => saved.push(ids));
    prefetcher.enqueue(['a', 'b']);
    await prefetcher.idle();
    assert.deepEqual(saved, [['a', 'b']]);
  });
});
