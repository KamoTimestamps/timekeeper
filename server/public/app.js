'use strict';

// All dynamic content is inserted with textContent / DOM APIs, never as HTML.

const $ = (id) => document.getElementById(id);

async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let data = null;
  if (res.headers.get('content-type')?.includes('application/json')) data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

function show(view) {
  $('loading').hidden = view !== 'loading';
  $('signed-out').hidden = view !== 'signed-out';
  $('dashboard').hidden = view !== 'dashboard';
  $('timestamps').hidden = view !== 'timestamps';
  $('account').hidden = view !== 'dashboard' && view !== 'timestamps';
  $('nav-overview').classList.toggle('active', view === 'dashboard');
  $('nav-timestamps').classList.toggle('active', view === 'timestamps');
}

function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === 'className') node.className = value;
    else node.setAttribute(key, value);
  }
  node.append(...children);
  return node;
}

const number = (n) => n.toLocaleString();
const dateTime = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });
const relative = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

function ago(ms) {
  const seconds = Math.round((ms - Date.now()) / 1000);
  for (const [unit, size] of [['day', 86400], ['hour', 3600], ['minute', 60]]) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  }
  return 'just now';
}

// Enough to tell devices apart ("Chrome on macOS"); the raw string is kept as a tooltip.
function describeAgent(ua) {
  if (!ua) return 'Unknown';
  const browser = /Edg\//.test(ua) ? 'Edge' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : null;
  const os = /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Windows/.test(ua) ? 'Windows' : /Mac OS X/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : null;
  return browser && os ? `${browser} on ${os}` : browser || os || 'Unknown';
}

const regionNames = typeof Intl.DisplayNames === 'function' ? new Intl.DisplayNames(undefined, { type: 'region' }) : null;

// Two regional-indicator letters make a flag emoji. Windows browsers don't draw those (they show
// the letters), which is why the country name is also in the tooltip.
function flag(country) {
  return /^[A-Z]{2}$/.test(country || '')
    ? String.fromCodePoint(...[...country].map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65))
    : '';
}

const place = (country, ip) => [flag(country), ip].filter(Boolean).join(' ') || 'Unknown';

function countryName(code) {
  try {
    return regionNames?.of(code) ?? code;
  } catch {
    return code;
  }
}

function renderLocation(session) {
  const notes = [];
  if (session.country) notes.push(countryName(session.country));
  if (session.createdIp && (session.createdIp !== session.ip || session.createdCountry !== session.country)) {
    notes.push(`Signed in from ${place(session.createdCountry, session.createdIp)}`);
  }
  return el('td', { title: notes.join(' · ') }, session.ip || session.country ? place(session.country, session.ip) : '—');
}

function renderTiles(stats) {
  const tiles = [
    [number(stats.active), 'Timestamps'],
    [number(stats.videos), 'Videos'],
    [number(stats.devices), 'Devices synced'],
    [number(stats.deleted), 'Deleted (kept so deletions sync)'],
  ];
  const nodes = tiles.map(([value, label]) =>
    el('div', { className: 'tile' }, el('div', { className: 'value' }, value), el('div', { className: 'label' }, label)),
  );
  nodes.push(
    el('div', { className: 'tile' },
      el('div', { className: 'value small' }, stats.lastSyncAt ? ago(stats.lastSyncAt) : '—'),
      el('div', { className: 'label' }, 'Last change synced')),
  );
  $('tiles').replaceChildren(...nodes);
}

function renderTopVideos(videos) {
  $('no-videos').hidden = videos.length > 0;
  $('top-videos').replaceChildren(
    ...videos.map((video) => {
      const url = new URL('https://www.youtube.com/watch');
      url.searchParams.set('v', video.videoId);
      const href = { href: url.toString(), target: '_blank', rel: 'noopener noreferrer' };
      const count = el('span', { className: 'count' }, `${number(video.count)} timestamp${video.count === 1 ? '' : 's'}`);
      // `info` is only present when the server has a YouTube API key and the video is public.
      if (!video.info) return el('li', {}, el('a', href, video.videoId), count);

      const thumb = video.info.thumbnailUrl
        ? el('img', { className: 'thumb', src: video.info.thumbnailUrl, alt: '', loading: 'lazy', width: '80', height: '45' })
        : el('span', { className: 'thumb' });
      const text = el('div', { className: 'video-text' },
        el('a', { ...href, className: 'video-title', title: video.info.title }, video.info.title),
        el('div', { className: 'muted', title: video.info.channelTitle }, video.info.channelTitle));
      return el('li', { className: 'rich' }, thumb, text, count);
    }),
  );
}

function renderAccount(account) {
  const rows = [['Name', account.name || '—'], ['Email', account.email], ['Member since', dateTime.format(account.createdAt)]];
  $('account-details').replaceChildren(...rows.flatMap(([term, value]) => [el('dt', {}, term), el('dd', {}, value)]));
  $('account-email').textContent = account.email;
}

function renderSessions(sessions) {
  $('sessions').replaceChildren(
    ...sessions.map((session) => {
      const type = session.kind === 'web' ? 'Web page' : 'Userscript';
      const device = el('span', { title: session.userAgent || '' }, describeAgent(session.userAgent));
      const status = session.current ? el('span', { className: 'badge' }, 'This browser') : '';
      return el('tr', {},
        el('td', {}, type),
        el('td', {}, device),
        renderLocation(session),
        el('td', {}, dateTime.format(session.createdAt)),
        el('td', {}, ago(session.lastUsedAt)),
        el('td', {}, status));
    }),
  );
}

async function loadOverview() {
  const { ok, data } = await api('/web/overview');
  if (!ok) return showSignedOut();
  renderAccount(data.account);
  renderTiles(data.stats);
  renderTopVideos(data.stats.topVideos);
  renderSessions(data.sessions);
  route();
}

// --- timestamps browser ---

const stampList = { query: '', video: '', offset: 0, token: 0 };

function clock(seconds) {
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const mm = String(Math.floor((s % 3600) / 60)).padStart(h ? 2 : 1, '0');
  const ss = String(s % 60).padStart(2, '0');
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function renderStamp(item) {
  const watch = new URL('https://www.youtube.com/watch');
  watch.searchParams.set('v', item.videoId);
  watch.searchParams.set('t', `${Math.floor(item.start)}s`);
  const label = item.info ? item.info.title : item.videoId;
  const videoLink = el('a', { className: 'stamp-video', href: `#/timestamps?video=${encodeURIComponent(item.videoId)}`, title: label }, label);
  const time = el('a', { className: 'stamp-time', href: watch.toString(), target: '_blank', rel: 'noopener noreferrer', title: 'Open on YouTube at this time' }, clock(item.start));
  const meta = [item.info?.channelTitle, item.updatedAt ? dateTime.format(item.updatedAt) : ''].filter(Boolean).join(' · ');
  return el('li', {},
    time,
    el('div', { className: 'stamp-body' },
      el('div', { className: 'stamp-comment' }, item.comment || '(no comment)'),
      el('div', { className: 'stamp-meta muted' }, videoLink, meta ? ` · ${meta}` : '')));
}

async function loadStamps({ append }) {
  const token = ++stampList.token; // a slower, older response must not overwrite a newer search
  if (!append) stampList.offset = 0;
  const params = new URLSearchParams({ q: stampList.query, offset: String(stampList.offset) });
  if (stampList.video) params.set('video', stampList.video);
  $('load-more').disabled = true;
  const { ok, status, data } = await api(`/web/timestamps?${params}`);
  if (token !== stampList.token) return;
  if (status === 401) return showSignedOut('Your session has ended. Please sign in again.');
  if (!ok) {
    $('results-summary').textContent = 'Could not load timestamps. Please try again.';
    $('load-more').disabled = false;
    return;
  }
  const nodes = data.items.map(renderStamp);
  if (append) $('timestamp-list').append(...nodes);
  else $('timestamp-list').replaceChildren(...nodes);
  stampList.offset += data.items.length;
  $('results-summary').textContent =
    data.total === 0 ? 'No timestamps found.' : `Showing ${number(stampList.offset)} of ${number(data.total)} timestamp${data.total === 1 ? '' : 's'}`;
  $('load-more').hidden = stampList.offset >= data.total;
  $('load-more').disabled = false;
}

let searchTimer = null;

$('search').addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    stampList.query = $('search').value.trim();
    loadStamps({ append: false });
  }, 250);
});
$('search-form').addEventListener('submit', (event) => event.preventDefault());
$('load-more').addEventListener('click', () => loadStamps({ append: true }));

// "#/timestamps?video=ID" is the timestamps view filtered to one video; anything else is the overview.
function route() {
  const [path, queryString = ''] = location.hash.slice(1).split('?');
  if (path !== '/timestamps') return show('dashboard');
  stampList.video = new URLSearchParams(queryString).get('video') || '';
  $('video-filter').hidden = !stampList.video;
  show('timestamps');
  loadStamps({ append: false });
}

window.addEventListener('hashchange', () => {
  if (!$('signed-out').hidden || !$('loading').hidden) return;
  route();
});

let signInReady = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = el('script', { src, async: '' });
    script.onload = resolve;
    script.onerror = () => reject(new Error('script-blocked'));
    document.head.append(script);
  });
}

function setLoginError(message) {
  $('login-error').textContent = message || '';
  $('login-error').hidden = !message;
}

async function onCredential({ credential }) {
  setLoginError('');
  const { ok, status } = await api('/web/login', { method: 'POST', body: { idToken: credential } });
  if (!ok) return setLoginError(status === 401 ? 'Google sign-in was rejected. Please try again.' : 'Sign-in failed. Please try again.');
  $('notice').hidden = true;
  await loadOverview();
}

async function showSignedOut(notice) {
  show('signed-out');
  $('notice').textContent = notice || '';
  $('notice').hidden = !notice;
  setLoginError('');
  try {
    signInReady ??= (async () => {
      const { data } = await api('/web/config');
      await loadScript('https://accounts.google.com/gsi/client');
      google.accounts.id.initialize({ client_id: data.googleClientId, callback: onCredential, ux_mode: 'popup' });
      google.accounts.id.renderButton($('google-button'), { type: 'standard', theme: 'outline', size: 'large', text: 'signin_with', shape: 'pill' });
    })();
    await signInReady;
  } catch (err) {
    signInReady = null;
    console.error('Google sign-in setup failed:', err);
    setLoginError(
      err.message === 'script-blocked'
        ? "Google's sign-in script (accounts.google.com/gsi/client) could not be loaded. A content blocker, tracking protection or a network policy may be blocking it."
        : `Google sign-in could not start: ${err.message}`,
    );
  }
}

$('signout').addEventListener('click', async () => {
  await api('/web/logout', { method: 'POST' });
  showSignedOut('You have been signed out of this page.');
});

$('signout-all').addEventListener('click', async () => {
  const sure = confirm('Log out of all sessions? This signs out the Timekeeper userscript on every device, and this page. You will need to sign in again everywhere.');
  if (!sure) return;
  $('signout-all').disabled = true;
  const { ok, data } = await api('/web/logout-all', { method: 'POST' });
  $('signout-all').disabled = false;
  if (!ok) return showSignedOut('Could not log out all sessions. Please sign in and try again.');
  const count = data.revoked;
  showSignedOut(`Logged out of ${count} session${count === 1 ? '' : 's'}.`);
});

loadOverview();
