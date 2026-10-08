"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import type { CourseComment } from "@/types/course";
import { initialComments } from "@/data/comments";
import { readJSON, writeJSON } from "@/lib/storage";
import { ArrowRightIcon } from "@/components/ui/Icon";
import styles from "./CommentsSection.module.css";

function formatToday(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Comments list + "Write a comment" form. New comments appear in the list
 * immediately and are kept per-course in localStorage.
 */
export default function CommentsSection({ courseId }: { courseId: string }) {
  const storageKey = `course-comments:${courseId}`;
  const [comments, setComments] = useState<CourseComment[]>(initialComments);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const saved = readJSON<CourseComment[]>("local", storageKey);
    if (saved?.length) {
      setComments([...initialComments, ...saved]);
    }
  }, [storageKey]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;

    const comment: CourseComment = {
      id: `local-${Date.now()}`,
      author: "You",
      date: formatToday(),
      body,
    };

    setComments((previous) => [...previous, comment]);
    const saved = readJSON<CourseComment[]>("local", storageKey) ?? [];
    writeJSON("local", storageKey, [...saved, comment]);
    setDraft("");
  };

  return (
    <section aria-labelledby="comments-title" className={styles.root}>
      <h2 id="comments-title" className={styles.title}>
        Comments
      </h2>

      <ul className={styles.list}>
        {comments.map((comment) => (
          <li key={comment.id} className={styles.comment}>
            {comment.avatar ? (
              <Image
                src={comment.avatar}
                alt=""
                width={64}
                height={64}
                className={styles.avatar}
              />
            ) : (
              <span className={styles.avatarFallback} aria-hidden="true">
                {comment.author.charAt(0)}
              </span>
            )}
            <div className={styles.commentBody}>
              <h3 className={styles.author}>{comment.author}</h3>
              <p className={styles.date}>{comment.date}</p>
              <p className={styles.text} dir="auto">{comment.body}</p>
            </div>
          </li>
        ))}
      </ul>

      <form id="comment-form" className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="comment-box" className="sr-only">
          Write a comment
        </label>
        <textarea
          id="comment-box"
          dir="auto"
          className={styles.textarea}
          placeholder="Write a comment"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={6}
        />
      </form>
    </section>
  );
}

/**
 * Submit button for the comment form. Rendered by the page outside the
 * form (linked via the `form` attribute) so the curriculum sidebar can end
 * exactly at the textarea, like the reference layout.
 */
export function CommentsSubmitButton() {
  return (
    <button type="submit" form="comment-form" className={styles.submit}>
      Submit Review
      <ArrowRightIcon size={17} />
    </button>
  );
}
