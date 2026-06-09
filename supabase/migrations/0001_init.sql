-- ============================================================
-- Forge — initial schema
-- Postgres (Supabase). Auth is owned by Supabase Auth (auth.users);
-- `profiles` mirrors each auth user. Every user-owned table is
-- protected by Row Level Security so a user only sees their own rows.
-- `exercises` is public-read (the knowledge base).
--
-- Naming note vs PLAN.md: SQL reserved words are renamed —
--   Achievement.group -> achievements.muscle_group
--   SetEntry.order     -> set_entries.position
-- ============================================================

-- ---------- Enums ----------
create type muscle_group as enum ('CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'CORE');
create type difficulty   as enum ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
create type medal         as enum ('NONE', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM');

-- ---------- profiles ----------
-- id == auth.users.id. No passwordHash — Supabase Auth owns credentials.
create table profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text not null,
  name          text,
  image         text,
  timezone      text not null default 'Europe/Dublin',
  training_days smallint[] not null default '{}', -- 0=Sun .. 6=Sat
  onboarded     boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ---------- exercises (public knowledge base) ----------
create table exercises (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  name             text not null,
  muscle_group     muscle_group not null,
  equipment        text not null,
  difficulty       difficulty not null default 'BEGINNER',
  is_anchor_lift   boolean not null default false,
  short_description text not null default '',
  instructions     text[] not null default '{}',
  lifehacks        text[] not null default '{}',
  media_url        text,
  -- { "bronze": 20, "silver": 50, "gold": 75, "platinum": 100 } in kg
  medal_thresholds jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now()
);

create index exercises_muscle_group_idx on exercises (muscle_group);

-- ---------- workout_sessions ----------
create table workout_sessions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles (id) on delete cascade,
  date       date not null,
  notes      text,
  created_at timestamptz not null default now()
);

create index workout_sessions_user_date_idx on workout_sessions (user_id, date);

-- ---------- set_entries ----------
create table set_entries (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid not null references workout_sessions (id) on delete cascade,
  exercise_id  uuid not null references exercises (id),
  weight_kg    real not null check (weight_kg >= 0),
  reps         smallint not null check (reps >= 0),
  rest_seconds smallint,
  position     smallint not null default 0,
  created_at   timestamptz not null default now()
);

create index set_entries_session_idx on set_entries (session_id);
create index set_entries_exercise_idx on set_entries (exercise_id);

-- ---------- achievements ----------
create table achievements (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles (id) on delete cascade,
  exercise_id  uuid references exercises (id),
  muscle_group muscle_group,
  medal        medal not null,
  earned_at    timestamptz not null default now(),
  unique (user_id, muscle_group, medal)
);

create index achievements_user_idx on achievements (user_id);

-- ---------- chat_messages ----------
create table chat_messages (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles (id) on delete cascade,
  role       text not null check (role in ('user', 'assistant')),
  content    text not null,
  created_at timestamptz not null default now()
);

create index chat_messages_user_idx on chat_messages (user_id, created_at);

-- ============================================================
-- Auto-create a profile row when a new auth user signs up.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, image)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table profiles         enable row level security;
alter table exercises        enable row level security;
alter table workout_sessions enable row level security;
alter table set_entries      enable row level security;
alter table achievements     enable row level security;
alter table chat_messages    enable row level security;

-- profiles: a user can read and edit only their own profile.
create policy "profiles: self read"   on profiles for select using (auth.uid() = id);
create policy "profiles: self insert" on profiles for insert with check (auth.uid() = id);
create policy "profiles: self update" on profiles for update using (auth.uid() = id);

-- exercises: public read, no client writes (seeded via service role).
create policy "exercises: public read" on exercises for select using (true);

-- workout_sessions: full CRUD on own rows.
create policy "sessions: own read"   on workout_sessions for select using (auth.uid() = user_id);
create policy "sessions: own insert" on workout_sessions for insert with check (auth.uid() = user_id);
create policy "sessions: own update" on workout_sessions for update using (auth.uid() = user_id);
create policy "sessions: own delete" on workout_sessions for delete using (auth.uid() = user_id);

-- set_entries: allowed when the parent session belongs to the user.
create policy "sets: own read" on set_entries for select using (
  exists (select 1 from workout_sessions s where s.id = session_id and s.user_id = auth.uid())
);
create policy "sets: own insert" on set_entries for insert with check (
  exists (select 1 from workout_sessions s where s.id = session_id and s.user_id = auth.uid())
);
create policy "sets: own update" on set_entries for update using (
  exists (select 1 from workout_sessions s where s.id = session_id and s.user_id = auth.uid())
);
create policy "sets: own delete" on set_entries for delete using (
  exists (select 1 from workout_sessions s where s.id = session_id and s.user_id = auth.uid())
);

-- achievements: full CRUD on own rows.
create policy "achievements: own read"   on achievements for select using (auth.uid() = user_id);
create policy "achievements: own insert" on achievements for insert with check (auth.uid() = user_id);
create policy "achievements: own update" on achievements for update using (auth.uid() = user_id);
create policy "achievements: own delete" on achievements for delete using (auth.uid() = user_id);

-- chat_messages: full CRUD on own rows.
create policy "chat: own read"   on chat_messages for select using (auth.uid() = user_id);
create policy "chat: own insert" on chat_messages for insert with check (auth.uid() = user_id);
create policy "chat: own delete" on chat_messages for delete using (auth.uid() = user_id);
