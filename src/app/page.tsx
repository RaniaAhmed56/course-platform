import { redirect } from "next/navigation";

/** The course catalogue is the home experience. */
export default function HomePage() {
  redirect("/courses");
}
