"use client";

import styles from "./SectionIconsRow.module.css";

interface SectionIconsRowProps {
  onCurriculum: () => void;
  onComments: () => void;
  onAskQuestion: () => void;
  onLeaderboard: () => void;
}

/**
 * Quick-access icon row under the player. Per the design notes it replaces
 * the template's social icons with shortcuts for: curriculum, comments,
 * ask a question, and the leaderboard — drawn as solid glyphs in the same
 * circled style as the original icons.
 */
export default function SectionIconsRow({
  onCurriculum,
  onComments,
  onAskQuestion,
  onLeaderboard,
}: SectionIconsRowProps) {
  const items = [
    {
      label: "Curriculum",
      onClick: onCurriculum,
      icon: (
        /* solid book / curriculum */
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM7.5 4h4.5v7.2l-2.25-1.4L7.5 11.2V4z" />
        </svg>
      ),
    },
    {
      label: "Comments",
      onClick: onComments,
      icon: (
        /* solid chat bubble */
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4 4h16a1.5 1.5 0 0 1 1.5 1.5v10A1.5 1.5 0 0 1 20 17H9.8L5 21.2c-.6.5-1.5.1-1.5-.7V5.5A1.5 1.5 0 0 1 4 4zm3.5 5.3a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zm4.5 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zm4.5 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z" />
        </svg>
      ),
    },
    {
      label: "Ask a question",
      onClick: onAskQuestion,
      icon: (
        /* solid question mark */
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a7.2 7.2 0 0 0-7.2 7h3.1A4.1 4.1 0 0 1 12 5.1c2.3 0 4.1 1.7 4.1 3.8 0 1.6-.9 2.4-2.2 3.4-1.4 1.1-3.2 2.4-3.2 5v.4h3.1v-.4c0-1.3.8-2 2.1-3 1.4-1.1 3.3-2.5 3.3-5.4C19.2 5 16 2 12 2zM12 19.3a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8z" />
        </svg>
      ),
    },
    {
      label: "Leaderboard",
      onClick: onLeaderboard,
      icon: (
        /* solid trophy */
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7 2.5h10v1H20a.8.8 0 0 1 .8.8v2A4.5 4.5 0 0 1 16.6 11a5.3 5.3 0 0 1-3.1 2.2v2.6h2.3a2.2 2.2 0 0 1 2.2 2.2v2.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V18a2.2 2.2 0 0 1 2.2-2.2h2.3v-2.6A5.3 5.3 0 0 1 7.4 11 4.5 4.5 0 0 1 3.2 6.3v-2a.8.8 0 0 1 .8-.8h3v-1zM5 5.3v1a2.7 2.7 0 0 0 1.8 2.6 10 10 0 0 1-.3-3.6H5zm14 0h-1.5a10 10 0 0 1-.3 3.6A2.7 2.7 0 0 0 19 6.3v-1z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className={styles.row} aria-label="Course sections">
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          className={styles.iconBtn}
          onClick={item.onClick}
          aria-label={item.label}
          title={item.label}
        >
          {item.icon}
        </button>
      ))}
    </nav>
  );
}
