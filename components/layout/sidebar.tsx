import { Logo } from "@/components/shared/logo"
import { UserNav } from "@/components/shared/user-nav"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { Separator } from "@/components/ui/separator"

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-muted/20 md:flex">
      <div className="flex h-14 items-center border-b px-6">
        <Logo />
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <SidebarNav />
      </div>
      <Separator />
      <div className="flex items-center gap-3 px-5 py-4">
        <UserNav />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">사용자</p>
          <p className="truncate text-xs text-muted-foreground">user@example.com</p>
        </div>
      </div>
    </aside>
  )
}
