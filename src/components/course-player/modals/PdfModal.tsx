"use client";

import type { Lesson } from "@/types/course";
import Modal from "@/components/ui/Modal";
import styles from "./PdfModal.module.css";

interface PdfModalProps {
  open: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  courseId: string;
}

/**
 * PDF materials popup — opens screen-sized and can simply be closed,
 * per the design notes.
 */
export default function PdfModal({ open, onClose, lesson, courseId }: PdfModalProps) {
  return (
    <Modal open={open} onClose={onClose} label="Course material PDF" size="screen">
      <div className={styles.body}>
        <header className={styles.header}>
          <h2 className={styles.title}>{lesson?.title ?? "Course material"}</h2>
          <span className={styles.badge}>PDF</span>
        </header>
        <iframe
          className={styles.frame}
          src={`/materials/${courseId}.pdf`}
          title={`PDF: ${lesson?.title ?? "Course material"}`}
        />
      </div>
    </Modal>
  );
}
