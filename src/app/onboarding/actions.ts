"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export type OnboardingState = { error?: string };

const schema = z.object({
  timezone: z.string().min(1, "Pick your timezone."),
  trainingDays: z
    .array(z.coerce.number().int().min(0).max(6))
    .min(1, "Pick at least one training day."),
});

export async function saveOnboardingAction(
  _prev: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const user = await requireUser();

  const parsed = schema.safeParse({
    timezone: formData.get("timezone"),
    trainingDays: formData.getAll("trainingDays"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please complete the form." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      timezone: parsed.data.timezone,
      training_days: [...new Set(parsed.data.trainingDays)].sort((a, b) => a - b),
      onboarded: true,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  redirect("/app");
}
