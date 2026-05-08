# Graph Report - .  (2026-05-07)

## Corpus Check
- 25 files · ~34,763 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 309 nodes · 801 edges · 19 communities detected
- Extraction: 81% EXTRACTED · 19% INFERRED · 0% AMBIGUOUS · INFERRED: 151 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Google Drive Backup & Auth|Google Drive Backup & Auth]]
- [[_COMMUNITY_Timestamp Service & Repo|Timestamp Service & Repo]]
- [[_COMMUNITY_Timekeeper Main App|Timekeeper Main App]]
- [[_COMMUNITY_State Management|State Management]]
- [[_COMMUNITY_Build Tools & DVR|Build Tools & DVR]]
- [[_COMMUNITY_Timestamp View|Timestamp View]]
- [[_COMMUNITY_Icons & Tooltip|Icons & Tooltip]]
- [[_COMMUNITY_Timestamp Operations|Timestamp Operations]]
- [[_COMMUNITY_Timekeeper UI|Timekeeper UI]]
- [[_COMMUNITY_Video Playback|Video Playback]]
- [[_COMMUNITY_Postbuild|Postbuild]]
- [[_COMMUNITY_Timestamp Extraction|Timestamp Extraction]]
- [[_COMMUNITY_Timestamp Highlighting|Timestamp Highlighting]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]

## God Nodes (most connected - your core abstractions)
1. `log()` - 48 edges
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
- `getLastHandledUrl()` --calls--> `getState()`  [INFERRED]
  /Users/localuser/src/github.com/KamoTimestamps/Timekeeper/main/src/timekeeper.ts → /Users/localuser/src/github.com/KamoTimestamps/Timekeeper/main/src/services/state.ts
- `getTimestampsFromState()` --calls--> `getState()`  [INFERRED]
  /Users/localuser/src/github.com/KamoTimestamps/Timekeeper/main/src/timekeeper.ts → /Users/localuser/src/github.com/KamoTimestamps/Timekeeper/main/src/services/state.ts
- `getCurrentTimestampIndexFromState()` --calls--> `getState()`  [INFERRED]
  /Users/localuser/src/github.com/KamoTimestamps/Timekeeper/main/src/timekeeper.ts → /Users/localuser/src/github.com/KamoTimestamps/Timekeeper/main/src/services/state.ts
- `getMinPaneHeight()` --calls--> `getState()`  [INFERRED]
  /Users/localuser/src/github.com/KamoTimestamps/Timekeeper/main/src/timekeeper.ts → /Users/localuser/src/github.com/KamoTimestamps/Timekeeper/main/src/services/state.ts
- `getUrlChangeHandlersSetup()` --calls--> `getState()`  [INFERRED]
  /Users/localuser/src/github.com/KamoTimestamps/Timekeeper/main/src/timekeeper.ts → /Users/localuser/src/github.com/KamoTimestamps/Timekeeper/main/src/services/state.ts

## Communities

### Community 0 - "Google Drive Backup & Auth"
Cohesion: 0.09
Nodes (63): applyIndicatorColor(), blinkAuthStatusDisplay(), clearAutoBackupSchedule(), createZipFromJson(), decodeFirstZipEntry(), ensureAuthSpinnerStyles(), ensureDriveFolder(), exportAllTimestampsToConfiguredDestinations() (+55 more)

### Community 1 - "Timestamp Service & Repo"
Cohesion: 0.06
Nodes (39): deleteSingleTimestamp(), earlyLoadGlobalSettings(), earlySaveGlobalSettings(), getExtensionStorageValue(), loadUIVisibilityState(), setExtensionStorageValue(), addTimestamp(), deleteSingleTimestampFromIndexedDB() (+31 more)

### Community 2 - "Timekeeper Main App"
Cohesion: 0.1
Nodes (24): cancelScheduledShowFinalizer(), ensureMinPaneHeight(), getCurrentTimestampIndexFromState(), getIndentedComment(), getLastHandledUrl(), getMarkerForIndex(), getMinPaneHeight(), getTimestampsFromState() (+16 more)

### Community 3 - "State Management"
Cohesion: 0.14
Nodes (24): loadAutoBackupSettings(), notifyListeners(), resetState(), setAuth(), setAutoBackupBackoffMs(), setAutoBackupEnabled(), setAutoBackupIntervalMinutes(), setAutoBackupRetryAttempts() (+16 more)

### Community 4 - "Build Tools & DVR"
Cohesion: 0.11
Nodes (24): buildUserscript(), minifyCSS(), readHeaderTemplate(), readVersion(), removeExistingHeader(), initializeDvrEnablement(), exportAllTimestampsToGoogleDrive(), handleOAuthPopup() (+16 more)

### Community 5 - "Timestamp View"
Cohesion: 0.16
Nodes (15): clearTimestampsDisplay(), displayPaneError(), ensureEmptyPlaceholder(), extractTimestampRecords(), findNearestTimestamp(), getLatestTimestampValue(), getTimestampItems(), highlightNearestTimestampAtTime() (+7 more)

### Community 6 - "Icons & Tooltip"
Cohesion: 0.15
Nodes (15): buildSvgFromSource(), createIcon(), decodeSvgSource(), getIconTemplate(), parseAttributes(), setIcon(), setIconLabel(), initializePaneIfNeeded() (+7 more)

### Community 7 - "Timestamp Operations"
Cohesion: 0.38
Nodes (15): addTimestamp(), appendPendingTimestamps(), formatTime(), getTimestampItems(), handleClick(), invalidateLatestTimestampValue(), offsetAllTimestamps(), processImportedData() (+7 more)

### Community 8 - "Timekeeper UI"
Cohesion: 0.22
Nodes (14): addHeaderButton(), autoHighlightNearest(), clearListPlaceholder(), clearTimestampsDisplay(), displayPaneError(), ensureEmptyPlaceholder(), handleUrlChange(), loadTimestamps() (+6 more)

### Community 9 - "Video Playback"
Cohesion: 0.24
Nodes (10): formatPlaybackSpeed(), getVideoElement(), removeAllEventListeners(), removeSeekbarMarkers(), setupVideoEventListeners(), setVideoSpeed(), syncPlaybackSpeedState(), togglePlaybackSpeed() (+2 more)

### Community 10 - "Postbuild"
Cohesion: 0.52
Nodes (6): buildUserscript(), ensureDistExists(), getInlineStylesConstant(), readHeaderTemplate(), readVersion(), removeExistingHeader()

### Community 11 - "Timestamp Extraction"
Cohesion: 0.33
Nodes (6): extractTimestampRecords(), getActivePlayer(), getLatestTimestampValue(), isBehindLiveEdge(), saveTimestampsAs(), updateTimeDisplay()

### Community 12 - "Timestamp Highlighting"
Cohesion: 0.67
Nodes (4): applyOffsetToAllTimestamps(), findNearestTimestamp(), highlightNearestTimestampAtTime(), highlightTimestamp()

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 13`** (1 nodes): `extension-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (1 nodes): `schema.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (1 nodes): `styles.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (1 nodes): `svg.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (1 nodes): `styles.css.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (1 nodes): `version.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `log()` connect `Build Tools & DVR` to `Google Drive Backup & Auth`, `Timestamp Service & Repo`, `Timekeeper Main App`, `State Management`, `Icons & Tooltip`, `Timestamp Operations`, `Timekeeper UI`, `Timestamp Extraction`, `Timestamp Highlighting`?**
  _High betweenness centrality (0.305) - this node is a cross-community bridge._
- **Why does `getVideoElement()` connect `Video Playback` to `Timekeeper Main App`, `Timestamp Extraction`, `Timestamp View`, `Timestamp Operations`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `displayPane()` connect `Google Drive Backup & Auth` to `Timestamp Service & Repo`, `Timekeeper Main App`, `State Management`, `Build Tools & DVR`, `Timekeeper UI`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Are the 47 inferred relationships involving `log()` (e.g. with `minifyCSS()` and `buildUserscript()`) actually correct?**
  _`log()` has 47 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `updateBackupStatusDisplay()` (e.g. with `getState()` and `setIconLabel()`) actually correct?**
  _`updateBackupStatusDisplay()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `scheduleAutoBackup()` (e.g. with `displayPane()` and `getState()`) actually correct?**
  _`scheduleAutoBackup()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `runAutoBackupOnce()` (e.g. with `log()` and `setAutoBackupBackoffMs()`) actually correct?**
  _`runAutoBackupOnce()` has 7 INFERRED edges - model-reasoned connections that need verification._