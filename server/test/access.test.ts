import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { bearer, createHarness, type TestHarness } from './helpers.ts';

describe('members-only access', () => {
  let h: TestHarness;
  before(async () => {
    h = await createHarness();
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

  it('requires authentication', async () => {
    assert.equal((await h.app.inject({ method: 'GET', url: '/videos/abc/access' })).statusCode, 401);
  });

  it('leaves access unknown until a video is reported', async () => {
    const { accessToken } = await h.login('a1', 'a1@example.com');
    const res = (await access(accessToken, 'nope')).json();
    assert.deepEqual([res.known, res.membersOnly], [false, null]);
  });

  it('reports what a userscript saw, members-only or not', async () => {
    const { accessToken } = await h.login('a2', 'a2@example.com');
    const open = (await report(accessToken, { videoId: 'pub1', channelId: 'UCpub', membersOnly: false })).json();
    assert.deepEqual([open.known, open.membersOnly, open.channelId], [true, false, 'UCpub']);
    const members = (await report(accessToken, { videoId: 'mem1', channelId: 'UCmem', membersOnly: true })).json();
    assert.deepEqual([members.known, members.membersOnly, members.channelId], [true, true, 'UCmem']);
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
