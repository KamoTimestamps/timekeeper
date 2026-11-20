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

`ash` is staging and `oak` is production. Both run as Deployments in the home Kubernetes cluster,
defined in `apps/timekeeper-ash` and `apps/timekeeper-oak` of
[nlopez/k8s_home](https://github.com/nlopez/k8s_home); Argo CD syncs that repo's `main` branch.
A change reaches ash first, is checked there, and is then promoted to oak.

### Image and promotion

`.github/workflows/server-image.yml` runs the typecheck and tests, and on pushes to `main` and
`devel` that touch `server/**` publishes `ghcr.io/kamotimestamps/timekeeper-server:<yyyy.mm.dd>-<run>`
(pull requests build the image without pushing it). A new GHCR package starts private and has to be
made public once in the organization's package settings; the cluster pulls it anonymously.

1. Renovate opens a PR in k8s_home that bumps the `image:` tag in `apps/timekeeper-ash/deployment.yaml`.
   Merge it, then check ash.
2. Put the same tag in `apps/timekeeper-oak/deployment.yaml` by hand. Renovate skips oak on purpose.

### Cluster setup

- **App:** one replica with the `Recreate` strategy, because the SQLite database lives on a
  ReadWriteOnce volume. The database is `/data/timekeeper.db` on the `data` PVC, and the container
  runs as uid 1000 (`DATABASE_PATH=/data/timekeeper.db` is baked into the image).
- **Config:** environment variables on the Deployment. Non-secret settings (`GOOGLE_CLIENT_ID`,
  `ALLOWED_ORIGINS`, `PUBLIC_ORIGIN`, `TRUST_PROXY_HEADERS`, feature switches such as
  `FEATURE_MINI_PLAYER`) are inline in `apps/timekeeper-<env>/deployment.yaml`. `JWT_SECRET` and
  `YOUTUBE_API_KEY` come from the Secret `onepassword-timekeeper-server`, which the 1Password
  operator creates from the item `timekeeper-server-<env>` in the Automation vault. Secrets never go
  in git. Feature switches go into ash first and into oak after they have been checked on ash.
- **Edge:** Cloudflare proxies the hostname (SSL/TLS mode **Full (strict)**) to the cluster's
  `internet` Gateway (Envoy Gateway), which terminates TLS on TCP 443 with a Let's Encrypt
  certificate for `ash`/`oak.kamotimestamps.com`. WebSockets (`/sync/ws`) are proxied. DNS is a
  proxied CNAME to the gateway's public name, created by external-dns from the HTTPRoute.
- **Only Cloudflare can connect:** the gateway requires Authenticated Origin Pulls (mTLS). Cloudflare
  presents the self-signed per-hostname client certificate that `../infra/modules/droplet` uploads
  for each hostname, so the gateway trusts those certificates (ConfigMap `timekeeper-aop-ca` in
  k8s_home, next to Cloudflare's own origin-pull CA). When a certificate is rotated with
  `tofu apply -replace=module.droplet.tls_private_key.aop`, update that ConfigMap with the new
  public certificate (the `aop_client_certificate_pem` output).
- **Client info headers:** the app reads `X-Client-IP`, `X-Client-Country`, `X-Client-City` and
  `X-Client-Region` (`TRUST_PROXY_HEADERS=true`). An `EnvoyExtensionPolicy` (Lua) on each route
  deletes any client-supplied copies and fills them from Cloudflare's `CF-Connecting-IP`,
  `CF-IPCountry`, `CF-IPCity` and `CF-Region-Code`. Envoy Gateway only accepts Lua policies when
  `extensionApis.enableLua` is set in its Helm values; without it the route answers 500.
- **Logs:** `kubectl logs -n timekeeper-<env> deploy/timekeeper-server -f`.

### Droplets

`deploy.sh`, `deploy/` and `../infra` provision and update the previous DigitalOcean droplets
(Node, Caddy and a systemd unit behind the same Cloudflare zone). The cluster deployment does not use
them; they remain until the droplets are retired.

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
  `X-Client-Country`, `X-Client-City` and `X-Client-Region`, which only the reverse proxy may set, so
  the app must be reachable only through it. Without it the IP is the socket address and there is no
  country or city. In the cluster, a Lua `EnvoyExtensionPolicy` on the route copies them from
  Cloudflare's `CF-Connecting-IP`, `CF-IPCountry`, `CF-IPCity` and `CF-Region-Code` after removing any
  client-supplied values; the gateway only accepts connections that present the Authenticated Origin
  Pulls client certificate, so those headers can only come from our Cloudflare zone (see "Deployed
  servers"). The city and region headers exist only with Cloudflare's **Add visitor location
  headers** managed transform turned on (Rules → Managed Transforms); without it sessions show just
  the country. Other deployments need an equivalent proxy rule.
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
