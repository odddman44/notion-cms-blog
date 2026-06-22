# 개인 데일리 블로그 고도화 로드맵

Notion을 CMS로 활용하는 개인 데일리 블로그의 MVP를 넘어, "Notion으로 쓴 글을 제대로 보여주고, 빠르게 발행하며, 독자가 즐겁게 읽고 발견할 수 있는" 블로그로 고도화하는 로드맵입니다.

## 프로젝트 현재 상태

- **MVP 완료 (Phase 1~4)**: Notion API 연동, 글 목록/상세 조회, 카테고리 필터, 제목 검색, 기본 블록 렌더링, ISR 캐싱, SEO 메타데이터, 성능/접근성 최적화까지 완료. 블로그의 기본 골격과 핵심 플로우는 동작하는 상태.
- **고도화 예정 (Phase 5~9)**: 아래 5개 축으로 고도화 진행.
  1. **Notion 렌더링 고도화 (Phase 5 — 최우선)**: 다양한 블록 타입, Rich text annotation, Syntax highlighting, 중첩 리스트, 수식 등 "Notion을 CMS로 쓰는 의미"를 살리는 핵심 작업.
  2. **발행 워크플로우 개선 (Phase 6)**: On-demand Revalidation으로 ISR 1시간 딜레이 해소.
  3. **독자 경험(UX) 고도화 (Phase 7)**: 목차, 읽기 시간, 이전/다음 글, 커버 이미지, 공유 버튼 등.
  4. **SEO 및 디스커버리 (Phase 8)**: sitemap, robots, RSS, OG 이미지 동적 생성, JSON-LD.
  5. **운영 및 분석 (Phase 9)**: 조회수, 애널리틱스, 댓글(giscus), 전문 검색.
- **각 Phase는 독립적으로 구현 가능**하도록 분리되어 있어 우선순위에 따라 선택적으로 진행할 수 있습니다. 단, Phase 5(렌더링 고도화)를 최우선으로 권장합니다.

> 기존 MVP 로드맵 원문은 `docs/roadmaps/ROADMAP_v1.md` 참조.

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-setup.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**
   - 새 작업의 경우 빈 박스로 시작하고 변경 사항 요약을 포함하지 않음

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 테스트 통과 확인 후 다음 단계로 진행
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 ✅로 표시
   - 완료 시 `See: /tasks/XXX-xxx.md` 참조 추가

## MVP 완료 현황

Phase 1~4 전체 완료. 상세 내용은 [`docs/roadmaps/ROADMAP_v1.md`](roadmaps/ROADMAP_v1.md) 참조.

> **미완료**: T015 (Vercel 배포) — 배포 환경 확정 시 진행

---

## 고도화 단계

> Phase 5~9는 각각 독립적으로 구현 가능합니다. **Phase 5(Notion 렌더링 고도화)가 최우선**이며, 이를 완료한 뒤 나머지는 우선순위에 따라 자유롭게 선택해 진행합니다.

### Phase 5: Notion 렌더링 고도화 ✅

> **목표**: "노션에서 작성한 글이 단순 텍스트로만 보이는" 문제 해결. Notion을 CMS로 쓰는 핵심 가치를 살리는 단계.
> **관련 기능**: F011 (Notion 블록 렌더링) 확장
> **영향 파일**: `lib/notion-renderer.tsx`, `lib/notion.ts`, `types/index.ts`, `components/shared/`

- **T017: Rich text annotation 완전 지원** ✅ - 완료
  - 관련 기능: F011
  - 상태: [x]
  - 설명: 현재 부분 지원되는 인라인 서식을 Notion 수준으로 완전 지원
  - ✅ bold, italic, strikethrough, underline 모두 처리
  - ✅ 텍스트 color 및 background-color 지원 (`lib/notion-colors.ts` Tailwind 리터럴 매핑)
  - ✅ 인라인 code, link, mention 처리 보강
  - ✅ `NotionRichText` 타입 확장 (`type`, `equation` 필드 추가)
  - See: `lib/notion-colors.ts`, `types/index.ts`, `lib/notion-renderer.tsx`

- **T018: 코드 블록 Syntax Highlighting + 복사 버튼** ✅ - 완료
  - 관련 기능: F011
  - 상태: [x]
  - 설명: code 블록을 Shiki 서버사이드 하이라이팅 기반으로 교체
  - ✅ Shiki 도입 및 github-light/github-dark 듀얼 테마 설정
  - ✅ 언어 뱃지 표시
  - ✅ 클립보드 복사 버튼 (`useCopyToClipboard` + `sonner` 토스트)
  - ✅ 코드 캡션(caption) 표시
  - See: `components/notion/code-block.tsx`, `lib/notion-renderer.tsx`

- **T019: 미지원 블록 타입 추가 (구조형)** ✅ - 완료
  - 관련 기능: F011
  - 상태: [x]
  - 설명: 레이아웃/구조 관련 블록 렌더링 추가
  - ✅ `callout` (아이콘 + 배경색 박스)
  - ✅ `toggle` (네이티브 details/summary 접기·펼치기)
  - ✅ `table` / `table_row` (shadcn Table 컴포넌트 활용)
  - ✅ `column_list` / `column` (CSS Grid 인라인 스타일, 반응형 대응)
  - ✅ `synced_block` (children 재귀 렌더링)
  - See: `components/notion/callout-block.tsx`, `lib/notion-renderer.tsx`

- **T020: 미지원 블록 타입 추가 (미디어/임베드형)** ✅ - 완료
  - 관련 기능: F011
  - 상태: [x]
  - 설명: 미디어 및 외부 콘텐츠 임베드 블록 렌더링 추가
  - ✅ `bookmark` / `embed` (favicon + URL 카드 링크)
  - ✅ `video` (YouTube/Vimeo iframe + Notion 파일 video 태그)
  - ✅ `audio` (audio 태그), `pdf` / `file` (다운로드 링크 + FileDown 아이콘)
  - ✅ 이미지 캡션(caption) 표시 보강
  - Notion 서명 URL: ISR 주기 내 허용, 근본 해결은 Phase 6 T023
  - See: `components/notion/bookmark-block.tsx`, `components/notion/video-block.tsx`

- **T021: 중첩 리스트 및 블록 children 재귀 렌더링** ✅ - 완료
  - 관련 기능: F011
  - 상태: [x]
  - 설명: 단일 레벨 리스트의 한계를 넘어 중첩 구조를 정확히 표현
  - ✅ `getPostBlocks()` 재귀 fetch (기존 구현 활용)
  - ✅ 중첩 bulleted/numbered list 들여쓰기 및 마커 처리
  - ✅ `to_do` 체크박스 렌더링 (체크된 항목 취소선)
  - ✅ `NotionRenderer`에 `isNested` prop 추가로 prose wrapper 중복 제거
  - See: `lib/notion-renderer.tsx`

- **T022: 인라인/블록 수식(equation) 지원** ✅ - 완료
  - 관련 기능: F011
  - 상태: [x]
  - 설명: 수식 표현 지원 (KaTeX)
  - ✅ KaTeX 도입 및 CSS 로드 (`app/globals.css`)
  - ✅ 블록 `equation` 렌더링 (`displayMode: true`)
  - ✅ 인라인 equation 렌더링 (`displayMode: false`)
  - ✅ 다크 모드 색상 오버라이드 적용
  - See: `components/notion/equation-block.tsx`

### Phase 6: 콘텐츠 발행 워크플로우 개선

> **목표**: `revalidate = 3600`으로 인한 최대 1시간 발행 딜레이를 On-demand Revalidation으로 해소.
> **관련 기능**: F010 (Notion API 연동) 확장
> **영향 파일**: `app/api/revalidate/route.ts`(신규), `lib/notion.ts`, `.env.local.example`, `README.md`

- **T023: On-demand Revalidation API Route 구현** - 우선순위
  - 관련 기능: F010
  - 상태: [ ]
  - 설명: 외부 트리거로 즉시 캐시를 갱신하는 API Route
  - `app/api/revalidate/route.ts` 구현 (`revalidatePath` / `revalidateTag` 활용)
  - 비밀 토큰(`REVALIDATE_SECRET`) 기반 인증 — 헤더 또는 쿼리 검증, 불일치 시 401
  - 갱신 대상 경로 파라미터 처리 (특정 글 / 전체 목록)
  - 에러 핸들링 및 일관된 JSON 응답 형식 (`{ revalidated, now }`)
  - Playwright MCP(또는 HTTP 호출)로 토큰 검증, 갱신 동작, 인증 실패 케이스 검증

- **T024: revalidate 주기 환경 변수화**
  - 관련 기능: F010
  - 상태: [ ]
  - 설명: 하드코딩된 ISR 주기를 환경 변수로 외부화
  - `REVALIDATE_SECONDS` 환경 변수 도입 (미설정 시 기본값 fallback)
  - 각 페이지의 `export const revalidate` 를 상수/설정값 참조로 통일
  - `.env.local.example` 및 문서 갱신

- **T025: Notion Webhook 연동 가이드 작성**
  - 관련 기능: F010 / 인프라
  - 상태: [ ]
  - 설명: 발행 시 자동 revalidate 트리거 연결 가이드
  - Notion Automation → 외부 webhook → `/api/revalidate` 호출 흐름 문서화
  - 토큰 전달 방식 및 보안 주의사항 정리
  - 수동 트리거(curl 예시) 및 트러블슈팅 섹션 작성

### Phase 7: 독자 경험(UX) 고도화

> **목표**: 글을 읽는 경험을 풍부하게. 목차, 읽기 시간, 네비게이션, 공유 등 독자 편의 기능 추가.
> **관련 기능**: F002 (글 상세 조회) 확장
> **영향 파일**: `app/(marketing)/posts/[slug]/page.tsx`, `components/shared/`, `lib/notion.ts`, `lib/utils.ts`

- **T026: 목차(TOC) 자동 생성**
  - 관련 기능: F002
  - 상태: [ ]
  - 설명: heading 블록을 파싱하여 자동 목차 생성
  - heading_1/2/3 블록에서 제목/레벨/앵커 ID 추출
  - `TableOfContents` 컴포넌트 (데스크탑 사이드 고정 / 모바일 접기)
  - 스크롤 위치 기반 현재 섹션 하이라이트 (IntersectionObserver)
  - heading 블록에 앵커 ID 부여 및 클릭 시 스무스 스크롤
  - Playwright MCP로 TOC 생성, 앵커 이동, active 하이라이트 검증

- **T027: 읽기 예상 시간 + 이전/다음 글 네비게이션**
  - 관련 기능: F002
  - 상태: [ ]
  - 설명: 본문 분량 기반 읽기 시간과 글 간 이동 동선 제공
  - 본문 텍스트 추출 후 읽기 시간 계산 유틸 (`lib/utils.ts`, 한국어/영어 기준 보정)
  - 글 상세 헤더에 읽기 시간 표시
  - 발행일 정렬 기준 이전/다음 글 조회 (`getPosts` 활용)
  - 글 하단 이전/다음 글 네비게이션 컴포넌트
  - Playwright MCP로 읽기 시간 표시 및 이전/다음 이동 검증

- **T028: 글 커버 이미지 표시**
  - 관련 기능: F002, F010
  - 상태: [ ]
  - 설명: Notion 페이지 커버 이미지를 글 상세/카드에 활용
  - `getPostBySlug` / `getPosts` 응답에 `cover` 필드 추가 (external/file 모두 대응)
  - 글 상세 상단 히어로 커버 이미지 (Next.js `<Image>`, priority)
  - PostCard 썸네일에 커버 이미지 노출 (없을 시 fallback)
  - Playwright MCP로 커버 이미지 렌더링 및 fallback 검증

- **T029: 소셜 공유 버튼 + 스크롤 진행 표시바**
  - 관련 기능: F002
  - 상태: [ ]
  - 설명: 글 확산 및 읽기 진행 피드백 제공
  - 공유 버튼: 트위터/X 공유, 링크 복사(`useCopyToClipboard` + 토스트)
  - 읽기 진행 스크롤 Progress Bar (상단 고정, 스크롤 비율 반영)
  - 접근성: 버튼 aria-label, 키보드 포커스 처리
  - Playwright MCP로 공유 링크 생성, 복사, 진행바 동작 검증

- **T030: 빈 상태(empty state) 개선**
  - 관련 기능: F003, F004
  - 상태: [ ]
  - 설명: 검색/필터 결과 없음 상태를 더 친근하게 개선
  - 일러스트(또는 아이콘) + 안내 메시지 + 액션(필터 초기화) 제공
  - 목록/검색/카테고리별 맥락에 맞는 메시지 분기
  - 다크 모드 및 반응형 대응
  - Playwright MCP로 검색 결과 없음 상태 렌더링 검증

### Phase 8: SEO 및 디스커버리

> **목표**: 검색엔진·피드 리더·SNS에서 블로그가 잘 발견되고 풍부하게 노출되도록 강화.
> **관련 기능**: F010 / 신규 SEO 기능군
> **영향 파일**: `app/sitemap.ts`, `app/robots.ts`, `app/rss.xml/route.ts`, `app/.../opengraph-image.tsx`, 글 상세 페이지

- **T031: sitemap.xml + robots.txt 자동 생성** - 우선순위
  - 관련 기능: F010
  - 상태: [ ]
  - 설명: 검색엔진 크롤링 최적화 기반 마련
  - `app/sitemap.ts` (Next.js sitemap route)로 전체 글 URL 동적 생성
  - `app/robots.ts`로 robots 규칙 및 sitemap 위치 명시
  - 사이트 base URL 환경 변수화 (`NEXT_PUBLIC_SITE_URL`)
  - 빌드/배포 후 `/sitemap.xml`, `/robots.txt` 접근 검증

- **T032: RSS/Atom 피드 생성**
  - 관련 기능: F010
  - 상태: [ ]
  - 설명: 피드 리더 구독 지원
  - `app/rss.xml/route.ts` 로 발행 글 기반 RSS(또는 Atom) 피드 생성
  - 제목, 요약(description), 링크, 발행일, 카테고리 포함
  - `<head>`에 피드 자동 발견(alternate link) 추가
  - 피드 유효성 검증 (RSS validator)

- **T033: OG 이미지 동적 생성**
  - 관련 기능: F010
  - 상태: [ ]
  - 설명: 글 제목 기반 OG 이미지를 동적으로 생성하여 SNS 공유 품질 향상
  - Next.js `ImageResponse`(`opengraph-image.tsx`)로 글별 OG 이미지 생성
  - 제목/카테고리/사이트명 레이아웃, 폰트(Pretendard) 임베드
  - `generateMetadata`의 openGraph/twitter 메타데이터 연결
  - Playwright MCP로 OG 이미지 라우트 응답 및 메타 태그 검증

- **T034: JSON-LD 구조화 데이터(BlogPosting)**
  - 관련 기능: F002, F010
  - 상태: [ ]
  - 설명: 검색엔진 리치 결과 노출을 위한 구조화 데이터 삽입
  - 글 상세 페이지에 `BlogPosting` schema JSON-LD `<script>` 삽입
  - headline, datePublished, author, image, description 등 매핑
  - Google Rich Results Test로 유효성 검증

### Phase 9: 운영 및 분석

> **목표**: 방문/반응 데이터 확보 및 독자 상호작용·탐색 기능 추가로 블로그 운영을 고도화.
> **관련 기능**: 신규 운영/분석 기능군 + F004(검색) 확장
> **영향 파일**: `app/api/views/route.ts`(신규), `components/shared/`, `lib/notion.ts`, 글 상세/목록 페이지

- **T035: 검색 고도화 (제목 + 본문 전문 검색)**
  - 관련 기능: F004
  - 상태: [ ]
  - 설명: 현재 제목 기준 검색을 본문 포함 전문 검색으로 확장
  - 본문 텍스트 인덱스 구성 (빌드타임 추출 또는 경량 검색 색인)
  - 제목 + 본문 매칭 및 결과 하이라이트
  - 검색 성능 고려 (debounce, 인덱스 캐싱)
  - Playwright MCP로 본문 키워드 검색 및 하이라이트 검증

- **T036: 댓글 기능 (giscus)**
  - 관련 기능: 신규
  - 상태: [ ]
  - 설명: GitHub Discussions 기반 무료·무서버 댓글 연동
  - giscus 앱 설치 및 Discussions 카테고리 설정
  - `Comments` 클라이언트 컴포넌트 (테마 동기화 — 라이트/다크)
  - 글 상세 하단 마운트, 환경 변수로 repo/category 설정
  - Playwright MCP로 댓글 위젯 로드 및 테마 연동 검증

- **T037: 조회수 카운터 (서버사이드)**
  - 관련 기능: 신규
  - 상태: [ ]
  - 설명: 글별 조회수를 서버사이드에서 집계·표시
  - Vercel KV(또는 Redis) 연동 및 키 설계 (`views:{slug}`)
  - `app/api/views/route.ts` 증가/조회 엔드포인트 (중복 카운팅 방지 전략)
  - 글 상세/카드에 조회수 표시
  - Playwright MCP로 조회 시 카운트 증가 및 표시 검증

- **T038: 웹 애널리틱스 연동**
  - 관련 기능: 신규
  - 상태: [ ]
  - 설명: 방문 트래픽 측정 도구 연동 (가벼운 Plausible 권장, 또는 GA4)
  - Plausible Analytics(경량) 또는 Google Analytics 4 스크립트 연동
  - 환경 변수 기반 활성화 토글 (개발 환경 제외)
  - 페이지뷰/이벤트 수집 확인
  - 개인정보/쿠키 정책 고려 사항 문서화

---

## 우선순위 요약

| 순위 | Phase | 핵심 이유 |
|------|-------|-----------|
| 1 | **Phase 5: Notion 렌더링 고도화** ⭐ | 미지원 블록·서식으로 글이 단순 텍스트로 보임 — CMS로서의 핵심 가치 직결 |
| 2 | **Phase 6: 발행 워크플로우 개선** | 최대 1시간 발행 딜레이 해소, 운영 편의 즉시 체감 |
| 3 | **Phase 7: 독자 경험(UX) 고도화** | 읽기 경험 개선으로 체류·재방문 향상 |
| 4 | **Phase 8: SEO 및 디스커버리** | 신규 독자 유입 채널 확보 |
| 5 | **Phase 9: 운영 및 분석** | 데이터 기반 운영 및 독자 상호작용 강화 |
