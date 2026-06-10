"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dumbbell,
  LayoutDashboard,
  LineChart,
  LogOut,
  Medal as MedalIcon,
  Menu,
  MessageCircle,
  NotebookPen,
  X,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { Container } from "@/components/ui/container";
import { StreakFlame } from "@/components/streak/streak-flame";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/app/(auth)/actions";

const NAV = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/app/log", label: "Log", icon: NotebookPen },
  { href: "/app/progress", label: "Progress", icon: LineChart },
  { href: "/app/medals", label: "Medals", icon: MedalIcon },
  { href: "/app/coach", label: "Coach", icon: MessageCircle },
  { href: "/exercises", label: "Exercises", icon: Dumbbell },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
}

export function AppShell({
  children,
  name,
  email,
  streak,
}: {
  children: React.ReactNode;
  name: string | null;
  email: string;
  streak: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <header className="border-edge/70 bg-forge-950/85 sticky top-0 z-40 border-b backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Brand href="/app" />
            <nav className="hidden items-center gap-1 lg:flex">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive(pathname, item.href, item.exact)
                      ? "bg-forge-800 text-ash-100"
                      : "text-ash-400 hover:bg-forge-850 hover:text-ash-100",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <StreakFlame count={streak} />
            <div className="hidden items-center gap-3 sm:flex">
              <span className="text-ash-400 max-w-[12rem] truncate text-sm" title={email}>
                {name || email}
              </span>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="text-ash-400 hover:bg-forge-800 hover:text-ash-100 inline-flex size-9 items-center justify-center rounded-md transition-colors"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <LogOut className="size-4" />
                </button>
              </form>
            </div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="text-ash-300 hover:bg-forge-800 inline-flex size-9 items-center justify-center rounded-md lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </Container>

        {open && (
          <nav className="border-edge/70 bg-forge-950 border-t lg:hidden">
            <Container className="grid gap-1 py-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(pathname, item.href, item.exact)
                      ? "bg-forge-800 text-ash-100"
                      : "text-ash-300 hover:bg-forge-850",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
              <form action={signOutAction} className="border-edge/70 mt-1 border-t pt-2">
                <button
                  type="submit"
                  className="text-ash-300 hover:bg-forge-850 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium"
                >
                  <LogOut className="size-4" /> Sign out
                </button>
              </form>
            </Container>
          </nav>
        )}
      </header>

      <main className="flex-1 py-8">{children}</main>
    </div>
  );
}
