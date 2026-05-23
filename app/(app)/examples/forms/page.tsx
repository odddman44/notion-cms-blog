"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { contactSchema, type ContactFormValues } from "@/lib/validations"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export default function FormsPage() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "", agree: false },
  })

  function onSubmit(values: ContactFormValues) {
    console.log(values)
    toast.success("메시지가 전송되었습니다!", {
      description: `${values.name}님, 빠른 시일 내에 답변 드리겠습니다.`,
    })
    form.reset()
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="폼 예제"
        description="react-hook-form + Zod로 구현한 타입 안전 폼"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 폼 */}
        <Card>
          <CardHeader>
            <CardTitle>문의 폼</CardTitle>
            <CardDescription>실시간 유효성 검사 + 제출 시 sonner toast</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이름</FormLabel>
                        <FormControl><Input placeholder="홍길동" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이메일</FormLabel>
                        <FormControl><Input type="email" placeholder="hello@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>제목</FormLabel>
                      <FormControl><Input placeholder="문의 제목을 입력하세요" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>메시지</FormLabel>
                      <FormControl>
                        <Textarea placeholder="문의 내용을 입력하세요" rows={4} className="resize-none" {...field} />
                      </FormControl>
                      <FormDescription>최대 500자</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agree"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-3">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div>
                        <FormLabel className="cursor-pointer">답변 이메일 수신에 동의합니다</FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "전송 중..." : "문의 전송"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* 코드 설명 */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">사용 라이브러리</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {[
                { name: "react-hook-form", desc: "폼 상태 관리, 최소 리렌더링" },
                { name: "zod", desc: "TypeScript-first 스키마 검증" },
                { name: "@hookform/resolvers", desc: "RHF + Zod 연결 어댑터" },
                { name: "sonner", desc: "아름다운 Toast 알림" },
              ].map((lib) => (
                <div key={lib.name} className="flex items-start gap-3 rounded-md border p-3">
                  <code className="text-xs font-mono text-primary shrink-0">{lib.name}</code>
                  <span className="text-xs text-muted-foreground">{lib.desc}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">폼 검증 규칙</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
{`const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string()
    .min(10).max(500),
  agree: z.boolean()
    .refine(v => v === true),
})`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
