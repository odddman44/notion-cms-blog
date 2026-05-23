import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Users, DollarSign, Activity, TrendingUp } from "lucide-react"
import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata: Metadata = {
  title: "대시보드",
}

const stats = [
  {
    title: "총 사용자",
    value: "12,340",
    change: "+8.1%",
    icon: Users,
    trend: "up",
  },
  {
    title: "월 수익",
    value: "₩4,280,000",
    change: "+12.4%",
    icon: DollarSign,
    trend: "up",
  },
  {
    title: "활성 세션",
    value: "1,892",
    change: "+3.2%",
    icon: Activity,
    trend: "up",
  },
  {
    title: "전환율",
    value: "3.6%",
    change: "-0.4%",
    icon: TrendingUp,
    trend: "down",
  },
]

const recentActivities = [
  { user: "김민준", email: "minjun@example.com", action: "가입", status: "완료", date: new Date("2026-05-11") },
  { user: "이서연", email: "seoyeon@example.com", action: "구매", status: "완료", date: new Date("2026-05-11") },
  { user: "박지호", email: "jiho@example.com", action: "문의", status: "대기", date: new Date("2026-05-10") },
  { user: "최수아", email: "sua@example.com", action: "가입", status: "완료", date: new Date("2026-05-10") },
  { user: "정도윤", email: "doyoon@example.com", action: "구매", status: "처리중", date: new Date("2026-05-09") },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="대시보드"
        description={`${format(new Date(), "yyyy년 M월 d일 EEEE", { locale: ko })} 기준`}
      >
        <Button size="sm">리포트 내보내기</Button>
      </PageHeader>

      {/* 통계 카드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p
                  className={`mt-1 text-xs ${
                    stat.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {stat.change} 지난달 대비
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 탭 콘텐츠 */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="analytics">분석</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>최근 활동</CardTitle>
              <CardDescription>최근 5건의 사용자 활동입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>사용자</TableHead>
                    <TableHead>활동</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">날짜</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map((activity) => (
                    <TableRow key={activity.email}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {activity.user[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{activity.user}</p>
                            <p className="text-xs text-muted-foreground">{activity.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{activity.action}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            activity.status === "완료"
                              ? "default"
                              : activity.status === "대기"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {activity.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {format(activity.date, "M월 d일", { locale: ko })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>분석</CardTitle>
              <CardDescription>차트 라이브러리를 연동해 데이터를 시각화하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-48 items-center justify-center rounded-md border border-dashed">
                <p className="text-sm text-muted-foreground">
                  Recharts 또는 Chart.js를 여기에 추가하세요
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
