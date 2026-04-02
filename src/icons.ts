import plusSvg from '@tabler/icons/outline/plus.svg';
import alarmPlusSvg from '@tabler/icons/outline/alarm-plus.svg';
import minusSvg from '@tabler/icons/outline/minus.svg';
import circlePlusSvg from '@tabler/icons/outline/circle-plus.svg';
import circleMinusSvg from '@tabler/icons/outline/circle-minus.svg';
import trashSvg from '@tabler/icons/outline/trash.svg';
import clipboardSvg from '@tabler/icons/outline/clipboard.svg';
import settingsSvg from '@tabler/icons/outline/settings.svg';
import clockPlusSvg from '@tabler/icons/outline/clock-plus.svg';
import currentLocationSvg from '@tabler/icons/filled/current-location.svg';
import playerRecordSvg from '@tabler/icons/outline/player-record.svg';
import circleXSvg from '@tabler/icons/outline/circle-x.svg';
import circleCheckSvg from '@tabler/icons/outline/circle-check.svg';
import adjustmentsHorizontalSvg from '@tabler/icons/outline/adjustments-horizontal.svg';
import cloudSvg from '@tabler/icons/outline/cloud.svg';
import deviceFloppySvg from '@tabler/icons/outline/device-floppy.svg';
import folderOpenSvg from '@tabler/icons/outline/folder-open.svg';
import fileExportSvg from '@tabler/icons/outline/file-export.svg';
import fileImportSvg from '@tabler/icons/outline/file-import.svg';
import fileSpreadsheetSvg from '@tabler/icons/outline/file-spreadsheet.svg';
import loginSvg from '@tabler/icons/outline/login.svg';
import logoutSvg from '@tabler/icons/outline/logout.svg';
import refreshSvg from '@tabler/icons/outline/refresh.svg';
import alertTriangleSvg from '@tabler/icons/outline/alert-triangle.svg';
import databaseSvg from '@tabler/icons/outline/database.svg';
import serverSvg from '@tabler/icons/outline/server.svg';
import worldSvg from '@tabler/icons/outline/world.svg';
import plugConnectedSvg from '@tabler/icons/outline/plug-connected.svg';
import keySvg from '@tabler/icons/outline/key.svg';
import xSvg from '@tabler/icons/outline/x.svg';
import indentIncreaseSvg from '@tabler/icons/outline/indent-increase.svg';
import indentDecreaseSvg from '@tabler/icons/outline/indent-decrease.svg';

/**
 * Tabler icons sourced directly from the official @tabler/icons package.
 * SVG assets are bundled as text and expanded with DOM APIs only.
 */

export type TablerIconName =
  | 'plus'
  | 'alarm-plus'
  | 'minus'
  | 'circle-plus'
  | 'circle-minus'
  | 'trash'
  | 'clipboard'
  | 'settings'
  | 'clock-plus'
  | 'current-location'
  | 'player-record'
  | 'circle-x'
  | 'circle-check'
  | 'adjustments-horizontal'
  | 'cloud'
  | 'device-floppy'
  | 'folder-open'
  | 'file-export'
  | 'file-import'
  | 'file-spreadsheet'
  | 'login'
  | 'logout'
  | 'refresh'
  | 'alert-triangle'
  | 'database'
  | 'server'
  | 'world'
  | 'plug-connected'
  | 'key'
  | 'x'
  | 'indent-increase'
  | 'indent-decrease';

const ICON_SVGS: Record<TablerIconName, string> = {
  'plus': plusSvg,
  'alarm-plus': alarmPlusSvg,
  'minus': minusSvg,
  'circle-plus': circlePlusSvg,
  'circle-minus': circleMinusSvg,
  'trash': trashSvg,
  'clipboard': clipboardSvg,
  'settings': settingsSvg,
  'clock-plus': clockPlusSvg,
  'current-location': currentLocationSvg,
  'player-record': playerRecordSvg,
  'circle-x': circleXSvg,
  'circle-check': circleCheckSvg,
  'adjustments-horizontal': adjustmentsHorizontalSvg,
  'cloud': cloudSvg,
  'device-floppy': deviceFloppySvg,
  'folder-open': folderOpenSvg,
  'file-export': fileExportSvg,
  'file-import': fileImportSvg,
  'file-spreadsheet': fileSpreadsheetSvg,
  'login': loginSvg,
  'logout': logoutSvg,
  'refresh': refreshSvg,
  'alert-triangle': alertTriangleSvg,
  'database': databaseSvg,
  'server': serverSvg,
  'world': worldSvg,
  'plug-connected': plugConnectedSvg,
  'key': keySvg,
  'x': xSvg,
  'indent-increase': indentIncreaseSvg,
  'indent-decrease': indentDecreaseSvg,
};

const SVG_NS = 'http://www.w3.org/2000/svg';
const SVG_OUTER_REGEX = /^\s*<svg\s+([^>]*)>([\s\S]*?)<\/svg>\s*$/;
const SVG_CHILD_REGEX = /<([a-zA-Z][\w:-]*)([^>]*)\/>/g;
const SVG_ATTR_REGEX = /([a-zA-Z_:][\w:.-]*)="([^"]*)"/g;

const iconTemplateCache = new Map<TablerIconName, SVGSVGElement>();

function parseAttributes(fragment: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const match of fragment.matchAll(SVG_ATTR_REGEX)) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

function buildSvgFromSource(source: string): SVGSVGElement {
  const outerMatch = source.match(SVG_OUTER_REGEX);
  if (!outerMatch) {
    throw new Error('Invalid Tabler SVG source');
  }

  const [, rootAttrSource, childrenSource] = outerMatch;
  const svg = document.createElementNS(SVG_NS, 'svg') as SVGSVGElement;
  const rootAttrs = parseAttributes(rootAttrSource);

  for (const [key, value] of Object.entries(rootAttrs)) {
    if (key === 'class') {
      continue;
    }
    svg.setAttribute(key, value);
  }

  for (const childMatch of childrenSource.matchAll(SVG_CHILD_REGEX)) {
    const [, tagName, attrSource] = childMatch;
    const child = document.createElementNS(SVG_NS, tagName);
    const attrs = parseAttributes(attrSource);

    for (const [key, value] of Object.entries(attrs)) {
      child.setAttribute(key, value);
    }

    svg.appendChild(child);
  }

  return svg;
}

function getIconTemplate(name: TablerIconName): SVGSVGElement {
  const existing = iconTemplateCache.get(name);
  if (existing) {
    return existing;
  }

  const svg = buildSvgFromSource(ICON_SVGS[name]);
  iconTemplateCache.set(name, svg);
  return svg;
}

/**
 * Create a Tabler icon as an inline SVG element.
 * Uses the official package asset plus DOM APIs only, so it stays CSP-safe.
 */
export function createIcon(name: TablerIconName, size = 20): SVGSVGElement {
  const svg = getIconTemplate(name).cloneNode(true) as SVGSVGElement;
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('aria-hidden', 'true');
  svg.style.pointerEvents = 'none';
  svg.style.flexShrink = '0';
  svg.style.verticalAlign = 'middle';
  return svg;
}

/** Replace element's child content with a single icon SVG. */
export function setIcon(el: Element, name: TablerIconName, size?: number): void {
  el.replaceChildren(createIcon(name, size));
}

/** Replace element's child content with an icon followed by a text label. */
export function setIconLabel(el: Element, name: TablerIconName, label: string, size?: number): void {
  el.replaceChildren(createIcon(name, size), document.createTextNode('\u00a0' + label));
}
