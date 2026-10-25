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
  $('account').hidden = view !== 'dashboard';
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
      const link = el('a', { href: url.toString(), target: '_blank', rel: 'noopener noreferrer' }, video.videoId);
      return el('li', {}, link, el('span', { className: 'count' }, `${number(video.count)} timestamp${video.count === 1 ? '' : 's'}`));
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
  show('dashboard');
}

let signInReady = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = el('script', { src, async: '' });
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Could not load ${src}`));
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
    setLoginError('Could not load Google sign-in. Check your connection and reload.');
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
