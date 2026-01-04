declare const GM_info: {
  script: {
    version: string;
  };
};

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function log(message: string, ...args: any[]) {
  let logLevel: LogLevel = 'debug';
  const consoleArgs = [...args];
  if (args.length > 0 && typeof args[args.length - 1] === 'string' &&
    ['debug', 'info', 'warn', 'error'].includes(args[args.length - 1])) {
    logLevel = consoleArgs.pop() as LogLevel;
  }
  const version = GM_info.script.version;
  const prefix = `[Timekeeper v${version}]`;
  const methodMap: Record<LogLevel, (...args: any[]) => void> = {
    'debug': console.log, 'info': console.info, 'warn': console.warn, 'error': console.error
  };
  methodMap[logLevel](`${prefix} ${message}`, ...consoleArgs);
}

/**
 * Format seconds into a time string (M:SS, MM:SS, H:MM:SS, or HH:MM:SS)
 * @param seconds - The time in seconds to format
 * @param videoDuration - The total video duration (used to determine format)
 */
export function formatTimeString(seconds: number, videoDuration: number = seconds): string {
  // Use 'mm:ss' for videos shorter than 1 hour, 'H:mm:ss' for 1–9:59:59, and 'HH:mm:ss' for 10+ hours
  const ms = Math.max(0, Math.floor(seconds) * 1000);
  const fmt = videoDuration < 3600 ? 'mm:ss' : (videoDuration >= 36000 ? 'HH:mm:ss' : 'H:mm:ss');
  return dayjs.utc(ms).format(fmt);
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
  // Use dayjs UTC formatting to generate suffix like: YYYY-MM-DD--HH-mm-ss
  return dayjs().utc().format('YYYY-MM-DD--HH-mm-ss');
}
