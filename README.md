# Timekeeper
## Requirements
A [userscript][userscript] browser extension like [Tampermonkey][tamper] or [Violentmonkey][violent]. Greasemonkey is not supported.

## Install
[Click to install Timekeeper][install]

## Development builds
The `devel` branch has its own build that talks to the dev sync server and updates from the
`devel` branch instead of `main`. It replaces a regular Timekeeper install (same script identity).

[Click to install the devel build][install-devel]

## Local development
Live-reload loop for working on the userscript (run from `client/`; needs Node and pnpm):

1. `make dev` rebuilds on every source change and serves the result on `http://localhost:8765`
   (`make dev DEV_PORT=9000` to change the port).
2. Open `http://localhost:8765/timekeeper.local.user.js` in your browser once and click
   **Track external edits** in Violentmonkey. Tick **Reload tab** to reload YouTube after each rebuild.
   Keep that installer tab open: tracking stops when it closes.
3. Edit anything under `client/src/`. The pane shows the build as `v5.3.8+local.42`; the number goes up
   on every rebuild that changes the output, and hovering it shows the build time.

The local build installs as its own script, **Timekeeper (local)**, so disable the regular or devel
copy while testing. It talks to the dev sync server, is unminified, and is written to the gitignored
`.local/` directory, so nothing to commit. esbuild does not typecheck: run `pnpm exec tsc --noEmit`
in `client/` before pushing. Release channels and committed bundles are described in `AGENTS.md`.

[install-devel]: https://github.com/KamoTimestamps/timekeeper/raw/refs/heads/devel/timekeeper.devel.user.js

[violent]: https://violentmonkey.github.io/
[tamper]: https://www.tampermonkey.net/
[install]: https://github.com/KamoTimestamps/timekeeper/raw/refs/heads/main/timekeeper.user.js
[userscript]: https://en.wikipedia.org/wiki/Userscript
