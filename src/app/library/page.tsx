import type { Metadata } from "next";
import { Suspense } from "react";
import SiteHeader from "@/components/courses/SiteHeader";
import LibraryContent from "@/components/library/LibraryContent";
import { courses } from "@/data/courses";
import styles from "../courses/courses.module.css";

export const metadata: Metadata = {
  title: "Library",
  description: "All your course materials, reading files and completed courses in one place.",
};

/** Library — server shell; the content merges locally saved progress. */
export default function LibraryPage() {
  return (
    <div className={styles.page}>
      <Suspense>
        <SiteHeader />
      </Suspense>
      <main>
        <LibraryContent courses={courses} />
      </main>
    </div>
  );
}
