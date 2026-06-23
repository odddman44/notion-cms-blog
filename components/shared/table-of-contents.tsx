"use client"

import { useEffect, useState } from "react"
import { List } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Heading {
  id: string
  text: string
  level: 1 | 2 | 3
}

interface TableOfContentsProps {
  headings: Heading[]
  variant: "desktop" | "mobile"
}

// heading id로 스크롤 이동 (헤더 높이만큼 여유를 두고 스무스 스크롤)
function scrollToHeading(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
}

function TocList({
  headings,
  activeId,
  onLinkClick,
}: {
  headings: Heading[]
  activeId: string | null
  onLinkClick?: (id: string) => void
}) {
  return (
    <nav aria-label="목차">
      <ul className="space-y-1.5 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToHeading(heading.id)
                onLinkClick?.(heading.id)
              }}
              className={cn(
                "block py-1 transition-colors hover:text-foreground",
                activeId === heading.id
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** 글 본문 heading 기반 목차. 데스크탑은 sticky 사이드, 모바일은 Sheet로 노출.
 *  IntersectionObserver로 현재 뷰포트에 보이는 섹션을 하이라이트한다.
 *  variant별로 별도 마운트되므로 페이지에서 데스크탑/모바일 둘 다 렌더링해도 각자 hidden 처리로 하나만 보임 */
export function TableOfContents({ headings, variant }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    )

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  if (variant === "desktop") {
    return (
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-lg border border-border p-4">
          <p className="mb-2 text-sm font-semibold">목차</p>
          <TocList headings={headings} activeId={activeId} />
        </div>
      </aside>
    )
  }

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <List className="h-4 w-4" />
            목차
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72 p-0">
          <SheetHeader className="border-b px-6 py-4">
            <SheetTitle>목차</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <TocList
              headings={headings}
              activeId={activeId}
              onLinkClick={() => setOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
