import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <Card className="p-6 sm:p-7">
      <h1 className="font-display text-ash-100 text-3xl tracking-wide uppercase">Start forging</h1>
      <p className="text-ash-400 mt-1 mb-6 text-sm">
        Create a free account and log your first session in minutes.
      </p>
      <Suspense>
        <AuthForm mode="signup" />
      </Suspense>
    </Card>
  );
}
