import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
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

  // A userscript reports a video's status on the push that carries timestamps for it.
  const report = async (token: string, payload: Record<string, unknown>) => {
    const videoId = String(payload.videoId);
    const records = [{ guid: `g-${videoId}`, video_id: videoId, start: 1, comment: 'x', write_counter: 1 }];
    const res = await h.app.inject({ method: 'POST', url: '/sync/push', headers: bearer(token), payload: { deviceId: 'd', records, videos: [payload] } });
    return res.statusCode === 200 ? access(token, videoId) : res;
  };
  const access = (token: string, id: string) => h.app.inject({ method: 'GET', url: `/videos/${id}/access`, headers: bearer(token) });
  const sync = (token: string) => h.app.inject({ method: 'POST', url: '/subscriptions/sync', headers: bearer(token), payload: { accessToken: 'g-token' } });

  it('requires authentication', async () => {
    assert.equal((await h.app.inject({ method: 'GET', url: '/videos/abc/access' })).statusCode, 401);
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

  it('ignores a report for a video the push carries no timestamps for', async () => {
    const { accessToken } = await h.login('a8', 'a8@example.com');
    const records = [{ guid: 'g-real', video_id: 'real1', start: 1, comment: 'x', write_counter: 1 }];
    const videos = [
      { videoId: 'real1', channelId: 'UCreal', membersOnly: true },
      { videoId: 'other1', channelId: 'UCother', membersOnly: true },
    ];
    await h.app.inject({ method: 'POST', url: '/sync/push', headers: bearer(accessToken), payload: { deviceId: 'd', records, videos } });
    assert.equal(h.store.getVideoAccess('real1')?.membersOnly, true);
    assert.equal(h.store.getVideoAccess('other1'), null);
  });

  it('tells every user with timestamps on a video when its members-only status changes', async () => {
    const one = await h.login('n1', 'n1@example.com');
    const two = await h.login('n2', 'n2@example.com');
    const rec = [{ guid: 'g-n', video_id: 'nv1', start: 1, comment: 'x', write_counter: 1 }];
    const push = (token: string, videos: unknown[]) => h.app.inject({ method: 'POST', url: '/sync/push', headers: bearer(token), payload: { deviceId: 'd', records: rec, videos } });
    await push(two.accessToken, []);
    assert.deepEqual(h.store.userIdsWithVideos(['nv1']), [two.userId]);
    assert.deepEqual(h.store.userIdsWithVideos([]), []);
    await push(one.accessToken, [{ videoId: 'nv1', channelId: 'UCn', membersOnly: true }]);
    assert.deepEqual(h.store.userIdsWithVideos(['nv1']).sort(), [one.userId, two.userId].sort());
  });

  it('skips malformed reports without refusing the timestamps', async () => {
    const { accessToken } = await h.login('a7', 'a7@example.com');
    const push = async (video: Record<string, unknown>) => {
      const id = String(video.videoId);
      return h.app.inject({
        method: 'POST',
        url: '/sync/push',
        headers: bearer(accessToken),
        payload: { deviceId: 'd', records: [{ guid: `g-${id}`, video_id: id, start: 1, comment: 'x', write_counter: 1 }], videos: [video] },
      });
    };
    assert.equal((await push({ videoId: 'x y', channelId: 'UC1', membersOnly: true })).statusCode, 200);
    assert.equal((await push({ videoId: 'v7', channelId: 'UC1', membersOnly: 'yes' })).statusCode, 200);
    assert.equal(h.store.getVideoAccess('x y'), null);
    assert.equal(h.store.getVideoAccess('v7'), null);
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
