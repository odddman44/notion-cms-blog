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

## 발행 워크플로우

글을 작성하고 사이트에 노출하는 과정은 Notion에서만 진행합니다.

1. Notion 데이터베이스에 새 페이지를 추가하고 `Title`, `Category`, `Tags`, `PublishedAt` 속성을 입력합니다.
2. 본문을 작성합니다 (paragraph, heading, image, list, quote, code, divider 블록 지원).
3. `Status` 속성을 `published`로 변경합니다.
4. `getPosts()`가 `Status=published` 글만 조회하며, 페이지는 `revalidate=3600` 설정에 따라 **최대 1시간 이내** 사이트(`/`, `/posts`, `/posts/[slug]`)에 반영됩니다.
5. 다시 `draft`로 변경하면 동일하게 최대 1시간 이내에 사이트에서 제외됩니다.

> 즉시 반영을 확인하려면 로컬에서 `npm run dev`로 실행 중인 서버를 재시작하면 캐시 없이 즉시 최신 데이터를 가져옵니다.

## 배포

Vercel 배포 시 환경 변수 `NOTION_API_KEY`, `NOTION_DATABASE_ID`를 프로젝트 설정에 추가합니다. 상세 절차는 [배포 가이드](./tasks/009-deploy-guide.md)를 참고하세요.

## 트러블슈팅

| 증상 | 원인 | 해결 방법 |
|---|---|---|
| 글 제목/카테고리/태그가 빈 값으로 표시됨 | Notion DB 속성명·타입이 `lib/notion.ts`가 기대하는 스펙과 불일치 (속성명 불일치 시 에러 없이 빈 값으로 채워지는 silent failure) | `Title`(title) / `Category`(select) / `Tags`(multi_select) / `PublishedAt`(date) / `Status`(status) 속성명·타입을 대소문자까지 정확히 맞춤 |
| `getPosts()` 호출 시 인증/권한 에러 | `.env.local`의 `NOTION_API_KEY` 또는 `NOTION_DATABASE_ID` 누락·오타 | `.env.local.example`을 참고해 값을 다시 설정 |
| Integration 연결 에러 (object_not_found 등) | Notion DB에 Integration이 연결(Connections)되지 않음 | DB 페이지의 `...` → Connections에서 해당 Integration을 연결 |
| 글을 `published`로 변경했는데 사이트에 보이지 않음 | ISR 캐시(`revalidate=3600`)가 아직 갱신되지 않음 | 최대 1시간 대기 또는 로컬에서 `npm run dev` 재시작으로 즉시 확인 |
| Notion 이미지 블록이 표시되지 않음 | 이미지 호스트가 `next.config.ts`의 `images.remotePatterns`에 없음 | Notion 이미지 도메인(`*.amazonaws.com`, `*.notion-static.com`)이 등록되어 있는지 확인 |

## 문서

- [PRD](./docs/PRD.md) — 상세 요구사항
- [개발 가이드](./CLAUDE.md) — 개발 지침
