"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GUEST_USER, signOut } from "@/lib/session";
import styles from "./SiteHeader.module.css";

/**
 * Top navigation bar for the catalogue (ITLegend).
 * The search button expands into a live search field (synced with the
 * catalogue via the `?q=` URL param), and the notifications / account
 * buttons open real dropdown menus.
 */
export default function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifSeen, setNotifSeen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  /* Keep the header field in sync with the URL (?q=...) */
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setQuery(q);
    if (q) setSearchOpen(true);
  }, [searchParams]);

  /* Focus the field whenever the search opens */
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  /* Close dropdowns on outside click / Escape */
  useEffect(() => {
    if (!notifOpen && !userOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!actionsRef.current?.contains(event.target as Node)) {
        setNotifOpen(false);
        setUserOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNotifOpen(false);
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [notifOpen, userOpen]);

  /** Push the query into the URL so the catalogue filters live. */
  const applyQuery = (value: string) => {
    setQuery(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    const target = `/courses${params.toString() ? `?${params.toString()}` : ""}`;
    if (pathname === "/courses") {
      router.replace(target, { scroll: false });
    } else {
      router.push(target);
    }
  };

  const toggleSearch = () => {
    if (searchOpen) {
      if (query) applyQuery("");
      setSearchOpen(false);
    } else {
      setSearchOpen(true);
    }
  };

  const notifications = [
    { id: "n1", text: "New lesson added to “Starting SEO as your Home”.", time: "2h ago" },
    { id: "n2", text: "Your question was answered in React in Practice.", time: "1d ago" },
    { id: "n3", text: "You earned a certificate: JavaScript Essentials.", time: "3d ago" },
  ];

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
          <Link
            href="/home"
            className={`${styles.navItem} ${pathname === "/home" ? styles.active : ""}`}
            aria-current={pathname === "/home" ? "page" : undefined}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 11 12 4l8 7v9h-5v-6h-6v6H4z" />
            </svg>
            Home
          </Link>
          <Link
            href="/courses"
            className={`${styles.navItem} ${pathname.startsWith("/courses") ? styles.active : ""}`}
            aria-current={pathname.startsWith("/courses") ? "page" : undefined}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {/* graduation cap */}
              <path d="M12 4.5 2.5 9.3 12 14l9.5-4.7z" />
              <path d="M6.3 11.8v4.1c0 1.5 2.6 2.9 5.7 2.9s5.7-1.4 5.7-2.9v-4.1" />
              <path d="M21.5 9.6v4.6" />
            </svg>
            Courses
          </Link>
          <Link
            href="/library"
            className={`${styles.navItem} ${pathname === "/library" ? styles.active : ""}`}
            aria-current={pathname === "/library" ? "page" : undefined}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 4h4v16H5zM11 4h4v16h-4zM17.5 5 21 19l-3.8 1L14 6z" />
            </svg>
            Library
          </Link>
        </nav>

        <div className={styles.actions} ref={actionsRef}>
          <div className={`${styles.headerSearch} ${searchOpen ? styles.headerSearchOpen : ""}`}>
            <label htmlFor="header-search" className="sr-only">
              Search for a course
            </label>
            <input
              id="header-search"
              ref={searchInputRef}
              type="search"
              dir="auto"
              className={styles.headerSearchInput}
              placeholder="Search courses..."
              value={query}
              onChange={(event) => applyQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") toggleSearch();
              }}
              tabIndex={searchOpen ? 0 : -1}
            />
          </div>

          <button
            type="button"
            className={`${styles.iconBtn} ${searchOpen ? styles.iconBtnActive : ""}`}
            aria-label={searchOpen ? "Close search" : "Search"}
            aria-expanded={searchOpen}
            onClick={toggleSearch}
          >
            {searchOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            )}
          </button>

          <div className={styles.menuWrap}>
            <button
              type="button"
              className={styles.iconBtn}
              aria-label={notifSeen ? "Notifications" : "Notifications (3 new)"}
              aria-expanded={notifOpen}
              onClick={() => {
                setUserOpen(false);
                setNotifOpen((open) => !open);
                setNotifSeen(true);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 9.5A6 6 0 0 1 18 9.5c0 5 2 6.5 2 6.5H4s2-1.5 2-6.5" />
                <path d="M10 19.5a2.2 2.2 0 0 0 4 0" />
              </svg>
              {!notifSeen && <span className={styles.badgeDot} aria-hidden="true" />}
            </button>

            {notifOpen && (
              <div className={styles.dropdown} role="menu" aria-label="Notifications">
                <p className={styles.dropdownTitle}>Notifications</p>
                <ul className={styles.notifList}>
                  {notifications.map((item) => (
                    <li key={item.id} className={styles.notifItem}>
                      <span className={styles.notifDot} aria-hidden="true" />
                      <span>
                        <span className={styles.notifText}>{item.text}</span>
                        <span className={styles.notifTime}>{item.time}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className={styles.menuWrap}>
            <button
              type="button"
              className={styles.user}
              aria-label="Account menu"
              aria-expanded={userOpen}
              onClick={() => {
                setNotifOpen(false);
                setUserOpen((open) => !open);
              }}
            >
              <span className={styles.avatar} aria-hidden="true">{GUEST_USER.initial}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {userOpen && (
              <div className={`${styles.dropdown} ${styles.userDropdown}`} role="menu" aria-label="Account">
                <div className={styles.userInfo}>
                  <span className={styles.avatar} aria-hidden="true">{GUEST_USER.initial}</span>
                  <span>
                    <span className={styles.userName}>{GUEST_USER.name}</span>
                    <span className={styles.userRole}>{GUEST_USER.role}</span>
                  </span>
                </div>
                <Link href="/courses" className={styles.dropdownItem} onClick={() => setUserOpen(false)}>
                  My Courses
                </Link>
                <Link href="/library" className={styles.dropdownItem} onClick={() => setUserOpen(false)}>
                  My Library
                </Link>
                <button
                  type="button"
                  className={`${styles.dropdownItem} ${styles.signOut}`}
                  onClick={() => {
                    setUserOpen(false);
                    signOut();
                    window.location.href = "/";
                  }}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
