# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [5.0.9](https://github.com/KamoTimestamps/timekeeper/compare/...) (2026-06-18)


### Added

* Lamport counter conflict resolution for sync (v5.0.0) 37cf9aa
* soft-deletes sync via Lamport timestamps ee0afe1


### Fixed

* allow timestamp with start=0 (falsy 0 no longer rejected by validation) 6a67fd3
* don't cache device_id when settings read fails in getDeviceId() 6377a8d
* drop device_id from merge comparison 62f13d4
* existingMap.set uses explicit guid and safe spread for new GUIDs d1d2286
* GuidSchema rejects missing/empty guids instead of inventing new ones 56a488f
* increment write_counter on soft-deletes in saveTimestamps c6d0171
* prevent stale counterCache after mergeBackupData counter bump 95ebb95
* read Lamport counter inside write transaction to prevent cross-tab collisions 3470b44
* remove dead incrementWriteCounter export 33d6783
* remove dead setWriteCounter export a5c7d6c
* remove device_id from write paths; it is stored but never read 220facc
* remove duplicate local TimestampRow interface; import from schema 4631030
* remove redundant counter advance in mergeBackupData fa5017c
* rename LegacyExportDataSchema → ExportDataSchema f13403e
* run v4 migration cursor inside upgrade transaction 315c6f2
* saveSetting returns Promise<void> so failures are observable c18d1e4
* saveTimestamps only increments write_counter when content changes 8cbf1a6
* saveTimestampsBatch always advances local counter past remote max 28a6076
* saveTimestampsBatch stores last-used counter, not next-available b25ca73
* simplify merge logic — shouldPreserveLocalDelete was downgrading write_counter 142e957
* update counterCache in tx.oncomplete, not inside onsuccess callbacks 97eff86
* update stale merge comment after device_id removal fc47ced
* v1/v2 \u2192 v4 migration cursor races v3 puts 27dad6b


### Changed

* add GitHub release workflow with automated changelogs 7f28211
* bump to 5.0.1, rebuild artifacts 949d718
* bump to 5.0.2, rebuild artifacts 8a043f2
* make device_id storage-only; remove from schema, export, and batch 2b911c4
* rebuild artifacts 5fdc978
* rebuild for v5.0.3 7ff8484
* remove withV2AndSettingsTransaction and onCommit callback 3f05fa6

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
