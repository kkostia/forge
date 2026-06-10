import Link from "next/link";
import type { Metadata } from "next";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <main className="forge-glow relative z-10 flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <Brand />
      <p className="font-display text-ember mt-10 text-8xl leading-none tracking-wide">404</p>
      <h1 className="font-display text-ash-100 mt-3 text-3xl tracking-wide uppercase">
        This rep doesn&apos;t exist
      </h1>
      <p className="text-ash-400 mt-2 max-w-sm">
        The page you were looking for couldn&apos;t be found. Let&apos;s get you back under the bar.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/exercises">Browse exercises</Link>
        </Button>
      </div>
    </main>
  );
}
