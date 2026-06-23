import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryBadge } from "@/components/shared/category-badge"
import type { Post } from "@/types"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <Card className="h-full overflow-hidden transition-colors hover:border-primary/50">
        {post.cover && (
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={post.cover.url}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="mb-2 flex items-center gap-2">
            <CategoryBadge category={post.category} />
          </div>
          <CardTitle className="line-clamp-2 text-base font-semibold group-hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <time className="text-xs text-muted-foreground">
            {format(post.publishedAt, "yyyy년 M월 d일", { locale: ko })}
          </time>
        </CardContent>
      </Card>
    </Link>
  )
}
