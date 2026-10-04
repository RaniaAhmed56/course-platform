"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CourseProgressBar.module.css";

interface CourseProgressBarProps {
  /** 0 – 100 */
  value: number;
  /** Show the "You" marker + percentage label (course player sidebar). */
  withMarker?: boolean;
  /** Animate the fill the first time the bar scrolls into view. */
  animateOnView?: boolean;
  className?: string;
}

/**
 * Progress bar used in the player sidebar (with the "You" marker, animating
 * when it scrolls into view — as requested in the design notes) and in the
 * course cards (plain variant).
 */
export default function CourseProgressBar({
  value,
  withMarker = false,
  animateOnView = false,
  className,
}: CourseProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(!animateOnView);

  useEffect(() => {
    if (!animateOnView) return;
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [animateOnView]);

  const shown = visible ? clamped : 0;

  return (
    <div ref={rootRef} className={`${styles.root} ${className ?? ""}`}>
      {withMarker && (
        <div
          className={styles.marker}
          style={{ left: `clamp(17px, ${shown}%, calc(100% - 17px))` }}
          aria-hidden="true"
        >
          <span className={styles.markerBubble}>You</span>
          <span className={styles.markerArrow} />
        </div>
      )}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Course progress"
      >
        <div className={styles.fill} style={{ width: `${shown}%` }} />
      </div>
      {withMarker && (
        <div className={styles.pctRow} aria-hidden="true">
          <span
            className={styles.pct}
            style={{ left: `clamp(40px, ${shown}%, 100%)` }}
          >
            {clamped}%
          </span>
        </div>
      )}
    </div>
  );
}
