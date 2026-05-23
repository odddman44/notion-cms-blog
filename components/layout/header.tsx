import Link from "next/link"
import { Logo } from "@/components/shared/logo"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Button } from "@/components/ui/button"
import { NAV_LINKS } from "@/lib/constants"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/login">로그인</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
