import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { WebSocket } from 'ws';
import { createHarness, record, type TestHarness } from './helpers.ts';

describe('websocket', () => {
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

  const nextMessage = (ws: WebSocket) =>
    new Promise<any>((resolve, reject) => {
      ws.once('message', (data) => resolve(JSON.parse(data.toString())));
      ws.once('close', (code) => reject(new Error(`closed ${code}`)));
    });
  const closeCode = (ws: WebSocket) => new Promise<number>((resolve) => ws.once('close', (code) => resolve(code)));
  const open = (ws: WebSocket) => new Promise<void>((resolve) => ws.once('open', () => resolve()));

  async function connect(token: string, deviceId: string) {
    const ws = new WebSocket(url);
    await open(ws);
    const ready = nextMessage(ws);
    ws.send(JSON.stringify({ type: 'auth', token, deviceId }));
    assert.equal((await ready).type, 'ready');
    return ws;
  }

  const push = (token: string, deviceId: string, records: unknown[]) =>
    h.app.inject({
      method: 'POST',
      url: '/sync/push',
      headers: { authorization: `Bearer ${token}` },
      payload: { deviceId, records },
    });

  it('delivers one device\'s changes to the same user\'s other devices only', async () => {
    const { accessToken } = await h.login('ws1', 'ws1@example.com');
    const other = await h.login('ws-other', 'other@example.com');
    const deviceB = await connect(accessToken, 'dev-b');
    const deviceA = await connect(accessToken, 'dev-a');
    const stranger = await connect(other.accessToken, 'dev-x');

    const seen: unknown[] = [];
    deviceA.on('message', (d) => seen.push(d.toString()));
    stranger.on('message', (d) => seen.push(d.toString()));

    const incoming = nextMessage(deviceB);
    await push(accessToken, 'dev-a', [record('live', 1)]);
    const msg = await incoming;

    assert.equal(msg.type, 'changes');
    assert.deepEqual([msg.fromSeq, msg.seq, msg.records[0].guid], [0, 1, 'live']);

    await new Promise((r) => setTimeout(r, 50));
    assert.deepEqual(seen, [], 'sender and other users receive nothing');
    for (const ws of [deviceA, deviceB, stranger]) ws.close();
  });

  it('closes sockets with a bad token or a malformed handshake', async () => {
    const bad = new WebSocket(url);
    await open(bad);
    const badClosed = closeCode(bad);
    bad.send(JSON.stringify({ type: 'auth', token: 'nope', deviceId: 'd' }));
    assert.equal(await badClosed, 4401);

    const malformed = new WebSocket(url);
    await open(malformed);
    const malformedClosed = closeCode(malformed);
    malformed.send('not json');
    assert.equal(await malformedClosed, 4400);
  });
});
