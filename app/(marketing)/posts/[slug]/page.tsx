import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { getPostBySlug, getPostBlocks, getPosts } from "@/lib/notion"
import { NotionRenderer, extractHeadings } from "@/lib/notion-renderer"
import { CategoryBadge } from "@/components/shared/category-badge"
import { TagBadge } from "@/components/shared/tag-badge"
import { TableOfContents } from "@/components/shared/table-of-contents"
import { ShareButtons } from "@/components/shared/share-buttons"
import { ScrollProgress } from "@/components/shared/scroll-progress"
import { getReadingTime } from "@/lib/utils"
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
  const headings = extractHeadings(blocks)
  const readingTime = getReadingTime(blocks)

  // 이전/다음 글 탐색 (getPosts()는 PublishedAt 내림차순 정렬이므로 다음 인덱스가 더 과거 글)
  const posts = await getPosts()
  const currentIndex = posts.findIndex((p) => p.slug === post.slug)
  const prevPost = currentIndex !== -1 ? posts[currentIndex + 1] : undefined
  const nextPost = currentIndex !== -1 ? posts[currentIndex - 1] : undefined

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <ScrollProgress />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_240px]">
        <article className="max-w-3xl">
          {/* 목록으로 돌아가기 */}
          <Link
            href="/posts"
            className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            목록으로 돌아가기
          </Link>

          {/* 커버 이미지 */}
          {post.cover && (
            <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={post.cover.url}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 768px, 100vw"
                className="object-cover"
              />
            </div>
          )}

          {/* 글 헤더 */}
          <header className="mb-10">
            <div className="mb-3 flex items-center gap-2">
              <CategoryBadge category={post.category} color={post.categoryColor} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <time>{format(post.publishedAt, "yyyy년 M월 d일", { locale: ko })}</time>
              <span aria-hidden="true">·</span>
              <span>약 {readingTime}분</span>
            </div>
            {post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <TagBadge key={tag.name} tag={tag} />
                ))}
              </div>
            )}
            <div className="mt-6">
              <ShareButtons title={post.title} />
            </div>
          </header>

          {/* 모바일 목차 (Sheet) — 컴포넌트 내부에서 lg:hidden 처리 */}
          <div className="mb-6">
            <TableOfContents headings={headings} variant="mobile" />
          </div>

          {/* 본문 */}
          <NotionRenderer blocks={blocks} />

          {/* 이전/다음 글 네비게이션 */}
          {(prevPost || nextPost) && (
            <nav className="mt-12 grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-2">
              {prevPost ? (
                <Link
                  href={`/posts/${prevPost.slug}`}
                  className="group flex flex-col gap-1 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    이전 글
                  </span>
                  <span className="line-clamp-2 text-sm font-medium group-hover:text-foreground">
                    {prevPost.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {nextPost && (
                <Link
                  href={`/posts/${nextPost.slug}`}
                  className="group flex flex-col gap-1 rounded-lg border border-border p-4 text-right transition-colors hover:bg-muted/50 sm:col-start-2"
                >
                  <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                    다음 글
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  <span className="line-clamp-2 text-sm font-medium group-hover:text-foreground">
                    {nextPost.title}
                  </span>
                </Link>
              )}
            </nav>
          )}
        </article>

        {/* 데스크탑 목차 (sticky 사이드) — 컴포넌트 내부에서 hidden lg:block 처리 */}
        <TableOfContents headings={headings} variant="desktop" />
      </div>
    </div>
  )
}
