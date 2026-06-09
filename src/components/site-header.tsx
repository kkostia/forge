import Link from "next/link";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const NAV_LINKS = [
  { href: "/exercises", label: "Exercises" },
  { href: "/#how", label: "How it works" },
  { href: "/#medals", label: "Medals" },
];

/** Public marketing header. The authenticated /app area has its own nav. */
export function SiteHeader() {
  return (
    <header className="border-edge/70 bg-forge-950/80 sticky top-0 z-40 border-b backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Brand />
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-ash-400 hover:text-ash-100 text-sm font-medium transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Start training</Link>
          </Button>
        </div>
      </Container>
    </header>
  );
}
