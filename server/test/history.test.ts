import assert from 'node:assert/strict';
import { after, afterEach, before, describe, it, mock } from 'node:test';
import { WebSocket } from 'ws';
import { bearer, createHarness, record, testConfig, type TestHarness } from './helpers.ts';
import type { TimestampRecord } from '../src/store.ts';

const ORIGIN = testConfig.publicOrigin;
const COOKIE = '__Host-tk_web';

describe('timestamp history', () => {
  let h: TestHarness;
  let wsUrl: string;
  before(async () => {
    h = await createHarness();
    await h.app.listen({ host: '127.0.0.1', port: 0 });
    const address = h.app.server.address();
    assert.ok(address && typeof address === 'object');
    wsUrl = `ws://127.0.0.1:${address.port}/sync/ws`;
  });
  afterEach(() => mock.timers.reset());
  after(async () => {
    await h.app.close();
  });

  const push = (token: string, deviceId: string, records: TimestampRecord[]) =>
    h.app.inject({ method: 'POST', url: '/sync/push', headers: bearer(token), payload: { deviceId, records } });

  async function signIn(sub: string) {
    const session = await h.login(sub, `${sub}@example.com`);
    const res = await h.app.inject({
      method: 'POST',
      url: '/web/login',
      headers: { origin: ORIGIN },
      payload: { idToken: await h.idToken({ sub, email: `${sub}@example.com` }) },
    });
    const cookie = res.cookies.find((c) => c.name === COOKIE);
    assert.ok(cookie);
    return { ...session, web: { cookie: `${COOKIE}=${cookie.value}` } };
  }

  const history = async (web: { cookie: string }, guid: string) =>
    (await h.app.inject({ method: 'GET', url: `/web/timestamps/${guid}/history`, headers: web })).json().versions as Array<{
      seq: number;
      comment: string;
      deletedAt: number | null;
      current: boolean;
    }>;
  const revert = (web: { cookie: string }, guid: string, seq: number, headers: Record<string, string> = { origin: ORIGIN }) =>
    h.app.inject({ method: 'POST', url: `/web/timestamps/${guid}/revert`, headers: { ...web, ...headers }, payload: { seq } });

  it('records each accepted version, newest first, and ignores replays and losing writes', async () => {
    const { accessToken, web } = await signIn('h1');
    await push(accessToken, 'dev-a', [record('g', 1, { comment: 'one' })]);
    await push(accessToken, 'dev-b', [record('g', 2, { comment: 'two' })]);
    await push(accessToken, 'dev-b', [record('g', 2, { comment: 'two' })]); // replay
    await push(accessToken, 'dev-a', [record('g', 1, { comment: 'stale' })]); // loses

    const versions = await history(web, 'g');
    assert.deepEqual(versions.map((v) => [v.comment, v.current]), [['two', true], ['one', false]]);
  });

  it('keeps the version a timestamp had before history existed', async () => {
    const { accessToken, userId, web } = await signIn('h2');
    // A row written the way an older server did: in `timestamps`, with no history.
    h.store.db
      .prepare(
        `INSERT INTO timestamps (user_id, guid, video_id, start, comment, write_counter, deleted_at, device_id, seq, updated_at)
         VALUES (?, 'old', 'vid1', 1, 'before deploy', 1, NULL, 'dev-a', 1, 1000)`,
      )
      .run(userId);
    h.store.db.prepare('UPDATE users SET seq = 1 WHERE id = ?').run(userId);

    await push(accessToken, 'dev-a', [record('old', 2, { comment: 'after deploy' })]);
    assert.deepEqual((await history(web, 'old')).map((v) => v.comment), ['after deploy', 'before deploy']);
  });

  it('coalesces quick edits from one device, but never the first version or another device', async () => {
    mock.timers.enable({ apis: ['Date'], now: 1_000_000 });
    const { accessToken, web } = await signIn('h3');

    await push(accessToken, 'dev-a', [record('c', 1, { comment: 'v1' })]);
    await push(accessToken, 'dev-a', [record('c', 2, { comment: 'v2' })]); // kept: only the first version precedes it
    await push(accessToken, 'dev-a', [record('c', 3, { comment: 'v3' })]); // replaces v2
    await push(accessToken, 'dev-b', [record('c', 4, { comment: 'v4' })]); // other device: appended
    assert.deepEqual((await history(web, 'c')).map((v) => v.comment), ['v4', 'v3', 'v1']);

    mock.timers.tick(6 * 60 * 1000);
    await push(accessToken, 'dev-b', [record('c', 5, { comment: 'v5' })]); // same device, but over 5 minutes later
    assert.deepEqual((await history(web, 'c')).map((v) => v.comment), ['v5', 'v4', 'v3', 'v1']);
  });

  it('keeps only the newest 50 versions', async () => {
    const { accessToken, web } = await signIn('h4');
    for (let i = 1; i <= 60; i++) await push(accessToken, `dev-${i}`, [record('p', i, { comment: `v${i}` })]);
    const versions = await history(web, 'p');
    assert.equal(versions.length, 50);
    assert.deepEqual([versions[0].comment, versions[49].comment], ['v60', 'v11']);
  });

  it('reverts by writing the old content as a newer version that other devices receive', async () => {
    const { accessToken, web } = await signIn('h5');
    await push(accessToken, 'dev-a', [record('r', 1, { comment: 'original' })]);
    await push(accessToken, 'dev-a', [record('r', 2, { comment: 'oops' })]);
    const [, original] = await history(web, 'r');

    const ws = new WebSocket(wsUrl);
    await new Promise<void>((resolve) => ws.once('open', () => resolve()));
    const ready = new Promise<any>((resolve) => ws.once('message', (d) => resolve(JSON.parse(d.toString()))));
    ws.send(JSON.stringify({ type: 'auth', token: accessToken, deviceId: 'dev-a' }));
    assert.equal((await ready).type, 'ready');
    const change = new Promise<any>((resolve) => ws.once('message', (d) => resolve(JSON.parse(d.toString()))));

    const res = await revert(web, 'r', original.seq);
    assert.deepEqual(res.json(), { changed: true });

    // The device that last wrote it still hears about the revert: it did not make it.
    const msg = await change;
    ws.close();
    assert.equal(msg.type, 'changes');
    assert.equal(msg.records[0].comment, 'original');
    assert.equal(msg.records[0].write_counter, 3);

    const pulled = (await h.app.inject({ method: 'GET', url: '/sync/pull?since=0', headers: bearer(accessToken) })).json();
    assert.deepEqual(pulled.records.map((r: any) => [r.guid, r.comment, r.write_counter]), [['r', 'original', 3]]);
    // And the revert is itself a version, so it can be undone.
    assert.deepEqual((await history(web, 'r')).map((v) => [v.comment, v.current]), [['original', true], ['oops', false], ['original', false]]);
  });

  it('does nothing when the timestamp already has that content', async () => {
    const { accessToken, web } = await signIn('h6');
    await push(accessToken, 'dev-a', [record('n', 1, { comment: 'same' })]);
    const [only] = await history(web, 'n');
    assert.deepEqual((await revert(web, 'n', only.seq)).json(), { changed: false });
    assert.equal((await history(web, 'n')).length, 1);
  });

  it('restores a timestamp that was deleted by reverting to the version before the delete', async () => {
    const { accessToken, web } = await signIn('h7');
    await push(accessToken, 'dev-a', [record('d', 1, { comment: 'keep me' })]);
    await push(accessToken, 'dev-b', [record('d', 2, { comment: 'keep me', deleted_at: 5000 })]);
    const versions = await history(web, 'd');
    assert.equal(versions[0].deletedAt, 5000);

    assert.deepEqual((await revert(web, 'd', versions[1].seq)).json(), { changed: true });
    const pulled = (await h.app.inject({ method: 'GET', url: '/sync/pull?since=0', headers: bearer(accessToken) })).json();
    assert.equal(pulled.records[0].deleted_at, undefined);
    assert.equal(pulled.records[0].write_counter, 3);
  });

  it('keeps one user from another\'s history, and needs a session and the right origin', async () => {
    const owner = await signIn('h8');
    const other = await signIn('h9');
    await push(owner.accessToken, 'dev-a', [record('mine', 1, { comment: 'secret' })]);
    const [version] = await history(owner.web, 'mine');

    assert.deepEqual(await history(other.web, 'mine'), []);
    assert.equal((await revert(other.web, 'mine', version.seq)).statusCode, 404);
    assert.equal((await h.app.inject({ method: 'GET', url: '/web/timestamps/mine/history' })).statusCode, 401);
    assert.equal((await revert(owner.web, 'mine', version.seq, { origin: 'https://evil.test' })).statusCode, 403);
    assert.equal((await revert(owner.web, 'mine', 0)).statusCode, 400);
    assert.equal((await revert(owner.web, 'mine', 999)).statusCode, 404);
  });

  it('deletes a user\'s history with the user', async () => {
    const { accessToken, userId } = await signIn('h10');
    await push(accessToken, 'dev-a', [record('gone', 1)]);
    const count = () => (h.store.db.prepare('SELECT COUNT(*) AS n FROM timestamp_history WHERE user_id = ?').get(userId) as { n: number }).n;
    assert.equal(count(), 1);
    h.store.db.prepare('DELETE FROM users WHERE id = ?').run(userId);
    assert.equal(count(), 0);
  });
});
