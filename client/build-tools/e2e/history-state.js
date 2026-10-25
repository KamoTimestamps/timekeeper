const { chromium } = require('playwright-core');
const fs = require('fs');
// Usage: node build-tools/e2e/history-state.js [bundle.js]
// Checks YouTube's player API surface and that Timekeeper preserves history.state on play/pause.

const BUNDLE = process.argv[2];
const URL = 'https://www.youtube.com/watch?v=jNQXAC9IVRw';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const logs = [];
  page.on('console', (m) => { const t = m.text(); if (t.includes('Timekeeper')) logs.push(t.slice(0, 160)); });
  page.on('pageerror', (e) => logs.push('PAGEERROR ' + String(e).slice(0, 200)));

  // Run bundle in MAIN world at document-start (like the extension), with GM stubs.
  await page.addInitScript(() => {
    window.GM = { getValue: async (k, d) => d, setValue: async () => {}, setClipboard: () => {}, xmlHttpRequest: () => {} };
    window.GM_info = { script: { version: 'test' } };
    window.__jsonParseNative = JSON.parse.toString().includes('[native code]');
  });
  if (BUNDLE) await page.addInitScript({ content: fs.readFileSync(BUNDLE, 'utf8') });

  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  // Consent wall?
  try { await page.getByRole('button', { name: /accept all|reject all/i }).first().click({ timeout: 4000 }); } catch {}
  await page.waitForSelector('#movie_player video', { timeout: 30000 });
  await page.waitForTimeout(6000);

  const out = {};
  out.title = await page.title();
  out.jsonParseNativeAtStart = await page.evaluate(() => window.__jsonParseNative);
  out.jsonParseNativeNow = await page.evaluate(() => JSON.parse.toString().includes('[native code]'));
  out.tkPane = await page.evaluate(() => !!document.getElementById('ytls-pane'));

  out.playerMethods = await page.evaluate(() => {
    const p = document.getElementById('movie_player');
    const names = ['getCurrentTime','seekTo','getPlayerState','seekToLiveHead','getVideoData','getDuration','setPlaybackRate','getProgressState'];
    const r = {};
    for (const n of names) r[n] = typeof p[n];
    try { r.progressStateKeys = Object.keys(p.getProgressState()); } catch (e) { r.progressStateKeys = String(e); }
    try { const vd = p.getVideoData(); r.videoDataKeys = Object.keys(vd); r.isLive = vd.isLive; } catch (e) { r.videoData = String(e); }
    return r;
  });

  // #2: SPA-navigate so YouTube populates history.state, then pause.
  out.stateAfterDirectLoad = await page.evaluate(() => history.state === null ? null : Object.keys(history.state));
  const hrefs = await page.evaluate(() => [...document.querySelectorAll('a[href^="/watch?v="]')].map((a) => a.getAttribute('href')).filter((h) => !h.includes('jNQXAC9IVRw')));
  out.relatedLinkCount = hrefs.length;
  if (hrefs.length) {
    await page.evaluate((h) => document.querySelector(`a[href="${h}"]`).click(), hrefs[0]);
    await page.waitForFunction(() => !location.href.includes('jNQXAC9IVRw'), null, { timeout: 15000 });
    await page.waitForTimeout(6000);
  }
  out.navigatedTo = await page.evaluate(() => location.href);
  out.tkPaneAfterNav = await page.evaluate(() => !!document.getElementById('ytls-pane'));
  await page.evaluate(() => document.querySelector('video').play().catch(() => {}));
  await page.waitForTimeout(2500);
  out.stateBeforePause = await page.evaluate(() => ({ keys: Object.keys(history.state || {}), hasEndpoint: !!(history.state && history.state.endpoint) }));
  await page.evaluate(() => document.querySelector('video').pause());
  await page.waitForTimeout(1500);
  out.urlAfterPause = await page.evaluate(() => location.href);
  out.stateAfterPause = await page.evaluate(() => ({ keys: Object.keys(history.state || {}), hasEndpoint: !!(history.state && history.state.endpoint) }));

  out.logs = logs.slice(0, 15);
  console.log(JSON.stringify(out, null, 2));
  await browser.close();
})().catch((e) => { console.error('FAILED', e); process.exit(1); });
