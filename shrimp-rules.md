# notion-cms-blog 개발 표준 (AI Agent 전용)

> 이 문서는 Coding Agent AI가 이 저장소에서 작업할 때 참조하는 **프로젝트 특화 규칙**입니다.
> 일반적인 Next.js/React/TypeScript 지식은 다루지 않습니다. 라우트 구조·스택 버전·코드 패턴 등
> 일반 정보는 `/CLAUDE.md`를 따르고, 본 문서는 그곳에 없는 **파일 간 동시 수정 체인**과
> **모호한 상황에서의 의사결정 기준**만 다룹니다.

## 1. 신규 파일을 어디에 둘지 — 결정 트리

- **공개 블로그 페이지 추가** → 반드시 `app/(marketing)/` 하위에 생성한다 (Header+Footer 레이아웃 자동 상속).
  - `app/` 바로 아래에 페이지를 만들지 않는다. 단, `app/not-found.tsx`(전역 404)처럼 라우트 그룹 밖에 있는 것이 의도된 파일은 예외다.
- **데이터를 fetch하는 페이지** → async Server Component로 작성하고 `export const revalidate = 3600`을 선언한다 (`app/(marketing)/page.tsx`, `posts/page.tsx` 패턴).
- **인터랙션(상태/이벤트)이 필요한 UI** → `components/shared/`에 `"use client"` 컴포넌트로 분리하고, 부모 Server Component가 데이터를 fetch해 props로 내려준다 (§5 참조). `components/shared/`에 직접 데이터 fetch 코드를 넣지 않는다.
- **새 커스텀 훅** → `hooks/`에 파일을 만들고 **반드시** `hooks/index.ts`에 `export * from "./파일명"`을 추가한다. 추가하지 않으면 `@/hooks` 배럴 import가 깨진다 (CLAUDE.md의 "외부 패키지 직접 import 금지" 규칙과 직결).
- **shadcn/ui 컴포넌트** → `npx shadcn add <component>`로 추가한다. `components/ui/*.tsx`를 손으로 만들거나 직접 수정하지 않는다 (CLAUDE.md 규정, 본 문서에서는 교차 참조만 함).

## 2. Notion 데이터 매핑 체인 — `lib/notion.ts` ↔ `types/index.ts`

`lib/notion.ts`의 `pageToPost()`는 Notion DB 속성명을 **하드코딩 문자열**로 읽어 `Post` 타입으로 변환한다.

| 변경 대상 | 함께 반드시 수정해야 하는 파일 |
|---|---|
| Notion DB에 새 속성 추가/이름 변경 | `lib/notion.ts`의 `pageToPost()` 매핑 로직 **+** `types/index.ts`의 `Post` interface |
| `Post`에 새 필드 추가 | `pageToPost()`의 반환 객체 **+** 해당 필드를 사용하는 `PostCard`/상세 페이지 등 소비처 |

**주의(함정)**: `props.Title`, `props.Category`, `props.Tags`, `props.PublishedAt`, `props.Status`처럼
Notion 속성명은 **대소문자까지 정확히 일치**해야 한다. 불일치 시 에러 없이 빈 값/기본값으로 조용히 채워진다(런타임 예외 없음 — 디버깅 시 이 점을 가장 먼저 의심할 것).

**주의(스펙과 코드의 차이)**: ROADMAP.md에는 Notion DB 속성으로 `Slug`가 언급되지만, 실제 코드는 별도 `Slug` 속성을 읽지 않는다. `slug: page.id`로 **Notion 페이지 ID를 그대로 슬러그/URL 파라미터로 사용**한다 (`lib/notion.ts:84`, `posts/[slug]/page.tsx`의 `getPostBySlug` → `pages.retrieve({ page_id: slug })`). "Slug 속성을 만들어야 한다"고 가정하고 작업하지 말 것 — 별도 지시가 없는 한 이 구조를 유지한다.

## 3. Notion 블록 렌더러 확장 — `lib/notion-renderer.tsx`

`NotionBlockComponent`는 `block.type`에 대한 **switch문**이며, 현재 지원 타입은 다음과 같다:
`paragraph`, `heading_1`, `heading_2`, `heading_3`, `bulleted_list_item`, `numbered_list_item`, `quote`, `code`, `image`, `divider`.

- **새 블록 타입 지원을 추가할 때**: `NotionBlockComponent`의 switch에 `case`를 추가한다. 리치 텍스트가 포함된 블록이면 기존 `RichTextList` 컴포넌트를 재사용한다 (새로 만들지 않는다).
- **주의(함정)**: switch에 없는 타입은 `default: return null`로 **에러 없이 조용히 사라진다**. "렌더링이 안 된다"는 버그 리포트를 받으면 가장 먼저 해당 Notion 블록 타입이 switch에 있는지 확인할 것.
- 이미지 블록은 `next/image`의 `<Image>`로 렌더링하며 `width={800} height={600}` 고정값을 사용한다 — 실제 이미지 비율과 무관하게 고정이므로, 비율 보존이 필요하면 이 두 값과 `className`을 함께 검토한다.

## 4. `PostsView` 서버/클라이언트 분리 경계

`app/(marketing)/posts/page.tsx`(서버)와 `components/shared/posts-view.tsx`(클라이언트)의 책임 분리는 다음과 같이 **고정**되어 있다:

- **서버(`posts/page.tsx`)가 담당**: `getPosts()` 호출 + `Array.from(new Set(posts.map(p => p.category).filter(Boolean)))`로 카테고리 목록 도출 → `posts`, `categories`를 props로 전달
- **클라이언트(`PostsView`)가 담당**: `query`/`activeCategory` state 보관 + `useMemo` 기반 클라이언트 사이드 필터링/렌더링만 수행. **데이터 fetch 로직을 `PostsView` 내부로 옮기지 않는다.**

홈페이지(`app/(marketing)/page.tsx`)에서 최신 글을 가져올 때도 별도 `getRecentPosts()` 같은 함수를 만들지 말고, 기존 `getPosts()`의 결과를 `.slice(0, 6)`으로 잘라 쓰는 현재 패턴을 유지한다.

## 5. 날짜 포맷 통일 규칙

날짜를 화면에 표시할 때는 항상 다음 조합을 사용한다 (현재 `posts/[slug]/page.tsx`에서 사용 중):

```ts
import { format } from "date-fns"
import { ko } from "date-fns/locale"

format(post.publishedAt, "yyyy년 M월 d일", { locale: ko })
```

다른 포맷 문자열(`yyyy-MM-dd`, `MMM d, yyyy` 등)이나 `Intl.DateTimeFormat`, `toLocaleDateString` 등 다른 방식과 혼용하지 않는다 — 한 프로젝트 내 날짜 표기 형식을 통일하기 위함이다.

## 6. 알려진 미사용 코드 — 새 기능의 기반으로 삼지 말 것

`types/index.ts`의 `SidebarItem`, `SidebarGroup` interface는 스타터킷에서 남은 잔존 타입으로, 코드베이스 전체에서 0회 참조된다 (이 블로그는 사이드바 없는 단일 컬럼 레이아웃). 다음을 지킨다:

- 새 내비게이션/메뉴 기능을 만들 때 이 타입을 "이미 있는 패턴"으로 오인해 확장하지 않는다. 필요하면 `NavItem`(실제 사용 중)을 기준으로 새로 설계한다.
- 사용자가 명시적으로 "사이드바를 추가해 달라"고 요청하기 전까지는 이 타입을 그대로 둔다 (무관한 죽은 코드 제거 금지 — CLAUDE.md "Surgical Changes" 원칙).

## 7. Do / Don't 요약

| 상황 | Do | Don't |
|---|---|---|
| Notion DB 스키마 변경 반영 | `pageToPost()`와 `Post` 타입을 **함께** 수정 | 둘 중 하나만 고치고 끝내기 |
| 새 Notion 블록 타입 렌더링 | `NotionBlockComponent` switch에 case 추가, `RichTextList` 재사용 | 새 렌더러 컴포넌트를 처음부터 작성 |
| 새 커스텀 훅 작성 | `hooks/`에 작성 + `hooks/index.ts`에 등록 | 컴포넌트에서 `usehooks-ts` 등을 직접 import |
| 글 목록/검색 로직 수정 | 서버=데이터·카테고리 도출, 클라이언트=필터 상태로 경계 유지 | `PostsView`에 `getPosts()` 호출 추가 |
| 날짜 표시 추가 | `date-fns` + `ko` locale + `"yyyy년 M월 d일"` | `toLocaleDateString` 등 다른 포맷 혼용 |
| slug/URL 파라미터 다루기 | `page.id`를 슬러그로 취급 | 별도 `Slug` Notion 속성이 존재한다고 가정 |
