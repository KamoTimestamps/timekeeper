# TODO

## High Priority

- [x] **Fix IndexedDB silent failures** — Fixed in commits `4efe593` and `10b89cb`. `loadTimestamps()` now rejects on errors instead of resolving null. `saveSetting()` and `loadSetting()` return proper Promises.

- [x] **Reduce `any` types** — Fixed in commit `f47104f`. All 20+ `any` usages in repository and state modules addressed.

- [x] **Replace remaining `prompt()` calls** — Fixed in commit `06ce1c8`. All 5 `prompt()` calls replaced with custom modal dialogs.

- [x] **Fix `timeUpdateIntervalId` memory leak** — Fixed in commit `9d075f7`. `handleUrlChange()` now clears the stale interval before creating a new pane.

- [x] **Sanitize import fallback** — Fixed in commit `541f554`. Plain text import path now uses `TimestampRecordSchema.safeParse()` before inserting.

## Medium Priority

- [ ] **Type untyped functions** — `saveTimestampsAs()` (`timekeeper.ts:2058`) and `processImportedData()` (`timekeeper.ts:2855`) have zero type annotations on parameters. Both receive DOM events and strings respectively — type them properly.

- [ ] **Clean up dead migration code** — `timestampRepository.ts:77-89` contains `oldVersion < 2` and `oldVersion < 3` migration blocks. The DB is at version 3 and all existing users are on v3+. These blocks will never execute. Remove to reduce maintenance burden.

- [ ] **Audit timer cleanup coverage** — AUDITED. All timers have proper cleanup via clear-before-set patterns and `unloadTimekeeper()`. The one gap (Item #4) was fixed. No changes needed. Several timers in `timekeeper.ts` (seek timeouts, comment save timeouts, visibility animation timeouts) are created per-interaction but not always cleared on pane unload. Audit every timer and ensure cleanup in `unloadTimekeeper()` and on URL change.

- [x] **Replace `structuredClone` with a shared deep clone utility** — DONE. Added `deepClone()` to `util.ts` with structuredClone + JSON fallback. All 4 usages in state.ts replaced.

- [x] **Add user-facing fallbacks for IndexedDB failures** — DONE. Item #1 fix enables proper error rejection. Lines 2398-2408 show "Failed to load timestamps from IndexedDB. Try refreshing the page." The "No timestamps" placeholder only shows for genuinely empty videos.

- [x] **Extract settings modal logic** — Extracted ~570 lines from `timekeeper.ts` into new `src/settings-modal.ts`. Uses a config object pattern to pass button onclick handlers, decoupling the modal from timekeeper's button variables.

- [ ] **Add `as const` to state defaults** — `DEFAULT_STATE` in `state.ts:47` is a mutable plain object. Add `as const` or freeze it so `setState()` cannot accidentally mutate the prototype.

## Lower Priority

- [ ] **Standardize `catch (_) { }` patterns** — 15+ empty catch blocks (`catch (_) { }` or `catch (err) { }` with only a comment) silently swallow errors. Review each: is silence intentional? If not, add logging or user-facing feedback. Notable locations: `timekeeper.ts:511,1615,1618,2187,2279,2285,2630,2648,3078,3136,3153,3158`; `timestampRepository.ts:121`.

- [ ] **Improve `loadTimestamps` error signal** — Instead of resolving `null` on any failure, return a result wrapper like `{ data: TimestampRecord[] | null, error: string | null }` so the caller can decide whether to show an error message, retry, or proceed silently.

- [ ] **Add `as const` to icon registry** — `ICON_SVGS` in `icons.ts:74` is a mutable Record. Mark as `as const` since icon SVG strings are static.

- [ ] **Document public APIs** — Functions exported from `timestamp-model.ts`, `timestamp-view.ts`, and `google-drive-upload.ts` lack JSDoc. Add parameter and return type documentation.

- [ ] **Review `google-drive.ts` size** — 1,376 lines. OAuth popup logic (`monitorOAuthPopup`, `signInToGoogle`, `handleOAuthPopup`) could be split into its own file. The backup scheduling logic (`runAutoBackupOnce`, `scheduleAutoBackup`, `toggleAutoBackup`) is also large enough to warrant extraction.

- [ ] **Consider a proper event bus** — The codebase uses a mix of AppState listeners, callback injection, and direct module imports for cross-module communication. A typed event bus would reduce coupling between google-drive.ts and timekeeper.ts.
