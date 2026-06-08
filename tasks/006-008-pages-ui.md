# 006-008 — T006~T008 검증: 홈/글 목록/글 상세 페이지 UI 구현

- 관련 ROADMAP 항목: `docs/ROADMAP.md` T006, T007, T008 (Phase 2)
- 검증 방식: 정적 코드 대조 (코드 변경 없음)
- 종합 결과: **통과 (14/14)** — 단, "더미 데이터 단계"가 건너뛰어진 사실을 비고에 기록

## 중요 비고: 더미 데이터 단계 건너뜀

ROADMAP Phase 2(T006~T008)는 "더미 데이터로 화면을 완성한 뒤 Phase 3에서 실제 API로 교체"하는 2단계 진행을 전제로 작성되었으나, 실제로는 커밋 `7bc270e`("✨ feat: Notion CMS 블로그 MVP 구조 구현")에서 **더미 데이터 단계를 생략하고 처음부터 `getPosts`/`getPostBySlug`/`getPostBlocks`(`lib/notion.ts`) + `NotionRenderer`(`lib/notion-renderer.tsx`)로 직접 구현**되었다. 최종 결과물이 각 페이지의 UI/구조 명세를 모두 충족하므로 결함으로 판단하지 않으며, 아래 검증은 "더미 데이터" 항목을 "실제 데이터 연동으로 대체 구현됨(PASS)"으로 처리했다.

## T006: 홈 페이지 UI

| # | 검증 항목 | 결과 | 근거 |
|---|---|---|---|
| 1 | 최신 글 6개 카드 그리드 (모바일 1열/태블릿 2열/데스크탑 3열) | ✅ 통과 | `app/(marketing)/page.tsx`: `posts.slice(0, 6)` + `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`(기본 1열 → sm 2열 → lg 3열) |
| 2 | "전체 글 보기" 버튼 → `/posts` 이동 | ✅ 통과 | `<Button asChild variant="ghost"><Link href="/posts">전체 글 보기 <ArrowRight /></Link></Button>` |
| 3 | 더미 `Post[]` 데이터로 PostCard 렌더링 | ✅ 통과(대체 구현) | 더미 대신 `await getPosts()`로 실제 Notion 데이터를 `PostCard`에 렌더링(상기 비고 참조) |
| 4 | 메타데이터(title, description) 설정 | ✅ 통과 | 홈페이지에 별도 `export const metadata`는 없으나, `app/layout.tsx:20-26`의 루트 메타데이터가 `title: { default: "Daily Blog", template: "%s | Daily Blog" }` + `description`으로 정의되어 있어 **루트(`/`) 경로의 기본 메타데이터로 정확히 상속**됨 — Next.js App Router의 표준 패턴(하위 페이지만 `template`로 override, 루트는 `default` 사용)에 부합하므로 통과로 판정 |

## T007: 글 목록 페이지 UI

| # | 검증 항목 | 결과 | 근거 |
|---|---|---|---|
| 1 | 전체 글 카드 그리드 + 반응형 레이아웃 | ✅ 통과 | `posts-view.tsx`: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3` |
| 2 | 카테고리 탭 필터 UI | ✅ 통과(대체 구현) | 더미 카테고리 대신 `Array.from(new Set(posts.map(p => p.category).filter(Boolean)))`로 실제 데이터 기반 카테고리 목록을 `posts/page.tsx`(서버)에서 도출해 `categories` prop으로 전달, `PostsView`가 `Button` 탭으로 렌더링 |
| 3 | 제목 검색 입력 UI (`SearchInput` 활용) | ✅ 통과 | `<SearchInput value={query} onChange={setQuery} />` |
| 4 | 검색 결과 없을 때 빈 상태 메시지 | ✅ 통과 | `filtered.length === 0 ? <p>검색 결과가 없습니다.</p> : ...` |
| 5 | `PostsView` 클라이언트 컴포넌트 분리 | ✅ 통과 | `"use client"` + `useState`/`useMemo` 기반 필터링을 전담, 서버(`posts/page.tsx`)는 fetch와 categories 도출만 담당 |

## T008: 글 상세 페이지 UI

| # | 검증 항목 | 결과 | 근거 |
|---|---|---|---|
| 1 | 헤더 영역: 제목, 카테고리 뱃지, 발행일, 태그 목록 | ✅ 통과 | `posts/[slug]/page.tsx` 53~70행: `CategoryBadge` + `<h1>{post.title}</h1>` + `<time>{format(post.publishedAt, "yyyy년 M월 d일", { locale: ko })}</time>` + `post.tags.map(TagBadge)` |
| 2 | 본문 영역 더미 블록 렌더링 (paragraph/heading/list/quote/divider/code) | ✅ 통과(대체 구현) | 더미 블록 대신 `getPostBlocks()` + `<NotionRenderer blocks={blocks} />`로 실제 Notion 블록을 렌더링(`lib/notion-renderer.tsx`에서 paragraph/heading_1~3/list/quote/code/image/divider 모두 지원) |
| 3 | "목록으로 돌아가기" 링크 | ✅ 통과 | `<Link href="/posts"><ArrowLeft /> 목록으로 돌아가기</Link>` |
| 4 | 반응형 타이포그래피 적용 | ✅ 통과 | `<article className="mx-auto max-w-3xl ...">` + `NotionRenderer`의 `prose prose-neutral dark:prose-invert max-w-none`(Tailwind Typography) |
| 5 | 존재하지 않는 더미 slug 접근 시 `notFound()` 호출 | ✅ 통과(대체 구현) | 더미 slug 대신 실제 `getPostBySlug(slug)`가 `null`을 반환하면 `if (!post) notFound()` 호출 — 의미상 동일 요구사항 충족 |

## 결론

T006~T008 명세 14개 항목 모두 통과(3개 항목은 "더미 → 실제 데이터 직접 구현"으로 대체 충족). **ROADMAP 체크박스 갱신 가능**으로 판정.
