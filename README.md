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
- 폭넓은 Notion 블록 렌더링 — 텍스트 서식(굵게/기울임/취소선/밑줄/색상), 코드 syntax highlighting + 복사 버튼, 콜아웃/토글/테이블/컬럼, 북마크/임베드/비디오/오디오/파일, 중첩 리스트·체크박스, 수식(KaTeX)
- On-demand Revalidation — Notion에서 글을 발행하면 webhook으로 즉시 사이트에 반영
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

이 블로그가 읽어오는 Notion 데이터베이스는 아래 속성을 정확한 이름·타입으로 가지고 있어야 합니다.

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
2. 본문을 작성합니다.
3. `Status` 속성을 `published`로 변경합니다.
4. `getPosts()`가 `Status=published` 글만 조회하며, 페이지는 `revalidate=3600` 설정에 따라 **최대 1시간 이내** 사이트(`/`, `/posts`, `/posts/[slug]`)에 반영됩니다.
5. 다시 `draft`로 변경하면 동일하게 최대 1시간 이내에 사이트에서 제외됩니다.

> 즉시 반영을 확인하려면 로컬에서 `npm run dev`로 실행 중인 서버를 재시작하면 캐시 없이 즉시 최신 데이터를 가져옵니다.

### 즉시 반영 (On-demand Revalidation)

최대 1시간 대기 없이 즉시 반영하려면 `/api/revalidate` 엔드포인트를 호출합니다.

1. `.env.local`(및 Vercel 환경 변수)에 `REVALIDATE_SECRET`을 추측하기 어려운 랜덤 문자열로 설정합니다.
2. Notion 데이터베이스의 Automation(`⚡` → New automation)에서 "Status가 published로 변경될 때" 트리거에 webhook 액션을 연결하고, URL을 `https://your-domain.com/api/revalidate?secret=YOUR_REVALIDATE_SECRET`(또는 `&slug=POST_SLUG`로 특정 글만)으로 설정합니다.
3. 수동으로 트리거하려면 다음과 같이 호출합니다.
   ```bash
   curl -H "x-revalidate-secret: $REVALIDATE_SECRET" "https://your-domain.com/api/revalidate"
   ```

> 시크릿을 쿼리 파라미터로 전달하면 URL이 로그에 남을 수 있으니, webhook이 커스텀 헤더를 지원한다면 `x-revalidate-secret` 헤더 방식을 우선 사용하세요. `REVALIDATE_SECRET`을 설정하지 않으면 엔드포인트가 항상 401을 반환합니다.

## 배포 (Vercel)

1. GitHub 리포지토리를 [Vercel](https://vercel.com)에서 Import합니다 (Framework Preset: Next.js, 자동 감지).
2. **Settings → Environment Variables**에 아래 값을 등록합니다 (Production/Preview/Development 모두 체크).

   | 변수 | 설명 |
   |---|---|
   | `NOTION_API_KEY` | Notion Integration Secret |
   | `NOTION_DATABASE_ID` | Notion 데이터 소스 ID |
   | `REVALIDATE_SECRET` | (선택) On-demand Revalidation용 시크릿 — 미설정 시 `/api/revalidate`는 항상 401 |

3. Deploy 후 발급된 URL로 접속해 글이 정상 표시되는지 확인합니다.

## 트러블슈팅

| 증상 | 원인 | 해결 방법 |
|---|---|---|
| 글 제목/카테고리/태그가 빈 값으로 표시됨 | Notion DB 속성명·타입이 기대하는 스펙과 불일치 (속성명 불일치 시 에러 없이 빈 값으로 채워지는 silent failure) | `Title`(title) / `Category`(select) / `Tags`(multi_select) / `PublishedAt`(date) / `Status`(status) 속성명·타입을 대소문자까지 정확히 맞춤 |
| `getPosts()` 호출 시 인증/권한 에러 | `.env.local`의 `NOTION_API_KEY` 또는 `NOTION_DATABASE_ID` 누락·오타 | `.env.local.example`을 참고해 값을 다시 설정 |
| Integration 연결 에러 (object_not_found 등) | Notion DB에 Integration이 연결(Connections)되지 않음 | DB 페이지의 `...` → Connections에서 해당 Integration을 연결 |
| 글을 `published`로 변경했는데 사이트에 보이지 않음 | ISR 캐시(`revalidate=3600`)가 아직 갱신되지 않음 | 최대 1시간 대기, `/api/revalidate` 수동 호출, 또는 로컬에서 `npm run dev` 재시작으로 즉시 확인 |
| Notion 이미지 블록이 표시되지 않음 | 이미지 호스트가 `next.config.ts`의 `images.remotePatterns`에 없음 | Notion 이미지 도메인(`*.amazonaws.com`, `*.notion-static.com`)이 등록되어 있는지 확인 |
| `/api/revalidate` 호출 시 401 또는 webhook 호출 후 갱신 안 됨 | `REVALIDATE_SECRET` 미설정·불일치, 또는 `slug` 파라미터가 실제 글 slug와 다름 | `.env.local`/Vercel의 `REVALIDATE_SECRET` 확인, slug 없이 전체 갱신으로 우선 테스트 |
