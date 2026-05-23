# 개인 데일리 블로그

Notion을 CMS로 활용한 개인 데일리 블로그입니다. Notion에서 글을 작성하면 자동으로 블로그에 반영됩니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **CMS**: Notion API (`@notionhq/client`)
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Deployment**: Vercel

## 주요 기능

- Notion 데이터베이스 기반 글 목록 및 상세 페이지
- 카테고리별 필터링
- 검색 기능
- 반응형 디자인

## 시작하기

### 환경 변수 설정

`.env.local` 파일을 생성하고 아래 값을 설정합니다.

```bash
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_database_id
```

### Notion 데이터베이스 구조

| 속성 | 타입 | 설명 |
|------|------|------|
| Title | title | 글 제목 |
| Category | select | 카테고리 |
| Tags | multi_select | 태그 |
| Published | date | 발행일 |
| Status | select | 상태 (초안 / 발행됨) |

### 개발 서버 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 배포

Vercel에 배포 시 환경 변수를 프로젝트 설정에 추가해야 합니다.
