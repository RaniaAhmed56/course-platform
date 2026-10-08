import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import GuestGate from "@/components/layout/GuestGate";
import "./globals.css";

/* Self-hosted fonts (woff2, latin subset) — no external font requests. */
const spartan = localFont({
  src: [
    { path: "../fonts/league-spartan-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/league-spartan-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/league-spartan-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-spartan",
  display: "swap",
});

const quicksand = localFont({
  src: [
    { path: "../fonts/quicksand-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/quicksand-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/quicksand-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/quicksand-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EduPlatform — Online Courses",
    template: "%s | EduPlatform",
  },
  description:
    "A mini learning platform: browse courses and learn inside a full course player.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spartan.variable} ${quicksand.variable}`}>
      <body>
        <Suspense>
          <GuestGate />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
