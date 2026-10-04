import type { CourseComment } from "@/types/course";

/** Initial comments — identical to the reference design. */
export const initialComments: CourseComment[] = [
  {
    id: "c1",
    author: "Student Name Goes Here",
    avatar: "/images/avatars/student-1.jpg",
    date: "Oct 10, 2021",
    body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "c2",
    author: "Student Name Goes Here",
    avatar: "/images/avatars/student-2.jpg",
    date: "Oct 15, 2021",
    body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "c3",
    author: "Student Name Goes Here",
    avatar: "/images/avatars/student-3.jpg",
    date: "Oct 19, 2021",
    body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];
