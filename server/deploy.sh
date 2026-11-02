#!/usr/bin/env bash
# Deploys server/ to ash (staging) or oak (production) and restarts it. Safe to re-run; first run
# also provisions Node, Caddy and the systemd service.   Usage: ./deploy.sh ash|oak   (from server/)
# SSH target defaults to root@timekeeper-<env>, the droplet's Tailscale (MagicDNS) name; port 22 is
# closed to the internet. Set DEPLOY_HOST to use another address. Needs the 1Password CLI (`op`).
set -euo pipefail

ENV_NAME="${1:-}"
case "$ENV_NAME" in
  ash|oak) ;;
  *) echo "Usage: $0 ash|oak" >&2; exit 2 ;;
esac
HOST="${DEPLOY_HOST:-root@timekeeper-$ENV_NAME}"
cd "$(dirname "${BASH_SOURCE[0]}")"

ssh "$HOST" 'mkdir -p /opt/timekeeper/server'
rsync -az --delete \
  --exclude node_modules --exclude data --exclude test --exclude '.env*' --exclude Dockerfile \
  ./ "$HOST:/opt/timekeeper/server/"
# Secrets come from 1Password and travel over SSH on stdin as KEY=value lines (never argv or git).
youtube_key="$(op read 'op://Automation/timekeeper-server-youtube-api-key/credential')"
[[ -n $youtube_key ]] || { echo "Empty YouTube API key from 1Password" >&2; exit 1; }
ssh "$HOST" "TK_ENV=$ENV_NAME bash /opt/timekeeper/server/deploy/remote-update.sh" <<<"YOUTUBE_API_KEY=$youtube_key"
