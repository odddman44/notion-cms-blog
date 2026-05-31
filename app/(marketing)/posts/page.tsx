import { getPosts } from "@/lib/notion"
import { PostsView } from "@/components/shared/posts-view"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "전체 글",
}

export const revalidate = 3600

export default async function PostsPage() {
  const posts = await getPosts()
  const categories = Array.from(
    new Set(posts.map((p) => p.category).filter(Boolean))
  )

  return <PostsView posts={posts} categories={categories} />
}
