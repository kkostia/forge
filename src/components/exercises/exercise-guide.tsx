import type { MuscleGroup } from "@/lib/constants";

/**
 * Animated movement demonstration for an exercise. A side-profile athlete
 * performs the rep on a CSS loop (one motion archetype per movement pattern),
 * with prefers-reduced-motion respected in globals.css. Pure SVG + CSS — no
 * external assets or libraries.
 */
type Motion = "press" | "squat" | "hinge" | "pull" | "curl" | "hold";

const MOTION_LABEL: Record<Motion, string> = {
  press: "Press the load away, then lower under control",
  squat: "Sit down and back, then drive up",
  hinge: "Hinge at the hips, then stand tall",
  pull: "Pull toward you, then return with control",
  curl: "Lift through the working muscle, then lower",
  hold: "Brace and hold a strong, straight line",
};

function motionFor(slug: string, group: MuscleGroup): Motion {
  if (
    slug.includes("squat") ||
    slug.includes("leg-press") ||
    slug.includes("leg-extension") ||
    slug.includes("lunge") ||
    slug.includes("calf")
  )
    return "squat";
  if (
    slug.includes("deadlift") ||
    slug.includes("romanian") ||
    slug.includes("bent-over") ||
    slug.includes("face-pull")
  )
    return "hinge";
  if (
    slug.includes("pulldown") ||
    slug.includes("pull-up") ||
    slug.includes("row") ||
    slug.includes("rear-delt")
  )
    return "pull";
  if (
    slug.includes("curl") ||
    slug.includes("pushdown") ||
    slug.includes("extension") ||
    slug.includes("lateral-raise") ||
    slug.includes("fly") ||
    slug.includes("skull")
  )
    return "curl";
  if (
    slug.includes("plank") ||
    slug.includes("dead-bug") ||
    slug.includes("russian") ||
    slug.includes("knee-raise") ||
    slug.includes("crunch")
  )
    return "hold";
  if (slug.includes("bench") || slug.includes("press") || slug.includes("push-up")) return "press";

  switch (group) {
    case "LEGS":
      return "squat";
    case "BACK":
      return "hinge";
    case "CORE":
      return "hold";
    case "ARMS":
      return "curl";
    default:
      return "press";
  }
}

const BODY = "#cfc9bf"; // ash-300
const JOINT = "#7c776e"; // ash-500
const BAR = "var(--color-ember)";

function Plate({ x }: { x: number }) {
  return <rect x={x} y={-9} width={5} height={18} rx={2} style={{ fill: BAR }} />;
}

function Barbell({ y, width = 56, cx = 70 }: { y: number; width?: number; cx?: number }) {
  return (
    <g>
      <rect x={cx - width / 2} y={y - 2} width={width} height={4} rx={2} style={{ fill: BAR }} />
      <g transform={`translate(${cx - width / 2}, ${y})`}>
        <Plate x={-2} />
        <Plate x={4} />
      </g>
      <g transform={`translate(${cx + width / 2}, ${y})`}>
        <Plate x={-3} />
        <Plate x={-9} />
      </g>
    </g>
  );
}

function Head({ cx, cy }: { cx: number; cy: number }) {
  return <circle cx={cx} cy={cy} r={7} fill={BODY} />;
}

function Limb({
  x1,
  y1,
  x2,
  y2,
  w = 5,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  w?: number;
}) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={BODY} strokeWidth={w} strokeLinecap="round" />
  );
}

function Scene({ motion }: { motion: Motion }) {
  switch (motion) {
    case "press":
      // Standing press: arms + bar drive overhead.
      return (
        <>
          <Limb x1={64} y1={70} x2={60} y2={104} />
          <Limb x1={72} y1={70} x2={80} y2={104} />
          <Limb x1={68} y1={44} x2={68} y2={72} w={7} />
          <Head cx={68} cy={34} />
          <g className="guide-anim-press">
            <Limb x1={68} y1={46} x2={56} y2={30} />
            <Limb x1={68} y1={46} x2={80} y2={30} />
            <Barbell y={26} cx={68} />
          </g>
        </>
      );
    case "squat":
      // Bar racked on shoulders; whole figure lowers and rises.
      return (
        <g className="guide-anim-squat">
          <Limb x1={64} y1={68} x2={58} y2={104} />
          <Limb x1={72} y1={68} x2={80} y2={104} />
          <Limb x1={68} y1={44} x2={68} y2={70} w={7} />
          <Head cx={68} cy={34} />
          <Limb x1={68} y1={46} x2={56} y2={42} />
          <Limb x1={68} y1={46} x2={80} y2={42} />
          <Barbell y={40} cx={68} />
        </g>
      );
    case "hinge":
      // Hips fixed; torso + bar hinge forward and back.
      return (
        <>
          <Limb x1={60} y1={66} x2={56} y2={104} />
          <Limb x1={60} y1={66} x2={66} y2={104} />
          <g className="guide-anim-hinge">
            <Limb x1={60} y1={66} x2={62} y2={38} w={7} />
            <Head cx={63} cy={30} />
            <Limb x1={61} y1={50} x2={61} y2={74} />
            <Barbell y={76} cx={61} width={48} />
          </g>
        </>
      );
    case "pull":
      // Torso fixed; bar is pulled down to the chest.
      return (
        <>
          <Limb x1={64} y1={72} x2={60} y2={104} />
          <Limb x1={72} y1={72} x2={80} y2={104} />
          <Limb x1={68} y1={46} x2={68} y2={74} w={7} />
          <Head cx={68} cy={36} />
          <g className="guide-anim-pull">
            <Limb x1={68} y1={48} x2={54} y2={34} />
            <Limb x1={68} y1={48} x2={82} y2={34} />
            <Barbell y={30} cx={68} />
          </g>
        </>
      );
    case "curl":
      // Upper arm fixed; forearm + weight rotate at the elbow.
      return (
        <>
          <Limb x1={66} y1={70} x2={62} y2={104} />
          <Limb x1={74} y1={70} x2={80} y2={104} />
          <Limb x1={70} y1={42} x2={70} y2={72} w={7} />
          <Head cx={70} cy={32} />
          <Limb x1={70} y1={46} x2={78} y2={60} />
          <g className="guide-anim-curl">
            <Limb x1={78} y1={60} x2={90} y2={70} />
            <circle cx={92} cy={72} r={6} style={{ fill: BAR }} />
          </g>
        </>
      );
    case "hold":
      // Plank: braced straight line with a subtle isometric bob.
      return (
        <g className="guide-anim-hold">
          <Head cx={36} cy={64} />
          <Limb x1={42} y1={66} x2={96} y2={78} w={8} />
          <Limb x1={44} y1={68} x2={40} y2={92} />
          <Limb x1={92} y1={77} x2={104} y2={96} />
          <Limb x1={92} y1={77} x2={84} y2={96} />
          <line
            x1={28}
            y1={98}
            x2={110}
            y2={98}
            stroke={JOINT}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </g>
      );
  }
}

export function ExerciseGuide({
  slug,
  muscleGroup,
  className,
}: {
  slug: string;
  muscleGroup: MuscleGroup;
  className?: string;
}) {
  const motion = motionFor(slug, muscleGroup);
  return (
    <figure className={className}>
      <svg
        viewBox="0 0 140 120"
        className="h-full w-full"
        role="img"
        aria-label={`Animated demonstration: ${MOTION_LABEL[motion]}`}
      >
        {/* ground */}
        <line
          x1={16}
          y1={108}
          x2={124}
          y2={108}
          stroke={JOINT}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <Scene motion={motion} />
      </svg>
    </figure>
  );
}

export { motionFor, MOTION_LABEL };
export type { Motion };
