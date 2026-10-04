import Image from "next/image";
import styles from "./CoursesHero.module.css";

/** Catalogue hero band: eyebrow, title, subtitle and illustration. */
export default function CoursesHero() {
  return (
    <section className={styles.hero}>
      <Image
        src="/images/hero-art.avif"
        alt=""
        width={1228}
        height={342}
        priority
        className={styles.art}
      />
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            Learn <span aria-hidden="true">·</span> Grow{" "}
            <span aria-hidden="true">·</span> Build
          </p>
          <h1 className={styles.title}>My Courses</h1>
          <p className={styles.subtitle}>
            Continue your learning journey. Pick a course and jump straight
            into the course player — your progress is saved as you learn.
          </p>
        </div>
      </div>
    </section>
  );
}
