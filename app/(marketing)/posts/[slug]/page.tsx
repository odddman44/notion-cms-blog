import { notFound } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { ArrowLeft } from "lucide-react"
import { getPostBySlug, getPostBlocks, getPosts } from "@/lib/notion"
import { NotionRenderer } from "@/lib/notion-renderer"
import { CategoryBadge } from "@/components/shared/category-badge"
import { TagBadge } from "@/components/shared/tag-badge"
import type { Metadata } from "next"

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: `${post.category} — ${format(post.publishedAt, "yyyy년 M월 d일", { locale: ko })}`,
  }
}

export const revalidate = 3600

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const blocks = await getPostBlocks(post.id)

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      {/* 목록으로 돌아가기 */}
      <Link
        href="/posts"
        className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        목록으로 돌아가기
      </Link>

      {/* 글 헤더 */}
      <header className="mb-10">
        <div className="mb-3 flex items-center gap-2">
          <CategoryBadge category={post.category} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <time className="mt-3 block text-sm text-muted-foreground">
          {format(post.publishedAt, "yyyy년 M월 d일", { locale: ko })}
        </time>
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}
      </header>

      {/* 본문 */}
      <NotionRenderer blocks={blocks} />
    </article>
  )
}
