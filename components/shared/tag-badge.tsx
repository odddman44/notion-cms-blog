import { Badge } from "@/components/ui/badge"

interface TagBadgeProps {
  tag: string
  className?: string
}

export function TagBadge({ tag, className }: TagBadgeProps) {
  return (
    <Badge variant="outline" className={className}>
      #{tag}
    </Badge>
  )
}
