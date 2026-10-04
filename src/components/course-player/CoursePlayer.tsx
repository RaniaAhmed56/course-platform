"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Course, Lesson } from "@/types/course";
import PageBand from "@/components/layout/PageBand";
import {
  computeProgress,
  flattenLessons,
  loadCourseState,
  loadOrSeedCourseState,
  saveCourseState,
  type CourseLocalState,
} from "@/lib/progress";
import VideoPlayer from "./VideoPlayer";
import LessonActions from "./LessonActions";
import SectionIconsRow from "./SectionIconsRow";
import CourseMaterials from "./CourseMaterials";
import Curriculum from "./Curriculum";
import CommentsSection, { CommentsSubmitButton } from "./CommentsSection";
import LeaderboardModal from "./modals/LeaderboardModal";
import AskQuestionModal from "./modals/AskQuestionModal";
import PdfModal from "./modals/PdfModal";
import ExamModal from "./modals/ExamModal";
import Toast from "./Toast";
import styles from "./CoursePlayer.module.css";

type OpenModal = "leaderboard" | "ask" | "pdf" | "exam" | null;

/**
 * Interactive course player. Owns the learning state (current lesson,
 * completed lessons, modals) and persists it per-course in localStorage.
 */
export default function CoursePlayer({ course }: { course: Course }) {
  const lessons = useMemo(() => flattenLessons(course), [course]);
  const firstPlayable = lessons.find((lesson) => !lesson.locked && lesson.type === "video");

  const [currentLessonId, setCurrentLessonId] = useState<string | undefined>(
    firstPlayable?.id
  );
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState<OpenModal>(null);
  const [modalLesson, setModalLesson] = useState<Lesson | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [wide, setWide] = useState(false);
  const hydrated = useRef(false);

  /* ----- hydrate persisted state after mount (seeded from the course's
         mock progress on the first visit) ----- */
  useEffect(() => {
    const stored = loadOrSeedCourseState(course);
    if (stored.currentLessonId && lessons.some((l) => l.id === stored.currentLessonId)) {
      setCurrentLessonId(stored.currentLessonId);
    }
    setCompletedIds(stored.completedLessonIds);
    hydrated.current = true;
  }, [course, lessons]);

  /* ----- persist on change ----- */
  const persist = useCallback(
    (patch: Partial<CourseLocalState>) => {
      const stored = loadCourseState(course.id);
      saveCourseState(course.id, { ...stored, ...patch });
    },
    [course.id]
  );

  useEffect(() => {
    if (!hydrated.current) return;
    persist({ currentLessonId, completedLessonIds: completedIds });
  }, [currentLessonId, completedIds, persist]);

  const progress = computeProgress(course, completedIds);
  const currentLesson = lessons.find((lesson) => lesson.id === currentLessonId);
  const currentIndex = currentLesson
    ? lessons.findIndex((l) => l.id === currentLesson.id)
    : -1;

  /* ----- lock logic: a lesson opens if its data allows it, if the previous
         lesson is completed, or if it was already completed locally ----- */
  const isUnlocked = useCallback(
    (lesson: Lesson) => {
      if (!lesson.locked) return true;
      if (completedIds.includes(lesson.id)) return true;
      const index = lessons.findIndex((l) => l.id === lesson.id);
      const previous = lessons[index - 1];
      return previous ? completedIds.includes(previous.id) : true;
    },
    [lessons, completedIds]
  );

  const markCompleted = useCallback((lessonId: string) => {
    setCompletedIds((ids) => (ids.includes(lessonId) ? ids : [...ids, lessonId]));
  }, []);

  const selectLesson = useCallback(
    (lesson: Lesson) => {
      if (!isUnlocked(lesson)) {
        setToast("This lesson is locked — complete the previous lessons first.");
        return;
      }
      if (lesson.type === "exam") {
        setModalLesson(lesson);
        setOpenModal("exam");
        return;
      }
      if (lesson.type === "pdf") {
        setModalLesson(lesson);
        setOpenModal("pdf");
        markCompleted(lesson.id);
        return;
      }
      setCurrentLessonId(lesson.id);
    },
    [isUnlocked, markCompleted]
  );

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const closeModal = useCallback(() => {
    setOpenModal(null);
    setModalLesson(null);
  }, []);

  return (
    <main className={styles.page}>
      <PageBand
        title={course.title}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Courses", href: "/courses" },
          { label: "Course Details" },
        ]}
      />

      <div className="container">
        <div className={`${styles.layout} ${wide ? styles.wide : ""}`}>
          <div className={styles.playerArea}>
            <VideoPlayer
              course={course}
              lesson={currentLesson}
              lessonNumber={
                currentLesson ? lessons.findIndex((l) => l.id === currentLesson.id) + 1 : 0
              }
              wide={wide}
              onToggleWide={() => setWide((value) => !value)}
              onEnded={() => {
                if (currentLesson) markCompleted(currentLesson.id);
              }}
            />
          </div>

          <div className={styles.metaArea}>
            {currentLesson && (
              <LessonActions
                hasPrevious={currentIndex > 0}
                hasNext={currentIndex >= 0 && currentIndex < lessons.length - 1}
                isCurrentCompleted={completedIds.includes(currentLesson.id)}
                onPrevious={() => {
                  if (currentIndex > 0) selectLesson(lessons[currentIndex - 1]);
                }}
                onNext={() => {
                  if (currentIndex < lessons.length - 1) {
                    selectLesson(lessons[currentIndex + 1]);
                  }
                }}
                onMarkCompleted={() => {
                  markCompleted(currentLesson.id);
                  setToast("Lesson marked as completed — progress updated.");
                }}
              />
            )}
            <SectionIconsRow
              onCurriculum={() => scrollTo("curriculum")}
              onComments={() => scrollTo("comments")}
              onAskQuestion={() => setOpenModal("ask")}
              onLeaderboard={() => setOpenModal("leaderboard")}
            />

            <section aria-labelledby="materials-title" className={styles.materials}>
              <h2 id="materials-title" className={styles.sectionTitle}>
                Course Materials
              </h2>
              <CourseMaterials course={course} />
            </section>
          </div>

          <aside className={styles.sidebarArea} id="curriculum" aria-label="Course curriculum">
            <Curriculum
              course={course}
              progress={progress}
              currentLessonId={currentLessonId}
              completedIds={completedIds}
              isUnlocked={isUnlocked}
              onSelectLesson={selectLesson}
            />
          </aside>

          <div className={styles.commentsArea} id="comments">
            <CommentsSection courseId={course.id} />
          </div>

          <div className={styles.footerArea}>
            <CommentsSubmitButton />
          </div>
        </div>
      </div>

      <LeaderboardModal
        open={openModal === "leaderboard"}
        onClose={closeModal}
        courseTitle={course.title}
        progress={progress}
      />
      <AskQuestionModal open={openModal === "ask"} onClose={closeModal} courseId={course.id} />
      <PdfModal
        open={openModal === "pdf"}
        onClose={closeModal}
        lesson={modalLesson}
        courseId={course.id}
      />
      <ExamModal
        open={openModal === "exam"}
        onClose={closeModal}
        courseId={course.id}
        lesson={modalLesson}
        onFinished={(lessonId) => markCompleted(lessonId)}
      />

      <Toast message={toast} onDone={() => setToast(null)} />
    </main>
  );
}
