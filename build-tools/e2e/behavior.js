// Usage: node build-tools/e2e/behavior.js [bundle.js]   (default: dist/timekeeper.js)
// Asserts the highlighted row always equals the largest start <= current time,
// including after rows are edited/added from outside the cache.
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const BUNDLE = process.argv[2] || path.join(__dirname, '..', '..', 'dist', 'timekeeper.js');
const VIDEO = 'aqz-KE-bpKQ';
const URL = `https://www.youtube.com/watch?v=${VIDEO}`;
let failures = 0;
const check = (name, ok, detail) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : '  -> ' + JSON.stringify(detail)}`); if (!ok) failures++; };

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
  const page = await (await browser.newContext({ viewport: { width: 1400, height: 900 } })).newPage();
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
  await load();
  const STARTS = Array.from({ length: 40 }, (_, i) => 20 + i * 10); // 20,30,...,410
  await page.evaluate(async ({ starts, vid }) => {
    const db = await new Promise((res, rej) => { const r = indexedDB.open('ytls-timestamps-db'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
    const tx = db.transaction('timestamps_v2', 'readwrite');
    starts.forEach((s, i) => tx.objectStore('timestamps_v2').put({ guid: `t-${i}`, video_id: vid, start: s, comment: `c${i}`, write_counter: 1, device_id: 'test' }));
    await new Promise((res, rej) => { tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
    db.close();
  }, { starts: STARTS, vid: VIDEO });
  await load();
  await page.waitForTimeout(1000);

  const state = () => page.evaluate(() => {
    const hl = [...document.querySelectorAll('#ytls-pane li.ytls-timestamp-highlight')].map((li) => Number(li.querySelector('[data-time]').dataset.time));
    const all = [...document.querySelectorAll('#ytls-pane li')].map((li) => li.querySelector('[data-time]')).filter(Boolean).map((a) => Number(a.dataset.time));
    const t = Math.floor(document.getElementById('movie_player').getCurrentTime());
    const expected = Math.max(...all.filter((s) => s <= t), -Infinity);
    return { t, hl, expected: Number.isFinite(expected) ? expected : null };
  });
  const seekAndSettle = async (sec, play = true) => {
    await page.evaluate(([s, p]) => { const pl = document.getElementById('movie_player'); pl.seekTo(s, true); const v = document.querySelector('video'); p ? v.play().catch(() => {}) : v.pause(); }, [sec, play]);
    await page.waitForTimeout(1800);
  };

  // 1) highlight tracks playback after seeks (paused so t is stable)
  for (const sec of [5, 25, 95, 205, 411, 300]) {
    await seekAndSettle(sec, false);
    const s = await state();
    const ok = s.expected === null ? s.hl.length === 0 : (s.hl.length === 1 && s.hl[0] === s.expected);
    check(`seek to ${sec}s highlights nearest`, ok, s);
  }

  // 2) rows changed from outside the cache: edit a row's data-time while paused at 300s
  await seekAndSettle(300, false);
  const before = await state();
  await page.evaluate(() => {
    // find row with start 300 and move it to 305 (> t) so highlight must fall back to 290
    const a = [...document.querySelectorAll('#ytls-pane li [data-time]')].find((x) => x.dataset.time === '300');
    a.dataset.time = '305';
  });
  await page.evaluate(() => { document.querySelector('video').play().catch(() => {}); });
  await page.waitForTimeout(250);
  await page.evaluate(() => document.querySelector('video').pause());
  await page.waitForTimeout(1500);
  const edited = await state();
  check('after editing data-time 300->305 highlight falls back (was ' + before.hl + ')', edited.hl.length === 1 && edited.hl[0] === edited.expected, edited);

  // 3) add a brand-new row (clone) with start 301 while time is ~300-301s
  await seekAndSettle(302, false);
  await page.evaluate(() => {
    const src = [...document.querySelectorAll('#ytls-pane li')].find((li) => li.querySelector('[data-time]')?.dataset.time === '290');
    const clone = src.cloneNode(true);
    clone.querySelector('[data-time]').dataset.time = '301';
    src.parentElement.appendChild(clone);
  });
  await page.evaluate(() => { document.querySelector('video').play().catch(() => {}); });
  await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelector('video').pause());
  await page.waitForTimeout(1500);
  const added = await state();
  check('after appending row @301 highlight moves to 301', added.hl.length === 1 && added.hl[0] === 301 && added.expected === 301, added);

  // 4) removing the highlighted row clears/moves highlight
  await page.evaluate(() => { [...document.querySelectorAll('#ytls-pane li')].find((li) => li.querySelector('[data-time]')?.dataset.time === '301').remove(); });
  await page.evaluate(() => { document.querySelector('video').play().catch(() => {}); });
  await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelector('video').pause());
  await page.waitForTimeout(1500);
  const removed = await state();
  check('after removing highlighted row highlight falls back', removed.hl.length === 1 && removed.hl[0] === removed.expected, removed);

  // 5) uninterrupted playback: highlight advances as time crosses boundaries
  await seekAndSettle(58, true);
  const samples = [];
  for (let i = 0; i < 6; i++) { samples.push(await state()); await page.waitForTimeout(1000); }
  const bad = samples.filter((s) => s.hl.length !== 1 || s.hl[0] !== s.expected);
  check('playback across 60s boundary keeps highlight correct (6 samples)', bad.length === 0, bad);

  // 6) seekbar markers: count, stylesheet-driven look, position, delegated click-to-seek
  await load();
  await page.waitForTimeout(1500);
  const mk = await page.evaluate(() => {
    const dur = document.getElementById('movie_player').getDuration();
    const markers = [...document.querySelectorAll('.ytp-progress-bar .ytls-marker')];
    const rows = document.querySelectorAll('#ytls-pane li [data-time]').length;
    const cs = markers[0] ? getComputedStyle(markers[0]) : null;
    const leftOk = markers.every((m) => Math.abs(parseFloat(m.style.left) - (Number(m.dataset.time) / dur) * 100) < 0.001);
    const inlineLooks = markers.some((m) => m.style.position || m.style.width || m.style.backgroundColor);
    return { dur, count: markers.length, rows, leftOk, inlineLooks,
      position: cs && cs.position, width: cs && cs.width, bg: cs && cs.backgroundColor, cursor: cs && cs.cursor,
      bound: document.querySelector('.ytp-progress-bar').dataset.ytlsMarkerClicks };
  });
  check('marker count equals row count', mk.count === mk.rows && mk.count === 40, mk);
  check('marker look comes from stylesheet (absolute, 2px, red, pointer, no inline look)', mk.position === 'absolute' && mk.width === '2px' && mk.bg === 'rgb(255, 0, 0)' && mk.cursor === 'pointer' && !mk.inlineLooks, mk);
  check('marker left% matches start/duration', mk.leftOk, mk);
  check('click handler bound exactly once via dataset flag', mk.bound === '1', mk);
  await page.evaluate(() => { document.querySelector('video').pause(); document.getElementById('movie_player').seekTo(5, true); });
  await page.waitForTimeout(1200);
  await page.evaluate(() => { const m = [...document.querySelectorAll('.ytp-progress-bar .ytls-marker')].find((x) => x.dataset.time === '210'); m.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  await page.waitForTimeout(1500);
  const afterClick = await page.evaluate(() => Math.round(document.getElementById('movie_player').getCurrentTime()));
  check('clicking marker @210 seeks player to ~210s', Math.abs(afterClick - 210) <= 3, { afterClick });
  // rebuild after a row change must not double-bind or duplicate markers
  await page.evaluate(() => { const a = document.querySelector('#ytls-pane li [data-time]'); a.dataset.time = String(Number(a.dataset.time) + 1); });
  const rebuilt = await page.evaluate(() => document.querySelectorAll('.ytp-progress-bar .ytls-marker').length);
  check('marker count stable (40) when rows unchanged in number', rebuilt === 40, { rebuilt });

  // 7) header icons inlined as data URIs: render, no GitHub fetch, hover swap works
  const ic = await page.evaluate(async () => {
    const btn = document.getElementById('ytls-header-button');
    const img = btn && btn.querySelector('img');
    if (!img) return { found: false };
    const before = { isData: img.src.startsWith('data:image/png;base64,'), w: img.naturalWidth, complete: img.complete, src: img.src.slice(-24) };
    btn.dispatchEvent(new MouseEvent('mouseenter'));
    await new Promise((r) => setTimeout(r, 300));
    const hover = { w: img.naturalWidth, srcChanged: img.src.slice(-24) !== before.src, isData: img.src.startsWith('data:image/png;base64,') };
    btn.dispatchEvent(new MouseEvent('mouseleave'));
    return { found: true, before, hover, githubRequests: performance.getEntriesByType('resource').filter((e) => e.name.includes('raw.githubusercontent.com') && e.name.endsWith('.png')).length };
  });
  check('header icon is an inline data URI and decodes', ic.found && ic.before.isData && ic.before.w > 0 && ic.before.complete, ic);
  check('hover swaps to the other inline icon and decodes', ic.found && ic.hover.isData && ic.hover.srcChanged && ic.hover.w > 0, ic);
  check('no icon PNGs requested from raw.githubusercontent.com', ic.found && ic.githubRequests === 0, ic);

  // 8) live-stream display paths, with a mocked player (deterministic, no live stream needed)
  const liveSnap = () => page.evaluate(() => {
    const e = [...document.querySelectorAll('#ytls-pane span')].find((s) => /^\d+:\d\d(:\d\d)?/.test(s.textContent.trim()));
    return e ? { text: e.textContent.slice(0, 24), color: e.style.color, cursor: e.style.cursor } : null;
  });
  const before8 = await liveSnap();
  check('VOD: time display cursor is default, no red', before8 && before8.cursor === 'default' && before8.color === '', before8);
  await page.evaluate(() => {
    const p = document.getElementById('movie_player');
    window.__orig = { gv: p.getVideoData, gp: p.getProgressState };
    window.__liveCur = 900;
    p.getVideoData = () => ({ isLive: true, video_id: 'mock' });
    p.getProgressState = () => ({ seekableEnd: 1000, current: window.__liveCur, isAtLiveHead: window.__liveCur >= 998 });
    document.querySelector('video').play().catch(() => {});
  });
  await page.waitForTimeout(2500);
  const behind = await liveSnap();
  check('live + 100s behind edge: cursor pointer and time is red', behind && behind.cursor === 'pointer' && behind.color === 'rgb(255, 77, 79)', behind);
  await page.evaluate(() => { window.__liveCur = 999; });
  await page.waitForTimeout(2500);
  const atEdge = await liveSnap();
  check('live + at edge: cursor pointer and red cleared', atEdge && atEdge.cursor === 'pointer' && atEdge.color === '', atEdge);
  await page.evaluate(() => { const p = document.getElementById('movie_player'); p.getVideoData = window.__orig.gv; p.getProgressState = window.__orig.gp; document.querySelector('video').pause(); });
  await page.waitForTimeout(2500);
  const restored = await liveSnap();
  check('back to VOD: cursor default and no red', restored && restored.cursor === 'default' && restored.color === '', restored);
  // speed label: set a rate and confirm the display + aria follow, then return to 1x
  await page.evaluate(() => { document.getElementById('movie_player').setPlaybackRate(1.5); });
  await page.waitForTimeout(1500);
  const sp1 = await page.evaluate(() => { const s = document.getElementById('ytls-playback-speed'); return { text: s.textContent, aria: s.getAttribute('aria-label'), data: s.dataset.speed }; });
  check('speed display follows 1.5x (text + aria-label)', sp1.text === '1.5x' && /1\.5x/.test(sp1.aria) && sp1.data === '1.5', sp1);
  await page.evaluate(() => { document.getElementById('movie_player').setPlaybackRate(1); });
  await page.waitForTimeout(1500);
  const sp2 = await page.evaluate(() => { const s = document.getElementById('ytls-playback-speed'); return { text: s.textContent, aria: s.getAttribute('aria-label') }; });
  check('speed display returns to 1x', sp2.text === '1x' && /1x/.test(sp2.aria), sp2);

  console.log(failures ? `\n${failures} FAILURE(S)` : '\nALL PASSED');
  await browser.close();
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error('FAILED', e); process.exit(2); });
