"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { MUSCLE_GROUP_LABELS, type MuscleGroup } from "@/lib/constants";

export type ComboExercise = { id: string; name: string; muscle_group: MuscleGroup };

export function ExerciseCombobox({
  exercises,
  name,
  value,
  onChange,
}: {
  exercises: ComboExercise[];
  name: string;
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selected = exercises.find((e) => e.id === value) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return exercises;
    return exercises.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        MUSCLE_GROUP_LABELS[e.muscle_group].toLowerCase().includes(q),
    );
  }, [exercises, query]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "border-edge-bright bg-forge-950/60 flex h-11 w-full items-center justify-between rounded-md border px-3.5 text-left text-sm transition-colors",
          "focus-visible:border-ember focus-visible:ring-ember/30 focus-visible:ring-2 focus-visible:outline-none",
          selected ? "text-ash-100" : "text-ash-500",
        )}
      >
        <span className="truncate">{selected ? selected.name : "Choose an exercise…"}</span>
        <ChevronsUpDown className="text-ash-500 ml-2 size-4 shrink-0" />
      </button>

      {open && (
        <div className="border-edge-bright bg-forge-900 absolute z-50 mt-1.5 w-full overflow-hidden rounded-md border shadow-2xl">
          <div className="border-edge border-b p-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search exercises…"
              className="bg-forge-950/60 text-ash-100 placeholder:text-ash-500 h-9 w-full rounded px-3 text-sm outline-none"
            />
          </div>
          <ul role="listbox" id={listId} className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="text-ash-500 px-3 py-2 text-sm">No matches.</li>
            )}
            {filtered.map((e) => (
              <li key={e.id} role="option" aria-selected={e.id === value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(e.id);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="hover:bg-forge-800 flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm"
                >
                  <span className="text-ash-200 truncate">{e.name}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-ash-500 text-xs">
                      {MUSCLE_GROUP_LABELS[e.muscle_group]}
                    </span>
                    {e.id === value && <Check className="text-ember size-4" />}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
