"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Course } from "@/types/course";
import { computeProgress, flattenLessons, loadCourseState } from "@/lib/progress";
import { GUEST_USER } from "@/lib/session";
import CourseCard from "@/components/courses/CourseCard";
import { ArrowRightIcon, CheckCircleIcon, ClockIcon, LessonsIcon } from "@/components/ui/Icon";
import styles from "./HomeDashboard.module.css";

interface Stats {
  inProgress: number;
  completed: number;
  lessonsDone: number;
}

function computeStats(courses: Course[]): Stats {
  let inProgress = 0;
  let completed = 0;
  let lessonsDone = 0;
  for (const course of courses) {
    const state = loadCourseState(course.id);
    const progress = computeProgress(course, state.completedLessonIds);
    const total = flattenLessons(course).length;
    lessonsDone += Math.max(
      state.completedLessonIds.length,
      Math.round((progress / 100) * total)
    );
    if (progress >= 100) completed += 1;
    else if (progress > 0) inProgress += 1;
  }
  return { inProgress, completed, lessonsDone };
}

/**
 * Home dashboard: welcome band with live learning stats, a "Continue
 * learning" rail with the in-progress courses, and category shortcuts
 * into the catalogue.
 */
export default function HomeDashboard({ courses }: { courses: Course[] }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [progressById, setProgressById] = useState<Record<string, number>>({});

  useEffect(() => {
    setStats(computeStats(courses));
    const byId: Record<string, number> = {};
    for (const course of courses) {
      byId[course.id] = computeProgress(
        course,
        loadCourseState(course.id).completedLessonIds
      );
    }
    setProgressById(byId);
  }, [courses]);

  const progressOf = (course: Course) => progressById[course.id] ?? course.progress;

  const continueCourses = courses
    .filter((course) => {
      const p = progressOf(course);
      return p > 0 && p < 100;
    })
    .sort((a, b) => progressOf(b) - progressOf(a))
    .slice(0, 3);

  const categories = Array.from(new Set(courses.map((c) => c.category)));

  const statItems = [
    {
      label: "Courses in progress",
      value: stats?.inProgress,
      icon: <ClockIcon size={21} />,
      tint: styles.tintBlue,
    },
    {
      label: "Courses completed",
      value: stats?.completed,
      icon: <CheckCircleIcon size={21} />,
      tint: styles.tintGreen,
    },
    {
      label: "Lessons completed",
      value: stats?.lessonsDone,
      icon: <LessonsIcon size={21} />,
      tint: styles.tintPink,
    },
  ];

  return (
    <>
      {/* ----- welcome band ----- */}
      <section className={styles.hero}>
        <Image
          src="/images/hero-art.avif"
          alt=""
          width={1228}
          height={342}
          priority
          className={styles.art}
        />
        <div className={`container ${styles.heroInner}`}>
          <div>
            <p className={styles.eyebrow}>Your Dashboard</p>
            <h1 className={styles.title}>
              Welcome back, {GUEST_USER.name}{" "}
              <span aria-hidden="true">👋</span>
            </h1>
            <p className={styles.subtitle}>
              Pick up right where you left off — your lessons, exams and
              progress are waiting for you.
            </p>
            <div className={styles.statsRow}>
              {statItems.map((item) => (
                <div key={item.label} className={styles.statCard}>
                  <span className={`${styles.statIcon} ${item.tint}`}>{item.icon}</span>
                  <span>
                    <span className={styles.statValue}>
                      {item.value ?? "–"}
                    </span>
                    <span className={styles.statLabel}>{item.label}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ----- continue learning ----- */}
      <section className={`container ${styles.section}`} aria-labelledby="continue-title">
        <div className={styles.sectionHead}>
          <h2 id="continue-title" className={styles.sectionTitle}>
            Continue Learning
          </h2>
          <Link href="/courses" className={styles.sectionLink}>
            View all courses
            <ArrowRightIcon size={15} />
          </Link>
        </div>

        {continueCourses.length === 0 ? (
          <div className={styles.emptyCard}>
            <p>You have no courses in progress yet — pick one to get started!</p>
            <Link href="/courses" className={styles.emptyCta}>
              Browse courses
              <ArrowRightIcon size={15} />
            </Link>
          </div>
        ) : (
          <ul className={styles.grid}>
            {continueCourses.map((course) => (
              <li key={course.id} className={styles.cell}>
                <CourseCard course={course} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ----- explore categories ----- */}
      <section className={`container ${styles.section}`} aria-labelledby="explore-title">
        <div className={styles.sectionHead}>
          <h2 id="explore-title" className={styles.sectionTitle}>
            Explore by Category
          </h2>
        </div>
        <div className={styles.categoryRow}>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/courses?cat=${encodeURIComponent(category)}`}
              className={styles.categoryChip}
            >
              {category}
              <span className={styles.categoryCount}>
                {courses.filter((c) => c.category === category).length}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ----- bottom CTA ----- */}
      <section className="container">
        <div className={styles.ctaBand}>
          <div>
            <h2 className={styles.ctaTitle}>Ready for something new?</h2>
            <p className={styles.ctaText}>
              Browse the full catalogue and start a new learning journey today.
            </p>
          </div>
          <Link href="/courses" className={styles.ctaBtn}>
            Browse all courses
            <ArrowRightIcon size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
