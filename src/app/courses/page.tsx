import type { Metadata } from "next";
import SiteHeader from "@/components/courses/SiteHeader";
import CoursesHero from "@/components/courses/CoursesHero";
import CourseCatalogue from "@/components/courses/CourseCatalogue";
import { courses } from "@/data/courses";
import styles from "./courses.module.css";

export const metadata: Metadata = {
  title: "My Courses",
  description: "Browse all available courses and continue where you left off.",
};

/**
 * Course catalogue — server component shell (header + hero are static);
 * the filterable grid is the only client part.
 */
export default function CoursesPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <CoursesHero />
        <CourseCatalogue courses={courses} />
      </main>
    </div>
  );
}
