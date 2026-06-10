import Link from "next/link";
import { Anchor } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ExerciseGlyph } from "@/components/exercises/exercise-glyph";
import { DIFFICULTY_LABELS, MUSCLE_GROUP_LABELS } from "@/lib/constants";
import type { ExerciseRow } from "@/lib/supabase/types";

export function ExerciseCard({ exercise }: { exercise: ExerciseRow }) {
  return (
    <Link
      href={`/exercises/${exercise.slug}`}
      className="group brushed border-edge hover:border-ember/50 relative flex flex-col overflow-hidden rounded-xl border transition-all hover:-translate-y-0.5"
    >
      <div className="bg-forge-900/80 relative flex h-36 items-center justify-center overflow-hidden border-b border-(--color-edge)">
        <ExerciseGlyph
          slug={exercise.slug}
          muscleGroup={exercise.muscle_group}
          className="text-forge-500 group-hover:text-ember h-20 w-20 transition-colors"
        />
        {exercise.is_anchor_lift && (
          <span
            className="border-ember/40 bg-ember/15 text-ember-bright absolute top-3 right-3 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase"
            title="Anchor lift — drives this muscle group's medal"
          >
            <Anchor className="size-3" /> Anchor
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-ash-100 text-lg leading-tight tracking-wide uppercase group-hover:text-white">
          {exercise.name}
        </h3>
        <p className="text-ash-400 line-clamp-2 text-sm">{exercise.short_description}</p>
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
          <Badge variant="ember">{MUSCLE_GROUP_LABELS[exercise.muscle_group]}</Badge>
          <Badge variant="outline">{DIFFICULTY_LABELS[exercise.difficulty]}</Badge>
          <span className="text-ash-500 ml-auto text-xs">{exercise.equipment}</span>
        </div>
      </div>
    </Link>
  );
}
