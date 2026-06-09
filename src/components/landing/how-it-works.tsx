import { BookOpen, ClipboardList, Medal as MedalIcon, MessageCircleQuestion } from "lucide-react";
import { Container } from "@/components/ui/container";

const STEPS = [
  {
    n: "01",
    icon: BookOpen,
    title: "Learn the lifts",
    body: "A library of the fundamental movements — clear steps, equipment, and the little form cues that stop beginners getting hurt.",
  },
  {
    n: "02",
    icon: ClipboardList,
    title: "Log every set",
    body: "Pick a day, add your exercises, weight, reps and rest. Two taps and you're done — no spreadsheet, no fuss.",
  },
  {
    n: "03",
    icon: MedalIcon,
    title: "Earn your medals",
    body: "Your best working sets push each muscle group up the ranks. Hit a threshold and Forge mints the medal on the spot.",
  },
  {
    n: "04",
    icon: MessageCircleQuestion,
    title: "Ask the coach",
    body: "“Why has my bench stalled?” The AI coach answers from real lifting knowledge and your own training history.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="border-edge/60 relative scroll-mt-20 border-t py-20 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="text-ember-bright text-xs tracking-widest uppercase">How it works</p>
            <h2 className="font-display text-ash-100 mt-3 text-4xl leading-none tracking-wide uppercase sm:text-5xl">
              From first
              <br />
              rep to PR
            </h2>
            <p className="text-ash-400 mt-4 max-w-sm">
              Forge keeps the loop tight: learn a movement, log it, watch the metal stack up, and
              get unstuck when you plateau.
            </p>
          </div>

          <div className="border-edge bg-edge grid gap-px overflow-hidden rounded-xl border sm:grid-cols-2 lg:col-span-8">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-forge-900 p-7">
                <div className="flex items-center justify-between">
                  <s.icon className="text-ember size-6" />
                  <span className="font-display text-forge-600 text-3xl">{s.n}</span>
                </div>
                <h3 className="text-ash-100 mt-5 text-xl tracking-wide uppercase">{s.title}</h3>
                <p className="text-ash-400 mt-2 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
