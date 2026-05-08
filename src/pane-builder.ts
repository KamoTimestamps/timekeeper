/**
 * Pane Builder
 * Factory for creating the Timekeeper pane DOM elements.
 */

export interface PaneElements {
  pane: HTMLDivElement;
  header: HTMLDivElement;
  list: HTMLUListElement;
  btns: HTMLDivElement;
  timeDisplay: HTMLSpanElement;
  versionDisplay: HTMLSpanElement;
  backupStatusIndicator: HTMLSpanElement;
}

/**
 * Create all core Timekeeper pane DOM elements.
 * Returns unattached elements — the caller is responsible for wiring up
 * event listeners, setting IDs/classes, and appending to the document.
 */
export function buildPaneElements(): PaneElements {
  const pane = document.createElement("div");
  const header = document.createElement("div");
  const list = document.createElement("ul");
  const btns = document.createElement("div");
  const timeDisplay = document.createElement("span");
  const versionDisplay = document.createElement("span");
  const backupStatusIndicator = document.createElement("span");

  return { pane, header, list, btns, timeDisplay, versionDisplay, backupStatusIndicator };
}
