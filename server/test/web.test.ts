import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { WebSocket } from 'ws';
import { bearer, createHarness, record, testConfig, type TestHarness } from './helpers.ts';

const ORIGIN = testConfig.publicOrigin;
const COOKIE = '__Host-tk_web'; // https public origin => __Host- prefix

describe('landing page', () => {
  let h: TestHarness;
  before(async () => {
    h = await createHarness();
  });
  after(async () => {
    await h.app.close();
  });

  const webLogin = async (sub: string, email: string, headers: Record<string, string> = { origin: ORIGIN }) => {
    const res = await h.app.inject({
      method: 'POST',
      url: '/web/login',
      headers,
      payload: { idToken: await h.idToken({ sub, email }) },
    });
    const cookie = res.cookies.find((c) => c.name === COOKIE);
    return { res, cookieHeader: cookie ? { cookie: `${COOKIE}=${cookie.value}` } : {}, cookie };
  };

  const push = (token: string, deviceId: string, records: unknown[]) =>
    h.app.inject({ method: 'POST', url: '/sync/push', headers: bearer(token), payload: { deviceId, records } });

  it('serves the page and its assets with a strict CSP', async () => {
    const page = await h.app.inject({ method: 'GET', url: '/' });
    assert.equal(page.statusCode, 200);
    assert.match(page.headers['content-type'] as string, /text\/html/);
    assert.match(page.headers['content-security-policy'] as string, /default-src 'none'/);
    assert.match(page.body, /Timekeeper/);
    for (const asset of ['/assets/app.js', '/assets/style.css']) {
      assert.equal((await h.app.inject({ method: 'GET', url: asset })).statusCode, 200, asset);
    }
    const config = (await h.app.inject({ method: 'GET', url: '/web/config' })).json();
    assert.equal(config.googleClientId, testConfig.googleClientId);
  });

  it('signs in with an HttpOnly, Secure, SameSite=Strict cookie and rejects bad tokens', async () => {
    const { res, cookie } = await webLogin('w1', 'w1@example.com');
    assert.equal(res.statusCode, 200);
    assert.equal(res.json().user.email, 'w1@example.com');
    assert.ok(cookie);
    assert.equal(cookie.httpOnly, true);
    assert.equal(cookie.secure, true);
    assert.equal(String(cookie.sameSite).toLowerCase(), 'strict');
    assert.equal(cookie.path, '/');

    const bad = await h.app.inject({ method: 'POST', url: '/web/login', headers: { origin: ORIGIN }, payload: { idToken: 'nope' } });
    assert.equal(bad.statusCode, 401);
  });

  it('only accepts state-changing requests from its own origin', async () => {
    const foreign: Array<Record<string, string>> = [{}, { origin: 'https://evil.example' }, { origin: 'https://www.youtube.com' }];
    for (const headers of foreign) {
      const login = await webLogin('w2', 'w2@example.com', headers);
      assert.equal(login.res.statusCode, 403, JSON.stringify(headers));
    }
    const { cookieHeader } = await webLogin('w2', 'w2@example.com');
    for (const url of ['/web/logout', '/web/logout-all']) {
      const res = await h.app.inject({ method: 'POST', url, headers: { ...cookieHeader, origin: 'https://evil.example' } });
      assert.equal(res.statusCode, 403, url);
    }
    // ...and a rejected request must not have ended the session.
    assert.equal((await h.app.inject({ method: 'GET', url: '/web/overview', headers: cookieHeader })).statusCode, 200);
  });

  it('requires a session for the overview', async () => {
    assert.equal((await h.app.inject({ method: 'GET', url: '/web/overview' })).statusCode, 401);
    const forged = await h.app.inject({ method: 'GET', url: '/web/overview', headers: { cookie: `${COOKIE}=forged` } });
    assert.equal(forged.statusCode, 401);
  });

  it('reports timestamp stats and top videos', async () => {
    const script = await h.login('w3', 'w3@example.com');
    await push(script.accessToken, 'dev-a', [
      record('a', 1, { video_id: 'vidA' }),
      record('b', 2, { video_id: 'vidA' }),
      record('c', 3, { video_id: 'vidB' }),
      record('d', 4, { video_id: 'vidB', deleted_at: 1700000000000 }),
    ]);
    await push(script.accessToken, 'dev-b', [record('e', 5, { video_id: 'vidC' })]);

    const { cookieHeader } = await webLogin('w3', 'w3@example.com');
    const overview = (await h.app.inject({ method: 'GET', url: '/web/overview', headers: cookieHeader })).json();

    const { stats } = overview;
    assert.deepEqual([stats.active, stats.deleted, stats.videos, stats.devices], [4, 1, 3, 2]);
    assert.deepEqual(stats.topVideos[0], { videoId: 'vidA', count: 2 });
    assert.ok(Math.abs(stats.lastSyncAt - Date.now()) < 60_000, 'last sync is recent');
    assert.equal(overview.account.email, 'w3@example.com');
  });

  it('lists userscript and web sessions and marks the current one', async () => {
    await h.login('w4', 'w4@example.com');
    const { cookieHeader } = await webLogin('w4', 'w4@example.com');
    const { sessions } = (await h.app.inject({ method: 'GET', url: '/web/overview', headers: cookieHeader })).json();

    assert.deepEqual(sessions.map((s: { kind: string }) => s.kind).sort(), ['userscript', 'web']);
    const current = sessions.filter((s: { current: boolean }) => s.current);
    assert.equal(current.length, 1);
    assert.equal(current[0].kind, 'web');
    assert.ok(sessions.every((s: { createdAt: number; lastUsedAt: number }) => s.createdAt > 0 && s.lastUsedAt >= s.createdAt));
  });

  it('signing out of the page leaves other sessions alone', async () => {
    const script = await h.login('w5', 'w5@example.com');
    const { cookieHeader } = await webLogin('w5', 'w5@example.com');

    const out = await h.app.inject({ method: 'POST', url: '/web/logout', headers: { ...cookieHeader, origin: ORIGIN } });
    assert.equal(out.statusCode, 204);
    assert.equal((await h.app.inject({ method: 'GET', url: '/web/overview', headers: cookieHeader })).statusCode, 401);
    assert.equal((await h.app.inject({ method: 'GET', url: '/sync/pull', headers: bearer(script.accessToken) })).statusCode, 200);
  });

  it('log out all sessions ends every session at once, including live access tokens', async () => {
    const mine = await h.login('w6', 'w6@example.com');
    const other = await h.login('w6', 'w6@example.com'); // a second device
    const bystander = await h.login('w6-other', 'other6@example.com');
    const { cookieHeader } = await webLogin('w6', 'w6@example.com');

    const res = await h.app.inject({ method: 'POST', url: '/web/logout-all', headers: { ...cookieHeader, origin: ORIGIN } });
    assert.equal(res.statusCode, 200);
    assert.equal(res.json().revoked, 3);

    for (const session of [mine, other]) {
      const pull = await h.app.inject({ method: 'GET', url: '/sync/pull', headers: bearer(session.accessToken) });
      assert.equal(pull.statusCode, 401, 'access tokens die with their session, not after 15 minutes');
      const refresh = await h.app.inject({ method: 'POST', url: '/auth/refresh', payload: { refreshToken: session.refreshToken } });
      assert.equal(refresh.statusCode, 401);
    }
    assert.equal((await h.app.inject({ method: 'GET', url: '/web/overview', headers: cookieHeader })).statusCode, 401);

    // Another user is untouched.
    assert.equal((await h.app.inject({ method: 'GET', url: '/sync/pull', headers: bearer(bystander.accessToken) })).statusCode, 200);
  });
});

describe('log out all sessions closes live connections', () => {
  let h: TestHarness;
  let url: string;
  before(async () => {
    h = await createHarness();
    await h.app.listen({ host: '127.0.0.1', port: 0 });
    const address = h.app.server.address();
    assert.ok(address && typeof address === 'object');
    url = `ws://127.0.0.1:${address.port}/sync/ws`;
  });
  after(async () => {
    await h.app.close();
  });

  it('closes the WebSocket of every device with code 4401', async () => {
    const session = await h.login('ws-out', 'wsout@example.com');
    const ws = new WebSocket(url);
    await new Promise<void>((resolve) => ws.once('open', () => resolve()));
    const ready = new Promise<void>((resolve) => ws.once('message', () => resolve()));
    ws.send(JSON.stringify({ type: 'auth', token: session.accessToken, deviceId: 'd1' }));
    await ready;

    const closed = new Promise<number>((resolve) => ws.once('close', (code) => resolve(code)));
    const login = await h.app.inject({
      method: 'POST',
      url: '/web/login',
      headers: { origin: ORIGIN },
      payload: { idToken: await h.idToken({ sub: 'ws-out', email: 'wsout@example.com' }) },
    });
    const cookie = login.cookies.find((c) => c.name === COOKIE);
    assert.ok(cookie);
    await h.app.inject({
      method: 'POST',
      url: '/web/logout-all',
      headers: { cookie: `${COOKIE}=${cookie.value}`, origin: ORIGIN },
    });
    assert.equal(await closed, 4401);
  });
});
