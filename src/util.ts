declare const GM_info: {
  script: {
    version: string;
  };
};

import type { LogLevel } from './types';

/**
 * Log a message to the console with optional log level
 * @param message - The message to log
 * @param args - Additional arguments (last can be a log level)
 */
export function log(message: string, ...args: (unknown | LogLevel)[]): void {
  let logLevel: LogLevel = 'log';
  const consoleArgs: unknown[] = [...args];
  if (args.length > 0 && typeof args[args.length - 1] === 'string' &&
    ['debug', 'info', 'warn', 'error', 'log'].includes(args[args.length - 1])) {
    logLevel = consoleArgs.pop() as LogLevel;
  }
  const version = GM_info.script.version;
  const prefix = `[Timekeeper v${version}]`;
  const methodMap: Record<LogLevel, (...args: unknown[]) => void> = {
    'debug': console.log,
    'info': console.info,
    'warn': console.warn,
    'error': console.error,
    'log': console.log
  };
  methodMap[logLevel](`${prefix} ${message}`, ...consoleArgs);
}

/**
 * Format seconds into a time string (M:SS, MM:SS, H:MM:SS, or HH:MM:SS)
 * @param seconds - The time in seconds to format
 * @param videoDuration - The total video duration (used to determine format)
 */
export function formatTimeString(seconds: number, videoDuration: number = seconds): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(seconds % 60).padStart(2, "0");

  // For times under 1 hour, show M:SS or MM:SS
  if (videoDuration < 3600) {
    return `${m < 10 ? m : String(m).padStart(2, "0")}:${s}`;
  }

  // For times with hours, show H:MM:SS or HH:MM:SS
  return `${videoDuration >= 36000 ? String(h).padStart(2, "0") : h}:${String(m).padStart(2, "0")}:${s}`;
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
