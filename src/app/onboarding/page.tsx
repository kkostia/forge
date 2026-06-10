import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Brand } from "@/components/brand";
import { Card } from "@/components/ui/card";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { getProfile, requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Set up your training" };

export default async function OnboardingPage() {
  const user = await requireUser("/onboarding");
  const profile = await getProfile(user.id);
  if (profile?.onboarded) redirect("/app");

  return (
    <main className="forge-glow relative z-10 flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Brand />
        </div>
        <Card className="p-6 sm:p-8">
          <p className="text-ember-bright text-xs tracking-widest uppercase">Step 1 of 1</p>
          <h1 className="font-display text-ash-100 mt-2 text-3xl tracking-wide uppercase">
            Set up your training
          </h1>
          <p className="text-ash-400 mt-1 mb-7 text-sm">
            Two quick choices and you&apos;re in. You can change these later in settings.
          </p>
          <OnboardingForm
            defaultTimezone={profile?.timezone ?? "Europe/Dublin"}
            defaultDays={profile?.training_days ?? []}
          />
        </Card>
      </div>
    </main>
  );
}
