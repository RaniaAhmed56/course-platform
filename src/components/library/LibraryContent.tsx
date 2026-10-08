"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Course } from "@/types/course";
import { computeProgress, loadCourseState } from "@/lib/progress";
import PageBand from "@/components/layout/PageBand";
import { ArrowRightIcon, CheckCircleIcon, DocIcon } from "@/components/ui/Icon";
import styles from "./LibraryContent.module.css";

/**
 * Library: every course's reading material (the PDF reference files) with
 * a built-in preview + download, and a shelf of completed courses.
 */
export default function LibraryContent({ courses }: { courses: Course[] }) {
  const [progressById, setProgressById] = useState<Record<string, number>>({});
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);

  useEffect(() => {
    const byId: Record<string, number> = {};
    for (const course of courses) {
      byId[course.id] = computeProgress(
        course,
        loadCourseState(course.id).completedLessonIds
      );
    }
    setProgressById(byId);
  }, [courses]);

  /* Close the PDF preview on Escape */
  useEffect(() => {
    if (!previewCourse) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreviewCourse(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [previewCourse]);

  const progressOf = (course: Course) => progressById[course.id] ?? course.progress;
  const completedCourses = courses.filter((course) => progressOf(course) >= 100);

  return (
    <>
      <PageBand
        title="My Library"
        crumbs={[
          { label: "Home", href: "/home" },
          { label: "Library" },
        ]}
      />

      <section className={`container ${styles.section}`} aria-labelledby="materials-lib-title">
        <div className={styles.sectionHead}>
          <h2 id="materials-lib-title" className={styles.sectionTitle}>
            Course Materials
          </h2>
          <p className={styles.sectionHint}>
            Reading files and exercises from your courses — preview them here
            or download them as PDF.
          </p>
        </div>

        <ul className={styles.grid}>
          {courses.map((course) => (
            <li key={course.id} className={styles.card}>
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
              </Link>
              <div className={styles.cardBody}>
                <p className={styles.kicker}>
                  <DocIcon size={15} /> PDF · {course.category}
                </p>
                <h3 className={styles.cardTitle}>
                  <Link href={`/courses/${course.slug}`} className={styles.cardTitleLink}>
                    {course.title}
                  </Link>
                </h3>
                <p className={styles.cardMeta}>
                  Course exercise &amp; reference files
                </p>
                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.openBtn}
                    onClick={() => setPreviewCourse(course)}
                  >
                    Preview
                  </button>
                  <a
                    href={`/materials/${course.id}.pdf`}
                    download={`${course.slug}-materials.pdf`}
                    className={styles.downloadBtn}
                  >
                    Download
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={`container ${styles.section} ${styles.lastSection}`} aria-labelledby="completed-lib-title">
        <div className={styles.sectionHead}>
          <h2 id="completed-lib-title" className={styles.sectionTitle}>
            Completed Courses
          </h2>
        </div>

        {completedCourses.length === 0 ? (
          <div className={styles.emptyCard}>
            <p>Nothing completed yet — finish a course and it will appear here.</p>
            <Link href="/courses" className={styles.emptyCta}>
              Go to my courses
              <ArrowRightIcon size={15} />
            </Link>
          </div>
        ) : (
          <ul className={styles.completedList}>
            {completedCourses.map((course) => (
              <li key={course.id} className={styles.completedRow}>
                <span className={styles.completedIcon} aria-hidden="true">
                  <CheckCircleIcon size={21} />
                </span>
                <span className={styles.completedInfo}>
                  <span className={styles.completedTitle}>{course.title}</span>
                  <span className={styles.completedMeta}>
                    {course.lessonsCount} lessons · {course.instructor}
                  </span>
                </span>
                <Link href={`/courses/${course.slug}`} className={styles.reviewBtn}>
                  Review course
                  <ArrowRightIcon size={14} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ----- PDF preview overlay ----- */}
      {previewCourse && (
        <div
          className={styles.previewBackdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPreviewCourse(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`PDF preview: ${previewCourse.title}`}
            className={styles.previewPanel}
          >
            <header className={styles.previewHeader}>
              <h3 className={styles.previewTitle}>{previewCourse.title}</h3>
              <button
                type="button"
                className={styles.previewClose}
                onClick={() => setPreviewCourse(null)}
                aria-label="Close preview"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </header>
            <iframe
              className={styles.previewFrame}
              src={`/materials/${previewCourse.id}.pdf`}
              title={`PDF: ${previewCourse.title}`}
            />
          </div>
        </div>
      )}
    </>
  );
}
