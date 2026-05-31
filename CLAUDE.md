# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**notion-cms-blog**는 Notion을 CMS로 활용하여 글 작성부터 발행까지 Notion 하나로 관리하는 개인 데일리 블로그입니다.

상세 프로젝트 요구사항은 @/docs/PRD.md 참조

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

- `app/(marketing)/` — 블로그 공개 페이지. `Header` + `Footer` 레이아웃 사용.
  - `/` — 홈 (최신 글 6개)
  - `/posts` — 전체 글 목록 (카테고리 필터 + 검색)
  - `/posts/[slug]` — 글 상세 (Notion 블록 렌더링)
- `app/layout.tsx` — 루트 레이아웃. `ThemeProvider`와 `Toaster`를 전체에 적용.

### 주요 디렉토리 역할

- `components/ui/` — shadcn/ui 컴포넌트. 직접 수정하지 말고 `shadcn` CLI로 추가/업데이트.
- `components/layout/` — 레이아웃 구성 컴포넌트 (Header, Footer, MobileNav).
- `components/shared/` — 공통 컴포넌트 (PostCard, CategoryBadge, TagBadge, SearchInput, PostsView, Logo, ThemeToggle).
- `lib/notion.ts` — Notion API 클라이언트 및 데이터 fetch 함수 (`getPosts`, `getPostBySlug`, `getPostBlocks`).
- `lib/notion-renderer.tsx` — Notion 블록 → React 컴포넌트 렌더러 (`NotionRenderer`).
- `lib/constants.ts` — `APP_NAME`, `NAV_LINKS` 등 UI 상수 정의.
- `types/index.ts` — 공통 타입 정의 (`Post`, `NotionBlock`, `NotionRichText`, `NavItem` 등).
- `hooks/` — 커스텀 훅 모음. `hooks/index.ts`에서 전체 re-export. 외부 패키지 직접 import 금지, 반드시 `@/hooks`에서 import.
- `components/providers/` — 전역 Context Provider (ThemeProvider 등). `app/layout.tsx`에서 마운트.
- `lib/utils.ts` — `cn()` 유틸리티 함수 (clsx + tailwind-merge). className 조합 시 항상 사용.

### 스택 주의사항

- **Next.js 16**: 훈련 데이터와 다를 수 있는 breaking change가 있음. 코드 작성 전 `node_modules/next/dist/docs/` 참고.
- **@notionhq/client v5**: `databases.query` 제거됨. 데이터 소스 조회는 `dataSources.query({ data_source_id })` 사용. 페이지 단건 조회는 `pages.retrieve({ page_id })` 사용.
- **Tailwind CSS v4**: `tailwind.config.js` 없음. 설정은 `app/globals.css`의 `@theme` 블록에서 CSS 변수로 관리.
- **shadcn/ui**: `radix-nova` 스타일 사용. 컴포넌트 추가 시 `npx shadcn add <component>` 사용.
- **경로 alias**: `@/` → 프로젝트 루트 (예: `@/components/ui/button`).
- **폰트**: Pretendard(한국어, `--font-pretendard`) + Geist Mono(`--font-mono`). CSS 변수로 참조.
- **아이콘**: `lucide-react` 패키지 사용. 타입은 `import type { LucideIcon } from "lucide-react"`.
- **토스트**: `import { toast } from "sonner"` 후 `toast.success()` / `toast.error()` 패턴 사용.
- **훅 목록**: `useIsMobile` / `useIsTablet` / `useIsDesktop` (커스텀, md=768px 기준), `useDebounceValue` / `useDebounceCallback`, `useCopyToClipboard`, `useWindowSize` (이상 usehooks-ts), `useLocalStorage` (use-local-storage-state, `defaultValue` 옵션 필수).
- **ISR**: 페이지 파일에서 `export const revalidate = 3600` 으로 설정. 글 상세 페이지는 `generateStaticParams`로 빌드 타임 정적 생성.

### 코드 패턴

- **`"use client"` 지시어**: `useState`, `useEffect`, `usePathname` 등 클라이언트 훅 사용 시 파일 최상단에 선언.
- **페이지 메타데이터**: Server Component에서 `export const metadata: Metadata = { title: "..." }` 패턴 사용.
- **서버/클라이언트 분리**: 서버 컴포넌트에서 데이터 fetch 후 클라이언트 컴포넌트에 props로 전달 (예: `PostsPage` → `PostsView`).
- **반응형**: MobileNav `md:hidden`(기본 표시). 브레이크포인트 md=768px.
- **Active 링크**: `usePathname()`으로 현재 경로와 `item.href` 일치 여부 비교.

## 커밋 규칙

- 커밋 메시지에 `Co-Authored-By` 트레일러를 절대 포함하지 말 것.
