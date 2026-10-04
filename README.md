# Mini Learning Platform — Courses → Course Player

A small course-platform experience built for the frontend challenge: a course
catalogue page that leads into a fully interactive **Course Player**,
reproduced as a faithful match of the provided Desktop & Mobile reference
designs.

## What it does

- **Courses page** (`/courses`) — a full catalogue experience: site header,
  hero band, working category filters and course search, and 8 mock courses.
  Each card has an illustrated cover with a live status chip (Not started /
  In Progress / Completed), title, short description, instructor, lessons &
  duration meta, progress % with a bar, and a status-aware
  `Start` / `Continue` / `Review` action that opens the player.
- **Course Player** (`/courses/[courseSlug]`) — breadcrumb + title band,
  video player, quick-access section icons, Course Materials, the
  "Topics for This Course" curriculum with the animated progress bar and
  "You" marker, and the Comments section with a working form.

### Implemented interactions (per the design notes)

| Interaction | Behaviour |
| --- | --- |
| Lesson selection | Clicking a curriculum lesson loads it into the player, marks it as the current lesson, and finishing a video marks it completed (which unlocks the next one and updates progress). |
| Locked lessons | Show a padlock; clicking one shows an explanatory toast. |
| Course progress | The sidebar bar (with the "You" marker) animates to its value when it scrolls into view. Progress persists per course in `localStorage`. |
| Player | Opens in place (not a popup). **Maximize** enters real fullscreen on desktop & mobile (incl. iOS fallback). **Wide** (desktop) switches to theater layout — the player takes the full width and the course content drops below. On mobile the player sticks to the top while the content scrolls underneath (YouTube-style). |
| Section icons | The template's social icons are replaced (as requested) with shortcuts: Curriculum & Comments scroll to their sections; Ask a Question and Leaderboard open popups. |
| Ask a Question | Popup with the same design language as the comment form. The draft is kept in `sessionStorage`, so closing it by mistake and reopening it in the same session restores the text. |
| Leaderboard | Popup with the course name, ranked list, and a motivational message from the instructor (Arabic, with emoji) whose tone changes with the student's level. |
| PDF lessons | Open in a screen-sized closable popup (embedded PDF). |
| Exam lessons | Open in a screen-sized popup styled after the reference quiz mock (timer, question stepper, options). Each course family has its own topical exam (SEO, React, JavaScript, general) and the QUESTION/MINUTES badges derive from that exam's real content. Closing the exam **saves the student's progress** (current question, answers, remaining time) and reopening resumes it. Finishing shows the score and completes the lesson. |
| Comments | Submitting the form appends the comment to the list immediately and persists it per course. |
| Lesson actions | Previous / Next lesson navigation and a "Mark as completed" action under the player; the catalogue animates cards in with a smooth stagger when filtering or searching (respecting reduced-motion). |

## Tech

- **Next.js 16 (App Router) + TypeScript** — required stack.
- **CSS Modules + design tokens** — no UI framework; every color/font/space
  token was sampled from the reference screenshots (see
  `src/app/globals.css`).
- **Self-hosted fonts** via `next/font/local` (League Spartan for the
  headings — the font named in the design file — and Quicksand for body text). No external font requests.
- **No backend** — all content comes from typed mock data in `src/data/`.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000

npm run build    # production build (all pages are statically generated)
npm run start
```

## Testing

End-to-end tests (Playwright) cover the core flows: filtering/search,
lesson selection, locked-lesson handling, exam save & resume, the
ask-a-question draft, comments, live progress and the no-horizontal-scroll
guarantee across six breakpoints.

```bash
npx playwright install chromium   # first time only
npm run build
npm run test:e2e                  # 7 tests
```

## Lighthouse (production build)

| Page | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| /courses | 95 | 100 | 100 | 100 |
| /courses/[slug] (player) | 96 | 97 | 100 | 100 |

The single remaining accessibility flag on the player is the white-on-teal
"Submit Review" button — kept intentionally, because its color is part of
the reference design being reproduced; every element that is this
project's own addition meets WCAG AA.

## Project structure

```
src/
├── app/
│   ├── layout.tsx                  # fonts, metadata, global css
│   ├── page.tsx                    # / → redirects to /courses
│   └── courses/
│       ├── page.tsx                # course catalogue (Server Component)
│       └── [courseSlug]/page.tsx   # player shell (Server Component)
├── components/
│   ├── layout/                     # PageBand (breadcrumb + title band)
│   ├── ui/                         # Modal, CourseProgressBar, Icon set
│   ├── courses/                    # CourseCard
│   └── course-player/              # CoursePlayer + its building blocks
│       └── modals/                 # Leaderboard / Ask / PDF / Exam popups
├── data/                           # courses, comments, exams, leaderboard
├── lib/                            # storage + progress helpers
├── types/                          # shared domain types
└── fonts/                          # self-hosted woff2 files
```

## Architecture decisions

**Server vs Client Components.** Routes and static sections (catalogue page,
player shell, materials card, page band) are Server Components; pages are
fully static (SSG via `generateStaticParams`). Client Components are used
only where there is state or browser API access: the player
(`CoursePlayer`), curriculum, comments, modals, progress bar
(IntersectionObserver) and course cards (they merge locally saved progress
after mount).

**Data layer.** All mock content lives in `src/data/*` behind the types in
`src/types/course.ts`, completely separated from components — swapping in a
real API later means replacing one import. Learning state (current lesson,
completed lessons, exam progress, the user's comments) is persisted
per-course in `localStorage` through small safe wrappers (`src/lib/storage.ts`)
that never throw during SSR or in private browsing.

**Images & performance.** Course covers are sharpened 2x (retina) AVIF
illustrations (~10KB each, with WebP/AVIF output enabled in next/image) and the poster/avatars are compressed progressive JPEGs, all
served through `next/image` (explicit dimensions — no layout shift). The
cover art carries the course name visually; the status chip is real HTML on
top of it, so it always reflects the student's live progress, and the
semantic course title lives in the card body (covers use empty `alt`). Fonts are subsetted
woff2 served from the app itself. No runtime dependencies beyond React +
Next; the whole UI is hand-written CSS Modules, so the JS bundle stays
minimal and every page is pre-rendered static HTML. Every video lesson
starts as a still poster with a play button; pressing play starts the actual
video. Every video lesson links a real, verified YouTube video via
`videoUrl` in the mock data (any direct .mp4 link also works); YouTube
lessons render as a lightweight poster facade and the embed loads only on
play. Bundled sample clips load with
`preload="metadata"` only.

**Responsive approach.** Three real breakpoints — desktop (≥1200px), tablet
(992–1199px two-column, 768–991px single column with the two-column
materials card), and mobile (<768px: materials title inside the card,
instructor row, curriculum accordion, sticky player). Layout re-ordering is
done with a single CSS grid using named areas, so the DOM order never
changes. Fluid `minmax(0, 1fr)` columns, `overflow-wrap` on long titles and
badge stacking below 420px prevent horizontal scroll and broken rows with
long content or many lessons (verified down to 360px).

**Design fidelity.** The Course Player intentionally mirrors the reference —
layout, spacing, fonts and colors were measured/sampled from the screenshot
rather than redesigned. The deliberate differences are exactly the ones the
annotated design asks for: section shortcut icons instead of social icons,
the current/completed lesson states, the popups (PDF, exam, leaderboard,
ask-a-question) and the scroll-animated progress bar. The body gray was
nudged from `#808080` to `#767676` to meet WCAG AA contrast without a
visible difference.

**Accessibility.** Semantic landmarks and headings, real `<button>`s
everywhere, labelled icon buttons, `aria-expanded` accordions,
`role="progressbar"` with values, modals with `aria-modal`, Escape/backdrop
closing, focus restore and body scroll lock, visible `:focus-visible` rings,
and ≥44px touch targets on mobile.
