"use client";

import { useEffect, useState, type FormEvent } from "react";
import Modal from "@/components/ui/Modal";
import { ArrowRightIcon } from "@/components/ui/Icon";
import { readJSON, removeKey, writeJSON } from "@/lib/storage";
import styles from "./AskQuestionModal.module.css";

interface AskQuestionModalProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
}

/**
 * "Ask a Question" popup — same design language as the comment form.
 * The draft is kept in sessionStorage, so accidentally closing the popup
 * and reopening it in the same session restores what was typed.
 */
export default function AskQuestionModal({ open, onClose, courseId }: AskQuestionModalProps) {
  const draftKey = `ask-question-draft:${courseId}`;
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(readJSON<string>("session", draftKey) ?? "");
      setSent(false);
    }
  }, [open, draftKey]);

  const handleChange = (value: string) => {
    setDraft(value);
    writeJSON("session", draftKey, value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    removeKey("session", draftKey);
    setDraft("");
    setSent(true);
  };

  return (
    <Modal open={open} onClose={onClose} label="Ask a question">
      <div className={styles.body}>
        <h2 className={styles.title}>Ask a Question</h2>
        <p className={styles.hint}>
          Your question goes directly to the instructor. If you close this
          popup by mistake, your draft stays saved for this session.
        </p>

        {sent ? (
          <div className={styles.success} role="status">
            <p className={styles.successTitle}>Question sent ✅</p>
            <p>The instructor will reply in the comments section.</p>
            <button type="button" className={styles.submit} onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="ask-question-box" className="sr-only">
              Write your question
            </label>
            <textarea
              id="ask-question-box"
              className={styles.textarea}
              placeholder="Write your question"
              value={draft}
              onChange={(event) => handleChange(event.target.value)}
              rows={6}
            />
            <button type="submit" className={styles.submit} disabled={!draft.trim()}>
              Send Question
              <ArrowRightIcon size={16} />
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
}
