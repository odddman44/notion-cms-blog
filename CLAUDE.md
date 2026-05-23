# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 명령어

```bash
npm run dev      # 개발 서버 실행 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 실행
```

테스트 도구는 현재 설정되어 있지 않음.

## 아키텍처

### 라우트 그룹 구조

두 개의 라우트 그룹으로 레이아웃이 분리되어 있음:

- `app/(marketing)/` — 랜딩 페이지 등 공개 페이지. `Header` + `Footer` 레이아웃 사용.
- `app/(app)/` — 인증된 사용자 영역. `Sidebar` + `Topbar` 레이아웃 사용.
- `app/layout.tsx` — 루트 레이아웃. `ThemeProvider`와 `Toaster`를 전체에 적용.

### 주요 디렉토리 역할

- `components/ui/` — shadcn/ui 컴포넌트. 직접 수정하지 말고 `shadcn` CLI로 추가/업데이트.
- `components/layout/` — 라우트 그룹별 레이아웃 구성 컴포넌트 (Sidebar, Topbar, Header, Footer 등).
- `components/shared/` — 여러 레이아웃에서 공통으로 쓰이는 컴포넌트 (Logo, ThemeToggle, PageHeader 등).
- `lib/constants.ts` — 내비게이션 링크(`NAV_LINKS`), 사이드바 그룹(`SIDEBAR_GROUPS`), 푸터 링크 등 UI 상수 정의.
- `lib/validations.ts` — zod 스키마로 폼 유효성 검사 정의.
- `types/index.ts` — 공통 타입 정의 (`NavItem`, `SidebarItem`, `SidebarGroup` 등).
- `hooks/` — 커스텀 훅 모음. `hooks/index.ts`에서 전체 re-export. 외부 패키지 직접 import 금지, 반드시 `@/hooks`에서 import.
- `components/providers/` — 전역 Context Provider (ThemeProvider 등). `app/layout.tsx`에서 마운트.
- `lib/utils.ts` — `cn()` 유틸리티 함수 (clsx + tailwind-merge). className 조합 시 항상 사용.

### 스택 주의사항

- **Next.js 16**: 훈련 데이터와 다를 수 있는 breaking change가 있음. 코드 작성 전 `node_modules/next/dist/docs/` 참고.
- **Tailwind CSS v4**: `tailwind.config.js` 없음. 설정은 `app/globals.css`의 `@theme` 블록에서 CSS 변수로 관리.
- **shadcn/ui**: `radix-nova` 스타일 사용. 컴포넌트 추가 시 `npx shadcn add <component>` 사용.
- **폼**: `react-hook-form` + `@hookform/resolvers/zod` 조합. 스키마는 `lib/validations.ts`에 정의.
- **경로 alias**: `@/` → 프로젝트 루트 (예: `@/components/ui/button`).
- **폰트**: Pretendard(한국어, `--font-pretendard`) + Geist Mono(`--font-mono`). CSS 변수로 참조.
- **아이콘**: `lucide-react` 패키지 사용. 타입은 `import type { LucideIcon } from "lucide-react"`.
- **토스트**: `import { toast } from "sonner"` 후 `toast.success()` / `toast.error()` 패턴 사용.
- **훅 목록**: `useIsMobile` / `useIsTablet` / `useIsDesktop` (커스텀, md=768px 기준), `useDebounceValue` / `useDebounceCallback`, `useCopyToClipboard`, `useWindowSize` (이상 usehooks-ts), `useLocalStorage` (use-local-storage-state, `defaultValue` 옵션 필수).

### 컴포넌트 레이아웃 파일

- `sidebar.tsx` — 데스크탑용 사이드바 (`md:flex`, 기본 hidden). 내부에서 `SidebarNav` 사용.
- `sidebar-nav.tsx` — 사이드바 네비게이션 항목. `usePathname`으로 active 상태 처리. `"use client"` 필요.
- `mobile-nav.tsx` — 모바일용 Sheet 기반 네비게이션 (`md:hidden`). `"use client"` 필요.
- `topbar.tsx` — 상단 바. 좌측에 `MobileNav`, 우측에 `ThemeToggle` + `UserNav`.

### 코드 패턴

- **`"use client"` 지시어**: `useState`, `useEffect`, `usePathname` 등 클라이언트 훅 사용 시 파일 최상단에 선언.
- **페이지 메타데이터**: Server Component에서 `export const metadata: Metadata = { title: "..." }` 패턴 사용.
- **반응형**: Sidebar `md:flex`(기본 hidden) / MobileNav `md:hidden`(기본 표시). 브레이크포인트 md=768px.
- **Active 링크**: `usePathname()`으로 현재 경로와 `item.href` 일치 여부 비교.

## 커밋 규칙

- 커밋 메시지에 `Co-Authored-By` 트레일러를 절대 포함하지 말 것.
