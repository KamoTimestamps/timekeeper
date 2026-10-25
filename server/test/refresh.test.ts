import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';
import { Store } from '../src/store.ts';
import { createHarness, type TestHarness } from './helpers.ts';

const opts = { ttlSeconds: 3600, familyMaxSeconds: 7200, graceSeconds: 60 };
const SECOND = 1000;

describe('refresh token rotation (http)', () => {
  let h: TestHarness;
  before(async () => {
    h = await createHarness();
  });
  after(async () => {
    await h.app.close();
  });

  const refresh = (refreshToken: string) =>
    h.app.inject({ method: 'POST', url: '/auth/refresh', payload: { refreshToken } });

  it('issues a new refresh token on every refresh, and the new one keeps working', async () => {
    const { refreshToken: first } = await h.login('rot-1', 'rot1@example.com');
    const second = (await refresh(first)).json().refreshToken;
    const third = (await refresh(second)).json().refreshToken;
    assert.ok(second && third);
    assert.notEqual(second, first);
    assert.notEqual(third, second);
  });

  it('lets a just-used token be retried (lost response) and logout ends the whole session', async () => {
    const { refreshToken: first } = await h.login('rot-2', 'rot2@example.com');
    const second = (await refresh(first)).json().refreshToken;
    const retry = await refresh(first);
    assert.equal(retry.statusCode, 200, 'retry within the grace window succeeds');
    const retryToken = retry.json().refreshToken;

    await h.app.inject({ method: 'POST', url: '/auth/logout', payload: { refreshToken: second } });
    for (const token of [first, second, retryToken]) {
      assert.equal((await refresh(token)).statusCode, 401, 'every token of the session is revoked');
    }
  });
});

describe('refresh token families (store)', () => {
  it('revokes the whole family when a used token is replayed after the grace window', () => {
    const store = new Store(':memory:');
    const { user } = store.upsertGoogleUser({ sub: 's', email: 'a@example.com' });
    const t0 = 1_000_000;
    const first = store.createRefreshToken(user.id, opts.ttlSeconds, { now: t0 }).token;

    const rotated = store.rotateRefreshToken(first, opts, t0 + 10 * SECOND);
    assert.equal(rotated.status, 'ok');
    const child = rotated.status === 'ok' ? rotated.refreshToken : '';

    // The thief (or the stale holder) replays the old token well after the grace window.
    assert.equal(store.rotateRefreshToken(first, opts, t0 + 120 * SECOND).status, 'reuse');
    // Everyone is signed out, including the legitimate holder of the newest token.
    assert.equal(store.rotateRefreshToken(child, opts, t0 + 121 * SECOND).status, 'invalid');
    store.close();
  });

  it('slides expiry on rotation but never past the family lifetime cap', () => {
    const store = new Store(':memory:');
    const { user } = store.upsertGoogleUser({ sub: 's', email: 'a@example.com' });
    const t0 = 5_000_000;
    let token = store.createRefreshToken(user.id, opts.ttlSeconds, { now: t0 }).token;

    // Rotate every 50 minutes; each token would live 60 minutes, but the family dies at 120.
    let now = t0;
    for (let i = 0; i < 2; i++) {
      now += 3000 * SECOND;
      const result = store.rotateRefreshToken(token, opts, now);
      assert.equal(result.status, 'ok', `rotation ${i + 1} within the cap`);
      token = result.status === 'ok' ? result.refreshToken : '';
    }
    now += 3000 * SECOND; // 150 minutes after sign-in
    assert.equal(store.rotateRefreshToken(token, opts, now).status, 'invalid');
    store.close();
  });

  it('rejects expired and unknown tokens', () => {
    const store = new Store(':memory:');
    const { user } = store.upsertGoogleUser({ sub: 's', email: 'a@example.com' });
    const token = store.createRefreshToken(user.id, 10, { now: 0 }).token;
    assert.equal(store.rotateRefreshToken(token, opts, 11 * SECOND).status, 'invalid');
    assert.equal(store.rotateRefreshToken('nope', opts, 0).status, 'invalid');
    store.close();
  });

  it('migrates a database created before rotation and keeps existing sessions working', () => {
    const path = join(mkdtempSync(join(tmpdir(), 'tk-migrate-')), 'old.db');
    const old = new DatabaseSync(path);
    old.exec(`
      CREATE TABLE users (id TEXT PRIMARY KEY, google_sub TEXT NOT NULL UNIQUE, email TEXT NOT NULL,
                          name TEXT, created_at INTEGER NOT NULL, seq INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE refresh_tokens (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires_at INTEGER NOT NULL);
      INSERT INTO users (id, google_sub, email, created_at) VALUES ('u1', 'sub', 'a@example.com', 0);
    `);
    const hash = createHash('sha256').update('legacy-token').digest('hex');
    old.prepare('INSERT INTO refresh_tokens VALUES (?, ?, ?)').run(hash, 'u1', Date.now() + 3_600_000);
    old.close();

    const store = new Store(path);
    const rotated = store.rotateRefreshToken('legacy-token', opts);
    assert.equal(rotated.status, 'ok', 'a session from before the migration can still refresh');
    store.close();
    new Store(path).close(); // reopening an already-migrated database is a no-op
  });
});
