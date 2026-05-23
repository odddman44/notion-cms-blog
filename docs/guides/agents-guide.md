# Claude Agents 활용 가이드

이 프로젝트에는 개발 워크플로우 단계별로 특화된 7개의 Claude 서브에이전트가 있습니다.
각 에이전트는 역할을 분리하여 더 집중된 출력을 만들어냅니다.

---

## 에이전트 목록

| 에이전트 | 위치 | 역할 한 줄 요약 |
|---------|------|--------------|
| `prd-generator` | `docs/` | 프로젝트 아이디어 → 개발 가능한 PRD 문서 생성 |
| `prd-validator` | `docs/` | PRD의 기술적 타당성 검증 (CoT 방식) |
| `development-planner` | `dev/` | PRD → ROADMAP.md 생성 및 업데이트 |
| `nextjs-app-developer` | `dev/` | App Router 라우트 구조, 레이아웃 설계 및 구현 |
| `ui-markup-specialist` | `dev/` | 정적 마크업 + Tailwind/Shadcn 스타일링 |
| `code-reviewer` | `dev/` | 구현 완료 코드 리뷰 (한국어, 심각도별) |
| `starter-cleaner` | `dev/` | 스타터킷 보일러플레이트 제거 및 초기화 |

---

## 개발 단계별 워크플로우

### 새 프로젝트 시작

```
1. prd-generator   — 아이디어를 PRD로 정리
2. prd-validator   — PRD 기술적 타당성 검토
3. starter-cleaner — 스타터킷을 프로젝트에 맞게 초기화
4. development-planner — ROADMAP.md 생성
5. nextjs-app-developer — 라우트/레이아웃 골격 구축
```

### 기능 구현 사이클

```
1. nextjs-app-developer — 페이지/라우트 구조 먼저 잡기
2. ui-markup-specialist  — 정적 마크업과 스타일링
3. (로직 직접 구현)
4. code-reviewer         — 구현 완료 후 리뷰
```

### 로드맵 관리

```
development-planner — ROADMAP.md 태스크 상태 업데이트
```

---

## 에이전트별 트리거 예시

### `prd-generator`

```
"새 프로젝트 PRD 작성해줘 — 사용자가 독서 기록을 남기는 앱"
"이 아이디어로 바로 개발할 수 있는 명세서 만들어줘"
```

- 기업용 복잡함(보안 요구사항, 마일스톤, API 라우트) 없이 1인 개발자 수준의 실용적 PRD를 생성
- 기능 명세(F001...) ↔ 메뉴 구조 ↔ 페이지별 상세 기능 간 정합성 자동 검증

### `prd-validator`

```
"이 PRD 기술적으로 문제 없는지 검증해줘"
"구현 전에 리스크 파악해줘"
```

- Chain of Thought로 단계별 추론 → [FACT/INFERENCE/UNCERTAIN] 태깅
- "구현 불가능" 선언 전에 반드시 3개 이상 대안 탐색

### `development-planner`

```
"이 PRD로 ROADMAP.md 작성해줘"
"Task 005 완료됐으니 로드맵 업데이트해줘"
"Phase 3에 새 태스크 추가해야 해"
```

- 구조 우선 접근법: Phase 1(골격) → Phase 2(UI) → Phase 3(기능) → Phase 4(최적화)
- 태스크는 1-2주 내 완료 가능한 단위로 분해

### `nextjs-app-developer`

```
"대시보드, 설정, 프로필 페이지 구조 만들어줘"
"인증 영역과 공개 영역을 라우트 그룹으로 분리해줘"
"모달을 인터셉트 라우트로 구현하고 싶어"
```

- 항상 빈 껍데기 페이지를 먼저 생성 (로직 없음)
- `loading.tsx`, `error.tsx` 특수 파일 포함
- 서버 컴포넌트 우선 원칙, `use client` 최소화

### `ui-markup-specialist`

```
"통계 카드 컴포넌트 만들어줘"
"이 폼 레이아웃 모던하게 개선해줘"
"반응형 네비게이션 바 마크업 작성해줘"
```

- **담당**: HTML 마크업, Tailwind 클래스, Shadcn UI 컴포넌트, Lucide 아이콘
- **비담당**: useState/useReducer, API 호출, 폼 유효성 검사 로직, 서버 액션
- 로직이 필요한 자리에는 `// TODO: 구현 필요` 플레이스홀더로 표시

### `code-reviewer`

```
(코드 구현 완료 직후 자동 또는 수동으로 실행)
"방금 작성한 인증 함수 리뷰해줘"
"이 컴포넌트 코드 품질 검토해줘"
```

- 심각도 높음 / 중간 / 낮음 으로 구분
- 문제 지적 + 수정 방안 + 코드 예시 함께 제시
- 코드 구현 완료 후 자동으로 실행하는 것 권장

### `starter-cleaner`

```
"스타터킷 초기화해줘, 불필요한 예제 코드 다 지워줘"
"이 프로젝트 PRD 기반으로 README 업데이트해줘"
```

- `docs/PRD.md`가 있으면 해당 내용을 기반으로 `README.md` 자동 재작성
- 핵심 설정 파일(tsconfig, tailwind, shadcn 컴포넌트)은 보존
- 실행 전 제거/보존 파일 목록을 분석 단계에서 먼저 출력

---

## MCP 도구 연계

에이전트들은 다음 MCP 도구를 활용합니다. 해당 MCP가 없으면 해당 기능은 skip됩니다.

| MCP | 활용 에이전트 | 용도 |
|-----|-------------|------|
| **Context7** | nextjs-app-developer, ui-markup-specialist | Next.js/Tailwind/React 최신 공식 문서 실시간 참조 |
| **Playwright** | development-planner | API 연동·비즈니스 로직 구현 후 E2E 테스트 수행 |
| **Sequential Thinking** | nextjs-app-developer, ui-markup-specialist | 복잡한 아키텍처/레이아웃 설계 시 단계별 의사결정 |
| **Shadcn MCP** | nextjs-app-developer, ui-markup-specialist | 컴포넌트 검색, 설치 명령어 확인, 예제 코드 참조 |

> Context7와 Playwright는 현재 프로젝트 설정에 포함되어 있습니다.

---

## 주의사항

### 에이전트 한계

- **`ui-markup-specialist`** — 스타일링 전문가입니다. 인터랙션 로직까지 요청하면 플레이스홀더만 남깁니다. 로직이 필요하면 이후 별도로 구현하거나 메인 Claude에게 요청하세요.
- **`prd-generator`** — URL 경로, 인프라, 성능 지표, 보안 요구사항은 의도적으로 생략합니다. 필요하면 별도로 추가하세요.
- **`code-reviewer`** — 전체 코드베이스 리뷰보다 최근 작성/수정된 코드 리뷰에 최적화되어 있습니다.

### 조합 시 유의점

- `nextjs-app-developer`와 `ui-markup-specialist`를 함께 쓸 때: 라우트 구조 먼저(nextjs-app-developer), 그 위에 마크업(ui-markup-specialist) 순서를 권장합니다.
- `prd-generator` 출력물을 `prd-validator`에 바로 넘기면 검증 루프를 효율적으로 돌릴 수 있습니다.
- `starter-cleaner`는 프로젝트 초기 1회만 실행하는 것을 원칙으로 합니다.

### shadcn/ui 스타일 테마

`ui-markup-specialist`는 프로젝트 `CLAUDE.md`에 명시된 스타일 테마를 따릅니다.
이 프로젝트는 `radix-nova` 스타일을 사용합니다(`CLAUDE.md` 참조).
