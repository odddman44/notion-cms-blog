# Notion 데이터베이스 설정 가이드 (사용자 직접 작업)

이 블로그는 Notion 데이터베이스를 CMS로 사용합니다. `lib/notion.ts`의 코드가 **특정 이름·타입의 속성이 존재한다고 가정**하고 값을 읽기 때문에, 아래 스펙과 정확히 일치하는 데이터베이스를 Notion에 직접 만들어야 합니다. 속성명이 하나라도 다르면 에러 없이 빈 값으로 채워지므로(silent failure) 주의가 필요합니다.

## 1. 데이터베이스 생성

Notion에서 새 페이지 → `Database - Full page`로 데이터베이스를 만듭니다.

## 2. 속성 정의 (이름·타입을 정확히 일치시킬 것)

| 속성명 (대소문자 정확히) | 타입 | 설정 |
|---|---|---|
| `Title` | Title (제목) | 데이터베이스 기본 제목 속성의 이름을 `Title`로 변경 (기본값은 보통 `Name`/`이름`) |
| `Category` | Select (선택) | 사용할 카테고리 옵션을 등록 (예: 일상, 개발, 회고) |
| `Tags` | Multi-select (다중 선택) | 옵션은 자유롭게 추가 가능 (0개 이상) |
| `PublishedAt` | Date (날짜) | 글 정렬 기준으로 사용되므로 누락 시 정렬 오류 발생 |
| `Status` | Status (상태) | 옵션에 **정확히 `published`, `draft`** 값을 추가 (코드가 이 문자열로 필터링) |

> **`Slug` 속성은 만들 필요 없습니다.** 코드는 슬러그로 Notion 페이지 ID(`page.id`)를 그대로 사용합니다.

## 3. Integration 생성 및 연결

1. [notion.so/my-integrations](https://www.notion.so/my-integrations) 접속 → 새 Internal Integration 생성 (capabilities: `Read content`만 있으면 충분)
2. 생성된 **Integration Secret** 복사 (이후 `NOTION_API_KEY`로 사용)
3. 만든 데이터베이스 페이지 우측 상단 `...` → `Connections` → 방금 만든 Integration을 연결(공유)

## 4. 샘플 글 작성

테스트를 위해 글 1건을 작성하고 `Status`를 `published`로 설정합니다. (글이 1건도 없거나 모두 `draft`면 블로그에 아무것도 표시되지 않습니다.)

## 5. 환경 변수 설정

`.env.local.example`을 복사해 `.env.local`을 만들고 아래 두 값을 채웁니다.

```bash
NOTION_API_KEY=secret_xxx        # 3단계에서 복사한 Integration Secret
NOTION_DATABASE_ID=xxx           # 데이터베이스(데이터 소스) ID
```

> **데이터 소스 ID 확인 시 주의**: `@notionhq/client` v5는 `databases.query`가 제거되고 `dataSources.query({ data_source_id })`를 사용합니다. 데이터베이스 URL에 보이는 32자 ID와 실제로 코드에 필요한 데이터 소스 ID가 다를 수 있으니, Notion 페이지의 데이터베이스 메뉴 또는 API 응답에서 정확한 데이터 소스 ID를 확인해 전달해주세요.

## 완료 후 확인 체크리스트

- [ ] 데이터베이스가 생성되고 5개 속성(`Title`/`Category`/`Tags`/`PublishedAt`/`Status`)이 정확한 이름·타입으로 존재한다
- [ ] `Status` 옵션에 `published`/`draft`가 있고, 샘플 글 1건이 `published` 상태이다
- [ ] Integration이 생성되어 데이터베이스에 연결(`Connections`)되어 있다
- [ ] `NOTION_API_KEY`, `NOTION_DATABASE_ID`를 `.env.local`에 입력했다

위 항목을 모두 마치셨다면, 알려주세요. 전달해주신 속성명·타입을 코드(`lib/notion.ts`)와 1:1로 대조해서 연동을 진행하겠습니다.
