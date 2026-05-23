"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, Copy, Minus, Plus } from "lucide-react"
import {
  useDebounceValue,
  useCopyToClipboard,
  useWindowSize,
  useIsMobile,
  useLocalStorage,
} from "@/hooks"

function DebounceDemo() {
  const [value, setValue] = useDebounceValue("", 300)
  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="입력하면 300ms 후 반영됩니다"
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">디바운스 결과:</span>
        <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs">
          {value || "(비어있음)"}
        </code>
      </div>
    </div>
  )
}

function ClipboardDemo() {
  const [copiedText, copy] = useCopyToClipboard()
  const code = "npm create next-app@latest --typescript"

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2">
        <code className="flex-1 text-xs font-mono">{code}</code>
        <button
          onClick={() => copy(code)}
          className="shrink-0 rounded p-1 hover:bg-accent"
        >
          {copiedText ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      {copiedText && (
        <p className="text-xs text-green-600 dark:text-green-400">✓ 복사되었습니다</p>
      )}
    </div>
  )
}

function WindowSizeDemo() {
  const { width, height } = useWindowSize()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center rounded-md border px-6 py-3">
        <span className="text-2xl font-bold">{mounted ? (width ?? "—") : "—"}</span>
        <span className="text-xs text-muted-foreground">width (px)</span>
      </div>
      <div className="flex flex-col items-center rounded-md border px-6 py-3">
        <span className="text-2xl font-bold">{mounted ? (height ?? "—") : "—"}</span>
        <span className="text-xs text-muted-foreground">height (px)</span>
      </div>
    </div>
  )
}

function MobileDemo() {
  const isMobile = useIsMobile()
  return (
    <div className="flex items-center gap-3">
      <Badge variant={isMobile ? "default" : "secondary"}>
        {isMobile ? "📱 모바일" : "🖥️ 데스크탑"}
      </Badge>
      <span className="text-sm text-muted-foreground">
        (브라우저 너비 768px 기준)
      </span>
    </div>
  )
}

function LocalStorageDemo() {
  const [count, setCount] = useLocalStorage("hook-counter", { defaultValue: 0 })
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => setCount((c: number) => c - 1)}>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center text-2xl font-bold">{count}</span>
        <Button variant="outline" size="icon" onClick={() => setCount((c: number) => c + 1)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">페이지를 새로고침해도 값이 유지됩니다</p>
    </div>
  )
}

export default function HooksPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="훅 예제"
        description="usehooks-ts + react-responsive + use-local-storage-state 실제 동작 데모"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">useDebounceValue</CardTitle>
            <CardDescription>입력을 300ms 지연해 검색 API 호출 횟수를 줄입니다</CardDescription>
          </CardHeader>
          <CardContent><DebounceDemo /></CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">useCopyToClipboard</CardTitle>
            <CardDescription>텍스트를 클립보드에 복사하고 상태를 반환합니다</CardDescription>
          </CardHeader>
          <CardContent><ClipboardDemo /></CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">useWindowSize</CardTitle>
            <CardDescription>브라우저 창 크기를 실시간으로 추적합니다</CardDescription>
          </CardHeader>
          <CardContent><WindowSizeDemo /></CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">useIsMobile (react-responsive)</CardTitle>
            <CardDescription>미디어 쿼리로 모바일/데스크탑 환경을 감지합니다</CardDescription>
          </CardHeader>
          <CardContent><MobileDemo /></CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">useLocalStorage (use-local-storage-state)</CardTitle>
            <CardDescription>React state처럼 사용하면서 localStorage에 자동 영속화합니다</CardDescription>
          </CardHeader>
          <CardContent>
            <LocalStorageDemo />
            <Separator className="my-4" />
            <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
{`import { useLocalStorage } from "@/hooks"

const [count, setCount] = useLocalStorage("key", {
  defaultValue: 0,
})

// React useState와 완전히 동일한 API
setCount(prev => prev + 1)`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
