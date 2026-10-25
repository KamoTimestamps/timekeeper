import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { bearer, createHarness, type TestHarness } from './helpers.ts';

describe('auth', () => {
  let h: TestHarness;
  before(async () => {
    h = await createHarness();
  });
  after(async () => {
    await h.app.close();
  });

  const loginWith = async (idToken: string) =>
    h.app.inject({ method: 'POST', url: '/auth/google', payload: { idToken } });

  it('creates an account on first Google login and reuses it afterwards', async () => {
    const first = (await loginWith(await h.idToken())).json();
    assert.equal(first.isNewUser, true);
    assert.equal(first.user.email, 'ada@example.com');
    assert.ok(first.accessToken && first.refreshToken);

    const second = (await loginWith(await h.idToken({ email: 'ada.new@example.com' }))).json();
    assert.equal(second.isNewUser, false);
    assert.equal(second.user.id, first.user.id);
    assert.equal(second.user.email, 'ada.new@example.com', 'email follows the Google account');
  });

  it('rejects tokens for another audience, an unverified email, expired or garbage tokens', async () => {
    for (const claims of [
      { aud: 'someone-else' },
      { email_verified: false },
      { iss: 'https://evil.example' },
      { expiresIn: '-1m' },
    ]) {
      const res = await loginWith(await h.idToken({ sub: 'x', ...claims }));
      assert.equal(res.statusCode, 401, JSON.stringify(claims));
    }
    assert.equal((await loginWith('not-a-jwt')).statusCode, 401);
    assert.equal((await h.app.inject({ method: 'POST', url: '/auth/google', payload: {} })).statusCode, 400);
  });

  it('serves /me only with a valid access token', async () => {
    const { accessToken } = await h.login('me-sub', 'me@example.com');
    const ok = await h.app.inject({ method: 'GET', url: '/me', headers: bearer(accessToken) });
    assert.equal(ok.statusCode, 200);
    assert.equal(ok.json().email, 'me@example.com');

    assert.equal((await h.app.inject({ method: 'GET', url: '/me' })).statusCode, 401);
    assert.equal(
      (await h.app.inject({ method: 'GET', url: '/me', headers: bearer(accessToken + 'x') })).statusCode,
      401,
    );
  });

  it('refreshes repeatedly with the same refresh token until logout', async () => {
    const { refreshToken, userId } = await h.login('refresh-sub', 'r@example.com');
    for (let i = 0; i < 2; i++) {
      const res = await h.app.inject({ method: 'POST', url: '/auth/refresh', payload: { refreshToken } });
      assert.equal(res.statusCode, 200);
      assert.equal(res.json().user.id, userId);
    }

    assert.equal((await h.app.inject({ method: 'POST', url: '/auth/logout', payload: { refreshToken } })).statusCode, 204);
    const after = await h.app.inject({ method: 'POST', url: '/auth/refresh', payload: { refreshToken } });
    assert.equal(after.statusCode, 401);
  });
});
