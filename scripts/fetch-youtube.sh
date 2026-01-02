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

# Members playlist (configurable via env var)
MEMBERS_PLAYLIST_ID="${MEMBERS_PLAYLIST_ID:-PLdYZ6BFI3lubQLzjXvXoQdbgWks1ntUBJ}"

# Helper to fetch all video IDs from a playlist (paginated)
fetch_playlist_ids() {
  local playlist_id="$1"
  local page_token=""
  while :; do
    local page_param=""
    if [ -n "$page_token" ]; then
      page_param="&pageToken=$page_token"
    fi
    local url="https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlist_id}&maxResults=50&key=${API_KEY}${page_param}"
    local resp
    resp=$(fetch_with_retries "$url")
    echo "$resp" | jq -r '.items[]? | .snippet.resourceId.videoId'
    page_token=$(echo "$resp" | jq -r '.nextPageToken // empty')
    if [ -z "$page_token" ]; then
      break
    fi
  done
}

# Get the uploads playlist ID for the channel (more reliable for listing all uploads)
CHANNEL_URL="https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}"
CHANNEL_RESP=$(fetch_with_retries "$CHANNEL_URL")
UPLOADS_PLAYLIST=$(echo "$CHANNEL_RESP" | jq -r '.items[0].contentDetails.relatedPlaylists.uploads // empty')
if [ -z "$UPLOADS_PLAYLIST" ]; then
  echo "Could not find uploads playlist for channel $CHANNEL_ID" >&2
  exit 1
fi

# Temporary files
TMP_ITEMS="$OUT_DIR/_yt_items.tsv"
TMP_OUT="$OUT_DIR/_yt_out.csv"
: > "$TMP_ITEMS"

# Helper to fetch all playlistItems and append simplified TSV rows to $TMP_ITEMS
# Columns: videoId, title (tabs/newlines replaced), published_at (contentDetails.videoPublishedAt or snippet.publishedAt), thumbnail_url, origin
fetch_playlist_items() {
  local playlist_id="$1"
  local origin="$2"
  local page_token=""
  while :; do
    local page_param=""
    if [ -n "$page_token" ]; then
      page_param="&pageToken=$page_token"
    fi
    local url="https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlist_id}&maxResults=50&key=${API_KEY}${page_param}"
    local resp
    resp=$(fetch_with_retries "$url")
    # Use jq to extract fields and normalize title/thumbnail (remove tabs/newlines)
    echo "$resp" | jq -r --arg origin "$origin" '.items[]? | [ .snippet.resourceId.videoId, (.snippet.title | gsub("\t"; " ") | gsub("\n"; " ") ), (.contentDetails.videoPublishedAt // .snippet.publishedAt // ""), (.snippet.thumbnails.maxres.url // .snippet.thumbnails.high.url // .snippet.thumbnails.medium.url // .snippet.thumbnails.default.url // ""), $origin ] | @tsv' >> "$TMP_ITEMS"

    page_token=$(echo "$resp" | jq -r '.nextPageToken // empty')
    if [ -z "$page_token" ]; then
      break
    fi
  done
}

# Fetch members and uploads playlist items into the temp TSV
fetch_playlist_items "$MEMBERS_PLAYLIST_ID" "members"
fetch_playlist_items "$UPLOADS_PLAYLIST" "uploads"

# Merge TSV rows: prefer non-empty fields and mark members=true if any origin=members
awk -F"\t" '
function esc(s){ gsub(/\r/,"",s); gsub(/\n/," ",s); gsub(/"/,"""",s); return s }
{ id=$1; title=$2; pub=$3; thumb=$4; origin=$5;
  if(!(id in seen)){
    titlemap[id]=title; pubmap[id]=pub; thumbmap[id]=thumb; seen[id]=1; order[++n]=id
  } else {
    if(titlemap[id]=="" && title!="") titlemap[id]=title
    if(pubmap[id]=="" && pub!="") pubmap[id]=pub
    if(thumbmap[id]=="" && thumb!="") thumbmap[id]=thumb
  }
  if(origin=="members") members[id]=1
}
END{
  for(i=1;i<=n;i++){ id=order[i]; t=esc(titlemap[id]); p=esc(pubmap[id]); th=esc(thumbmap[id]); m=(members[id]?"true":"false"); printf "\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n", id, t, p, th, m }
}' "$TMP_ITEMS" > "$TMP_OUT"

# Write header and sorted rows (sort by video id for determinism)
printf "video_id,title,published_at,thumbnail_url,members\n" > "$OUT_FILE"
sort -t, -k1,1 "$TMP_OUT" >> "$OUT_FILE"

# Cleanup
rm -f "$TMP_ITEMS" "$TMP_OUT"

echo "Wrote $OUT_FILE"
