import { cn } from "@/lib/utils";
import type { MedalTier } from "@/lib/constants";

/** Per-tier metallic surface + rim + emblem ink. */
const TIER_STYLE: Record<
  Exclude<MedalTier, "NONE">,
  { surface: string; rim: string; ink: string }
> = {
  BRONZE: {
    surface: "radial-gradient(70% 70% at 35% 25%, #e0a06a 0%, #b87333 45%, #7a4a1f 100%)",
    rim: "#7a4a1f",
    ink: "#5a3415",
  },
  SILVER: {
    surface: "radial-gradient(70% 70% at 35% 25%, #f3f3f8 0%, #c0c0c8 48%, #8a8a94 100%)",
    rim: "#8a8a94",
    ink: "#5c5c66",
  },
  GOLD: {
    surface: "radial-gradient(70% 70% at 35% 25%, #ffe89a 0%, #e8b923 48%, #9c7910 100%)",
    rim: "#9c7910",
    ink: "#6b520a",
  },
  PLATINUM: {
    surface: "radial-gradient(70% 70% at 35% 25%, #ffffff 0%, #d6e0e6 48%, #9fb0b8 100%)",
    rim: "#9fb0b8",
    ink: "#5f6e75",
  },
};

/** A forged anvil — the Forge emblem at the heart of every medal. */
function Anvil({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 64" className="h-1/2 w-1/2" fill={color} aria-hidden>
      <path d="M14 22h28c0 6-5 9-11 9h-1l9 13H25l9-13c-9 0-20-2-20-9z" />
      <rect x="26" y="46" width="12" height="4" rx="1" />
      <rect x="20" y="50" width="24" height="5" rx="1.5" />
    </svg>
  );
}

export function Medal({
  tier,
  size = 96,
  shine = false,
  className,
}: {
  tier: MedalTier;
  size?: number;
  /** Sweep a highlight across the face (e.g. on earn). */
  shine?: boolean;
  className?: string;
}) {
  if (tier === "NONE") {
    return (
      <div
        className={cn(
          "border-edge-bright bg-forge-900/60 flex items-center justify-center rounded-full border-2 border-dashed",
          className,
        )}
        style={{ width: size, height: size }}
        aria-label="No medal yet"
      >
        <Anvil color="#3a3a44" />
      </div>
    );
  }

  const t = TIER_STYLE[tier];
  return (
    <div
      className={cn("relative shrink-0 rounded-full", className)}
      style={{ width: size, height: size }}
      aria-label={`${tier} medal`}
    >
      {/* Outer rim */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: t.rim,
          boxShadow: `0 6px 18px -6px ${t.rim}, inset 0 2px 4px rgba(255,255,255,0.35)`,
        }}
      />
      {/* Faceted notch ring */}
      <div
        className="absolute inset-[7%] rounded-full"
        style={{
          background: `repeating-conic-gradient(${t.ink} 0deg 9deg, ${t.rim} 9deg 18deg)`,
          opacity: 0.55,
        }}
      />
      {/* Metal face */}
      <div
        className="absolute inset-[14%] flex items-center justify-center overflow-hidden rounded-full"
        style={{
          background: t.surface,
          boxShadow: `inset 0 -3px 8px ${t.ink}, inset 0 3px 6px rgba(255,255,255,0.5)`,
        }}
      >
        <Anvil color={t.ink} />
        {shine && (
          <span
            className="animate-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/55 blur-[2px]"
            style={{ transform: "skewX(-12deg)" }}
          />
        )}
      </div>
    </div>
  );
}
