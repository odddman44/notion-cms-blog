import { MobileNav } from "@/components/layout/mobile-nav"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { UserNav } from "@/components/shared/user-nav"

export function Topbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="md:hidden">
        <MobileNav />
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  )
}
