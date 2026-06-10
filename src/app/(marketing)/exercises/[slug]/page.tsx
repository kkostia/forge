import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Anchor, ArrowLeft, Dumbbell, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Medal } from "@/components/medal";
import { ExerciseCard } from "@/components/exercises/exercise-card";
import { ExerciseGlyph } from "@/components/exercises/exercise-glyph";
import { DIFFICULTY_LABELS, EARNABLE_TIERS, MUSCLE_GROUP_LABELS } from "@/lib/constants";
import { getExerciseBySlug, getExercises, getRelatedExercises } from "@/lib/exercises";

export async function generateStaticParams() {
  const exercises = await getExercises();
  return exercises.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const exercise = await getExerciseBySlug(slug);
  if (!exercise) return { title: "Exercise not found" };
  return { title: exercise.name, description: exercise.short_description };
}

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exercise = await getExerciseBySlug(slug);
  if (!exercise) notFound();

  const related = await getRelatedExercises(exercise);
  const thresholds = exercise.medal_thresholds;
  const hasThresholds =
    exercise.is_anchor_lift &&
    EARNABLE_TIERS.some((t) => (thresholds[t.toLowerCase() as keyof typeof thresholds] ?? 0) > 0);

  return (
    <Container className="py-12">
      <Link
        href="/exercises"
        className="text-ash-400 hover:text-ash-100 mb-8 inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" /> All exercises
      </Link>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Main column */}
        <div className="space-y-10 lg:col-span-7">
          <header>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="ember">{MUSCLE_GROUP_LABELS[exercise.muscle_group]}</Badge>
              <Badge variant="outline">{DIFFICULTY_LABELS[exercise.difficulty]}</Badge>
              {exercise.is_anchor_lift && (
                <Badge variant="gold">
                  <Anchor className="size-3" /> Anchor lift
                </Badge>
              )}
            </div>
            <h1 className="font-display text-ash-100 text-5xl tracking-wide uppercase sm:text-6xl">
              {exercise.name}
            </h1>
            <p className="text-ash-400 mt-4 max-w-xl text-lg">{exercise.short_description}</p>
            <p className="text-ash-500 mt-3 inline-flex items-center gap-2 text-sm">
              <Dumbbell className="size-4" /> {exercise.equipment}
            </p>
          </header>

          <section aria-labelledby="how-to">
            <h2
              id="how-to"
              className="font-display text-ash-100 mb-5 text-2xl tracking-wide uppercase"
            >
              How to do it
            </h2>
            <ol className="space-y-4">
              {exercise.instructions.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="bg-forge-800 text-ember-bright font-display flex size-8 shrink-0 items-center justify-center rounded-md text-lg">
                    {i + 1}
                  </span>
                  <p className="text-ash-300 pt-1 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          {exercise.lifehacks.length > 0 && (
            <section
              aria-labelledby="lifehacks"
              className="border-ember/25 bg-ember/5 rounded-xl border p-6"
            >
              <h2
                id="lifehacks"
                className="font-display text-ash-100 mb-4 flex items-center gap-2 text-2xl tracking-wide uppercase"
              >
                <Lightbulb className="text-ember size-5" /> Lifehacks
              </h2>
              <ul className="space-y-3">
                {exercise.lifehacks.map((tip, i) => (
                  <li key={i} className="text-ash-300 flex gap-3 leading-relaxed">
                    <span className="bg-ember mt-2 size-1.5 shrink-0 rounded-full" aria-hidden />
                    {tip}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Side column */}
        <aside className="space-y-6 lg:col-span-5">
          <div className="brushed border-edge flex h-56 items-center justify-center rounded-xl border">
            <ExerciseGlyph
              slug={exercise.slug}
              muscleGroup={exercise.muscle_group}
              className="text-forge-500 h-32 w-32"
            />
          </div>

          {hasThresholds && (
            <div className="brushed border-edge rounded-xl border p-6">
              <h2 className="font-display text-ash-100 text-xl tracking-wide uppercase">
                Medal thresholds
              </h2>
              <p className="text-ash-500 mt-1 text-sm">
                Best working set ≥ threshold mints the medal for{" "}
                {MUSCLE_GROUP_LABELS[exercise.muscle_group]}.
              </p>
              <ul className="mt-5 space-y-3">
                {EARNABLE_TIERS.map((tier) => {
                  const kg = thresholds[tier.toLowerCase() as keyof typeof thresholds];
                  return (
                    <li key={tier} className="flex items-center gap-3">
                      <Medal tier={tier} size={36} />
                      <span className="text-ash-300 text-sm font-semibold uppercase">{tier}</span>
                      <span className="nums text-ash-100 ml-auto text-lg font-bold">
                        ≥ {kg} <span className="text-ash-500 text-sm font-normal">kg</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-edge/60 mt-16 border-t pt-10" aria-labelledby="related">
          <h2
            id="related"
            className="font-display text-ash-100 mb-6 text-2xl tracking-wide uppercase"
          >
            More for {MUSCLE_GROUP_LABELS[exercise.muscle_group]}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((e) => (
              <ExerciseCard key={e.slug} exercise={e} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
