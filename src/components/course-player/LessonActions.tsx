"use client";

import { CheckCircleIcon } from "@/components/ui/Icon";
import styles from "./LessonActions.module.css";

interface LessonActionsProps {
  hasPrevious: boolean;
  hasNext: boolean;
  isCurrentCompleted: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onMarkCompleted: () => void;
}

/**
 * Quick actions under the player: jump to the previous / next lesson and
 * mark the current one as completed (which moves the course progress).
 */
export default function LessonActions({
  hasPrevious,
  hasNext,
  isCurrentCompleted,
  onPrevious,
  onNext,
  onMarkCompleted,
}: LessonActionsProps) {
  return (
    <div className={styles.row}>
      <button
        type="button"
        className={styles.navBtn}
        onClick={onPrevious}
        disabled={!hasPrevious}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
        Previous lesson
      </button>

      <button
        type="button"
        className={`${styles.completeBtn} ${isCurrentCompleted ? styles.completed : ""}`}
        onClick={onMarkCompleted}
        disabled={isCurrentCompleted}
      >
        <CheckCircleIcon size={16} />
        {isCurrentCompleted ? "Completed" : "Mark as completed"}
      </button>

      <button
        type="button"
        className={styles.navBtn}
        onClick={onNext}
        disabled={!hasNext}
      >
        Next lesson
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
