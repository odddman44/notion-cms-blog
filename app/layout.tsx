import type { Metadata } from "next"
import localFont from "next/font/local"
import { Geist_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/providers/theme-provider"
import "./globals.css"

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "100 900",
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "StarterKit",
    template: "%s | StarterKit",
  },
  description:
    "Next.js + TypeScript + TailwindCSS + ShadcnUI로 빠르게 시작하는 모던 웹 스타터킷",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${pretendard.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
