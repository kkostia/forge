import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { MedalShowcase } from "@/components/landing/medal-showcase";
import { FinalCta } from "@/components/landing/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <MedalShowcase />
      <FinalCta />
    </>
  );
}
