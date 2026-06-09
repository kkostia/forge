# Forge — Build Plan (for `/goal`)

> **What this is:** a complete, self-contained build spec. Run `/goal` from this folder
> (`C:\Users\kospa\Desktop\forge`) and execute the milestones top to bottom. **After every
> milestone: build, verify it runs, then `git add` → `git commit` (conventional message) → `git push`.**
> Never commit secrets. One language only: **TypeScript**.

---

## 0. Product vision

**Forge** — a gamified strength-training companion for **gym beginners**.

> Tagline: *"Forge your strength."*

A beginner opens Forge to:
- **Learn the core lifts** — a library of fundamental exercises with animated/visual guides, step-by-step instructions, and per-exercise lifehacks.
- **Log workouts** — pick a day on the calendar, record exercises, weight, reps, and rest between sets.
- **Earn medals** — Bronze / Silver / Gold (and Platinum) per muscle group, awarded as your best lifts cross weight thresholds (e.g. Bench: Bronze ≥20 kg, Silver ≥50 kg, Gold ≥75 kg, Platinum ≥100 kg).
- **Keep a streak** — set the weekdays you plan to train; a 🔥 streak counts consecutive planned days you didn't skip.
- **Ask the AI coach** — "why does my shoulder hurt when I bench?", "why has my bench stopped growing?" — answered with OpenAI, grounded in the exercise knowledge base **and the user's own recent logs**.

The name **Forge** ties the theme together: a forge makes metal → bronze/silver/gold medals.
(Name is changeable — if changed, update everywhere.)

---

## 1. Tech stack (lean — ONE language: TypeScript, mostly already known)

**Rule: only ship what you can explain in an interview.** This stack is deliberately almost
identical to the candidate's already-shipped **CoffeeShop** project, so (nearly) everything here
is defensible on day one. New items are clearly flagged and kept tiny.

### Core (required) — all already used in CoffeeShop or trivial drop-in libs

| Layer | Choice | New to you? |
|---|---|---|
| Language | **TypeScript** | known |
| Framework | **Next.js 15** (App Router) — UI **and** backend (Route Handlers + Server Actions) | known |
| Database + Auth | **Supabase** (Postgres + Supabase Auth + storage) — *replaces Prisma AND Auth.js* | known (CoffeeShop) |
| AI | **Vercel AI SDK** + **OpenAI** (`gpt-4o-mini`) | known (CoffeeShop) |
| Styling | **Tailwind CSS v4** + **shadcn/ui** (Radix) | known |
| Motion | **Framer Motion** | known |
| Icons / Toasts | **Lucide** / **Sonner** | known |
| Charts | **Recharts** | easy drop-in lib |
| Calendar | **react-day-picker** | easy drop-in lib |
| Validation | **Zod** | easy |
| Hosting | **Vercel** + **Supabase** | known |
| Package manager | **pnpm** | known |

### Optional stretch — add ONLY if you want one new résumé line AND you understand it
Pick **at most one or two**. Skip the rest without guilt — a finished, defensible project beats a broad one.

| Item | Value | Effort |
|---|---|---|
| **Vitest** unit tests on the medal/streak pure functions | "I write tests" — real plus, and these functions are pure → easy to test | low (recommended) |
| **GitHub Actions** CI (lint + build) | shows basic CI/CD | low |
| **Playwright** one E2E happy-path | shows E2E testing | medium |
| **Lottie** animated guides | nicer exercise demos (images/CSS work fine without it) | medium |
| **Docker** + compose | infra credit (Docker not installed locally → skip unless you set it up) | medium |

**Why this stack:** TypeScript + Next.js + Postgres (via Supabase) is one of the most in-demand,
finishable stacks for Irish internships, and it matches what the candidate has already built — so
every line of the résumé is honest and defensible. Java/Spring is covered separately in a small repo.

---

## 2. Design direction (custom, NOT "AI-generic")

**Goal:** look like a real, opinionated product — not a template.

**Design language: "Industrial forge meets modern athletic."**
- **Palette:** deep charcoal/near-black base (`#0B0B0E`), warm **ember/amber** accent (`#F0571E` / `#FF7A1A`), with **metallic medal tones** — bronze `#B87333`, silver `#C0C0C8`, gold `#E8B923`, platinum `#D6E0E6`. One restrained accent, not rainbow gradients.
- **Type:** bold **condensed display** for headings (e.g. **Archivo Expanded** / **Anton** / **Bebas Neue**) paired with a clean sans body (**Inter** or **Geist**). Big, confident numerals for weights/PRs.
- **Texture & depth:** subtle film grain / noise overlay, soft inner shadows on "metal" surfaces, tactile cards. Medals rendered as crafted SVG badges with a metallic gradient + shine sweep on earn.
- **Layout:** editorial, slightly asymmetric, generous spacing. Avoid the centered-hero-with-emoji template.
- **Motion (Framer Motion):** purposeful — medal "mint" animation on earn, streak flame flicker, number count-ups on PRs, page transitions. Never gratuitous.

**Hard bans (these scream "AI slop"):**
- ❌ purple→blue diagonal gradients
- ❌ glassmorphism everywhere
- ❌ centered hero + 3 emoji feature cards
- ❌ "Made with Next.js / TypeScript / Tailwind" tech badges **anywhere in the UI** (README may list the stack — the *site* must not)
- ❌ generic stock "fitness" hero with overlaid gradient

**Use the `frontend-design` skill** for all significant UI work (landing page, exercise detail, dashboard, medals). Invoke it at the start of each UI-heavy milestone.

---

## 3. Skills & tools to install (for the best design + DX)

**Claude Code skill to use:** `frontend-design` (already available — use it for UI).

**npm/pnpm packages** (installed across milestones; full list here for reference):
```bash
# core
pnpm add next@latest react react-dom
pnpm add -D typescript @types/react @types/node

# db + auth (Supabase — same as CoffeeShop) + validation
pnpm add @supabase/supabase-js @supabase/ssr
pnpm add zod react-hook-form @hookform/resolvers

# ui / design
pnpm add tailwindcss @tailwindcss/postcss
pnpm add framer-motion lucide-react sonner
pnpm add recharts react-day-picker date-fns
pnpm dlx shadcn@latest init      # then: pnpm dlx shadcn@latest add button card dialog input ...

# ai
pnpm add ai @ai-sdk/openai @ai-sdk/react

# lint/format
pnpm add -D eslint prettier eslint-config-next prettier-plugin-tailwindcss

# OPTIONAL stretch only (skip unless chosen):
# pnpm add lottie-react                                            # animated guides
# pnpm add -D vitest @vitejs/plugin-react jsdom                    # unit tests
# pnpm add -D @playwright/test && pnpm dlx playwright install chromium  # E2E
```

**Fonts:** load via `next/font` — display (Archivo Expanded / Anton) + body (Inter or Geist).

**External (free) accounts needed:**
- **Supabase** — project URL + anon key + service-role key (Postgres, Auth, storage)
- **OpenAI** — `OPENAI_API_KEY` (coach; app must degrade gracefully without it)
- **Vercel** — deploy

---

## 4. Data model (conceptual — implemented as **Supabase SQL migrations**)

> Implement these as SQL tables in Supabase (with **Row Level Security** so each user only sees
> their own rows — same pattern as CoffeeShop). **Auth is handled by Supabase Auth**, so there is
> no `passwordHash` and no Auth.js `Account`/`Session` tables — `User` maps to a `profiles` row
> keyed by the Supabase `auth.users` id. The schema below is shown in Prisma-ish notation only for
> readability.

```prisma
enum MuscleGroup { CHEST BACK LEGS SHOULDERS ARMS CORE }
enum Difficulty  { BEGINNER INTERMEDIATE ADVANCED }
enum Medal        { NONE BRONZE SILVER GOLD PLATINUM }

// `profiles` table — id == Supabase auth.users.id (no passwordHash; Supabase Auth owns credentials)
model User {
  id            String   @id          // = auth.users.id
  email         String   @unique
  name          String?
  image         String?
  timezone      String   @default("Europe/Dublin")
  trainingDays  Int[]    // 0=Sun..6=Sat — planned weekly gym days
  createdAt     DateTime @default(now())
  sessions      WorkoutSession[]
  achievements  Achievement[]
  chatMessages  ChatMessage[]
}

model Exercise {
  id            String      @id @default(cuid())
  slug          String      @unique
  name          String
  muscleGroup   MuscleGroup
  equipment     String
  difficulty    Difficulty  @default(BEGINNER)
  isAnchorLift  Boolean     @default(false)   // the lift that drives this group's medal
  instructions  String[]    // ordered steps
  lifehacks     String[]    // tips
  mediaUrl      String?     // image/video/lottie url or local asset path
  medalThresholds Json      // { bronze:20, silver:50, gold:75, platinum:100 } in kg
  setEntries    SetEntry[]
}

model WorkoutSession {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  date      DateTime // the calendar day trained (date-only semantics)
  notes     String?
  createdAt DateTime @default(now())
  sets      SetEntry[]
  @@index([userId, date])
}

model SetEntry {
  id           String   @id @default(cuid())
  sessionId    String
  session      WorkoutSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  exerciseId   String
  exercise     Exercise @relation(fields: [exerciseId], references: [id])
  weightKg     Float
  reps         Int
  restSeconds  Int?
  order        Int
}

model Achievement {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  exerciseId String?
  group      MuscleGroup?
  medal      Medal
  earnedAt   DateTime @default(now())
  @@unique([userId, group, medal])
}

// (no Auth.js Account/Session/VerificationToken — Supabase Auth handles sessions)

model ChatMessage {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  role      String   // 'user' | 'assistant'
  content   String
  createdAt DateTime @default(now())
}
```

---

## 5. Core logic specs

### Medal logic (`src/lib/medals.ts`)
- For each `MuscleGroup`, the **anchor lift** (`isAnchorLift = true`) drives the medal (e.g. CHEST → Barbell Bench Press).
- A user's group medal = highest tier whose `kg` threshold is ≤ the user's **best working-set weight** for that anchor lift (best = max `weightKg` over `SetEntry` with `reps >= 1`; optionally require `reps >= 3` to count as a "working" set — make this a constant `MIN_REPS_FOR_PR = 3`).
- Thresholds live in `Exercise.medalThresholds` (per lift, since squat/deadlift > bench). Defaults in seed.
- On new `SetEntry`, recompute the affected group's medal; if a higher tier is reached, upsert `Achievement` and fire a toast + medal-mint animation.
- Pure functions; unit-tested.

### Streak logic (`src/lib/streak.ts`)
- User sets `trainingDays` (e.g. `[1,3,5]` = Mon/Wed/Fri).
- Walking backwards from today in the user's `timezone`: each **planned** day must have ≥1 `WorkoutSession`. A planned day with no session **breaks** the streak. Non-planned days are skipped (don't break, don't count). Today, if planned and not yet logged, doesn't break until the day ends.
- Returns `{ current, longest, lastTrainedDate }`. Pure, unit-tested.
- 🔥 flame UI scales/intensifies with `current`.

### AI coach (`src/app/api/coach/route.ts`)
- Vercel AI SDK streaming, model `gpt-4o-mini`.
- **System prompt:** Forge coaching persona + safety guardrail ("not medical advice; see a professional for pain/injury").
- **Grounding:** inject (a) relevant exercise instructions/lifehacks from the KB, (b) the user's **recent sessions + PRs + current medals/streak** so it can answer "why has my bench stalled" using real data. Implement via a tool/function the model can call (`getUserTrainingSummary`) or by pre-loading a compact context.
- Persist messages to `ChatMessage`. Degrade gracefully (scripted fallback) when `OPENAI_API_KEY` is unset, so the demo never hard-fails.

---

## 6. Milestones (each ends with build → verify → commit → push)

> **Commit style:** Conventional Commits (`feat:`, `chore:`, `fix:`, `test:`, `docs:`, `ci:`).
> **After each milestone:** `pnpm build` (or at least typecheck+lint+dev-smoke) must pass, then
> `git add -A && git commit -m "<message>" && git push`.

### M0 — Repo & scaffold
- `gh repo create kkostia/forge --public --description "Forge — gamified strength-training companion for gym beginners. Log lifts, earn Bronze/Silver/Gold medals, keep your streak, ask an AI coach. Next.js + TypeScript + Postgres." --source . --remote origin` (or create then set remote).
- `pnpm dlx create-next-app@latest . --ts --app --tailwind --eslint --src-dir --import-alias "@/*" --use-pnpm`
- Add Prettier (+ tailwind plugin), `.editorconfig`, `.gitignore` (ensure `.env*` ignored), `.env.example`.
- `README.md` stub (real README lands in M13).
- **Commit:** `chore: scaffold Next.js + TypeScript + Tailwind project` → push.

### M1 — Design system & landing page
- Use the **`frontend-design`** skill.
- Fonts via `next/font`; Tailwind theme tokens for the forge palette + medal metals; global grain overlay; base `Nav` + `Footer`; reusable `Container`, `Button`, `Card` (shadcn) themed to the design language.
- Build the **landing page**: hero (no template clichés), "how it works", a medal showcase strip, CTA to sign up. Responsive + dark by default.
- **Commit:** `feat: design system and landing page` → push.

### M2 — Database (Supabase) & seed
- Create Supabase project; add `@supabase/supabase-js` + `@supabase/ssr`; wire env keys.
- Create tables from section 4 as **SQL migrations** under `supabase/migrations/`, with **RLS** so users only see their own rows (exercises are public-read).
- **Seed** ~30 beginner-friendly exercises across all 6 muscle groups with **real** instructions + lifehacks + medal thresholds, anchor lifts flagged (Bench/Squat/Deadlift/Overhead Press/Row/Plank etc.).
- **Commit:** `feat: supabase schema, RLS, and exercise seed data` → push.

### M3 — Auth & onboarding (Supabase Auth)
- **Supabase Auth**: email/password sign up / sign in / sign out (+ optional GitHub OAuth toggle). Session via `@supabase/ssr` in RSC + middleware-protected `/app/*` routes. On first sign-in, create the user's `profiles` row.
- **Onboarding/settings:** timezone + pick weekly training days (`trainingDays`).
- **Commit:** `feat: supabase auth and onboarding (timezone + training days)` → push.

### M4 — Exercise library
- `/exercises` grid with filter by muscle group + difficulty + search.
- `/exercises/[slug]` detail: instructions (numbered steps), lifehacks, equipment, medal thresholds for that lift, related exercises.
- **Commit:** `feat: exercise library with filtering and detail pages` → push.

### M5 — Exercise guides (visuals)
- Demonstrate each exercise on the detail page with **images / CSS-SVG animations** (clear, well-cropped). *Optional:* add **Lottie** animated demos for the anchor lifts only if you chose that stretch item — otherwise images are completely fine.
- **Commit:** `feat: exercise guides and visuals` → push.

### M6 — Workout logging
- `/app/log`: **calendar day picker** (`react-day-picker`) → create/open a `WorkoutSession` for that day → add `SetEntry` rows (exercise autocomplete, weight, reps, rest). Edit/delete sets and sessions. Server Actions + Zod validation.
- **Commit:** `feat: workout logging with calendar and set entries` → push.

### M7 — Progress & PRs
- `/app/progress`: per-exercise progress charts (Recharts), personal records, total volume, weekly volume per muscle group.
- **Commit:** `feat: progress charts and personal records` → push.

### M8 — Medals & achievements
- Implement `src/lib/medals.ts`; recompute on log save; persist `Achievement`.
- Medal display on profile + on each anchor-lift exercise page; **medal-mint animation** + Sonner toast on earn.
- `/app/medals`: trophy case across all groups (Bronze→Platinum), with next-threshold progress bars.
- **Commit:** `feat: medal system and achievements trophy case` → push.

### M9 — Streak system
- Implement `src/lib/streak.ts`; 🔥 streak counter in nav/dashboard; streak heatmap calendar; respects `trainingDays` + timezone.
- **Commit:** `feat: training streak with flame counter and heatmap` → push.

### M10 — AI coach
- `/app/coach`: chat UI (Vercel AI SDK `useChat`), streaming. `api/coach` route grounded in exercise KB + user's training summary (tool/function). Safety guardrail + graceful no-key fallback. Persist history.
- **Commit:** `feat: AI coach grounded in exercise knowledge and user logs` → push.

### M11 — Dashboard & polish
- `/app` dashboard: next planned session, current streak, latest medals, recent PRs, quick-log button.
- Empty states, loading skeletons, mobile pass, a11y (labels, focus, contrast), 404/error pages, metadata/OG image.
- **Commit:** `feat: dashboard and full polish pass` → push.

### M12 — Tests *(OPTIONAL stretch — recommended: Vitest only)*
- **Vitest (recommended, low effort):** unit-test `medals.ts` (tier boundaries incl. the 20/50/75/100 examples) and `streak.ts` (planned-day breaks, timezone edges). These are pure functions → easy wins, and "I wrote tests for the core logic" is a strong, honest interview line.
- **Playwright (optional):** one E2E — sign up → set training days → log a session that crosses a medal threshold → see the medal + streak.
- Skip entirely if you're not comfortable explaining them.
- **Commit:** `test: unit tests for medal and streak logic` → push.

### M13 — README & deploy *(Docker/CI optional)*
- **README.md** (case-study style): one-line pitch, **live demo link**, hero **screenshot + GIF**, feature list, screenshots of medals/coach/logging, stack, local setup, env table, architecture note. *(Stack listed in README is fine — just keep tech badges out of the live UI.)*
- Deploy to **Vercel** + **Supabase**; run seed against the prod DB; verify the live demo end-to-end (guest/demo account documented).
- *Optional stretch:* **GitHub Actions** `ci.yml` (install → lint → build) and/or a `Dockerfile` — add only if chosen; both are genuine but skippable infra credit.
- **Commit:** `docs: case-study README and production deploy` → push.

---

## 7. Environment variables (`.env.example`)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=            # server-only (seed, admin)
OPENAI_API_KEY=                       # optional in dev; coach falls back to a scripted reply
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
**Never commit real keys.** `.env.local` is gitignored. Test keys may be pasted into the dev chat but must never reach git.

---

## 8. Definition of done
- All required milestones committed **and pushed** to `github.com/kkostia/forge`, one (or a few) commits each.
- `pnpm build` green. (If you chose Vitest, tests pass.)
- Live demo on Vercel with seeded data and a documented demo account.
- README has a GIF + screenshots + live link.
- Repo has a description + topics: `nextjs typescript supabase postgres fitness gamification openai tailwindcss fullstack`.
- The UI looks custom and intentional — no AI-template clichés, no tech badges in the UI.
- **Every tool used is one you can explain in an interview.** If not — cut it.
