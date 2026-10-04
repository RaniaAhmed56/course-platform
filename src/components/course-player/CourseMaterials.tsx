import type { Course } from "@/types/course";
import {
  ClockIcon,
  EnrolledIcon,
  GlobeIcon,
  LessonsIcon,
} from "@/components/ui/Icon";
import styles from "./CourseMaterials.module.css";

interface Row {
  icon: React.ReactNode;
  label: string;
  value: string;
  mobileOnly?: boolean;
}

/**
 * Course Materials card. Two identical fact columns on desktop/tablet
 * (exactly like the reference) and one column with the instructor row on
 * mobile (as in the mobile reference).
 */
export default function CourseMaterials({ course }: { course: Course }) {
  const rows: Row[] = [
    {
      icon: <EnrolledIcon size={24} />,
      label: "Instructor:",
      value: course.instructor,
      mobileOnly: true,
    },
    { icon: <ClockIcon size={24} />, label: "Duration:", value: `${course.durationWeeks} weeks` },
    { icon: <LessonsIcon size={24} />, label: "Lessons:", value: `${course.lessonsCount}` },
    {
      icon: <EnrolledIcon size={24} />,
      label: "Enrolled:",
      value: `${course.enrolledStudents} students`,
    },
    { icon: <GlobeIcon size={24} />, label: "Language:", value: course.language },
  ];

  const renderColumn = (withInstructor: boolean, key: string) => (
    <dl className={styles.column} key={key}>
      {rows
        .filter((row) => withInstructor || !row.mobileOnly)
        .map((row) => (
          <div
            key={`${key}-${row.label}`}
            className={`${styles.row} ${row.mobileOnly ? styles.mobileOnlyRow : ""}`}
          >
            <dt className={styles.label}>
              <span className={styles.icon}>{row.icon}</span>
              {row.label}
            </dt>
            <dd className={styles.value}>{row.value}</dd>
          </div>
        ))}
    </dl>
  );

  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>Course Materials</p>
      <div className={styles.columns}>
        {renderColumn(true, "col-1")}
        {renderColumn(false, "col-2")}
      </div>
    </div>
  );
}
