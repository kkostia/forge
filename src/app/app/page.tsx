import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireOnboardedProfile } from "@/lib/auth";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const { profile } = await requireOnboardedProfile();
  const first = (profile.name || profile.email).split("@")[0];

  return (
    <Container className="space-y-6">
      <div>
        <p className="text-ember-bright text-xs tracking-widest uppercase">Dashboard</p>
        <h1 className="font-display text-ash-100 mt-1 text-4xl tracking-wide uppercase">
          Welcome back, {first}
        </h1>
        <p className="text-ash-400 mt-1">Your training home. The full dashboard lands soon.</p>
      </div>

      <Card className="p-6">
        <h2 className="text-ash-100 text-lg tracking-wide uppercase">Ready to lift?</h2>
        <p className="text-ash-400 mt-1 text-sm">
          Log today&apos;s session to start building your streak and earning medals.
        </p>
        <Button asChild className="mt-4">
          <Link href="/app/log">
            Log a workout <ArrowRight />
          </Link>
        </Button>
      </Card>
    </Container>
  );
}
