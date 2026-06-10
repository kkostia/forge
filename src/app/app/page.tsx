import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CalendarCheck, Flame, Trophy } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { StreakFlame } from "@/components/streak/streak-flame";
import { StreakHeatmap } from "@/components/streak/streak-heatmap";
import { requireOnboardedProfile } from "@/lib/auth";
import { getSessionDates } from "@/lib/workouts";
import { computeStreak } from "@/lib/streak";
import { todayInTz, relativeDayLabel } from "@/lib/dates";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const { profile } = await requireOnboardedProfile();
  const first = (profile.name || profile.email).split("@")[0];

  const today = todayInTz(profile.timezone);
  const trainedDates = await getSessionDates(profile.id);
  const streak = computeStreak(profile.training_days, trainedDates, today);

  return (
    <Container className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-ember-bright text-xs tracking-widest uppercase">Dashboard</p>
          <h1 className="font-display text-ash-100 mt-1 text-4xl tracking-wide uppercase">
            Welcome back, {first}
          </h1>
        </div>
        <StreakFlame count={streak.current} className="px-4 py-2 text-base" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Current streak" value={streak.current} unit="days" icon={Flame} />
        <StatCard label="Longest streak" value={streak.longest} unit="days" icon={Trophy} />
        <StatCard
          label="Days trained"
          value={trainedDates.length}
          unit="total"
          icon={CalendarCheck}
        />
        <StatCard
          label="Last trained"
          value={streak.lastTrainedDate ? relativeDayLabel(streak.lastTrainedDate, today) : "—"}
          icon={CalendarCheck}
        />
      </div>

      <Card className="p-6">
        <h2 className="text-ash-100 mb-4 text-lg tracking-wide uppercase">Your training year</h2>
        <StreakHeatmap
          trainedDates={trainedDates}
          trainingDays={profile.training_days}
          today={today}
        />
      </Card>

      <Card className="forge-glow p-6">
        <h2 className="text-ash-100 text-lg tracking-wide uppercase">Ready to lift?</h2>
        <p className="text-ash-400 mt-1 text-sm">
          Log today&apos;s session to keep your streak alive and chase the next medal.
        </p>
        <Button asChild className="mt-4">
          <Link href="/app/log">
            Log today&apos;s workout <ArrowRight />
          </Link>
        </Button>
      </Card>
    </Container>
  );
}
