import type { Metadata } from "next";
import { Anton, Archivo } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const display = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const sans = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Forge — Forge your strength",
    template: "%s · Forge",
  },
  description:
    "A gamified strength-training companion for gym beginners. Learn the core lifts, log your workouts, earn Bronze→Platinum medals, keep your streak, and ask an AI coach.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  applicationName: "Forge",
  keywords: ["strength training", "gym", "beginners", "workout log", "medals", "fitness"],
  openGraph: {
    type: "website",
    siteName: "Forge",
    title: "Forge — Forge your strength",
    description:
      "Learn the core lifts, log your workouts, earn Bronze→Platinum medals, keep your streak, and ask an AI coach.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forge — Forge your strength",
    description: "Gamified strength training for gym beginners.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="grain bg-forge-950 text-ash-100 flex min-h-full flex-col">
        <a
          href="#main"
          className="bg-ember text-forge-950 sr-only z-[100] rounded-md px-4 py-2 text-sm font-semibold focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast: "!bg-forge-850 !border-edge-bright !text-ash-100",
            },
          }}
        />
      </body>
    </html>
  );
}
