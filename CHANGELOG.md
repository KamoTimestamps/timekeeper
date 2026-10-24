# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [5.2.0](https://github.com/KamoTimestamps/timekeeper/compare/...) (2026-10-24)


### Changed

* displayed times (timestamp list and current time) are padded to the video length instead of the latest timestamp
* timestamps-per-minute is calculated from the first to last timestamp (minimum 1 minute), independent of playback position; always shown with two decimals
* text export and clipboard copy pad to the latest timestamp in the exported records
* simplify time formatting: shared `formatTimeDisplay`/`formatTimestampLines` helpers, CSV time reuses `formatTimeString`

## [5.1.1](https://github.com/KamoTimestamps/timekeeper/compare/...) (2026-10-24)


### Changed

* DVR enablement leaves the playback path (useServerDrivenAbr, serverPlaybackStartConfig) untouched for live streams that already have DVR enabled; the >12h rewind window is still widened

## [5.1.0](https://github.com/KamoTimestamps/timekeeper/compare/...) (2026-10-24)


### Changed

* flush pending comment edits on navigation, pagehide and tab hide, using the video id captured at edit time (previously dropped or at risk of being misfiled)
* make UI saves row-level: bulk offset, import and clear-all no longer rewrite the whole video from the view, so a stale pane can't tombstone rows it hasn't loaded; sort no longer saves
* repository: single write helper, fail closed when the Lamport counter can't be read, skip rewriting unchanged rows, tolerate invalid rows on load, handle IndexedDB onversionchange/onblocked
* Drive sync fails closed: failed listing/download/merge aborts the run for retry instead of uploading a duplicate or local-only file; newest remote copy wins; export validates row by row; lastAutoBackupAt only advances after a real upload
* add build-tools/e2e/storage-resilience.js

## [5.0.29](https://github.com/KamoTimestamps/timekeeper/compare/...) (2026-10-24)


### Changed

* stop deleting serverAbrStreamingUrl in DVR enablement (no-op for SABR-only streams); useServerDrivenAbr=false is still required for rewind

## [5.0.27](https://github.com/KamoTimestamps/timekeeper/compare/...) (2026-10-24)

## [5.0.26](https://github.com/KamoTimestamps/timekeeper/compare/...) (2026-10-24)


### Changed

* add browser e2e/benchmark harnesses under build-tools/e2e 0ef1833
* gitignore .playwright-mcp session output 6824b67
* remove graphify (graphify-out, .graphifyignore, .claude hook) and update build docs 34efee3

## [5.0.25](https://github.com/KamoTimestamps/timekeeper/compare/...) (2026-10-24)

## [5.0.24](https://github.com/KamoTimestamps/timekeeper/compare/...) (2026-10-24)

## [5.0.23](https://github.com/KamoTimestamps/timekeeper/compare/...) (2026-10-24)

## [5.0.20](https://github.com/KamoTimestamps/timekeeper/compare/...) (2026-07-06)

## [5.0.17](https://github.com/KamoTimestamps/timekeeper/compare/...) (2026-06-18)


### Fixed

* restore compareUrlFormat and fix broken compare links for 5.0.10–5.0.15 13c37a7

## [5.0.15](https://github.com/KamoTimestamps/timekeeper/compare/v5.0.14...v5.0.15) (2026-06-18)

## [5.0.14](https://github.com/KamoTimestamps/timekeeper/compare/v5.0.13...v5.0.14) (2026-06-18)

## [5.0.13](https://github.com/KamoTimestamps/timekeeper/compare/v5.0.12...v5.0.13) (2026-06-18)

## [5.0.12](https://github.com/KamoTimestamps/timekeeper/compare/v5.0.11...v5.0.12) (2026-06-18)

## [5.0.11](https://github.com/KamoTimestamps/timekeeper/compare/v5.0.10...v5.0.11) (2026-06-18)


### Fixed

* remove pnpm version pin that caused cache conflict on GitHub Actions bc081a5

## [5.0.10](https://github.com/KamoTimestamps/timekeeper/compare/v5.0.9...v5.0.10) (2026-06-18)


### Fixed

* use BUMP_TYPE env var in Makefile release target 0581685


### Changed

* fix CHANGELOG format, remove broken URL vars from .versionrc.js, update Makefile release 57d8b34

## [5.0.9] - 2026-06-18

### Added
- Lamport counter conflict resolution for sync (v5.0.0)
- soft-deletes sync via Lamport timestamps

### Fixed
- allow timestamp with start=0 (falsy 0 no longer rejected by validation)
- don't cache device_id when settings read fails in getDeviceId()
- drop device_id from merge comparison
- existingMap.set uses explicit guid and safe spread for new GUIDs
- GuidSchema rejects missing/empty guids instead of inventing new ones
- increment write_counter on soft-deletes in saveTimestamps
- prevent stale counterCache after mergeBackupData counter bump
- read Lamport counter inside write transaction to prevent cross-tab collisions
- remove dead incrementWriteCounter export
- remove dead setWriteCounter export
- remove device_id from write paths; it is stored but never read
- remove duplicate local TimestampRow interface; import from schema
- remove redundant counter advance in mergeBackupData
- rename LegacyExportDataSchema → ExportDataSchema
- run v4 migration cursor inside upgrade transaction
- saveSetting returns Promise<void> so failures are observable
- saveTimestamps only increments write_counter when content changes
- saveTimestampsBatch always advances local counter past remote max
- saveTimestampsBatch stores last-used counter, not next-available
- simplify merge logic — shouldPreserveLocalDelete was downgrading write_counter
- update counterCache in tx.oncomplete, not inside onsuccess callbacks
- update stale merge comment after device_id removal
- v1/v2 → v4 migration cursor races v3 puts

### Changed
- add GitHub release workflow with automated changelogs
- bump to 5.0.1, rebuild artifacts
- bump to 5.0.2, rebuild artifacts
- make device_id storage-only; remove from schema, export, and batch
- rebuild artifacts
- rebuild for v5.0.3
- remove withV2AndSettingsTransaction and onCommit callback

## [5.0.8] - 2025-06-18

### Added
- Deletion propagation in sync

### Fixed
- Merge logic: shouldPreserveLocalDelete was downgrading write_counter

## [5.0.6] - 2025-06-18

### Changed
- Bump version + rebuild

## [5.0.3] - 2025-06-08

### Changed
- Rebuild for v5.0.3
