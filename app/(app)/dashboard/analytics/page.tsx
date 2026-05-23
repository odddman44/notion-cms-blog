import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = { title: "분석" }

const channels = [
  { name: "자연 검색", value: 42, color: "bg-blue-500" },
  { name: "직접 방문", value: 28, color: "bg-green-500" },
  { name: "소셜 미디어", value: 18, color: "bg-purple-500" },
  { name: "추천", value: 12, color: "bg-orange-500" },
]

const stats = [
  { label: "총 페이지뷰", value: "84,320", change: "+14.2%", positive: true },
  { label: "평균 세션시간", value: "3분 24초", change: "+0.8%", positive: true },
  { label: "이탈률", value: "42.1%", change: "-2.3%", positive: true },
  { label: "전환율", value: "3.6%", change: "+0.4%", positive: true },
]

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="분석" description="트래픽 및 사용자 행동 분석">
        <Badge variant="secondary">최근 30일</Badge>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className={`mt-1 text-xs ${stat.positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {stat.change} 지난달 대비
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="traffic">
        <TabsList>
          <TabsTrigger value="traffic">트래픽 채널</TabsTrigger>
          <TabsTrigger value="chart">차트 영역</TabsTrigger>
        </TabsList>
        <TabsContent value="traffic" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>채널별 트래픽</CardTitle>
              <CardDescription>방문자 유입 경로 비율</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {channels.map((ch) => (
                <div key={ch.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{ch.name}</span>
                    <span className="text-muted-foreground">{ch.value}%</span>
                  </div>
                  <Progress value={ch.value} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="chart" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>차트 연동 영역</CardTitle>
              <CardDescription>Recharts 또는 Chart.js를 연동하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
                <p className="text-sm text-muted-foreground">
                  npm install recharts → 차트 컴포넌트를 여기에 배치하세요
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
