# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Timekeeper is a userscript browser extension for YouTube that lets viewers add, manage, and share timestamps on video content. It also enables DVR/rewind on live streams and supports Google Drive backup. Built with TypeScript + esbuild, targeting Tampermonkey/Violentmonkey.

## Building

```
make build          # Install deps, build for chromium + firefox + userscript
npm run build:userscript  # Build userscript output only (timekeeper.user.js)
npm run clean       # Remove dist/
```

The build pipeline: esbuild bundles `src/timekeeper.ts` -> `dist/`, minifies CSS via `cleancss`, injects minified CSS into the bundle, then prepends a userscript header to produce `timekeeper.user.js`.

## Architecture

### Entry Point

- `src/timekeeper.ts` — Main entry. Bootstraps the app: initializes DVR enablement, sets up URL change handlers, renders the timestamp pane, wires up all interactions. ~600 lines.

### Layered Architecture

The codebase follows a repository-service-model pattern:

| Layer | Files | Responsibility |
|-------|-------|----------------|
| **Schema** | `src/schema.ts` | All Zod schemas (TimestampRecord, AppState, BackupSettings, etc.) — single source of truth for data shapes |
| **Repository** | `src/services/timestampRepository.ts` | Raw IndexedDB operations (open, CRUD, migrations) |
| **Service** | `src/services/timestampService.ts` | Business logic: export/import, merge, validation |
| **Model (facade)** | `src/timestamp-model.ts` | Public API exports that delegate to service + repository |
| **State** | `src/services/state.ts` | Centralized AppState with listeners. All modules read/write through here. |
| **View** | `src/timestamp-view.ts` | DOM manipulation, rendering, UI state management |

### Key Modules

| File | Purpose |
|------|---------|
| `src/dvr-enablement.ts` | Intercepts YouTube's `playerResponse` getter/setter to enable DVR/rewind on live streams |
| `src/google-drive.ts` | OAuth2 auth flow, backup scheduling, Drive file upload (uses fflate for zip) |
| `src/icons.ts` | Tabler icon imports and DOM creation helpers |
| `src/tooltip.ts` | Custom tooltip system with mouse-following positioning |
| `src/util.ts` | Shared utilities: logging, time formatting, URL building |
| `src/styles.css` | All CSS (minified at build time into `src/styles.ts`) |
| `src/version.ts` | Version string (auto-updated by `make bump`) |

### Data Flow

1. YouTube page loads -> `timekeeper.ts` bootstraps
2. DVR enablement hooks `playerResponse` before YouTube's player initializes
3. URL observation detects video changes -> loads timestamps from IndexedDB via `timestamp-model`
4. `timestamp-view` renders the timestamp pane UI
5. User interactions -> service layer -> repository layer -> IndexedDB
6. State changes propagate via AppState listeners

### Key Constants

- IndexedDB name: `ytls-timestamps-db`, version 3
- Stores: `timestamps_v2` (main), `settings` (key-value), `timestamps` (legacy)
- Content script runs at `document_start` in MAIN world on `https://www.youtube.com/*`

## Development Notes

- `strict: false` in tsconfig — don't add `strict: true` without explicit direction
- No test framework configured. Tests are ad-hoc via browser console.
- CSS is authored in `src/styles.css` and minified at build time. Edit the source, not `src/styles.ts`.
- Version is managed in `package.json` and synced to `src/version.ts` via `make bump` and the build's `sync-version.js`.
- The `metadata/videos.csv` file contains video metadata used by the extension.

## Graphify

A knowledge graph is maintained at `graphify-out/`. Rules:
- Before answering architecture/codebase questions, read `graphify-out/GRAPH_REPORT.md` for god nodes and community structure
- If `graphify-out/wiki/index.md` exists, navigate it instead of reading raw files
- After modifying code files, run `graphify update .` to keep the graph current
