import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ProfileRow } from "@/lib/supabase/types";

/** Current authenticated user, or null. Revalidates the token with Supabase. */
export async function getUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Require a signed-in user or redirect to /login (preserving the target). */
export async function requireUser(redirectTo?: string) {
  const user = await getUser();
  if (!user) {
    redirect(redirectTo ? `/login?redirectTo=${encodeURIComponent(redirectTo)}` : "/login");
  }
  return user;
}

/** Fetch the profile row for a user id (or null). */
export async function getProfile(userId: string): Promise<ProfileRow | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  return data;
}

/**
 * Require a signed-in, onboarded user. Redirects to /login when signed out,
 * or to /onboarding when the profile hasn't completed setup. Returns both.
 */
export async function requireOnboardedProfile() {
  const user = await requireUser();
  let profile = await getProfile(user.id);

  // Trigger should have created the profile; self-heal if it's missing.
  if (!profile) {
    const supabase = await createClient();
    await supabase
      .from("profiles")
      .upsert({ id: user.id, email: user.email ?? "" }, { onConflict: "id" });
    profile = await getProfile(user.id);
  }

  if (!profile?.onboarded) redirect("/onboarding");

  return { user, profile };
}
