/**
 * The search box's `date:` terms. A term is a day, month or year (`2026-10-25`, `2026-10`, `2026`),
 * or a range between two of them, both ends included (`2026-10-01..2026-10-25`), or open on one
 * side (`2026-10-01..`, `..2026-10-25`). Days are the user's own, in their time zone, because that
 * is how the page shows air dates.
 */

export interface InstantRange {
  /** Inclusive lower bound, as an ISO 8601 UTC string like the published_at column; null for none. */
  from: string | null;
  /** Exclusive upper bound; null for none. */
  to: string | null;
}

const PERIOD = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/;

/** Whether `zone` is a time zone name this runtime knows. */
export function isTimeZone(zone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}

/** Minutes the zone is ahead of UTC at that instant. */
function offsetMinutes(zone: string, utcMs: number): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(utcMs));
  const v = Object.fromEntries(parts.map((p) => [p.type, Number(p.value)]));
  const local = Date.UTC(v.year, v.month - 1, v.day, v.hour, v.minute, v.second);
  return (local - Math.floor(utcMs / 1000) * 1000) / 60000;
}

/** The instant a calendar day begins in `zone` (day may overflow the month; Date.UTC rolls it over). */
function startOfDay(zone: string, year: number, month: number, day: number): number {
  const wall = Date.UTC(year, month - 1, day);
  const first = wall - offsetMinutes(zone, wall) * 60000;
  const second = wall - offsetMinutes(zone, first) * 60000; // the offset can differ at a DST change
  return second;
}

/** [start, end) of a day, month or year in `zone`; null if the text isn't a real date. */
function period(text: string, zone: string): [number, number] | null {
  const m = PERIOD.exec(text);
  if (!m) return null;
  const year = Number(m[1]);
  const month = m[2] === undefined ? undefined : Number(m[2]);
  const day = m[3] === undefined ? undefined : Number(m[3]);
  if (month !== undefined && (month < 1 || month > 12)) return null;
  if (day !== undefined && (day < 1 || day > new Date(Date.UTC(year, month!, 0)).getUTCDate())) return null;

  if (day !== undefined) return [startOfDay(zone, year, month!, day), startOfDay(zone, year, month!, day + 1)];
  if (month !== undefined) return [startOfDay(zone, year, month, 1), startOfDay(zone, year, month + 1, 1)];
  return [startOfDay(zone, year, 1, 1), startOfDay(zone, year + 1, 1, 1)];
}

const iso = (ms: number) => new Date(ms).toISOString().replace(/\.\d{3}Z$/, 'Z');

/** The instants a `date:` term covers, or null when it isn't a valid date or range (so it is ignored). */
export function dateRange(term: string, zone = 'UTC'): InstantRange | null {
  const tz = isTimeZone(zone) ? zone : 'UTC';
  const [left, right, extra] = term.split('..');
  if (extra !== undefined) return null;

  if (right === undefined) {
    const p = period(left, tz);
    return p && { from: iso(p[0]), to: iso(p[1]) };
  }
  const start = left === '' ? null : period(left, tz);
  const end = right === '' ? null : period(right, tz);
  if ((left !== '' && !start) || (right !== '' && !end) || (left === '' && right === '')) return null;
  if (start && end && start[0] >= end[1]) return null; // the end day is before the start day
  return { from: start && iso(start[0]), to: end && iso(end[1]) };
}
