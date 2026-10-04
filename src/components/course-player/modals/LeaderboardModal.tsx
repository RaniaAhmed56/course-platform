"use client";

import Modal from "@/components/ui/Modal";
import { getMotivationMessage, leaderboard } from "@/data/leaderboard";
import styles from "./LeaderboardModal.module.css";

interface LeaderboardModalProps {
  open: boolean;
  onClose: () => void;
  courseTitle: string;
  progress: number;
}

/**
 * Leaderboard popup — course name + "Leaderboard" heading, a motivational
 * message from Eng. Ali Shahin (Arabic, emoji, tone depends on the student's
 * level) and the ranked list, matching the reference mock.
 */
/**
 * Motivational message box — the emoji is pulled out of the text and shown
 * big (about two lines tall) at the start, like the reference mock.
 */
function MotivationMessage({ text }: { text: string }) {
  const emojiMatch = text.match(/\p{Extended_Pictographic}/u);
  const emoji = emojiMatch ? emojiMatch[0] : "\u{1F4AA}";
  const body = text.replace(/\p{Extended_Pictographic}/gu, "").replace(/\s{2,}/g, " ").trim();
  return (
    <p className={styles.message} dir="rtl" lang="ar">
      <span className={styles.messageEmoji} aria-hidden="true">
        {emoji}
      </span>
      <span className={styles.messageText}>{body}</span>
    </p>
  );
}

export default function LeaderboardModal({
  open,
  onClose,
  courseTitle,
  progress,
}: LeaderboardModalProps) {
  return (
    <Modal open={open} onClose={onClose} label="Course leaderboard">
      <div className={styles.body}>
        <header className={styles.header}>
          <p className={styles.courseName}>{courseTitle}</p>
          <h2 className={styles.title}>Leaderboard</h2>
        </header>

        <MotivationMessage text={getMotivationMessage(progress)} />

        <ol className={styles.panel}>
          {leaderboard.map((entry) => (
            <li
              key={entry.rank}
              className={`${styles.row} ${entry.isCurrentUser ? styles.me : ""}`}
              aria-current={entry.isCurrentUser ? "true" : undefined}
            >
              <span className={styles.rank}>{entry.rank}</span>
              <span className={styles.name}>{entry.name}</span>
              <span className={styles.points}>{entry.points} XP</span>
            </li>
          ))}
        </ol>
      </div>
    </Modal>
  );
}
