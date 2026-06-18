# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
