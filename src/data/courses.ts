import type { Course, CurriculumSection } from "@/types/course";

/** Real, verified YouTube videos used as lesson content (mock data). */
const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

/**
 * Curriculum of the featured course — mirrors the reference design:
 * three week cards, the quiz lessons carry QUESTION / MINUTES badges,
 * future lessons are locked.
 */
const seoCurriculum: CurriculumSection[] = [
  {
    id: "week-1-4",
    title: "Week 1-4",
    description:
      "Advanced story telling techniques for writers: Personas, Characters & Plots",
    lessons: [
      { id: "introduction", title: "Introduction", type: "video", locked: false, videoUrl: yt("BNHR6IQJGZs") },
      { id: "course-overview", title: "Course Overview", type: "video", locked: false, videoUrl: yt("7_LPdttKXPc") },
      {
        id: "course-overview-quiz",
        title: "Course Overview",
        type: "exam",
        locked: false,
        questionCount: 0,
        durationMinutes: 10,
      },
      {
        id: "course-exercise",
        title: "Course Exercise / Reference Files",
        type: "pdf",
        locked: false,
      },
      {
        id: "code-editor-installation",
        title: "Code Editor Installation (Optional if you have one)",
        type: "video",
        locked: false,
        // demo of an external video source — any YouTube/.mp4 link works here
        videoUrl: "https://www.youtube.com/watch?v=KMxo3T_MTvY",
      },
      { id: "embedding-php", title: "Embedding PHP in HTML", type: "video", locked: false, videoUrl: yt("OEV8gMkCHXQ") },
    ],
  },
  {
    id: "week-5-8",
    title: "Week 5-8",
    description:
      "Advanced story telling techniques for writers: Personas, Characters & Plots",
    lessons: [
      { id: "defining-functions", title: "Defining Functions", type: "video", locked: false, videoUrl: yt("DHvZLI7Db8E") },
      { id: "function-parameters", title: "Function Parameters", type: "video", locked: true, videoUrl: yt("zQnBQ4tB3ZA") },
      {
        id: "return-values-quiz",
        title: "Return Values From Functions",
        type: "exam",
        locked: false,
        questionCount: 2,
        durationMinutes: 15,
      },
      { id: "global-variable-scope", title: "Global Variable and Scope", type: "video", locked: true, videoUrl: yt("zsjvFFKOm3c") },
      {
        id: "newer-way-constant",
        title: "Newer Way of creating a Constant",
        type: "video",
        locked: true,
        videoUrl: yt("hwP7WQkmECE"),
      },
      { id: "constants", title: "Constants", type: "video", locked: true, videoUrl: yt("ENrzD9HAZK4") },
    ],
  },
  {
    id: "week-9-12",
    title: "Week 9-12",
    description:
      "Advanced story telling techniques for writers: Personas, Characters & Plots",
    lessons: [
      { id: "arrow-functions", title: "Arrow Functions", type: "video", locked: true, videoUrl: yt("Sklc_fQBmcs") },
      { id: "template-literals", title: "Template Literals", type: "video", locked: true, videoUrl: yt("x7X9w_GIm1s") },
      {
        id: "final-exam",
        title: "Final Course Exam",
        type: "exam",
        locked: true,
        questionCount: 5,
        durationMinutes: 20,
      },
      { id: "publishing-site", title: "Publishing Your Website", type: "video", locked: true, videoUrl: yt("hwP7WQkmECE") },
      { id: "measuring-results", title: "Measuring Your Results", type: "video", locked: true, videoUrl: yt("BNHR6IQJGZs") },
      { id: "course-wrap-up", title: "Course Wrap Up & Next Steps", type: "pdf", locked: true },
    ],
  },
];

/** Small helper to build simple curricula for the rest of the catalogue. */
function simpleCurriculum(
  courseId: string,
  sections: Array<{ title: string; lessons: string[] }>,
  /** Topic-matched YouTube video ids, assigned to video lessons in order. */
  videoPool: string[] = []
): CurriculumSection[] {
  let videoIndex = 0;
  return sections.map((section, sIndex) => ({
    id: `${courseId}-s${sIndex + 1}`,
    title: section.title,
    description:
      "Advanced story telling techniques for writers: Personas, Characters & Plots",
    lessons: section.lessons.map((title, lIndex) => {
      const isExam = lIndex === section.lessons.length - 1;
      return {
        id: `${courseId}-s${sIndex + 1}-l${lIndex + 1}`,
        title,
        type: isExam ? ("exam" as const) : ("video" as const),
        locked: sIndex > 0,
        ...(isExam
          ? { questionCount: 3, durationMinutes: 10 }
          : videoPool.length > 0
            ? { videoUrl: yt(videoPool[videoIndex++ % videoPool.length]) }
            : {}),
      };
    }),
  })).map((section, sIndex) =>
    sIndex === 0
      ? {
          ...section,
          lessons: [
            ...section.lessons.slice(0, 2),
            {
              id: `${courseId}-files`,
              title: "Course Exercise / Reference Files",
              type: "pdf" as const,
              locked: false,
            },
            ...section.lessons.slice(2),
          ],
        }
      : section
  );
}

export const courses: Course[] = [
  {
    id: "react-in-practice",
    slug: "react-in-practice",
    title: "React in Practice: Components & Data Binding",
    shortDescription:
      "Build interactive UIs with React, manage state and work with real-world data.",
    instructor: "Omar El-Sayed",
    image: "/images/covers/react.avif",
    category: "Development",
    durationWeeks: 8,
    lessonsCount: 32,
    enrolledStudents: 98,
    language: "English",
    progress: 27,
    status: "in-progress",
    curriculum: simpleCurriculum("react-in-practice", [
      {
        title: "Week 1-4",
        lessons: [
          "Why React?",
          "Project Setup & Tooling",
          "Your First Component",
          "Thinking in Components",
          "Introduction Quiz",
        ],
      },
      {
        title: "Week 5-8",
        lessons: [
          "Props In Depth",
          "State & Lifting State Up",
          "Conditional & List Rendering",
          "Styling Components",
          "Forms & Controlled Inputs",
          "Components Quiz",
        ],
      },
      {
        title: "Week 9-12",
        lessons: [
          "useEffect Explained",
          "Fetching Data the Right Way",
          "Custom Hooks",
          "Memoization & Performance",
          "Deploying Your App",
          "Hooks Quiz",
        ],
      },
    ], ["Tn6-PIqc4UM", "Sklc_fQBmcs", "zQnBQ4tB3ZA", "DHvZLI7Db8E", "KMxo3T_MTvY", "hwP7WQkmECE"]),
  },
  {
    id: "javascript-essentials",
    slug: "javascript-essentials",
    title: "JavaScript Essentials: From Zero to Interactive",
    shortDescription:
      "Variables, functions, the DOM and events — the foundations every web developer needs.",
    instructor: "Sarah Mitchell",
    image: "/images/covers/javascript.avif",
    category: "Development",
    durationWeeks: 6,
    lessonsCount: 24,
    enrolledStudents: 142,
    language: "English",
    progress: 100,
    status: "completed",
    curriculum: simpleCurriculum("javascript-essentials", [
      {
        title: "Week 1-4",
        lessons: [
          "Values, Types & Operators",
          "Control Flow & Loops",
          "Functions Deep Dive",
          "Arrays & Objects",
          "Basics Checkpoint Quiz",
        ],
      },
      {
        title: "Week 5-8",
        lessons: [
          "Selecting & Updating Elements",
          "Handling Events",
          "Building a Small Widget",
          "Forms & Validation",
          "DOM Checkpoint Quiz",
        ],
      },
      {
        title: "Week 9-12",
        lessons: [
          "Callbacks & Promises",
          "Fetch & APIs",
          "Async / Await",
          "Error Handling",
          "Async Checkpoint Quiz",
        ],
      },
    ], ["DHvZLI7Db8E", "zQnBQ4tB3ZA", "ENrzD9HAZK4", "hwP7WQkmECE", "zsjvFFKOm3c", "7_LPdttKXPc"]),
  },
  {
    id: "starting-seo",
    slug: "starting-seo",
    title: "Starting SEO as your Home",
    shortDescription:
      "Learn how to rank a website from scratch and turn search traffic into a home-based business.",
    instructor: "Edward Norton",
    image: "/images/covers/seo.avif",
    category: "Marketing",
    durationWeeks: 3,
    lessonsCount: 8,
    enrolledStudents: 65,
    language: "English",
    progress: 63,
    status: "in-progress",
    curriculum: seoCurriculum,
  },
  {
    id: "uiux-foundations",
    slug: "uiux-foundations",
    title: "UI/UX Foundations for Developers",
    shortDescription:
      "Spacing, typography, color and layout — design screens users actually understand.",
    instructor: "Lina Haddad",
    image: "/images/covers/uiux.avif",
    category: "Design",
    durationWeeks: 4,
    lessonsCount: 16,
    enrolledStudents: 210,
    language: "English",
    progress: 0,
    status: "not-started",
    curriculum: simpleCurriculum("uiux-foundations", [
      {
        title: "Week 1-4",
        lessons: [
          "Visual Hierarchy",
          "Typography that Works",
          "Color with Intent",
          "Spacing Systems",
          "Fundamentals Quiz",
        ],
      },
      {
        title: "Week 5-8",
        lessons: [
          "Layout & Grids",
          "Designing Components",
          "States & Feedback",
          "Handoff & Consistency",
          "Wireframe Quiz",
        ],
      },
      {
        title: "Week 9-12",
        lessons: [
          "Dashboards & Tables",
          "Forms People Finish",
          "Mobile-first Screens",
          "Design Review Checklist",
          "Screens Quiz",
        ],
      },
    ], ["Cx2dkpBxst8", "OEV8gMkCHXQ", "KMxo3T_MTvY", "7_LPdttKXPc"]),
  },
  {
    id: "python-data-analysis",
    slug: "python-data-analysis",
    title: "Python for Data Analysis",
    shortDescription:
      "Clean, explore and visualise real datasets with pandas and matplotlib.",
    instructor: "Ahmed Mansour",
    image: "/images/covers/python.avif",
    category: "Data Science",
    durationWeeks: 10,
    lessonsCount: 40,
    enrolledStudents: 77,
    language: "English",
    progress: 82,
    status: "in-progress",
    curriculum: simpleCurriculum("python-data-analysis", [
      {
        title: "Week 1-4",
        lessons: [
          "Collections & Comprehensions",
          "Reading Files",
          "Functions & Modules",
          "Virtual Environments",
          "Refresher Quiz",
        ],
      },
      {
        title: "Week 5-8",
        lessons: [
          "DataFrames 101",
          "Cleaning Messy Data",
          "Grouping & Aggregation",
          "Joining Datasets the Right Way (merge, concat & when to use each)",
          "Pandas Quiz",
        ],
      },
      {
        title: "Week 9-12",
        lessons: [
          "Matplotlib Basics",
          "Charts that Tell a Story",
          "Exploratory Analysis",
          "Reporting Your Findings",
          "Visualisation Quiz",
        ],
      },
    ], ["x7X9w_GIm1s", "zsjvFFKOm3c", "ENrzD9HAZK4", "7_LPdttKXPc"]),
  },
  {
    id: "digital-marketing",
    slug: "digital-marketing",
    title: "Digital Marketing Strategy Bootcamp",
    shortDescription:
      "Build a full acquisition funnel: content, social, email and paid campaigns.",
    instructor: "Nour Khalil",
    image: "/images/covers/marketing.avif",
    category: "Marketing",
    durationWeeks: 5,
    lessonsCount: 20,
    enrolledStudents: 183,
    language: "English",
    progress: 45,
    status: "in-progress",
    curriculum: simpleCurriculum("digital-marketing", [
      {
        title: "Week 1-4",
        lessons: [
          "Finding Your Audience",
          "Crafting the Message",
          "Competitor Research",
          "Positioning Quiz",
        ],
      },
      {
        title: "Week 5-8",
        lessons: [
          "Content Marketing",
          "Email Sequences",
          "Paid Acquisition Basics",
          "Social Media Playbook",
          "Channels Quiz",
        ],
      },
      {
        title: "Week 9-12",
        lessons: [
          "Analytics Fundamentals",
          "A/B Testing",
          "Conversion Funnels",
          "Reporting to Stakeholders",
          "Optimisation Quiz",
        ],
      },
    ], ["BNHR6IQJGZs", "7_LPdttKXPc", "OEV8gMkCHXQ", "hwP7WQkmECE"]),
  },
  {
    id: "english-writing",
    slug: "english-writing",
    title: "Professional English Writing",
    shortDescription:
      "Advanced story telling techniques for writers: personas, characters and plots.",
    instructor: "Emily Carter",
    image: "/images/covers/writing.avif",
    category: "Language",
    durationWeeks: 3,
    lessonsCount: 12,
    enrolledStudents: 65,
    language: "English",
    progress: 100,
    status: "completed",
    curriculum: simpleCurriculum("english-writing", [
      {
        title: "Week 1-4",
        lessons: [
          "Personas & Characters",
          "Plots that Hold Attention",
          "Openings & Hooks",
          "Structure Quiz",
        ],
      },
      {
        title: "Week 5-8",
        lessons: [
          "Editing Ruthlessly",
          "Finding Your Voice",
          "Rhythm & Flow",
          "Voice Quiz",
        ],
      },
      {
        title: "Week 9-12",
        lessons: [
          "Clarity over Cleverness",
          "Feedback & Revision",
          "Publishing Your Work",
          "Final Quiz",
        ],
      },
    ], ["7_LPdttKXPc", "KMxo3T_MTvY", "Cx2dkpBxst8"]),
  },
  {
    id: "photography-basics",
    slug: "photography-basics",
    title: "Photography Basics: Shoot with Intention",
    shortDescription:
      "Exposure, composition and light — move off auto mode and tell visual stories.",
    instructor: "Karim Fathy",
    image: "/images/covers/photography.avif",
    category: "Creative",
    durationWeeks: 4,
    lessonsCount: 14,
    enrolledStudents: 120,
    language: "English",
    progress: 0,
    status: "not-started",
    curriculum: simpleCurriculum("photography-basics", [
      {
        title: "Week 1-4",
        lessons: [
          "The Exposure Triangle",
          "Focus & Depth of Field",
          "Shooting Modes",
          "Fundamentals Quiz",
        ],
      },
      {
        title: "Week 5-8",
        lessons: [
          "Composition Rules (and when to break them)",
          "Natural Light",
          "Golden Hour in Practice",
          "Composition Quiz",
        ],
      },
      {
        title: "Week 9-12",
        lessons: [
          "Culling Your Shots",
          "Editing Basics",
          "Building a Portfolio",
          "Editing Quiz",
        ],
      },
    ], ["7_LPdttKXPc", "Cx2dkpBxst8", "OEV8gMkCHXQ"]),
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}
