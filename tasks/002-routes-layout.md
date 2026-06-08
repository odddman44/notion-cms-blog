# 002 — T002 검증: 라우트 구조 및 레이아웃 골격 생성

- 관련 ROADMAP 항목: `docs/ROADMAP.md` T002 (Phase 1)
- 검증 방식: 정적 코드 대조 (코드 변경 없음)
- 종합 결과: **통과 (6/6)**

## 검증 항목별 결과

| # | 검증 항목 | 결과 | 근거 |
|---|---|---|---|
| 1 | `app/layout.tsx` 루트 레이아웃 (Pretendard + Geist Mono) | ✅ 통과 | `localFont({ ..., variable: "--font-pretendard" })` + `Geist_Mono({ variable: "--font-geist-mono" })` 적용 |
| 2 | `app/(marketing)/layout.tsx` 라우트 그룹 레이아웃 | ✅ 통과 | `<Header />` + `<main className="flex-1">{children}</main>` + `<Footer />` 구성 |
| 3 | `app/(marketing)/page.tsx` (홈) | ✅ 통과 | `export default async function HomePage()` 존재 |
| 4 | `app/(marketing)/posts/page.tsx` (글 목록) | ✅ 통과 | `export default async function PostsPage()` 존재 |
| 5 | `app/(marketing)/posts/[slug]/page.tsx` (글 상세) | ✅ 통과 | `export default async function PostPage()` 존재 |
| 6 | `ThemeProvider` 및 `Toaster` 마운트 | ✅ 통과 | `app/layout.tsx`: `<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>{children}<Toaster richColors position="top-right" /></ThemeProvider>` |

## 결론

명세된 6개 항목 모두 코드에서 확인되어 **전 항목 통과**로 판정. 미흡 사항 없음.
