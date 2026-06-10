import { AppShell } from "@/components/app/app-shell";
import { requireOnboardedProfile } from "@/lib/auth";
import { getStreakForProfile } from "@/lib/workouts";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireOnboardedProfile();
  const streak = await getStreakForProfile(profile);

  return (
    <AppShell name={profile.name} email={profile.email} streak={streak.current}>
      {children}
    </AppShell>
  );
}
