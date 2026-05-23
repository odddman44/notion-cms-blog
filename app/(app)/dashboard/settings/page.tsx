"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
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
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { profileSchema, type ProfileFormValues } from "@/lib/validations"
import { useLocalStorage } from "@/hooks"

export default function SettingsPage() {
  const [savedProfile, setSavedProfile] = useLocalStorage<ProfileFormValues>(
    "profile-settings",
    {
      defaultValue: {
        name: "",
        email: "",
        bio: "",
        notifications: true,
      },
    }
  )

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: savedProfile,
  })

  function onSubmit(values: ProfileFormValues) {
    setSavedProfile(values)
    toast.success("설정이 저장되었습니다", {
      description: "프로필 정보가 성공적으로 업데이트되었습니다.",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="설정" description="프로필과 알림 설정을 관리합니다." />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* 프로필 설정 */}
          <Card>
            <CardHeader>
              <CardTitle>프로필</CardTitle>
              <CardDescription>공개 프로필 정보를 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input placeholder="홍길동" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input type="email" placeholder="hello@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>바이오</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="자기소개를 입력하세요 (최대 200자)"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>최대 200자까지 입력 가능합니다.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* 알림 설정 */}
          <Card>
            <CardHeader>
              <CardTitle>알림</CardTitle>
              <CardDescription>알림 수신 방법을 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="notifications"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel>이메일 알림</FormLabel>
                        <FormDescription>
                          새로운 업데이트와 소식을 이메일로 받습니다.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Separator />

          <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "저장 중..." : "설정 저장"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
