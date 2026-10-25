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

## Dev server (devel.kamotimestamps.com)

`./deploy.sh` (from `server/`) rsyncs this directory to `timekeeper-devel` and runs
`deploy/remote-update.sh` there. That script is idempotent: it installs Node and Caddy if missing,
runs `npm ci`, installs the systemd unit and Caddyfile when they changed, restarts the app and
waits for `/healthz`. Re-run it for every update. Set `DEPLOY_HOST` to deploy elsewhere.

- App: `timekeeper-server.service`, listening on `127.0.0.1:8787` as user `timekeeper`; the
  SQLite database is `/var/lib/timekeeper/timekeeper.db`.
- Config: `/etc/timekeeper/server.env` (created on first deploy, never overwritten). Set
  `GOOGLE_CLIENT_ID` there, then `systemctl restart timekeeper-server`.
- TLS: Caddy terminates HTTPS with Let's Encrypt's `shortlived` profile (about 6-day
  certificates, renewed automatically) and proxies to the app, WebSockets included.
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
| `POST /sync/push` `{deviceId, records}` | Bearer | Up to 500 records. Returns `rejected` (server copies that won) and the accepted seq range. |
| `GET /sync/pull?since=&limit=` | Bearer | Records changed after server seq `since`, plus the next cursor. |
| `GET /sync/ws` | first message | WebSocket. Send `{type:"auth", token, deviceId}` within 10 s; the server answers `{type:"ready"}` and then streams `{type:"changes", fromSeq, seq, records}` for pushes from the user's other devices. |

## Sync model

Records use the userscript's own shape (`guid`, `video_id`, `start`, `comment`, `write_counter`,
`deleted_at`). Conflicts resolve like a backup restore: the higher Lamport `write_counter` wins,
and deletions are soft (`deleted_at`) so they propagate. Every accepted change gets the next
per-user `seq`, which clients use as a pull cursor. The seqs of one push are contiguous, so a
client that receives `changes` with `fromSeq` at or below its cursor knows it missed nothing.

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
- A revoked session's open WebSocket stays connected until it reconnects (access tokens last at
  most 15 minutes).
- No "sign out everywhere" endpoint yet; logout ends only the current session.
