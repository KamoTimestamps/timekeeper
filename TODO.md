# TODO

## High Priority

- [x] **Fix IndexedDB silent failures** — Fixed in commits `4efe593` and `10b89cb`. `loadTimestamps()` now rejects on errors instead of resolving null. `saveSetting()` and `loadSetting()` return proper Promises.

- [x] **Reduce `any` types** — Fixed in commit `f47104f`. All 20+ `any` usages in repository and state modules addressed.

- [x] **Replace remaining `prompt()` calls** — Fixed in commit `06ce1c8`. All 5 `prompt()` calls replaced with custom modal dialogs.

- [x] **Fix `timeUpdateIntervalId` memory leak** — Fixed in commit `9d075f7`. `handleUrlChange()` now clears the stale interval before creating a new pane.

- [x] **Sanitize import fallback** — Fixed in commit `541f554`. Plain text import path now uses `TimestampRecordSchema.safeParse()` before inserting.

## Medium Priority

- [x] **Type untyped functions** — Fixed in commit `2b44273`. `saveTimestampsAs()` and `processImportedData()` now have proper type annotations.

- [x] **Clean up dead migration code** — Fixed in commit `085ef4c`. Dead `oldVersion < 2` and `oldVersion < 3` migration blocks removed.

- [x] **Audit timer cleanup coverage** — AUDITED. All timers have proper cleanup via clear-before-set patterns and `unloadTimekeeper()`. No changes needed.

- [x] **Replace `structuredClone` with a shared deep clone utility** — DONE in commit `1139e55`. Added `deepClone()` to `util.ts` with structuredClone + JSON fallback. All 4 usages in state.ts replaced.

- [x] **Add user-facing fallbacks for IndexedDB failures** — DONE in commit `4efe593`. Errors properly rejected, caller shows "Failed to load timestamps from IndexedDB. Try refreshing the page."

- [x] **Extract settings modal logic** — DONE in commit `0cfb3d6`. Extracted ~570 lines into `src/settings-modal.ts`.

- [x] **Add `as const` to state defaults** — Fixed in commit `750182b`. `DEFAULT_STATE` marked `as const`.

## Lower Priority

- [x] **Standardize `catch (_) { }` patterns** — Fixed in commit `caf6f5e`. All empty catch blocks replaced with descriptive `log()` calls.

- [x] **Improve `loadTimestamps` error signal** — DONE in commit `4efe593`. `loadTimestamps()` rejects on errors; caller uses try/catch to show error messages. Result wrapper deemed unnecessary given existing error handling.

- [x] **Add `as const` to icon registry** — Fixed in commit `fc1e918`. `ICON_SVGS` marked `as const`.

- [x] **Document public APIs** — Fixed in commit `3c78944`. JSDoc added to exported functions in `timestamp-model.ts`, `timestamp-view.ts`, and `google-drive-upload.ts`.

- [x] **Review `google-drive.ts` size** — Fixed in commit `3d85281`. OAuth logic extracted into `src/google-oauth.ts` (502 lines) and `src/google-oauth-constants.ts` (5 lines). `google-drive.ts` reduced from 1376 to 937 lines.

- [ ] **Consider a proper event bus** — DEFERRED. Analysis concluded the coupling is call-based, not event-driven. An event bus would not meaningfully reduce coupling for only two consumers. The `AppState.subscribe()` pattern exists but is unused — can be wired up if more modules are added.
