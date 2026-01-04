import { describe, it, expect } from 'vitest';
import { formatTimeString } from '../util';

describe('formatTimeString', () => {
  it('formats mm:ss for videos shorter than 1 hour', () => {
    // 2 minutes 5 seconds
    expect(formatTimeString(125, 3599)).toBe('02:05');
  });

  it('formats H:mm:ss for videos between 1 hour and <10 hours', () => {
    // 1 hour, 1 minute, 5 seconds
    expect(formatTimeString(3665, 7200)).toBe('1:01:05');
  });

  it('formats HH:mm:ss for videos 10 hours or longer', () => {
    // 12 hours and 5 seconds
    const seconds = 12 * 3600 + 5;
    expect(formatTimeString(seconds, seconds)).toBe('12:00:05');
  });
});
