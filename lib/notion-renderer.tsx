import { Fragment } from "react"
import Image from "next/image"
import { createHighlighter } from "shiki"
import type { NotionBlock, NotionRichText } from "@/types"
import { NOTION_COLOR_MAP } from "@/lib/notion-colors"
import { EquationBlock } from "@/components/notion/equation-block"
import { CodeBlock } from "@/components/notion/code-block"
import { CalloutBlock } from "@/components/notion/callout-block"
import { BookmarkBlock } from "@/components/notion/bookmark-block"
import { VideoBlock } from "@/components/notion/video-block"
import { FileDown } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// 모듈 스코프 싱글턴 — 서버에서 최초 1회만 초기화
const highlighterPromise = createHighlighter({
  themes: ["github-light", "github-dark"],
  langs: [
    "javascript", "typescript", "python", "bash", "json", "css", "html",
    "jsx", "tsx", "markdown", "sql", "yaml", "go", "rust", "java",
    "kotlin", "swift", "cpp", "c", "shell", "plaintext",
  ],
})

interface NotionRendererProps {
  blocks: NotionBlock[]
  isNested?: boolean
}

type BlockGroup =
  | { type: "list"; listType: "ul" | "ol"; items: NotionBlock[] }
  | { type: "block"; block: NotionBlock }

// 연속된 같은 타입의 리스트 아이템을 하나의 ul/ol로 그룹핑
function groupBlocks(blocks: NotionBlock[]): BlockGroup[] {
  const groups: BlockGroup[] = []

  for (const block of blocks) {
    if (block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
      const listType = block.type === "bulleted_list_item" ? "ul" : "ol"
      const last = groups[groups.length - 1]
      if (last?.type === "list" && last.listType === listType) {
        last.items.push(block)
      } else {
        groups.push({ type: "list", listType, items: [block] })
      }
    } else {
      groups.push({ type: "block", block })
    }
  }

  return groups
}

const listContent = (groups: BlockGroup[]) =>
  groups.map((group, i) => {
    if (group.type === "list") {
      const ListTag = group.listType
      return (
        <ListTag
          key={i}
          className={
            ListTag === "ul"
              ? "my-2 ml-6 list-disc space-y-1"
              : "my-2 ml-6 list-decimal space-y-1"
          }
        >
          {group.items.map((item) => (
            <li key={item.id}>
              <RichTextList richTexts={(item.content.rich_text as NotionRichText[]) ?? []} />
              {item.children.length > 0 && (
                <NotionRenderer blocks={item.children} isNested />
              )}
            </li>
          ))}
        </ListTag>
      )
    }
    return <NotionBlockComponent key={group.block.id} block={group.block} />
  })

/** Notion 블록 배열을 React 컴포넌트로 렌더링
 *  isNested=true이면 prose wrapper 없이 Fragment로 반환 (중첩 시 wrapper 중복 방지) */
export function NotionRenderer({ blocks, isNested }: NotionRendererProps) {
  const groups = groupBlocks(blocks)

  if (isNested) {
    return <>{listContent(groups)}</>
  }

  return (
    <div className="max-w-none space-y-4 text-base leading-7 text-foreground">
      {listContent(groups)}
    </div>
  )
}

async function NotionBlockComponent({ block }: { block: NotionBlock }) {
  const { type, content } = block

  switch (type) {
    case "paragraph":
      return (
        <p className="my-2 leading-7">
          <RichTextList richTexts={(content.rich_text as NotionRichText[]) ?? []} />
        </p>
      )

    case "heading_1":
      return (
        <h1 className="mt-8 mb-4 text-3xl font-bold tracking-tight">
          <RichTextList richTexts={(content.rich_text as NotionRichText[]) ?? []} />
        </h1>
      )

    case "heading_2":
      return (
        <h2 className="mt-6 mb-3 text-2xl font-semibold tracking-tight">
          <RichTextList richTexts={(content.rich_text as NotionRichText[]) ?? []} />
        </h2>
      )

    case "heading_3":
      return (
        <h3 className="mt-4 mb-2 text-xl font-semibold">
          <RichTextList richTexts={(content.rich_text as NotionRichText[]) ?? []} />
        </h3>
      )

    case "quote":
      return (
        <blockquote className="my-4 border-l-4 border-border pl-4 italic text-muted-foreground">
          <RichTextList richTexts={(content.rich_text as NotionRichText[]) ?? []} />
        </blockquote>
      )

    case "to_do": {
      const checked = content.checked as boolean
      return (
        <div className="flex items-start gap-2 my-1">
          <input
            type="checkbox"
            checked={checked}
            disabled
            readOnly
            className="mt-1 h-4 w-4 rounded border-gray-300 accent-foreground"
          />
          <span className={checked ? "line-through text-muted-foreground" : ""}>
            <RichTextList richTexts={(content.rich_text as NotionRichText[]) ?? []} />
          </span>
          {block.children.length > 0 && (
            <div className="ml-6">
              <NotionRenderer blocks={block.children} isNested />
            </div>
          )}
        </div>
      )
    }

    case "code": {
      const plainText =
        (content.rich_text as NotionRichText[])?.map((rt) => rt.plain_text).join("") ?? ""
      const rawLang = (content.language as string) ?? "plaintext"
      const caption =
        (content.caption as NotionRichText[])?.map((rt) => rt.plain_text).join("") ?? ""

      // Shiki가 지원하는 언어 목록에 없으면 plaintext로 fallback
      const SUPPORTED_LANGS = new Set([
        "javascript", "typescript", "python", "bash", "json", "css", "html",
        "jsx", "tsx", "markdown", "sql", "yaml", "go", "rust", "java",
        "kotlin", "swift", "cpp", "c", "shell", "plaintext",
      ])
      const language = SUPPORTED_LANGS.has(rawLang) ? rawLang : "plaintext"

      const highlighter = await highlighterPromise
      const html = highlighter.codeToHtml(plainText, {
        lang: language,
        themes: { light: "github-light", dark: "github-dark" },
      })

      return (
        <CodeBlock
          html={html}
          plainText={plainText}
          language={rawLang}
          caption={caption || undefined}
        />
      )
    }

    case "image": {
      const imageContent = content as {
        type?: string
        external?: { url: string }
        file?: { url: string }
        caption?: NotionRichText[]
      }
      const url =
        imageContent.type === "external"
          ? imageContent.external?.url
          : imageContent.file?.url
      const caption = imageContent.caption
        ?.map((rt) => rt.plain_text)
        .join("") ?? ""

      if (!url) return null
      return (
        <figure className="my-4">
          <div className="relative aspect-video overflow-hidden rounded-md">
            <Image
              src={url}
              alt={caption}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
          {caption && (
            <figcaption className="mt-2 text-sm text-center text-muted-foreground">
              {caption}
            </figcaption>
          )}
        </figure>
      )
    }

    case "equation": {
      const expression = (content.expression as string) ?? ""
      return <EquationBlock expression={expression} displayMode={true} />
    }

    case "callout":
      return <CalloutBlock block={block} />

    case "toggle": {
      const toggleText = (content.rich_text as NotionRichText[]) ?? []
      return (
        <details className="my-2 rounded-lg border border-border">
          <summary className="cursor-pointer list-none flex items-center gap-2 px-4 py-2 font-medium select-none hover:bg-muted/50">
            <span className="text-muted-foreground">▶</span>
            <RichTextList richTexts={toggleText} />
          </summary>
          <div className="px-4 pb-3 pt-1">
            <NotionRenderer blocks={block.children} isNested />
          </div>
        </details>
      )
    }

    case "table": {
      const hasColumnHeader = content.has_column_header as boolean
      const tableRows = block.children

      return (
        <div className="my-4">
          <Table>
            {hasColumnHeader && tableRows.length > 0 && (
              <TableHeader>
                <TableRow>
                  {((tableRows[0].content.cells as NotionRichText[][]) ?? []).map(
                    (cell, ci) => (
                      <TableHead key={ci}>
                        <RichTextList richTexts={cell} />
                      </TableHead>
                    )
                  )}
                </TableRow>
              </TableHeader>
            )}
            <TableBody>
              {tableRows.slice(hasColumnHeader ? 1 : 0).map((row) => (
                <TableRow key={row.id}>
                  {((row.content.cells as NotionRichText[][]) ?? []).map((cell, ci) => (
                    <TableCell key={ci}>
                      <RichTextList richTexts={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )
    }

    case "column_list": {
      const columnCount = block.children.length
      return (
        <div
          className="my-4 grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
        >
          {block.children.map((col) => (
            <div key={col.id}>
              <NotionRenderer blocks={col.children} isNested />
            </div>
          ))}
        </div>
      )
    }

    case "column":
      return <NotionRenderer blocks={block.children} isNested />

    case "synced_block":
      return <NotionRenderer blocks={block.children} isNested />

    case "bookmark":
    case "embed": {
      const url = (content.url as string) ?? ""
      const captionArr = (content.caption as NotionRichText[]) ?? []
      const caption = captionArr.map((rt) => rt.plain_text).join("")
      if (!url) return null
      return <BookmarkBlock url={url} caption={caption || undefined} />
    }

    case "video": {
      const videoContent = content as {
        type?: string
        external?: { url: string }
        file?: { url: string }
        caption?: NotionRichText[]
      }
      const url =
        videoContent.type === "external"
          ? videoContent.external?.url
          : videoContent.file?.url
      const captionArr = videoContent.caption ?? []
      const caption = captionArr.map((rt) => rt.plain_text).join("")
      if (!url) return null
      return <VideoBlock url={url} caption={caption || undefined} />
    }

    case "audio": {
      const audioContent = content as {
        type?: string
        external?: { url: string }
        file?: { url: string }
      }
      const url =
        audioContent.type === "external"
          ? audioContent.external?.url
          : audioContent.file?.url
      if (!url) return null
      return (
        <audio controls src={url} className="w-full my-2 rounded-md" />
      )
    }

    case "pdf":
    case "file": {
      const fileContent = content as {
        type?: string
        name?: string
        external?: { url: string }
        file?: { url: string }
      }
      const url =
        fileContent.type === "external"
          ? fileContent.external?.url
          : fileContent.file?.url
      const filename = fileContent.name ?? url?.split("/").pop() ?? "파일"
      if (!url) return null
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 my-2 text-sm text-primary underline hover:opacity-80"
        >
          <FileDown size={16} />
          {filename}
        </a>
      )
    }

    case "divider":
      return <hr className="my-6 border-border" />

    default:
      return null
  }
}

export function RichTextList({ richTexts }: { richTexts: NotionRichText[] }) {
  return (
    <>
      {richTexts.map((rt, i) => {
        const { annotations, plain_text, href } = rt

        // 인라인 equation: KaTeX로 렌더링
        if (rt.type === "equation") {
          const expr = rt.equation?.expression ?? plain_text
          return <EquationBlock key={i} expression={expr} displayMode={false} />
        }

        let node: React.ReactNode = plain_text

        if (annotations.code) node = <code>{node}</code>
        if (annotations.bold) node = <strong>{node}</strong>
        if (annotations.italic) node = <em>{node}</em>
        if (annotations.strikethrough) node = <s>{node}</s>
        if (annotations.underline) node = <u>{node}</u>
        if (href) node = <a href={href} target="_blank" rel="noopener noreferrer">{node}</a>

        // Notion 색상 어노테이션 처리
        const colorClass = annotations.color !== "default"
          ? NOTION_COLOR_MAP[annotations.color]
          : undefined
        if (colorClass) node = <span className={colorClass}>{node}</span>

        return <Fragment key={i}>{node}</Fragment>
      })}
    </>
  )
}
