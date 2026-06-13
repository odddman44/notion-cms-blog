"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useDebounceCallback } from "@/hooks"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder = "글 제목 검색..." }: SearchInputProps) {
  // 입력 표시값은 즉시 반영, 상위 컴포넌트로의 onChange 전파만 300ms 지연 처리
  const [inputValue, setInputValue] = useState(value)
  const debouncedOnChange = useDebounceCallback(onChange, 300)

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value)
          debouncedOnChange(e.target.value)
        }}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  )
}
