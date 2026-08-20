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

/** Notion multi_select 옵션 색상 (select 속성 color enum과 동일) */
export type NotionTagColor =
  | "default"
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red"

export interface Tag {
  name: string
  color: NotionTagColor
}

export interface Post {
  id: string
  title: string
  category: string
  categoryColor: NotionTagColor
  tags: Tag[]
  publishedAt: Date
  status: "draft" | "published"
  slug: string
  cover: { type: "external" | "file"; url: string } | null
}

export interface NotionRichText {
  type: "text" | "equation" | "mention"
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
  equation?: { expression: string }
}

export interface NotionBlock {
  id: string
  type: string
  content: Record<string, unknown>
  children: NotionBlock[]
}
