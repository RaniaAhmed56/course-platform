import type { Metadata } from "next";
import { Suspense } from "react";
import SiteHeader from "@/components/courses/SiteHeader";
import HomeDashboard from "@/components/home/HomeDashboard";
import { courses } from "@/data/courses";
import styles from "../courses/courses.module.css";

export const metadata: Metadata = {
  title: "Home",
  description: "Your learning dashboard: progress, continue learning and quick links.",
};

/** Home dashboard — server shell; the dashboard itself reads local progress. */
export default function HomePage() {
  return (
    <div className={styles.page}>
      <Suspense>
        <SiteHeader />
      </Suspense>
      <main>
        <HomeDashboard courses={courses} />
      </main>
    </div>
  );
}
