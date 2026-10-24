// Usage: node build-tools/e2e/storage-resilience.js [bundle.js]   (default: dist/timekeeper.js)
// Checks that timestamp data survives page transitions and that stale views / flaky sync
// can't lose it:
//   - typed-but-unsaved comments are flushed on yt-navigate-start, pagehide, visibilitychange
//   - UI edits are row-level: a pane that hasn't seen a row yet can't tombstone it
//   - "clear all" can't be undone by a pending comment save
//   - one corrupt stored row doesn't hide the rest of the video's timestamps
//   - a failed Drive listing aborts the backup instead of uploading a duplicate remote file
//   - a DB upgrade requested by another tab isn't blocked by this tab's open connection
// Run it against an older bundle to confirm each check can fail.
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const BUNDLE = process.argv[2] || path.join(__dirname, '..', '..', 'dist', 'timekeeper.js');
const VIDEO = 'aqz-KE-bpKQ';
const URL = `https://www.youtube.com/watch?v=${VIDEO}`;
let failures = 0;
const check = (name, ok, detail) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : '  -> ' + JSON.stringify(detail)}`); if (!ok) failures++; };

const row = (guid, start, comment, extra = {}) => ({ guid, video_id: VIDEO, start, comment, write_counter: 1, device_id: 'test', ...extra });
const GOOD_ROWS = () => [row('a1', 20, 'A'), row('b1', 60, 'B')];

const openDb = `new Promise((res, rej) => { const r = indexedDB.open('ytls-timestamps-db'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); })`;

async function newSession(browser, { rows = GOOD_ROWS(), settings = [], prepare } = {}) {
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.GM = { getValue: async (k, d) => d, setValue: async () => {}, setClipboard: () => {}, xmlHttpRequest: () => {} };
    window.GM_info = { script: { version: 'test' } };
  });
  await page.addInitScript({ content: fs.readFileSync(BUNDLE, 'utf8') });
  const load = async () => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    try { await page.getByRole('button', { name: /accept all|reject all/i }).first().click({ timeout: 3000 }); } catch {}
    await page.waitForSelector('#ytls-pane', { timeout: 30000 });
    await page.waitForSelector('#movie_player video', { timeout: 30000 });
    await page.waitForTimeout(3000);
  };
  await load(); // first load creates the database
  await page.evaluate(async ({ rows, settings, openDb }) => {
    const db = await eval(openDb);
    const tx = db.transaction(['timestamps_v2', 'settings'], 'readwrite');
    rows.forEach((r) => tx.objectStore('timestamps_v2').put(r));
    settings.forEach((s) => tx.objectStore('settings').put(s));
    await new Promise((res, rej) => { tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
    db.close();
  }, { rows, settings, openDb });
  if (prepare) await prepare(context, page);
  await load();
  return { context, page };
}

const dbGet = (page, store, key) => page.evaluate(async ({ store, key, openDb }) => {
  const db = await eval(openDb);
  const v = await new Promise((res, rej) => { const r = db.transaction(store).objectStore(store).get(key); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  db.close();
  return v ?? null;
}, { store, key, openDb });
const getRow = (page, guid) => dbGet(page, 'timestamps_v2', guid);
const isLive = (r) => !!r && !r.deleted_at;

const typeIntoFirstRow = (page, text) => page.locator('#ytls-pane li input').first().fill(text);

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio'] });

  // 1-3) Pending comment edits are persisted by page-lifecycle events, before the debounce fires
  const lifecycle = [
    ['yt-navigate-start', () => window.dispatchEvent(new Event('yt-navigate-start'))],
    ['pagehide', () => window.dispatchEvent(new Event('pagehide'))],
    ['visibilitychange to hidden', () => {
      Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
      document.dispatchEvent(new Event('visibilitychange'));
    }],
  ];
  for (const [name, fire] of lifecycle) {
    const { context, page } = await newSession(browser);
    await typeIntoFirstRow(page, `typed-${name}`);
    await page.evaluate(fire);
    await page.waitForTimeout(150); // well inside the 500ms debounce
    const early = await getRow(page, 'a1');
    check(`${name}: pending comment is flushed immediately`, early?.comment === `typed-${name}`, early);
    await page.waitForTimeout(1200);
    const late = await getRow(page, 'a1');
    check(`${name}: comment is still saved after the debounce window`, late?.comment === `typed-${name}`, late);
    await context.close();
  }

  // 4) A pane that hasn't seen a row yet must not tombstone it (row-level saves)
  {
    const { context, page } = await newSession(browser);
    // Simulates another tab or a sync merge adding a row this pane hasn't loaded
    await page.evaluate(async ({ openDb, r }) => {
      const db = await eval(openDb);
      const tx = db.transaction('timestamps_v2', 'readwrite');
      tx.objectStore('timestamps_v2').put(r);
      await new Promise((res, rej) => { tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
      db.close();
    }, { openDb, r: row('c1', 100, 'C', { write_counter: 5 }) });
    // Alt+click on a row's "+" shifts every row the pane shows by +1s (a bulk edit)
    await page.evaluate(() => {
      const plus = document.querySelector('#ytls-pane li [data-increment="1"]');
      plus.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, altKey: true }));
    });
    await page.waitForTimeout(1000);
    const [a1, b1, c1] = await Promise.all(['a1', 'b1', 'c1'].map((g) => getRow(page, g)));
    check('bulk offset saved the shifted rows', a1?.start === 21 && b1?.start === 61, { a1, b1 });
    check('bulk offset did not tombstone a row the pane had not loaded', isLive(c1) && c1.start === 100, c1);
    await context.close();
  }

  // 5) "Clear all" can't be undone by a pending comment save
  {
    const { context, page } = await newSession(browser);
    await typeIntoFirstRow(page, 'typed-before-clear');
    await page.evaluate(() => {
      const li = document.querySelector('#ytls-pane li');
      const btn = document.createElement('button');
      btn.dataset.action = 'clear';
      li.parentElement.appendChild(btn);
      btn.click();
    });
    await page.waitForTimeout(1500);
    const [a1, b1] = await Promise.all(['a1', 'b1'].map((g) => getRow(page, g)));
    check('clear all tombstones every row', !isLive(a1) && !isLive(b1), { a1, b1 });
    await context.close();
  }

  // 6) One corrupt stored row doesn't hide the video's other timestamps
  {
    const { context, page } = await newSession(browser, { rows: [...GOOD_ROWS(), row('bad', -5, 'negative start')] });
    const shown = await page.evaluate(() => [...document.querySelectorAll('#ytls-pane li [data-time]')].length);
    check('valid rows still load next to a corrupt row', shown === 2, { shown });
    await context.close();
  }

  // 7) Drive sync fails closed: a failed listing must not upload a second remote file
  const driveSettings = [
    { key: 'googleAuthState', value: { isSignedIn: true, accessToken: 'tok', userName: 'tester', email: 'tester@example.com' } },
    { key: 'autoBackupEnabled', value: true },
    { key: 'autoBackupIntervalMinutes', value: 5 },
  ];
  for (const mode of ['listing-fails', 'no-remote-file']) {
    const calls = [];
    const { context, page } = await newSession(browser, {
      settings: driveSettings,
      prepare: async (ctx) => {
        await ctx.route(/googleapis\.com/, (route) => {
          const req = route.request();
          const u = new globalThis.URL(req.url());
          const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' };
          const json = (status, body) => route.fulfill({ status, headers: { ...cors, 'content-type': 'application/json' }, body: JSON.stringify(body) });
          if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
          calls.push(`${req.method()} ${u.pathname}`);
          const q = u.searchParams.get('q') || '';
          if (u.pathname.startsWith('/upload/')) return json(200, { id: 'up1', name: 'timekeeper-data.zip' });
          if (u.pathname === '/oauth2/v2/userinfo') return json(200, {});
          if (u.pathname === '/drive/v3/files' && q.includes('vnd.google-apps.folder')) return json(200, { files: [{ id: 'folder1', name: 'Timekeeper' }] });
          if (u.pathname === '/drive/v3/files' && q.includes('timekeeper-data.zip')) {
            return mode === 'listing-fails' ? json(500, { error: 'boom' }) : json(200, { files: [] });
          }
          return json(404, {});
        });
      },
    });
    await page.waitForTimeout(6000);
    const uploads = calls.filter((c) => c.includes('/upload/'));
    const last = await dbGet(page, 'settings', 'lastAutoBackupAt');
    if (mode === 'listing-fails') {
      check('failed Drive listing: no upload is attempted', uploads.length === 0, { calls });
      check('failed Drive listing: backup is not recorded as done', !last?.value, last);
    } else {
      check('no remote file yet: exactly one upload is made', uploads.length === 1, { calls });
      check('successful upload is recorded as a backup', typeof last?.value === 'number', last);
    }
    await context.close();
  }

  // 8) A DB upgrade requested by another tab isn't blocked by this tab (run last: it bumps the version)
  {
    const { context, page } = await newSession(browser);
    const result = await page.evaluate(() => new Promise((res) => {
      const timer = setTimeout(() => res('blocked'), 4000);
      const req = indexedDB.open('ytls-timestamps-db', 5);
      req.onupgradeneeded = () => {};
      req.onsuccess = () => { clearTimeout(timer); req.result.close(); res('upgraded'); };
      req.onerror = () => { clearTimeout(timer); res('error'); };
    }));
    check('DB upgrade from another tab is not blocked', result === 'upgraded', { result });
    await context.close();
  }

  await browser.close();
  console.log(failures ? `\n${failures} FAILED` : '\nALL PASSED');
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error('FAILED', e); process.exit(1); });
