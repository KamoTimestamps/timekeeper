import { log } from './util';

export interface HolidayConfig {
  emoji: string;
  month: number;
  day: number;
  name: string;
}

// Holiday dates and emoji configuration
export const holidayEmojis: HolidayConfig[] = [
  {
    emoji: "🥂",
    month: 1,
    day: 1,
    name: "New Year's Day"
  },
  {
    emoji: "💝",
    month: 2,
    day: 14,
    name: "Valentine's Day"
  },
  {
    emoji: "🦆",
    month: 5,
    day: 25,
    name: "Kanna's Debut Anniversary"
  },
  {
    emoji: "🎃",
    month: 10,
    day: 31,
    name: "Halloween"
  },
  {
    emoji: "🎂",
    month: 9,
    day: 15,
    name: "Kanna's Birthday"
  },
  {
    emoji: "🌲",
    month: 12,
    day: 25,
    name: "Christmas"
  },
];

// Check if current date is within 7 days before or 3 days after any holiday
export function getHolidayEmoji(): string | null {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  for (const holiday of holidayEmojis) {
    // Check holiday in current year
    let holidayDate = new Date(currentYear, holiday.month - 1, holiday.day);
    let diffTime = holidayDate.getTime() - now.getTime();
    let diffDays = diffTime / (1000 * 60 * 60 * 24);

    // Within 5 days before or 2 days after the holiday
    if (diffDays <= 5 && diffDays >= -2) {
      log(`Current date: ${currentDate}, Selected emoji: ${holiday.emoji} (${holiday.name}), Days until holiday: ${Math.ceil(diffDays)}`);
      return holiday.emoji;
    }

    // Check if we're near the end of the year and this holiday is at the start of next year
    if (diffDays < -2) {
      holidayDate = new Date(currentYear + 1, holiday.month - 1, holiday.day);
      diffTime = holidayDate.getTime() - now.getTime();
      diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays <= 5 && diffDays >= -2) {
        log(`Current date: ${currentDate}, Selected emoji: ${holiday.emoji} (${holiday.name}), Days until holiday: ${Math.ceil(diffDays)}`);
        return holiday.emoji;
      }
    }

    // Check if we're at the start of the year and this holiday was at the end of last year
    if (diffDays > 5) {
      holidayDate = new Date(currentYear - 1, holiday.month - 1, holiday.day);
      diffTime = holidayDate.getTime() - now.getTime();
      diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays <= 5 && diffDays >= -2) {
        log(`Current date: ${currentDate}, Selected emoji: ${holiday.emoji} (${holiday.name}), Days until holiday: ${Math.ceil(diffDays)}`);
        return holiday.emoji;
      }
    }
  }

  log(`Current date: ${currentDate}, No holiday emoji (not within range)`);
  return null;
}
