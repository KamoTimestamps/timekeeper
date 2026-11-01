import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { createHarness, testConfig, type TestHarness } from './helpers.ts';

const ORIGIN = testConfig.publicOrigin;
const COOKIE = '__Host-tk_web';

describe('linking Google accounts', () => {
  let h: TestHarness;
  before(async () => {
    h = await createHarness();
  });
  after(async () => {
    await h.app.close();
  });

  const webLogin = async (sub: string, email: string) => {
    const res = await h.app.inject({
      method: 'POST',
      url: '/web/login',
      headers: { origin: ORIGIN },
      payload: { idToken: await h.idToken({ sub, email }) },
    });
    const cookie = res.cookies.find((c) => c.name === COOKIE)!;
    return { userId: res.json().user.id as string, headers: { origin: ORIGIN, cookie: `${COOKIE}=${cookie.value}` } };
  };

  const link = async (headers: Record<string, string>, claims?: { sub: string; email: string }, idToken?: string) =>
    h.app.inject({
      method: 'POST',
      url: '/web/google-accounts',
      headers,
      payload: { idToken: idToken ?? (await h.idToken(claims)) },
    });

  const unlink = (headers: Record<string, string>, sub: string) =>
    h.app.inject({ method: 'DELETE', url: `/web/google-accounts/${encodeURIComponent(sub)}`, headers });

  const accounts = async (headers: Record<string, string>) =>
    (await h.app.inject({ method: 'GET', url: '/web/overview', headers })).json().account;

  it('lets a second Google account sign in to the same Timekeeper account', async () => {
    const a = await webLogin('link-a1', 'a1@example.com');
    const res = await link(a.headers, { sub: 'link-a2', email: 'a2@example.com' });
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.json(), { status: 'linked' });

    const account = await accounts(a.headers);
    assert.deepEqual(account.googleAccounts.map((g: { sub: string }) => g.sub), ['link-a1', 'link-a2']);
    assert.equal(account.email, 'a1@example.com', 'the account email stays that of the first Google account');

    const second = await webLogin('link-a2', 'a2@example.com');
    assert.equal(second.userId, a.userId, 'signing in with the linked account reaches the same user');
    assert.equal(h.store.listGoogleAccounts(a.userId).length, 2, 'and does not create another');
    const token = await h.login('link-a2', 'a2@example.com');
    assert.equal(token.userId, a.userId, 'the userscript sign-in does too');
  });

  it('treats linking an account the user already has as a success that changes nothing', async () => {
    const a = await webLogin('idem-1', 'idem@example.com');
    const res = await link(a.headers, { sub: 'idem-1', email: 'idem@example.com' });
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.json(), { status: 'already_linked' });
    assert.equal((await accounts(a.headers)).googleAccounts.length, 1);
  });

  it("refuses a Google account that belongs to another user, but only once its token has been verified", async () => {
    const owner = await webLogin('owned-1', 'owned@example.com');
    const other = await webLogin('other-1', 'other@example.com');

    const taken = await link(other.headers, { sub: 'owned-1', email: 'owned@example.com' });
    assert.equal(taken.statusCode, 409);
    assert.deepEqual(taken.json(), { error: 'google_account_in_use' });

    // Without proof of owning the Google account the answer is the same for a registered and an unregistered one.
    const forged = await h.idToken({ sub: 'owned-1', aud: 'someone-else' });
    const forgedRegistered = await link(other.headers, undefined, forged);
    const forgedUnregistered = await link(other.headers, undefined, await h.idToken({ sub: 'never-seen', aud: 'someone-else' }));
    assert.equal(forgedRegistered.statusCode, 401);
    assert.deepEqual(forgedRegistered.json(), forgedUnregistered.json());
    const unverified = await link(other.headers, undefined, await h.idToken({ sub: 'owned-1', email_verified: false }));
    assert.equal(unverified.statusCode, 401);

    assert.equal((await accounts(owner.headers)).googleAccounts.length, 1, 'nothing moved');
    assert.equal((await accounts(other.headers)).googleAccounts.length, 1);
  });

  it('needs a web session and this server\'s own origin', async () => {
    const a = await webLogin('auth-1', 'auth@example.com');
    const claims = { sub: 'auth-2', email: 'auth2@example.com' };
    assert.equal((await link({ origin: ORIGIN }, claims)).statusCode, 401, 'no session');
    assert.equal((await link({ ...a.headers, origin: 'https://evil.test' }, claims)).statusCode, 403);
    assert.equal((await unlink({ origin: ORIGIN }, 'auth-1')).statusCode, 401);
    assert.equal((await unlink({ ...a.headers, origin: 'https://evil.test' }, 'auth-1')).statusCode, 403);
    assert.equal((await accounts(a.headers)).googleAccounts.length, 1);
  });

  it('unlinks an account that is not the one in use, and ends every session', async () => {
    const a = await webLogin('un-1', 'un1@example.com');
    await link(a.headers, { sub: 'un-2', email: 'un2@example.com' });
    const userscript = await h.login('un-1', 'un1@example.com');
    const b = await webLogin('un-2', 'un2@example.com');
    assert.equal(b.userId, a.userId);

    const own = await unlink(b.headers, 'un-2');
    assert.equal(own.statusCode, 409, 'the Google account this session signed in with stays');
    assert.deepEqual(own.json(), { error: 'current_google_account' });
    assert.equal((await accounts(b.headers)).googleAccounts.length, 2, 'and the refusal leaves everyone signed in');
    assert.equal((await h.app.inject({ method: 'GET', url: '/me', headers: { authorization: `Bearer ${userscript.accessToken}` } })).statusCode, 200);

    const res = await unlink(b.headers, 'un-1');
    assert.equal(res.statusCode, 200);
    assert.equal(res.json().revoked, 3, 'both web sessions and the userscript session');
    for (const headers of [a.headers, b.headers]) {
      assert.equal((await h.app.inject({ method: 'GET', url: '/web/overview', headers })).statusCode, 401, 'web pages are signed out');
    }
    assert.equal((await h.app.inject({ method: 'GET', url: '/me', headers: { authorization: `Bearer ${userscript.accessToken}` } })).statusCode, 401, 'so is the userscript');
    assert.equal(
      (await h.app.inject({ method: 'POST', url: '/auth/refresh', payload: { refreshToken: userscript.refreshToken } })).statusCode,
      401,
      'and it cannot refresh',
    );

    const again = await webLogin('un-2', 'un2@example.com');
    assert.equal(again.userId, a.userId, 'the remaining account still reaches the user');
    const account = await accounts(again.headers);
    assert.deepEqual(account.googleAccounts.map((g: { sub: string }) => g.sub), ['un-2']);
    assert.equal(account.email, 'un2@example.com', 'the email follows the remaining account');
    assert.equal(h.store.unlinkGoogleAccount(a.userId, 'un-2'), 'last', 'the store also never removes the last account');

    const gone = await h.app.inject({
      method: 'POST',
      url: '/web/login',
      headers: { origin: ORIGIN },
      payload: { idToken: await h.idToken({ sub: 'un-1', email: 'un1@example.com' }) },
    });
    assert.notEqual(gone.json().user.id, a.userId, 'the unlinked Google account no longer reaches this user');
  });

  it('shows which Google account each session signed in with', async () => {
    const a = await webLogin('ses-1', 'ses1@example.com');
    await link(a.headers, { sub: 'ses-2', email: 'ses2@example.com' });
    await h.login('ses-2', 'ses2@example.com');
    const { sessions, account } = (await h.app.inject({ method: 'GET', url: '/web/overview', headers: a.headers })).json();
    assert.equal(account.currentGoogleSub, 'ses-1', 'the page knows which Google account it is using');
    assert.deepEqual(
      sessions.map((s: { kind: string; googleEmail: string }) => [s.kind, s.googleEmail]).sort(),
      [['userscript', 'ses2@example.com'], ['web', 'ses1@example.com']],
    );
  });

  it("cannot unlink another user's account, and can't tell whether it exists", async () => {
    const a = await webLogin('x-1', 'x1@example.com');
    await link(a.headers, { sub: 'x-2', email: 'x2@example.com' });
    const b = await webLogin('y-1', 'y1@example.com');
    await link(b.headers, { sub: 'y-2', email: 'y2@example.com' });

    assert.equal((await unlink(b.headers, 'x-2')).statusCode, 404);
    assert.equal((await unlink(b.headers, 'no-such')).statusCode, 404);
    assert.equal((await accounts(a.headers)).googleAccounts.length, 2);
    assert.equal((await accounts(b.headers)).googleAccounts.length, 2, 'and a failed unlink does not log b out');
    assert.equal((await unlink(b.headers, 'y-1')).statusCode, 409, 'b still can not drop the account it is using');
  });

  it('deletes the links with the user', async () => {
    const a = await webLogin('del-1', 'del@example.com');
    await link(a.headers, { sub: 'del-2', email: 'del2@example.com' });
    h.store.db.prepare('DELETE FROM users WHERE id = ?').run(a.userId);
    assert.equal(h.store.listGoogleAccounts(a.userId).length, 0);
  });
});
