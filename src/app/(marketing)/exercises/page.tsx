import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ExerciseLibrary } from "@/components/exercises/exercise-library";
import { getExercises } from "@/lib/exercises";

export const metadata: Metadata = {
  title: "Exercise library",
  description:
    "Beginner-friendly guides to the fundamental lifts — step-by-step instructions, lifehacks, and the medal thresholds for each.",
};

export default async function ExercisesPage() {
  const exercises = await getExercises();

  return (
    <Container className="py-12">
      <div className="mb-10 max-w-2xl">
        <p className="text-ember-bright text-xs tracking-widest uppercase">The library</p>
        <h1 className="font-display text-ash-100 mt-2 text-5xl tracking-wide uppercase sm:text-6xl">
          Learn the lifts
        </h1>
        <p className="text-ash-400 mt-4">
          Every fundamental movement, explained for beginners — how to do it, the small cues that
          make it click, and the weights that earn each medal. Anchor lifts drive your muscle-group
          medals.
        </p>
      </div>

      <ExerciseLibrary exercises={exercises} />
    </Container>
  );
}
