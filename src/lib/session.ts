"use client";

/**
 * Minimal mock "authentication": the welcome screen lets the visitor enter
 * as a guest, which sets a flag; signing out clears everything and returns
 * to the welcome screen. No real credentials are involved by design.
 */

const GUEST_KEY = "itlegend:guest-session";

/** Demo identity used across the UI once the visitor enters. */
export const GUEST_USER = {
  name: "Rania",
  initial: "R",
  role: "Student",
};

export function isGuest(): boolean {
  try {
    return window.localStorage.getItem(GUEST_KEY) === "1";
  } catch {
    return true; // storage unavailable → never lock the visitor out
  }
}

export function enterAsGuest(): void {
  try {
    window.localStorage.setItem(GUEST_KEY, "1");
  } catch {
    /* storage unavailable */
  }
}

/** Clear the guest session and all locally saved learning data. */
export function signOut(): void {
  try {
    window.localStorage.clear();
    window.sessionStorage.clear();
  } catch {
    /* storage unavailable */
  }
}
