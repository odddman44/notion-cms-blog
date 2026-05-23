import Link from "next/link"
import { Logo } from "@/components/shared/logo"
import { FOOTER_LINKS, APP_NAME } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-3 text-sm text-muted-foreground">
              모던 웹 개발을 위한 최고의 시작점
            </p>
          </div>
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold">{group.title}</h3>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
