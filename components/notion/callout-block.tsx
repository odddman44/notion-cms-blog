import Image from "next/image"
import type { NotionBlock, NotionRichText } from "@/types"
import { NOTION_COLOR_MAP } from "@/lib/notion-colors"
import { NotionRenderer, RichTextList } from "@/lib/notion-renderer"

interface CalloutIcon {
  type: "emoji" | "external" | "file"
  emoji?: string
  external?: { url: string }
  file?: { url: string }
}

interface CalloutBlockProps {
  block: NotionBlock
}

/** Notion callout 블록 — 아이콘 + 배경색 박스 */
export function CalloutBlock({ block }: CalloutBlockProps) {
  const { content, children } = block
  const icon = content.icon as CalloutIcon | null
  const richText = (content.rich_text as NotionRichText[]) ?? []
  const color = (content.color as string) ?? "default"

  // 배경색 클래스 (default이면 기본 muted 배경)
  const bgClass =
    color !== "default" && color.endsWith("_background")
      ? NOTION_COLOR_MAP[color]
      : "bg-muted"

  return (
    <div className={`flex gap-3 rounded-lg px-4 py-3 my-3 ${bgClass}`}>
      {/* 아이콘 영역 */}
      <span className="shrink-0 text-xl leading-7">
        {icon?.type === "emoji" && icon.emoji}
        {(icon?.type === "external" || icon?.type === "file") && (
          <Image
            src={(icon.external?.url ?? icon.file?.url)!}
            alt="callout icon"
            width={24}
            height={24}
            className="rounded-sm"
          />
        )}
      </span>

      {/* 본문 영역 */}
      <div className="min-w-0 flex-1">
        <RichTextList richTexts={richText} />
        {children.length > 0 && (
          <NotionRenderer blocks={children} isNested />
        )}
      </div>
    </div>
  )
}
