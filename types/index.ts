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

export interface Post {
  id: string
  title: string
  category: string
  tags: string[]
  publishedAt: Date
  status: "draft" | "published"
  slug: string
}

export interface NotionRichText {
  plain_text: string
  href: string | null
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: string
  }
}

export interface NotionBlock {
  id: string
  type: string
  content: Record<string, unknown>
  children: NotionBlock[]
}
