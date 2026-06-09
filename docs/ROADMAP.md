# 개인 데일리 블로그 개발 로드맵

Notion을 CMS로 활용하여 글 작성부터 발행까지 Notion 하나로 관리하는 개인 데일리 블로그 MVP 개발 로드맵입니다.

## 개요

`notion-cms-blog`는 개발자 본인의 글쓰기 워크플로우를 단순화하고, 방문자에게 깔끔한 읽기 경험을 제공하는 개인 블로그입니다. Notion을 단일 콘텐츠 소스로 사용하여 글 작성, 발행, 관리를 모두 Notion 한 곳에서 처리합니다.

- **글 목록 및 상세 조회**: Notion DB에서 발행 상태인 글을 카드 그리드와 상세 페이지로 표시
- **카테고리 필터 및 검색**: 카테고리 탭과 제목 기반 클라이언트 사이드 검색으로 빠른 탐색
- **Notion 블록 렌더링**: paragraph, heading, image, list, quote, divider, code 블록을 React 컴포넌트로 변환
- **ISR 캐싱 및 SEO**: Next.js ISR로 성능 최적화, 메타데이터 설정으로 검색 노출 강화

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

## 개발 단계

### Phase 1: 환경 설정 및 애플리케이션 골격 구축

프로젝트 초기 환경을 구성하고 전체 라우트 구조와 빈 페이지 골격을 마련하는 단계입니다.

- **T001: 프로젝트 초기 설정 및 의존성 구성** - 우선순위
  - 관련 기능: 인프라 (전 기능 공통)
  - 상태: [x] — See: /tasks/001-setup.md
  - Next.js 16(App Router) + TypeScript 5.x + React 19 환경 초기화
  - TailwindCSS v4 설정 (`app/globals.css`의 `@theme` 블록 구성)
  - shadcn/ui(radix-nova 스타일) 초기화 및 `components.json` 구성
  - `@notionhq/client`, `lucide-react`, `sonner` 등 핵심 패키지 설치
  - 경로 alias(`@/`) 설정 및 `tsconfig.json` 정리
  - `.env.local.example` 작성 (Notion API Key, Database ID 등)
  - > 참고: 실제 `NOTION_DATABASE_ID` 값과 DB 스키마는 T008-1에서 확정한다. T001 단계에서는 키 자리(placeholder)만 정의한다.

- **T002: 라우트 구조 및 레이아웃 골격 생성**
  - 관련 기능: F001, F002 (모든 페이지 공통)
  - 상태: [x] — See: /tasks/002-routes-layout.md
  - `app/layout.tsx` 루트 레이아웃 구현 (Pretendard + Geist Mono 폰트 적용)
  - `app/(marketing)/layout.tsx` 라우트 그룹 레이아웃 구성
  - `app/(marketing)/page.tsx` (홈) 빈 페이지 생성
  - `app/(marketing)/posts/page.tsx` (글 목록) 빈 페이지 생성
  - `app/(marketing)/posts/[slug]/page.tsx` (글 상세) 빈 페이지 생성
  - `ThemeProvider` 및 `Toaster` 마운트

- **T003: 타입 정의 및 공통 상수 작성**
  - 관련 기능: F001, F002, F003, F010, F011
  - 상태: [x] — See: /tasks/003-types-constants.md
  - `types/index.ts`에 `Post`, `NotionBlock`, `NotionRichText`, `NavItem` 타입 정의
  - Notion DB 속성(`Status`, `Category`, `Tags`, `PublishedAt`, `Slug`) 타입 모델링
  - `lib/constants.ts`에 `APP_NAME`, `NAV_LINKS` 정의
  - `lib/utils.ts`의 `cn()` 유틸리티 함수 확보

### Phase 2: UI 컴포넌트 라이브러리 및 페이지 UI 완성 (더미 데이터 활용)

실제 API 연동 전, 더미 데이터로 모든 화면을 완성하여 사용자 플로우를 검증하는 단계입니다.

- **T004: 레이아웃 컴포넌트(Header, Footer, MobileNav) 구현**
  - 관련 기능: 전 페이지 공통 네비게이션
  - 상태: [x] — See: /tasks/004-005-components.md
  - `components/layout/Header.tsx`: 로고, 데스크탑 네비게이션, 테마 토글
  - `components/layout/Footer.tsx`: 카피라이트 및 부가 링크
  - `components/layout/MobileNav.tsx`: 모바일 햄버거 메뉴 (md:hidden)
  - `usePathname()` 기반 active 링크 스타일 처리
  - 반응형 브레이크포인트(md=768px) 적용

- **T005: 공유 컴포넌트(PostCard, CategoryBadge, TagBadge, SearchInput) 구현**
  - 관련 기능: F001, F003, F004
  - 상태: [x] — See: /tasks/004-005-components.md
  - `components/shared/PostCard.tsx`: 카드 UI (제목, 카테고리 뱃지, 발행일)
  - `components/shared/CategoryBadge.tsx`: 카테고리 표시용 뱃지
  - `components/shared/TagBadge.tsx`: 태그 표시용 뱃지
  - `components/shared/SearchInput.tsx`: 검색 입력 컴포넌트 (debounce 적용)
  - `components/shared/Logo.tsx`, `components/shared/ThemeToggle.tsx` 작성

- **T006: 홈 페이지 UI 구현 (더미 데이터)**
  - 관련 기능: F001
  - 상태: [x] — See: /tasks/006-008-pages-ui.md
  - 최신 글 6개 카드 그리드 (모바일 1열 / 태블릿 2열 / 데스크탑 3열)
  - "전체 글 보기" 버튼 → `/posts` 이동
  - 더미 `Post[]` 데이터로 PostCard 렌더링
  - 메타데이터(title, description) 설정

- **T007: 글 목록 페이지 UI 구현 (더미 데이터)**
  - 관련 기능: F001, F003, F004
  - 상태: [x] — See: /tasks/006-008-pages-ui.md
  - 전체 글 카드 그리드 + 반응형 레이아웃
  - 카테고리 탭 필터 UI (더미 카테고리 기반)
  - 제목 검색 입력 UI (`SearchInput` 활용)
  - 검색 결과 없을 때 빈 상태(empty state) 메시지
  - `PostsView` 클라이언트 컴포넌트 분리 (서버에서 props 전달 구조 마련)

- **T008: 글 상세 페이지 UI 구현 (더미 데이터)**
  - 관련 기능: F002, F011
  - 상태: [x] — See: /tasks/006-008-pages-ui.md
  - 헤더 영역: 제목, 카테고리 뱃지, 발행일, 태그 목록
  - 본문 영역 더미 블록 렌더링 (paragraph, heading, list, quote, divider, code)
  - "목록으로 돌아가기" 링크
  - 반응형 타이포그래피 적용
  - 존재하지 않는 더미 slug 접근 시 `notFound()` 호출

### Phase 3: Notion API 연동 및 핵심 기능 구현

더미 데이터를 실제 Notion API 호출로 교체하고, 핵심 비즈니스 로직을 완성하는 단계입니다.

- **T008-1: Notion 데이터베이스 생성, 스키마 확정, Integration 연결** - 우선순위
  - 관련 기능: F010 (T009~T012 전체의 선행 조건 / blocking prerequisite)
  - 상태: [ ] — See: /tasks/008-1-notion-database-setup.md
  - 작업 성격: **사용자가 Notion UI에서 직접 수행하는 수동 작업** + 그 결과(DB ID·속성명/타입)를 AI에 전달해 코드와 정합성을 맞추는 작업. 코드로 대체 불가.
  - 사용자 작업: Notion에 블로그용 DB 생성, 아래 5개 속성 정의, Integration(Read content) 생성·연결, 샘플 글 1건 발행
  - `lib/notion.ts`가 기대하는 정확한 속성 스펙 (대소문자까지 일치 필요):
    - `Title` (title) / `Category` (select) / `Tags` (multi_select) / `PublishedAt` (date) / `Status` (status, 옵션 값 `published`·`draft` 정확히 존재)
    - slug는 별도 속성이 아니라 페이지 ID를 사용하므로 Slug 속성은 불필요
  - 결과 전달: Integration Secret → `NOTION_API_KEY`, 데이터 소스 ID → `NOTION_DATABASE_ID`를 `.env.local`에 설정
  - 정합성 확인: 실제 속성명/타입을 `lib/notion.ts` 하드코딩값과 1:1 대조, 불일치 시 스키마 또는 코드 수정 (속성명 불일치 시 에러 없이 빈 값으로 채워지는 silent failure 주의)

- **T009: Notion API 클라이언트 및 데이터 fetch 함수 구현** - 우선순위
  - 관련 기능: F010
  - 상태: [ ]
  - 선행 조건: T008-1 완료 (실제 Notion DB·속성·Integration·`.env.local` 설정 완료) 필요
  - `lib/notion.ts`에 `@notionhq/client` v5 기반 클라이언트 초기화
  - `getPosts()`: `dataSources.query({ data_source_id })`로 Status=발행됨 글 목록 조회
  - `getPostBySlug(slug)`: slug로 단건 페이지 조회
  - `getPostBlocks(pageId)`: `blocks.children.list()`로 본문 블록 조회 (페이지네이션 처리)
  - Notion API 응답 → 내부 `Post` 타입 매핑 함수 작성
  - ISR 설정(`export const revalidate = 3600`) 적용
  - Playwright MCP로 실제 페이지 렌더링 시 데이터가 표시되는지 검증

- **T010: 홈 페이지 및 글 목록 페이지 Notion 데이터 연동**
  - 관련 기능: F001, F003, F004, F010
  - 상태: [ ]
  - 홈 페이지: `getPosts({ limit: 6 })`로 최신 글 6개 표시
  - 글 목록 페이지: 전체 발행 글 fetch 후 `PostsView`에 전달
  - 카테고리 필터 옵션을 Notion DB Category 값 기반으로 동적 생성
  - 더미 데이터 제거 및 실제 데이터로 전환
  - Playwright MCP로 카테고리 필터, 검색 동작 E2E 검증

- **T011: Notion 블록 렌더러 구현**
  - 관련 기능: F002, F011
  - 상태: [ ]
  - `lib/notion-renderer.tsx`에 `NotionRenderer` 컴포넌트 작성
  - 지원 블록: paragraph, heading_1, heading_2, heading_3, image, bulleted_list_item, numbered_list_item, quote, divider, code
  - `NotionRichText` 처리 (bold, italic, code, link 등 annotation)
  - 이미지 블록은 Next.js `<Image>` 컴포넌트로 최적화
  - code 블록은 언어별 스타일링 (단순 `<pre><code>` 수준)

- **T012: 글 상세 페이지 Notion 데이터 연동 및 SEO 메타데이터**
  - 관련 기능: F002, F010, F011
  - 상태: [ ]
  - `generateStaticParams()`로 빌드 타임 정적 경로 생성
  - `generateMetadata()`로 페이지별 title/description 동적 설정
  - 존재하지 않는 slug 접근 시 `notFound()` 처리
  - `NotionRenderer`로 본문 블록 렌더링
  - Playwright MCP로 글 상세 페이지 진입, 메타데이터, 404 처리 검증

- **T013: 핵심 기능 통합 테스트**
  - 관련 기능: F001, F002, F003, F004, F010, F011
  - 상태: [ ]
  - Playwright MCP로 홈 → 글 목록 → 글 상세 전체 사용자 플로우 검증
  - 카테고리 필터와 검색의 조합 동작 검증
  - 빈 상태(empty state), 404, ISR revalidate 동작 확인
  - 모바일/태블릿/데스크탑 반응형 동작 검증

### Phase 4: 최적화 및 배포

성능 최적화와 배포 환경 구성을 마무리하는 단계입니다.

- **T014: 성능 최적화 및 접근성 개선**
  - 관련 기능: 전 기능 공통
  - 상태: [ ]
  - 이미지 최적화 (Next.js Image, `priority`, `sizes` 설정)
  - Lighthouse 기준 Performance/Accessibility/SEO 90+ 달성
  - 시맨틱 HTML 및 ARIA 속성 점검
  - 폰트 로딩 최적화 (Pretendard, Geist Mono)

- **T015: Vercel 배포 및 환경 변수 구성**
  - 관련 기능: 인프라
  - 상태: [ ]
  - Vercel 프로젝트 연결 및 배포 파이프라인 구성
  - Production 환경 변수 설정 (Notion API Key, Database ID)
  - 커스텀 도메인 연결 (선택)
  - 배포 후 ISR 동작 및 Notion 콘텐츠 업데이트 반영 시간 검증

- **T016: 운영 문서화 및 README 정리**
  - 관련 기능: 인프라
  - 상태: [ ]
  - `README.md`에 로컬 개발 환경 세팅 가이드 작성
  - Notion DB 스키마(Status, Category, Tags, PublishedAt, Slug) 문서화
  - 글 발행 워크플로우 가이드 (Status 변경 → ISR 갱신) 작성
  - 트러블슈팅 섹션 정리
