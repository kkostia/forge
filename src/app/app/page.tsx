import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CalendarCheck, CalendarClock, Flame, Trophy } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/stat-card";
import { Medal } from "@/components/medal";
import { StreakFlame } from "@/components/streak/streak-flame";
import { StreakHeatmap } from "@/components/streak/streak-heatmap";
import { requireOnboardedProfile } from "@/lib/auth";
import { getSessionDates, getTrainingSets } from "@/lib/workouts";
import { getMedalOverview } from "@/lib/achievements";
import { computeStreak } from "@/lib/streak";
import { personalRecords } from "@/lib/progress";
import { todayInTz, relativeDayLabel, nextPlannedDate, formatLongDate } from "@/lib/dates";
import { MEDAL_RANK, MUSCLE_GROUP_LABELS } from "@/lib/constants";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const { profile } = await requireOnboardedProfile();
  const first = (profile.name || profile.email).split("@")[0];
  const today = todayInTz(profile.timezone);

  const [trainedDates, sets, medals] = await Promise.all([
    getSessionDates(profile.id),
    getTrainingSets(),
    getMedalOverview(),
  ]);

  const streak = computeStreak(profile.training_days, trainedDates, today);
  const prs = personalRecords(sets).slice(0, 4);
  const topMedals = medals
    .filter((m) => m.tier !== "NONE")
    .sort((a, b) => MEDAL_RANK[b.tier] - MEDAL_RANK[a.tier])
    .slice(0, 4);

  const nextDay = nextPlannedDate(profile.training_days, today);
  const nextLabel = nextDay
    ? nextDay === today
      ? "Today"
      : relativeDayLabel(nextDay, today)
    : "Set your days";
  const trainedToday = trainedDates.includes(today);

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

      {/* Next session banner */}
      <Card className="forge-glow flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-4">
          <span className="bg-forge-800 text-ember grid size-12 place-items-center rounded-lg">
            <CalendarClock className="size-6" />
          </span>
          <div>
            <p className="text-ash-500 text-xs tracking-wider uppercase">
              {trainedToday ? "Logged today" : "Next planned session"}
            </p>
            <p className="text-ash-100 text-lg font-semibold">
              {trainedToday ? "Nice work — see you next time" : nextLabel}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/app/log">
            {trainedToday ? "Log another set" : "Log today's workout"} <ArrowRight />
          </Link>
        </Button>
      </Card>

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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Latest medals */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-ash-100 text-lg tracking-wide uppercase">Latest medals</h2>
            <Link href="/app/medals" className="text-ember-bright text-sm hover:underline">
              Trophy case
            </Link>
          </div>
          {topMedals.length > 0 ? (
            <ul className="space-y-3">
              {topMedals.map((m) => (
                <li key={m.group} className="flex items-center gap-3">
                  <Medal tier={m.tier} size={40} />
                  <div className="flex-1">
                    <p className="text-ash-100 font-semibold">{MUSCLE_GROUP_LABELS[m.group]}</p>
                    <p className="text-ash-500 text-xs uppercase">{m.tier}</p>
                  </div>
                  <span className="nums text-ash-400 text-sm">{m.bestWeight} kg</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyHint
              text="No medals yet — log a working set on an anchor lift to mint your first."
              href="/app/log"
              cta="Start logging"
            />
          )}
        </Card>

        {/* Recent PRs */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-ash-100 text-lg tracking-wide uppercase">Personal records</h2>
            <Link href="/app/progress" className="text-ember-bright text-sm hover:underline">
              All progress
            </Link>
          </div>
          {prs.length > 0 ? (
            <ul className="space-y-3">
              {prs.map((pr) => (
                <li key={pr.slug} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-ash-100 truncate font-semibold">{pr.name}</p>
                    <Badge variant="outline" className="mt-1">
                      {MUSCLE_GROUP_LABELS[pr.muscleGroup]}
                    </Badge>
                  </div>
                  <span className="nums text-ash-100 text-lg font-bold">
                    {pr.bestWeight}
                    <span className="text-ash-500 text-sm font-normal"> kg</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyHint
              text="No records yet — your best lifts will show up here as you log them."
              href="/app/log"
              cta="Log a workout"
            />
          )}
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-ash-100 text-lg tracking-wide uppercase">Your training year</h2>
          <span className="text-ash-500 text-xs">{trainedDates.length} sessions</span>
        </div>
        <StreakHeatmap
          trainedDates={trainedDates}
          trainingDays={profile.training_days}
          today={today}
        />
      </Card>
    </Container>
  );
}

function EmptyHint({ text, href, cta }: { text: string; href: string; cta: string }) {
  return (
    <div className="py-4">
      <p className="text-ash-400 text-sm">{text}</p>
      <Button asChild variant="secondary" size="sm" className="mt-3">
        <Link href={href}>{cta}</Link>
      </Button>
    </div>
  );
}
