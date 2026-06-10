"use client";

import { useActionState, useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { WEEKDAYS } from "@/lib/constants";
import { saveOnboardingAction, type OnboardingState } from "@/app/onboarding/actions";

const initial: OnboardingState = {};

// A sensible curated shortlist; the detected zone is added if missing.
const COMMON_ZONES = [
  "Europe/Dublin",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Madrid",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "UTC",
];

export function OnboardingForm({
  defaultTimezone,
  defaultDays,
}: {
  defaultTimezone: string;
  defaultDays: number[];
}) {
  const [state, formAction, pending] = useActionState(saveOnboardingAction, initial);
  const [days, setDays] = useState<number[]>(defaultDays);
  const [zones, setZones] = useState<string[]>(COMMON_ZONES);
  const [tz, setTz] = useState(defaultTimezone);

  useEffect(() => {
    // Default to the visitor's detected timezone and offer the full IANA list.
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const all =
      typeof Intl.supportedValuesOf === "function"
        ? (Intl.supportedValuesOf("timeZone") as string[])
        : COMMON_ZONES;
    setZones(all);
    if (detected && (!defaultDays.length || defaultTimezone === "Europe/Dublin")) {
      setTz(detected);
    }
  }, [defaultDays.length, defaultTimezone]);

  function toggle(day: number) {
    setDays((d) => (d.includes(day) ? d.filter((x) => x !== day) : [...d, day]));
  }

  return (
    <form action={formAction} className="space-y-8">
      {days.map((d) => (
        <input key={d} type="hidden" name="trainingDays" value={d} />
      ))}

      <div className="space-y-3">
        <Label>Which days do you plan to train?</Label>
        <div className="grid grid-cols-7 gap-1.5">
          {WEEKDAYS.map((w) => {
            const active = days.includes(w.value);
            return (
              <button
                key={w.value}
                type="button"
                onClick={() => toggle(w.value)}
                aria-pressed={active}
                className={cn(
                  "flex h-14 flex-col items-center justify-center rounded-md border text-xs font-semibold tracking-wide uppercase transition-colors",
                  active
                    ? "border-ember bg-ember/15 text-ember-bright"
                    : "border-edge-bright bg-forge-950/60 text-ash-400 hover:border-ash-500 hover:text-ash-100",
                )}
              >
                {w.short}
              </button>
            );
          })}
        </div>
        <p className="text-ash-500 text-xs">
          Your 🔥 streak counts consecutive planned days you didn&apos;t skip.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timezone">Your timezone</Label>
        <select
          id="timezone"
          name="timezone"
          value={tz}
          onChange={(e) => setTz(e.target.value)}
          className="border-edge-bright bg-forge-950/60 text-ash-100 focus-visible:border-ember focus-visible:ring-ember/30 h-11 w-full rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
        >
          {zones.map((z) => (
            <option key={z} value={z} className="bg-forge-900">
              {z.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <p className="text-ash-500 text-xs">Used to roll your streak over at the right midnight.</p>
      </div>

      {state.error && (
        <p className="flex items-start gap-2 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending || days.length === 0}>
        {pending && <Loader2 className="animate-spin" />}
        Start training
      </Button>
    </form>
  );
}
