"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { enterAsGuest } from "@/lib/session";
import styles from "./welcome.module.css";

/**
 * Welcome screen — the entry point of the site. It stands in for an
 * authentication page: one tall screen with a single "Continue as Guest"
 * action (no credentials by design). Signing out anywhere in the app
 * returns here.
 */
export default function WelcomePage() {
  const router = useRouter();

  const enter = () => {
    enterAsGuest();
    router.push("/home");
  };

  return (
    <main className={styles.screen}>
      <div className={styles.glowA} aria-hidden="true" />
      <div className={styles.glowB} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.logo}>
          <svg width="46" height="46" viewBox="0 0 30 30" fill="none" aria-hidden="true">
            <path d="M6 9.5 17 4l7 3.5-11 5.5z" fill="#4164da" />
            <path d="M6 15.5 17 10l7 3.5-11 5.5z" fill="#4164da" opacity="0.78" />
            <path d="M6 21.5 17 16l7 3.5-11 5.5z" fill="#4164da" opacity="0.55" />
          </svg>
          <span className={styles.logoText}>ITLegend</span>
        </div>

        <p className={styles.eyebrow}>
          Learn <span aria-hidden="true">·</span> Grow{" "}
          <span aria-hidden="true">·</span> Build
        </p>
        <h1 className={styles.title}>
          Your learning journey
          <br />
          starts here
        </h1>
        <p className={styles.subtitle}>
          Courses, a real course player, exams and progress tracking — all in
          one place. No account needed: jump straight in and your progress is
          saved on this device as you learn.
        </p>

        <button type="button" className={styles.cta} onClick={enter}>
          Continue as Guest
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12h15M13 6l6 6-6 6" />
          </svg>
        </button>
        <p className={styles.note}>Free to explore — no sign-up, no password.</p>

        <div className={styles.artWrap}>
          <Image
            src="/images/hero-art.avif"
            alt=""
            width={1228}
            height={342}
            priority
            className={styles.art}
          />
        </div>
      </div>
    </main>
  );
}
