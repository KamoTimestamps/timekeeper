import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { createHarness, testConfig, type TestHarness } from './helpers.ts';
import { Store } from '../src/store.ts';
import { checkUsername, NAME_CHANGE_WINDOW_MS } from '../src/username.ts';

const ORIGIN = testConfig.publicOrigin;
const COOKIE = '__Host-tk_web';
const DAY = 24 * 60 * 60 * 1000;

describe('username rules (YouTube handle policy)', () => {
  const problem = (name: string) => {
    const result = checkUsername(name);
    return result.ok ? null : result.problem;
  };

  it('accepts letters, numbers and _ - . · inside, tidying case-folding for comparison', () => {
    for (const name of ['abc', 'Brave_Otter-42', 'a.b.c', 'Zoë123', 'Привет', 'a·b']) assert.equal(problem(name), null, name);
    const checked = checkUsername('  Brave_Otter42 ');
    assert.deepEqual(checked, { ok: true, name: 'Brave_Otter42', key: 'brave_otter42' });
    assert.equal((checkUsername('Fox_Man') as { key: string }).key, (checkUsername('fox_MAN') as { key: string }).key);
  });

  it('applies the length range for the script', () => {
    assert.equal(problem('ab'), 'length');
    assert.equal(problem('a'.repeat(30)), null);
    assert.equal(problem('a'.repeat(31)), 'length');
    assert.equal(problem('漢字'), null, 'Han: 1 to 10');
    assert.equal(problem('漢'), null);
    assert.equal(problem('漢'.repeat(11)), 'length');
    assert.equal(problem('かな'), null, 'Hiragana: 2 to 20');
    assert.equal(problem('か'), 'length');
    assert.equal(problem('か'.repeat(21)), 'length');
    assert.equal(problem(''), 'length');
  });

  it('rejects spaces, symbols, and separators at the edges', () => {
    for (const name of ['two words', '<script>', 'name;drop', 'a/b/c', 'emoji😀x', 'tab\tname']) assert.equal(problem(name), 'characters', name);
    for (const name of ['.abc', 'abc.', '_abc', 'abc-', '-abc', 'abc·']) assert.equal(problem(name), 'edges', name);
  });

  it('rejects mixing left-to-right and right-to-left letters, but allows digits after', () => {
    assert.equal(problem('abcمرحبا'), 'mixed_direction');
    assert.equal(problem('مرحبا123'), null);
    assert.equal(problem('مرحبا'), null);
  });

  it('rejects names that look like web addresses or phone numbers', () => {
    for (const name of ['www.example', 'https_foo', 'example.com', 'my.site.io']) assert.equal(problem(name), 'looks_like_url', name);
    for (const name of ['5551234567', '555-123-4567', '555.123.4567']) assert.equal(problem(name), 'looks_like_phone', name);
    assert.equal(problem('abc123'), null);
    assert.equal(problem('123456'), null, 'short number runs are fine');
    assert.equal(problem('john.smith'), null);
  });
});

describe('username changes (store)', () => {
  const open = () => {
    const dir = mkdtempSync(join(tmpdir(), 'tk-names-'));
    const store = new Store(join(dir, 'names.db'));
    const user = (n: number) => store.upsertGoogleUser({ sub: `s${n}`, email: `u${n}@example.com` }).user.id;
    return { store, user, done: () => (store.close(), rmSync(dir, { recursive: true, force: true })) };
  };
  const set = (store: Store, id: string, name: string, now: number) => {
    const checked = checkUsername(name);
    assert.ok(checked.ok, name);
    return store.changeDisplayName(id, checked.name, checked.key, now);
  };

  it('keeps names unique regardless of case', () => {
    const { store, user, done } = open();
    try {
      const [a, b] = [user(1), user(2)];
      assert.deepEqual(set(store, a, 'Fox_Man', 0), { ok: true });
      assert.deepEqual(set(store, b, 'fox_man', 0), { ok: false, reason: 'taken' });
      assert.deepEqual(set(store, b, 'Other_Man', 0), { ok: true });
    } finally {
      done();
    }
  });

  it('allows two changes per 14 days, then says when the next one is allowed', () => {
    const { store, user, done } = open();
    try {
      const id = user(1);
      assert.deepEqual(set(store, id, 'first_name', 0), { ok: true }); // choosing a first name is free
      assert.deepEqual(set(store, id, 'second_name', 1 * DAY), { ok: true });
      assert.deepEqual(set(store, id, 'third_name', 2 * DAY), { ok: true });
      assert.deepEqual(set(store, id, 'fourth_name', 3 * DAY), { ok: false, reason: 'limit', retryAt: 1 * DAY + NAME_CHANGE_WINDOW_MS });
      assert.deepEqual(set(store, id, 'fourth_name', 1 * DAY + NAME_CHANGE_WINDOW_MS + 1), { ok: true });
    } finally {
      done();
    }
  });

  it('holds a replaced name for its owner for 14 days, then releases it', () => {
    const { store, user, done } = open();
    try {
      const [a, b] = [user(1), user(2)];
      set(store, a, 'old_name', 0);
      set(store, a, 'new_name', 1 * DAY);
      assert.deepEqual(set(store, b, 'old_name', 2 * DAY), { ok: false, reason: 'taken' }, 'held for the previous owner');
      assert.deepEqual(set(store, a, 'old_name', 3 * DAY), { ok: true }, 'the owner can switch back');
      set(store, a, 'new_name', 4 * DAY + NAME_CHANGE_WINDOW_MS); // moves away again, long after
      assert.deepEqual(set(store, b, 'old_name', 4 * DAY + NAME_CHANGE_WINDOW_MS), { ok: false, reason: 'taken' }, 'held again from this move');
      assert.deepEqual(set(store, b, 'old_name', 5 * DAY + 2 * NAME_CHANGE_WINDOW_MS), { ok: true }, 'released once the window passes');
    } finally {
      done();
    }
  });

  it('treats a capitalization change as free', () => {
    const { store, user, done } = open();
    try {
      const id = user(1);
      set(store, id, 'fox_man', 0);
      for (let i = 0; i < 5; i++) assert.deepEqual(set(store, id, i % 2 ? 'fox_man' : 'Fox_Man', 0), { ok: true });
      assert.equal(store.getAccount(id)?.displayName, 'Fox_Man');
      assert.deepEqual(set(store, id, 'other_name', 0), { ok: true }, 'the limit was untouched');
    } finally {
      done();
    }
  });
});

describe('username (web)', () => {
  let h: TestHarness;
  before(async () => {
    h = await createHarness();
  });
  after(async () => {
    await h.app.close();
  });

  const cookieFor = async (sub: string) => {
    const res = await h.app.inject({
      method: 'POST',
      url: '/web/login',
      headers: { origin: ORIGIN },
      payload: { idToken: await h.idToken({ sub, email: `${sub}@example.com` }) },
    });
    return { cookie: `${COOKIE}=${res.cookies.find((c) => c.name === COOKIE)!.value}` };
  };
  const put = (headers: Record<string, string>, payload: unknown) =>
    h.app.inject({ method: 'PUT', url: '/web/display-name', headers, payload: payload as object });
  const account = async (headers: Record<string, string>) =>
    (await h.app.inject({ method: 'GET', url: '/web/overview', headers })).json().account;

  it('is unset for a new account, which is what sends the page to the form', async () => {
    const session = await cookieFor('dn1');
    assert.equal((await account(session)).displayName, null);
  });

  it('saves a name, shows it on the account, and can be changed', async () => {
    const session = await cookieFor('dn2');
    const first = await put({ ...session, origin: ORIGIN }, { displayName: ' Brave_Otter42 ' });
    assert.equal(first.statusCode, 200);
    assert.equal(first.json().displayName, 'Brave_Otter42');
    assert.equal((await account(session)).displayName, 'Brave_Otter42');

    assert.equal((await put({ ...session, origin: ORIGIN }, { displayName: 'Kanna_Fan' })).statusCode, 200);
    assert.equal((await account(session)).displayName, 'Kanna_Fan');
  });

  it('says what is wrong with a rejected name', async () => {
    const session = await cookieFor('dn3');
    const rejected = async (displayName: unknown) => put({ ...session, origin: ORIGIN }, { displayName });
    for (const [value, problem] of [['ab', 'length'], ['two words', 'characters'], ['_abc', 'edges'], ['example.com', 'looks_like_url'], ['5551234567', 'looks_like_phone']]) {
      const res = await rejected(value);
      assert.equal(res.statusCode, 400, String(value));
      assert.equal(res.json().problem, problem, String(value));
    }
    assert.equal((await rejected(42)).statusCode, 400);
    assert.equal((await put({ ...session, origin: ORIGIN }, {})).statusCode, 400);
    assert.equal((await account(session)).displayName, null, 'nothing was saved');
  });

  it('needs a session and the page’s own origin, and only changes the signed-in account', async () => {
    const mine = await cookieFor('dn4');
    const other = await cookieFor('dn5');
    assert.equal((await put({ origin: ORIGIN }, { displayName: 'Nobody' })).statusCode, 401);
    assert.equal((await put({ ...mine, origin: 'https://evil.example' }, { displayName: 'Mallory' })).statusCode, 403);

    await put({ ...mine, origin: ORIGIN }, { displayName: 'Just_Me' });
    assert.equal((await account(mine)).displayName, 'Just_Me');
    assert.equal((await account(other)).displayName, null);
  });

  it('refuses a name another account has (any case) and limits changes to two per window', async () => {
    const a = await cookieFor('dn6');
    const b = await cookieFor('dn7');
    assert.equal((await put({ ...a, origin: ORIGIN }, { displayName: 'Taken_Name' })).statusCode, 200);
    const clash = await put({ ...b, origin: ORIGIN }, { displayName: 'TAKEN_name' });
    assert.equal(clash.statusCode, 409);
    assert.equal(clash.json().error, 'name_taken');

    for (const name of ['b_one', 'b_two', 'b_three']) assert.equal((await put({ ...b, origin: ORIGIN }, { displayName: name })).statusCode, 200, name);
    const limited = await put({ ...b, origin: ORIGIN }, { displayName: 'b_four' });
    assert.equal(limited.statusCode, 429);
    assert.ok(limited.json().retryAt > Date.now());
    assert.equal((await account(b)).displayName, 'b_three');
  });
});

describe('username migration', () => {
  it('adds the columns to a database that predates them, leaving existing users without a name', () => {
    const dir = mkdtempSync(join(tmpdir(), 'tk-migrate-'));
    const path = join(dir, 'legacy.db');
    try {
      const legacy = new DatabaseSync(path);
      legacy.exec(`CREATE TABLE users (id TEXT PRIMARY KEY, google_sub TEXT NOT NULL UNIQUE, email TEXT NOT NULL, name TEXT, created_at INTEGER NOT NULL, seq INTEGER NOT NULL DEFAULT 0);
                   INSERT INTO users (id, google_sub, email, name, created_at) VALUES ('u1', 'sub1', 'old@example.com', 'Old User', 1000);`);
      legacy.close();

      const store = new Store(path);
      assert.deepEqual(store.getAccount('u1'), { email: 'old@example.com', name: 'Old User', displayName: null, createdAt: 1000 });
      const checked = checkUsername('Returning_Fox');
      assert.ok(checked.ok);
      assert.deepEqual(store.changeDisplayName('u1', checked.name, checked.key), { ok: true });
      store.close();

      const again = new Store(path); // a second start keeps the chosen name
      assert.equal(again.getAccount('u1')?.displayName, 'Returning_Fox');
      again.close();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
