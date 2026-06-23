import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { NotionBlock, NotionRichText } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Notion 블록 배열(children 포함 재귀)에서 rich_text의 plain_text를 모두 모아 평문 텍스트로 반환 */
export function extractPlainText(blocks: NotionBlock[]): string {
  let text = ""

  for (const block of blocks) {
    const richText = block.content.rich_text as NotionRichText[] | undefined
    if (richText) {
      text += richText.map((rt) => rt.plain_text).join("") + " "
    }
    if (block.children.length > 0) {
      text += extractPlainText(block.children) + " "
    }
  }

  return text
}

/** 글 본문 블록으로부터 예상 읽기시간(분)을 계산
 *  한글은 500자/분, 영문은 200단어/분 기준으로 분리 집계 후 합산, 최소 1분 보장 */
export function getReadingTime(blocks: NotionBlock[]): number {
  const text = extractPlainText(blocks)

  const koreanCharCount = (text.match(/[가-힣]/g) ?? []).length
  const englishWordCount = text
    .replace(/[가-힣]/g, "")
    .split(/\s+/)
    .filter(Boolean).length

  const minutes = koreanCharCount / 500 + englishWordCount / 200

  return Math.max(1, Math.ceil(minutes))
}
