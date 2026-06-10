import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Brand } from "@/components/brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="forge-glow relative z-10 flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <Link
        href="/"
        className="text-ash-400 hover:text-ash-100 absolute top-5 left-5 inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" /> Home
      </Link>
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Brand />
        </div>
        {children}
      </div>
    </main>
  );
}
