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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="grain bg-forge-950 text-ash-100 flex min-h-full flex-col">
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
