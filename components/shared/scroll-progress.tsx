"use client"

import { useEffect, useState } from "react"

/** 페이지 스크롤 진행률을 0~100%로 계산해 상단 고정 바로 표시
 *  scroll 이벤트를 passive로 등록해 스크롤 성능에 영향을 주지 않음 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const ratio = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0
      setProgress(Math.min(100, Math.max(0, ratio)))
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent">
      <div
        className="h-full bg-primary transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
