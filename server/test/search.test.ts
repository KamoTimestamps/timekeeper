import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { bearer, createHarness, record, testConfig, type TestHarness } from './helpers.ts';
import { likeContains, parseSearch } from '../src/search.ts';

const ORIGIN = testConfig.publicOrigin;
const COOKIE = '__Host-tk_web';

describe('search query parsing', () => {
  it('splits plain words, field terms and quoted phrases', () => {
    assert.deepEqual(parseSearch('boss title:cult channel:"Kanna Yanagi" fight'), {
      words: ['boss', 'fight'],
      title: ['cult'],
      channel: ['Kanna Yanagi'],
    });
    assert.deepEqual(parseSearch('TITLE:Lamb Channel:x'), { words: [], title: ['Lamb'], channel: ['x'] }, 'field names ignore case');
    assert.deepEqual(parseSearch('title:"Cult of the Lamb"'), { words: [], title: ['Cult of the Lamb'], channel: [] });
  });

  it('ignores a field with nothing after it, and unterminated quotes still count', () => {
    assert.deepEqual(parseSearch('title:'), { words: [], title: [], channel: [] });
    assert.deepEqual(parseSearch('boss channel: '), { words: ['boss'], title: [], channel: [] });
    assert.deepEqual(parseSearch('title:""'), { words: [], title: [], channel: [] });
    assert.deepEqual(parseSearch('title:"half open'), { words: [], title: ['half open'], channel: [] });
  });

  it('only treats the exact field names as fields, and caps the number of terms', () => {
    assert.deepEqual(parseSearch('comment:x mytitle:y'), { words: ['comment:x', 'mytitle:y'], title: [], channel: [] });
    const many = parseSearch(Array.from({ length: 12 }, (_, i) => `w${i}`).join(' '));
    assert.equal(many.words.length, 8);
  });

  it('turns a value into a literal LIKE pattern', () => {
    assert.equal(likeContains('100%_a\\b'), '%100\\%\\_a\\\\b%');
  });
});

describe('field search and suggestions (web)', () => {
  let h: TestHarness;
  before(async () => {
    h = await createHarness();
  });
  after(async () => {
    await h.app.close();
  });

  const details = (title: string, channelTitle: string) => ({ title, channelTitle, thumbnailUrl: null, publishedAt: '2026-01-01T00:00:00Z', durationSeconds: null });
  const setup = async (sub: string) => {
    const script = await h.login(sub, `${sub}@example.com`);
    await h.app.inject({
      method: 'POST',
      url: '/sync/push',
      headers: bearer(script.accessToken),
      payload: {
        deviceId: 'd',
        records: [
          record('a1', 1, { video_id: 'lamb', start: 10, comment: 'the boss fight' }),
          record('b1', 2, { video_id: 'cats', start: 20, comment: 'lamb mentioned in chat' }),
          record('c1', 3, { video_id: 'pct', start: 30, comment: 'nothing' }),
        ],
      },
    });
    h.store.saveVideoInfo(
      [
        { videoId: 'lamb', info: details('Cult of the Lamb part 1', 'Kanna Yanagi') },
        { videoId: 'cats', info: details('Cat videos', 'Other Channel') },
        { videoId: 'pct', info: details('100%_sure', 'Kanna Yanagi') },
      ],
      Date.now(),
    );
    const login = await h.app.inject({ method: 'POST', url: '/web/login', headers: { origin: ORIGIN }, payload: { idToken: await h.idToken({ sub, email: `${sub}@example.com` }) } });
    return { cookie: `${COOKIE}=${login.cookies.find((c) => c.name === COOKIE)!.value}` };
  };
  const guids = async (session: Record<string, string>, q: string) =>
    ((await h.app.inject({ method: 'GET', url: `/web/timestamps?q=${encodeURIComponent(q)}`, headers: session })).json().items as Array<{ guid: string }>)
      .map((i) => i.guid)
      .sort();
  const suggest = async (session: Record<string, string>, field: string, q: string) =>
    (await h.app.inject({ method: 'GET', url: `/web/search-suggestions?field=${field}&q=${encodeURIComponent(q)}`, headers: session })).json().suggestions as Array<{ field: string; value: string }>;

  it('title: and channel: search only that field, and a plain word still searches everything', async () => {
    const session = await setup('sr1');
    assert.deepEqual(await guids(session, 'lamb'), ['a1', 'b1'], 'plain: the title of one, the comment of the other');
    assert.deepEqual(await guids(session, 'title:lamb'), ['a1'], 'the comment mention does not count');
    assert.deepEqual(await guids(session, 'channel:kanna'), ['a1', 'c1']);
    assert.deepEqual(await guids(session, 'channel:"kanna yanagi" title:lamb'), ['a1'], 'terms combine');
    assert.deepEqual(await guids(session, 'channel:kanna boss'), ['a1'], 'with a plain word');
    assert.deepEqual(await guids(session, 'title:'), ['a1', 'b1', 'c1'], 'an empty field is ignored');
    assert.deepEqual(await guids(session, 'title:100%'), ['c1'], 'wildcards are literal');
    assert.deepEqual(await guids(session, 'title:%'), ['c1']);
    assert.deepEqual(await guids(session, 'channel:nobody'), []);
  });

  it('suggests titles and channels from your own videos, prefix matches first', async () => {
    const session = await setup('sr2');
    assert.deepEqual(await suggest(session, 'channel', 'ka'), [{ field: 'channel', value: 'Kanna Yanagi' }]);
    assert.deepEqual((await suggest(session, 'title', 'lamb')).map((s) => s.value), ['Cult of the Lamb part 1']);
    assert.deepEqual((await suggest(session, 'title', 'c')).map((s) => s.value), ['Cat videos', 'Cult of the Lamb part 1'], 'starts-with first, then the rest');
    const any = await suggest(session, 'any', 'ya');
    assert.deepEqual(any, [{ field: 'channel', value: 'Kanna Yanagi' }]);
    assert.deepEqual(await suggest(session, 'title', '100%'), [{ field: 'title', value: '100%_sure' }]);
    assert.deepEqual(await suggest(session, 'title', '%'), [{ field: 'title', value: '100%_sure' }], '% is literal, not a wildcard');
  });

  it('only suggests from your own timestamps, and needs a session', async () => {
    const mine = await setup('sr3');
    const other = await h.login('sr4', 'sr4@example.com');
    await h.app.inject({ method: 'POST', url: '/sync/push', headers: bearer(other.accessToken), payload: { deviceId: 'd', records: [record('z1', 1, { video_id: 'secret', start: 5 })] } });
    h.store.saveVideoInfo([{ videoId: 'secret', info: details('Secret stream', 'Hidden Channel') }], Date.now());

    assert.deepEqual(await suggest(mine, 'any', 'secret'), []);
    assert.deepEqual(await suggest(mine, 'channel', 'hidden'), []);
    assert.equal((await h.app.inject({ method: 'GET', url: '/web/search-suggestions?q=x' })).statusCode, 401);
    assert.equal((await h.app.inject({ method: 'GET', url: '/web/search-suggestions?field=bogus', headers: mine })).statusCode, 400);
  });
});
