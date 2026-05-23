"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { loginSchema, type LoginFormValues } from "@/lib/validations"
import { Logo } from "@/components/shared/logo"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  function onSubmit(values: LoginFormValues) {
    console.log(values)
    toast.success("로그인 성공!", {
      description: `${values.email}님, 환영합니다.`,
    })
    form.reset()
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <Logo />
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">로그인</CardTitle>
            <CardDescription>
              이메일과 비밀번호를 입력하여 로그인하세요
            </CardDescription>
            <CardAction>
              <Button variant="link" asChild className="px-0">
                <Link href="/register">회원가입</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                id="login-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이메일</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="hello@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>비밀번호</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button
              form="login-form"
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "로그인 중..." : "로그인하기"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
