"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Course, CourseStatus } from "@/types/course";
import { computeProgress, loadCourseState } from "@/lib/progress";
import { ClockIcon, LessonsIcon } from "@/components/ui/Icon";
import styles from "./CourseCard.module.css";

const STATUS_LABEL: Record<CourseStatus, string> = {
  "not-started": "Not started",
  "in-progress": "In Progress",
  completed: "Completed",
};

/**
 * Catalogue card: illustrated cover with a status chip, course info,
 * instructor, meta row, progress bar and a status-aware action button.
 * Client component only because it merges locally-saved progress
 * (localStorage) into the mock progress after mount.
 */
export default function CourseCard({ course }: { course: Course }) {
  const [progress, setProgress] = useState(course.progress);

  useEffect(() => {
    const state = loadCourseState(course.id);
    setProgress(computeProgress(course, state.completedLessonIds));
  }, [course]);

  const status: CourseStatus =
    progress >= 100 ? "completed" : progress > 0 ? "in-progress" : course.status;

  const cta =
    status === "completed" ? "Review" : status === "in-progress" ? "Continue" : "Start";

  const initials = course.instructor
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("");

  return (
    <article className={styles.card}>
      <Link
        href={`/courses/${course.slug}`}
        className={styles.coverLink}
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={course.image}
          alt=""
          width={704}
          height={272}
          className={styles.cover}
        />
        <span className={`${styles.status} ${styles[status]}`}>
          {STATUS_LABEL[status]}
        </span>
      </Link>

      <div className={styles.body}>
        <h2 className={styles.title}>
          <Link href={`/courses/${course.slug}`} className={styles.titleLink}>
            {course.title}
          </Link>
        </h2>

        <p className={styles.description}>{course.shortDescription}</p>

        <p className={styles.instructor}>
          <span className={styles.instructorAvatar} aria-hidden="true">
            {initials}
          </span>
          {course.instructor}
        </p>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <LessonsIcon size={15} /> {course.lessonsCount} lessons
          </span>
          <span className={styles.metaItem}>
            <ClockIcon size={15} /> {course.durationWeeks} weeks
          </span>
          <span className={styles.progressValue}>{progress}%</span>
        </div>

        <div
          className={styles.track}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${course.title} progress`}
        >
          <div className={styles.fill} style={{ width: `${progress}%` }} />
        </div>

        <div className={styles.footer}>
          <Link
            href={`/courses/${course.slug}`}
            className={`${styles.cta} ${styles[`cta-${status}`]}`}
          >
            {cta}
            <span className="sr-only"> — {course.title}</span>
            {status !== "completed" && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            )}
          </Link>
        </div>
      </div>
    </article>
  );
}
