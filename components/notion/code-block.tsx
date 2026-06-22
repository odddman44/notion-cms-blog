"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Check, Copy } from "lucide-react"
import { useCopyToClipboard } from "@/hooks"

interface CodeBlockProps {
  html: string
  plainText: string
  language: string
  caption?: string
}

/** Shiki HTML을 렌더링하고 복사 버튼과 언어 뱃지를 제공하는 클라이언트 컴포넌트 */
export function CodeBlock({ html, plainText, language, caption }: CodeBlockProps) {
  const [, copy] = useCopyToClipboard()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const ok = await copy(plainText)
    if (ok) {
      setCopied(true)
      toast.success("복사됨")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="my-4">
      <div className="relative group rounded-md overflow-hidden border border-border">
        {/* 언어 뱃지 + 복사 버튼 */}
        <div className="absolute right-2 top-2 flex items-center gap-2 z-10">
          {language && language !== "plaintext" && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {language}
            </span>
          )}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="코드 복사"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>

        {/* Shiki로 생성된 하이라이팅 HTML */}
        <div
          className="[&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      {caption && (
        <p className="mt-1.5 text-sm text-muted-foreground text-center">{caption}</p>
      )}
    </div>
  )
}
