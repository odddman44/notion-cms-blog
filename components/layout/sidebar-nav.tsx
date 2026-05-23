"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SIDEBAR_GROUPS } from "@/lib/constants"
import { Separator } from "@/components/ui/separator"

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-4 p-3">
      {SIDEBAR_GROUPS.map((group, groupIndex) => (
        <div key={group.label}>
          {groupIndex > 0 && <Separator className="mb-3" />}
          <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
            {group.label}
          </p>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}
