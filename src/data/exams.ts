import type { Exam, ExamQuestion } from "@/types/course";

/**
 * Each course family gets its own topical exam, so every quiz badge and
 * popup shows real, matching content (not one shared placeholder).
 * The first SEO question reproduces the one visible in the reference mock
 * (including its original option spellings).
 */

const q = (
  id: string,
  prompt: string,
  options: [string, string, string, string],
  correctIndex: number
): ExamQuestion => ({
  id,
  prompt,
  options: options.map((label, i) => ({ id: "abcd"[i], label })),
  correctOptionId: "abcd"[correctIndex],
});

const seoExam: Exam = {
  lessonId: "seo",
  durationMinutes: 10,
  questions: [
    q(
      "q1",
      "Among the following status of India, which one has the oldest rock formations in the country?",
      ["Asam", "Bahar", "Kamaltake", "Utter Pardesh"],
      1
    ),
    q("q2", "What does SEO stand for?", [
      "Search Engine Optimization",
      "Site Engagement Output",
      "Search Evaluation Order",
      "Secure External Origin",
    ], 0),
    q("q3", "Which of the following is a ranking factor for search engines?", [
      "Page loading speed",
      "The developer's IDE",
      "Number of CSS files",
      "Database engine",
    ], 0),
    q("q4", "Where should important keywords ideally appear?", [
      "Only in the footer",
      "In titles, headings and early content",
      "Hidden in white text",
      "Inside code comments",
    ], 1),
    q("q5", "What is a meta description used for?", [
      "Styling the page",
      "The snippet shown under the title in search results",
      "Blocking crawlers",
      "Storing user data",
    ], 1),
  ],
};

const reactExam: Exam = {
  lessonId: "react",
  durationMinutes: 10,
  questions: [
    q("q1", "What is the correct way to pass data from a parent to a child component?", [
      "Through props",
      "Through global variables",
      "By editing the child's state directly",
      "Through CSS variables",
    ], 0),
    q("q2", "Which hook stores local component state?", [
      "useEffect",
      "useState",
      "useRef",
      "useMemo",
    ], 1),
    q("q3", "Why does a list item need a stable key?", [
      "To style it",
      "So React can match items between renders",
      "To make it clickable",
      "Keys are optional decoration",
    ], 1),
    q("q4", "When does useEffect with an empty dependency array run?", [
      "On every render",
      "Only after the first render",
      "Never",
      "Only on unmount",
    ], 1),
    q("q5", "What does \"lifting state up\" mean?", [
      "Moving shared state to the closest common parent",
      "Storing state in localStorage",
      "Using more useState calls",
      "Moving state into CSS",
    ], 0),
  ],
};

const jsExam: Exam = {
  lessonId: "javascript",
  durationMinutes: 10,
  questions: [
    q("q1", "Which HTML tag is used to embed a video on a web page?", [
      "<media>",
      "<movie>",
      "<video>",
      "<player>",
    ], 2),
    q("q2", "What does Array.prototype.map return?", [
      "The same array, mutated",
      "A new array of transformed values",
      "The first match",
      "A boolean",
    ], 1),
    q("q3", "What is the result of typeof null?", [
      "\"null\"",
      "\"undefined\"",
      "\"object\"",
      "\"number\"",
    ], 2),
    q("q4", "Which keyword declares a block-scoped variable?", [
      "var",
      "let",
      "function",
      "global",
    ], 1),
    q("q5", "What does await do inside an async function?", [
      "Pauses until the promise settles",
      "Cancels the promise",
      "Runs the promise twice",
      "Converts it to a callback",
    ], 0),
  ],
};

const generalExam: Exam = {
  lessonId: "general",
  durationMinutes: 10,
  questions: [
    q("q1", "What is the first step of tackling any new project?", [
      "Understanding the goal and the audience",
      "Choosing fonts",
      "Buying tools",
      "Publishing immediately",
    ], 0),
    q("q2", "Feedback is most useful when it is…", [
      "Vague and polite",
      "Specific and actionable",
      "Given only at the end",
      "Avoided entirely",
    ], 1),
    q("q3", "Iterating on your work means…", [
      "Starting over every time",
      "Improving it in small, reviewed steps",
      "Never changing the first draft",
      "Copying someone else's result",
    ], 1),
    q("q4", "A good practice exercise should be…", [
      "Impossible, to build character",
      "Small enough to finish and reflect on",
      "Done without any reference",
      "Skipped if busy",
    ], 1),
    q("q5", "What is the best way to retain a new skill?", [
      "Reading about it once",
      "Practicing it regularly",
      "Watching others only",
      "Memorizing terminology",
    ], 1),
  ],
};

/** Resolve the exam that belongs to a quiz lesson (by its id's course family). */
export function getExamForLesson(lessonId: string): Exam {
  if (
    lessonId === "course-overview-quiz" ||
    lessonId === "return-values-quiz" ||
    lessonId === "final-exam"
  ) {
    return seoExam;
  }
  if (lessonId.startsWith("react-in-practice")) return reactExam;
  if (lessonId.startsWith("javascript-essentials")) return jsExam;
  return generalExam;
}

/**
 * Badge info for an exam lesson, derived from its real exam content so the
 * "x QUESTION / x MINUTES" badges always match what the popup shows.
 */
export function getExamMeta(lessonId: string): {
  questionCount: number;
  durationMinutes: number;
} {
  const exam = getExamForLesson(lessonId);
  return {
    questionCount: exam.questions.length,
    durationMinutes: exam.durationMinutes,
  };
}
