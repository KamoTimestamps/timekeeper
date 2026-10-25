import { DISPLAY_VERSION } from './build-info';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export function log(message: string, ...args: any[]) {
  let logLevel: LogLevel = 'debug';
  const consoleArgs = [...args];
  if (args.length > 0 && typeof args[args.length - 1] === 'string' &&
    ['debug', 'info', 'warn', 'error'].includes(args[args.length - 1])) {
    logLevel = consoleArgs.pop() as LogLevel;
  }
  const prefix = `[Timekeeper v${DISPLAY_VERSION}]`;
  const methodMap: Record<LogLevel, (...args: any[]) => void> = {
    'debug': console.log, 'info': console.info, 'warn': console.warn, 'error': console.error
  };
  methodMap[logLevel](`${prefix} ${message}`, ...consoleArgs);
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * Format seconds into a time string (M:SS, MM:SS, H:MM:SS, or HH:MM:SS)
 * @param seconds - The time in seconds to format
 * @param maxTime - The maximum timestamp value in the list (determines format width)
 */
export function formatTimeString(seconds: number, maxTime: number = seconds): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = pad2(seconds % 60);

  // Under 1 hour: M:SS, or MM:SS once the max reaches 10 minutes
  if (maxTime < 3600) {
    return `${maxTime >= 600 ? pad2(m) : m}:${s}`;
  }

  // With hours: H:MM:SS, or HH:MM:SS once the max reaches 10 hours
  return `${maxTime >= 36000 ? pad2(h) : h}:${pad2(m)}:${s}`;
}

/**
 * Format the current-time display (padded to the video length): "M:SS" plus a " (x/min)"
 * timestamp rate when applicable. The rate spans the first to last timestamp (at least 1 minute),
 * independent of playback position.
 * @param seconds - Current playback time in seconds
 * @param timestamps - Raw timestamp start times in seconds
 * @param durationSeconds - Video duration in seconds (determines format width)
 */
export function formatTimeDisplay(
  seconds: number,
  timestamps: number[],
  durationSeconds: number,
): string {
  const time = formatTimeString(seconds, Math.max(seconds, durationSeconds));
  if (timestamps.length === 0) return time;

  const spanMinutes = (Math.max(...timestamps) - Math.min(...timestamps)) / 60;
  const rate = (timestamps.length / Math.max(1, spanMinutes)).toFixed(2);
  return parseFloat(rate) > 0 ? `${time} (${rate}/min)` : time;
}

/**
 * Format timestamps as plain-text lines: "<time> <comment>", optionally with a trailing guid marker.
 * Time width is padded to fit the latest timestamp in the list.
 * @param timestamps - Records to format
 * @param includeGuids - Append `<!-- guid:... -->` to each line
 */
export function formatTimestampLines(
  timestamps: { start: number; comment: string; guid: string }[],
  includeGuids: boolean,
): string {
  const maxTime = Math.max(0, ...timestamps.map((ts) => ts.start));
  return timestamps
    .map((ts) => {
      const timeString = formatTimeString(ts.start, maxTime);
      const comment = includeGuids
        ? `${ts.comment} <!-- guid:${ts.guid} -->`.trimStart()
        : ts.comment;
      return `${timeString} ${comment}`;
    })
    .join("\n");
}

/**
 * Build a YouTube URL with a timestamp parameter
 * @param timeInSeconds - The timestamp in seconds
 * @param currentUrl - The current URL to modify (defaults to window.location.href)
 */
export function buildYouTubeUrlWithTimestamp(timeInSeconds: number, currentUrl: string = window.location.href): string {
  // Try to reuse the original URL structure
  try {
    const url = new URL(currentUrl);
    url.searchParams.set('t', `${timeInSeconds}s`);
    return url.toString();
  } catch {
    // Fallback if URL parsing fails: extract video ID and build from scratch
    const vid = currentUrl.search(/[?&]v=/) >= 0
      ? currentUrl.split(/[?&]v=/)[1].split(/&/)[0]
      : currentUrl.split(/\/live\/|\/shorts\/|\?|&/)[1];
    return `https://www.youtube.com/watch?v=${vid}&t=${timeInSeconds}s`;
  }
}

/**
 * Generate a UTC timestamp suffix in format: YYYY-MM-DD--HH-MM-SS
 */
export function getTimestampSuffix(): string {
  const now = new Date();
  return now.getUTCFullYear() +
    '-' + String(now.getUTCMonth() + 1).padStart(2, '0') +
    '-' + String(now.getUTCDate()).padStart(2, '0') +
    '--' + String(now.getUTCHours()).padStart(2, '0') +
    '-' + String(now.getUTCMinutes()).padStart(2, '0') +
    '-' + String(now.getUTCSeconds()).padStart(2, '0');
}
