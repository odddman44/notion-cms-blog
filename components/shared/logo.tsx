import Link from "next/link"
import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { APP_NAME } from "@/lib/constants"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 font-bold", className)}>
      <Zap className="h-5 w-5 text-primary" />
      <span>{APP_NAME}</span>
    </Link>
  )
}
