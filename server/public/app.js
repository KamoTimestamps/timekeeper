'use strict';

// All dynamic content is inserted with textContent / DOM APIs, never as HTML.

const $ = (id) => document.getElementById(id);

// Theme: theme.js (in <head>) applied the saved choice; this is the toggle. "auto" removes the
// attribute so the stylesheet follows the OS, and is stored as no value at all.
function setTheme(theme) {
  if (theme === 'auto') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  try {
    if (theme === 'auto') localStorage.removeItem('tk-theme');
    else localStorage.setItem('tk-theme', theme);
  } catch {
    // Storage blocked: the choice still applies until the page is reloaded.
  }
  for (const button of document.querySelectorAll('[data-theme-choice]')) {
    button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme));
  }
}
for (const button of document.querySelectorAll('[data-theme-choice]')) {
  button.addEventListener('click', () => setTheme(button.dataset.themeChoice));
}
setTheme(document.documentElement.dataset.theme ?? 'auto');

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
  if (view !== 'timestamps') closePlayer(); // the player belongs to the timestamps page
  $('loading').hidden = view !== 'loading';
  $('signed-out').hidden = view !== 'signed-out';
  $('display-name').hidden = view !== 'display-name';
  $('dashboard').hidden = view !== 'dashboard';
  $('timestamps').hidden = view !== 'timestamps';
  $('account-page').hidden = view !== 'account';
  $('account').hidden = !['dashboard', 'timestamps', 'account', 'display-name'].includes(view);
  $('nav-overview').classList.toggle('active', view === 'dashboard');
  $('nav-timestamps').classList.toggle('active', view === 'timestamps');
  $('nav-account').classList.toggle('active', view === 'account');
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
const dateOnly = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });
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
  const change = el('button', { className: 'ghost', type: 'button' }, 'Change');
  change.addEventListener('click', () => openDisplayNameForm({ required: false }));
  const rows = [
    ['Username', [account.displayName || '—', change]],
    ['Google name', account.name || '—'],
    ['Email', account.email],
    ['Member since', dateTime.format(account.createdAt)],
  ];
  $('account-details').replaceChildren(
    ...rows.flatMap(([term, value]) => [el('dt', {}, term), el('dd', {}, ...[value].flat())]),
  );
  $('account-email').textContent = account.displayName || account.email;
  $('account-email').title = account.email;
}

// Everyone must have a display name: until they do, every route lands on the form to choose one.
let needsDisplayName = false;

const NAME_ADJECTIVES = ['Brave', 'Calm', 'Clever', 'Cosmic', 'Crimson', 'Eager', 'Fuzzy', 'Gentle', 'Golden', 'Happy', 'Jolly', 'Keen', 'Lucky', 'Mellow', 'Nimble', 'Quiet', 'Rapid', 'Silent', 'Sunny', 'Swift', 'Witty', 'Zesty'];
const NAME_NOUNS = ['Badger', 'Comet', 'Falcon', 'Fox', 'Heron', 'Koala', 'Lynx', 'Marmot', 'Narwhal', 'Otter', 'Panda', 'Quokka', 'Raven', 'Seal', 'Tiger', 'Walrus', 'Wombat', 'Yak'];

// What the server's username check (username.ts, YouTube's handle rules) can reject a name for.
const NAME_PROBLEMS = {
  length: 'Use 3 to 30 characters (1 to 10 for Chinese or Korean, 2 to 20 for Japanese or Ethiopic).',
  characters: 'Use only letters, numbers, and the symbols _ - . · (no spaces).',
  edges: 'Start and end with a letter or number.',
  mixed_direction: "Don't mix left-to-right and right-to-left scripts.",
  looks_like_url: "A username can't look like a web address.",
  looks_like_phone: "A username can't look like a phone number.",
};

function randomDisplayName() {
  const below = (n) => crypto.getRandomValues(new Uint32Array(1))[0] % n;
  return `${NAME_ADJECTIVES[below(NAME_ADJECTIVES.length)]}${NAME_NOUNS[below(NAME_NOUNS.length)]}${below(100)}`;
}

function openDisplayNameForm({ required }) {
  $('display-name-title').textContent = required ? 'Choose a username' : 'Change your username';
  $('display-name-cancel').hidden = required;
  $('display-name-error').hidden = true;
  $('display-name-input').value = required ? '' : (overviewLive.latest?.account.displayName ?? '');
  show('display-name');
  $('display-name-input').focus();
}

$('display-name-random').addEventListener('click', () => {
  $('display-name-input').value = randomDisplayName();
  $('display-name-error').hidden = true;
});
$('display-name-cancel').addEventListener('click', () => route());
$('display-name-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const { ok, status, data } = await api('/web/display-name', { method: 'PUT', body: { displayName: $('display-name-input').value } });
  if (status === 401) return showSignedOut('Your session has ended. Please sign in again.');
  if (!ok) {
    $('display-name-error').textContent =
      status === 400 ? (NAME_PROBLEMS[data?.problem] ?? NAME_PROBLEMS.length)
      : status === 409 ? 'That username is already taken.'
      : status === 429 ? `You can change your username twice every 14 days. You can change it again ${dateTime.format(data.retryAt)}.`
      : 'Could not save the username. Please try again.';
    $('display-name-error').hidden = false;
    return;
  }
  await loadOverview(); // re-reads the account, clears the requirement, and routes to the page asked for
});

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
  features = data.features ?? {};
  renderAccount(data.account);
  needsDisplayName = !data.account.displayName;
  renderTiles(data.stats);
  renderTopVideos(data.stats.topVideos);
  renderSessions(data.sessions);
  overviewLive.latest = data;
  overviewLive.topVideos = JSON.stringify(data.stats.topVideos);
  route();
  watchOverview();
}

// Live updates: the server keeps an event stream open and sends a bare "overview" signal when this
// account's counts or sessions change. The data itself is re-fetched, so the stream carries nothing
// private. A failed fetch keeps what is shown; only a 401 signs out.
const overviewLive = { source: null, retry: null, busy: false, again: false, stale: false, latest: null, topVideos: '' };

function applyOverview(data) {
  overviewLive.latest = data;
  renderAccount(data.account); // the name may have been changed from another tab
  renderTiles(data.stats);
  renderSessions(data.sessions);
  // Re-rendering would reload every thumbnail, so only touch the list when it changed.
  const topVideos = JSON.stringify(data.stats.topVideos);
  if (topVideos !== overviewLive.topVideos) {
    overviewLive.topVideos = topVideos;
    renderTopVideos(data.stats.topVideos);
  }
}

// The overview data (counts, account, sessions) feeds two pages; it only needs refreshing while one is on screen.
const overviewShowing = () => !$('dashboard').hidden || !$('account-page').hidden;

async function refreshOverview() {
  // Not on screen: remember to catch up when it is.
  if (!overviewShowing() || document.hidden) {
    overviewLive.stale = true;
    return;
  }
  if (overviewLive.busy) {
    overviewLive.again = true; // a signal arrived mid-fetch, so that response may already be out of date
    return;
  }
  overviewLive.busy = true;
  overviewLive.stale = false;
  try {
    do {
      overviewLive.again = false;
      const { ok, status, data } = await api('/web/overview');
      if (status === 401) return showSignedOut('Your session has ended. Please sign in again.');
      if (ok && overviewShowing()) applyOverview(data);
    } while (overviewLive.again);
  } catch {
    // Offline or the server restarting: the stream's reconnect fetches again.
  } finally {
    overviewLive.busy = false;
  }
}

function watchOverview() {
  if (overviewLive.source) return;
  const source = new EventSource('/web/events');
  overviewLive.source = source;
  source.addEventListener('overview', refreshOverview);
  // Also on the first open, and on every automatic reconnect: signals sent while it was down are gone.
  source.addEventListener('open', refreshOverview);
  source.addEventListener('error', () => {
    if (source.readyState !== EventSource.CLOSED) return; // still reconnecting by itself
    overviewLive.source = null; // refused (e.g. 401 or a proxy error), which the browser won't retry
    overviewLive.retry = setTimeout(watchOverview, 5000);
    refreshOverview(); // a 401 here signs the page out
  });
}

function stopWatchingOverview() {
  clearTimeout(overviewLive.retry);
  overviewLive.source?.close();
  overviewLive.source = null;
}

document.addEventListener('visibilitychange', () => {
  if (overviewLive.stale) refreshOverview();
});
// Relative times ("5 minutes ago") keep moving between signals.
setInterval(() => {
  if (overviewLive.latest && overviewShowing() && !document.hidden) {
    renderTiles(overviewLive.latest.stats);
    renderSessions(overviewLive.latest.sessions);
  }
}, 30_000);

// --- timestamps browser ---

// `loaded` counts rows shown; `cursor` is the server's opaque "continue after the last row" marker.
const stampList = { query: '', video: '', channel: '', loaded: 0, total: 0, cursor: null, token: 0, group: null };

// Zero-padded to the width of `longest`, so every time in one video's list lines up: with a
// timestamp past an hour they are all h:mm:ss ("0:57:47"), otherwise m:ss padded to its minutes.
function clock(seconds, longest = seconds) {
  const s = Math.floor(seconds);
  const top = Math.floor(longest);
  const ss = String(s % 60).padStart(2, '0');
  if (top >= 3600) {
    const h = String(Math.floor(s / 3600)).padStart(String(Math.floor(top / 3600)).length, '0');
    return `${h}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${ss}`;
  }
  return `${String(Math.floor(s / 60)).padStart(String(Math.floor(top / 60)).length, '0')}:${ss}`;
}

// The row above a video's hits: thumbnail, title, channel and air date. `info` is only present
// when the server has a YouTube API key and the video is public; otherwise it is the bare ID.
function renderVideoHead(item) {
  const filter = `#/timestamps?video=${encodeURIComponent(item.videoId)}`;
  const label = item.info ? item.info.title : item.videoId;
  const thumb = item.info?.thumbnailUrl
    ? el('img', { className: 'thumb', src: item.info.thumbnailUrl, alt: '', loading: 'lazy', width: '80', height: '45' })
    : el('span', { className: 'thumb' });
  const sub = el('div', { className: 'muted video-sub' });
  const channelName = item.info?.channelTitle;
  const aired = item.info?.publishedAt ? dateOnly.format(new Date(item.info.publishedAt)) : '';
  if (channelName) sub.append(el('a', { href: `#/timestamps?channel=${encodeURIComponent(channelName)}`, title: `Only ${channelName}` }, channelName));
  if (channelName && aired) sub.append(' · ');
  if (aired) sub.append(aired);
  return el('div', { className: 'group-head' },
    el('a', { href: filter, tabindex: '-1', 'aria-hidden': 'true' }, thumb),
    el('div', { className: 'video-text' },
      el('a', { className: 'video-title', href: filter, title: label }, label),
      sub));
}

// --- mini player ---

// Server-side feature switches, delivered with the overview. Each is off unless the server says so.
let features = {};

// YouTube's plain iframe embed: a new iframe per click, starting at the timestamp. It needs a
// referrer to accept the embed, which this page's no-referrer policy would otherwise withhold.
const PLAYER_ORIGIN = 'https://www.youtube-nocookie.com';
const player = { videoId: '', second: -1 };

// The "YouTube" link always points at where the player is now, so a normal, middle or right-click
// all open the same moment.
function setOpenLink(videoId, seconds) {
  const watch = new URL('https://www.youtube.com/watch');
  watch.searchParams.set('v', videoId);
  watch.searchParams.set('t', `${Math.floor(seconds)}s`);
  $('player-open').href = watch.toString();
}

function playAt(item) {
  const title = item.info ? item.info.title : item.videoId;
  const embed = new URL(`${PLAYER_ORIGIN}/embed/${encodeURIComponent(item.videoId)}`);
  embed.searchParams.set('start', String(Math.floor(item.start)));
  embed.searchParams.set('autoplay', '1');
  embed.searchParams.set('rel', '0');
  embed.searchParams.set('enablejsapi', '1'); // lets us send it commands and receive its state
  embed.searchParams.set('origin', location.origin);

  const frame = el('iframe', {
    src: embed.toString(),
    title,
    allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen',
    allowfullscreen: '',
    referrerpolicy: 'strict-origin-when-cross-origin',
  });
  // Until the embed is told someone is listening it sends nothing; after this it reports its state
  // (including currentTime) a couple of times a second.
  frame.addEventListener('load', () => frame.contentWindow?.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), PLAYER_ORIGIN));
  $('player-frame').replaceChildren(frame);

  player.videoId = item.videoId;
  player.second = Math.floor(item.start);
  setOpenLink(item.videoId, item.start);
  $('player-title').textContent = `${clock(item.start)} · ${title}`;
  $('mini-player').hidden = false;
}

window.addEventListener('message', (event) => {
  const frame = $('player-frame').querySelector('iframe');
  if (event.origin !== PLAYER_ORIGIN || !frame || event.source !== frame.contentWindow) return;
  let message;
  try {
    message = JSON.parse(event.data);
  } catch {
    return;
  }
  const time = message?.info?.currentTime;
  if (typeof time !== 'number' || Math.floor(time) === player.second) return;
  player.second = Math.floor(time);
  setOpenLink(player.videoId, time);
});

function closePlayer() {
  $('player-frame').replaceChildren(); // removing the iframe is what stops playback
  $('mini-player').hidden = true;
}

// Pauses without closing, so the video is still there to resume. Used when the user goes to YouTube
// instead, so the two don't play over each other. Ignored if the embed hasn't finished loading.
function pausePlayer() {
  const frame = $('player-frame').querySelector('iframe');
  frame?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), PLAYER_ORIGIN);
}

$('player-close').addEventListener('click', closePlayer);
$('player-open').addEventListener('click', pausePlayer);

function renderHit(item) {
  const watch = new URL('https://www.youtube.com/watch');
  watch.searchParams.set('v', item.videoId);
  watch.searchParams.set('t', `${Math.floor(item.start)}s`);
  const time = el('a', { className: 'stamp-time', href: watch.toString(), target: '_blank', rel: 'noopener noreferrer', title: features.miniPlayer ? 'Play here (Ctrl/⌘-click for YouTube)' : 'Open on YouTube at this time', 'data-start': String(item.start) }, clock(item.start));
  time.addEventListener('click', (event) => {
    if (!features.miniPlayer) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      pausePlayer(); // the browser opens YouTube in a new tab
      return;
    }
    event.preventDefault();
    playAt(item);
  });
  time.addEventListener('auxclick', () => features.miniPlayer && pausePlayer()); // middle-click opens YouTube too
  return el('li', {}, time, el('div', { className: 'stamp-body' }, el('div', { className: 'stamp-comment' }, item.comment || '(no comment)')));
}

// The server returns rows grouped by video, so a new video row starts whenever the video changes.
// A page can end mid-video; the next one then continues that video's list.
function addStamps(items, append) {
  const list = $('timestamp-list');
  if (!append) {
    list.replaceChildren();
    stampList.group = null;
  }
  const touched = new Set();
  for (const item of items) {
    if (stampList.group?.videoId !== item.videoId) {
      const hits = el('ol', { className: 'stamps' });
      list.append(el('li', { className: 'group' }, renderVideoHead(item), hits));
      // The video's real length when known, so times pad to it even if no hit is near the end.
      stampList.group = { videoId: item.videoId, hits, longest: item.info?.durationSeconds ?? 0 };
    }
    const group = stampList.group;
    group.longest = Math.max(group.longest, item.start);
    group.hits.append(renderHit(item));
    touched.add(group);
  }
  // A later page can bring a longer timestamp for a video already on screen, which widens them all.
  for (const group of touched) {
    for (const time of group.hits.querySelectorAll('.stamp-time')) time.textContent = clock(Number(time.dataset.start), group.longest);
  }
}

// The thin bar under the search box: where the bottom of the window is in the whole matching list.
// Only part of the list is loaded, so the rest is estimated from the average height of what is, which
// makes a new page refine the estimate instead of moving the bar. Its text form ("Showing 100 of
// 38,072") lives in the aria-label.
function showProgress(loaded, total) {
  const bar = $('list-progress');
  bar.hidden = total === 0;
  $('results-summary').textContent = total === 0 ? 'No timestamps found.' : '';
  bar.setAttribute('aria-label', `Showing ${number(loaded)} of ${number(total)} timestamp${total === 1 ? '' : 's'}`);
  bar.title = bar.getAttribute('aria-label');
  paintProgress();
}

function paintProgress() {
  const bar = $('list-progress');
  if (bar.hidden) return;
  const { loaded, total } = stampList;
  const list = $('timestamp-list').getBoundingClientRect();
  const seen = Math.min(Math.max(window.innerHeight - list.top, 0), list.height);
  const estimated = loaded > 0 ? list.height * (Math.max(total, loaded) / loaded) : 0;
  const percent = estimated > 0 ? Math.min(100, (seen / estimated) * 100) : 0;
  bar.firstElementChild.style.width = `${percent}%`;
  bar.setAttribute('aria-valuenow', String(Math.round(percent)));
}

let progressFrame = 0;
const schedulePaint = () => {
  if (!progressFrame) progressFrame = requestAnimationFrame(() => ((progressFrame = 0), paintProgress()));
};
window.addEventListener('scroll', schedulePaint, { passive: true });
window.addEventListener('resize', schedulePaint);

// The pinned video header sits just under the pinned search bar, whatever height that has.
new ResizeObserver(() => {
  document.documentElement.style.setProperty('--search-bar-height', `${$('search-bar').offsetHeight}px`);
}).observe($('search-bar'));

async function loadStamps({ append }) {
  const token = ++stampList.token; // a slower, older response must not overwrite a newer search
  if (!append) {
    stampList.loaded = 0;
    stampList.cursor = null;
  }
  const params = new URLSearchParams({ q: stampList.query });
  if (stampList.cursor) params.set('cursor', stampList.cursor);
  if (stampList.video) params.set('video', stampList.video);
  if (stampList.channel) params.set('channel', stampList.channel);
  $('load-more').disabled = true;
  $('load-more').textContent = 'Loading…';
  const { ok, status, data } = await api(`/web/timestamps?${params}`);
  if (token !== stampList.token) return;
  if (status === 401) return showSignedOut('Your session has ended. Please sign in again.');
  if (!ok) {
    $('list-progress').hidden = true;
    $('results-summary').textContent = 'Could not load timestamps. Please try again.';
    $('load-more').textContent = 'Try again';
    $('load-more').disabled = false;
    return;
  }
  addStamps(data.items, append);
  stampList.loaded += data.items.length;
  stampList.cursor = data.nextCursor;
  // Only the first page carries the total; rows added while scrolling can push loaded past it.
  if (!append) stampList.total = data.total;
  showProgress(stampList.loaded, Math.max(stampList.total, stampList.loaded));
  $('load-more').hidden = !stampList.cursor;
  $('load-more').textContent = 'Load more';
  $('load-more').disabled = false;
  // An observer only fires when visibility changes, so if the button is still in view (a tall
  // window, a short page) re-observing is what makes it ask for the next page. Not done after a
  // failure, which would retry in a loop; the "Try again" button covers that.
  loadMoreObserver.unobserve($('load-more'));
  loadMoreObserver.observe($('load-more'));
}

// Infinite scroll: fetch the next page when the button comes within a screen of view.
const loadMoreObserver = new IntersectionObserver(
  (entries) => {
    const button = $('load-more');
    if (entries.some((entry) => entry.isIntersecting) && !button.hidden && !button.disabled) loadStamps({ append: true });
  },
  { rootMargin: '0px 0px 600px 0px' },
);

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

// "#/timestamps?video=ID" and "#/timestamps?channel=NAME" are the timestamps view filtered to one
// video or channel; anything else is the overview.
function route() {
  if (needsDisplayName) return openDisplayNameForm({ required: true });
  const [path, queryString = ''] = location.hash.slice(1).split('?');
  if (path === '/account') {
    show('account');
    if (overviewLive.stale) refreshOverview(); // signals arrived while another view was open
    return;
  }
  if (path !== '/timestamps') {
    show('dashboard');
    if (overviewLive.stale) refreshOverview(); // signals arrived while another view was open
    return;
  }
  const hashParams = new URLSearchParams(queryString);
  stampList.video = hashParams.get('video') || '';
  stampList.channel = hashParams.get('channel') || '';
  $('video-filter').hidden = !stampList.video;
  $('channel-filter').hidden = !stampList.channel;
  $('channel-name').textContent = stampList.channel;
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
  stopWatchingOverview();
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
