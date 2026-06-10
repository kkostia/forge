/**
 * Training streak logic. A streak counts consecutive *planned* training days
 * (per the user's weekly schedule) on which they logged at least one session.
 *
 * Rules:
 * - Walk backwards from "today" in the user's timezone.
 * - A planned day with no session breaks the streak.
 * - Non-planned days are skipped (neither break nor count).
 * - Today, if planned and not yet logged, is a grace day — it doesn't break
 *   the streak until the day is over.
 *
 * All dates are 'YYYY-MM-DD' strings; arithmetic uses local calendar days, so
 * results are stable regardless of the host timezone.
 */

export type StreakResult = {
  current: number;
  longest: number;
  lastTrainedDate: string | null;
};

function parse(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function format(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function computeStreak(
  trainingDays: number[],
  trainedDates: string[],
  today: string,
): StreakResult {
  const planned = new Set(trainingDays);
  const trained = new Set(trainedDates);
  const lastTrainedDate =
    trainedDates.length > 0 ? trainedDates.reduce((a, b) => (a > b ? a : b)) : null;

  if (planned.size === 0) {
    return { current: 0, longest: 0, lastTrainedDate };
  }

  // --- current streak: walk backwards from today ---
  let current = 0;
  let cursor = parse(today);
  let isToday = true;
  for (let i = 0; i < 3660; i++) {
    const ds = format(cursor);
    if (planned.has(cursor.getDay())) {
      if (trained.has(ds)) {
        current++;
      } else if (isToday) {
        // grace: today not logged yet — doesn't break
      } else {
        break;
      }
    }
    cursor = addDays(cursor, -1);
    isToday = false;
  }

  // --- longest streak: scan forward from the first trained day ---
  let longest = 0;
  if (lastTrainedDate) {
    const start = parse(trainedDates.reduce((a, b) => (a < b ? a : b)));
    const end = parse(today);
    let run = 0;
    for (let c = start; c <= end; c = addDays(c, 1)) {
      const ds = format(c);
      if (planned.has(c.getDay())) {
        if (trained.has(ds)) {
          run++;
          longest = Math.max(longest, run);
        } else if (ds === today) {
          // grace day — don't reset
        } else {
          run = 0;
        }
      }
    }
  }

  return { current, longest: Math.max(longest, current), lastTrainedDate };
}
