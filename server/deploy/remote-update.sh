#!/usr/bin/env bash
# Runs on the server as root (normally via ../deploy.sh). Idempotent: installs whatever is
# missing (Node, Caddy, user, service), then installs dependencies and restarts the app.
set -euo pipefail

NODE_VERSION=24.22.1
CADDY_VERSION=2.11.7
APP_DIR=/opt/timekeeper/server
ENV_FILE=/etc/timekeeper/server.env
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
: "${TK_ENV:?set TK_ENV to ash or oak (deploy.sh does this)}"
TK_HOSTNAME="$TK_ENV.kamotimestamps.com"
SETTINGS="$SRC/$TK_ENV.env"
[[ -f $SETTINGS ]] || { echo "Missing $SETTINGS" >&2; exit 1; }

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
  log "Creating $ENV_FILE"
  (
    umask 077
    cat > "$ENV_FILE" <<ENV
JWT_SECRET=$(head -c 48 /dev/urandom | base64 | tr -d '\n=+/')
HOST=127.0.0.1
PORT=8787
ENV
  )
fi
chmod 600 "$ENV_FILE"

# Sets KEY=value in $ENV_FILE: replaces the existing line, or appends. Other lines are untouched.
set_env() { # key value
  if grep -q "^$1=" "$ENV_FILE"; then
    K="$1" V="$2" awk 'BEGIN { FS = "=" } $1 == ENVIRON["K"] { print ENVIRON["K"] "=" ENVIRON["V"]; next } { print }' \
      "$ENV_FILE" > "$tmp/server.env"
    cat "$tmp/server.env" > "$ENV_FILE"
  else
    echo "$1=$2" >> "$ENV_FILE"
  fi
}
# Apply the non-secret settings committed in deploy/<env>.env. Keys that are not listed there
# (JWT_SECRET, API keys, anything set by hand) are left alone.
while IFS= read -r line || [[ -n $line ]]; do
  [[ $line =~ ^[A-Za-z_][A-Za-z0-9_]*= ]] || continue
  set_env "${line%%=*}" "${line#*=}"
done < "$SETTINGS"
# Secrets arrive on stdin as KEY=value lines (deploy.sh reads them from 1Password).
if [[ ! -t 0 ]]; then
  while IFS= read -r line || [[ -n $line ]]; do
    [[ $line =~ ^[A-Za-z_][A-Za-z0-9_]*= ]] || continue
    set_env "${line%%=*}" "${line#*=}"
  done
fi
# The landing page only accepts requests from this origin (must match the Caddyfile's site address).
set_env PUBLIC_ORIGIN "https://$TK_HOSTNAME"
# Caddy (below) sets X-Client-IP / -Country / -City / -Region and the app only listens on loopback.
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
# believe CF-Connecting-IP / CF-IPCountry / CF-IPCity / CF-Region-Code when the peer really is in Cloudflare's published ranges,
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

sed "s/__TK_HOSTNAME__/$TK_HOSTNAME/g" "$SRC/Caddyfile" > "$tmp/Caddyfile"
if ! cmp -s "$tmp/Caddyfile" /etc/caddy/Caddyfile; then
  install -m 644 "$tmp/Caddyfile" /etc/caddy/Caddyfile
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
