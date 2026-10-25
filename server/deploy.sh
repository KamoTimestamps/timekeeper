#!/usr/bin/env bash
# Deploys server/ to the dev server and restarts it. Safe to re-run; first run also provisions
# Node, Caddy and the systemd service.   Usage: ./deploy.sh        (from server/)
set -euo pipefail

HOST="${DEPLOY_HOST:-root@timekeeper-devel}"
cd "$(dirname "${BASH_SOURCE[0]}")"

ssh "$HOST" 'mkdir -p /opt/timekeeper/server'
rsync -az --delete \
  --exclude node_modules --exclude data --exclude test --exclude '.env*' --exclude Dockerfile \
  ./ "$HOST:/opt/timekeeper/server/"
ssh "$HOST" 'bash /opt/timekeeper/server/deploy/remote-update.sh'
