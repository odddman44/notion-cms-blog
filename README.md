# 개인 데일리 블로그

Notion을 CMS로 활용한 개인 데일리 블로그입니다. Notion에서 글을 작성하면 ISR을 통해 자동으로 블로그에 반영됩니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.x
- **Runtime**: React 19
- **CMS**: Notion API (`@notionhq/client` v5)
- **Styling**: Tailwind CSS v4, shadcn/ui (radix-nova)
- **Deployment**: Vercel

## 주요 기능

- Notion 데이터 소스 기반 글 목록 및 상세 페이지 (ISR)
- 카테고리별 필터링 및 제목 검색
- Notion 블록 렌더링 (paragraph, heading, image, list, quote, code, divider)
- 다크 모드
- 반응형 디자인

## 페이지 구조

| 경로 | 설명 |
|------|------|
| `/` | 홈 — 최신 글 6개 카드 그리드 |
| `/posts` | 전체 글 목록 — 카테고리 필터 + 제목 검색 |
| `/posts/[slug]` | 글 상세 — Notion 블록 렌더링 |

## 시작하기

`.env.local.example`을 복사하여 `.env.local`을 생성하고 값을 채웁니다.

```bash
cp .env.local.example .env.local
```

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## Notion 데이터베이스 속성

| 속성 | 타입 | 설명 |
|------|------|------|
| Title | title | 글 제목 |
| Category | select | 카테고리 |
| Tags | multi_select | 태그 |
| PublishedAt | date | 발행일 |
| Status | status | 상태 (`published` / `draft`) |

## 배포

Vercel 배포 시 환경 변수 `NOTION_API_KEY`, `NOTION_DATABASE_ID`를 프로젝트 설정에 추가합니다.

## 문서

- [PRD](./docs/PRD.md) — 상세 요구사항
- [개발 가이드](./CLAUDE.md) — 개발 지침
