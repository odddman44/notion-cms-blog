// Notion 색상 → Tailwind 클래스 매핑
// Tailwind v4 동적 클래스 생성 불가 — 모든 클래스명을 완전한 문자열 리터럴로 명시
export const NOTION_COLOR_MAP: Record<string, string> = {
  // 텍스트 색상
  gray: "text-gray-500 dark:text-gray-400",
  brown: "text-amber-800 dark:text-amber-600",
  orange: "text-orange-600 dark:text-orange-400",
  yellow: "text-yellow-600 dark:text-yellow-400",
  green: "text-green-600 dark:text-green-400",
  blue: "text-blue-600 dark:text-blue-400",
  purple: "text-purple-600 dark:text-purple-400",
  pink: "text-pink-600 dark:text-pink-400",
  red: "text-red-600 dark:text-red-400",

  // 배경 색상
  gray_background: "bg-gray-100 dark:bg-gray-800/50",
  brown_background: "bg-amber-100 dark:bg-amber-900/30",
  orange_background: "bg-orange-100 dark:bg-orange-900/30",
  yellow_background: "bg-yellow-100 dark:bg-yellow-900/30",
  green_background: "bg-green-100 dark:bg-green-900/30",
  blue_background: "bg-blue-100 dark:bg-blue-900/30",
  purple_background: "bg-purple-100 dark:bg-purple-900/30",
  pink_background: "bg-pink-100 dark:bg-pink-900/30",
  red_background: "bg-red-100 dark:bg-red-900/30",
}
