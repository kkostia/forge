# Supabase setup

Forge uses Supabase for Postgres, Auth, and storage. The app is built to run
without keys (it degrades gracefully), but to use the real database:

## 1. Create a project

Create a free project at [supabase.com](https://supabase.com). From
**Project Settings → API**, copy into `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>   # server-only — never commit
```

## 2. Apply the schema

**Option A — SQL editor (no CLI):** open the SQL editor in the dashboard, paste
the contents of [`migrations/0001_init.sql`](./migrations/0001_init.sql), and run it.

**Option B — Supabase CLI:**

```bash
supabase link --project-ref <project-ref>
supabase db push
```

This creates the tables, enums, indexes, the `handle_new_user` trigger
(auto-creates a `profiles` row on sign-up), and Row Level Security policies so
each user can only see their own data. `exercises` is public-read.

## 3. Seed the exercise library

```bash
pnpm seed
```

Idempotent — upserts the ~30 exercises in `src/data/exercises.ts` on their
`slug`, so it's safe to re-run after editing content.

## Schema overview

| Table | Purpose | RLS |
|---|---|---|
| `profiles` | one row per auth user (timezone, training days) | own row only |
| `exercises` | the knowledge base (public) | public read |
| `workout_sessions` | a training day | own rows |
| `set_entries` | sets within a session (weight, reps, rest) | own (via session) |
| `achievements` | earned medals | own rows |
| `chat_messages` | AI coach history | own rows |
