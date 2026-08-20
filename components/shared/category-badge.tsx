import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { NOTION_COLOR_MAP } from "@/lib/notion-colors"
import type { NotionTagColor } from "@/types"

interface CategoryBadgeProps {
  category: string
  color?: NotionTagColor
  className?: string
}

export function CategoryBadge({ category, color, className }: CategoryBadgeProps) {
  if (!category) return null

  // Notion에서 카테고리 색을 지정하지 않은 경우(default)는 테마 accent 톤으로 대체
  const colorClass =
    color && color !== "default"
      ? cn(
          "border-transparent",
          NOTION_COLOR_MAP[color],
          NOTION_COLOR_MAP[`${color}_background`]
        )
      : "border-transparent bg-primary/10 text-primary"

  return (
    <Badge variant="secondary" className={cn(colorClass, className)}>
      {category}
    </Badge>
  )
}
