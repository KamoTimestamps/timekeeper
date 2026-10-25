# End-to-end checks

Browser-driven checks that run the built bundle against the real youtube.com. They are
**not** part of the build and are not run in CI: they need Google Chrome, network access,
and YouTube behaving normally (consent walls, ads and layout changes can make them flaky).

Each script injects the bundle into the page's main world at document-start (like the
extension builds do) with stubbed `GM.*` APIs, so they exercise the same code as the
userscript. They do **not** reproduce a userscript manager's sandbox; check that by hand in
Violentmonkey/Tampermonkey (see "Userscript manager check" below).

## Setup

`playwright-core` is deliberately not a repo dependency. Install it anywhere outside the
repo and point Node at it:

```sh
mkdir -p /tmp/tk-e2e && (cd /tmp/tk-e2e && npm init -y && npm i playwright-core)
export NODE_PATH=/tmp/tk-e2e/node_modules
```

Chrome must be installed (the scripts launch the `chrome` channel, headless).
Build first so `dist/timekeeper.js` is current: `npm run build:userscript`.

## Scripts

| Script | What it checks |
|---|---|
| `behavior.js [bundle]` | Pass/fail assertions that the highlight follows playback and stays correct after seeks and outside edits/appends/removals of rows; seekbar markers (count, stylesheet-driven look, position, delegated click-to-seek); inline header icons; live-stream display paths (red when behind live, pointer cursor, speed label) using a mocked player. Exit code is non-zero on any failure. |
| `bench.js [bundle] [rows] [seconds] [videoId]` | Seeds `rows` timestamps (default 600), plays for `seconds` (default 15) and reports main-thread time spent inside the bundle's call stacks per second of playback, from a CDP CPU profile. Compare before/after a change. |
| `build-profile-bundle.js <outfile>` | Builds an unminified bundle with readable function names. Pass it to `bench.js` to see which functions are hot. |
| `history-state.js [bundle]` | Player API surface (`getProgressState`, `getVideoData`, ...) and that pause/play does not wipe YouTube's `history.state`. |
| `storage-resilience.js [bundle]` | Data-safety checks: pending comment edits are flushed on `yt-navigate-start` / `pagehide` / `visibilitychange`; UI edits are row-level (a stale pane can't tombstone rows it hasn't loaded, "clear all" isn't undone by a pending save); one corrupt row doesn't hide the rest; a failed Drive listing (mocked `googleapis.com`) aborts the backup instead of uploading a duplicate file; a DB upgrade from another tab isn't blocked. Run it against an older bundle to see each check fail. Exit code is non-zero on any failure. |
| `dvr-flag.js [bundle] [url]` | The `ytcfg` hook installs and `html5_max_live_dvr_window_plus_margin_secs` is lifted from `46800` to `604800`. |

`bundle` defaults to `dist/timekeeper.js` for `behavior.js` and `bench.js`. When you pass
`rows` to `bench.js` you must pass the bundle before it.

```sh
node build-tools/e2e/behavior.js
node build-tools/e2e/build-profile-bundle.js /tmp/tk-prof.js
node build-tools/e2e/bench.js /tmp/tk-prof.js 2500 15
```

Reference numbers (main-thread ms per playback second, v5.0.25): about 0.9 at 600 rows
and 2.6 at 2,500 rows, down from 6.9 and 28.8 in v5.0.23.

The scripts seed synthetic rows into the throwaway browser profile's IndexedDB
(`ytls-timestamps-db` / `timestamps_v2`); they never touch your real Chrome profile.

## Userscript manager check

The sandbox bug fixed in v5.0.23 (DVR hooks defined on the sandbox `window`) only shows up
inside a real userscript manager. To check by hand: install the built `timekeeper.user.js`
in Violentmonkey, open a live stream, and in the page console confirm

```js
ytcfg.__dvrHooked  // true
Object.values(ytcfg.d().WEB_PLAYER_CONTEXT_CONFIGS)[0].serializedExperimentFlags
  .match(/html5_max_live_dvr_window_plus_margin_secs=[\d.]+/)[0]  // ...=604800
```

The widening of `maxDvrDurationSec` only applies to streams older than 12 hours, so it
needs a stream that has been live that long.
