import { format } from "date-fns"
import { ko } from "date-fns/locale"
import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = { title: "사용자 관리" }

type Role = "관리자" | "편집자" | "뷰어"

const users = [
  { name: "김민준", email: "minjun@example.com", role: "관리자" as Role, status: "활성", joinedAt: new Date("2026-01-15") },
  { name: "이서연", email: "seoyeon@example.com", role: "편집자" as Role, status: "활성", joinedAt: new Date("2026-02-03") },
  { name: "박지호", email: "jiho@example.com", role: "뷰어" as Role, status: "비활성", joinedAt: new Date("2026-02-20") },
  { name: "최수아", email: "sua@example.com", role: "편집자" as Role, status: "활성", joinedAt: new Date("2026-03-08") },
  { name: "정도윤", email: "doyoon@example.com", role: "뷰어" as Role, status: "활성", joinedAt: new Date("2026-04-01") },
  { name: "한지민", email: "jimin@example.com", role: "뷰어" as Role, status: "대기", joinedAt: new Date("2026-05-02") },
]

const roleVariant: Record<Role, "default" | "secondary" | "outline"> = {
  관리자: "default",
  편집자: "secondary",
  뷰어: "outline",
}

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="사용자 관리" description={`총 ${users.length}명의 사용자`}>
        <Button size="sm">+ 사용자 추가</Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "전체 사용자", value: users.length },
          { label: "활성", value: users.filter((u) => u.status === "활성").length },
          { label: "비활성/대기", value: users.filter((u) => u.status !== "활성").length },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>사용자</TableHead>
              <TableHead>역할</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">가입일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.email}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={roleVariant[user.role]} className="text-xs">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={`text-xs font-medium ${user.status === "활성" ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {format(user.joinedAt, "yyyy.MM.dd", { locale: ko })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
