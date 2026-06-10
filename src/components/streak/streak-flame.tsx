import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 🔥 streak indicator. The flame brightens and flickers as the streak grows.
 * The real streak value is computed in src/lib/streak.ts (M9).
 */
export function StreakFlame({ count, className }: { count: number; className?: string }) {
  const lit = count > 0;
  // Intensity tiers tune the glow/colour as the streak climbs.
  const intensity = count >= 30 ? "platinum" : count >= 14 ? "hot" : count >= 4 ? "warm" : "lit";

  const color = !lit
    ? "text-ash-500"
    : intensity === "platinum"
      ? "text-platinum"
      : intensity === "hot"
        ? "text-ember-bright"
        : "text-ember";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm font-bold",
        lit ? "border-ember/40 bg-ember/10" : "border-edge-bright bg-forge-850",
        className,
      )}
      title={lit ? `${count}-day streak` : "No active streak — log a planned day to start one"}
    >
      <Flame className={cn("size-4", color, lit && "animate-flicker")} />
      <span className={cn("nums", lit ? "text-ash-100" : "text-ash-500")}>{count}</span>
    </span>
  );
}
