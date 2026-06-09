import type { Difficulty, MedalThresholds, MuscleGroup } from "@/lib/constants";

/**
 * The Forge exercise knowledge base — single source of truth for content.
 * Seeded into Supabase by `scripts/seed.ts`. Each muscle group has exactly
 * one anchor lift (`isAnchorLift`) whose best working set drives that group's
 * medal. Thresholds are in kilograms; for bodyweight/loaded-isometric moves
 * (e.g. the plank) they represent *added* load.
 */
export interface SeedExercise {
  slug: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: string;
  difficulty: Difficulty;
  isAnchorLift: boolean;
  shortDescription: string;
  instructions: string[];
  lifehacks: string[];
  medalThresholds: MedalThresholds;
}

export const EXERCISES: SeedExercise[] = [
  // ---------------- CHEST ----------------
  {
    slug: "barbell-bench-press",
    name: "Barbell Bench Press",
    muscleGroup: "CHEST",
    equipment: "Barbell + bench",
    difficulty: "BEGINNER",
    isAnchorLift: true,
    shortDescription: "The benchmark pressing lift and the anchor for your chest medal.",
    instructions: [
      "Lie back on the bench with eyes under the bar and feet flat on the floor.",
      "Grip the bar slightly wider than shoulder width; pull your shoulder blades down and together.",
      "Unrack, lower the bar under control to the middle of your chest, elbows ~75°.",
      "Press the bar back up in a slight arc until your arms are straight, without bouncing.",
    ],
    lifehacks: [
      "Drive your feet into the floor — leg drive stabilises a heavier press.",
      "Keep wrists stacked over elbows so the load sits on bone, not tendon.",
      "Always use a spotter or safety pins when training near your limit.",
    ],
    medalThresholds: { bronze: 20, silver: 50, gold: 75, platinum: 100 },
  },
  {
    slug: "incline-dumbbell-press",
    name: "Incline Dumbbell Press",
    muscleGroup: "CHEST",
    equipment: "Dumbbells + incline bench",
    difficulty: "BEGINNER",
    isAnchorLift: false,
    shortDescription: "Targets the upper chest with a friendly, joint-kind angle.",
    instructions: [
      "Set the bench to about 30°. Sit back with a dumbbell resting on each thigh.",
      "Kick the weights up one at a time and press them to arm's length over your shoulders.",
      "Lower under control until you feel a stretch across the upper chest.",
      "Press back up and slightly together at the top.",
    ],
    lifehacks: [
      "Too steep an incline turns this into a shoulder press — keep it ~30°.",
      "Dumbbells let each arm work independently, evening out side-to-side strength.",
    ],
    medalThresholds: { bronze: 10, silver: 22, gold: 32, platinum: 44 },
  },
  {
    slug: "push-up",
    name: "Push-Up",
    muscleGroup: "CHEST",
    equipment: "Bodyweight",
    difficulty: "BEGINNER",
    isAnchorLift: false,
    shortDescription: "The original chest builder — no equipment, infinitely scalable.",
    instructions: [
      "Start in a high plank, hands just outside shoulder width.",
      "Brace your core and squeeze your glutes so your body is one straight line.",
      "Lower until your chest is a fist's height from the floor, elbows ~45°.",
      "Press back up to full lockout without letting the hips sag.",
    ],
    lifehacks: [
      "Too hard? Put your hands on a bench. Too easy? Elevate your feet.",
      "Imagine screwing your hands into the floor to fire up the chest and triceps.",
    ],
    medalThresholds: { bronze: 0, silver: 0, gold: 0, platinum: 0 },
  },
  {
    slug: "dumbbell-chest-fly",
    name: "Dumbbell Chest Fly",
    muscleGroup: "CHEST",
    equipment: "Dumbbells + bench",
    difficulty: "INTERMEDIATE",
    isAnchorLift: false,
    shortDescription: "An isolation move that stretches and squeezes the chest.",
    instructions: [
      "Lie on a flat bench holding a dumbbell in each hand above your chest, palms facing in.",
      "Keep a soft, fixed bend in the elbows throughout.",
      "Open your arms in a wide arc until you feel a stretch across the chest.",
      "Bring the weights back together over your chest as if hugging a barrel.",
    ],
    lifehacks: [
      "Go light — flyes are about the stretch and squeeze, not heavy weight.",
      "Never let the elbows bend and straighten; that turns it into a clumsy press.",
    ],
    medalThresholds: { bronze: 6, silver: 12, gold: 18, platinum: 26 },
  },
  {
    slug: "machine-chest-press",
    name: "Machine Chest Press",
    muscleGroup: "CHEST",
    equipment: "Chest press machine",
    difficulty: "BEGINNER",
    isAnchorLift: false,
    shortDescription: "A fixed-path press — perfect for learning to push safely.",
    instructions: [
      "Adjust the seat so the handles sit at mid-chest height.",
      "Sit back with your shoulder blades pinned against the pad.",
      "Press the handles forward until your arms are nearly straight.",
      "Return slowly until you feel a light stretch, keeping tension on the chest.",
    ],
    lifehacks: [
      "The fixed path lets you push close to failure safely without a spotter.",
      "Pause for a second at the bottom to kill momentum and build control.",
    ],
    medalThresholds: { bronze: 20, silver: 40, gold: 60, platinum: 85 },
  },

  // ---------------- BACK ----------------
  {
    slug: "deadlift",
    name: "Conventional Deadlift",
    muscleGroup: "BACK",
    equipment: "Barbell",
    difficulty: "INTERMEDIATE",
    isAnchorLift: true,
    shortDescription: "The ultimate pulling strength test and the anchor for your back medal.",
    instructions: [
      "Stand with mid-foot under the bar, shins an inch away.",
      "Hinge and grip just outside your knees; drop your hips until shins touch the bar.",
      "Take a big breath, brace, and push the floor away while keeping the bar against your legs.",
      "Stand tall by locking hips and knees together, then lower by hinging back down.",
    ],
    lifehacks: [
      "Think 'push the floor away', not 'pull the bar' — it keeps your hips in place.",
      "Keep the bar dragging up your legs; a bar that drifts forward wrecks your back.",
      "Reset your brace before every rep rather than bouncing off the floor.",
    ],
    medalThresholds: { bronze: 40, silver: 90, gold: 130, platinum: 180 },
  },
  {
    slug: "barbell-bent-over-row",
    name: "Barbell Bent-Over Row",
    muscleGroup: "BACK",
    equipment: "Barbell",
    difficulty: "INTERMEDIATE",
    isAnchorLift: false,
    shortDescription: "Builds a thick, strong mid-back to balance your pressing.",
    instructions: [
      "Hinge at the hips until your torso is ~45°, bar hanging at arm's length.",
      "Grip just outside your knees with a flat back and braced core.",
      "Pull the bar to your lower ribs, driving your elbows back and up.",
      "Lower under control until the arms are straight again.",
    ],
    lifehacks: [
      "Lead with the elbows, not the hands, to feel it in the back rather than the arms.",
      "If your lower back rounds, lighten the load — form first.",
    ],
    medalThresholds: { bronze: 25, silver: 50, gold: 70, platinum: 95 },
  },
  {
    slug: "lat-pulldown",
    name: "Lat Pulldown",
    muscleGroup: "BACK",
    equipment: "Cable machine",
    difficulty: "BEGINNER",
    isAnchorLift: false,
    shortDescription: "A scalable vertical pull that builds the lats and grip.",
    instructions: [
      "Set the thigh pad snug and grip the bar wider than shoulder width.",
      "Sit tall with a slight lean back; pull your shoulder blades down first.",
      "Draw the bar to your upper chest, driving elbows down to your sides.",
      "Return the bar overhead slowly until your lats are fully stretched.",
    ],
    lifehacks: [
      "Start the pull by depressing the shoulder blades, not by yanking with the arms.",
      "Don't crash the stack — control the way up to double your time under tension.",
    ],
    medalThresholds: { bronze: 25, silver: 45, gold: 65, platinum: 90 },
  },
  {
    slug: "seated-cable-row",
    name: "Seated Cable Row",
    muscleGroup: "BACK",
    equipment: "Cable machine",
    difficulty: "BEGINNER",
    isAnchorLift: false,
    shortDescription: "A horizontal pull that hammers the mid-back with constant tension.",
    instructions: [
      "Sit with a slight knee bend and grip the handle, arms extended.",
      "Sit tall, chest up; pull the handle to your belly, squeezing the shoulder blades.",
      "Keep your torso still — let the back do the work, not your lower back swinging.",
      "Extend the arms forward slowly to a full stretch.",
    ],
    lifehacks: [
      "Pause for a beat with the handle at your stomach to maximise the squeeze.",
      "If you're rocking back and forth for momentum, drop the weight.",
    ],
    medalThresholds: { bronze: 25, silver: 45, gold: 65, platinum: 90 },
  },
  {
    slug: "assisted-pull-up",
    name: "Assisted Pull-Up",
    muscleGroup: "BACK",
    equipment: "Pull-up bar + band/machine",
    difficulty: "BEGINNER",
    isAnchorLift: false,
    shortDescription: "Bridges the gap to your first unassisted pull-up.",
    instructions: [
      "Loop a band over the bar (or set the assist machine) and grip slightly wider than shoulders.",
      "Start from a dead hang with shoulders pulled down.",
      "Pull until your chin clears the bar, driving elbows to your ribs.",
      "Lower all the way to a full hang under control.",
    ],
    lifehacks: [
      "Lighter band = less help. Step the assistance down as you get stronger.",
      "Full dead hang to full lockout — half-reps build half a back.",
    ],
    medalThresholds: { bronze: 0, silver: 0, gold: 0, platinum: 0 },
  },

  // ---------------- LEGS ----------------
  {
    slug: "barbell-back-squat",
    name: "Barbell Back Squat",
    muscleGroup: "LEGS",
    equipment: "Barbell + rack",
    difficulty: "INTERMEDIATE",
    isAnchorLift: true,
    shortDescription: "The king of leg builders and the anchor for your legs medal.",
    instructions: [
      "Set the bar on your upper traps, hands gripping just outside your shoulders.",
      "Unrack, step back, and stand with feet shoulder-width, toes slightly out.",
      "Brace, then sit down and back until your hip crease passes below your knee.",
      "Drive through your whole foot to stand back up, knees tracking over your toes.",
    ],
    lifehacks: [
      "Spread the floor with your feet to keep your knees from caving in.",
      "Brace as if about to be punched in the gut — that's your built-in lifting belt.",
      "Squat in a rack with safeties set just below your bottom position.",
    ],
    medalThresholds: { bronze: 30, silver: 70, gold: 100, platinum: 140 },
  },
  {
    slug: "romanian-deadlift",
    name: "Romanian Deadlift",
    muscleGroup: "LEGS",
    equipment: "Barbell",
    difficulty: "INTERMEDIATE",
    isAnchorLift: false,
    shortDescription: "A hip hinge that builds powerful hamstrings and glutes.",
    instructions: [
      "Stand tall holding the bar at your thighs, knees softly bent.",
      "Push your hips straight back, letting the bar slide down your legs.",
      "Lower until you feel a strong hamstring stretch (usually mid-shin).",
      "Drive your hips forward to stand tall, squeezing your glutes at the top.",
    ],
    lifehacks: [
      "The movement is hips back, not bending down — your knees barely move.",
      "Keep the bar touching your legs the whole way to protect your lower back.",
    ],
    medalThresholds: { bronze: 30, silver: 60, gold: 90, platinum: 130 },
  },
  {
    slug: "leg-press",
    name: "Leg Press",
    muscleGroup: "LEGS",
    equipment: "Leg press machine",
    difficulty: "BEGINNER",
    isAnchorLift: false,
    shortDescription: "Loads the quads and glutes heavily with a supported back.",
    instructions: [
      "Sit with your back flat against the pad, feet shoulder-width on the platform.",
      "Release the safeties and lower the platform until your knees reach ~90°.",
      "Keep your lower back glued to the pad — don't let your hips curl up.",
      "Press back up without locking your knees out hard.",
    ],
    lifehacks: [
      "Higher foot placement hits glutes/hams; lower placement hits quads.",
      "Stop lowering the moment your butt starts to lift off the pad.",
    ],
    medalThresholds: { bronze: 50, silver: 110, gold: 160, platinum: 230 },
  },
  {
    slug: "walking-lunge",
    name: "Walking Lunge",
    muscleGroup: "LEGS",
    equipment: "Dumbbells (optional)",
    difficulty: "BEGINNER",
    isAnchorLift: false,
    shortDescription: "A single-leg builder that exposes and fixes imbalances.",
    instructions: [
      "Stand tall, optionally holding a dumbbell in each hand.",
      "Step forward and lower until both knees are bent ~90°.",
      "Drive through your front heel to come up and step the back foot through.",
      "Repeat, alternating legs as you walk forward.",
    ],
    lifehacks: [
      "Take a long enough step that your front shin stays roughly vertical.",
      "Keep your torso upright and core braced to stay balanced.",
    ],
    medalThresholds: { bronze: 0, silver: 12, gold: 22, platinum: 34 },
  },
  {
    slug: "leg-extension",
    name: "Leg Extension",
    muscleGroup: "LEGS",
    equipment: "Leg extension machine",
    difficulty: "BEGINNER",
    isAnchorLift: false,
    shortDescription: "Isolates the quads with a strong peak contraction.",
    instructions: [
      "Adjust the pad to sit on your lower shins, knees aligned with the pivot.",
      "Sit back and grip the handles.",
      "Extend your knees until your legs are straight, pausing at the top.",
      "Lower slowly under control without letting the stack rest between reps.",
    ],
    lifehacks: [
      "Squeeze hard for a second at the top — that's where the quads work hardest.",
      "A slow negative makes a light weight feel brutal; you don't need to pile on plates.",
    ],
    medalThresholds: { bronze: 20, silver: 40, gold: 60, platinum: 85 },
  },
  {
    slug: "standing-calf-raise",
    name: "Standing Calf Raise",
    muscleGroup: "LEGS",
    equipment: "Machine or dumbbells",
    difficulty: "BEGINNER",
    isAnchorLift: false,
    shortDescription: "Builds the calves through a full stretch-to-squeeze range.",
    instructions: [
      "Stand with the balls of your feet on a step or platform, heels hanging off.",
      "Lower your heels until you feel a deep stretch in the calves.",
      "Drive up onto your toes as high as possible.",
      "Pause at the top, then lower slowly.",
    ],
    lifehacks: [
      "Full range beats heavy weight — let your heels drop and rise fully.",
      "Pause at both the stretched bottom and the squeezed top.",
    ],
    medalThresholds: { bronze: 20, silver: 45, gold: 70, platinum: 100 },
  },

  // ---------------- SHOULDERS ----------------
  {
    slug: "overhead-press",
    name: "Standing Overhead Press",
    muscleGroup: "SHOULDERS",
    equipment: "Barbell",
    difficulty: "INTERMEDIATE",
    isAnchorLift: true,
    shortDescription: "A true test of upper-body strength and the anchor for your shoulders medal.",
    instructions: [
      "Set the bar across your front delts, hands just outside shoulder width.",
      "Brace your core and squeeze your glutes so you don't lean back.",
      "Press the bar straight up, moving your head back slightly to clear the path.",
      "Lock out overhead with the bar over your mid-foot, then lower under control.",
    ],
    lifehacks: [
      "Squeeze your glutes hard — it stops the press turning into a standing incline bench.",
      "Once the bar passes your forehead, push your head 'through the window' to lock out.",
    ],
    medalThresholds: { bronze: 15, silver: 35, gold: 50, platinum: 70 },
  },
  {
    slug: "dumbbell-lateral-raise",
    name: "Dumbbell Lateral Raise",
    muscleGroup: "SHOULDERS",
    equipment: "Dumbbells",
    difficulty: "BEGINNER",
    isAnchorLift: false,
    shortDescription: "The go-to move for wider, capped shoulders.",
    instructions: [
      "Stand holding a light dumbbell in each hand at your sides.",
      "With a slight elbow bend, raise the weights out to the sides.",
      "Stop when your arms reach shoulder height, leading with the elbows.",
      "Lower slowly all the way down.",
    ],
    lifehacks: [
      "Pour the water — tilt your pinkies slightly up to bias the side delt.",
      "Ego is the enemy here; go light and feel the delts, not the traps.",
    ],
    medalThresholds: { bronze: 4, silver: 10, gold: 16, platinum: 24 },
  },
  {
    slug: "seated-dumbbell-shoulder-press",
    name: "Seated Dumbbell Shoulder Press",
    muscleGroup: "SHOULDERS",
    equipment: "Dumbbells + bench",
    difficulty: "BEGINNER",
    isAnchorLift: false,
    shortDescription: "A back-supported press to build pressing strength safely.",
    instructions: [
      "Sit on an upright bench with a dumbbell in each hand at shoulder height.",
      "Brace your back against the pad, palms facing forward.",
      "Press the dumbbells up and slightly together until your arms are straight.",
      "Lower under control to shoulder height.",
    ],
    lifehacks: [
      "Don't clang the dumbbells together at the top — stop just short.",
      "Keep your ribs down so you press with shoulders, not your lower back.",
    ],
    medalThresholds: { bronze: 8, silver: 18, gold: 28, platinum: 40 },
  },
  {
    slug: "face-pull",
    name: "Face Pull",
    muscleGroup: "SHOULDERS",
    equipment: "Cable + rope",
    difficulty: "BEGINNER",
    isAnchorLift: false,
    shortDescription: "Bulletproofs the shoulders and fixes posture.",
    instructions: [
      "Set a rope at upper-chest height and grip both ends, thumbs back.",
      "Step back so there's tension, arms extended.",
      "Pull the rope toward your face, splitting your hands past your ears.",
      "Squeeze the rear delts, then return slowly.",
    ],
    lifehacks: [
      "Think 'show me your muscles' — externally rotate at the end of the pull.",
      "Light weight, high reps; this is prehab, not a max-effort lift.",
    ],
    medalThresholds: { bronze: 10, silver: 22, gold: 32, platinum: 45 },
  },
  {
    slug: "rear-delt-fly",
    name: "Rear Delt Fly",
    muscleGroup: "SHOULDERS",
    equipment: "Dumbbells",
    difficulty: "BEGINNER",
    isAnchorLift: false,
    shortDescription: "Hits the often-neglected rear delts for balanced shoulders.",
    instructions: [
      "Hinge forward at the hips with a flat back, dumbbells hanging beneath you.",
      "With a soft elbow bend, raise the weights out to the sides.",
      "Squeeze your shoulder blades together at the top.",
      "Lower slowly back to the start.",
    ],
    lifehacks: [
      "Lead with the pinkies and keep the neck relaxed to avoid using traps.",
      "Rest your forehead on an incline bench to remove momentum entirely.",
    ],
    medalThresholds: { bronze: 4, silver: 9, gold: 14, platinum: 20 },
  },

  // ---------------- ARMS ----------------
  {
    slug: "barbell-biceps-curl",
    name: "Barbell Biceps Curl",
    muscleGroup: "ARMS",
    equipment: "Barbell",
    difficulty: "BEGINNER",
    isAnchorLift: true,
    shortDescription: "The classic biceps builder and the anchor for your arms medal.",
    instructions: [
      "Stand tall holding the bar at shoulder width, arms straight, elbows at your sides.",
      "Curl the bar up by bending only at the elbows.",
      "Squeeze the biceps at the top without swinging your torso.",
      "Lower slowly until the arms are fully straight.",
    ],
    lifehacks: [
      "Pin your elbows to your sides — if they drift forward you're cheating with the front delts.",
      "If you have to heave it up with your back, the bar is too heavy.",
    ],
    medalThresholds: { bronze: 10, silver: 25, gold: 35, platinum: 50 },
  },
  {
    slug: "triceps-pushdown",
    name: "Triceps Pushdown",
    muscleGroup: "ARMS",
    equipment: "Cable + bar/rope",
    difficulty: "BEGINNER",
    isAnchorLift: false,
    shortDescription: "A joint-friendly staple for building the triceps.",
    instructions: [
      "Set a bar at the top of a cable and grip it shoulder-width.",
      "Tuck your elbows to your sides and lean very slightly forward.",
      "Push the bar down until your arms are straight, squeezing the triceps.",
      "Let the bar rise to about chest height under control.",
    ],
    lifehacks: [
      "Keep your elbows pinned — they should act as fixed hinges.",
      "Use a rope and spread the ends at the bottom for an extra-hard squeeze.",
    ],
    medalThresholds: { bronze: 15, silver: 30, gold: 45, platinum: 65 },
  },
  {
    slug: "hammer-curl",
    name: "Hammer Curl",
    muscleGroup: "ARMS",
    equipment: "Dumbbells",
    difficulty: "BEGINNER",
    isAnchorLift: false,
    shortDescription: "Builds the brachialis for thicker-looking arms and stronger grip.",
    instructions: [
      "Stand holding a dumbbell in each hand, palms facing your thighs.",
      "Keeping that neutral grip, curl one or both weights up.",
      "Squeeze at the top with the thumb leading.",
      "Lower slowly to full extension.",
    ],
    lifehacks: [
      "The neutral grip is easier on the wrists than a barbell curl.",
      "Avoid swinging — a tiny bit of body english is fine, a heave is not.",
    ],
    medalThresholds: { bronze: 8, silver: 16, gold: 24, platinum: 34 },
  },
  {
    slug: "overhead-triceps-extension",
    name: "Overhead Triceps Extension",
    muscleGroup: "ARMS",
    equipment: "Dumbbell or cable",
    difficulty: "BEGINNER",
    isAnchorLift: false,
    shortDescription: "Stretches the long head of the triceps for fuller arms.",
    instructions: [
      "Hold one dumbbell overhead with both hands, or use a rope on a low cable.",
      "Keep your elbows pointing forward and close to your head.",
      "Lower the weight behind your head until you feel a triceps stretch.",
      "Extend back up to straight arms, squeezing the triceps.",
    ],
    lifehacks: [
      "Keep your upper arms still — only the forearms should move.",
      "The deep stretch is the point; control the bottom rather than rushing.",
    ],
    medalThresholds: { bronze: 8, silver: 18, gold: 26, platinum: 38 },
  },
  {
    slug: "dumbbell-skull-crusher",
    name: "Dumbbell Skull Crusher",
    muscleGroup: "ARMS",
    equipment: "Dumbbells + bench",
    difficulty: "INTERMEDIATE",
    isAnchorLift: false,
    shortDescription: "A lying triceps extension that overloads the muscle directly.",
    instructions: [
      "Lie on a flat bench holding a dumbbell in each hand over your chest, palms facing in.",
      "Keeping upper arms vertical, bend the elbows to lower the weights beside your head.",
      "Stop when your forearms pass parallel, feeling the stretch.",
      "Extend back to the start without flaring the elbows.",
    ],
    lifehacks: [
      "Dumbbells let you angle slightly to spare cranky elbows.",
      "Lower beside the ears, not straight onto your forehead — and start light.",
    ],
    medalThresholds: { bronze: 6, silver: 12, gold: 18, platinum: 26 },
  },

  // ---------------- CORE ----------------
  {
    slug: "weighted-plank",
    name: "Weighted Plank",
    muscleGroup: "CORE",
    equipment: "Bodyweight + plate",
    difficulty: "BEGINNER",
    isAnchorLift: true,
    shortDescription:
      "A loaded anti-extension hold — the anchor for your core medal (medals scale with added load).",
    instructions: [
      "Set your forearms on the floor, elbows under your shoulders.",
      "Extend your legs back so your body is one straight line from head to heels.",
      "Brace your abs and squeeze your glutes; have a partner place a plate on your upper back for load.",
      "Hold the position with steady breathing — don't let your hips sag or pike.",
    ],
    lifehacks: [
      "Log the added plate weight (0 kg = bodyweight) — quality time beats sloppy minutes.",
      "Squeeze your glutes and quads; a plank is a full-body brace, not just abs.",
    ],
    medalThresholds: { bronze: 0, silver: 10, gold: 20, platinum: 30 },
  },
  {
    slug: "hanging-knee-raise",
    name: "Hanging Knee Raise",
    muscleGroup: "CORE",
    equipment: "Pull-up bar",
    difficulty: "INTERMEDIATE",
    isAnchorLift: false,
    shortDescription: "Builds the lower abs and a strong, decompressed spine.",
    instructions: [
      "Hang from a bar with straight arms and shoulders pulled down.",
      "Without swinging, curl your knees up toward your chest.",
      "Tuck your pelvis under at the top to fully contract the abs.",
      "Lower your legs slowly back to a dead hang.",
    ],
    lifehacks: [
      "Curl the pelvis up rather than just lifting the thighs — that's the ab part.",
      "If you're swinging, pause for a second at the bottom of each rep.",
    ],
    medalThresholds: { bronze: 0, silver: 0, gold: 0, platinum: 0 },
  },
  {
    slug: "cable-crunch",
    name: "Cable Crunch",
    muscleGroup: "CORE",
    equipment: "Cable + rope",
    difficulty: "BEGINNER",
    isAnchorLift: false,
    shortDescription: "Lets you progressively overload the abs like any other muscle.",
    instructions: [
      "Kneel facing a high cable, holding a rope beside your head.",
      "Hinge slightly so there's tension on the abs.",
      "Crunch down by rounding your spine, driving your elbows toward your thighs.",
      "Return slowly until the abs are fully stretched.",
    ],
    lifehacks: [
      "Keep your hips fixed — the movement is your ribs toward your pelvis, not a hip bend.",
      "Treat abs like any muscle: add weight over time to keep them growing.",
    ],
    medalThresholds: { bronze: 15, silver: 30, gold: 45, platinum: 65 },
  },
  {
    slug: "russian-twist",
    name: "Russian Twist",
    muscleGroup: "CORE",
    equipment: "Plate or dumbbell",
    difficulty: "BEGINNER",
    isAnchorLift: false,
    shortDescription: "Trains rotational core strength and the obliques.",
    instructions: [
      "Sit on the floor, knees bent, leaning back to ~45° with a braced core.",
      "Hold a plate or dumbbell at your chest (lift your feet for more challenge).",
      "Rotate your torso to tap the weight toward the floor on one side.",
      "Rotate smoothly to the other side, controlling the movement.",
    ],
    lifehacks: [
      "Rotate from the ribcage, not just by waving your arms side to side.",
      "Keep your chest up; rounding turns it into a sloppy swing.",
    ],
    medalThresholds: { bronze: 5, silver: 12, gold: 20, platinum: 30 },
  },
  {
    slug: "dead-bug",
    name: "Dead Bug",
    muscleGroup: "CORE",
    equipment: "Bodyweight",
    difficulty: "BEGINNER",
    isAnchorLift: false,
    shortDescription: "Teaches the core brace that protects your spine under load.",
    instructions: [
      "Lie on your back with arms pointing at the ceiling and knees bent over your hips.",
      "Press your lower back flat into the floor and brace your abs.",
      "Slowly lower one arm overhead and the opposite leg toward the floor.",
      "Return to the start and repeat on the other side without losing the flat back.",
    ],
    lifehacks: [
      "If your lower back arches off the floor, shorten the range until you can keep it flat.",
      "Move slowly and breathe out as you extend — control beats speed here.",
    ],
    medalThresholds: { bronze: 0, silver: 0, gold: 0, platinum: 0 },
  },
];

/** The single anchor exercise per muscle group. */
export const ANCHOR_BY_GROUP = Object.fromEntries(
  EXERCISES.filter((e) => e.isAnchorLift).map((e) => [e.muscleGroup, e]),
) as Record<MuscleGroup, SeedExercise>;
