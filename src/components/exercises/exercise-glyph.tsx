import type { MuscleGroup } from "@/lib/constants";

/**
 * Minimal line-art pictograms for exercise cards. Picked by slug keyword,
 * falling back to a per-muscle-group default. Full step-by-step visual
 * guides live on the detail page (exercise-guide.tsx).
 */
type GlyphKind =
  | "barbell"
  | "dumbbell"
  | "machine"
  | "cable"
  | "bodyweight"
  | "bench"
  | "squat"
  | "deadlift"
  | "overhead"
  | "plank";

function kindFor(slug: string, group: MuscleGroup): GlyphKind {
  if (slug.includes("bench") || slug.includes("chest-press")) return "bench";
  if (slug.includes("squat")) return "squat";
  if (slug.includes("deadlift")) return "deadlift";
  if (slug.includes("overhead") || slug.includes("shoulder-press")) return "overhead";
  if (slug.includes("plank") || slug.includes("dead-bug")) return "plank";
  if (
    slug.includes("cable") ||
    slug.includes("pulldown") ||
    slug.includes("pushdown") ||
    slug.includes("face-pull")
  )
    return "cable";
  if (slug.includes("machine") || slug.includes("leg-press") || slug.includes("extension"))
    return "machine";
  if (
    slug.includes("dumbbell") ||
    slug.includes("curl") ||
    slug.includes("raise") ||
    slug.includes("fly")
  )
    return "dumbbell";
  if (
    slug.includes("push-up") ||
    slug.includes("pull-up") ||
    slug.includes("lunge") ||
    slug.includes("twist") ||
    slug.includes("knee-raise")
  )
    return "bodyweight";
  switch (group) {
    case "CHEST":
      return "bench";
    case "BACK":
      return "deadlift";
    case "LEGS":
      return "squat";
    case "SHOULDERS":
      return "overhead";
    case "ARMS":
      return "dumbbell";
    case "CORE":
      return "plank";
  }
  return "barbell";
}

const PATHS: Record<GlyphKind, React.ReactNode> = {
  barbell: (
    <>
      <rect x="4" y="26" width="6" height="12" rx="1.5" />
      <rect x="12" y="22" width="5" height="20" rx="1.5" />
      <rect x="54" y="26" width="6" height="12" rx="1.5" />
      <rect x="47" y="22" width="5" height="20" rx="1.5" />
      <rect x="17" y="30" width="30" height="4" rx="2" />
    </>
  ),
  dumbbell: (
    <>
      <rect x="14" y="20" width="7" height="24" rx="2" />
      <rect x="43" y="20" width="7" height="24" rx="2" />
      <rect x="21" y="29" width="22" height="6" rx="3" />
    </>
  ),
  machine: (
    <>
      <rect x="10" y="10" width="5" height="44" rx="2" />
      <rect x="49" y="10" width="5" height="44" rx="2" />
      <rect x="15" y="14" width="34" height="4" rx="2" />
      <rect x="22" y="24" width="20" height="10" rx="2" />
      <rect x="26" y="38" width="12" height="16" rx="2" />
    </>
  ),
  cable: (
    <>
      <rect x="8" y="8" width="48" height="5" rx="2.5" />
      <rect x="29" y="13" width="3" height="18" rx="1.5" />
      <circle cx="30.5" cy="34" r="4" />
      <path d="M22 40h17l-4 14h-9z" />
    </>
  ),
  bodyweight: (
    <>
      <circle cx="32" cy="12" r="6" />
      <rect x="28" y="20" width="8" height="18" rx="3" />
      <rect x="14" y="22" width="14" height="5" rx="2.5" transform="rotate(18 14 22)" />
      <rect x="36" y="20" width="14" height="5" rx="2.5" transform="rotate(-18 50 22)" />
      <rect x="24" y="38" width="6" height="16" rx="2.5" transform="rotate(12 24 38)" />
      <rect x="34" y="38" width="6" height="16" rx="2.5" transform="rotate(-12 40 38)" />
    </>
  ),
  bench: (
    <>
      <rect x="8" y="34" width="48" height="6" rx="2" />
      <rect x="12" y="40" width="5" height="12" rx="2" />
      <rect x="47" y="40" width="5" height="12" rx="2" />
      <circle cx="22" cy="28" r="5" />
      <rect x="6" y="12" width="4" height="16" rx="1.5" />
      <rect x="54" y="12" width="4" height="16" rx="1.5" />
      <rect x="10" y="18" width="44" height="3.5" rx="1.75" />
    </>
  ),
  squat: (
    <>
      <rect x="10" y="10" width="44" height="4" rx="2" />
      <rect x="6" y="6" width="5" height="12" rx="1.5" />
      <rect x="53" y="6" width="5" height="12" rx="1.5" />
      <circle cx="32" cy="22" r="5.5" />
      <path d="M26 30h12v10l6 12h-8l-4-9-4 9h-8l6-12z" />
    </>
  ),
  deadlift: (
    <>
      <rect x="8" y="46" width="10" height="12" rx="2" />
      <rect x="46" y="46" width="10" height="12" rx="2" />
      <rect x="14" y="50" width="36" height="4" rx="2" />
      <circle cx="32" cy="12" r="5.5" />
      <path d="M28 20l-6 16 4 2 6-12 6 12 4-2-6-16z" />
    </>
  ),
  overhead: (
    <>
      <circle cx="32" cy="26" r="5.5" />
      <rect x="10" y="8" width="44" height="4" rx="2" />
      <rect x="8" y="4" width="4" height="12" rx="1.5" />
      <rect x="52" y="4" width="4" height="12" rx="1.5" />
      <path
        d="M22 14l4 10h12l4-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <rect x="28" y="33" width="8" height="14" rx="3" />
      <rect x="26" y="47" width="5" height="12" rx="2" />
      <rect x="33" y="47" width="5" height="12" rx="2" />
    </>
  ),
  plank: (
    <>
      <circle cx="12" cy="30" r="5" />
      <path d="M16 34l32 4v6l-34-4z" />
      <rect x="8" y="38" width="5" height="14" rx="2" />
      <rect x="44" y="40" width="14" height="5" rx="2.5" transform="rotate(24 44 40)" />
    </>
  ),
};

export function ExerciseGlyph({
  slug,
  muscleGroup,
  className,
}: {
  slug: string;
  muscleGroup: MuscleGroup;
  className?: string;
}) {
  const kind = kindFor(slug, muscleGroup);
  return (
    <svg viewBox="0 0 64 64" className={className} fill="currentColor" aria-hidden>
      {PATHS[kind]}
    </svg>
  );
}
