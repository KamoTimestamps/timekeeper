import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { createHarness, testConfig, type TestHarness } from './helpers.ts';

const ORIGIN = testConfig.publicOrigin;
const COOKIE = '__Host-tk_web';

interface SessionView {
  kind: string;
  ip: string | null;
  country: string | null;
  createdIp: string | null;
  createdCountry: string | null;
}

async function webLogin(h: TestHarness, sub: string, email: string, headers: Record<string, string> = {}) {
  const res = await h.app.inject({
    method: 'POST',
    url: '/web/login',
    headers: { origin: ORIGIN, ...headers },
    payload: { idToken: await h.idToken({ sub, email }) },
  });
  const cookie = res.cookies.find((c) => c.name === COOKIE);
  assert.ok(cookie, 'web login sets the session cookie');
  return `${COOKIE}=${cookie.value}`;
}

async function sessions(h: TestHarness, cookie: string, headers: Record<string, string> = {}): Promise<SessionView[]> {
  const res = await h.app.inject({ method: 'GET', url: '/web/overview', headers: { cookie, ...headers } });
  return res.json().sessions;
}

const at = (ip: string, country: string) => ({ 'x-client-ip': ip, 'x-client-country': country });

describe('session location (behind a trusted proxy)', () => {
  let h: TestHarness;
  before(async () => {
    h = await createHarness();
  });
  after(async () => {
    await h.app.close();
  });

  it('records where each session signed in and where it was last active', async () => {
    const script = await h.login('loc1', 'loc1@example.com', at('203.0.113.7', 'de'));
    const cookie = await webLogin(h, 'loc1', 'loc1@example.com', at('198.51.100.9', 'US'));

    let list = await sessions(h, cookie, at('198.51.100.9', 'US'));
    const userscript = list.find((s) => s.kind === 'userscript');
    const web = list.find((s) => s.kind === 'web');
    assert.deepEqual([userscript?.ip, userscript?.country], ['203.0.113.7', 'DE']);
    assert.deepEqual([web?.ip, web?.country], ['198.51.100.9', 'US']);

    // The userscript's token is refreshed from somewhere else (e.g. a stolen token, or a trip).
    const refreshed = await h.app.inject({
      method: 'POST',
      url: '/auth/refresh',
      headers: at('192.0.2.44', 'JP'),
      payload: { refreshToken: script.refreshToken },
    });
    assert.equal(refreshed.statusCode, 200);

    list = await sessions(h, cookie, at('198.51.100.9', 'US'));
    const moved = list.find((s) => s.kind === 'userscript');
    assert.deepEqual([moved?.ip, moved?.country], ['192.0.2.44', 'JP'], 'last activity moves');
    assert.deepEqual([moved?.createdIp, moved?.createdCountry], ['203.0.113.7', 'DE'], 'sign-in origin stays');

    // The page itself, opened from another network, updates its own session (IPv6 works too).
    await sessions(h, cookie, at('2001:db8::1', 'FR'));
    list = await sessions(h, cookie, at('2001:db8::1', 'FR'));
    const webNow = list.find((s) => s.kind === 'web');
    assert.deepEqual([webNow?.ip, webNow?.country], ['2001:db8::1', 'FR']);
    assert.deepEqual([webNow?.createdIp, webNow?.createdCountry], ['198.51.100.9', 'US']);
  });

  it('ignores malformed headers and non-country codes', async () => {
    const cases: Array<[Record<string, string>, string | null]> = [
      [at('203.0.113.1', 'zzz'), null],
      [at('203.0.113.1', 'XX'), null], // Cloudflare: unknown
      [at('203.0.113.1', 'T1'), null], // Cloudflare: Tor
      [at('203.0.113.1', '<s>'), null],
      [at('203.0.113.1', 'gb'), 'GB'], // normalised to upper case
    ];
    for (const [i, [headers, expected]] of cases.entries()) {
      await h.login(`loc2-${i}`, `loc2-${i}@example.com`, headers);
      const cookie = await webLogin(h, `loc2-${i}`, `loc2-${i}@example.com`);
      const script = (await sessions(h, cookie)).find((s) => s.kind === 'userscript');
      assert.equal(script?.country, expected, JSON.stringify(headers));
    }

    await h.login('loc3', 'loc3@example.com', { 'x-client-ip': '<script>alert(1)</script>' });
    const script = (await sessions(h, await webLogin(h, 'loc3', 'loc3@example.com'))).find((s) => s.kind === 'userscript');
    assert.equal(script?.ip, '127.0.0.1', 'a bad X-Client-IP falls back to the socket address');
  });
});

describe('session location (proxy headers not trusted)', () => {
  let h: TestHarness;
  before(async () => {
    h = await createHarness({ trustProxyHeaders: false });
  });
  after(async () => {
    await h.app.close();
  });

  it('uses the socket address and never believes client-supplied headers', async () => {
    await h.login('loc4', 'loc4@example.com', at('203.0.113.7', 'DE'));
    const cookie = await webLogin(h, 'loc4', 'loc4@example.com', at('198.51.100.9', 'US'));
    for (const s of await sessions(h, cookie, at('192.0.2.44', 'JP'))) {
      assert.equal(s.ip, '127.0.0.1');
      assert.equal(s.country, null);
    }
  });
});
