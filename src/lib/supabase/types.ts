/**
 * Hand-written database types mirroring supabase/migrations/0001_init.sql.
 * Kept in sync manually (the project is small); could be generated with
 * `supabase gen types typescript` once the CLI is wired up.
 *
 * NOTE: these are `type` aliases, not `interface`s — supabase-js constrains
 * each table's Row/Insert/Update to `Record<string, unknown>`, and only type
 * aliases (not interfaces) are assignable to that index signature.
 */
import type { Difficulty, MedalThresholds, MedalTier, MuscleGroup } from "@/lib/constants";

export type Json = string | number | boolean | null | { [k: string]: Json } | Json[];

export type ProfileRow = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  timezone: string;
  training_days: number[];
  onboarded: boolean;
  created_at: string;
};

export type ExerciseRow = {
  id: string;
  slug: string;
  name: string;
  muscle_group: MuscleGroup;
  equipment: string;
  difficulty: Difficulty;
  is_anchor_lift: boolean;
  short_description: string;
  instructions: string[];
  lifehacks: string[];
  media_url: string | null;
  medal_thresholds: MedalThresholds;
  created_at: string;
};

export type WorkoutSessionRow = {
  id: string;
  user_id: string;
  date: string;
  notes: string | null;
  created_at: string;
};

export type SetEntryRow = {
  id: string;
  session_id: string;
  exercise_id: string;
  weight_kg: number;
  reps: number;
  rest_seconds: number | null;
  position: number;
  created_at: string;
};

export type AchievementRow = {
  id: string;
  user_id: string;
  exercise_id: string | null;
  muscle_group: MuscleGroup | null;
  medal: MedalTier;
  earned_at: string;
};

export type ChatMessageRow = {
  id: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

type TableDef<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<
        ProfileRow,
        Partial<ProfileRow> & Pick<ProfileRow, "id" | "email">,
        Partial<ProfileRow>
      >;
      exercises: TableDef<
        ExerciseRow,
        Partial<ExerciseRow> & Pick<ExerciseRow, "slug" | "name" | "muscle_group" | "equipment">,
        Partial<ExerciseRow>
      >;
      workout_sessions: TableDef<
        WorkoutSessionRow,
        Partial<WorkoutSessionRow> & Pick<WorkoutSessionRow, "user_id" | "date">,
        Partial<WorkoutSessionRow>
      >;
      set_entries: TableDef<
        SetEntryRow,
        Partial<SetEntryRow> &
          Pick<SetEntryRow, "session_id" | "exercise_id" | "weight_kg" | "reps">,
        Partial<SetEntryRow>
      >;
      achievements: TableDef<
        AchievementRow,
        Partial<AchievementRow> & Pick<AchievementRow, "user_id" | "medal">,
        Partial<AchievementRow>
      >;
      chat_messages: TableDef<
        ChatMessageRow,
        Partial<ChatMessageRow> & Pick<ChatMessageRow, "user_id" | "role" | "content">,
        Partial<ChatMessageRow>
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      muscle_group: MuscleGroup;
      difficulty: Difficulty;
      medal: MedalTier;
    };
    CompositeTypes: Record<string, never>;
  };
};
