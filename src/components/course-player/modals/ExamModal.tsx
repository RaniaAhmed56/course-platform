"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Lesson } from "@/types/course";
import Modal from "@/components/ui/Modal";
import { AlarmIcon, ChevronLeftIcon } from "@/components/ui/Icon";
import { getExamForLesson } from "@/data/exams";
import { loadCourseState, saveCourseState } from "@/lib/progress";
import styles from "./ExamModal.module.css";

interface ExamModalProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
  lesson: Lesson | null;
  onFinished: (lessonId: string) => void;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes} : ${seconds}`;
}

/**
 * Exam popup — screen-sized blue quiz matching the reference mock: back
 * chevron, yellow timer, question stepper, white question card with options.
 * Closing it saves the student's current progress (question, answers and
 * remaining time), so reopening resumes where they left off.
 */
export default function ExamModal({
  open,
  onClose,
  courseId,
  lesson,
  onFinished,
}: ExamModalProps) {
  const exam = getExamForLesson(lesson?.id ?? "");
  const total = exam.questions.length;

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [remaining, setRemaining] = useState(exam.durationMinutes * 60);
  const [finished, setFinished] = useState(false);
  const stateRef = useRef({ questionIndex, answers, remaining });
  stateRef.current = { questionIndex, answers, remaining };

  /* Restore saved exam progress when opening */
  useEffect(() => {
    if (!open || !lesson) return;
    const stored = loadCourseState(courseId);
    if (stored.exam && stored.exam.lessonId === lesson.id) {
      setQuestionIndex(Math.min(stored.exam.questionIndex, total - 1));
      setAnswers(stored.exam.answers);
      setRemaining(stored.exam.remainingSeconds);
    } else {
      setQuestionIndex(0);
      setAnswers({});
      setRemaining(exam.durationMinutes * 60);
    }
    setFinished(false);
  }, [open, lesson, courseId, exam.durationMinutes, total]);

  /* Countdown */
  useEffect(() => {
    if (!open || finished) return;
    const timer = window.setInterval(() => {
      setRemaining((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [open, finished]);

  const persistProgress = useCallback(() => {
    if (!lesson) return;
    const stored = loadCourseState(courseId);
    saveCourseState(courseId, {
      ...stored,
      exam: {
        lessonId: lesson.id,
        questionIndex: stateRef.current.questionIndex,
        answers: stateRef.current.answers,
        remainingSeconds: stateRef.current.remaining,
      },
    });
  }, [courseId, lesson]);

  /* Persist continuously while the exam is open, so answers survive even
     a page reload or closing the tab mid-exam */
  useEffect(() => {
    if (!open || finished || !lesson) return;
    persistProgress();
  }, [open, finished, lesson, answers, questionIndex, persistProgress]);

  /* Closing saves current progress */
  const handleClose = useCallback(() => {
    if (!finished) persistProgress();
    onClose();
  }, [finished, persistProgress, onClose]);

  const handleFinish = () => {
    if (!lesson) return;
    setFinished(true);
    const stored = loadCourseState(courseId);
    saveCourseState(courseId, { ...stored, exam: undefined });
    onFinished(lesson.id);
  };

  if (!lesson) return null;

  const question = exam.questions[questionIndex];
  const score = exam.questions.filter(
    (q) => answers[q.id] === q.correctOptionId
  ).length;
  const answeredCount = Object.keys(answers).length;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      label={`Exam: ${lesson.title}`}
      size="screen"
      panelClassName={styles.examPanel}
      hideCloseButton
    >
      <div className={styles.chrome}>
        <header className={styles.topBar}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={handleClose}
            aria-label="Close exam and save progress"
          >
            <ChevronLeftIcon size={20} />
          </button>

          <span className={styles.timer} role="timer" aria-label="Time remaining">
            <AlarmIcon size={16} />
            {formatTime(remaining)}
          </span>

          <span className={styles.topSpacer} aria-hidden="true" />
        </header>

        <nav className={styles.steps} aria-label="Exam questions">
          {exam.questions.map((q, index) => (
            <button
              key={q.id}
              type="button"
              className={`${styles.step} ${index === questionIndex ? styles.stepActive : ""} ${
                answers[q.id] ? styles.stepAnswered : ""
              }`}
              onClick={() => setQuestionIndex(index)}
              aria-label={`Question ${index + 1}${answers[q.id] ? " (answered)" : ""}`}
              aria-current={index === questionIndex ? "step" : undefined}
            >
              {index + 1}
            </button>
          ))}
        </nav>

        <div className={styles.card}>
          {finished ? (
            <div className={styles.result}>
              <p className={styles.resultScore}>
                {score} / {total}
              </p>
              <p className={styles.resultLabel}>
                {score >= Math.ceil(total * 0.6)
                  ? "Well done — exam passed! 🎉"
                  : "Keep practicing and try again 💪"}
              </p>
              <button type="button" className={styles.finishBtn} onClick={onClose}>
                Back to course
              </button>
            </div>
          ) : (
            <>
              <p className={styles.qNumber}>{questionIndex + 1}.</p>
              <h2 className={styles.prompt}>{question.prompt}</h2>

              <div className={styles.options} role="radiogroup" aria-label="Answers">
                {question.options.map((option) => {
                  const selected = answers[question.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className={`${styles.option} ${selected ? styles.optionSelected : ""}`}
                      onClick={() =>
                        setAnswers((previous) => ({
                          ...previous,
                          [question.id]: option.id,
                        }))
                      }
                    >
                      <span className={styles.optionCell} aria-hidden="true">
                        <span className={styles.optionBox}>
                          {selected && <span className={styles.optionDot} />}
                        </span>
                      </span>
                      <span className={styles.optionLabel}>{option.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className={styles.cardFooter}>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={() => setQuestionIndex((index) => Math.max(0, index - 1))}
                  disabled={questionIndex === 0}
                >
                  Previous
                </button>
                {questionIndex < total - 1 ? (
                  <button
                    type="button"
                    className={`${styles.navBtn} ${styles.navPrimary}`}
                    onClick={() =>
                      setQuestionIndex((index) => Math.min(total - 1, index + 1))
                    }
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`${styles.navBtn} ${styles.navPrimary}`}
                    onClick={handleFinish}
                    disabled={answeredCount < total}
                    title={
                      answeredCount < total ? "Answer all questions first" : undefined
                    }
                  >
                    Finish Exam
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
