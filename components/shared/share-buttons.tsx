"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Check, Link2, X as XIcon } from "lucide-react"
import { useCopyToClipboard } from "@/hooks"
import { Button } from "@/components/ui/button"

interface ShareButtonsProps {
  title: string
}

/** 글 공유 버튼: X(트위터) 공유 인텐트 + 현재 페이지 링크 복사
 *  현재 페이지 URL은 클라이언트에서 window.location.href로 읽어 항상 정확한 절대 경로를 사용 */
export function ShareButtons({ title }: ShareButtonsProps) {
  const [, copy] = useCopyToClipboard()
  const [copied, setCopied] = useState(false)

  const handleShareToX = () => {
    const url = window.location.href
    const intentUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    window.open(intentUrl, "_blank", "noopener,noreferrer")
  }

  const handleCopyLink = async () => {
    const ok = await copy(window.location.href)
    if (ok) {
      setCopied(true)
      toast.success("링크가 복사되었습니다")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleShareToX}
        aria-label="X(트위터)로 공유"
        className="gap-1.5"
      >
        <XIcon className="h-3.5 w-3.5" />
        공유
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        aria-label="링크 복사"
        className="gap-1.5"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
        링크 복사
      </Button>
    </div>
  )
}
