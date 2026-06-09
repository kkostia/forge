import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function FinalCta() {
  return (
    <section className="border-edge/60 relative border-t py-24">
      <div className="forge-glow absolute inset-0" aria-hidden />
      <Container className="relative text-center">
        <h2 className="font-display text-ash-100 mx-auto max-w-3xl text-5xl leading-[0.92] tracking-wide uppercase sm:text-6xl">
          Stop guessing.
          <br />
          Start <span className="ember-text">forging.</span>
        </h2>
        <p className="text-ash-400 mx-auto mt-5 max-w-md">
          Create a free account, set your training days, and log your first session in under a
          minute.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link href="/signup">
              Create your free account <ArrowRight />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
