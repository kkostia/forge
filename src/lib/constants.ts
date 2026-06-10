/* Shared domain constants — mirror the Supabase enums in section 4 of PLAN.md. */

export const MUSCLE_GROUPS = ["CHEST", "BACK", "LEGS", "SHOULDERS", "ARMS", "CORE"] as const;
export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  CHEST: "Chest",
  BACK: "Back",
  LEGS: "Legs",
  SHOULDERS: "Shoulders",
  ARMS: "Arms",
  CORE: "Core",
};

export const DIFFICULTIES = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

/** Medal tiers, lowest → highest. NONE = not yet earned. */
export const MEDAL_TIERS = ["NONE", "BRONZE", "SILVER", "GOLD", "PLATINUM"] as const;
export type MedalTier = (typeof MEDAL_TIERS)[number];

/** Weekdays, indexed 0=Sun .. 6=Sat (matches JS Date.getDay and profiles.training_days). */
export const WEEKDAYS = [
  { value: 0, short: "Sun", label: "Sunday" },
  { value: 1, short: "Mon", label: "Monday" },
  { value: 2, short: "Tue", label: "Tuesday" },
  { value: 3, short: "Wed", label: "Wednesday" },
  { value: 4, short: "Thu", label: "Thursday" },
  { value: 5, short: "Fri", label: "Friday" },
  { value: 6, short: "Sat", label: "Saturday" },
] as const;

/** Earnable tiers in ascending order (excludes NONE). */
export const EARNABLE_TIERS = ["BRONZE", "SILVER", "GOLD", "PLATINUM"] as const;
export type EarnableTier = (typeof EARNABLE_TIERS)[number];

export const MEDAL_LABELS: Record<MedalTier, string> = {
  NONE: "Unranked",
  BRONZE: "Bronze",
  SILVER: "Silver",
  GOLD: "Gold",
  PLATINUM: "Platinum",
};

/** Numeric rank for comparing tiers. */
export const MEDAL_RANK: Record<MedalTier, number> = {
  NONE: 0,
  BRONZE: 1,
  SILVER: 2,
  GOLD: 3,
  PLATINUM: 4,
};

/** Shape of `Exercise.medalThresholds` (kg). */
export type MedalThresholds = {
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
};

/** A "working set" must hit at least this many reps to count toward a PR. */
export const MIN_REPS_FOR_PR = 3;
