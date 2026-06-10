"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="forge-glow relative z-10 flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <Brand />
      <h1 className="font-display text-ash-100 mt-10 text-4xl tracking-wide uppercase">
        A plate slipped
      </h1>
      <p className="text-ash-400 mt-2 max-w-sm">
        Something went wrong on our end. Re-rack and try again — if it keeps happening, come back in
        a bit.
      </p>
      <Button onClick={reset} className="mt-8">
        <RotateCcw /> Try again
      </Button>
    </main>
  );
}
