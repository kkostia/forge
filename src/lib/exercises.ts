import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { EXERCISES, type SeedExercise } from "@/data/exercises";
import type { ExerciseRow } from "@/lib/supabase/types";

/**
 * Exercise knowledge-base access. Reads from Supabase when configured;
 * otherwise serves the bundled seed catalog so the library (and the demo)
 * works on a fresh clone with no keys. Rows are identical either way —
 * the seed script upserts this same content.
 */

function seedToRow(e: SeedExercise): ExerciseRow {
  return {
    id: e.slug, // stable synthetic id for the no-DB fallback
    slug: e.slug,
    name: e.name,
    muscle_group: e.muscleGroup,
    equipment: e.equipment,
    difficulty: e.difficulty,
    is_anchor_lift: e.isAnchorLift,
    short_description: e.shortDescription,
    instructions: e.instructions,
    lifehacks: e.lifehacks,
    media_url: null,
    medal_thresholds: e.medalThresholds,
    created_at: new Date(0).toISOString(),
  };
}

export async function getExercises(): Promise<ExerciseRow[]> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("exercises").select("*").order("name");
    if (!error && data && data.length > 0) return data;
  }
  return EXERCISES.map(seedToRow).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getExerciseBySlug(slug: string): Promise<ExerciseRow | null> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.from("exercises").select("*").eq("slug", slug).maybeSingle();
    if (data) return data;
  }
  const seed = EXERCISES.find((e) => e.slug === slug);
  return seed ? seedToRow(seed) : null;
}

/** Other exercises in the same muscle group (for "related" rails). */
export async function getRelatedExercises(
  exercise: ExerciseRow,
  limit = 4,
): Promise<ExerciseRow[]> {
  const all = await getExercises();
  return all
    .filter((e) => e.muscle_group === exercise.muscle_group && e.slug !== exercise.slug)
    .slice(0, limit);
}
