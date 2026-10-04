"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CloseIcon } from "./Icon";
import styles from "./Modal.module.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name of the dialog. */
  label: string;
  children: ReactNode;
  /** "dialog" = centered card, "screen" = near-fullscreen popup (PDF / Exam). */
  size?: "dialog" | "screen";
  /** Extra class for the dialog panel (e.g. the blue exam background). */
  panelClassName?: string;
  /** Hide the default close button (the exam draws its own chrome). */
  hideCloseButton?: boolean;
}

/**
 * Accessible modal: closes on Escape / backdrop click, locks body scroll
 * and moves focus into the dialog while open.
 */
export default function Modal({
  open,
  onClose,
  label,
  children,
  size = "dialog",
  panelClassName,
  hideCloseButton = false,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.classList.add("modal-open");
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("modal-open");
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`${styles.panel} ${size === "screen" ? styles.screen : styles.dialog} ${panelClassName ?? ""}`}
      >
        {!hideCloseButton && (
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close popup"
          >
            <CloseIcon size={18} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
