import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { createVideoAccessCheck } from '../src/video-access.ts';
import { createSubscriptionsClient, SubscriptionsAuthError } from '../src/subscriptions.ts';
import { bearer, createHarness, type TestHarness } from './helpers.ts';

describe('members-only access', () => {
  let h: TestHarness;
  let subscribed: string[] = [];
  let failWith: Error | null = null;
  before(async () => {
    h = await createHarness({}, undefined, async () => {
      if (failWith) throw failWith;
      return subscribed;
    });
  });
  after(async () => {
    await h.app.close();
  });

  const report = (token: string, payload: Record<string, unknown>) => h.app.inject({ method: 'POST', url: '/videos/access', headers: bearer(token), payload });
  const access = (token: string, id: string) => h.app.inject({ method: 'GET', url: `/videos/${id}/access`, headers: bearer(token) });
  const sync = (token: string) => h.app.inject({ method: 'POST', url: '/subscriptions/sync', headers: bearer(token), payload: { accessToken: 'g-token' } });

  it('requires authentication', async () => {
    assert.equal((await h.app.inject({ method: 'GET', url: '/videos/abc/access' })).statusCode, 401);
    assert.equal((await h.app.inject({ method: 'POST', url: '/videos/access', payload: {} })).statusCode, 401);
    assert.equal((await h.app.inject({ method: 'POST', url: '/subscriptions/sync', payload: {} })).statusCode, 401);
  });

  it('leaves access unknown until a video is reported', async () => {
    const { accessToken } = await h.login('a1', 'a1@example.com');
    const res = (await access(accessToken, 'nope')).json();
    assert.deepEqual([res.known, res.membersOnly, res.canAccess], [false, null, null]);
  });

  it('opens a video that is not members-only to everyone', async () => {
    const { accessToken } = await h.login('a2', 'a2@example.com');
    const res = (await report(accessToken, { videoId: 'pub1', channelId: 'UCpub', membersOnly: false })).json();
    assert.deepEqual([res.known, res.membersOnly, res.canAccess], [true, false, true]);
  });

  it('cannot decide a members-only video until subscriptions are shared, then follows them', async () => {
    const { accessToken } = await h.login('a3', 'a3@example.com');
    const before = (await report(accessToken, { videoId: 'mem1', channelId: 'UCmem', membersOnly: true })).json();
    assert.deepEqual([before.subscribed, before.canAccess], [null, null]);

    subscribed = ['UCother'];
    const first = (await sync(accessToken)).json();
    assert.equal(first.count, 1);
    const denied = (await access(accessToken, 'mem1')).json();
    assert.deepEqual([denied.subscribed, denied.canAccess], [false, false]);

    subscribed = ['UCother', 'UCmem'];
    await sync(accessToken);
    const allowed = (await access(accessToken, 'mem1')).json();
    assert.deepEqual([allowed.subscribed, allowed.canAccess], [true, true]);

    subscribed = [];
    await sync(accessToken);
    assert.equal((await access(accessToken, 'mem1')).json().canAccess, false, 'unsubscribing is picked up by the next sync');
  });

  it('keeps subscriptions per user', async () => {
    const one = await h.login('a4', 'a4@example.com');
    const two = await h.login('a5', 'a5@example.com');
    subscribed = ['UCmem'];
    await sync(one.accessToken);
    await report(two.accessToken, { videoId: 'mem2', channelId: 'UCmem', membersOnly: true });
    assert.equal((await access(one.accessToken, 'mem2')).json().canAccess, true);
    assert.equal((await access(two.accessToken, 'mem2')).json().canAccess, null);
  });

  it('maps a refused Google token to 400 and an outage to 502', async () => {
    const { accessToken } = await h.login('a6', 'a6@example.com');
    failWith = new SubscriptionsAuthError('401');
    assert.equal((await sync(accessToken)).statusCode, 400);
    failWith = new Error('boom');
    assert.equal((await sync(accessToken)).statusCode, 502);
    failWith = null;
  });

  it('rejects malformed reports', async () => {
    const { accessToken } = await h.login('a7', 'a7@example.com');
    assert.equal((await report(accessToken, { videoId: 'x y', channelId: 'UC1', membersOnly: true })).statusCode, 400);
    assert.equal((await report(accessToken, { videoId: 'v', channelId: 'UC1', membersOnly: 'yes' })).statusCode, 400);
  });
});

describe('subscriptions client', () => {
  it('pages through subscriptions.list with the bearer token and de-duplicates', async () => {
    const urls: URL[] = [];
    const fakeFetch = (async (url: URL, init: RequestInit) => {
      urls.push(url);
      assert.equal((init.headers as Record<string, string>).authorization, 'Bearer tok');
      return Response.json(
        url.searchParams.get('pageToken')
          ? { items: [{ snippet: { resourceId: { channelId: 'UC2' } } }, { snippet: { resourceId: { channelId: 'UC1' } } }] }
          : { nextPageToken: 'p2', items: [{ snippet: { resourceId: { channelId: 'UC1' } } }, { snippet: {} }] },
      );
    }) as unknown as typeof fetch;

    assert.deepEqual(await createSubscriptionsClient(fakeFetch)('tok'), ['UC1', 'UC2']);
    assert.equal(urls[0].searchParams.get('mine'), 'true');
    assert.equal(urls.length, 2);
  });

  it('distinguishes a refused token from other failures', async () => {
    const status = (code: number) => createSubscriptionsClient((async () => new Response('{}', { status: code })) as unknown as typeof fetch)('t');
    await assert.rejects(status(401), SubscriptionsAuthError);
    await assert.rejects(status(403), SubscriptionsAuthError);
    await assert.rejects(status(500), (err: Error) => !(err instanceof SubscriptionsAuthError));
  });
});

describe('server-side members-only check', () => {
  const page = (player: unknown) => `<html><script>var ytInitialPlayerResponse = ${JSON.stringify(player)};var meta = {};</script></html>`;
  const watchFetch = (html: string, status = 200) => (async () => new Response(html, { status })) as unknown as typeof fetch;
  const membersOnlyReply = {
    playabilityStatus: { status: 'UNPLAYABLE', errorScreen: { playerLegacyDesktopYpcOfferRenderer: { offerId: 'sponsors_only_video' } } },
    videoDetails: { channelId: 'UCmem', title: 'has } and { and \\" in it' },
  };

  it('reads members-only, public, and unanswerable videos from the watch page', async () => {
    assert.deepEqual(await createVideoAccessCheck(watchFetch(page(membersOnlyReply)))('v'), { channelId: 'UCmem', membersOnly: true });
    assert.deepEqual(
      await createVideoAccessCheck(watchFetch(page({ playabilityStatus: { status: 'OK' }, videoDetails: { channelId: 'UCpub' } })))('v'),
      { channelId: 'UCpub', membersOnly: false },
    );
    assert.equal(await createVideoAccessCheck(watchFetch(page({ playabilityStatus: { status: 'ERROR', reason: 'This video is unavailable' } })))('v'), null);
    assert.equal(await createVideoAccessCheck(watchFetch(page({ playabilityStatus: { status: 'LOGIN_REQUIRED' }, videoDetails: { channelId: 'UC1' } })))('v'), null);
    assert.equal(await createVideoAccessCheck(watchFetch('<html>no player here</html>'))('v'), null);
    await assert.rejects(createVideoAccessCheck(watchFetch('', 429))('v'), /429/);
  });

  it('checks each newly pushed video once, and its answer outranks a userscript report', async () => {
    const asked: string[] = [];
    const h = await createHarness({}, undefined, undefined, async (videoId) => {
      asked.push(videoId);
      return videoId === 'gone' ? null : { channelId: 'UCsrv', membersOnly: videoId === 'secret' };
    });
    try {
      const { accessToken } = await h.login('c1', 'c1@example.com');
      const push = (records: unknown[]) => h.app.inject({ method: 'POST', url: '/sync/push', headers: bearer(accessToken), payload: { deviceId: 'd', records } });
      const rec = (guid: string, video_id: string) => ({ guid, video_id, start: 1, comment: 'x', write_counter: 1 });

      await push([rec('1', 'secret'), rec('2', 'open'), rec('3', 'gone')]);
      await push([rec('4', 'secret'), rec('5', 'gone')]);
      for (let i = 0; i < 20 && h.store.getVideoAccess('open') === null; i++) await new Promise((r) => setTimeout(r, 25));
      await new Promise((r) => setTimeout(r, 400));

      assert.deepEqual(asked.sort(), ['gone', 'open', 'secret'], 'every video is asked about once, including unanswerable ones');
      assert.deepEqual(h.store.getVideoAccess('secret'), { channelId: 'UCsrv', membersOnly: true });
      assert.equal(h.store.getVideoAccess('gone'), null);

      await h.app.inject({ method: 'POST', url: '/videos/access', headers: bearer(accessToken), payload: { videoId: 'secret', channelId: 'UCfake', membersOnly: false } });
      assert.deepEqual(h.store.getVideoAccess('secret'), { channelId: 'UCsrv', membersOnly: true }, 'a client report does not replace the server check');
      h.store.saveVideoAccess('open', 'UCsrv', true, Date.now(), 'server');
      assert.equal(h.store.getVideoAccess('open')?.membersOnly, true, 'a newer server check does replace an older one');
    } finally {
      await h.app.close();
    }
  });
});
