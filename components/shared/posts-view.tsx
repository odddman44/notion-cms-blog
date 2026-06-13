"use client"

import { useState, useMemo } from "react"
import { PostCard } from "@/components/shared/post-card"
import { SearchInput } from "@/components/shared/search-input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Post } from "@/types"

interface PostsViewProps {
  posts: Post[]
  categories: string[]
}

export function PostsView({ posts, categories }: PostsViewProps) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesQuery = post.title.toLowerCase().includes(query.toLowerCase())
      const matchesCategory =
        activeCategory === null || post.category === activeCategory
      return matchesQuery && matchesCategory
    })
  }, [posts, query, activeCategory])

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">전체 글</h1>

      {/* 검색 */}
      <div className="mb-6">
        <SearchInput value={query} onChange={setQuery} />
      </div>

      {/* 카테고리 탭 */}
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="카테고리 필터">
          <Button
            variant="ghost"
            size="sm"
            aria-pressed={activeCategory === null}
            className={cn(activeCategory === null && "bg-accent")}
            onClick={() => setActiveCategory(null)}
          >
            전체
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant="ghost"
              size="sm"
              aria-pressed={activeCategory === cat}
              className={cn(activeCategory === cat && "bg-accent")}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      )}

      {/* 글 목록 */}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">검색 결과가 없습니다.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
