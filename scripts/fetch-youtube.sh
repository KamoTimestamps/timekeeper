#!/usr/bin/env bash
set -euo pipefail

# Fetch all videos for a channel and write a CSV (video_id,title)
# Expects environment variable: YOUTUBE_API_KEY
# Usage: bash scripts/fetch-youtube.sh [output-dir]

API_KEY=${YOUTUBE_API_KEY:?Environment variable YOUTUBE_API_KEY is required}
CHANNEL_ID="UClxj3GlGphZVgd1SLYhZKmg"
OUT_DIR="${1:-artifacts}"
OUT_FILE="$OUT_DIR/videos.csv"

mkdir -p "$OUT_DIR"
# CSV header
printf "video_id,title\n" > "$OUT_FILE"

PAGE_TOKEN=""
while true; do
  if [ -n "$PAGE_TOKEN" ]; then
    PAGE_PARAM="&pageToken=$PAGE_TOKEN"
  else
    PAGE_PARAM=""
  fi

  RESPONSE=$(curl -s "https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=50&type=video${PAGE_PARAM}")

  # Use jq to extract videoId and title; then write CSV-escaped lines
  echo "$RESPONSE" | jq -r '.items[] | [.id.videoId, .snippet.title] | @tsv' | while IFS=$'\t' read -r id title; do
    # sanitize title: remove newlines and escape double quotes by doubling them
    clean_title=$(echo "$title" | tr '\n' ' ' | sed 's/"/""/g')
    printf '"%s","%s"\n' "$id" "$clean_title" >> "$OUT_FILE"
  done

  NEXT=$(echo "$RESPONSE" | jq -r '.nextPageToken // empty')
  if [ -z "$NEXT" ]; then
    break
  fi
  PAGE_TOKEN="$NEXT"
done

echo "Wrote $OUT_FILE"
