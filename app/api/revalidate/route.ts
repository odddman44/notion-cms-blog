import { revalidatePath } from "next/cache"
import { type NextRequest } from "next/server"

/**
 * On-demand Revalidation 엔드포인트
 * Notion webhook 등 외부 트리거로 ISR 캐시를 즉시 갱신한다.
 *
 * 인증: 헤더 x-revalidate-secret 우선, 없으면 쿼리 ?secret= 으로 fallback
 * - slug 쿼리가 있으면 해당 글만 갱신
 * - 없으면 홈/목록/상세 전체 갱신
 */
export async function GET(request: NextRequest) {
  const secret =
    request.headers.get("x-revalidate-secret") ??
    request.nextUrl.searchParams.get("secret")

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return Response.json(
      { revalidated: false, now: Date.now(), message: "Invalid secret" },
      { status: 401 },
    )
  }

  const slug = request.nextUrl.searchParams.get("slug")

  try {
    const paths: string[] = []

    if (slug) {
      const path = `/posts/${slug}`
      revalidatePath(path)
      paths.push(path)
    } else {
      revalidatePath("/")
      revalidatePath("/posts")
      revalidatePath("/posts/[slug]", "page")
      paths.push("/", "/posts", "/posts/[slug]")
    }

    return Response.json({ revalidated: true, now: Date.now(), paths })
  } catch {
    return Response.json(
      { revalidated: false, now: Date.now(), message: "Failed to revalidate" },
      { status: 500 },
    )
  }
}
