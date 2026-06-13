import { Fragment } from "react"
import Image from "next/image"
import type { NotionBlock, NotionRichText } from "@/types"

interface NotionRendererProps {
  blocks: NotionBlock[]
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

/** Notion 블록 배열을 React 컴포넌트로 렌더링 */
export function NotionRenderer({ blocks }: NotionRendererProps) {
  const groups = groupBlocks(blocks)

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {groups.map((group, i) => {
        if (group.type === "list") {
          const ListTag = group.listType
          return (
            <ListTag key={i}>
              {group.items.map((item) => (
                <li key={item.id}>
                  <RichTextList richTexts={(item.content.rich_text as NotionRichText[]) ?? []} />
                  {item.children.length > 0 && <NotionRenderer blocks={item.children} />}
                </li>
              ))}
            </ListTag>
          )
        }
        return <NotionBlockComponent key={group.block.id} block={group.block} />
      })}
    </div>
  )
}

function NotionBlockComponent({ block }: { block: NotionBlock }) {
  const { type, content } = block

  switch (type) {
    case "paragraph":
      return (
        <p>
          <RichTextList richTexts={(content.rich_text as NotionRichText[]) ?? []} />
        </p>
      )

    case "heading_1":
      return (
        <h1>
          <RichTextList richTexts={(content.rich_text as NotionRichText[]) ?? []} />
        </h1>
      )

    case "heading_2":
      return (
        <h2>
          <RichTextList richTexts={(content.rich_text as NotionRichText[]) ?? []} />
        </h2>
      )

    case "heading_3":
      return (
        <h3>
          <RichTextList richTexts={(content.rich_text as NotionRichText[]) ?? []} />
        </h3>
      )

    case "quote":
      return (
        <blockquote>
          <RichTextList richTexts={(content.rich_text as NotionRichText[]) ?? []} />
        </blockquote>
      )

    case "code": {
      const codeText =
        (content.rich_text as NotionRichText[])?.map((rt) => rt.plain_text).join("") ?? ""
      const language = (content.language as string) ?? "plaintext"
      return (
        <pre>
          <code className={`language-${language}`}>{codeText}</code>
        </pre>
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
        <figure>
          <div className="relative aspect-video overflow-hidden rounded-md">
            <Image
              src={url}
              alt={caption}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      )
    }

    case "divider":
      return <hr />

    default:
      return null
  }
}

function RichTextList({ richTexts }: { richTexts: NotionRichText[] }) {
  return (
    <>
      {richTexts.map((rt, i) => {
        const { annotations, plain_text, href } = rt
        let node: React.ReactNode = plain_text

        if (annotations.code) node = <code>{node}</code>
        if (annotations.bold) node = <strong>{node}</strong>
        if (annotations.italic) node = <em>{node}</em>
        if (annotations.strikethrough) node = <s>{node}</s>
        if (annotations.underline) node = <u>{node}</u>
        if (href) node = <a href={href} target="_blank" rel="noopener noreferrer">{node}</a>

        return <Fragment key={i}>{node}</Fragment>
      })}
    </>
  )
}
