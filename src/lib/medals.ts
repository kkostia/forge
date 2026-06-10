import {
  EARNABLE_TIERS,
  MEDAL_RANK,
  type EarnableTier,
  type MedalThresholds,
  type MedalTier,
} from "@/lib/constants";

/** Earnable tiers from highest to lowest. */
const DESC: EarnableTier[] = [...EARNABLE_TIERS].reverse() as EarnableTier[];

/** kg threshold for a tier from a thresholds object. */
export function thresholdFor(thresholds: MedalThresholds, tier: EarnableTier): number {
  return thresholds[tier.toLowerCase() as keyof MedalThresholds];
}

/**
 * Highest medal tier whose kg threshold is met by `bestWeight`.
 * Thresholds of 0 (e.g. a bodyweight plank) are earnable by any logged set.
 * Returns "NONE" when even bronze isn't reached.
 */
export function medalForWeight(thresholds: MedalThresholds, bestWeight: number): MedalTier {
  for (const tier of DESC) {
    if (bestWeight >= thresholdFor(thresholds, tier)) return tier;
  }
  return "NONE";
}

/** All earnable tiers at or below the given tier (the ones "earned"). */
export function tiersUpTo(tier: MedalTier): EarnableTier[] {
  return EARNABLE_TIERS.filter((t) => MEDAL_RANK[t] <= MEDAL_RANK[tier]);
}

export type NextTier = { tier: EarnableTier; kg: number; remaining: number } | null;

/** The next tier to chase from a current tier, with kg needed. Null at Platinum. */
export function nextTier(
  thresholds: MedalThresholds,
  current: MedalTier,
  bestWeight: number,
): NextTier {
  const next = EARNABLE_TIERS.find((t) => MEDAL_RANK[t] > MEDAL_RANK[current]);
  if (!next) return null;
  const kg = thresholdFor(thresholds, next);
  return { tier: next, kg, remaining: Math.max(0, kg - bestWeight) };
}

/**
 * Progress (0–100) from the current tier's threshold toward the next tier's.
 * Full bar at Platinum.
 */
export function progressToNext(
  thresholds: MedalThresholds,
  current: MedalTier,
  bestWeight: number,
): number {
  const next = nextTier(thresholds, current, bestWeight);
  if (!next) return 100;
  const floor = current === "NONE" ? 0 : thresholdFor(thresholds, current as EarnableTier);
  const span = next.kg - floor;
  if (span <= 0) return bestWeight >= next.kg ? 100 : 0;
  const pct = ((bestWeight - floor) / span) * 100;
  return Math.max(0, Math.min(100, pct));
}

/** Tiers in `earned` that are not in `previous` — i.e. newly minted. */
export function newlyEarned(previous: MedalTier, earned: MedalTier): EarnableTier[] {
  return tiersUpTo(earned).filter((t) => MEDAL_RANK[t] > MEDAL_RANK[previous]);
}
