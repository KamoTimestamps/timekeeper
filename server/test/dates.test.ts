import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { bearer, createHarness, record, testConfig, type TestHarness } from './helpers.ts';
import { dateRange, isTimeZone } from '../src/dates.ts';
import { parseSearch } from '../src/search.ts';

const ORIGIN = testConfig.publicOrigin;
const COOKIE = '__Host-tk_web';

describe('date terms', () => {
  it('covers a day, a month or a year, in UTC by default', () => {
    assert.deepEqual(dateRange('2026-10-25'), { from: '2026-10-25T00:00:00Z', to: '2026-10-26T00:00:00Z' });
    assert.deepEqual(dateRange('2026-10'), { from: '2026-10-01T00:00:00Z', to: '2026-11-01T00:00:00Z' });
    assert.deepEqual(dateRange('2026'), { from: '2026-01-01T00:00:00Z', to: '2027-01-01T00:00:00Z' });
    assert.deepEqual(dateRange('2026-12-31'), { from: '2026-12-31T00:00:00Z', to: '2027-01-01T00:00:00Z' }, 'rolls into the next year');
    assert.deepEqual(dateRange('2028-02-29'), { from: '2028-02-29T00:00:00Z', to: '2028-03-01T00:00:00Z' }, 'leap day');
  });

  it('includes both ends of a range, and allows an open end', () => {
    assert.deepEqual(dateRange('2026-10-01..2026-10-25'), { from: '2026-10-01T00:00:00Z', to: '2026-10-26T00:00:00Z' });
    assert.deepEqual(dateRange('2026-01..2026-03'), { from: '2026-01-01T00:00:00Z', to: '2026-04-01T00:00:00Z' }, 'months count whole');
    assert.deepEqual(dateRange('2026-10-25..'), { from: '2026-10-25T00:00:00Z', to: null });
    assert.deepEqual(dateRange('..2026-10-25'), { from: null, to: '2026-10-26T00:00:00Z' });
    assert.deepEqual(dateRange('2026-10-25..2026-10-25'), dateRange('2026-10-25'));
  });

  it('ignores what is not a real date or range', () => {
    for (const term of ['', 'abc', '2026-1', '2026-13-01', '2026-02-30', '2027-02-29', '2026-00', '2026-10-00', '..', '2026-10-25..2026-10-01', '1..2..3', '2026/10/25']) {
      assert.equal(dateRange(term), null, term);
    }
  });

  it('counts days in the viewer’s own time zone, including across daylight saving changes', () => {
    assert.deepEqual(dateRange('2026-10-25', 'Asia/Tokyo'), { from: '2026-10-24T15:00:00Z', to: '2026-10-25T15:00:00Z' });
    assert.deepEqual(dateRange('2026-03-08', 'America/New_York'), { from: '2026-03-08T05:00:00Z', to: '2026-03-09T04:00:00Z' }, '23-hour day');
    assert.deepEqual(dateRange('2026-11-01', 'America/New_York'), { from: '2026-11-01T04:00:00Z', to: '2026-11-02T05:00:00Z' }, '25-hour day');
    assert.deepEqual(dateRange('2026-10-25', 'Not/AZone'), dateRange('2026-10-25'), 'an unknown zone falls back to UTC');
    assert.equal(isTimeZone('Asia/Tokyo'), true);
    assert.equal(isTimeZone('Not/AZone'), false);
  });

  it('is parsed out of the query like the other fields', () => {
    assert.deepEqual(parseSearch('boss date:2026-10-01..2026-10-25 DATE:2026'), {
      words: ['boss'],
      title: [],
      channel: [],
      date: ['2026-10-01..2026-10-25', '2026'],
      comment: [],
      exclude: { title: [], channel: [], date: [], comment: [] },
    });
    assert.deepEqual(parseSearch('date:').date, []);
  });
});

describe('date search (web)', () => {
  let h: TestHarness;
  before(async () => {
    h = await createHarness();
  });
  after(async () => {
    await h.app.close();
  });

  const aired = (publishedAt: string | null) => ({ title: 't', channelTitle: 'c', thumbnailUrl: null, publishedAt, durationSeconds: null });
  const session = async () => {
    const script = await h.login('dt1', 'dt1@example.com');
    await h.app.inject({
      method: 'POST',
      url: '/sync/push',
      headers: bearer(script.accessToken),
      payload: {
        deviceId: 'd',
        records: [record('early', 1, { video_id: 'v1', start: 5 }), record('mid', 2, { video_id: 'v2', start: 5 }), record('late', 3, { video_id: 'v3', start: 5 }), record('none', 4, { video_id: 'v4', start: 5 })],
      },
    });
    h.store.saveVideoInfo(
      [
        { videoId: 'v1', info: aired('2026-10-24T20:30:00Z') },
        { videoId: 'v2', info: aired('2026-10-25T10:00:00Z') },
        { videoId: 'v3', info: aired('2026-11-02T00:00:00Z') },
        { videoId: 'v4', info: null },
      ],
      Date.now(),
    );
    const login = await h.app.inject({ method: 'POST', url: '/web/login', headers: { origin: ORIGIN }, payload: { idToken: await h.idToken({ sub: 'dt1', email: 'dt1@example.com' }) } });
    return { cookie: `${COOKIE}=${login.cookies.find((c) => c.name === COOKIE)!.value}` };
  };
  const guids = async (headers: Record<string, string>, q: string, tz?: string) => {
    const url = `/web/timestamps?q=${encodeURIComponent(q)}${tz ? `&tz=${encodeURIComponent(tz)}` : ''}`;
    return ((await h.app.inject({ method: 'GET', url, headers })).json().items as Array<{ guid: string }>).map((i) => i.guid).sort();
  };

  it('filters by the video’s air date, for a day, a range, and open ranges', async () => {
    const s = await session();
    assert.deepEqual(await guids(s, 'date:2026-10-25'), ['mid']);
    assert.deepEqual(await guids(s, 'date:2026-10'), ['early', 'mid']);
    assert.deepEqual(await guids(s, 'date:2026-10-24..2026-11-02'), ['early', 'late', 'mid']);
    assert.deepEqual(await guids(s, 'date:2026-10-25..'), ['late', 'mid']);
    assert.deepEqual(await guids(s, 'date:..2026-10-24'), ['early']);
    assert.deepEqual(await guids(s, 'date:2026-10 date:2026-10-25'), ['mid'], 'terms combine');
    assert.deepEqual(await guids(s, 'date:1999'), []);
  });

  it('-date: leaves out a day, month or range, and keeps videos with no date', async () => {
    const s = await session();
    assert.deepEqual(await guids(s, '-date:2026-10-25'), ['early', 'late', 'none']);
    assert.deepEqual(await guids(s, '-date:2026-10'), ['late', 'none']);
    assert.deepEqual(await guids(s, '-date:2026-10-25..'), ['early', 'none'], 'open end');
    assert.deepEqual(await guids(s, '-date:..2026-10-24'), ['late', 'mid', 'none'], 'open start');
    assert.deepEqual(await guids(s, 'date:2026-10 -date:2026-10-25'), ['early'], 'a month except one day');
    assert.deepEqual(await guids(s, '-date:2026-10-25', 'Asia/Tokyo'), ['late', 'none'], 'in the viewer’s time zone');
    assert.deepEqual(await guids(s, '-date:nonsense'), ['early', 'late', 'mid', 'none'], 'a bad term is ignored');
  });

  it('keeps a video without details out of any date filter, and ignores a bad term', async () => {
    const s = await session();
    assert.ok(!(await guids(s, 'date:2000..2100')).includes('none'));
    assert.deepEqual(await guids(s, 'date:nonsense'), ['early', 'late', 'mid', 'none'], 'ignored, so everything matches');
  });

  it('reads the day in the viewer’s time zone', async () => {
    const s = await session();
    assert.deepEqual(await guids(s, 'date:2026-10-25', 'UTC'), ['mid']);
    assert.deepEqual(await guids(s, 'date:2026-10-25', 'Asia/Tokyo'), ['early', 'mid'], '20:30Z on the 24th is already the 25th in Tokyo');
    assert.deepEqual(await guids(s, 'date:2026-10-25', 'Pacific/Kiritimati'), ['early'], 'UTC+14: the 25th ends at 10:00Z, which is the 26th there');
    assert.deepEqual(await guids(s, 'date:2026-10-25', 'Bogus/Zone'), ['mid'], 'an unknown zone falls back to UTC');
  });
});
