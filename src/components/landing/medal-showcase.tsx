"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Medal } from "@/components/medal";
import type { EarnableTier } from "@/lib/constants";

// Example thresholds shown for the bench press anchor lift.
const TIERS: { tier: EarnableTier; kg: number; blurb: string }[] = [
  { tier: "BRONZE", kg: 20, blurb: "The empty bar. Everyone starts here." },
  { tier: "SILVER", kg: 50, blurb: "Plates on the bar. Form is locking in." },
  { tier: "GOLD", kg: 75, blurb: "Strong, consistent, undeniable." },
  { tier: "PLATINUM", kg: 100, blurb: "Bodyweight bench and beyond." },
];

export function MedalShowcase() {
  return (
    <section id="medals" className="border-edge/60 relative scroll-mt-20 border-t py-20 lg:py-28">
      <Container>
        <div className="max-w-2xl">
          <p className="text-ember-bright text-xs tracking-widest uppercase">The trophy case</p>
          <h2 className="font-display text-ash-100 mt-3 text-4xl tracking-wide uppercase sm:text-5xl">
            Every kilo is a step toward metal
          </h2>
          <p className="text-ash-400 mt-4">
            Each muscle group is anchored by one core lift. Cross a weight threshold on that lift
            and Forge mints you a medal — Bronze through Platinum. Thresholds shown are for the
            bench press; squats and deadlifts ask for more.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {TIERS.map((t, i) => (
            <motion.div
              key={t.tier}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="brushed border-edge flex flex-col items-center rounded-xl border p-6 text-center"
            >
              <Medal tier={t.tier} size={92} shine={t.tier === "GOLD"} />
              <p className="font-display text-ash-100 mt-5 text-xl tracking-wide uppercase">
                {t.tier}
              </p>
              <p className="nums text-ash-100 mt-1 text-3xl font-bold">
                ≥ {t.kg}
                <span className="text-ash-500 text-base font-normal"> kg</span>
              </p>
              <p className="text-ash-400 mt-3 text-sm">{t.blurb}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
