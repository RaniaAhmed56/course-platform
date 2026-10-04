import type { LeaderboardEntry } from "@/types/course";

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Mariam Adel", points: 980 },
  { rank: 2, name: "Youssef Tarek", points: 940 },
  { rank: 3, name: "Salma Hassan", points: 895 },
  { rank: 4, name: "You", points: 860, isCurrentUser: true },
  { rank: 5, name: "Omar Khaled", points: 830 },
  { rank: 6, name: "Nada Samir", points: 790 },
];

/**
 * Motivational message from Eng. Ali Shahin — the wording changes with the
 * student's current level, as requested in the design notes (Arabic, with an
 * emoji, sometimes encouraging and sometimes tough love).
 */
export function getMotivationMessage(progress: number): string {
  if (progress >= 85) {
    return "جامد يا وحش 🔥 إنت في القمة فعلاً.. حافظ على مكانك وخلّي الباقي يجري وراك";
  }
  if (progress >= 60) {
    return "عظيم يا صديقي.. أداءك في الكورس ده أفضل من ٦٠٪ من باقي الطلبة.. كمّل عايز أشوف اسمك في الليدر بورد هنا 💪";
  }
  if (progress >= 30) {
    return "ماشي كويس 👏 بس لسه قدامك شوية.. ركّز في الدروس الجاية وهتلاقي نفسك في القمة";
  }
  return "إيه يا بطل، التقدم ده قليل عليك ⏰ شد حيلك شوية.. الطلبة سبقوك وأنا متأكد إنك تقدر تلحقهم";
}
