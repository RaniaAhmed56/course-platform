/** Shared domain types for the mini learning platform. */

export type LessonType = "video" | "pdf" | "exam";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  /** Lesson cannot be opened yet (shows a padlock). */
  locked: boolean;
  /**
   * Optional video source: a direct .mp4 link or a YouTube watch/short URL.
   * When omitted, a bundled sample clip is used.
   */
  videoUrl?: string;
  /** Only for exam lessons — shown as the green "x QUESTION" badge. */
  questionCount?: number;
  /** Only for exam lessons — shown as the pink "x MINUTES" badge. */
  durationMinutes?: number;
}

export interface CurriculumSection {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export type CourseStatus = "not-started" | "in-progress" | "completed";

export interface Course {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  instructor: string;
  image: string;
  category: string;
  durationWeeks: number;
  lessonsCount: number;
  enrolledStudents: number;
  language: string;
  /** Initial progress (0–100) before any local activity is stored. */
  progress: number;
  status: CourseStatus;
  curriculum: CurriculumSection[];
}

export interface CourseComment {
  id: string;
  author: string;
  avatar?: string;
  date: string; // e.g. "Oct 10, 2021"
  body: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  isCurrentUser?: boolean;
}

export interface ExamOption {
  id: string;
  label: string;
}

export interface ExamQuestion {
  id: string;
  prompt: string;
  options: ExamOption[];
  correctOptionId: string;
}

export interface Exam {
  lessonId: string;
  durationMinutes: number;
  questions: ExamQuestion[];
}
