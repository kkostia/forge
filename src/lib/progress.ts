import { MIN_REPS_FOR_PR, type MuscleGroup } from "@/lib/constants";

/** A flattened set used for progress aggregation (pure, testable). */
export type TrainingSet = {
  weightKg: number;
  reps: number;
  date: string; // 'YYYY-MM-DD'
  exerciseSlug: string;
  exerciseName: string;
  muscleGroup: MuscleGroup;
  isAnchor: boolean;
};

export type PersonalRecord = {
  slug: string;
  name: string;
  muscleGroup: MuscleGroup;
  isAnchor: boolean;
  /** Heaviest weight lifted for any rep count. */
  bestWeight: number;
  /** Heaviest weight for a "working" set (reps >= MIN_REPS_FOR_PR) — drives medals. */
  bestWorkingWeight: number;
  totalVolume: number;
  setCount: number;
  lastDate: string;
};

/** Total training volume (Σ weight × reps), in kg. */
export function totalVolume(sets: TrainingSet[]): number {
  return sets.reduce((sum, s) => sum + s.weightKg * s.reps, 0);
}

/** Best lifts per exercise, sorted with anchor lifts first then by volume. */
export function personalRecords(sets: TrainingSet[]): PersonalRecord[] {
  const byEx = new Map<string, PersonalRecord>();

  for (const s of sets) {
    const existing = byEx.get(s.exerciseSlug);
    const working = s.reps >= MIN_REPS_FOR_PR ? s.weightKg : 0;
    if (!existing) {
      byEx.set(s.exerciseSlug, {
        slug: s.exerciseSlug,
        name: s.exerciseName,
        muscleGroup: s.muscleGroup,
        isAnchor: s.isAnchor,
        bestWeight: s.weightKg,
        bestWorkingWeight: working,
        totalVolume: s.weightKg * s.reps,
        setCount: 1,
        lastDate: s.date,
      });
    } else {
      existing.bestWeight = Math.max(existing.bestWeight, s.weightKg);
      existing.bestWorkingWeight = Math.max(existing.bestWorkingWeight, working);
      existing.totalVolume += s.weightKg * s.reps;
      existing.setCount += 1;
      if (s.date > existing.lastDate) existing.lastDate = s.date;
    }
  }

  return [...byEx.values()].sort((a, b) => {
    if (a.isAnchor !== b.isAnchor) return a.isAnchor ? -1 : 1;
    return b.totalVolume - a.totalVolume;
  });
}

/** Monday (local) of the week containing a 'YYYY-MM-DD' date, as 'YYYY-MM-DD'. */
export function weekStartOf(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const day = dt.getDay(); // 0=Sun..6=Sat
  const diff = (day + 6) % 7; // days since Monday
  dt.setDate(dt.getDate() - diff);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export type WeeklyVolumeRow = { weekStart: string; label: string } & Record<MuscleGroup, number>;

const ZERO_GROUPS: Record<MuscleGroup, number> = {
  CHEST: 0,
  BACK: 0,
  LEGS: 0,
  SHOULDERS: 0,
  ARMS: 0,
  CORE: 0,
};

function weekLabel(weekStart: string): string {
  const [y, m, d] = weekStart.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/** Stacked weekly volume per muscle group for the most recent `maxWeeks`. */
export function weeklyVolumeByGroup(sets: TrainingSet[], maxWeeks = 12): WeeklyVolumeRow[] {
  if (sets.length === 0) return [];

  const buckets = new Map<string, Record<MuscleGroup, number>>();
  for (const s of sets) {
    const wk = weekStartOf(s.date);
    if (!buckets.has(wk)) buckets.set(wk, { ...ZERO_GROUPS });
    buckets.get(wk)![s.muscleGroup] += s.weightKg * s.reps;
  }

  const weeks = [...buckets.keys()].sort().slice(-maxWeeks);
  return weeks.map((wk) => ({
    weekStart: wk,
    label: weekLabel(wk),
    ...buckets.get(wk)!,
  }));
}

export type ProgressPoint = { date: string; label: string; bestWeight: number };

/** Best working-set weight per training day for one exercise, oldest first. */
export function exerciseProgress(sets: TrainingSet[], slug: string): ProgressPoint[] {
  const byDate = new Map<string, number>();
  for (const s of sets) {
    if (s.exerciseSlug !== slug) continue;
    byDate.set(s.date, Math.max(byDate.get(s.date) ?? 0, s.weightKg));
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, bestWeight]) => {
      const [y, m, d] = date.split("-").map(Number);
      return {
        date,
        label: new Date(y, m - 1, d).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        }),
        bestWeight,
      };
    });
}
