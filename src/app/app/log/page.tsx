import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { Container } from "@/components/ui/container";
import { LogCalendar } from "@/components/log/log-calendar";
import { SetLogger } from "@/components/log/set-logger";
import { SessionExtras } from "@/components/log/session-extras";
import { requireOnboardedProfile } from "@/lib/auth";
import { getExercises } from "@/lib/exercises";
import { getSessionDates, getSessionForDate } from "@/lib/workouts";
import { isValidDateString, relativeDayLabel, todayInTz } from "@/lib/dates";

export const metadata: Metadata = { title: "Log a workout" };

export default async function LogPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { user, profile } = await requireOnboardedProfile();
  const today = todayInTz(profile.timezone);

  const { date: dateParam } = await searchParams;
  const date = dateParam && isValidDateString(dateParam) ? dateParam : today;

  const [session, loggedDates, exercises] = await Promise.all([
    getSessionForDate(user.id, date),
    getSessionDates(user.id),
    getExercises(),
  ]);

  const comboExercises = exercises.map((e) => ({
    id: e.id,
    name: e.name,
    muscle_group: e.muscle_group,
  }));

  return (
    <Container>
      <div className="mb-8">
        <p className="text-ember-bright text-xs tracking-widest uppercase">Workout log</p>
        <h1 className="font-display text-ash-100 mt-1 flex items-center gap-3 text-4xl tracking-wide uppercase">
          {relativeDayLabel(date, today)}
        </h1>
        <p className="text-ash-400 mt-1 inline-flex items-center gap-2 text-sm">
          <CalendarDays className="size-4" />
          {new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7 xl:col-span-8">
          <SetLogger date={date} sets={session?.sets ?? []} exercises={comboExercises} />
          <div className="border-edge/60 border-t pt-6">
            <SessionExtras
              date={date}
              sessionId={session?.id ?? null}
              notes={session?.notes ?? null}
            />
          </div>
        </div>

        <aside className="lg:col-span-5 xl:col-span-4">
          <div className="brushed border-edge sticky top-20 rounded-xl border p-4">
            <LogCalendar
              selected={date}
              loggedDates={loggedDates}
              trainingDays={profile.training_days}
            />
            <div className="text-ash-500 mt-3 space-y-1.5 px-1 text-xs">
              <p className="flex items-center gap-2">
                <span className="bg-ember inline-block size-2 rounded-full" /> Logged a session
              </p>
              <p className="flex items-center gap-2">
                <span className="border-edge-bright inline-block size-2 rounded-sm border" />{" "}
                Planned training day
              </p>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}
