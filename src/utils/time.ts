/** Convert board time (e.g. "6.00", "1.21") to minutes since midnight for sorting/filtering. */
export function boardTimeToMinutes(time: string): number {
  const normalized = time.trim().replace('.', ':');
  const [h, m = 0] = normalized.split(':').map(Number);
  return h * 60 + m;
}

/** Assign 24h minutes using chronological order (TN bus board style). */
export function resolveMinutesOfDay(times: string[]): number[] {
  const minutes: number[] = [];
  let last = -1;

  for (const time of times) {
    const normalized = time.trim().replace('.', ':');
    const [h, m = 0] = normalized.split(':').map(Number);
    let value = h * 60 + m;

    if (last >= 0) {
      if (value < last) {
        if (h >= 1 && h <= 3 && last >= 11 * 60) {
          value += 12 * 60;
        } else if (h >= 1 && h <= 5 && last >= 13 * 60 && value < 6 * 60) {
          value += 12 * 60;
        }
      }
      if (last >= 12 * 60 && h >= 1 && h <= 3 && value < 4 * 60) {
        value += 12 * 60;
      }
    }

    minutes.push(value);
    last = value;
  }

  return minutes;
}

export function formatBoardTime(time: string): string {
  const normalized = time.trim().replace('.', ':');
  const [h, m = 0] = normalized.split(':').map(Number);
  return `${h}.${String(m).padStart(2, '0')}`;
}

export type TimeFilter = 'all' | 'morning' | 'afternoon' | 'evening' | 'night';

export const timeFilterLabel: Record<TimeFilter, string> = {
  all: 'All timings',
  morning: 'Morning (04:00–11:59)',
  afternoon: 'Afternoon (12:00–15:59)',
  evening: 'Evening (16:00–19:59)',
  night: 'Night (20:00–03:59)',
};

export function isMinutesInFilter(minutes: number, filter: TimeFilter): boolean {
  if (filter === 'all') return true;

  switch (filter) {
    case 'morning':
      return minutes >= 4 * 60 && minutes < 12 * 60;
    case 'afternoon':
      return minutes >= 12 * 60 && minutes < 16 * 60;
    case 'evening':
      return minutes >= 16 * 60 && minutes < 20 * 60;
    case 'night':
      return minutes >= 20 * 60 || minutes < 4 * 60;
    default:
      return true;
  }
}
