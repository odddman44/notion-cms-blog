import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

export interface NavItem {
  label: string
  href: string
}

export interface SidebarItem {
  label: string
  href: string
  icon: LucideIcon
}

export interface SidebarGroup {
  label: string
  items: SidebarItem[]
}

export interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
}
