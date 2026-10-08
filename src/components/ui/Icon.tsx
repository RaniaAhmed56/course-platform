import type { SVGProps } from "react";

/**
 * Lightweight inline icon set (outline style, inherits `currentColor`).
 * Keeping icons inline avoids an icon-font / library dependency and lets
 * CSS color them per state.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ClockIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Base>
);

export const LessonsIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 5h4v14H4zM10 5h4v14h-4z" />
    <path d="m16 6 4 1-3 12.5-4-1z" />
  </Base>
);

export const EnrolledIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="7.5" r="2.5" />
    <path d="M7 20v-4.5A2.5 2.5 0 0 1 9.5 13h5a2.5 2.5 0 0 1 2.5 2.5V20" />
    <path d="M9.5 13 7 11m7.5 2 2.5-2" />
  </Base>
);

export const GlobeIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
  </Base>
);

export const DocIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 3h9l3 3v15H6z" />
    <path d="M9 9h6M9 12.5h6M9 16h4" />
  </Base>
);

export const VideoIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M10.3 9.4c0-.6.7-1 1.2-.7l4 2.6c.5.3.5 1 0 1.4l-4 2.6c-.5.3-1.2-.1-1.2-.7V9.4z" fill="currentColor" stroke="none" />
  </Base>
);

export const ClipboardIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="5.5" y="4.5" width="13" height="16" rx="2" />
    <path d="M9 4.5V3.8A1.3 1.3 0 0 1 10.3 2.5h3.4A1.3 1.3 0 0 1 15 3.8v.7" />
    <path d="m9 13 2 2 4-4.5" />
  </Base>
);

export const LockIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="6.5" y="10.5" width="11" height="9" rx="4.5" />
    <path d="M9 10.5V8a3 3 0 0 1 6 0v2.5" />
    <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none" />
  </Base>
);

export const CheckCircleIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12.5 2.5 2.5L16 9.5" />
  </Base>
);

export const PlayIcon = (p: IconProps) => (
  <svg
    width={p.size ?? 20}
    height={p.size ?? 20}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    className={p.className}
  >
    <path d="M8.5 6.2c0-.9 1-1.5 1.8-1l8 4.8c.8.5.8 1.6 0 2.1l-8 4.8c-.8.5-1.8-.1-1.8-1V6.2z" />
  </svg>
);

export const PauseIcon = (p: IconProps) => (
  <svg
    width={p.size ?? 20}
    height={p.size ?? 20}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <rect x="7" y="5" width="3.4" height="14" rx="1" />
    <rect x="13.6" y="5" width="3.4" height="14" rx="1" />
  </svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Base {...p} strokeWidth={2}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </Base>
);

export const CurriculumIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M8 6h12M8 12h12M8 18h12" />
    <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
    <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
  </Base>
);

export const CommentsIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 5.5h16v10.5H9l-5 4z" />
    <path d="M8 9.5h8M8 12.5h5" />
  </Base>
);

export const QuestionIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.3a2.6 2.6 0 0 1 5.1.7c0 1.7-2.6 2-2.6 3.5" />
    <circle cx="12" cy="16.8" r="0.9" fill="currentColor" stroke="none" />
  </Base>
);

export const TrophyIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M8 4h8v5a4 4 0 0 1-8 0V4z" />
    <path d="M8 5H4.5v1A3.5 3.5 0 0 0 8 9.5M16 5h3.5v1A3.5 3.5 0 0 1 16 9.5" />
    <path d="M12 13v3m-3.5 4h7M10 20v-2.5a1.5 1.5 0 0 1 4 0V20" />
  </Base>
);

export const CloseIcon = (p: IconProps) => (
  <Base {...p} strokeWidth={2}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
);

export const PlusIcon = (p: IconProps) => (
  <Base {...p} strokeWidth={2}>
    <path d="M12 5v14M5 12h14" />
  </Base>
);

export const MinusIcon = (p: IconProps) => (
  <Base {...p} strokeWidth={2}>
    <path d="M5 12h14" />
  </Base>
);

export const MaximizeIcon = (p: IconProps) => (
  <Base {...p} strokeWidth={2}>
    <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
  </Base>
);

export const WideIcon = (p: IconProps) => (
  <Base {...p} strokeWidth={2}>
    <rect x="3" y="7" width="18" height="10" rx="1.5" />
    <path d="M7 12h10" />
  </Base>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <Base {...p} strokeWidth={2.2}>
    <path d="m14.5 5-7 7 7 7" />
  </Base>
);

export const AlarmIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="13" r="7" />
    <path d="M12 10v3l2 1.5M5 4 3 6m16-2 2 2" />
  </Base>
);
