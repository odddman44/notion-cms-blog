import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = { title: "레이아웃 예제" }

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-semibold">{children}</span>
      <Separator className="flex-1" />
    </div>
  )
}

export default function LayoutPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="레이아웃 예제" description="Tailwind CSS 반응형 레이아웃 패턴 모음" />

      {/* 반응형 그리드 */}
      <div className="flex flex-col gap-4">
        <SectionLabel>반응형 그리드 — grid-cols-1 → sm:2 → lg:3</SectionLabel>
        <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
          {"<div className=\"grid gap-4 sm:grid-cols-2 lg:grid-cols-3\">"}
        </pre>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex h-20 items-center justify-center rounded-md border bg-muted/40 text-sm font-medium text-muted-foreground">
              Item {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* 4컬럼 그리드 */}
      <div className="flex flex-col gap-4">
        <SectionLabel>4컬럼 통계 카드 — sm:2 → lg:4</SectionLabel>
        <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
          {"<div className=\"grid gap-4 sm:grid-cols-2 lg:grid-cols-4\">"}
        </pre>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {["사용자", "수익", "세션", "전환율"].map((label) => (
            <Card key={label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">—</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-col gap-4">
        <SectionLabel>사이드바 레이아웃 — flex + 고정 너비</SectionLabel>
        <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
          {"<div className=\"flex gap-4\">\n  <aside className=\"w-48 shrink-0\" />\n  <main className=\"flex-1\" />\n</div>"}
        </pre>
        <div className="flex gap-4 rounded-md border p-3">
          <aside className="flex w-40 shrink-0 flex-col gap-1 rounded-md bg-muted/40 p-3">
            {["메뉴 1", "메뉴 2", "메뉴 3"].map((m) => (
              <div key={m} className="rounded px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent">
                {m}
              </div>
            ))}
          </aside>
          <main className="flex min-h-24 flex-1 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            콘텐츠 영역 (flex-1)
          </main>
        </div>
      </div>

      {/* Flex 패턴 */}
      <div className="flex flex-col gap-4">
        <SectionLabel>Flex 패턴 — justify-between, items-center</SectionLabel>
        <div className="flex flex-col gap-3">
          {[
            { label: "justify-between", cls: "flex items-center justify-between" },
            { label: "justify-center", cls: "flex items-center justify-center gap-4" },
            { label: "justify-end", cls: "flex items-center justify-end gap-2" },
          ].map(({ label, cls }) => (
            <div key={label} className="rounded-md border p-3">
              <p className="mb-2 text-xs text-muted-foreground font-mono">{label}</p>
              <div className={`${cls} rounded bg-muted/30 p-2`}>
                <Badge variant="outline">A</Badge>
                <Badge variant="outline">B</Badge>
                <Badge variant="outline">C</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
