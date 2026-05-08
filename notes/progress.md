# TODO Implementation Progress

## Status
- [ ] 1. Split the monolith → pane-builder.ts, pane-interactions.ts, modals.ts
- [ ] 2. Eliminate duplicated functions
- [ ] 3. Reduce any types
- [ ] 4. Replace alert() calls
- [ ] 5. Fix error handling gaps
- [ ] 6. Consolidate state management
- [ ] 7. Remove dead migration code
- [ ] 8. Deduplicate updateTimeDisplay
- [ ] 9. Memory leak prevention
- [ ] 10. Type YouTube player interface
- [ ] 11. Extract DVR enablement tests
- [ ] 12. Standardize logging
- [ ] 13. Reduce CSS-in-JS
- [ ] 14. Add JSDoc to public APIs
- [ ] 15. Refactor google-drive.ts

## Architecture Notes

### timekeeper.ts structure
- One big IIFE (~5684 lines)
- All functions use closures over local variables: `list`, `pane`, `header`, `btns`, etc.
- initializePaneIfNeeded (line 3160-5375) contains pane builder + interactions + modal logic

### Extraction approach for Item 1
- modals.ts: Pure modal utility functions (5 functions, ~40 lines)
- pane-builder.ts: buildPaneElements() factory (~50 lines)
- pane-interactions.ts: setupPaneInteractions() with deps pattern (~400 lines)

### Duplicated functions (Item 2)
- findNearestTimestamp: timekeeper.ts uses local `list`, timestamp-view.ts takes `list` as param
- highlightTimestamp: timekeeper.ts clears ALL items, timestamp-view.ts uses lastHighlightedLi
- highlightNearestTimestampAtTime: composition of the two above
- updateTimeDifferences: timekeeper.ts also reformats anchor text with maxTime

### Key dependencies
- removeAllEventListeners() in timekeeper.ts cleans up documentMousemoveHandler, documentMouseupHandler, windowResizeHandler
- These need to be returned from pane-interactions.ts setup function

### alert() locations (Item 4)
- timekeeper.ts: lines 1245, 2206, 3154, 3641, 3660, 3683, 3775, 4103, 4607, 4611, 4641, 4714, 4720
- google-drive.ts: lines 1628, 1650, 1666
- Total: 16 alert() calls (3 commented out: 3152, 4710)

### state.ts deepClone (Item 6)
- Line 81: `let appState: AppState = JSON.parse(JSON.stringify(DEFAULT_STATE));`
- Line 102: `const previousState = listeners.size > 0 ? JSON.parse(JSON.stringify(appState)) : appState;`
- Line 257-258: in resetState()
- Replace with a structuredClone() call (modern browsers support it)

### Dead migration code (Item 7)
- timestampRepository.ts lines 86-178: v1/v2 migration in onupgradeneeded
- The data migration code (reading from old store, migrating to v2) is obsolete
- Schema creation (creating timestamps_v2 store) should be kept

### updateTimeDisplay (Item 8)
- timekeeper.ts: defined at line ~3390 inside initializePaneIfNeeded
- google-drive.ts: search shows no updateTimeDisplay — need to verify
- TODO says both files have it, need to check google-drive.ts more carefully

### any types (Item 3)
- google-drive.ts: lines 34, 82-85, 121-125, 128, 132, 136, 140, 144, 813, 839, 934, 955
- Main issues: googleAuthState, DOM element refs, callback functions typed as any
