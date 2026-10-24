// Usage: node build-tools/e2e/bench.js [bundle.js] [rows=600] [seconds=15] [videoId]
// (bundle default: dist/timekeeper.js; build one with build-profile-bundle.js for readable function names)
// Measures main-thread time spent inside the Timekeeper bundle's call stacks (inclusive).
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const BUNDLE = process.argv[2] || path.join(__dirname, '..', '..', 'dist', 'timekeeper.js');
const ROWS = Number(process.argv[3] || 600);
const SECONDS = Number(process.argv[4] || 15);
const VIDEO = process.argv[5] || 'aqz-KE-bpKQ';
const URL = `https://www.youtube.com/watch?v=${VIDEO}`;

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    window.GM = { getValue: async (k, d) => d, setValue: async () => {}, setClipboard: () => {}, xmlHttpRequest: () => {} };
    window.GM_info = { script: { version: 'bench' } };
  });
  const code = fs.readFileSync(BUNDLE, 'utf8') + '\n//# sourceURL=tk-bundle.js\n';
  await page.addInitScript({ content: code });

  const gotoReady = async () => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    try { await page.getByRole('button', { name: /accept all|reject all/i }).first().click({ timeout: 3000 }); } catch {}
    await page.waitForSelector('#movie_player video', { timeout: 30000 });
    await page.waitForSelector('#ytls-pane', { timeout: 30000 });
    await page.waitForTimeout(3000);
  };

  // First load creates the DB; then seed rows and reload.
  await gotoReady();
  const title = await page.title();
  const duration = await page.evaluate(() => document.getElementById('movie_player').getDuration());
  const seeded = await page.evaluate(async ({ rows, vid, dur }) => {
    const db = await new Promise((res, rej) => { const r = indexedDB.open('ytls-timestamps-db'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
    const tx = db.transaction('timestamps_v2', 'readwrite');
    const st = tx.objectStore('timestamps_v2');
    for (let i = 0; i < rows; i++) {
      st.put({ guid: `bench-${vid}-${i}`, video_id: vid, start: Math.floor((i / rows) * (dur - 5)), comment: `Benchmark timestamp ${i} lorem ipsum`, write_counter: 1, device_id: 'bench' });
    }
    await new Promise((res, rej) => { tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
    db.close();
    return rows;
  }, { rows: ROWS, vid: VIDEO, dur: duration });
  await gotoReady();
  await page.waitForTimeout(1500);
  const rowCount = await page.evaluate(() => document.querySelectorAll('#ytls-pane li').length);

  // Start playback from t=30 and profile.
  await page.evaluate(() => { const p = document.getElementById('movie_player'); p.seekTo(30, true); document.querySelector('video').play().catch(() => {}); });
  await page.waitForTimeout(2000);
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Profiler.enable');
  await cdp.send('Profiler.setSamplingInterval', { interval: 200 });
  await cdp.send('Profiler.start');
  let tkLogs = 0;
  page.on('console', (m) => { if (m.text().includes('[Timekeeper')) tkLogs++; });
  const t0 = Date.now();
  await page.waitForTimeout(SECONDS * 1000);
  const wall = Date.now() - t0;
  const { profile } = await cdp.send('Profiler.stop');

  // Aggregate: self time of nodes inside a tk-bundle.js stack (inclusive of native children).
  const nodes = new Map(profile.nodes.map((n) => [n.id, n]));
  const parent = new Map();
  for (const n of profile.nodes) for (const c of n.children || []) parent.set(c, n.id);
  const inBundle = new Map();
  const isIn = (id) => {
    if (inBundle.has(id)) return inBundle.get(id);
    const n = nodes.get(id);
    const v = (n.callFrame.url || '').includes('tk-bundle.js') || (parent.has(id) && isIn(parent.get(id)));
    inBundle.set(id, v);
    return v;
  };
  const selfByNode = new Map();
  for (let i = 0; i < profile.samples.length; i++) {
    const id = profile.samples[i];
    selfByNode.set(id, (selfByNode.get(id) || 0) + (profile.timeDeltas[i] || 0));
  }
  let bundleUs = 0, totalUs = 0, idleUs = 0;
  const byFn = new Map();
  for (const [id, us] of selfByNode) {
    const name = nodes.get(id).callFrame.functionName;
    totalUs += us;
    if (name === '(idle)') { idleUs += us; continue; }
    if (isIn(id)) {
      bundleUs += us;
      // attribute to nearest bundle frame
      let cur = id; while (cur && !(nodes.get(cur).callFrame.url || '').includes('tk-bundle.js')) cur = parent.get(cur);
      const cf = nodes.get(cur || id).callFrame;
      const key = `${cf.functionName || '(anon)'}@${cf.lineNumber}:${cf.columnNumber}`;
      byFn.set(key, (byFn.get(key) || 0) + us);
    }
  }
  const top = [...byFn.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${(v / 1000).toFixed(1)}ms ${k}`);
  const out = {
    title: title.slice(0, 40), duration: Math.round(duration), rowsSeeded: seeded, rowsInDom: rowCount, wallSeconds: +(wall / 1000).toFixed(1),
    bundleMsTotal: +(bundleUs / 1000).toFixed(1),
    bundleMsPerSecond: +(bundleUs / 1000 / (wall / 1000)).toFixed(2),
    busyPctOfMainThread: +(((totalUs - idleUs) / totalUs) * 100).toFixed(1),
    timekeeperConsoleLogsDuringPlayback: tkLogs,
    topBundleFrames: top,
  };
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})().catch((e) => { console.error('FAILED', e); process.exit(1); });
