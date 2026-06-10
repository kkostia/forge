"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ExerciseCombobox, type ComboExercise } from "@/components/log/exercise-combobox";
import {
  createSetAction,
  deleteSetAction,
  updateSetAction,
  type LogState,
} from "@/app/app/log/actions";
import type { SetWithExercise } from "@/lib/workouts";
import { MUSCLE_GROUP_LABELS } from "@/lib/constants";

const initial: LogState = {};

export function SetLogger({
  date,
  sets,
  exercises,
}: {
  date: string;
  sets: SetWithExercise[];
  exercises: ComboExercise[];
}) {
  return (
    <div className="space-y-6">
      <AddSetForm date={date} exercises={exercises} />
      <SetList sets={sets} exercises={exercises} />
    </div>
  );
}

function AddSetForm({ date, exercises }: { date: string; exercises: ComboExercise[] }) {
  const [state, formAction, pending] = useActionState(createSetAction, initial);
  const [exerciseId, setExerciseId] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setExerciseId("");
      toast.success("Set logged.");
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="brushed border-edge rounded-xl border p-5">
      <h2 className="font-display text-ash-100 mb-4 text-xl tracking-wide uppercase">Add a set</h2>
      <input type="hidden" name="date" value={date} />

      <div className="grid gap-4 sm:grid-cols-12">
        <div className="space-y-1.5 sm:col-span-12">
          <Label>Exercise</Label>
          <ExerciseCombobox
            exercises={exercises}
            name="exerciseId"
            value={exerciseId}
            onChange={setExerciseId}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-4">
          <Label htmlFor="weightKg">Weight (kg)</Label>
          <Input
            id="weightKg"
            name="weightKg"
            type="number"
            step="0.5"
            min="0"
            inputMode="decimal"
            placeholder="0"
            required
          />
        </div>
        <div className="space-y-1.5 sm:col-span-4">
          <Label htmlFor="reps">Reps</Label>
          <Input
            id="reps"
            name="reps"
            type="number"
            step="1"
            min="1"
            inputMode="numeric"
            placeholder="8"
            required
          />
        </div>
        <div className="space-y-1.5 sm:col-span-4">
          <Label htmlFor="restSeconds">Rest (sec)</Label>
          <Input
            id="restSeconds"
            name="restSeconds"
            type="number"
            step="5"
            min="0"
            inputMode="numeric"
            placeholder="optional"
          />
        </div>
      </div>

      {state.error && <p className="mt-3 text-sm text-red-400">{state.error}</p>}

      <Button type="submit" className="mt-4" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" /> : <Plus />}
        Add set
      </Button>
    </form>
  );
}

function SetList({ sets, exercises }: { sets: SetWithExercise[]; exercises: ComboExercise[] }) {
  if (sets.length === 0) {
    return (
      <div className="border-edge-bright rounded-xl border border-dashed px-6 py-12 text-center">
        <p className="text-ash-300">No sets logged for this day yet.</p>
        <p className="text-ash-500 mt-1 text-sm">Add your first set above to get started.</p>
      </div>
    );
  }

  // Group consecutive sets by exercise for a tidy log.
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-ash-100 text-xl tracking-wide uppercase">
          Today&apos;s sets
        </h2>
        <span className="text-ash-500 text-sm">
          {sets.length} set{sets.length === 1 ? "" : "s"}
        </span>
      </div>
      <ul className="divide-edge brushed border-edge divide-y overflow-hidden rounded-xl border">
        {sets.map((s, i) => (
          <SetRow key={s.id} set={s} index={i + 1} exercises={exercises} />
        ))}
      </ul>
    </div>
  );
}

function SetRow({
  set,
  index,
  exercises,
}: {
  set: SetWithExercise;
  index: number;
  exercises: ComboExercise[];
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(updateSetAction, initial);

  useEffect(() => {
    if (state.ok) {
      setEditing(false);
      toast.success("Set updated.");
    }
  }, [state]);

  const name =
    set.exercise?.name ?? exercises.find((e) => e.id === set.exercise_id)?.name ?? "Exercise";

  if (editing) {
    return (
      <li className="bg-forge-900/60 p-4">
        <form action={formAction} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="setId" value={set.id} />
          <div className="space-y-1">
            <Label htmlFor={`w-${set.id}`}>Weight</Label>
            <Input
              id={`w-${set.id}`}
              name="weightKg"
              type="number"
              step="0.5"
              min="0"
              defaultValue={set.weight_kg}
              className="h-9 w-24"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`r-${set.id}`}>Reps</Label>
            <Input
              id={`r-${set.id}`}
              name="reps"
              type="number"
              step="1"
              min="1"
              defaultValue={set.reps}
              className="h-9 w-20"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`rest-${set.id}`}>Rest</Label>
            <Input
              id={`rest-${set.id}`}
              name="restSeconds"
              type="number"
              step="5"
              min="0"
              defaultValue={set.rest_seconds ?? ""}
              className="h-9 w-24"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : <Check />} Save
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>
              <X /> Cancel
            </Button>
          </div>
          {state.error && <p className="w-full text-sm text-red-400">{state.error}</p>}
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-4 p-4">
      <span className="bg-forge-800 text-ash-400 font-display flex size-7 shrink-0 items-center justify-center rounded text-sm">
        {index}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-ash-100 truncate font-semibold">{name}</p>
        {set.exercise && (
          <Badge variant="outline" className="mt-1">
            {MUSCLE_GROUP_LABELS[set.exercise.muscle_group]}
          </Badge>
        )}
      </div>
      <div className="nums text-right">
        <p className="text-ash-100 text-lg font-bold">
          {set.weight_kg}
          <span className="text-ash-500 text-sm font-normal"> kg</span> × {set.reps}
        </p>
        {set.rest_seconds != null && (
          <p className="text-ash-500 text-xs">{set.rest_seconds}s rest</p>
        )}
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-ash-400 hover:bg-forge-800 hover:text-ash-100 inline-flex size-8 items-center justify-center rounded-md"
          aria-label="Edit set"
        >
          <Pencil className="size-4" />
        </button>
        <form action={deleteSetAction}>
          <input type="hidden" name="setId" value={set.id} />
          <button
            type="submit"
            className="text-ash-400 inline-flex size-8 items-center justify-center rounded-md hover:bg-red-500/15 hover:text-red-400"
            aria-label="Delete set"
          >
            <Trash2 className="size-4" />
          </button>
        </form>
      </div>
    </li>
  );
}
