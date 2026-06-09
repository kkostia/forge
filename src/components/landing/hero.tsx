"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Medal } from "@/components/medal";
import { CountUp } from "@/components/count-up";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Hero() {
  return (
    <section className="forge-glow relative overflow-hidden">
      {/* Faint anvil watermark */}
      <Dumbbell
        className="text-forge-800/40 pointer-events-none absolute top-24 -right-16 hidden h-[28rem] w-[28rem] rotate-12 lg:block"
        aria-hidden
      />
      <Container className="relative grid gap-12 py-20 lg:grid-cols-12 lg:gap-8 lg:py-28">
        <motion.div variants={container} initial="hidden" animate="show" className="lg:col-span-7">
          <motion.div variants={item}>
            <Badge variant="ember" className="mb-6">
              <span className="bg-ember-bright size-1.5 rounded-full" />
              Strength training, gamified
            </Badge>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-ash-100 text-6xl leading-[0.88] tracking-tight uppercase sm:text-7xl lg:text-8xl"
          >
            Forge your
            <br />
            <span className="ember-text">strength.</span>
          </motion.h1>

          <motion.p variants={item} className="text-ash-400 mt-6 max-w-md text-lg leading-relaxed">
            The beginner-first lifting companion. Learn the core lifts, log every set, and watch raw
            iron turn into <span className="text-ash-100">Bronze, Silver, Gold</span> and Platinum
            medals as you get stronger.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">
                Start training <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/exercises">Browse the lifts</Link>
            </Button>
          </motion.div>

          <motion.p variants={item} className="text-ash-500 mt-6 text-xs tracking-widest uppercase">
            Free · Beginner-first · No spreadsheet required
          </motion.p>
        </motion.div>

        {/* PR showcase card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: -2 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
          className="relative flex items-center justify-center lg:col-span-5"
        >
          {/* peeking lower-tier medals */}
          <Medal
            tier="BRONZE"
            size={64}
            className="absolute bottom-6 -left-2 -rotate-12 opacity-90"
          />
          <Medal tier="SILVER" size={76} className="absolute top-4 -right-1 rotate-12 opacity-90" />

          <div className="brushed border-edge-bright w-full max-w-sm rounded-2xl border p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ash-500 text-xs tracking-widest uppercase">Personal best</p>
                <p className="font-display text-ash-100 text-2xl tracking-wide uppercase">
                  Barbell Bench
                </p>
              </div>
              <Badge variant="gold">Gold</Badge>
            </div>

            <div className="my-6 flex items-end justify-between">
              <div className="nums flex items-baseline gap-1">
                <CountUp value={100} className="font-display text-ash-100 text-7xl leading-none" />
                <span className="font-display text-ash-400 text-2xl">kg</span>
              </div>
              <Medal tier="GOLD" size={88} shine />
            </div>

            {/* progress to platinum */}
            <div className="space-y-2">
              <div className="text-ash-500 flex justify-between text-xs tracking-wider uppercase">
                <span>Next: Platinum</span>
                <span className="nums text-platinum">100 / 120 kg</span>
              </div>
              <div className="bg-forge-800 h-2 overflow-hidden rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "83%" }}
                  transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                  className="from-platinum/70 to-platinum h-full rounded-full bg-gradient-to-r"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
