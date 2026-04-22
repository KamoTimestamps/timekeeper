# Graph Report - main  (2026-04-21)

## Corpus Check
- 21 files · ~60,119 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 303 nodes · 789 edges · 15 communities detected
- Extraction: 80% EXTRACTED · 20% INFERRED · 0% AMBIGUOUS · INFERRED: 154 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]

## God Nodes (most connected - your core abstractions)
1. `log()` - 49 edges
2. `updateBackupStatusDisplay()` - 20 edges
3. `scheduleAutoBackup()` - 19 edges
4. `runAutoBackupOnce()` - 18 edges
5. `getState()` - 18 edges
6. `loadTimestamps()` - 16 edges
7. `handleUrlChange()` - 16 edges
8. `getTimestampItems()` - 15 edges
9. `handleClick()` - 15 edges
10. `displayPane()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `syncVersion()` --calls--> `log()`  [INFERRED]
  build-tools/sync-version.js → src/util.ts
- `minifyCSS()` --calls--> `log()`  [INFERRED]
  build-tools/build.js → src/util.ts
- `buildUserscript()` --calls--> `log()`  [INFERRED]
  build-tools/build.js → src/util.ts
- `initializeDvrEnablement()` --calls--> `log()`  [INFERRED]
  src/dvr-enablement.ts → src/util.ts
- `formatTimeForDisplay()` --calls--> `formatTimeString()`  [INFERRED]
  src/timestamp-view.ts → src/util.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (69): blinkAuthStatusDisplay(), clearAutoBackupSchedule(), createZipFromJson(), decodeFirstZipEntry(), ensureAuthSpinnerStyles(), ensureDriveFolder(), exportAllTimestampsToConfiguredDestinations(), exportAllTimestampsToGoogleDrive() (+61 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (38): deleteSingleTimestamp(), loadUIVisibilityState(), addTimestamp(), deleteSingleTimestampFromIndexedDB(), loadFromIndexedDB(), loadGlobalSettings(), removeFromIndexedDB(), saveGlobalSettings() (+30 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (22): addHeaderButton(), cancelScheduledShowFinalizer(), earlyLoadGlobalSettings(), earlySaveGlobalSettings(), ensureMinPaneHeight(), getExtensionStorageValue(), getIndentedComment(), getMarkerForIndex() (+14 more)

### Community 3 - "Community 3"
Cohesion: 0.14
Nodes (23): loadAutoBackupSettings(), notifyListeners(), resetState(), setAuth(), setAutoBackupBackoffMs(), setAutoBackupEnabled(), setAutoBackupIntervalMinutes(), setAutoBackupRetryAttempts() (+15 more)

### Community 4 - "Community 4"
Cohesion: 0.14
Nodes (15): getHolidayEmoji(), buildSvgFromSource(), createIcon(), decodeSvgSource(), getIconTemplate(), parseAttributes(), setIcon(), setIconLabel() (+7 more)

### Community 5 - "Community 5"
Cohesion: 0.16
Nodes (15): clearTimestampsDisplay(), displayPaneError(), ensureEmptyPlaceholder(), extractTimestampRecords(), findNearestTimestamp(), getLatestTimestampValue(), getTimestampItems(), highlightNearestTimestampAtTime() (+7 more)

### Community 6 - "Community 6"
Cohesion: 0.42
Nodes (14): addTimestamp(), appendPendingTimestamps(), getTimestampItems(), handleClick(), invalidateLatestTimestampValue(), offsetAllTimestamps(), processImportedData(), saveSingleTimestampDirect() (+6 more)

### Community 7 - "Community 7"
Cohesion: 0.21
Nodes (13): applyOffsetToAllTimestamps(), autoHighlightNearest(), extractTimestampRecords(), findNearestTimestamp(), formatTime(), getActivePlayer(), getLatestTimestampValue(), highlightNearestTimestampAtTime() (+5 more)

### Community 8 - "Community 8"
Cohesion: 0.2
Nodes (12): setPanePosition(), clampAndSavePanePosition(), clampPaneToViewport(), ensureChannel(), getPanePositionState(), getPaneRect(), handleChannelMessage(), isSupportedUrl() (+4 more)

### Community 9 - "Community 9"
Cohesion: 0.39
Nodes (6): buildUserscript(), minifyCSS(), readHeaderTemplate(), readVersion(), removeExistingHeader(), syncVersion()

### Community 10 - "Community 10"
Cohesion: 0.36
Nodes (8): clearListPlaceholder(), clearTimestampsDisplay(), displayPaneError(), ensureEmptyPlaceholder(), loadTimestamps(), setLoadingState(), setTimestampsInState(), showListPlaceholder()

### Community 11 - "Community 11"
Cohesion: 0.29
Nodes (8): getVideoElement(), handleUrlChange(), removeAllEventListeners(), removeSeekbarMarkers(), setLastHandledUrl(), setupVideoEventListeners(), unloadTimekeeper(), waitForYouTubeReady()

### Community 12 - "Community 12"
Cohesion: 0.52
Nodes (6): buildUserscript(), ensureDistExists(), getInlineStylesConstant(), readHeaderTemplate(), readVersion(), removeExistingHeader()

### Community 13 - "Community 13"
Cohesion: 0.5
Nodes (5): getVideoId(), hasRequiredPlayerMethods(), missingPlayerMethods(), validatePlayerAndVideoId(), waitForPlayerWithMethods()

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (1): initializeDvrEnablement()

## Knowledge Gaps
- **Thin community `Community 14`** (2 nodes): `initializeDvrEnablement()`, `dvr-enablement.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `log()` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `Community 11`, `Community 14`?**
  _High betweenness centrality (0.323) - this node is a cross-community bridge._
- **Why does `getVideoElement()` connect `Community 11` to `Community 2`, `Community 5`, `Community 6`, `Community 7`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `updateSeekbarMarkers()` connect `Community 5` to `Community 11`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Are the 48 inferred relationships involving `log()` (e.g. with `syncVersion()` and `minifyCSS()`) actually correct?**
  _`log()` has 48 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `updateBackupStatusDisplay()` (e.g. with `getState()` and `setIconLabel()`) actually correct?**
  _`updateBackupStatusDisplay()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `scheduleAutoBackup()` (e.g. with `displayPane()` and `getState()`) actually correct?**
  _`scheduleAutoBackup()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `runAutoBackupOnce()` (e.g. with `log()` and `setAutoBackupBackoffMs()`) actually correct?**
  _`runAutoBackupOnce()` has 7 INFERRED edges - model-reasoned connections that need verification._
