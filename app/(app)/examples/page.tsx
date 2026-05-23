import Link from "next/link"
import { ArrowRight, Layers, FileText, Zap, Database, Layout, Gauge } from "lucide-react"
import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = { title: "예제 모음" }

const examples = [
  {
    icon: Layers,
    title: "컴포넌트 쇼케이스",
    description: "설치된 ShadcnUI 컴포넌트 전체를 한눈에 확인하세요. Button, Card, Dialog, Tabs 등 모든 variant를 실제로 동작하며 확인할 수 있습니다.",
    href: "/examples/components",
    badge: "UI",
  },
  {
    icon: FileText,
    title: "폼 예제",
    description: "react-hook-form + Zod로 타입 안전한 폼을 구현합니다. 실시간 유효성 검사와 sonner 토스트 알림까지 포함합니다.",
    href: "/examples/forms",
    badge: "Form",
  },
  {
    icon: Zap,
    title: "훅 예제",
    description: "usehooks-ts와 react-responsive 기반 커스텀 훅 모음. 디바운스, 클립보드, 윈도우 크기, localStorage 영속화 등을 실제로 체험하세요.",
    href: "/examples/hooks",
    badge: "Hooks",
  },
  {
    icon: Database,
    title: "데이터 패칭",
    description: "Next.js Server Component에서 외부 API를 fetch하는 패턴. Skeleton 로딩, date-fns 날짜 포맷, 에러 처리까지 포함합니다.",
    href: "/examples/data-fetching",
    badge: "Server",
  },
  {
    icon: Layout,
    title: "레이아웃 예제",
    description: "Tailwind CSS로 구현하는 반응형 그리드와 flex 레이아웃 패턴. 1-col → sm:2-col → lg:3-col 반응형 레이아웃을 확인하세요.",
    href: "/examples/layout",
    badge: "Layout",
  },
  {
    icon: Gauge,
    title: "설정 및 최적화",
    description: "Pretendard 폰트 최적화, Metadata API, next/image, 환경변수, Server vs Client Component 분리 전략을 코드와 함께 설명합니다.",
    href: "/examples/optimization",
    badge: "Perf",
  },
]

export default function ExamplesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="예제 모음"
        description="스타터킷에 포함된 기술 스택의 실제 사용 예제를 확인하세요."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {examples.map((ex) => {
          const Icon = ex.icon
          return (
            <Link key={ex.href} href={ex.href} className="group">
              <Card className="h-full transition-colors hover:border-primary/50 hover:bg-accent/30">
                <CardHeader className="pb-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {ex.badge}
                    </span>
                  </div>
                  <CardTitle className="text-base group-hover:text-primary transition-colors">
                    {ex.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3">{ex.description}</CardDescription>
                  <span className="flex items-center gap-1 text-xs font-medium text-primary">
                    보러가기 <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
