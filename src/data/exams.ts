import type { Exam } from "@/types/course";

/**
 * Mock exam shown in the exam popup. The first question reproduces the one
 * visible in the reference mock (including its original option spellings).
 */
export const sampleExam: Exam = {
  lessonId: "course-overview-quiz",
  durationMinutes: 10,
  questions: [
    {
      id: "q1",
      prompt:
        "Among the following status of India, which one has the oldest rock formations in the country?",
      options: [
        { id: "a", label: "Asam" },
        { id: "b", label: "Bahar" },
        { id: "c", label: "Kamaltake" },
        { id: "d", label: "Utter Pardesh" },
      ],
      correctOptionId: "b",
    },
    {
      id: "q2",
      prompt: "Which HTML tag is used to embed a video on a web page?",
      options: [
        { id: "a", label: "<media>" },
        { id: "b", label: "<movie>" },
        { id: "c", label: "<video>" },
        { id: "d", label: "<player>" },
      ],
      correctOptionId: "c",
    },
    {
      id: "q3",
      prompt: "What does SEO stand for?",
      options: [
        { id: "a", label: "Search Engine Optimization" },
        { id: "b", label: "Site Engagement Output" },
        { id: "c", label: "Search Evaluation Order" },
        { id: "d", label: "Secure External Origin" },
      ],
      correctOptionId: "a",
    },
    {
      id: "q4",
      prompt: "Which of the following is a ranking factor for search engines?",
      options: [
        { id: "a", label: "Page loading speed" },
        { id: "b", label: "The developer's IDE" },
        { id: "c", label: "Number of CSS files" },
        { id: "d", label: "Database engine" },
      ],
      correctOptionId: "a",
    },
    {
      id: "q5",
      prompt: "Where should important keywords ideally appear?",
      options: [
        { id: "a", label: "Only in the footer" },
        { id: "b", label: "In titles, headings and early content" },
        { id: "c", label: "Hidden in white text" },
        { id: "d", label: "Inside code comments" },
      ],
      correctOptionId: "b",
    },
  ],
};

/**
 * Badge info for an exam lesson, derived from the real exam content so the
 * "x QUESTION / x MINUTES" badges always match what the popup actually shows.
 * (All quiz lessons currently share the one mock exam.)
 */
export function getExamMeta(_lessonId: string): {
  questionCount: number;
  durationMinutes: number;
} {
  return {
    questionCount: sampleExam.questions.length,
    durationMinutes: sampleExam.durationMinutes,
  };
}
