"use client";

import { useEffect } from "react";
import styles from "./Toast.module.css";

/** Small transient notification (e.g. clicking a locked lesson). */
export default function Toast({
  message,
  onDone,
}: {
  message: string | null;
  onDone: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onDone, 2800);
    return () => window.clearTimeout(timer);
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div className={styles.toast} role="status">
      {message}
    </div>
  );
}
