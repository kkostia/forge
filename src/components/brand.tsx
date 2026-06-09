import Link from "next/link";
import { cn } from "@/lib/utils";

/** Forge wordmark: a forged anvil mark + condensed type with an ember spark. */
export function Brand({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2", className)}
      aria-label="Forge — home"
    >
      <span className="bg-ember text-forge-950 relative grid size-8 place-items-center rounded-md shadow-[0_2px_10px_-2px_var(--color-ember)] transition-transform group-hover:-translate-y-px">
        <svg viewBox="0 0 64 64" className="size-5" fill="currentColor" aria-hidden>
          <path d="M14 22h28c0 6-5 9-11 9h-1l9 13H25l9-13c-9 0-20-2-20-9z" />
          <rect x="20" y="50" width="24" height="5" rx="1.5" />
        </svg>
      </span>
      <span className="font-display text-ash-100 text-2xl leading-none tracking-wide uppercase">
        For<span className="ember-text">ge</span>
      </span>
    </Link>
  );
}
