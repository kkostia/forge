import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { MuscleGroup } from "@/lib/constants";
import type { TrainingSet } from "@/lib/progress";

/** A set entry joined with its exercise's display fields. */
export type SetWithExercise = {
  id: string;
  session_id: string;
  exercise_id: string;
  weight_kg: number;
  reps: number;
  rest_seconds: number | null;
  position: number;
  exercise: {
    name: string;
    slug: string;
    muscle_group: MuscleGroup;
  } | null;
};

export type SessionWithSets = {
  id: string;
  date: string;
  notes: string | null;
  sets: SetWithExercise[];
};

/** The session for a given day with its ordered sets (or null if none). */
export async function getSessionForDate(
  userId: string,
  date: string,
): Promise<SessionWithSets | null> {
  const supabase = await createClient();
  const { data: session } = await supabase
    .from("workout_sessions")
    .select("id, date, notes")
    .eq("user_id", userId)
    .eq("date", date)
    .maybeSingle();

  if (!session) return null;

  const { data: sets } = await supabase
    .from("set_entries")
    .select("*, exercise:exercises(name, slug, muscle_group)")
    .eq("session_id", session.id)
    .order("position");

  return { ...session, sets: (sets as SetWithExercise[] | null) ?? [] };
}

/** All dates the user has logged a session on (for the calendar markers). */
export async function getSessionDates(userId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("workout_sessions")
    .select("date")
    .eq("user_id", userId)
    .order("date", { ascending: false });
  return (data ?? []).map((r) => r.date);
}

/** Find-or-create the session row for a day, returning its id. */
export async function getOrCreateSession(userId: string, date: string): Promise<string> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("workout_sessions")
    .select("id")
    .eq("user_id", userId)
    .eq("date", date)
    .maybeSingle();
  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("workout_sessions")
    .insert({ user_id: userId, date })
    .select("id")
    .single();
  if (error || !created) throw new Error(error?.message ?? "Could not create session.");
  return created.id;
}

type RawTrainingRow = {
  weight_kg: number;
  reps: number;
  session: { date: string } | null;
  exercise: {
    slug: string;
    name: string;
    muscle_group: MuscleGroup;
    is_anchor_lift: boolean;
  } | null;
};

/**
 * Every logged set for the user, flattened for progress aggregation.
 * RLS restricts set_entries to the user's own rows automatically.
 */
export async function getTrainingSets(): Promise<TrainingSet[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("set_entries")
    .select(
      "weight_kg, reps, session:workout_sessions!inner(date), exercise:exercises(slug, name, muscle_group, is_anchor_lift)",
    );

  return ((data as RawTrainingRow[] | null) ?? [])
    .filter((r) => r.session && r.exercise)
    .map((r) => ({
      weightKg: r.weight_kg,
      reps: r.reps,
      date: r.session!.date,
      exerciseSlug: r.exercise!.slug,
      exerciseName: r.exercise!.name,
      muscleGroup: r.exercise!.muscle_group,
      isAnchor: r.exercise!.is_anchor_lift,
    }));
}

/** Assert the session belongs to the user; returns it or null. */
export async function getOwnedSession(userId: string, sessionId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("workout_sessions")
    .select("id, date, user_id")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}
