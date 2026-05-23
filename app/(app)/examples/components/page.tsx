import type { Metadata } from "next"
import { User } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DialogDemo } from "./_dialog-demo"

export const metadata: Metadata = { title: "컴포넌트 쇼케이스" }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export default function ComponentsPage() {
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6">
        <PageHeader title="컴포넌트 쇼케이스" description="설치된 ShadcnUI 컴포넌트 전체 목록" />

        {/* Button */}
        <Section title="Button — Variants">
          <div className="flex flex-wrap gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap gap-2">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon"><User className="h-4 w-4" /></Button>
            <Button disabled>Disabled</Button>
          </div>
        </Section>

        {/* Badge */}
        <Section title="Badge — Variants">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </Section>

        {/* Avatar */}
        <Section title="Avatar">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>김</AvatarFallback>
            </Avatar>
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-base">AB</AvatarFallback>
            </Avatar>
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl">U</AvatarFallback>
            </Avatar>
          </div>
        </Section>

        {/* Form Elements */}
        <Section title="Input + Label + Textarea">
          <div className="flex flex-col gap-4 max-w-sm">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ex-input">이름</Label>
              <Input id="ex-input" placeholder="홍길동" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ex-textarea">메시지</Label>
              <Textarea id="ex-textarea" placeholder="내용을 입력하세요" rows={3} />
            </div>
          </div>
        </Section>

        {/* Select */}
        <Section title="Select">
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="역할 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">관리자</SelectItem>
              <SelectItem value="editor">편집자</SelectItem>
              <SelectItem value="viewer">뷰어</SelectItem>
            </SelectContent>
          </Select>
        </Section>

        {/* Checkbox + Switch */}
        <Section title="Checkbox + Switch">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Checkbox id="ex-check" defaultChecked />
              <Label htmlFor="ex-check" className="cursor-pointer">이메일 수신 동의</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="ex-switch" defaultChecked />
              <Label htmlFor="ex-switch" className="cursor-pointer">알림 활성화</Label>
            </div>
          </div>
        </Section>

        {/* Skeleton + Progress */}
        <Section title="Skeleton + Progress">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span>진행률</span><span>72%</span>
              </div>
              <Progress value={72} />
            </div>
          </div>
        </Section>

        {/* Tabs */}
        <Section title="Tabs">
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">탭 1</TabsTrigger>
              <TabsTrigger value="tab2">탭 2</TabsTrigger>
              <TabsTrigger value="tab3">탭 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-3 text-sm text-muted-foreground">탭 1 콘텐츠입니다.</TabsContent>
            <TabsContent value="tab2" className="mt-3 text-sm text-muted-foreground">탭 2 콘텐츠입니다.</TabsContent>
            <TabsContent value="tab3" className="mt-3 text-sm text-muted-foreground">탭 3 콘텐츠입니다.</TabsContent>
          </Tabs>
        </Section>

        {/* Tooltip + Dialog */}
        <Section title="Tooltip + Dialog">
          <div className="flex flex-wrap gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">툴팁 hover</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Radix UI Tooltip입니다</p>
              </TooltipContent>
            </Tooltip>
            <DialogDemo />
          </div>
        </Section>
      </div>
    </TooltipProvider>
  )
}
