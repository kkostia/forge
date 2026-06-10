"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { getOrCreateSession, getOwnedSession } from "@/lib/workouts";
import { isValidDateString } from "@/lib/dates";

export type LogState = { error?: string; ok?: boolean };

const setSchema = z.object({
  exerciseId: z.string().min(1, "Pick an exercise."),
  weightKg: z.coerce
    .number({ message: "Enter a weight." })
    .min(0, "Weight can't be negative.")
    .max(1000, "That's a lot — check the weight."),
  reps: z.coerce
    .number({ message: "Enter reps." })
    .int("Reps must be a whole number.")
    .min(1, "At least 1 rep.")
    .max(1000, "Check the rep count."),
  restSeconds: z
    .union([z.coerce.number().int().min(0).max(36000), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v)),
});

function revalidateLog() {
  revalidatePath("/app/log");
  revalidatePath("/app");
  revalidatePath("/app/progress");
  revalidatePath("/app/medals");
}

export async function createSetAction(_prev: LogState, formData: FormData): Promise<LogState> {
  const user = await requireUser();

  const date = String(formData.get("date") ?? "");
  if (!isValidDateString(date)) return { error: "Invalid date." };

  const parsed = setSchema.safeParse({
    exerciseId: formData.get("exerciseId"),
    weightKg: formData.get("weightKg"),
    reps: formData.get("reps"),
    restSeconds: formData.get("restSeconds") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid set." };

  const supabase = await createClient();
  const sessionId = await getOrCreateSession(user.id, date);

  const { count } = await supabase
    .from("set_entries")
    .select("*", { count: "exact", head: true })
    .eq("session_id", sessionId);

  const { error } = await supabase.from("set_entries").insert({
    session_id: sessionId,
    exercise_id: parsed.data.exerciseId,
    weight_kg: parsed.data.weightKg,
    reps: parsed.data.reps,
    rest_seconds: parsed.data.restSeconds,
    position: count ?? 0,
  });
  if (error) return { error: error.message };

  revalidateLog();
  return { ok: true };
}

export async function updateSetAction(_prev: LogState, formData: FormData): Promise<LogState> {
  const user = await requireUser();
  const setId = String(formData.get("setId") ?? "");
  if (!setId) return { error: "Missing set." };

  const parsed = setSchema.partial({ exerciseId: true }).safeParse({
    exerciseId: formData.get("exerciseId") ?? "x",
    weightKg: formData.get("weightKg"),
    reps: formData.get("reps"),
    restSeconds: formData.get("restSeconds") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid set." };

  const supabase = await createClient();
  // RLS guarantees ownership, but verify for a clean error.
  const { data: owned } = await supabase
    .from("set_entries")
    .select("id, session:workout_sessions!inner(user_id)")
    .eq("id", setId)
    .maybeSingle();
  if (!owned) return { error: "Set not found." };

  const { error } = await supabase
    .from("set_entries")
    .update({
      weight_kg: parsed.data.weightKg,
      reps: parsed.data.reps,
      rest_seconds: parsed.data.restSeconds,
    })
    .eq("id", setId);
  if (error) return { error: error.message };

  revalidateLog();
  return { ok: true };
}

export async function deleteSetAction(formData: FormData): Promise<void> {
  await requireUser();
  const setId = String(formData.get("setId") ?? "");
  if (!setId) return;

  const supabase = await createClient();
  await supabase.from("set_entries").delete().eq("id", setId);
  revalidateLog();
}

export async function deleteSessionAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const sessionId = String(formData.get("sessionId") ?? "");
  if (!sessionId) return;

  const owned = await getOwnedSession(user.id, sessionId);
  if (!owned) return;

  const supabase = await createClient();
  await supabase.from("workout_sessions").delete().eq("id", sessionId);
  revalidateLog();
}

export async function updateNotesAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const date = String(formData.get("date") ?? "");
  const notes = String(formData.get("notes") ?? "").slice(0, 2000);
  if (!isValidDateString(date)) return;

  const supabase = await createClient();
  const sessionId = await getOrCreateSession(user.id, date);
  await supabase
    .from("workout_sessions")
    .update({ notes: notes || null })
    .eq("id", sessionId);
  revalidateLog();
}
