'use strict';

// All dynamic content is inserted with textContent / DOM APIs, never as HTML.

const $ = (id) => document.getElementById(id);

// Theme: theme.js (in <head>) applied the saved mode. The toggle is one button that cycles
// auto -> light -> dark; its icon shows what the page looks like now (sun or moon) and its small
// label the mode. data-theme-mode is the choice, data-theme what it resolves to. "auto" is stored
// as no value, and keeps following the OS.
const THEME_MODES = ['auto', 'light', 'dark'];
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme(mode) {
  const root = document.documentElement;
  root.dataset.themeMode = mode;
  root.dataset.theme = mode === 'auto' ? (darkQuery.matches ? 'dark' : 'light') : mode;
  const next = THEME_MODES[(THEME_MODES.indexOf(mode) + 1) % THEME_MODES.length];
  $('theme').setAttribute('aria-label', `Theme: ${mode}. Switch to ${next}.`);
}

function setTheme(mode) {
  applyTheme(mode);
  try {
    if (mode === 'auto') localStorage.removeItem('tk-theme');
    else localStorage.setItem('tk-theme', mode);
  } catch {
    // Storage blocked: the choice still applies until the page is reloaded.
  }
}
$('theme').addEventListener('click', () => {
  const mode = document.documentElement.dataset.themeMode ?? 'auto';
  setTheme(THEME_MODES[(THEME_MODES.indexOf(mode) + 1) % THEME_MODES.length]);
});
darkQuery.addEventListener('change', () => {
  if ((document.documentElement.dataset.themeMode ?? 'auto') === 'auto') applyTheme('auto');
});
applyTheme(document.documentElement.dataset.themeMode ?? 'auto');

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
  $('account-email').classList.toggle('active', view === 'account');
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

// How many timestamps match, at the right edge of the search box (an empty result says so below it).
function showCount(total) {
  $('search-count').textContent = total === 0 ? '' : `${number(total)} result${total === 1 ? '' : 's'}`;
  $('results-summary').textContent = total === 0 ? 'No timestamps found.' : '';
}

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
  // tz: so a "date:" day is the viewer's own day, matching the air dates shown on the page.
  const params = new URLSearchParams({ q: stampList.query, tz: Intl.DateTimeFormat().resolvedOptions().timeZone });
  if (stampList.cursor) params.set('cursor', stampList.cursor);
  if (stampList.video) params.set('video', stampList.video);
  if (stampList.channel) params.set('channel', stampList.channel);
  $('load-more').disabled = true;
  $('load-more').textContent = 'Loading…';
  const { ok, status, data } = await api(`/web/timestamps?${params}`);
  if (token !== stampList.token) return;
  if (status === 401) return showSignedOut('Your session has ended. Please sign in again.');
  if (!ok) {
    $('search-count').textContent = '';
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
  showCount(Math.max(stampList.total, stampList.loaded));
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

function scheduleSearch() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    stampList.query = $('search').value.trim();
    loadStamps({ append: false });
  }, 250);
}

// Autocomplete. "title:" and "channel:" search one field (the server parses them); suggestions are
// those two operators plus titles and channel names from the videos you have timestamps on.
const SEARCH_OPERATORS = ['title:', 'channel:', 'date:', 'comment:'];
const suggestions = { items: [], active: -1, request: 0, timer: null };

// The word being typed: everything after the last space that is not inside quotes.
function currentSearchToken(text) {
  let start = 0;
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '"') quoted = !quoted;
    else if (text[i] === ' ' && !quoted) start = i + 1;
  }
  return { start, text: text.slice(start) };
}

function renderSuggestions() {
  const list = $('search-suggestions');
  list.replaceChildren(
    ...suggestions.items.map((item, index) => {
      const row = el('li', { role: 'option', id: `suggestion-${index}`, 'aria-selected': String(index === suggestions.active) },
        el('span', { className: 'kind' }, item.kind), el('span', { className: 'value' }, item.label));
      row.addEventListener('mousedown', (event) => event.preventDefault()); // keep the cursor in the box
      row.addEventListener('click', () => applySuggestion(index));
      return row;
    }),
  );
  const open = suggestions.items.length > 0;
  list.hidden = !open;
  $('search').setAttribute('aria-expanded', String(open));
  if (suggestions.active >= 0) $('search').setAttribute('aria-activedescendant', `suggestion-${suggestions.active}`);
  else $('search').removeAttribute('aria-activedescendant');
}

function closeSuggestions() {
  suggestions.request++; // an answer still on its way must not reopen the list
  suggestions.items = [];
  suggestions.active = -1;
  renderSuggestions();
}

async function updateSuggestions() {
  const request = ++suggestions.request;
  const value = $('search').value;
  const { text } = currentSearchToken(value);
  const field = /^(-?)(title|channel|date|comment):/i.exec(text);
  const minus = field ? field[1] : text.startsWith('-') ? '-' : ''; // a leading minus negates a field
  const bare = text.slice(minus.length).toLowerCase();

  // Dates are not looked up on the server: offer quick ranges and the calendar.
  if (field?.[2].toLowerCase() === 'date') {
    suggestions.items = dateSuggestions(text.slice(field[0].length), minus);
    suggestions.active = -1;
    renderSuggestions();
    return;
  }

  // Comments are free text: there is nothing sensible to suggest after "comment:".
  if (field?.[2].toLowerCase() === 'comment') return closeSuggestions();

  const items = [];
  if (!field && (value === '' || text !== '')) {
    for (const op of SEARCH_OPERATORS) if (op.startsWith(bare)) items.push({ kind: 'operator', label: `${minus}${op}`, insert: `${minus}${op}` });
  }
  const partial = field ? text.slice(field[0].length).replace(/^"/, '').replace(/"$/, '') : text;
  if (field || (!minus && text.length >= 2)) {
    const params = new URLSearchParams({ field: field ? field[2].toLowerCase() : 'any', q: partial });
    const { ok, data } = await api(`/web/search-suggestions?${params}`);
    if (request !== suggestions.request) return; // a newer keystroke (or closing) superseded this
    if (ok) for (const s of data.suggestions) items.push({ kind: s.field, label: s.value, insert: `${minus}${s.field}:"${s.value.replace(/"/g, '')}" ` });
  }
  if (request !== suggestions.request) return;
  suggestions.items = items;
  suggestions.active = -1;
  renderSuggestions();
}

function applySuggestion(index) {
  const item = suggestions.items[index];
  if (!item) return;
  if (item.kind === 'calendar') {
    closeSuggestions();
    return openDatePicker();
  }
  const input = $('search');
  input.value = input.value.slice(0, currentSearchToken(input.value).start) + item.insert;
  input.focus();
  if (item.kind === 'operator') updateSuggestions(); // carry on typing: show values for it
  else closeSuggestions();
  scheduleSearch();
}

$('search').addEventListener('input', () => {
  scheduleSearch();
  clearTimeout(suggestions.timer);
  suggestions.timer = setTimeout(updateSuggestions, 120);
});
$('search').addEventListener('focus', updateSuggestions);
$('search').addEventListener('blur', closeSuggestions);
$('search').addEventListener('keydown', (event) => {
  const count = suggestions.items.length;
  if (event.key === 'ArrowDown' && count) {
    event.preventDefault();
    suggestions.active = (suggestions.active + 1) % count;
    renderSuggestions();
  } else if (event.key === 'ArrowUp' && count) {
    event.preventDefault();
    suggestions.active = (suggestions.active - 1 + count) % count;
    renderSuggestions();
  } else if (event.key === 'Enter' && suggestions.active >= 0) {
    event.preventDefault();
    applySuggestion(suggestions.active);
  } else if (event.key === 'Escape' && count) {
    event.preventDefault(); // closes the list instead of clearing the box
    closeSuggestions();
  }
});
// --- date picker: "date:" takes a day, month or year (2026-10-25, 2026-10, 2026) or a range
// (2026-10-01..2026-10-25, either end optional). The calendar writes the term into the search box.
const pad2 = (n) => String(n).padStart(2, '0');
const localDay = (date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
const dayAt = (iso) => new Date(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)));
const DATE_TERM = /(^|\s)(-?)date:\S*/i; // a leading minus (excluding those dates) is kept when the calendar replaces it

function dateSuggestions(partial, minus = '') {
  const items = [{ kind: 'calendar', label: 'Pick on a calendar…' }];
  if (partial !== '') return items;
  const now = new Date();
  const ago = (days) => localDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - days));
  const month = (offset) => new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const monthTerm = (date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
  const presets = [
    ['Today', ago(0)],
    ['Yesterday', ago(1)],
    ['Last 7 days', `${ago(6)}..${ago(0)}`],
    ['Last 30 days', `${ago(29)}..${ago(0)}`],
    ['This month', monthTerm(month(0))],
    ['Last month', monthTerm(month(-1))],
    ['This year', String(now.getFullYear())],
  ];
  return [...presets.map(([label, term]) => ({ kind: 'date', label, insert: `${minus}date:${term} ` })), ...items];
}

const picker = { year: 0, month: 0, start: null, end: null }; // month is 0-11; start/end are 'YYYY-MM-DD'
const monthLabels = Array.from({ length: 12 }, (_, m) => new Intl.DateTimeFormat(undefined, { month: 'long' }).format(new Date(2000, m, 1)));
const dayFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });
const fullDayFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'full' });
// 0 = Sunday. Intl's week info is not in every browser; Sunday is the fallback.
const weekStartsOn = (() => {
  try {
    const locale = new Intl.Locale(navigator.language);
    return (locale.getWeekInfo?.() ?? locale.weekInfo)?.firstDay % 7 || 0;
  } catch {
    return 0;
  }
})();

function renderDatePicker() {
  const { year, month, start, end } = picker;
  $('dp-month').value = String(month);
  if (![...$('dp-year').options].some((o) => o.value === String(year))) $('dp-year').append(el('option', { value: String(year) }, String(year)));
  $('dp-year').value = String(year);

  const today = localDay(new Date());
  const cells = [];
  for (let blank = (new Date(year, month, 1).getDay() - weekStartsOn + 7) % 7; blank > 0; blank--) cells.push(el('span'));
  for (let day = 1, last = new Date(year, month + 1, 0).getDate(); day <= last; day++) {
    const iso = `${year}-${pad2(month + 1)}-${pad2(day)}`;
    const edge = iso === start || iso === end;
    const inside = start && end && iso > start && iso < end;
    const cell = el('button', {
      type: 'button',
      className: `dp-day${edge ? ' edge' : ''}${inside ? ' inside' : ''}${iso === today ? ' today' : ''}`,
      'aria-pressed': String(edge || Boolean(inside)),
      'aria-label': fullDayFormat.format(dayAt(iso)),
    }, String(day));
    cell.addEventListener('click', () => pickDay(iso));
    cells.push(cell);
  }
  $('dp-days').replaceChildren(...cells);

  $('dp-summary').textContent = !start
    ? 'Click a day, or two days for a range.'
    : !end || end === start
      ? `${dayFormat.format(dayAt(start))} (click another day to make a range)`
      : `${dayFormat.format(dayAt(start))} – ${dayFormat.format(dayAt(end))}`;
  $('dp-apply').disabled = !start;
}

function pickDay(iso) {
  if (!picker.start || picker.end) {
    picker.start = iso; // a new selection
    picker.end = null;
  } else if (iso < picker.start) {
    [picker.start, picker.end] = [iso, picker.start];
  } else {
    picker.end = iso;
  }
  renderDatePicker();
}

function shiftMonth(by) {
  const moved = new Date(picker.year, picker.month + by, 1);
  [picker.year, picker.month] = [moved.getFullYear(), moved.getMonth()];
  renderDatePicker();
}

function closeDatePicker() {
  $('date-picker').hidden = true;
}

function openDatePicker() {
  // Start from the day or range already in the box, when it is spelled out in full days.
  const existing = /(?:^|\s)-?date:(\d{4}-\d{2}-\d{2})?(?:\.\.(\d{4}-\d{2}-\d{2})?)?(?:\s|$)/i.exec($('search').value);
  picker.start = existing?.[1] ?? null;
  picker.end = existing?.[2] ?? null;
  if (!picker.start && picker.end) [picker.start, picker.end] = [picker.end, null];
  const shown = picker.start ? dayAt(picker.start) : new Date();
  [picker.year, picker.month] = [shown.getFullYear(), shown.getMonth()];
  renderDatePicker();
  closeSuggestions();
  $('date-picker').hidden = false;
  $('dp-month').focus();
}

function setDateTerm(term) {
  const input = $('search');
  if (DATE_TERM.test(input.value)) {
    input.value = term ? input.value.replace(DATE_TERM, (_, lead, minus) => `${lead}${minus}${term}`) : input.value.replace(DATE_TERM, '').replace(/\s{2,}/g, ' ').trim();
  } else if (term) {
    input.value = `${input.value}${input.value && !input.value.endsWith(' ') ? ' ' : ''}${term}`;
  }
  scheduleSearch();
}

$('dp-month').replaceChildren(...monthLabels.map((label, m) => el('option', { value: String(m) }, label)));
$('dp-year').replaceChildren(
  ...Array.from({ length: new Date().getFullYear() - 2005 + 2 }, (_, i) => String(new Date().getFullYear() + 1 - i)).map((y) => el('option', { value: y }, y)),
);
$('dp-weekdays').replaceChildren(
  ...Array.from({ length: 7 }, (_, i) =>
    el('span', {}, new Intl.DateTimeFormat(undefined, { weekday: 'narrow' }).format(new Date(2023, 0, 1 + ((weekStartsOn + i) % 7))))),
);
$('dp-prev').addEventListener('click', () => shiftMonth(-1));
$('dp-next').addEventListener('click', () => shiftMonth(1));
$('dp-month').addEventListener('change', () => ((picker.month = Number($('dp-month').value)), renderDatePicker()));
$('dp-year').addEventListener('change', () => ((picker.year = Number($('dp-year').value)), renderDatePicker()));
$('dp-apply').addEventListener('click', () => {
  const { start, end } = picker;
  setDateTerm(!end || end === start ? `date:${start}` : `date:${start}..${end}`);
  closeDatePicker();
  $('search').focus();
});
$('dp-clear').addEventListener('click', () => {
  setDateTerm('');
  closeDatePicker();
  $('search').focus();
});
$('dp-cancel').addEventListener('click', () => {
  closeDatePicker();
  $('search').focus();
});
document.addEventListener('mousedown', (event) => {
  if (!$('date-picker').hidden && !$('date-picker').contains(event.target)) closeDatePicker();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !$('date-picker').hidden) {
    closeDatePicker();
    $('search').focus();
  }
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
