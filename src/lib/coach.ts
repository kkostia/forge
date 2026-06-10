import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getExercises } from "@/lib/exercises";
import { getTrainingSets, getStreakForProfile } from "@/lib/workouts";
import { getMedalOverview } from "@/lib/achievements";
import { personalRecords } from "@/lib/progress";
import { MEDAL_LABELS, MUSCLE_GROUP_LABELS, WEEKDAYS } from "@/lib/constants";
import type { ProfileRow } from "@/lib/supabase/types";

/** A persisted chat message shaped as a UIMessage for the client. */
export type ChatHistoryMessage = {
  id: string;
  role: "user" | "assistant";
  parts: { type: "text"; text: string }[];
};

/** Load the user's prior coach conversation (oldest first). */
export async function getChatHistory(userId: string): Promise<ChatHistoryMessage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("chat_messages")
    .select("id, role, content, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(100);
  return (data ?? []).map((m) => ({
    id: m.id,
    role: m.role,
    parts: [{ type: "text", text: m.content }],
  }));
}

export const COACH_SYSTEM_PROMPT = `You are Forge Coach, the in-app strength coach for Forge — a gamified training app for gym beginners.

Voice: encouraging, direct, and practical, like a knowledgeable gym friend. Keep answers short and skimmable (a few sentences or tight bullet points). British English. Never use markdown headers; light bullets are fine.

Grounding rules:
- Use the ATHLETE DATA and KNOWLEDGE BASE provided below to personalise advice. Refer to the user's real lifts, medals, and streak when relevant.
- For exercise technique, prefer the cues in the KNOWLEDGE BASE. If you don't have data on something, say so briefly rather than inventing specifics.

Safety guardrail (important):
- You are not a doctor. For pain, injury, dizziness, chest pain, or anything that feels wrong, tell the user to stop and see a qualified medical professional or coach. Do not attempt to diagnose.
- Encourage gradual progression, warm-ups, and good form over ego lifting.`;

/** Build a compact, personalised context block injected into the system prompt. */
export async function buildCoachContext(profile: ProfileRow): Promise<string> {
  const [sets, exercises, medals, streak] = await Promise.all([
    getTrainingSets(),
    getExercises(),
    getMedalOverview(),
    getStreakForProfile(profile),
  ]);

  const name = profile.name || "the athlete";
  const days =
    profile.training_days.length > 0
      ? profile.training_days
          .slice()
          .sort((a, b) => a - b)
          .map((d) => WEEKDAYS[d]?.short)
          .join(", ")
      : "not set";

  const prs = personalRecords(sets);
  const exBySlug = new Map(exercises.map((e) => [e.slug, e]));

  // Sessions: group sets by date, newest first, take 3.
  const byDate = new Map<string, string[]>();
  for (const s of sets) {
    const line = `${s.exerciseName} ${s.weightKg}kg×${s.reps}`;
    byDate.set(s.date, [...(byDate.get(s.date) ?? []), line]);
  }
  const recentSessions = [...byDate.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 3)
    .map(([date, lines]) => `  - ${date}: ${lines.slice(0, 6).join("; ")}`)
    .join("\n");

  const medalLines = medals
    .map((m) => {
      const standing = `${MUSCLE_GROUP_LABELS[m.group]}: ${MEDAL_LABELS[m.tier]} (best ${m.bestWeight}kg`;
      const next = m.next
        ? `, ${Math.round(m.next.remaining)}kg to ${MEDAL_LABELS[m.next.tier]})`
        : ")";
      return `  - ${standing}${next}`;
    })
    .join("\n");

  const prLines = prs
    .slice(0, 6)
    .map((p) => `  - ${p.name}: ${p.bestWeight}kg best`)
    .join("\n");

  // Knowledge base: lifehacks for exercises the user actually trains, plus anchors.
  const kbSlugs = new Set<string>();
  for (const p of prs.slice(0, 6)) kbSlugs.add(p.slug);
  for (const e of exercises) if (e.is_anchor_lift) kbSlugs.add(e.slug);
  const kb = [...kbSlugs]
    .map((slug) => exBySlug.get(slug))
    .filter((e): e is NonNullable<typeof e> => Boolean(e))
    .slice(0, 8)
    .map((e) => `  - ${e.name} (${MUSCLE_GROUP_LABELS[e.muscle_group]}): ${e.lifehacks.join(" ")}`)
    .join("\n");

  return `ATHLETE DATA
- Name: ${name}
- Planned training days: ${days} (timezone ${profile.timezone})
- Streak: ${streak.current} day(s) current, ${streak.longest} longest
- Total sets logged: ${sets.length}

MEDALS (anchor lift drives each group):
${medalLines || "  - none yet"}

PERSONAL RECORDS:
${prLines || "  - none logged yet"}

RECENT SESSIONS:
${recentSessions || "  - no sessions logged yet"}

KNOWLEDGE BASE (form cues for relevant lifts):
${kb || "  - (exercise library available in the app)"}`;
}

/** Deterministic, useful reply when OPENAI_API_KEY is unset (demo mode). */
export async function fallbackCoachReply(profile: ProfileRow, question: string): Promise<string> {
  const [sets, medals, streak] = await Promise.all([
    getTrainingSets(),
    getMedalOverview(),
    getStreakForProfile(profile),
  ]);

  const nextUp = medals
    .filter((m) => m.next && m.bestWeight > 0)
    .sort((a, b) => (a.next!.remaining ?? 0) - (b.next!.remaining ?? 0))[0];

  const pain = /\b(hurt|pain|injur|sore|ache|dizzy|sharp)\b/i.test(question);

  const lines = [
    "I'm running in demo mode right now (no AI key configured), so here's a quick data-driven note rather than a full conversation:",
  ];

  if (pain) {
    lines.push(
      "⚠️ You mentioned discomfort — if anything feels sharp or wrong, stop the lift and check in with a qualified physio or coach. Pain is information, not something to push through.",
    );
  }

  if (sets.length === 0) {
    lines.push(
      "You haven't logged any sets yet. Start with the anchor lifts (bench, squat, deadlift, overhead press) at a light, comfortable weight and log them to begin earning medals.",
    );
  } else {
    lines.push(
      `You've logged ${sets.length} sets and your current streak is ${streak.current} day(s).`,
    );
    if (nextUp && nextUp.next) {
      lines.push(
        `Closest medal: ${MUSCLE_GROUP_LABELS[nextUp.group]} — ${Math.round(nextUp.next.remaining)}kg on your anchor lift to reach ${MEDAL_LABELS[nextUp.next.tier]}. Add small jumps (2.5–5kg) once your reps feel solid.`,
      );
    }
  }

  lines.push("Add an OpenAI API key to .env.local to unlock the full conversational coach.");
  return lines.join("\n\n");
}
