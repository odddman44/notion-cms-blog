import { Badge } from "@/components/ui/badge"

interface CategoryBadgeProps {
  category: string
  className?: string
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  if (!category) return null
  return (
    <Badge variant="secondary" className={className}>
      {category}
    </Badge>
  )
}
