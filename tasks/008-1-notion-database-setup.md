# 008-1 — T008-1: Notion 데이터베이스 생성, 스키마 확정, Integration 연결

- 관련 ROADMAP 항목: `docs/ROADMAP.md` T008-1 (Phase 3, 우선순위)
- 관련 기능: F010 (Notion 연동 전 기능 공통 선행 조건)
- 작업 성격: **사용자 수동 작업(Notion UI) + 결과 전달**. 코드로 대체 불가능하며, T009~T012 전체를 막는 선행 조건(blocking prerequisite).

## 고수준 명세

`lib/notion.ts`의 `getPosts()`/`pageToPost()`는 Notion DB에 **특정 이름·타입의 속성이 존재한다고 가정**하고 값을 읽는다. 속성명·타입이 일치하지 않으면 에러 없이 조용히 빈 값으로 채워지므로(silent failure), 실제 Notion 워크스페이스에 DB를 만들고 스키마를 코드와 정확히 일치시키는 작업이 코드 연동(T009) 이전에 반드시 선행되어야 한다.

이 작업은 두 부분으로 나뉜다.
1. **사용자가 Notion UI에서 직접 수행**: DB 생성, 속성 정의, Integration 생성·연결, 샘플 글 1건 발행.
2. **AI에게 전달 후 정합성 확인**: DB ID(데이터 소스 ID)와 실제 속성명/타입을 AI에 전달 → AI가 `lib/notion.ts`의 하드코딩 속성명과 1:1 대조해 불일치 시 코드 또는 스키마를 맞춤.

## 코드가 기대하는 정확한 속성 스펙

`lib/notion.ts` `pageToPost()` 기준. **속성명은 대소문자까지 정확히 일치해야 함.**

| 속성명 (Notion) | Notion 타입 | 코드 사용처 | 비고 |
|---|---|---|---|
| `Title` | `title` (제목) | `props.Title.title[0].plain_text` | DB의 기본 제목 속성 이름을 `Title`로 변경해야 함 (기본값은 보통 `Name`/`이름`) |
| `Category` | `select` (선택) | `props.Category.select.name` | 단일 선택. 옵션 예: 일상, 개발, 회고 |
| `Tags` | `multi_select` (다중 선택) | `props.Tags.multi_select[].name` | 0개 이상 |
| `PublishedAt` | `date` (날짜) | `props.PublishedAt.date.start` | 정렬 기준(`sorts`)으로도 사용 → 누락 시 정렬 오류 가능 |
| `Status` | `status` (상태) | `props.Status.status.name`, 필터 `equals: "published"` | 상태 옵션에 정확히 `published`, `draft` 값이 존재해야 함 |

> 주의: `slug`는 별도 속성이 아니라 **페이지 ID**를 그대로 사용한다(`slug: page.id`). 따라서 Slug 속성은 만들 필요 없음. (단, ROADMAP T003/T016에 "Slug 속성" 언급이 있으므로 향후 slug 속성 도입 시 코드 변경 필요 — 현재 구현 기준으로는 불필요.)

## 사용자가 Notion에서 직접 해야 할 일 (체크리스트)

- [ ] Notion에 블로그용 데이터베이스(Database - Full page) 생성
- [ ] 기본 제목 속성 이름을 `Title`로 변경
- [ ] `Category` 속성 추가 (타입: Select), 사용할 카테고리 옵션 등록
- [ ] `Tags` 속성 추가 (타입: Multi-select)
- [ ] `PublishedAt` 속성 추가 (타입: Date)
- [ ] `Status` 속성 추가 (타입: Status), 옵션에 `published` / `draft` 값 정확히 추가
- [ ] [notion.so/my-integrations](https://www.notion.so/my-integrations)에서 Internal Integration 생성 (capabilities: Read content)
- [ ] 생성한 DB 페이지의 `...` → Connections → 해당 Integration 연결(공유)
- [ ] 테스트용 샘플 글 1건 작성 후 `Status`를 `published`로 설정
- [ ] Integration Secret(`NOTION_API_KEY`), 데이터 소스 ID(`NOTION_DATABASE_ID`)를 확보해 AI에 전달

> 데이터 소스 ID 확인: @notionhq/client v5는 `databases.query`가 제거되어 `dataSources.query({ data_source_id })`를 사용한다. DB URL의 32자 ID가 아니라 **데이터 소스 ID**가 필요할 수 있으므로, 값 확인 시 Notion API/SDK 문서를 참조해 정확한 ID를 전달한다.

## AI가 전달받은 후 해야 할 일 (정합성 확인)

- [ ] 전달받은 속성명/타입을 위 "정확한 속성 스펙" 표와 1:1 대조
- [ ] 불일치 발견 시: (a) 사용자가 Notion 속성명을 수정하도록 안내하거나 (b) `lib/notion.ts`의 하드코딩 속성명을 실제 스키마에 맞춰 수정
- [ ] `.env.local`에 `NOTION_API_KEY`, `NOTION_DATABASE_ID` 설정 (`.env.local.example` 키와 일치 확인)
- [ ] `Status` 옵션 값이 정확히 `published`/`draft`인지 확인 (필터/매핑이 이 문자열에 의존)

## 관련 파일

- `lib/notion.ts` — 속성명/타입 하드코딩 (대조 대상)
- `.env.local.example` — `NOTION_API_KEY`, `NOTION_DATABASE_ID` 키 정의 (T001에서 생성됨)
- `types/index.ts` — `Post` 타입 (매핑 대상)

## 수락 기준

- [ ] Notion에 DB가 생성되고 5개 속성(`Title`/title, `Category`/select, `Tags`/multi_select, `PublishedAt`/date, `Status`/status)이 정확한 이름·타입으로 존재한다.
- [ ] `Status`에 `published`, `draft` 옵션이 존재하고 샘플 글 1건이 `published` 상태이다.
- [ ] Integration이 생성되어 해당 DB에 연결(Read content)되어 있다.
- [ ] `NOTION_API_KEY`, `NOTION_DATABASE_ID`가 `.env.local`에 설정되어 있다.
- [ ] 실제 속성 스펙이 `lib/notion.ts`의 기대값과 일치한다(또는 불일치가 코드 수정으로 해소됨).

## 테스트 체크리스트

> 본 작업은 외부(Notion) 설정 작업이므로 Playwright E2E보다 연결 검증이 핵심이다. 검증은 T009 코드 연동 직전 스모크 테스트로 수행한다.

- [ ] `getPosts()` 호출 시 권한/연결 에러 없이 응답이 반환된다 (Integration 연결 검증).
- [ ] 응답 글의 `title`, `category`, `tags`, `publishedAt`, `status`가 빈 값/기본값이 아닌 실제 입력값으로 매핑된다 (속성명 일치 검증 — 빈 값이면 속성명 불일치 의심).
- [ ] `published` 글만 조회되고 `draft` 글은 제외된다 (Status 필터 검증).
- [ ] (T009 진행 시) Playwright MCP로 홈/목록 페이지에 실제 글이 렌더링되는지 확인.
