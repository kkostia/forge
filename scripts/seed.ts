/**
 * Seed the Forge exercise knowledge base into Supabase.
 *
 *   pnpm seed
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
 * Idempotent: upserts on the `slug` unique key, so it's safe to re-run.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { EXERCISES } from "../src/data/exercises";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "\n✗ Missing env. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local\n",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const rows = EXERCISES.map((e) => ({
    slug: e.slug,
    name: e.name,
    muscle_group: e.muscleGroup,
    equipment: e.equipment,
    difficulty: e.difficulty,
    is_anchor_lift: e.isAnchorLift,
    short_description: e.shortDescription,
    instructions: e.instructions,
    lifehacks: e.lifehacks,
    media_url: null,
    medal_thresholds: e.medalThresholds,
  }));

  console.log(`Seeding ${rows.length} exercises…`);

  const { error } = await supabase.from("exercises").upsert(rows, { onConflict: "slug" });

  if (error) {
    console.error("\n✗ Seed failed:", error.message, "\n");
    process.exit(1);
  }

  const { count } = await supabase.from("exercises").select("*", { count: "exact", head: true });

  console.log(`✓ Done. exercises table now holds ${count ?? "?"} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
