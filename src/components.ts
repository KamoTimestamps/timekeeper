/**
 * Preact components for Timekeeper UI
 * Uses HTM for JSX-like syntax without build-time compilation
 */

import { render } from 'preact';
import { html } from 'htm/preact';
import { useRef, useEffect } from 'preact/hooks';
import { addTooltip } from './tooltip';

export interface TimestampStructure {
  guid: string;
  start: number;
  comment: string;
}

/**
 * Creates the DOM structure for a timestamp list item using HTM
 * More declarative and maintainable than manual createElement calls
 */
export function renderTimestampDOM(
  guid: string,
  start: number,
  comment: string,
  formatTimeCallback: (anchor: HTMLAnchorElement, time: number) => void
): HTMLLIElement {
  const li = document.createElement('li');
  li.dataset.guid = guid;
  li.style.cssText = 'position:relative;padding-left:20px;';

  // Use Preact to render the structure declaratively
  render(html`
    <${TimestampContent}
      start=${start}
      comment=${comment}
      formatTime=${formatTimeCallback}
    />
  `, li);

  return li;
}

// Internal component that renders the timestamp structure
function TimestampContent({ start, comment, formatTime }: {
  start: number;
  comment: string;
  formatTime: (anchor: HTMLAnchorElement, time: number) => void;
}) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const recordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (anchorRef.current) {
      formatTime(anchorRef.current, start);
    }
    if (gutterRef.current) {
      addTooltip(gutterRef.current, 'Click to toggle indent');
    }
    if (recordRef.current) {
      addTooltip(recordRef.current, 'Set to current playback time');
    }
  }, []);

  return html`
    <div
      ref=${gutterRef}
      style="position:absolute;left:0;top:0;width:20px;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;"
      data-action="toggle-indent">
      <span class="indent-toggle" style="color:#999;font-size:12px;pointer-events:none;display:none;"></span>
    </div>

    <div class="time-row">
      <span class="ts-button ts-minus" data-increment="-1" style="cursor:pointer;margin:0px;">➖</span>
      <span
        ref=${recordRef}
        class="ts-button ts-record"
        data-action="record"
        style="cursor:pointer;margin:0px;">⏺️</span>
      <span class="ts-button ts-plus" data-increment="1" style="cursor:pointer;margin:0px;">➕</span>
      <a ref=${anchorRef} data-time="${start}"></a>
      <span class="time-diff" style="color:#888;margin-left:5px;"></span>
      <button class="ts-button ts-delete" data-action="delete"
              style="background:transparent;border:none;color:white;cursor:pointer;margin-left:5px;">🗑️</button>
    </div>

    <input
      type="text"
      value="${comment || ''}"
      data-action="comment"
      style="width:100%;margin-top:5px;display:block;"
      inputmode="text"
      autocapitalize="off"
      autocomplete="off"
      spellcheck=${false} />
  `;
}

/**
 * Renders error message in the list
 */
export function renderErrorElement(message: string): HTMLLIElement {
  const li = document.createElement('li');
  li.className = 'ytls-error-message';

  render(html`
    <div style="padding: 1em; text-align: center; color: #ff6b6b; font-style: italic;">
      ${message}
    </div>
  `, li);

  return li;
}

/**
 * Renders empty placeholder for timestamp list
 */
export function renderEmptyPlaceholder(message: string): HTMLLIElement {
  const li = document.createElement('li');
  li.className = 'ytls-placeholder';

  render(html`
    <div style="padding: 2em; text-align: center; color: #999; font-style: italic;">
      ${message}
    </div>
  `, li);

  return li;
}

/**
 * Renders progress bar marker using HTM
 */
export function renderSeekbarMarker(position: number, color: string, tooltip: string): HTMLDivElement {
  const container = document.createElement('div');

  const MarkerContent = () => {
    const markerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (markerRef.current) {
        addTooltip(markerRef.current, tooltip);
      }
    }, []);

    return html`
      <div
        ref=${markerRef}
        style="position:absolute;left:${position}%;width:2px;height:100%;background:${color};pointer-events:auto;cursor:pointer;">
      </div>
    `;
  };

  render(html`<${MarkerContent} />`, container);
  return container.firstElementChild as HTMLDivElement;
}

/**
 * Renders Google Drive auth status
 */
export function renderAuthStatus(container: HTMLElement, status: 'authenticating' | 'error' | 'success' | 'none', message?: string) {
  // Clear existing content
  while (container.firstChild) container.removeChild(container.firstChild);

  if (status === 'authenticating') {
    render(html`
      <span class="tk-auth-spinner"></span>
      <span> ${message || 'Authorizing with Google…'}</span>
    `, container);
  } else if (status === 'error') {
    render(html`
      <span>❌ ${message || 'Authorization failed'}</span>
    `, container);
  } else if (status === 'none') {
    render(html`
      <span>❌ Not signed in</span>
    `, container);
  } else if (status === 'success') {
    render(html`
      <span>✅ ${message || 'Connected'}</span>
    `, container);
  }
}
