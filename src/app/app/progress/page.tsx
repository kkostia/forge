import Link from "next/link";
import type { Metadata } from "next";
import { Anchor, Dumbbell, Layers, LineChart as LineChartIcon, Trophy } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/stat-card";
import { ExerciseProgressChart, WeeklyVolumeChart } from "@/components/progress/charts";
import { requireOnboardedProfile } from "@/lib/auth";
import { getTrainingSets } from "@/lib/workouts";
import {
  exerciseProgress,
  personalRecords,
  totalVolume,
  weeklyVolumeByGroup,
  type ProgressPoint,
} from "@/lib/progress";
import { MUSCLE_GROUP_LABELS } from "@/lib/constants";

export const metadata: Metadata = { title: "Progress" };

export default async function ProgressPage() {
  await requireOnboardedProfile();
  const sets = await getTrainingSets();

  if (sets.length === 0) {
    return (
      <Container>
        <PageHeading />
        <div className="border-edge-bright mt-8 rounded-xl border border-dashed px-6 py-20 text-center">
          <Trophy className="text-forge-600 mx-auto size-10" />
          <p className="text-ash-300 mt-4 text-lg">No training data yet.</p>
          <p className="text-ash-500 mt-1 text-sm">
            Log a few sets and your charts and personal records will appear here.
          </p>
          <Button asChild className="mt-6">
            <Link href="/app/log">Log a workout</Link>
          </Button>
        </div>
      </Container>
    );
  }

  const prs = personalRecords(sets);
  const volume = totalVolume(sets);
  const weekly = weeklyVolumeByGroup(sets);
  const sessionDays = new Set(sets.map((s) => s.date)).size;

  // Chartable exercises (those with logged data), anchors first.
  const options = prs.map((p) => ({ slug: p.slug, name: p.name }));
  const series: Record<string, ProgressPoint[]> = {};
  for (const o of options) series[o.slug] = exerciseProgress(sets, o.slug);

  return (
    <Container className="space-y-10">
      <PageHeading />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total volume"
          value={Math.round(volume).toLocaleString()}
          unit="kg"
          icon={Layers}
        />
        <StatCard label="Sets logged" value={sets.length} icon={Dumbbell} />
        <StatCard label="Training days" value={sessionDays} icon={LineChartIcon} />
        <StatCard label="Exercises" value={prs.length} icon={Trophy} />
      </div>

      <section className="grid gap-8 lg:grid-cols-2">
        <Panel title="Weekly volume by muscle group">
          <WeeklyVolumeChart data={weekly} />
        </Panel>
        <Panel title="Strength over time">
          <ExerciseProgressChart options={options} series={series} />
        </Panel>
      </section>

      <section>
        <h2 className="font-display text-ash-100 mb-4 text-2xl tracking-wide uppercase">
          Personal records
        </h2>
        <div className="brushed border-edge divide-edge divide-y overflow-hidden rounded-xl border">
          {prs.map((pr) => (
            <div key={pr.slug} className="flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/exercises/${pr.slug}`}
                  className="text-ash-100 truncate font-semibold hover:underline"
                >
                  {pr.name}
                </Link>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="outline">{MUSCLE_GROUP_LABELS[pr.muscleGroup]}</Badge>
                  {pr.isAnchor && (
                    <Badge variant="gold">
                      <Anchor className="size-3" /> Anchor
                    </Badge>
                  )}
                </div>
              </div>
              <div className="nums text-right">
                <p className="text-ash-100 text-lg font-bold">
                  {pr.bestWeight}
                  <span className="text-ash-500 text-sm font-normal"> kg</span>
                </p>
                <p className="text-ash-500 text-xs">
                  {Math.round(pr.totalVolume).toLocaleString()} kg volume · {pr.setCount} sets
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}

function PageHeading() {
  return (
    <div>
      <p className="text-ember-bright text-xs tracking-widest uppercase">Progress</p>
      <h1 className="font-display text-ash-100 mt-1 text-4xl tracking-wide uppercase">
        Your numbers
      </h1>
      <p className="text-ash-400 mt-1">
        Volume, trends, and every personal record you&apos;ve set.
      </p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="brushed border-edge rounded-xl border p-5">
      <h2 className="text-ash-100 mb-4 text-lg tracking-wide uppercase">{title}</h2>
      {children}
    </div>
  );
}
