#!/usr/bin/env bash
# Runs on the server as root (normally via ../deploy.sh). Idempotent: installs whatever is
# missing (Node, Caddy, user, service), then installs dependencies and restarts the app.
set -euo pipefail

NODE_VERSION=24.22.1
CADDY_VERSION=2.11.7
APP_DIR=/opt/timekeeper/server
ENV_FILE=/etc/timekeeper/server.env
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log() { printf '==> %s\n' "$*"; }
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT

if ! command -v node >/dev/null || [[ "$(node -v)" != "v$NODE_VERSION" ]]; then
  log "Installing Node $NODE_VERSION"
  base="https://nodejs.org/dist/v$NODE_VERSION"
  file="node-v$NODE_VERSION-linux-x64.tar.xz"
  curl -fsSL -o "$tmp/$file" "$base/$file"
  curl -fsSL -o "$tmp/SHASUMS256.txt" "$base/SHASUMS256.txt"
  (cd "$tmp" && grep " $file\$" SHASUMS256.txt | sha256sum -c -)
  tar -xJf "$tmp/$file" -C /usr/local --strip-components=1 --exclude='*.md' --exclude=LICENSE --exclude=CHANGELOG.md
fi

if ! command -v caddy >/dev/null || ! caddy version | grep -q "v$CADDY_VERSION"; then
  log "Installing Caddy $CADDY_VERSION"
  base="https://github.com/caddyserver/caddy/releases/download/v$CADDY_VERSION"
  file="caddy_${CADDY_VERSION}_linux_amd64.deb"
  curl -fsSL -o "$tmp/$file" "$base/$file"
  curl -fsSL -o "$tmp/checksums.txt" "$base/caddy_${CADDY_VERSION}_checksums.txt"
  (cd "$tmp" && grep " $file\$" checksums.txt | sha512sum -c -)
  DEBIAN_FRONTEND=noninteractive apt-get install -y "$tmp/$file"
fi

id timekeeper >/dev/null 2>&1 || useradd --system --home-dir /var/lib/timekeeper --shell /usr/sbin/nologin timekeeper

mkdir -p /etc/timekeeper
if [[ ! -f $ENV_FILE ]]; then
  log "Creating $ENV_FILE (set GOOGLE_CLIENT_ID in it)"
  (
    umask 077
    cat > "$ENV_FILE" <<ENV
# Replace with the Google OAuth client ID used by the userscript (see server/README.md).
GOOGLE_CLIENT_ID=unset.apps.googleusercontent.com
JWT_SECRET=$(head -c 48 /dev/urandom | base64 | tr -d '\n=+/')
ALLOWED_ORIGINS=https://www.youtube.com
HOST=127.0.0.1
PORT=8787
ENV
  )
fi
chmod 600 "$ENV_FILE"
# The landing page only accepts requests from this origin (must match the Caddyfile's site address).
grep -q '^PUBLIC_ORIGIN=' "$ENV_FILE" || echo 'PUBLIC_ORIGIN=https://devel.kamotimestamps.com' >> "$ENV_FILE"
# Caddy (below) sets X-Client-IP / X-Client-Country and the app only listens on loopback.
grep -q '^TRUST_PROXY_HEADERS=' "$ENV_FILE" || echo 'TRUST_PROXY_HEADERS=true' >> "$ENV_FILE"

log "Installing dependencies"
chown -R root:root /opt/timekeeper
(cd "$APP_DIR" && npm ci --omit=dev --no-audit --no-fund)

if ! cmp -s "$SRC/timekeeper-server.service" /etc/systemd/system/timekeeper-server.service; then
  install -m 644 "$SRC/timekeeper-server.service" /etc/systemd/system/timekeeper-server.service
  systemctl daemon-reload
fi
systemctl enable timekeeper-server >/dev/null 2>&1

# Cloudflare proxies this site, so the connecting address is always a Cloudflare edge. Caddy may only
# believe CF-Connecting-IP / CF-IPCountry when the peer really is in Cloudflare's published ranges,
# otherwise anyone who reaches the origin directly could forge a location.
caddy_changed=0
mkdir -p "$tmp/caddy-backup"
cp -a /etc/caddy/. "$tmp/caddy-backup/"

write_if_changed() { # file content
  if [[ ! -f $1 ]] || [[ "$(cat "$1")" != "$2" ]]; then
    printf '%s\n' "$2" > "$1"
    caddy_changed=1
  fi
}

cf_ranges=""
if cf_all="$(curl -fsSL https://www.cloudflare.com/ips-v4 && echo && curl -fsSL https://www.cloudflare.com/ips-v6)"; then
  cf_ranges="$(printf '%s\n' "$cf_all" | grep -E '^[0-9a-fA-F:.]+/[0-9]+$' | tr '\n' ' ' | sed 's/ $//')"
fi
if (( $(wc -w <<<"$cf_ranges") >= 10 )); then
  write_if_changed /etc/caddy/cloudflare-trusted-proxies.caddy "trusted_proxies static $cf_ranges"
  write_if_changed /etc/caddy/cloudflare-peer.caddy "$(printf '@notViaCloudflare {\n\tnot remote_ip %s\n}' "$cf_ranges")"
elif [[ -f /etc/caddy/cloudflare-peer.caddy && -f /etc/caddy/cloudflare-trusted-proxies.caddy ]]; then
  log "Could not refresh Cloudflare IP ranges; keeping the previous list"
else
  echo "Could not fetch Cloudflare IP ranges" >&2
  exit 1
fi

if ! cmp -s "$SRC/Caddyfile" /etc/caddy/Caddyfile; then
  install -m 644 "$SRC/Caddyfile" /etc/caddy/Caddyfile
  caddy_changed=1
fi
if (( caddy_changed )); then
  log "Updating Caddy config"
  if ! caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile; then
    cp -a "$tmp/caddy-backup/." /etc/caddy/
    echo "New Caddy config is invalid; restored the previous one" >&2
    exit 1
  fi
  systemctl reload caddy || systemctl restart caddy
fi

log "Restarting timekeeper-server"
systemctl restart timekeeper-server
for _ in $(seq 1 20); do
  if curl -fsS http://127.0.0.1:8787/healthz >/dev/null 2>&1; then
    log "Healthy: $(curl -fsS http://127.0.0.1:8787/healthz)"
    exit 0
  fi
  sleep 0.5
done
journalctl -u timekeeper-server -n 30 --no-pager >&2
echo "App did not become healthy" >&2
exit 1
