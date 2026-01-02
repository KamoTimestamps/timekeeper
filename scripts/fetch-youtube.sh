#!/usr/bin/env bash
set -euo pipefail

# Fetch all videos for a channel and write a CSV (video_id,title)
# Expects environment variable: YOUTUBE_API_KEY
# Usage: bash scripts/fetch-youtube.sh [output-dir]

API_KEY=${YOUTUBE_API_KEY:?Environment variable YOUTUBE_API_KEY is required}
CHANNEL_ID="UClxj3GlGphZVgd1SLYhZKmg"
OUT_DIR="${1:-artifacts}"
OUT_FILE="$OUT_DIR/videos.csv"
RETRIES=5

command -v jq >/dev/null 2>&1 || { echo "jq is required but not installed" >&2; exit 1; }
command -v curl >/dev/null 2>&1 || { echo "curl is required but not installed" >&2; exit 1; }

mkdir -p "$OUT_DIR"
# CSV header (members = true/false if the video appears in the members playlist)
printf "video_id,title,published_at,thumbnail_url,members\n" > "$OUT_FILE"

# Helper: fetch URL with retries and exponential backoff; returns response body
fetch_with_retries() {
  local url="$1"
  local attempt=1
  local wait=1
  while true; do
    resp=$(curl -sS "$url" || true)
    # If the response contains an error object, treat as failure
    if echo "$resp" | jq -e '.error' >/dev/null 2>&1; then
      code=$(echo "$resp" | jq -r '.error.code // empty')
      msg=$(echo "$resp" | jq -r '.error.message // empty')
      if [ "$attempt" -lt "$RETRIES" ]; then
        echo "Request failed (attempt $attempt): $code $msg; retrying in $wait s..." >&2
        sleep "$wait"
        attempt=$((attempt + 1))
        wait=$((wait * 2))
        continue
      else
        echo "Request failed after $RETRIES attempts: $code $msg" >&2
        exit 1
      fi
    fi
    # assume success
    printf "%s" "$resp"
    return 0
  done
}

# Fetch members playlist IDs so we can mark videos that are members-only
MEMBERS_PLAYLIST_ID="PLdYZ6BFI3lubQLzjXvXoQdbgWks1ntUBJ"
declare -A MEMBERS_MAP
fetch_playlist_ids() {
  local playlist_id="$1"
  local page_token=""
  while :; do
    local page_param=""
    if [ -n "$page_token" ]; then
      page_param="&pageToken=$page_token"
    fi
    local url="https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlist_id}&maxResults=50&key=${API_KEY}${page_param}"
    local resp
    resp=$(fetch_with_retries "$url")
    echo "$resp" | jq -r '.items[]?.snippet.resourceId.videoId'
    page_token=$(echo "$resp" | jq -r '.nextPageToken // empty')
    if [ -z "$page_token" ]; then
      break
    fi
  done
}

# populate MEMBERS_MAP
while IFS= read -r vid; do
  if [ -n "$vid" ]; then
    MEMBERS_MAP["$vid"]=1
  fi
done < <(fetch_playlist_ids "$MEMBERS_PLAYLIST_ID")

# Get the uploads playlist ID for the channel (more reliable for listing all uploads)
CHANNEL_URL="https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}"
CHANNEL_RESP=$(fetch_with_retries "$CHANNEL_URL")
UPLOADS_PLAYLIST=$(echo "$CHANNEL_RESP" | jq -r '.items[0].contentDetails.relatedPlaylists.uploads // empty')
if [ -z "$UPLOADS_PLAYLIST" ]; then
  echo "Could not find uploads playlist for channel $CHANNEL_ID" >&2
  exit 1
fi

PAGE_TOKEN=""
while :; do
  if [ -n "$PAGE_TOKEN" ]; then
    PAGE_PARAM="&pageToken=$PAGE_TOKEN"
  else
    PAGE_PARAM=""
  fi

  URL="https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${UPLOADS_PLAYLIST}&maxResults=50&key=${API_KEY}${PAGE_PARAM}"
  RESPONSE=$(fetch_with_retries "$URL")

  # Extract video ID, title, published_at (contentDetails.videoPublishedAt), thumbnail url (prefer maxres->high->medium->default)
  echo "$RESPONSE" | jq -r '.items[] | [ .snippet.resourceId.videoId, .snippet.title, (.contentDetails.videoPublishedAt // .snippet.publishedAt // ""), (.snippet.thumbnails.maxres.url // .snippet.thumbnails.high.url // .snippet.thumbnails.medium.url // .snippet.thumbnails.default.url // "") ] | @tsv' | while IFS=$'\t' read -r id title published_at thumbnail; do
    # sanitize title and thumbnail: remove newlines and escape double quotes by doubling them
    clean_title=$(echo "$title" | tr '\n' ' ' | sed 's/"/""/g')
    clean_thumbnail=$(echo "$thumbnail" | tr '\n' ' ' | sed 's/"/""/g')
    clean_published=$(echo "$published_at" | tr '\n' ' ' | sed 's/"/""/g')
    members=false
    if [ -n "${MEMBERS_MAP[$id]:-}" ]; then
      members=true
    fi
    printf '"%s","%s","%s","%s","%s"\n' "$id" "$clean_title" "$clean_published" "$clean_thumbnail" "$members" >> "$OUT_FILE"
  done

  PAGE_TOKEN=$(echo "$RESPONSE" | jq -r '.nextPageToken // empty')
  if [ -z "$PAGE_TOKEN" ]; then
    break
  fi
done

echo "Wrote $OUT_FILE"
