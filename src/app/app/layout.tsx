import { AppShell } from "@/components/app/app-shell";
import { requireOnboardedProfile } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireOnboardedProfile();

  return (
    <AppShell name={profile.name} email={profile.email} streak={0}>
      {children}
    </AppShell>
  );
}
