import type { Course } from "@/types/course";
import { readJSON, writeJSON } from "./storage";

/** Per-course learning state persisted in localStorage. */
export interface CourseLocalState {
  currentLessonId?: string;
  completedLessonIds: string[];
  /** Saved exam progress so a closed exam can be resumed. */
  exam?: {
    lessonId: string;
    questionIndex: number;
    answers: Record<string, string>;
    remainingSeconds: number;
  };
}

const keyFor = (courseId: string) => `course-state:${courseId}`;

export function loadCourseState(courseId: string): CourseLocalState {
  return (
    readJSON<CourseLocalState>("local", keyFor(courseId)) ?? {
      completedLessonIds: [],
    }
  );
}

/**
 * Load the course state and reconcile it with the current curriculum and
 * the course's base progress %, so the percentage shown always matches the
 * check marks in the sidebar:
 * - stale lesson ids (from older data versions) are dropped;
 * - if fewer lessons are marked done than the base progress implies, the
 *   earliest lessons are marked completed until the counts line up.
 * First visit works the same way — it simply seeds from an empty state.
 */
export function loadOrSeedCourseState(course: Course): CourseLocalState {
  const existing = readJSON<CourseLocalState>("local", keyFor(course.id));
  const lessons = flattenLessons(course);
  const validIds = new Set(lessons.map((l) => l.id));

  const completed = (existing?.completedLessonIds ?? []).filter((id) =>
    validIds.has(id)
  );

  const target = Math.round((course.progress / 100) * lessons.length);
  if (completed.length < target) {
    const done = new Set(completed);
    for (const lesson of lessons) {
      if (completed.length >= target) break;
      if (!done.has(lesson.id)) {
        completed.push(lesson.id);
        done.add(lesson.id);
      }
    }
  }

  let currentLessonId = existing?.currentLessonId;
  if (!currentLessonId || !validIds.has(currentLessonId)) {
    const done = new Set(completed);
    const next =
      lessons.find((l) => l.type === "video" && !done.has(l.id)) ??
      lessons.find((l) => l.type === "video");
    currentLessonId = next?.id;
  }

  const state: CourseLocalState = {
    ...existing,
    currentLessonId,
    completedLessonIds: completed,
  };
  writeJSON("local", keyFor(course.id), state);
  return state;
}

export function saveCourseState(courseId: string, state: CourseLocalState): void {
  writeJSON("local", keyFor(courseId), state);
}

/** All lessons of a course, flattened in curriculum order. */
export function flattenLessons(course: Course) {
  return course.curriculum.flatMap((section) => section.lessons);
}

/**
 * Effective progress %: the mock "base" progress, or higher if the student
 * completed more lessons locally.
 */
export function computeProgress(course: Course, completedLessonIds: string[]): number {
  const total = flattenLessons(course).length;
  if (total === 0) return course.progress;
  const localPct = Math.round((completedLessonIds.length / total) * 100);
  return Math.min(100, Math.max(course.progress, localPct));
}
