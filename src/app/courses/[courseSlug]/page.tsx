import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CoursePlayer from "@/components/course-player/CoursePlayer";
import { courses, getCourseBySlug } from "@/data/courses";

interface PageProps {
  params: Promise<{ courseSlug: string }>;
}

/** Pre-render every course player page at build time. */
export function generateStaticParams() {
  return courses.map((course) => ({ courseSlug: course.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);
  return {
    title: course ? course.title : "Course not found",
    description: course?.shortDescription,
  };
}

/**
 * Server component shell: resolves the course from mock data and hands it to
 * the interactive client player.
 */
export default async function CoursePlayerPage({ params }: PageProps) {
  const { courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);

  if (!course) notFound();

  return <CoursePlayer course={course} />;
}
