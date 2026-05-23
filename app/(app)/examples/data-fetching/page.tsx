import { format } from "date-fns"
import { ko } from "date-fns/locale"
import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = { title: "데이터 패칭" }

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=6", {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error("데이터를 불러오지 못했습니다")
  return res.json()
}

export default async function DataFetchingPage() {
  const posts = await getPosts()
  const fetchedAt = new Date()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="데이터 패칭"
        description="Next.js Server Component에서 외부 API를 fetch하는 패턴"
      >
        <Badge variant="secondary">
          {format(fetchedAt, "HH:mm:ss", { locale: ko })} 기준
        </Badge>
      </PageHeader>

      {/* 패턴 설명 */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4">
          <pre className="overflow-x-auto text-xs">
{`// Server Component — async/await 직접 사용 가능
export default async function Page() {
  const posts = await fetch("https://api.example.com/posts", {
    next: { revalidate: 60 },  // ISR: 60초마다 갱신
  }).then(r => r.json())

  return <PostList posts={posts} />
}`}
          </pre>
        </CardContent>
      </Card>

      {/* 실제 데이터 */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
          JSONPlaceholder API 응답 ({posts.length}개)
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-2 text-sm capitalize leading-snug">
                    {post.title}
                  </CardTitle>
                  <Badge variant="outline" className="shrink-0 text-xs">
                    #{post.id}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3 text-xs">
                  {post.body}
                </CardDescription>
                <p className="mt-2 text-xs text-muted-foreground/60">
                  User {post.userId} · {format(fetchedAt, "yyyy.MM.dd", { locale: ko })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 패칭 전략 설명 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Next.js 데이터 패칭 전략</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "정적 (SSG)", code: "fetch(url)", desc: "빌드 시 한 번만 패칭" },
            { label: "재검증 (ISR)", code: "next: { revalidate: 60 }", desc: "N초마다 백그라운드 갱신" },
            { label: "동적 (SSR)", code: "no-store", desc: "요청마다 새로 패칭" },
          ].map((s) => (
            <div key={s.label} className="rounded-md border p-3">
              <p className="text-xs font-semibold">{s.label}</p>
              <code className="text-xs text-primary">{s.code}</code>
              <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
