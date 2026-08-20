import { cache } from "react"
import { Client } from "@notionhq/client"
import type { Post, NotionBlock } from "@/types"

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const DATA_SOURCE_ID = process.env.NOTION_DATABASE_ID!

/** Notion 데이터 소스에서 발행된 글 목록 조회 */
export async function getPosts(): Promise<Post[]> {
  const results: Record<string, unknown>[] = []
  let cursor: string | undefined

  do {
    const response = await notion.dataSources.query({
      data_source_id: DATA_SOURCE_ID,
      filter: {
        property: "Status",
        status: { equals: "published" },
      },
      sorts: [{ property: "PublishedAt", direction: "descending" }],
      start_cursor: cursor,
    })
    results.push(...(response.results as Record<string, unknown>[]))
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  return results
    .filter((item) => item.object === "page")
    .map((item) => pageToPost(item))
}

/** slug(페이지 ID)로 글 단건 조회 */
export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  try {
    const page = await notion.pages.retrieve({ page_id: slug }) as unknown as Record<string, unknown>
    // 휴지통으로 이동된 페이지는 pages.retrieve가 에러 없이 반환하므로 별도 체크 필요
    if (page.archived || page.in_trash) return null
    return pageToPost(page)
  } catch {
    return null
  }
})

/** 글 페이지의 블록 목록 조회 */
export async function getPostBlocks(pageId: string): Promise<NotionBlock[]> {
  const results: Record<string, unknown>[] = []
  let cursor: string | undefined

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
    })
    results.push(...(response.results as Record<string, unknown>[]))
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  return Promise.all(
    results.map(async (b) => {
      const hasChildren = (b.has_children as boolean) ?? false

      let children: NotionBlock[] = []
      if (hasChildren) {
        children = await getPostBlocks(b.id as string)
      }

      return {
        id: b.id as string,
        type: b.type as string,
        content: (b[b.type as string] ?? {}) as Record<string, unknown>,
        children,
      }
    })
  )
}

// Notion 페이지 응답을 Post 타입으로 변환
function pageToPost(page: Record<string, unknown>): Post {
  const props = (page.properties ?? {}) as Record<string, Record<string, unknown>>

  const title =
    (props.Title?.title as Array<{ plain_text: string }>)?.[0]?.plain_text ?? ""
  const category =
    (props.Category?.select as { name: string } | null)?.name ?? ""
  const tags =
    (props.Tags?.multi_select as Array<{ name: string }>)?.map((t) => t.name) ?? []
  const publishedAt = new Date(
    (props.PublishedAt?.date as { start: string } | null)?.start ?? Date.now()
  )
  const status =
    (props.Status?.status as { name: string } | null)?.name === "published"
      ? "published"
      : "draft"

  const coverRaw = page.cover as
    | { type: "external" | "file"; external?: { url: string }; file?: { url: string } }
    | null
  const cover = coverRaw
    ? {
        type: coverRaw.type,
        url: (coverRaw.type === "external" ? coverRaw.external?.url : coverRaw.file?.url) ?? "",
      }
    : null

  return {
    id: page.id as string,
    title,
    category,
    tags,
    publishedAt,
    status,
    slug: page.id as string,
    cover: cover && cover.url ? cover : null,
  }
}
