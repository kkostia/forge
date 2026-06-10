/** Date helpers. Workout sessions use date-only ('YYYY-MM-DD') semantics. */

/** Today's calendar date in a given IANA timezone, as 'YYYY-MM-DD'. */
export function todayInTz(timezone: string): string {
  try {
    // en-CA formats as YYYY-MM-DD.
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

/** Validate a 'YYYY-MM-DD' string. */
export function isValidDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + "T00:00:00Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

/** Parse 'YYYY-MM-DD' to a local Date at midnight (no tz shift). */
export function parseDateString(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** A local Date -> 'YYYY-MM-DD' (using local calendar fields, no tz shift). */
export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Human-friendly label, e.g. "Mon, 9 Jun 2026". */
export function formatLongDate(value: string): string {
  return parseDateString(value).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * The next planned training day on or after `today`, as 'YYYY-MM-DD'.
 * Returns null when no training days are set.
 */
export function nextPlannedDate(trainingDays: number[], today: string): string | null {
  if (trainingDays.length === 0) return null;
  const planned = new Set(trainingDays);
  const cursor = parseDateString(today);
  for (let i = 0; i < 7; i++) {
    if (planned.has(cursor.getDay())) return toDateString(cursor);
    cursor.setDate(cursor.getDate() + 1);
  }
  return null;
}

/** Relative label for recent days: Today / Yesterday / long date. */
export function relativeDayLabel(value: string, todayValue: string): string {
  if (value === todayValue) return "Today";
  const target = parseDateString(value);
  const today = parseDateString(todayValue);
  const diffDays = Math.round((today.getTime() - target.getTime()) / 86_400_000);
  if (diffDays === 1) return "Yesterday";
  if (diffDays === -1) return "Tomorrow";
  return formatLongDate(value);
}
