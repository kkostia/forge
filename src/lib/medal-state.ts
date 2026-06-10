import {
  MIN_REPS_FOR_PR,
  MUSCLE_GROUPS,
  type EarnableTier,
  type MedalThresholds,
  type MedalTier,
  type MuscleGroup,
} from "@/lib/constants";
import { medalForWeight, nextTier, progressToNext, tiersUpTo, type NextTier } from "@/lib/medals";
import type { TrainingSet } from "@/lib/progress";

/** The anchor lift driving a muscle group's medal. */
export type AnchorInfo = {
  slug: string;
  name: string;
  thresholds: MedalThresholds;
};

export type GroupMedal = {
  group: MuscleGroup;
  anchor: AnchorInfo | null;
  bestWeight: number;
  tier: MedalTier;
  earned: EarnableTier[];
  next: NextTier;
  progress: number;
};

/** Heaviest "working" set (reps >= MIN_REPS_FOR_PR) for one exercise slug. */
export function bestWorkingWeight(sets: TrainingSet[], slug: string): number {
  let best = 0;
  for (const s of sets) {
    if (s.exerciseSlug === slug && s.reps >= MIN_REPS_FOR_PR) {
      best = Math.max(best, s.weightKg);
    }
  }
  return best;
}

/** Medal standing for every muscle group, from the user's sets + anchor lifts. */
export function computeGroupMedals(
  sets: TrainingSet[],
  anchors: Partial<Record<MuscleGroup, AnchorInfo>>,
): GroupMedal[] {
  return MUSCLE_GROUPS.map((group) => {
    const anchor = anchors[group] ?? null;
    if (!anchor) {
      return {
        group,
        anchor: null,
        bestWeight: 0,
        tier: "NONE",
        earned: [],
        next: null,
        progress: 0,
      };
    }
    const best = bestWorkingWeight(sets, anchor.slug);
    const tier = medalForWeight(anchor.thresholds, best);
    return {
      group,
      anchor,
      bestWeight: best,
      tier,
      earned: tiersUpTo(tier),
      next: nextTier(anchor.thresholds, tier, best),
      progress: progressToNext(anchor.thresholds, tier, best),
    };
  });
}
