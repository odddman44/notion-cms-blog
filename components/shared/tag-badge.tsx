import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { NOTION_COLOR_MAP } from "@/lib/notion-colors"
import type { Tag } from "@/types"

interface TagBadgeProps {
  tag: Tag
  className?: string
}

export function TagBadge({ tag, className }: TagBadgeProps) {
  // default(색 미지정)는 기존 무채색 outline 유지, 그 외엔 Notion 색상의 텍스트+배경 조합 적용
  const colorClass =
    tag.color !== "default"
      ? cn(
          "border-transparent",
          NOTION_COLOR_MAP[tag.color],
          NOTION_COLOR_MAP[`${tag.color}_background`]
        )
      : undefined

  return (
    <Badge variant="outline" className={cn(colorClass, className)}>
      #{tag.name}
    </Badge>
  )
}
