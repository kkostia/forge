import Link from "next/link";
import { Brand } from "@/components/brand";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer className="border-edge/70 bg-forge-950 relative z-10 mt-auto border-t">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Brand />
          <p className="text-ash-500 max-w-xs text-sm">
            Forge your strength — one logged set at a time.
          </p>
        </div>
        <nav className="text-ash-400 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <Link href="/exercises" className="hover:text-ash-100">
            Exercise library
          </Link>
          <Link href="/#how" className="hover:text-ash-100">
            How it works
          </Link>
          <Link href="/login" className="hover:text-ash-100">
            Log in
          </Link>
          <Link href="/signup" className="hover:text-ash-100">
            Get started
          </Link>
        </nav>
      </Container>
      <Container className="border-edge/50 border-t py-5">
        <p className="text-ash-500 text-xs">
          © {new Date().getFullYear()} Forge. A portfolio project — train responsibly.
        </p>
      </Container>
    </footer>
  );
}
