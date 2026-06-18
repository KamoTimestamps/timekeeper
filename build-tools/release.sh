#!/usr/bin/env bash
set -e

BUMP_TYPE="${1:-patch}"

# 1. Generate changelog + bump package.json version (skip commit/tag — we do them manually)
npx commit-and-tag-version --release-as "$BUMP_TYPE" --skip.commit --skip.tag

# 2. Sync version to manifest.json and src/version.ts
node build-tools/sync-version.js

# 3. Commit and tag
VERSION=$(node -p "require('./package.json').version")
git add -A
git commit -m "v$VERSION"
git tag -a "v$VERSION" -m "Timekeeper v$VERSION"

echo "Created release v$VERSION"
