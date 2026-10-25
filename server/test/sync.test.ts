import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { bearer, createHarness, record, type TestHarness } from './helpers.ts';

describe('sync', () => {
  let h: TestHarness;
  before(async () => {
    h = await createHarness();
  });
  after(async () => {
    await h.app.close();
  });

  const push = async (token: string, records: unknown[], deviceId = 'dev-a') =>
    h.app.inject({ method: 'POST', url: '/sync/push', headers: bearer(token), payload: { deviceId, records } });
  const pull = async (token: string, query = '') =>
    h.app.inject({ method: 'GET', url: `/sync/pull${query}`, headers: bearer(token) });

  it('requires authentication', async () => {
    assert.equal((await h.app.inject({ method: 'POST', url: '/sync/push', payload: {} })).statusCode, 401);
    assert.equal((await h.app.inject({ method: 'GET', url: '/sync/pull' })).statusCode, 401);
  });

  it('accepts new records, assigns contiguous seqs, and returns them on pull', async () => {
    const { accessToken } = await h.login('s1', 's1@example.com');
    const res = (await push(accessToken, [record('a', 1), record('b', 2)])).json();
    assert.deepEqual([res.fromSeq, res.seq, res.accepted.length, res.rejected.length], [0, 2, 2, 0]);

    const pulled = (await pull(accessToken)).json();
    assert.deepEqual(pulled.records.map((r: { guid: string; seq: number }) => [r.guid, r.seq]), [['a', 1], ['b', 2]]);
    assert.equal(pulled.seq, 2);
    assert.equal(pulled.hasMore, false);

    const nothingNew = (await pull(accessToken, '?since=2')).json();
    assert.deepEqual([nothingNew.records.length, nothingNew.seq], [0, 2]);
  });

  it('resolves conflicts by write_counter: higher wins, lower is rejected with the server copy', async () => {
    const { accessToken } = await h.login('s2', 's2@example.com');
    await push(accessToken, [record('g', 5, { comment: 'v5' })]);

    const newer = (await push(accessToken, [record('g', 6, { comment: 'v6' })])).json();
    assert.equal(newer.accepted.length, 1);

    const stale = (await push(accessToken, [record('g', 4, { comment: 'v4' })])).json();
    assert.equal(stale.accepted.length, 0);
    assert.equal(stale.rejected[0].comment, 'v6');
    assert.equal(stale.fromSeq, stale.seq, 'no seq range when nothing was accepted');

    const tie = (await push(accessToken, [record('g', 6, { comment: 'different' })])).json();
    assert.deepEqual([tie.accepted.length, tie.rejected[0].comment], [0, 'v6']);

    const replay = (await push(accessToken, [record('g', 6, { comment: 'v6' })])).json();
    assert.deepEqual([replay.accepted.length, replay.rejected.length], [0, 0], 'identical replay is a silent no-op');
  });

  it('propagates deletions as higher-counter records with deleted_at', async () => {
    const { accessToken } = await h.login('s3', 's3@example.com');
    await push(accessToken, [record('d', 1)]);
    await push(accessToken, [record('d', 2, { deleted_at: 1700000000000 })]);

    const [row] = (await pull(accessToken)).json().records;
    assert.equal(row.deleted_at, 1700000000000);
    assert.equal(row.write_counter, 2);
  });

  it('paginates pulls', async () => {
    const { accessToken } = await h.login('s4', 's4@example.com');
    await push(accessToken, Array.from({ length: 5 }, (_, i) => record(`p${i}`, i + 1)));

    const first = (await pull(accessToken, '?limit=2')).json();
    assert.deepEqual([first.records.length, first.hasMore, first.seq], [2, true, 2]);
    const second = (await pull(accessToken, `?limit=2&since=${first.seq}`)).json();
    assert.deepEqual([second.records.length, second.hasMore, second.seq], [2, true, 4]);
    const last = (await pull(accessToken, `?limit=2&since=${second.seq}`)).json();
    assert.deepEqual([last.records.length, last.hasMore, last.seq], [1, false, 5]);
  });

  it('restarts from zero when the client cursor is ahead of the server', async () => {
    const { accessToken } = await h.login('s5', 's5@example.com');
    await push(accessToken, [record('only', 1)]);
    const res = (await pull(accessToken, '?since=999')).json();
    assert.deepEqual([res.records.length, res.seq], [1, 1]);
  });

  it('isolates users from each other', async () => {
    const alice = await h.login('iso-a', 'a@example.com');
    const bob = await h.login('iso-b', 'b@example.com');
    await push(alice.accessToken, [record('shared-guid', 1, { comment: 'alice' })]);
    await push(bob.accessToken, [record('shared-guid', 1, { comment: 'bob' })]);

    assert.equal((await pull(alice.accessToken)).json().records[0].comment, 'alice');
    assert.equal((await pull(bob.accessToken)).json().records[0].comment, 'bob');
  });

  it('rejects malformed pushes', async () => {
    const { accessToken } = await h.login('s6', 's6@example.com');
    assert.equal((await push(accessToken, [{ guid: 'x' }])).statusCode, 400);
    assert.equal((await push(accessToken, [record('neg', 1, { start: -1 })])).statusCode, 400);
    assert.equal((await push(accessToken, [record('zero', 0)])).statusCode, 400);
    assert.equal((await push(accessToken, Array.from({ length: 501 }, (_, i) => record(`m${i}`, i + 1)))).statusCode, 400);
  });
});
