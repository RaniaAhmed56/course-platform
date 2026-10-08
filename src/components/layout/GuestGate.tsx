"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isGuest } from "@/lib/session";

/**
 * Mock auth guard: every page except the welcome screen requires the
 * visitor to have entered as a guest. Signing out clears the flag, so the
 * next navigation lands back on the welcome screen.
 */
export default function GuestGate() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== "/" && !isGuest()) {
      router.replace("/");
    }
  }, [pathname, router]);

  return null;
}
