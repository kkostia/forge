import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { MedalGroupCard } from "@/components/medals/medal-group-card";
import { requireOnboardedProfile } from "@/lib/auth";
import { getMedalOverview } from "@/lib/achievements";
import { MEDAL_LABELS, MEDAL_RANK, type MedalTier } from "@/lib/constants";

export const metadata: Metadata = { title: "Medals" };

export default async function MedalsPage() {
  await requireOnboardedProfile();
  const medals = await getMedalOverview();

  const totalEarned = medals.reduce((sum, m) => sum + m.earned.length, 0);
  const highest: MedalTier = medals.reduce<MedalTier>(
    (best, m) => (MEDAL_RANK[m.tier] > MEDAL_RANK[best] ? m.tier : best),
    "NONE",
  );

  return (
    <Container className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-ember-bright text-xs tracking-widest uppercase">Trophy case</p>
          <h1 className="font-display text-ash-100 mt-1 text-4xl tracking-wide uppercase">
            Your medals
          </h1>
          <p className="text-ash-400 mt-1">
            Each muscle group is anchored by one lift. Push its best working set past a threshold to
            mint the next medal.
          </p>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="nums text-ash-100 font-display text-3xl">{totalEarned}</p>
            <p className="text-ash-500 text-xs uppercase">Medals earned</p>
          </div>
          <div>
            <p className="text-ember-bright font-display text-3xl tracking-wide uppercase">
              {MEDAL_LABELS[highest]}
            </p>
            <p className="text-ash-500 text-xs uppercase">Highest tier</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {medals.map((m) => (
          <MedalGroupCard key={m.group} medal={m} />
        ))}
      </div>
    </Container>
  );
}
