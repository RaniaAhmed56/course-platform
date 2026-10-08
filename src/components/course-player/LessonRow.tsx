"use client";

import type { Lesson } from "@/types/course";
import { getExamMeta } from "@/data/exams";
import { CheckCircleIcon, ClipboardIcon, DocIcon, LockIcon, VideoIcon } from "@/components/ui/Icon";
import styles from "./LessonRow.module.css";

interface LessonRowProps {
  lesson: Lesson;
  isCurrent: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  onSelect: () => void;
}

/**
 * One curriculum row: type icon (video / exam / document) + title on the
 * left; QUESTION / MINUTES
 * badges for exams, padlock for locked lessons, check for completed ones.
 */
export default function LessonRow({
  lesson,
  isCurrent,
  isCompleted,
  isLocked,
  onSelect,
}: LessonRowProps) {
  const stateLabel = isLocked
    ? " (locked)"
    : isCompleted
      ? " (completed)"
      : isCurrent
        ? " (current lesson)"
        : "";

  return (
    <li className={styles.item}>
      <button
        type="button"
        className={`${styles.row} ${isCurrent ? styles.current : ""} ${
          isLocked ? styles.locked : ""
        }`}
        onClick={onSelect}
        aria-current={isCurrent ? "true" : undefined}
      >
        {lesson.type === "video" ? (
          <VideoIcon size={19} className={styles.docIcon} />
        ) : lesson.type === "exam" ? (
          <ClipboardIcon size={19} className={styles.docIcon} />
        ) : (
          <DocIcon size={19} className={styles.docIcon} />
        )}
        <span className={styles.titleWrap}>
          <span className={styles.titleText}>{lesson.title}</span>
          <span className="sr-only">{stateLabel}</span>
        </span>

        {lesson.type === "exam" ? (
          <span className={styles.badges}>
            <span className={`${styles.badge} ${styles.badgeQuestion}`}>
              {getExamMeta(lesson.id).questionCount} question
            </span>
            <span className={`${styles.badge} ${styles.badgeMinutes}`}>
              {getExamMeta(lesson.id).durationMinutes} minutes
            </span>
          </span>
        ) : isCompleted ? (
          <CheckCircleIcon size={19} className={styles.stateIcon + " " + styles.checkIcon} />
        ) : isLocked ? (
          <LockIcon size={19} className={styles.stateIcon} />
        ) : null}
      </button>
    </li>
  );
}
