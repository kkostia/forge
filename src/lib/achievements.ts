import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getExercises } from "@/lib/exercises";
import { getTrainingSets } from "@/lib/workouts";
import { computeGroupMedals, type AnchorInfo, type GroupMedal } from "@/lib/medal-state";
import { MEDAL_RANK, type EarnableTier, type MuscleGroup } from "@/lib/constants";

/** Map each muscle group to its anchor lift (slug, name, thresholds, id). */
async function getAnchorMap(): Promise<{
  anchors: Partial<Record<MuscleGroup, AnchorInfo>>;
  idBySlug: Map<string, string>;
}> {
  const exercises = await getExercises();
  const anchors: Partial<Record<MuscleGroup, AnchorInfo>> = {};
  const idBySlug = new Map<string, string>();
  for (const e of exercises) {
    idBySlug.set(e.slug, e.id);
    if (e.is_anchor_lift) {
      anchors[e.muscle_group] = {
        slug: e.slug,
        name: e.name,
        thresholds: e.medal_thresholds,
      };
    }
  }
  return { anchors, idBySlug };
}

export type EarnedMedal = { group: MuscleGroup; tier: EarnableTier };

/** Full medal standing for the current user (for the trophy case / dashboard). */
export async function getMedalOverview(): Promise<GroupMedal[]> {
  const [sets, { anchors }] = await Promise.all([getTrainingSets(), getAnchorMap()]);
  return computeGroupMedals(sets, anchors);
}

/**
 * Recompute medals from the user's logs and persist any newly earned tiers as
 * Achievement rows. Returns the medals minted by this call (for toasts).
 * Idempotent: existing achievements are left untouched and never revoked.
 */
export async function recomputeAchievements(userId: string): Promise<EarnedMedal[]> {
  const supabase = await createClient();
  const [sets, { anchors, idBySlug }] = await Promise.all([getTrainingSets(), getAnchorMap()]);
  const medals = computeGroupMedals(sets, anchors);

  const { data: existingRows } = await supabase
    .from("achievements")
    .select("muscle_group, medal")
    .eq("user_id", userId);

  const existing = new Set((existingRows ?? []).map((r) => `${r.muscle_group}:${r.medal}`));

  const toInsert: {
    user_id: string;
    muscle_group: MuscleGroup;
    medal: EarnableTier;
    exercise_id: string | null;
  }[] = [];
  const earned: EarnedMedal[] = [];

  for (const m of medals) {
    for (const tier of m.earned) {
      if (!existing.has(`${m.group}:${tier}`)) {
        toInsert.push({
          user_id: userId,
          muscle_group: m.group,
          medal: tier,
          exercise_id: m.anchor ? (idBySlug.get(m.anchor.slug) ?? null) : null,
        });
        earned.push({ group: m.group, tier });
      }
    }
  }

  if (toInsert.length > 0) {
    await supabase
      .from("achievements")
      .upsert(toInsert, { onConflict: "user_id,muscle_group,medal", ignoreDuplicates: true });
  }

  // Highest new tier first so a multi-tier jump toasts the best medal foremost.
  return earned.sort((a, b) => MEDAL_RANK[b.tier] - MEDAL_RANK[a.tier]);
}
