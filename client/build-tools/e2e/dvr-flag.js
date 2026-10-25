const { chromium } = require('playwright-core');
const fs = require('fs');
// Usage: node build-tools/e2e/dvr-flag.js [bundle.js] [url]
// Checks the ytcfg hook installs and html5_max_live_dvr_window_plus_margin_secs is lifted to 604800.

const BUNDLE = process.argv[2];
const URL = process.argv[3] || 'https://www.youtube.com/watch?v=jNQXAC9IVRw';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--mute-audio'] });
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  await page.addInitScript(() => {
    window.GM = { getValue: async (k, d) => d, setValue: async () => {}, setClipboard: () => {}, xmlHttpRequest: () => {} };
    window.GM_info = { script: { version: 'test' } };
    window.__ytcfgTrace = [];
  });
  if (BUNDLE) await page.addInitScript({ content: fs.readFileSync(BUNDLE, 'utf8') });
  await page.addInitScript(() => {
    if (window !== window.top) return;
    const d = Object.getOwnPropertyDescriptor(window, 'ytcfg');
    window.__ytcfgTrace.push({ t: 'afterBundle', descriptor: d ? Object.keys(d).join(',') : null });
  });
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#movie_player video', { timeout: 30000 });
  await page.waitForTimeout(4000);
  const out = await page.evaluate(() => {
    const d = Object.getOwnPropertyDescriptor(window, 'ytcfg');
    const c = window.ytcfg;
    const flags = Object.values((c.d().WEB_PLAYER_CONTEXT_CONFIGS) || {}).map((x) => ((x.serializedExperimentFlags || '').match(/html5_max_live_dvr_window_plus_margin_secs=[\d.]+/) || ['absent'])[0]);
    return {
      trace: window.__ytcfgTrace,
      descriptor: d ? Object.keys(d).join(',') : null,
      dvrHooked: c.__dvrHooked, dvrCapLifted: c.__dvrCapLifted,
      uniqueFlags: [...new Set(flags)],
    };
  });
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})().catch((e) => { console.error('FAILED', e); process.exit(1); });
