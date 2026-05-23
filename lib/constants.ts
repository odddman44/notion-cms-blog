import {
  LayoutDashboard,
  Settings,
  Users,
  BarChart3,
  Layers,
  FileText,
  Zap,
  Database,
  Layout,
  Gauge,
} from "lucide-react"
import type { NavItem, SidebarGroup } from "@/types"

export const APP_NAME = "StarterKit"
export const APP_DESCRIPTION =
  "Next.js + TypeScript + TailwindCSS + ShadcnUI로 빠르게 시작하는 모던 웹 스타터킷"

export const NAV_LINKS: NavItem[] = [
  { label: "홈", href: "/" },
  { label: "대시보드", href: "/dashboard" },
  { label: "예제", href: "/examples" },
]

export const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    label: "메인",
    items: [
      { label: "대시보드", href: "/dashboard", icon: LayoutDashboard },
      { label: "사용자", href: "/dashboard/users", icon: Users },
      { label: "분석", href: "/dashboard/analytics", icon: BarChart3 },
      { label: "설정", href: "/dashboard/settings", icon: Settings },
    ],
  },
  {
    label: "예제",
    items: [
      { label: "컴포넌트", href: "/examples/components", icon: Layers },
      { label: "폼 예제", href: "/examples/forms", icon: FileText },
      { label: "훅 예제", href: "/examples/hooks", icon: Zap },
      { label: "데이터 패칭", href: "/examples/data-fetching", icon: Database },
      { label: "레이아웃", href: "/examples/layout", icon: Layout },
      { label: "최적화", href: "/examples/optimization", icon: Gauge },
    ],
  },
]

export const FOOTER_LINKS = [
  {
    title: "제품",
    items: [
      { label: "기능", href: "#features" },
      { label: "예제 모음", href: "/examples" },
      { label: "대시보드", href: "/dashboard" },
    ],
  },
  {
    title: "개발",
    items: [
      { label: "GitHub", href: "https://github.com" },
    ],
  },
  {
    title: "예제",
    items: [
      { label: "컴포넌트", href: "/examples/components" },
      { label: "폼 예제", href: "/examples/forms" },
      { label: "훅 예제", href: "/examples/hooks" },
    ],
  },
]
