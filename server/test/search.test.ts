import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { bearer, createHarness, record, testConfig, type TestHarness } from './helpers.ts';
import { likeContains, parseSearch } from '../src/search.ts';

const ORIGIN = testConfig.publicOrigin;
const COOKIE = '__Host-tk_web';
const NONE = { title: [], channel: [], date: [], comment: [], is: [] }; // no negated terms

describe('search query parsing', () => {
  it('reads is: properties, lowercased, as filters and negations', () => {
    const parsed = parseSearch('boss is:Members -is:other is:');
    assert.deepEqual(parsed.words, ['boss']);
    assert.deepEqual(parsed.is, ['members']);
    assert.deepEqual(parsed.exclude.is, ['other']);
  });

  it('splits plain words, field terms and quoted phrases', () => {
    assert.deepEqual(parseSearch('boss title:cult channel:"Kanna Yanagi" fight'), {
      words: ['boss', 'fight'],
      title: ['cult'],
      channel: ['Kanna Yanagi'],
      date: [],
      comment: [],
      is: [],
      exclude: NONE,
    });
    assert.deepEqual(parseSearch('TITLE:Lamb Channel:x'), { words: [], title: ['Lamb'], channel: ['x'], date: [], comment: [], is: [], exclude: NONE }, 'field names ignore case');
    assert.deepEqual(parseSearch('title:"Cult of the Lamb"'), { words: [], title: ['Cult of the Lamb'], channel: [], date: [], comment: [], is: [], exclude: NONE });
  });

  it('ignores a field with nothing after it, and unterminated quotes still count', () => {
    assert.deepEqual(parseSearch('title:'), { words: [], title: [], channel: [], date: [], comment: [], is: [], exclude: NONE });
    assert.deepEqual(parseSearch('boss channel: '), { words: ['boss'], title: [], channel: [], date: [], comment: [], is: [], exclude: NONE });
    assert.deepEqual(parseSearch('title:""'), { words: [], title: [], channel: [], date: [], comment: [], is: [], exclude: NONE });
    assert.deepEqual(parseSearch('title:"half open'), { words: [], title: ['half open'], channel: [], date: [], comment: [], is: [], exclude: NONE });
  });

  it('only treats the exact field names as fields, and caps the number of terms', () => {
    assert.deepEqual(parseSearch('video:x mytitle:y'), { words: ['video:x', 'mytitle:y'], title: [], channel: [], date: [], comment: [], is: [], exclude: NONE });
    const many = parseSearch(Array.from({ length: 12 }, (_, i) => `w${i}`).join(' '));
    assert.equal(many.words.length, 8);
  });

  it('a leading minus on a field negates it, and leaves a bare -word alone', () => {
    assert.deepEqual(parseSearch('boss -title:cult -channel:"Kanna Yanagi" -date:2026-10 -5 title:x'), {
      words: ['boss', '-5'],
      title: ['x'],
      channel: [],
      date: [],
      comment: [],
      is: [],
      exclude: { title: ['cult'], channel: ['Kanna Yanagi'], date: ['2026-10'], comment: [], is: [] },
    });
    assert.deepEqual(parseSearch('-title: -channel:"" -date:'), { words: [], title: [], channel: [], date: [], comment: [], is: [], exclude: NONE }, 'empty negations are ignored');
    assert.deepEqual(parseSearch('-TITLE:Lamb').exclude.title, ['Lamb'], 'ignores case');
    assert.deepEqual(parseSearch('-video:x').words, ['-video:x'], 'only the real fields');
  });

  it('comment: is a field too, and can be negated', () => {
    assert.deepEqual(parseSearch('comment:boss -comment:"spoiler alert" Comment:fight comment:').comment, ['boss', 'fight']);
    assert.deepEqual(parseSearch('-comment:"spoiler alert"').exclude.comment, ['spoiler alert']);
    assert.deepEqual(parseSearch('comment:').comment, [], 'an empty one is ignored');
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

  it('comment: searches only the comment text, unlike a plain word', async () => {
    const session = await setup('sr6');
    assert.deepEqual(await guids(session, 'lamb'), ['a1', 'b1'], 'plain: a title match and a comment match');
    assert.deepEqual(await guids(session, 'comment:lamb'), ['b1'], 'only the comment that says it');
    assert.deepEqual(await guids(session, 'comment:boss'), ['a1']);
    assert.deepEqual(await guids(session, 'comment:"the boss"'), ['a1'], 'a phrase');
    assert.deepEqual(await guids(session, 'comment:cult'), [], 'not the title (a plain "cult" would find it)');
    assert.deepEqual(await guids(session, 'channel:kanna comment:nothing'), ['c1'], 'with another field');
    assert.deepEqual(await guids(session, '-comment:boss'), ['b1', 'c1']);
    assert.deepEqual(await guids(session, 'comment:lamb -comment:chat'), []);
    assert.deepEqual(await guids(session, 'comment:%'), [], 'wildcards are literal');
    assert.deepEqual(await guids(session, 'comment:'), ['a1', 'b1', 'c1'], 'an empty one is ignored');
  });

  it('-title: and -channel: leave out matches, and keep videos whose details are unknown', async () => {
    const session = await setup('sr5');
    const script = await h.login('sr5', 'sr5@example.com'); // same account: one more timestamp, on a video with no details
    await h.app.inject({
      method: 'POST',
      url: '/sync/push',
      headers: bearer(script.accessToken),
      payload: { deviceId: 'd2', records: [record('x1', 4, { video_id: 'blank', start: 40, comment: 'unknown video' })] },
    });
    assert.deepEqual(await guids(session, '-title:lamb'), ['b1', 'c1', 'x1']);
    assert.deepEqual(await guids(session, '-channel:kanna'), ['b1', 'x1']);
    assert.deepEqual(await guids(session, '-title:lamb -channel:other'), ['c1', 'x1'], 'negations combine');
    assert.deepEqual(await guids(session, 'channel:kanna -title:100%'), ['a1'], 'with a positive field');
    assert.deepEqual(await guids(session, 'lamb -title:lamb'), ['b1'], 'with a plain word: the comment mention, not the title');
    assert.deepEqual(await guids(session, '-title:%'), ['a1', 'b1', 'x1'], 'wildcards are literal');
    assert.deepEqual(await guids(session, '-title:'), ['a1', 'b1', 'c1', 'x1'], 'an empty negation is ignored');
    assert.deepEqual(await guids(session, '-channel:"kanna yanagi" -channel:"other channel"'), ['x1']);
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
