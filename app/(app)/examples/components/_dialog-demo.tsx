"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Dialog 열기</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>모달 다이얼로그</DialogTitle>
          <DialogDescription>
            Radix UI 기반의 접근성 높은 Dialog 컴포넌트입니다. ESC 키로 닫거나 바깥을 클릭하면 닫힙니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">취소</Button>
          <Button>확인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
