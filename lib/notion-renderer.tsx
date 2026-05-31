import Image from "next/image"
import type { NotionBlock, NotionRichText } from "@/types"

interface NotionRendererProps {
  blocks: NotionBlock[]
}

/** Notion 블록 배열을 React 컴포넌트로 렌더링 */
export function NotionRenderer({ blocks }: NotionRendererProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {blocks.map((block) => (
        <NotionBlockComponent key={block.id} block={block} />
      ))}
    </div>
  )
}

function NotionBlockComponent({ block }: { block: NotionBlock }) {
  const { type, content, children } = block

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

    case "bulleted_list_item":
      return (
        <ul>
          <li>
            <RichTextList richTexts={(content.rich_text as NotionRichText[]) ?? []} />
            {children.length > 0 && <NotionRenderer blocks={children} />}
          </li>
        </ul>
      )

    case "numbered_list_item":
      return (
        <ol>
          <li>
            <RichTextList richTexts={(content.rich_text as NotionRichText[]) ?? []} />
            {children.length > 0 && <NotionRenderer blocks={children} />}
          </li>
        </ol>
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
          <Image
            src={url}
            alt={caption}
            width={800}
            height={600}
            className="rounded-md"
          />
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

        if (annotations.code) node = <code key={i}>{node}</code>
        if (annotations.bold) node = <strong key={i}>{node}</strong>
        if (annotations.italic) node = <em key={i}>{node}</em>
        if (annotations.strikethrough) node = <s key={i}>{node}</s>
        if (annotations.underline) node = <u key={i}>{node}</u>
        if (href) node = <a key={i} href={href} target="_blank" rel="noopener noreferrer">{node}</a>

        return <span key={i}>{node}</span>
      })}
    </>
  )
}
