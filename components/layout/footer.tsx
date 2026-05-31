import { APP_NAME } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
