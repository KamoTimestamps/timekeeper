# Timekeeper Sync Server

Backend for live-syncing a user's Timekeeper timestamps across devices. Accounts are created and
signed into with Google; the userscript's **Settings → Sync** tab talks to this service.

Node 24+, Fastify, and the built-in `node:sqlite`. Node strips the TypeScript types itself, so
there is no build step.

## Run

```
cp .env.example .env   # fill in GOOGLE_CLIENT_ID and JWT_SECRET
npm install
node --env-file=.env src/index.ts
```

Or with Docker (mount `/data` to keep the database):

```
docker build -t timekeeper-server .
docker run -p 8787:8787 -v tk-data:/data --env-file .env timekeeper-server
```

`npm test` runs the test suite; `npm run typecheck` runs `tsc`.

Put it behind TLS (the userscript runs on https, so it needs `https://` / `wss://`).

## Deployed servers (ash.kamotimestamps.com, oak.kamotimestamps.com)

`ash` is staging and `oak` is production; the droplets are defined in `../infra`. Deploy to ash
first, check it, then promote to oak.

`./deploy.sh ash|oak` (from `server/`) rsyncs this directory to `timekeeper-<env>` and runs
`deploy/remote-update.sh` there with `TK_HOSTNAME=<env>.kamotimestamps.com`. That script is
idempotent: it installs Node and Caddy if missing, runs `npm ci`, installs the systemd unit and
Caddyfile (with the hostname filled in) when they changed, restarts the app and waits for
`/healthz`. Re-run it for every update. SSH goes to `root@timekeeper-<env>`, the droplet's Tailscale name (port 22 is
closed to the internet; see `../infra/README.md`). Set `DEPLOY_HOST` to use another address.

- App: `timekeeper-server.service`, listening on `127.0.0.1:8787` as user `timekeeper`; the
  SQLite database is `/var/lib/timekeeper/timekeeper.db`.
- Config: `/etc/timekeeper/server.env`. The first deploy creates it with a generated `JWT_SECRET`.
  Every deploy then applies the non-secret settings committed in `deploy/<env>.env`
  (`GOOGLE_CLIENT_ID`, `ALLOWED_ORIGINS`, feature switches such as `FEATURE_MINI_PLAYER=true`) and
  sets `PUBLIC_ORIGIN` from the environment name. Keys not listed there (`JWT_SECRET`, `YOUTUBE_API_KEY`,
  anything set by hand) are left alone, so change settings in `deploy/<env>.env`, not on the server.
  Secrets never go in those files: `deploy.sh` reads `YOUTUBE_API_KEY` from the 1Password item
  `timekeeper-server-youtube-api-key` (Automation vault) and sends it over SSH on stdin
  (`remote-update.sh` applies any `KEY=value` lines it receives there). Feature switches go into `ash.env` first and into `oak.env`
  after they have been checked on ash.
- TLS: Caddy terminates HTTPS on TCP 443 only (no port 80, no HTTP/3) with a Cloudflare Origin CA
  certificate and proxies to the app, WebSockets included. Only Cloudflare can connect: the droplet
  firewall allows Cloudflare's IP ranges on 443 (`../infra`), and Caddy requires Cloudflare's
  Authenticated Origin Pulls client certificate (mTLS), so a request that did not come from our
  Cloudflare zone is refused during the TLS handshake. The origin certificate, its key and the client
  certificate are OpenTofu outputs of `../infra/envs/<env>`; `deploy.sh` reads them and
  `remote-update.sh` installs them in `/etc/caddy/origin/`. Apply the infra first, then deploy. The
  zone's SSL/TLS mode must be **Full (strict)**.
- Logs: `journalctl -u timekeeper-server -f` and `journalctl -u caddy -f`.

## Google setup

Create an OAuth client of type **Web application** in Google Cloud Console and add
`https://www.youtube.com/` as an authorized redirect URI. Its client ID goes in both places:

- `GOOGLE_CLIENT_ID` for the server (verifies the ID token's audience)
- `SYNC_GOOGLE_CLIENT_ID` in `client/src/sync-client.ts`, along with `SYNC_API_URL`

The Sync tab stays disabled until both client constants are set.

## API

| Route | Auth | Purpose |
|---|---|---|
| `POST /auth/google` `{idToken}` | – | Verifies a Google ID token; creates the account on first login. Returns an access token (15 min), a refresh token (30 days) and the user. |
| `POST /auth/refresh` `{refreshToken}` | – | New access token **and a new refresh token**; the old one is single-use. See "Sessions" below. |
| `POST /auth/logout` `{refreshToken}` | – | Ends the whole session (every token issued since that sign-in). |
| `GET /me` | Bearer | Current user. |
| `POST /sync/push` `{deviceId, records, videos?}` | Bearer | Up to 500 records. Returns `rejected` (server copies that won) and the accepted seq range. |
| `GET /sync/pull?since=&limit=` | Bearer | Records changed after server seq `since`, plus the next cursor. |
| `GET /sync/ws` | first message | WebSocket. Send `{type:"auth", token, deviceId}` within 10 s; the server answers `{type:"ready"}` and then streams `{type:"changes", fromSeq, seq, records}` for pushes from the user's other devices. |
| `GET /videos/:videoId/access` | Bearer | `{known, membersOnly, channelId}`. |
| `POST /videos/access` | Bearer | `{videos: [{videoId, channelId, membersOnly}]}` (up to 50): reports what watch pages showed, for videos the user has timestamps on. |

## Sync model

Records use the userscript's own shape (`guid`, `video_id`, `start`, `comment`, `write_counter`,
`deleted_at`). Conflicts resolve by Lamport counter: the higher Lamport `write_counter` wins,
and deletions are soft (`deleted_at`) so they propagate. Every accepted change gets the next
per-user `seq`, which clients use as a pull cursor. The seqs of one push are contiguous, so a
client that receives `changes` with `fromSeq` at or below its cursor knows it missed nothing.

### Timestamp history

Each accepted version of a timestamp is also kept in `timestamp_history` (a full snapshot, not a
diff), so the timestamps page can show how one changed and restore an earlier version. Pushes
that lose, or replay what the server has, add nothing. To keep it small, an edit from the same
device within 5 minutes of the previous one replaces it (the first version never is), and only
the newest 50 versions per timestamp are kept. Timestamps that predate this have no history until
their next change, which records the version it replaced.

Restoring (`POST /web/timestamps/:guid/revert` `{seq}`, from the page only) writes the old content as
a *new* version one `write_counter` above the current one, so devices adopt it through the normal
merge rules: connected ones get it over the WebSocket, the rest on their next pull. The restore is
itself in the history, so it can be undone. `GET /web/timestamps/:guid/history` lists the versions.

## Members-only access

Whether a video is members-only is recorded, not yet enforced. The YouTube
Data API doesn't say if a video is members-only, and the server can't look it up itself (YouTube serves
datacenter IPs a bot challenge after a few requests). So the userscript reports it: it reads the "Members
only" badge and channel ID from the watch pages it sees, and attaches them as `videos: [{videoId,
channelId, membersOnly}]` to the next push of timestamps for that video. Entries for videos not in the
push, or malformed ones, are skipped without affecting the timestamps; the latest report wins.
Any signed-in user can report a video's status, so treat it as a hint.

## Landing page

`GET /` serves a small web app (`public/`): sign in with Google, browse your timestamps (the default
page), review your sessions on the account page, and **log out all sessions**.

- **Google setup:** add the server's own origin (e.g. `https://ash.kamotimestamps.com`) under
  *Authorized JavaScript origins* of the same OAuth client. The page uses Google's "Sign in with
  Google" button, which refuses to load from an origin that isn't listed. The userscript's
  `https://www.youtube.com/` redirect URI is unchanged.
- **Session:** an `HttpOnly; Secure; SameSite=Strict` cookie (`__Host-tk_web`), valid 7 days and
  invisible to page scripts. Requests that change state must carry `Origin: $PUBLIC_ORIGIN`, so
  set `PUBLIC_ORIGIN` to the exact public origin (no trailing slash).
- **Log out all sessions** ends every userscript and browser session of the account. Access tokens
  carry their session id and are checked against it on each request, so they stop working
  immediately instead of after up to 15 minutes, and open WebSockets are closed.
- **Session location:** each session shows where it signed in and where it was last active, as a
  place like "Astoria, NY, USA" (city, state or province for the US, Canada and Australia, and the
  country), with a country flag; the IP is in the tooltip. Userscripts update this on each token
  refresh, the page on each request. A stolen token used from somewhere else shows up as a different
  last-active location. Flags are emoji, which Windows browsers don't draw (they show the country
  letters), so the country name is also in the place. City is only as accurate as IP geolocation
  (the ISP's region, often not the street). IPs and places are kept only as long as the session exists.
- **Where the location comes from:** with `TRUST_PROXY_HEADERS=true` the app reads `X-Client-IP`,
  `X-Client-Country`, `X-Client-City` and `X-Client-Region`, which only the reverse proxy may set; the
  app must listen on loopback and be reachable only through it. Without it the IP is the socket
  address and there is no country or city. The dev setup's Caddy takes them from Cloudflare
  (`CF-Connecting-IP`, `CF-IPCountry`, `CF-IPCity`, `CF-Region-Code`) and only believes those headers
  when the connection comes from Cloudflare's published IP ranges, which `deploy/remote-update.sh`
  refreshes into `/etc/caddy/cloudflare-*.caddy` on every deploy. The city and region headers exist
  only with Cloudflare's **Add visitor location headers** managed transform turned on (Rules →
  Managed Transforms); without it sessions show just the country. Other deployments need an
  equivalent proxy rule.
- **Timestamps page** (`#/timestamps`): browse and search all your live timestamps, 50 per page,
  newest change first. Every search word must match the comment, the video ID, or a video's
  title/channel (title and channel need `YOUTUBE_API_KEY`; see "Video details"). Clicking a video shows just that video in playback order; clicking a time opens
  YouTube at that moment. `GET /web/timestamps?q=&video=&offset=`.
- **Google accounts** (account page): one Timekeeper account can have several Google accounts, any of which signs in
  to it (page and userscript). `POST /web/google-accounts` `{idToken}` links the Google account whose ID token it
  is; the token is verified first, and only then is the account checked against other users, so a `409
  google_account_in_use` is only ever told to someone who has just proved they own that Google account.
  `DELETE /web/google-accounts/:sub` unlinks one (`409 current_google_account` for the one this page signed
  in with, `409 last_google_account` for the only one). The sessions table shows which Google account each session
  used once there is more than one. Unlinking also ends every session of the
  user, userscripts and this page included, since the usual reason is a lost or compromised Google account; it
  answers `{revoked}` like `logout-all`. The account's email is that of its earliest-linked Google account.
- **Routes:** `GET /web/config`, `POST /web/login`, `GET /web/overview`, `GET /web/timestamps`, `POST /web/logout`,
  `POST /web/logout-all`, `POST /web/google-accounts`, `DELETE /web/google-accounts/:sub`, plus the static files under `/` and `/assets/`.

## Video details

With `YOUTUBE_API_KEY` set, the Timestamps page shows each video's thumbnail,
title and channel (from the YouTube Data API's `videos.list`) instead of the bare ID. Create the key
in Google Cloud Console, enable **YouTube Data API v3** and restrict the key to that API. Results are
cached in the `video_info` table for 24 hours, including "not found" for private or deleted videos,
so a page load costs at most one quota unit. New video IDs are looked up in the background as
soon as a push brings them in (50 per call), and at startup the server fills in any synced videos
that were never cached, so titles are searchable without anyone having to view them first. If YouTube can't be reached the page falls back to
the cached copy, or to the bare ID. Without a key nothing calls YouTube.

## Sessions

Each sign-in starts a token *family*. Refresh tokens are single-use and rotate on every refresh,
sliding for 30 days but never past 90 days after sign-in. Presenting a token that was already used
more than 60 s ago means two parties hold it, so the whole family is revoked and the user has to
sign in again. Within 60 s a repeat is accepted and gets a fresh token, because a refresh response
can be lost in transit and the client retries with the token it still has. The userscript refreshes
under a Web Lock and keeps the session in the userscript manager's storage (`GM.setValue`), so
several YouTube tabs never race each other with a stale token.

## Known limits

- If two devices edit the same timestamp offline and end up with the *same* `write_counter`, the
  first to reach the server wins and the other device keeps its own copy until the next edit (the
  userscript's merge also keeps the local copy on a tie).
- No rate limiting or per-user quota yet.
- Sessions can only be ended one at a time (sign out) or all at once (landing page); there is no per-session revoke.
