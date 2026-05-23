import Link from "next/link"
import {
  Zap,
  Palette,
  Shield,
  Layers,
  Moon,
  Gauge,
  ArrowRight,
  ExternalLink,
  FileText,
  Database,
  Layout,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    icon: Zap,
    title: "빠른 시작",
    description: "모든 설정이 완료된 상태로 즉시 개발을 시작할 수 있습니다.",
  },
  {
    icon: Palette,
    title: "ShadcnUI",
    description: "아름답고 접근성 높은 Radix UI 기반 컴포넌트를 제공합니다.",
  },
  {
    icon: Shield,
    title: "타입 안전",
    description: "TypeScript + Zod로 런타임 에러를 컴파일 타임에 잡아냅니다.",
  },
  {
    icon: Layers,
    title: "레이어드 아키텍처",
    description: "마케팅/앱 Route Group으로 레이아웃을 명확하게 분리합니다.",
  },
  {
    icon: Moon,
    title: "다크 모드",
    description: "next-themes 기반 시스템 설정 연동 다크모드를 지원합니다.",
  },
  {
    icon: Gauge,
    title: "최적화된 성능",
    description: "Server Components 우선 설계로 최소한의 클라이언트 번들만 전송합니다.",
  },
]

const examples = [
  { icon: Layers, title: "컴포넌트 쇼케이스", description: "Button, Card, Dialog, Tabs 등 모든 ShadcnUI 컴포넌트를 실제로 확인하세요.", href: "/examples/components" },
  { icon: FileText, title: "폼 예제", description: "react-hook-form + Zod 타입 안전 폼과 실시간 유효성 검사를 체험하세요.", href: "/examples/forms" },
  { icon: Zap, title: "훅 예제", description: "디바운스, 클립보드, localStorage 영속화 등 커스텀 훅을 실제로 체험하세요.", href: "/examples/hooks" },
  { icon: Database, title: "데이터 패칭", description: "Server Component fetch 패턴과 ISR, 로딩 스켈레톤을 확인하세요.", href: "/examples/data-fetching" },
  { icon: Layout, title: "레이아웃 예제", description: "반응형 그리드, 사이드바, flex 패턴 등 레이아웃 기법을 모아뒀습니다.", href: "/examples/layout" },
  { icon: Gauge, title: "설정 및 최적화", description: "폰트, 이미지, 메타데이터, 환경변수, Server/Client 분리 전략을 설명합니다.", href: "/examples/optimization" },
]

const techStack = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "TailwindCSS v4",
  "ShadcnUI",
  "react-hook-form",
  "Zod",
  "next-themes",
  "sonner",
  "date-fns",
]

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-8 px-4 py-24 text-center sm:py-32">
        <Badge variant="secondary" className="gap-1.5">
          <Zap className="h-3 w-3" />
          모던 웹 스타터킷
        </Badge>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          더 빠르게 시작하는{" "}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            모던 웹 개발
          </span>
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Next.js, TypeScript, TailwindCSS, ShadcnUI가 이미 설정된 스타터킷으로
          아이디어를 즉시 제품으로 만들어보세요.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/dashboard">
              대시보드 보기 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-3">기능</Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              모든 것이 준비되어 있습니다
            </h2>
            <p className="mt-3 text-muted-foreground">
              검증된 라이브러리와 베스트 프랙티스로 구성된 스타터킷
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="border bg-background">
                  <CardHeader className="pb-3">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="border-t px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-3">예제 모음</Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              실제 동작하는 예제로 배우세요
            </h2>
            <p className="mt-3 text-muted-foreground">
              설치된 기술 스택을 직접 체험할 수 있는 예제 페이지 모음
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {examples.map((ex) => {
              const Icon = ex.icon
              return (
                <Link key={ex.href} href={ex.href} className="group">
                  <Card className="h-full border bg-background transition-colors hover:border-primary/50">
                    <CardHeader className="pb-3">
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-base group-hover:text-primary transition-colors">
                        {ex.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-2">{ex.description}</CardDescription>
                      <span className="flex items-center gap-1 text-xs font-medium text-primary">
                        예제 보기 <ArrowRight className="h-3 w-3" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <p className="mb-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
            사용 기술 스택
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {techStack.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            지금 바로 시작하세요
          </h2>
          <p className="mt-4 text-muted-foreground">
            설정 없이 바로 개발을 시작할 수 있습니다.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/dashboard">
                대시보드로 이동 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
