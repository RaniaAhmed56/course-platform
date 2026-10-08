"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Course } from "@/types/course";
import CourseCard from "./CourseCard";
import styles from "./CourseCatalogue.module.css";

/**
 * Interactive catalogue: category filter chips + course search + card grid.
 * Client component — everything else on the page stays server-rendered.
 * The header search writes `?q=` into the URL; this component stays in
 * sync with it, so both search fields filter the same grid.
 */
export default function CourseCatalogue({ courses }: { courses: Course[] }) {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<string>(
    () => searchParams.get("cat") ?? "All Courses"
  );
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");

  /* Follow the header search / URL (?q=...) and category links (?cat=...) */
  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
    const cat = searchParams.get("cat");
    if (cat) setCategory(cat);
  }, [searchParams]);

  const categories = useMemo(() => {
    const preferred = ["Development", "Design", "Data Science", "Marketing", "Language", "Creative"];
    const present = Array.from(new Set(courses.map((c) => c.category)));
    present.sort((a, b) => preferred.indexOf(a) - preferred.indexOf(b));
    return ["All Courses", ...present];
  }, [courses]);

  const visible = courses.filter((course) => {
    const inCategory = category === "All Courses" || course.category === category;
    const q = query.trim().toLowerCase();
    const inQuery =
      q.length === 0 ||
      course.title.toLowerCase().includes(q) ||
      course.instructor.toLowerCase().includes(q);
    return inCategory && inQuery;
  });

  return (
    <section className="container" aria-label="Course list">
      <div className={styles.toolbar}>
        <div className={styles.chips} role="group" aria-label="Filter by category">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`${styles.chip} ${category === item ? styles.chipActive : ""}`}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className={styles.search}>
          <svg
            className={styles.searchIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <label htmlFor="course-search" className="sr-only">
            Search for a course
          </label>
          <input
            id="course-search"
            type="search"
            dir="auto"
            className={styles.searchInput}
            placeholder="Search for a course..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <p className={styles.empty} role="status">
          No courses match your search — try a different keyword or category.
        </p>
      ) : (
        <ul className={styles.grid} key={category}>
          {visible.map((course, index) => (
            <li
              key={course.id}
              className={`${styles.cell} ${styles.cellEnter}`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <CourseCard course={course} />
            </li>
          ))}
          <li
            className={`${styles.cell} ${styles.cellEnter}`}
            style={{ animationDelay: `${visible.length * 60}ms` }}
            aria-hidden="true"
          >
            <div className={styles.comingSoon}>
              <span className={styles.comingSoonIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
              <p className={styles.comingSoonTitle}>More courses coming soon</p>
              <p className={styles.comingSoonText}>
                We&apos;re always adding new and exciting courses to help you
                grow your skills.
              </p>
              <svg className={styles.squiggle} width="54" height="14" viewBox="0 0 54 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M2 10c6-8 10 4 16-2s9-6 15 0 11 2 19-4" />
              </svg>
            </div>
          </li>
        </ul>
      )}
    </section>
  );
}
