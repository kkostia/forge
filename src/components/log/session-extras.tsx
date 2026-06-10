"use client";

import { useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { deleteSessionAction, updateNotesAction } from "@/app/app/log/actions";

export function SessionExtras({
  date,
  sessionId,
  notes,
}: {
  date: string;
  sessionId: string | null;
  notes: string | null;
}) {
  const [value, setValue] = useState(notes ?? "");

  return (
    <div className="space-y-4">
      <form
        action={async (fd) => {
          await updateNotesAction(fd);
          toast.success("Notes saved.");
        }}
        className="space-y-2"
      >
        <Label htmlFor="notes">Session notes</Label>
        <input type="hidden" name="date" value={date} />
        <textarea
          id="notes"
          name="notes"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          placeholder="How did it feel? Bodyweight, sleep, niggles…"
          className="border-edge-bright bg-forge-950/60 text-ash-100 placeholder:text-ash-500 focus-visible:border-ember focus-visible:ring-ember/30 w-full rounded-md border px-3.5 py-2.5 text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
        <Button type="submit" variant="secondary" size="sm">
          <Save /> Save notes
        </Button>
      </form>

      {sessionId && (
        <form
          action={async (fd) => {
            if (!confirm("Delete this whole session and all its sets? This can't be undone.")) {
              return;
            }
            await deleteSessionAction(fd);
            toast.success("Session deleted.");
          }}
        >
          <input type="hidden" name="sessionId" value={sessionId} />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="text-ash-500 hover:text-red-400"
          >
            <Trash2 /> Delete this session
          </Button>
        </form>
      )}
    </div>
  );
}
