"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ExerciseCard } from "@/components/exercises/exercise-card";
import { cn } from "@/lib/utils";
import {
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  MUSCLE_GROUPS,
  MUSCLE_GROUP_LABELS,
  type Difficulty,
  type MuscleGroup,
} from "@/lib/constants";
import type { ExerciseRow } from "@/lib/supabase/types";

export function ExerciseLibrary({ exercises }: { exercises: ExerciseRow[] }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<MuscleGroup | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exercises.filter((e) => {
      if (group && e.muscle_group !== group) return false;
      if (difficulty && e.difficulty !== difficulty) return false;
      if (
        q &&
        !e.name.toLowerCase().includes(q) &&
        !e.equipment.toLowerCase().includes(q) &&
        !e.short_description.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [exercises, query, group, difficulty]);

  const hasFilters = query !== "" || group !== null || difficulty !== null;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="text-ash-500 pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lifts, equipment…"
            className="pl-10"
            aria-label="Search exercises"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterChip active={group === null} onClick={() => setGroup(null)}>
            All groups
          </FilterChip>
          {MUSCLE_GROUPS.map((g) => (
            <FilterChip
              key={g}
              active={group === g}
              onClick={() => setGroup(group === g ? null : g)}
            >
              {MUSCLE_GROUP_LABELS[g]}
            </FilterChip>
          ))}

          <span className="bg-edge-bright mx-1 hidden h-5 w-px sm:block" aria-hidden />

          {DIFFICULTIES.map((d) => (
            <FilterChip
              key={d}
              active={difficulty === d}
              onClick={() => setDifficulty(difficulty === d ? null : d)}
            >
              {DIFFICULTY_LABELS[d]}
            </FilterChip>
          ))}

          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setGroup(null);
                setDifficulty(null);
              }}
              className="text-ash-400 hover:text-ash-100 inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold uppercase"
            >
              <X className="size-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      <p className="text-ash-500 text-sm" role="status">
        {filtered.length} exercise{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <div className="border-edge-bright rounded-xl border border-dashed px-6 py-16 text-center">
          <p className="text-ash-300 text-lg">No exercises match.</p>
          <p className="text-ash-500 mt-1 text-sm">Try a different search or clear the filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <ExerciseCard key={e.slug} exercise={e} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors",
        active
          ? "border-ember bg-ember/15 text-ember-bright"
          : "border-edge-bright text-ash-400 hover:border-ash-500 hover:text-ash-100",
      )}
    >
      {children}
    </button>
  );
}
