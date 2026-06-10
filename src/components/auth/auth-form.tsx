"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction, signUpAction, type AuthState } from "@/app/(auth)/actions";

const initial: AuthState = {};

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const action = isSignup ? signUpAction : signInAction;
  const [state, formAction, pending] = useActionState(action, initial);
  const redirectTo = useSearchParams().get("redirectTo") ?? "/app";

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      {isSignup && (
        <div className="space-y-1.5">
          <Label htmlFor="name">Name (optional)</Label>
          <Input id="name" name="name" autoComplete="name" placeholder="Alex" />
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={isSignup ? "new-password" : "current-password"}
          placeholder="••••••••"
        />
        {isSignup && <p className="text-ash-500 text-xs">At least 8 characters.</p>}
      </div>

      {state.error && (
        <p className="flex items-start gap-2 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {state.error}
        </p>
      )}
      {state.message && (
        <p className="border-ember/40 bg-ember/10 text-ember-bright flex items-start gap-2 rounded-md border px-3 py-2 text-sm">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          {state.message}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending && <Loader2 className="animate-spin" />}
        {isSignup ? "Create account" : "Log in"}
      </Button>

      <p className="text-ash-400 text-center text-sm">
        {isSignup ? (
          <>
            Already training?{" "}
            <Link href="/login" className="text-ember-bright font-semibold hover:underline">
              Log in
            </Link>
          </>
        ) : (
          <>
            New to Forge?{" "}
            <Link href="/signup" className="text-ember-bright font-semibold hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
