"use client";

import { useState } from "react";
import type { Course, Lesson } from "@/types/course";
import CourseProgressBar from "@/components/ui/CourseProgressBar";
import { MinusIcon, PlusIcon } from "@/components/ui/Icon";
import LessonRow from "./LessonRow";
import styles from "./Curriculum.module.css";

interface CurriculumProps {
  course: Course;
  progress: number;
  currentLessonId?: string;
  completedIds: string[];
  isUnlocked: (lesson: Lesson) => boolean;
  onSelectLesson: (lesson: Lesson) => void;
}

/**
 * "Topics for This Course" — progress bar with the "You" marker plus the
 * week/section cards. Sections collapse like an accordion on mobile
 * (always expanded on desktop, as in the reference).
 */
export default function Curriculum({
  course,
  progress,
  currentLessonId,
  completedIds,
  isUnlocked,
  onSelectLesson,
}: CurriculumProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(
    () => new Set(course.curriculum.slice(1).map((section) => section.id))
  );

  const toggle = (sectionId: string) => {
    setCollapsed((previous) => {
      const next = new Set(previous);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  return (
    <div className={styles.root}>
      <h2 className={styles.title}>Topics for This Course</h2>

      <div className={styles.progressWrap}>
        <CourseProgressBar value={progress} withMarker animateOnView />
      </div>

      <div className={styles.sections}>
        {course.curriculum.map((section) => {
          const isCollapsed = collapsed.has(section.id);
          return (
            <section key={section.id} className={styles.sectionCard}>
              <header className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>{section.title}</h3>
                <button
                  type="button"
                  className={styles.toggle}
                  onClick={() => toggle(section.id)}
                  aria-expanded={!isCollapsed}
                  aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${section.title}`}
                >
                  {isCollapsed ? <PlusIcon size={16} /> : <MinusIcon size={16} />}
                </button>
              </header>

              <div
                className={`${styles.sectionBody} ${isCollapsed ? styles.collapsed : ""}`}
              >
                <p className={styles.sectionDescription}>{section.description}</p>

                <ul className={styles.lessonList}>
                  {section.lessons.map((lesson) => (
                    <LessonRow
                      key={lesson.id}
                      lesson={lesson}
                      isCurrent={lesson.id === currentLessonId}
                      isCompleted={completedIds.includes(lesson.id)}
                      isLocked={!isUnlocked(lesson)}
                      onSelect={() => onSelectLesson(lesson)}
                    />
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
