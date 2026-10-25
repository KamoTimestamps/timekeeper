import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { WebSocket } from 'ws';
import { bearer, createHarness, record, testConfig, type TestHarness } from './helpers.ts';
import type { TimestampPageKey } from '../src/store.ts';

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
    for (const asset of ['/assets/app.js', '/assets/theme.js', '/assets/style.css', '/assets/favicon.png', '/assets/TwemojiCountryFlags.woff2']) {
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

describe('timestamp browser', () => {
  let h: TestHarness;
  let cookieHeader: Record<string, string>;
  let other: Record<string, string>;
  before(async () => {
    h = await createHarness();
    const webCookie = async (sub: string, email: string) => {
      const res = await h.app.inject({ method: 'POST', url: '/web/login', headers: { origin: ORIGIN }, payload: { idToken: await h.idToken({ sub, email }) } });
      return { cookie: `${COOKIE}=${res.cookies.find((c) => c.name === COOKIE)!.value}` };
    };
    const mine = await h.login('t1', 't1@example.com');
    const theirs = await h.login('t2', 't2@example.com');
    const push = (token: string, records: unknown[]) =>
      h.app.inject({ method: 'POST', url: '/sync/push', headers: bearer(token), payload: { deviceId: 'd', records } });
    await push(mine.accessToken, [
      record('a', 1, { video_id: 'vidA', start: 90, comment: 'Boss fight begins' }),
      record('b', 2, { video_id: 'vidA', start: 30, comment: '100% funny_moment' }),
      record('c', 3, { video_id: 'vidB', start: 5, comment: 'boss intro' }),
      record('d', 4, { video_id: 'vidB', start: 6, comment: 'boss deleted', deleted_at: 1700000000000 }),
    ]);
    await push(theirs.accessToken, [record('x', 1, { video_id: 'vidA', comment: 'boss of someone else' })]);
    cookieHeader = await webCookie('t1', 't1@example.com');
    other = await webCookie('t2', 't2@example.com');
  });
  after(async () => {
    await h.app.close();
  });

  const get = (url: string, headers = cookieHeader) => h.app.inject({ method: 'GET', url, headers });

  it('requires a session', async () => {
    assert.equal((await h.app.inject({ method: 'GET', url: '/web/timestamps' })).statusCode, 401);
  });

  it('lists only the user\'s live timestamps, grouped by video with hits in playback order', async () => {
    const body = (await get('/web/timestamps')).json();
    assert.equal(body.total, 3);
    const rows = body.items as Array<{ guid: string; videoId: string; start: number }>;
    assert.deepEqual(rows.filter((r) => r.videoId === 'vidA').map((r) => r.start), [30, 90]);
    const finished = new Set<string>();
    rows.forEach((r, i) => {
      assert.ok(!finished.has(r.videoId), `${r.videoId} reappears after another video`);
      if (rows[i + 1]?.videoId !== r.videoId) finished.add(r.videoId);
    });
    assert.equal(finished.size, 2);
    assert.equal((await get('/web/timestamps', other)).json().total, 1);
  });

  it('orders videos by air date, newest first and undated last, then hits by time', async () => {
    const script = await h.login('t3', 't3@example.com');
    const send = (records: unknown[]) =>
      h.app.inject({ method: 'POST', url: '/sync/push', headers: bearer(script.accessToken), payload: { deviceId: 'd', records } });
    // Pushed oldest-airing first, so neither push order nor change time matches the expected order.
    await send([
      record('o1', 1, { video_id: 'older', start: 50 }),
      record('u1', 2, { video_id: 'undated', start: 5 }),
      record('n1', 3, { video_id: 'newer', start: 80 }),
      record('n2', 4, { video_id: 'newer', start: 10 }),
    ]);
    const details = (publishedAt: string | null) => ({ title: 't', channelTitle: 'c', thumbnailUrl: null, publishedAt, durationSeconds: null });
    h.store.saveVideoInfo(
      [
        { videoId: 'older', info: details('2024-01-01T00:00:00Z') },
        { videoId: 'newer', info: details('2026-06-01T00:00:00Z') },
        { videoId: 'undated', info: null },
      ],
      Date.now(),
    );
    const login = await h.app.inject({ method: 'POST', url: '/web/login', headers: { origin: ORIGIN }, payload: { idToken: await h.idToken({ sub: 't3', email: 't3@example.com' }) } });
    const cookie = { cookie: `${COOKIE}=${login.cookies.find((c) => c.name === COOKIE)!.value}` };
    const items = (await get('/web/timestamps', cookie)).json().items as Array<{ guid: string }>;
    assert.deepEqual(items.map((i) => i.guid), ['n2', 'n1', 'o1', 'u1']);

    // Walk it one row at a time with the cursor, across dated and undated videos. A row that
    // lands before the current position mid-walk must not repeat or skip anything.
    const walked: string[] = [];
    let resume: TimestampPageKey | undefined;
    for (let step = 0; step < 10; step++) {
      const page = h.store.searchTimestamps(script.userId, { query: '', after: resume, limit: 1 });
      walked.push(...page.items.map((i) => i.guid));
      if (step === 1) await send([record('n0', 5, { video_id: 'newer', start: 1 })]); // sorts before n2, already passed
      if (!page.next) break;
      resume = page.next;
    }
    assert.deepEqual(walked, ['n2', 'n1', 'o1', 'u1']);
    assert.equal(h.store.searchTimestamps(script.userId, { query: '', limit: 10 }).items[0].guid, 'n0');
  });

  it('searches case-insensitively, requires every word, and treats % and _ literally', async () => {
    const guids = async (q: string) => (await get(`/web/timestamps?q=${encodeURIComponent(q)}`)).json().items.map((i: { guid: string }) => i.guid).sort();
    assert.deepEqual(await guids('BOSS'), ['a', 'c']);
    assert.deepEqual(await guids('boss intro'), ['c']);
    assert.deepEqual(await guids('100%'), ['b']);
    assert.deepEqual(await guids('%'), ['b']);
    assert.deepEqual(await guids('funny_moment'), ['b']);
    assert.deepEqual(await guids('funny?moment'), []);
    assert.deepEqual(await guids('vidB'), ['c']);
  });

  it('filters to one video in playback order', async () => {
    const one = (await get('/web/timestamps?video=vidA')).json();
    assert.deepEqual(one.items.map((i: { start: number }) => i.start), [30, 90]);
    assert.equal(one.nextCursor, null, 'a single page has no next cursor');
    assert.equal((await get('/web/timestamps?cursor=not-a-cursor')).statusCode, 400);
    assert.equal((await get(`/web/timestamps?cursor=${Buffer.from('[1,2]').toString('base64url')}`)).statusCode, 400);
  });
});

describe('landing page video details', () => {
  const lookups: string[][] = [];
  let h: TestHarness;
  before(async () => {
    h = await createHarness({}, async (ids) => {
      lookups.push(ids);
      return new Map(ids.filter((id) => id === 'vidA').map((id) => [id, { title: 'A title', channelTitle: 'A channel', thumbnailUrl: 'https://i.ytimg.com/vi/vidA/mqdefault.jpg', publishedAt: null, durationSeconds: 15011 }]));
    });
  });
  after(async () => {
    await h.app.close();
  });

  it('adds title, channel and thumbnail to top videos YouTube knows, and allows its image host', async () => {
    const script = await h.login('v1', 'v1@example.com');
    await h.app.inject({
      method: 'POST',
      url: '/sync/push',
      headers: bearer(script.accessToken),
      payload: { deviceId: 'd', records: [record('a', 1, { video_id: 'vidA' }), record('b', 2, { video_id: 'vidB' })] },
    });
    const login = await h.app.inject({ method: 'POST', url: '/web/login', headers: { origin: ORIGIN }, payload: { idToken: await h.idToken({ sub: 'v1', email: 'v1@example.com' }) } });
    const cookie = login.cookies.find((c) => c.name === COOKIE)!;

    const overview = await h.app.inject({ method: 'GET', url: '/web/overview', headers: { cookie: `${COOKIE}=${cookie.value}` } });
    const top = overview.json().stats.topVideos;
    assert.equal(top.find((v: { videoId: string }) => v.videoId === 'vidA').info.title, 'A title');
    assert.equal(top.find((v: { videoId: string }) => v.videoId === 'vidB').info, undefined, 'unknown videos stay plain');
    assert.deepEqual(lookups[0].sort(), ['vidA', 'vidB']);

    const headers = { cookie: `${COOKIE}=${cookie.value}` };
    const byChannel = await h.app.inject({ method: 'GET', url: `/web/timestamps?channel=${encodeURIComponent('A channel')}`, headers });
    assert.deepEqual(byChannel.json().items.map((i: { videoId: string }) => i.videoId), ['vidA']);
    assert.equal(byChannel.json().items[0].info.durationSeconds, 15011, 'the video length reaches the page');
    const noMatch = await h.app.inject({ method: 'GET', url: '/web/timestamps?channel=Nobody', headers });
    assert.equal(noMatch.json().total, 0);

    const page = await h.app.inject({ method: 'GET', url: '/' });
    assert.match(page.headers['content-security-policy'] as string, /img-src [^;]*https:\/\/i\.ytimg\.com/);
    assert.match(page.headers['content-security-policy'] as string, /frame-src [^;]*https:\/\/www\.youtube-nocookie\.com/, 'the mini player embed');
  });
});

describe('overview event stream', () => {
  let h: TestHarness;
  let base: string;
  before(async () => {
    h = await createHarness();
    base = await h.app.listen({ host: '127.0.0.1', port: 0 });
  });
  after(async () => {
    await h.app.close();
  });

  const cookieFor = async (sub: string, email: string) => {
    const res = await h.app.inject({ method: 'POST', url: '/web/login', headers: { origin: ORIGIN }, payload: { idToken: await h.idToken({ sub, email }) } });
    return `${COOKIE}=${res.cookies.find((c) => c.name === COOKIE)!.value}`;
  };

  /** Reads the stream until `text` shows up, or fails after `ms`. */
  const readUntil = async (reader: ReadableStreamDefaultReader<Uint8Array>, text: string, ms = 3000) => {
    const decoder = new TextDecoder();
    let seen = '';
    const deadline = Date.now() + ms;
    while (!seen.includes(text)) {
      const left = deadline - Date.now();
      if (left <= 0) assert.fail(`no "${text}" in stream; got ${JSON.stringify(seen)}`);
      const chunk = await Promise.race([reader.read(), new Promise<null>((r) => setTimeout(() => r(null), left))]);
      if (chunk === null) continue;
      if (chunk.done) assert.fail(`stream ended before "${text}"; got ${JSON.stringify(seen)}`);
      seen += decoder.decode(chunk.value);
    }
  };

  it('rejects a request without a session', async () => {
    assert.equal((await fetch(`${base}/web/events`)).status, 401);
  });

  it('signals when a device pushes, and ends when the page signs out', async () => {
    const cookie = await cookieFor('ev1', 'ev1@example.com');
    const res = await fetch(`${base}/web/events`, { headers: { cookie } });
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type')!, /text\/event-stream/);
    const reader = res.body!.getReader();
    await readUntil(reader, 'retry: 3000');

    const script = await h.login('ev1', 'ev1@example.com');
    await h.app.inject({ method: 'POST', url: '/sync/push', headers: bearer(script.accessToken), payload: { deviceId: 'd', records: [record('a', 1)] } });
    await readUntil(reader, 'event: overview');

    await h.app.inject({ method: 'POST', url: '/web/logout', headers: { origin: ORIGIN, cookie } });
    assert.equal((await reader.read()).done, true);
  });

  it('only signals the account that changed', async () => {
    const cookie = await cookieFor('ev2', 'ev2@example.com');
    const reader = (await fetch(`${base}/web/events`, { headers: { cookie } })).body!.getReader();
    await readUntil(reader, 'retry: 3000');

    const other = await h.login('ev3', 'ev3@example.com');
    await h.app.inject({ method: 'POST', url: '/sync/push', headers: bearer(other.accessToken), payload: { deviceId: 'd', records: [record('b', 1)] } });
    await assert.rejects(readUntil(reader, 'event: overview', 1000), /no "event: overview"/);
    await reader.cancel();
  });
});

describe('shutdown with an open event stream', () => {
  it('closes promptly instead of waiting for the page to leave', async () => {
    const h = await createHarness();
    const base = await h.app.listen({ host: '127.0.0.1', port: 0 });
    const login = await h.app.inject({ method: 'POST', url: '/web/login', headers: { origin: ORIGIN }, payload: { idToken: await h.idToken({ sub: 'sd', email: 'sd@example.com' }) } });
    const cookie = `${COOKIE}=${login.cookies.find((c) => c.name === COOKIE)!.value}`;
    const reader = (await fetch(`${base}/web/events`, { headers: { cookie } })).body!.getReader();
    await reader.read();

    const closed = await Promise.race([h.app.close().then(() => true), new Promise<boolean>((r) => setTimeout(() => r(false), 3000))]);
    assert.ok(closed, 'app.close() hung on an open /web/events stream');
  });
});

describe('mini player feature flag', () => {
  const csp = async (h: TestHarness) => (await h.app.inject({ method: 'GET', url: '/' })).headers['content-security-policy'] as string;
  const overviewFeatures = async (h: TestHarness) => {
    const login = await h.app.inject({ method: 'POST', url: '/web/login', headers: { origin: ORIGIN }, payload: { idToken: await h.idToken({ sub: 'ff', email: 'ff@example.com' }) } });
    const cookie = `${COOKIE}=${login.cookies.find((c) => c.name === COOKIE)!.value}`;
    return (await h.app.inject({ method: 'GET', url: '/web/overview', headers: { cookie } })).json().features;
  };

  it('is off unless enabled: no YouTube framing in the CSP, and the page is told so', async () => {
    const h = await createHarness({ features: { miniPlayer: false } });
    try {
      assert.doesNotMatch(await csp(h), /youtube/);
      assert.deepEqual(await overviewFeatures(h), { miniPlayer: false });
    } finally {
      await h.app.close();
    }
  });

  it('when enabled, allows the embed and tells the page', async () => {
    const h = await createHarness({ features: { miniPlayer: true } });
    try {
      assert.match(await csp(h), /frame-src [^;]*https:\/\/www\.youtube-nocookie\.com/);
      assert.deepEqual(await overviewFeatures(h), { miniPlayer: true });
    } finally {
      await h.app.close();
    }
  });

  it('reads FEATURE_MINI_PLAYER from the environment, enabled only by exactly "true"', async () => {
    const { loadConfig } = await import('../src/config.ts');
    const base = { GOOGLE_CLIENT_ID: 'id', JWT_SECRET: 'x'.repeat(32) };
    assert.equal(loadConfig({ ...base }).features.miniPlayer, false);
    assert.equal(loadConfig({ ...base, FEATURE_MINI_PLAYER: 'false' }).features.miniPlayer, false);
    assert.equal(loadConfig({ ...base, FEATURE_MINI_PLAYER: '1' }).features.miniPlayer, false);
    assert.equal(loadConfig({ ...base, FEATURE_MINI_PLAYER: 'true' }).features.miniPlayer, true);
  });
});
