import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/shared/post-card"
import { getPosts } from "@/lib/notion"

export const revalidate = 3600

export default async function HomePage() {
  const posts = await getPosts()
  const recentPosts = posts.slice(0, 6)

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <section className="mb-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Daily Blog
        </h1>
        <p className="mt-3 text-muted-foreground">
          일상과 개발 이야기를 기록합니다.
        </p>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">최신 글</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/posts">
              전체 글 보기 <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {recentPosts.length === 0 ? (
          <p className="text-sm text-muted-foreground">아직 발행된 글이 없습니다.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
