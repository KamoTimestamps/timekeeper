# Graph Report - main  (2026-04-25)

## Corpus Check
- 20 files · ~60,255 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 308 nodes · 802 edges · 14 communities detected
- Extraction: 81% EXTRACTED · 19% INFERRED · 0% AMBIGUOUS · INFERRED: 153 edges (avg confidence: 0.8)
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

## God Nodes (most connected - your core abstractions)
1. `log()` - 49 edges
2. `updateBackupStatusDisplay()` - 20 edges
3. `scheduleAutoBackup()` - 19 edges
4. `runAutoBackupOnce()` - 18 edges
5. `getState()` - 18 edges
6. `loadTimestamps()` - 16 edges
7. `handleUrlChange()` - 16 edges
8. `getTimestampItems()` - 15 edges
9. `displayPane()` - 15 edges
10. `handleClick()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `syncVersion()` --calls--> `log()`  [INFERRED]
  build-tools/sync-version.js → src/util.ts
- `minifyCSS()` --calls--> `log()`  [INFERRED]
  build-tools/build.js → src/util.ts
- `buildUserscript()` --calls--> `log()`  [INFERRED]
  build-tools/build.js → src/util.ts
- `getLastHandledUrl()` --calls--> `getState()`  [INFERRED]
  src/timekeeper.ts → src/services/state.ts
- `getTimestampsFromState()` --calls--> `getState()`  [INFERRED]
  src/timekeeper.ts → src/services/state.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.1
Nodes (61): applyIndicatorColor(), blinkAuthStatusDisplay(), clearAutoBackupSchedule(), createZipFromJson(), decodeFirstZipEntry(), ensureAuthSpinnerStyles(), exportAllTimestampsToConfiguredDestinations(), fetchLatestBackendBackup() (+53 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (37): deleteSingleTimestamp(), earlyLoadGlobalSettings(), earlySaveGlobalSettings(), getExtensionStorageValue(), loadUIVisibilityState(), setExtensionStorageValue(), addTimestamp(), deleteSingleTimestampFromIndexedDB() (+29 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (23): clampAndSavePanePosition(), clampPaneToViewport(), ensureChannel(), ensureMinPaneHeight(), getCurrentTimestampIndexFromState(), getIndentedComment(), getLastHandledUrl(), getMarkerForIndex() (+15 more)

### Community 3 - "Community 3"
Cohesion: 0.14
Nodes (24): loadAutoBackupSettings(), notifyListeners(), resetState(), setAuth(), setAutoBackupBackoffMs(), setAutoBackupEnabled(), setAutoBackupIntervalMinutes(), setAutoBackupRetryAttempts() (+16 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (23): buildUserscript(), minifyCSS(), readHeaderTemplate(), readVersion(), removeExistingHeader(), initializeDvrEnablement(), ensureDriveFolder(), exportAllTimestampsToGoogleDrive() (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.16
Nodes (15): clearTimestampsDisplay(), displayPaneError(), ensureEmptyPlaceholder(), extractTimestampRecords(), findNearestTimestamp(), getLatestTimestampValue(), getTimestampItems(), highlightNearestTimestampAtTime() (+7 more)

### Community 6 - "Community 6"
Cohesion: 0.33
Nodes (17): addTimestamp(), appendPendingTimestamps(), applyOffsetToAllTimestamps(), findNearestTimestamp(), getTimestampItems(), handleClick(), highlightTimestamp(), invalidateLatestTimestampValue() (+9 more)

### Community 7 - "Community 7"
Cohesion: 0.21
Nodes (14): addHeaderButton(), clearListPlaceholder(), clearTimestampsDisplay(), displayPaneError(), ensureEmptyPlaceholder(), handleUrlChange(), loadTimestamps(), setLastHandledUrl() (+6 more)

### Community 8 - "Community 8"
Cohesion: 0.22
Nodes (11): autoHighlightNearest(), getActivePlayer(), getLatestTimestampValue(), getVideoId(), hasRequiredPlayerMethods(), highlightNearestTimestampAtTime(), isBehindLiveEdge(), missingPlayerMethods() (+3 more)

### Community 9 - "Community 9"
Cohesion: 0.27
Nodes (5): hideActiveTooltip(), hideTooltip(), positionTooltipNearElement(), removeTooltip(), repositionActiveTooltip()

### Community 10 - "Community 10"
Cohesion: 0.28
Nodes (9): formatPlaybackSpeed(), getVideoElement(), removeAllEventListeners(), removeSeekbarMarkers(), setVideoSpeed(), syncPlaybackSpeedState(), togglePlaybackSpeed(), unloadTimekeeper() (+1 more)

### Community 11 - "Community 11"
Cohesion: 0.44
Nodes (8): buildSvgFromSource(), createIcon(), decodeSvgSource(), getIconTemplate(), parseAttributes(), setIcon(), setIconLabel(), initializePaneIfNeeded()

### Community 12 - "Community 12"
Cohesion: 0.52
Nodes (6): buildUserscript(), ensureDistExists(), getInlineStylesConstant(), readHeaderTemplate(), readVersion(), removeExistingHeader()

### Community 13 - "Community 13"
Cohesion: 0.29
Nodes (7): cancelScheduledShowFinalizer(), performSizingAndSave(), saveUIVisibilityState(), scheduleShowFinalizer(), startHideAnimation(), startShowAnimation(), togglePaneVisibility()

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `log()` connect `Community 4` to `Community 0`, `Community 1`, `Community 2`, `Community 3`, `Community 6`, `Community 7`, `Community 11`, `Community 13`?**
  _High betweenness centrality (0.314) - this node is a cross-community bridge._
- **Why does `getVideoElement()` connect `Community 10` to `Community 2`, `Community 5`, `Community 6`, `Community 7`, `Community 8`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `updateSeekbarMarkers()` connect `Community 5` to `Community 10`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Are the 48 inferred relationships involving `log()` (e.g. with `syncVersion()` and `minifyCSS()`) actually correct?**
  _`log()` has 48 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `updateBackupStatusDisplay()` (e.g. with `getState()` and `setIconLabel()`) actually correct?**
  _`updateBackupStatusDisplay()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `scheduleAutoBackup()` (e.g. with `displayPane()` and `getState()`) actually correct?**
  _`scheduleAutoBackup()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `runAutoBackupOnce()` (e.g. with `log()` and `setAutoBackupBackoffMs()`) actually correct?**
  _`runAutoBackupOnce()` has 7 INFERRED edges - model-reasoned connections that need verification._