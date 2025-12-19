import { log } from './util';

export interface HolidayConfig {
  emoji: string;
  month: number;
  day: number;
  name: string;
}

// Holiday configuration - can be extended with more holidays
export const holidayEmojis: HolidayConfig[] = [
  {
    emoji: "🌲",
    month: 12, // December
    day: 25,
    name: "Christmas"
  },
  {
    emoji: "🥂",
    month: 1, // January
    day: 1,
    name: "New Year's Day"
  },
  {
    emoji: "💝",
    month: 2, // February
    day: 14,
    name: "Valentine's Day"
  },
  {
    emoji: "🎃",
    month: 10, // October
    day: 31,
    name: "Halloween"
  }
];

// Check if current date is within 7 days before or 3 days after any holiday
export function getHolidayEmoji(): string | null {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  for (const holiday of holidayEmojis) {
    const holidayDate = new Date(currentYear, holiday.month - 1, holiday.day);
    const diffTime = holidayDate.getTime() - now.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    // Within 7 days before or 3 days after the holiday
    if (diffDays <= 7 && diffDays >= -3) {
      log(`Current date: ${currentDate}, Selected emoji: ${holiday.emoji} (${holiday.name}), Days until holiday: ${Math.ceil(diffDays)}`);
      return holiday.emoji;
    }
  }

  log(`Current date: ${currentDate}, No holiday emoji (not within range)`);
  return null;
}
