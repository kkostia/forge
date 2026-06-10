import Link from "next/link";
import { Lock } from "lucide-react";
import { Medal } from "@/components/medal";
import { cn } from "@/lib/utils";
import { EARNABLE_TIERS, MEDAL_LABELS, MEDAL_RANK, MUSCLE_GROUP_LABELS } from "@/lib/constants";
import type { GroupMedal } from "@/lib/medal-state";

export function MedalGroupCard({ medal }: { medal: GroupMedal }) {
  const { group, anchor, tier, bestWeight, next, progress } = medal;

  return (
    <div className="brushed border-edge flex flex-col rounded-xl border p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-ash-100 text-2xl tracking-wide uppercase">
            {MUSCLE_GROUP_LABELS[group]}
          </h2>
          {anchor && (
            <Link
              href={`/exercises/${anchor.slug}`}
              className="text-ash-500 hover:text-ash-300 text-sm"
            >
              {anchor.name}
            </Link>
          )}
        </div>
        <Medal tier={tier} size={72} shine={tier !== "NONE"} />
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="text-ash-500 text-xs tracking-wider uppercase">Best working set</p>
          <p className="nums text-ash-100 font-display text-3xl">
            {bestWeight}
            <span className="text-ash-500 text-base font-normal"> kg</span>
          </p>
        </div>
        <p className="text-right text-sm">
          <span className="text-ash-500">Standing</span>
          <br />
          <span
            className={cn(
              "font-semibold uppercase",
              tier === "NONE" ? "text-ash-400" : "text-ember-bright",
            )}
          >
            {MEDAL_LABELS[tier]}
          </span>
        </p>
      </div>

      {/* Tier rail */}
      <div className="mt-5 flex items-center justify-between gap-2">
        {EARNABLE_TIERS.map((t) => {
          const earned = MEDAL_RANK[t] <= MEDAL_RANK[tier];
          return (
            <div key={t} className="flex flex-col items-center gap-1.5">
              <div className={cn("relative", !earned && "opacity-40 grayscale")}>
                <Medal tier={t} size={40} />
                {!earned && (
                  <span className="bg-forge-950/40 absolute inset-0 grid place-items-center rounded-full">
                    <Lock className="text-ash-300 size-3.5" />
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase",
                  earned ? "text-ash-300" : "text-ash-600",
                )}
              >
                {t}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress to next */}
      <div className="mt-6">
        {next ? (
          <>
            <div className="text-ash-400 mb-1.5 flex justify-between text-xs uppercase">
              <span>Next: {MEDAL_LABELS[next.tier]}</span>
              <span className="nums">
                {next.remaining > 0 ? `${Math.round(next.remaining)} kg to go` : "Earned!"}
              </span>
            </div>
            <div className="bg-forge-800 h-2 overflow-hidden rounded-full">
              <div
                className="from-ember to-ember-bright h-full rounded-full bg-gradient-to-r"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        ) : (
          <p className="text-platinum text-center text-sm font-semibold uppercase">
            Platinum — maxed out 🏆
          </p>
        )}
      </div>
    </div>
  );
}
