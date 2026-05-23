import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "설정 및 최적화",
  description: "Next.js 16 최적화 기법 모음",
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs leading-relaxed">
      {code}
    </pre>
  )
}

function Section({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          {badge && <Badge variant="secondary">{badge}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">{children}</CardContent>
    </Card>
  )
}

export default function OptimizationPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="설정 및 최적화"
        description="Pretendard 폰트, Metadata, Image 최적화, 환경변수, Server/Client 컴포넌트 전략"
      />

      {/* 폰트 최적화 */}
      <Section title="Pretendard 폰트 최적화" badge="next/font/local">
        <p className="text-sm text-muted-foreground">
          Google Fonts 대신 <code className="text-xs font-mono text-primary">next/font/local</code>로
          woff2 파일을 직접 로드해 FOUT(Flash of Unstyled Text)을 방지하고 성능을 최적화합니다.
        </p>
        <CodeBlock code={`// app/layout.tsx
import localFont from "next/font/local"

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "100 900",   // 가변 폰트: 전 weight 지원
  display: "swap",     // FOIT 방지
})

// html 태그에 CSS 변수 적용
<html className={pretendard.variable}>
  <body className="font-sans">  {/* globals.css에서 --font-sans 연결 */}`} />
      </Section>

      {/* Metadata API */}
      <Section title="Metadata API" badge="SEO">
        <p className="text-sm text-muted-foreground">
          각 페이지에서 <code className="text-xs font-mono text-primary">metadata</code> export로
          정적 메타데이터를, <code className="text-xs font-mono text-primary">generateMetadata</code>로
          동적 메타데이터를 설정합니다.
        </p>
        <CodeBlock code={`// 정적 메타데이터 (page.tsx)
export const metadata: Metadata = {
  title: { default: "앱", template: "%s | 앱" },
  description: "설명",
  openGraph: { title: "OG 타이틀", images: ["/og.png"] },
}

// 동적 메타데이터 (동적 라우트)
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params          // Next.js 16: params는 Promise
  const post = await getPost(id)
  return { title: post.title }
}`} />
      </Section>

      {/* next/image */}
      <Section title="Image 최적화" badge="next/image">
        <p className="text-sm text-muted-foreground">
          <code className="text-xs font-mono text-primary">next/image</code>는 WebP 자동 변환,
          지연 로딩, CLS 방지를 처리합니다.
        </p>
        <CodeBlock code={`import Image from "next/image"

// 정적 import — width/height 자동
import logo from "@/public/logo.png"
<Image src={logo} alt="로고" placeholder="blur" />

// 외부 URL — next.config.ts에 도메인 허용 필요
<Image
  src="https://example.com/img.jpg"
  alt="이미지"
  width={400}
  height={300}
  priority              // LCP 이미지에 사용
/>`} />
      </Section>

      {/* 환경변수 */}
      <Section title="환경변수" badge=".env">
        <CodeBlock code={`# .env.local (gitignore에 포함)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # 클라이언트 노출 가능
DATABASE_URL=postgresql://...              # 서버 전용 (절대 노출 X)

# 코드에서 사용
const url = process.env.NEXT_PUBLIC_APP_URL  // 클라이언트/서버 모두
const db  = process.env.DATABASE_URL          // 서버 전용`} />
      </Section>

      <Separator />

      {/* Server vs Client */}
      <Section title="Server vs Client Component 분리 전략">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              label: "Server Component (기본)",
              color: "border-green-500/30 bg-green-500/5",
              items: ["데이터 패칭 (async/await)", "민감 정보 접근", "DB 쿼리", "SEO 메타데이터", "대형 라이브러리 import"],
            },
            {
              label: "'use client' 필요",
              color: "border-blue-500/30 bg-blue-500/5",
              items: ["useState, useEffect", "이벤트 핸들러 (onClick)", "브라우저 API (window, localStorage)", "서드파티 클라이언트 라이브러리", "실시간 인터랙션"],
            },
          ].map(({ label, color, items }) => (
            <div key={label} className={`rounded-md border p-4 ${color}`}>
              <p className="mb-2 text-sm font-semibold">{label}</p>
              <ul className="flex flex-col gap-1">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="mt-0.5 shrink-0">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          💡 <strong>원칙:</strong> 인터랙션이 필요한 최소 단위 컴포넌트만 Client로 분리하고
          나머지는 Server Component로 유지하면 번들 크기를 최소화할 수 있습니다.
        </p>
      </Section>
    </div>
  )
}
