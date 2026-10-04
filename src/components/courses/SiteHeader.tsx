import Link from "next/link";
import styles from "./SiteHeader.module.css";

/** Top navigation bar for the catalogue (ITLegend). */
export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/courses" className={styles.logo} aria-label="ITLegend home">
          <svg
            className={styles.logoMark}
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            aria-hidden="true"
          >
            <path d="M6 9.5 17 4l7 3.5-11 5.5z" fill="#4164da" />
            <path d="M6 15.5 17 10l7 3.5-11 5.5z" fill="#4164da" opacity="0.78" />
            <path d="M6 21.5 17 16l7 3.5-11 5.5z" fill="#4164da" opacity="0.55" />
          </svg>
          <span className={styles.logoText}>ITLegend</span>
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          <Link href="/courses" className={styles.navItem}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 11 12 4l8 7v9h-5v-6h-6v6H4z" />
            </svg>
            Home
          </Link>
          <Link href="/courses" className={`${styles.navItem} ${styles.active}`} aria-current="page">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 5h7v14H4zM13 5h7v14h-7z" />
            </svg>
            Courses
          </Link>
          <Link href="/courses" className={styles.navItem}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 4h4v16H5zM11 4h4v16h-4zM17.5 5 21 19l-3.8 1L14 6z" />
            </svg>
            Library
          </Link>
        </nav>

        <div className={styles.actions}>
          <button type="button" className={styles.iconBtn} aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
          <button type="button" className={styles.iconBtn} aria-label="Notifications (1 new)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9.5A6 6 0 0 1 18 9.5c0 5 2 6.5 2 6.5H4s2-1.5 2-6.5" />
              <path d="M10 19.5a2.2 2.2 0 0 0 4 0" />
            </svg>
            <span className={styles.badgeDot} aria-hidden="true" />
          </button>
          <button type="button" className={styles.user} aria-label="Account menu">
            <span className={styles.avatar} aria-hidden="true">F</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
