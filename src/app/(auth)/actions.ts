"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type AuthState = { error?: string; message?: string };

const credentials = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const signUpSchema = credentials.extend({
  name: z.string().trim().max(80).optional(),
});

function safeRedirectTo(value: FormDataEntryValue | null): string {
  const v = typeof value === "string" ? value : "";
  // Only allow internal absolute paths to avoid open-redirects.
  return v.startsWith("/") && !v.startsWith("//") ? v : "/app";
}

export async function signInAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured()) {
    return { error: "Authentication isn't configured. Add Supabase keys to .env.local." };
  }

  const parsed = credentials.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: error.message };

  redirect(safeRedirectTo(formData.get("redirectTo")));
}

export async function signUpAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured()) {
    return { error: "Authentication isn't configured. Add Supabase keys to .env.local." };
  }

  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: parsed.data.name ? { name: parsed.data.name } : undefined },
  });
  if (error) return { error: error.message };

  // If email confirmation is enabled there's no session yet.
  if (!data.session) {
    return { message: "Check your inbox to confirm your email, then log in." };
  }

  redirect("/onboarding");
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
