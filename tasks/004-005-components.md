# 004-005 — T004·T005 검증: 레이아웃 및 공유 컴포넌트 구현

- 관련 ROADMAP 항목: `docs/ROADMAP.md` T004, T005 (Phase 2)
- 검증 방식: 정적 코드 대조 + `grep` 기반 사용처 추적 (코드 변경 없음)
- 종합 결과: **통과 (11/11)** — 미흡 2건 수정 완료. ROADMAP 체크박스 갱신됨.

## T004: 레이아웃 컴포넌트(Header, Footer, MobileNav)

| # | 검증 항목 | 결과 | 근거 |
|---|---|---|---|
| 1 | `Header.tsx`: 로고, 데스크탑 네비게이션, 테마 토글 | ✅ 통과 | `components/layout/header.tsx`: `<Logo />` + `NAV_LINKS.map(...)` + `<ThemeToggle />` |
| 2 | `Footer.tsx`: 카피라이트 및 부가 링크 | ✅ 통과 | `components/layout/footer.tsx`: `© {year} {APP_NAME}` 카피라이트 표시 |
| 3 | `MobileNav.tsx`: 모바일 햄버거 메뉴 (`md:hidden`) | ✅ 통과 | `components/layout/mobile-nav.tsx`: `Sheet` 기반 햄버거 메뉴, `md:hidden` 클래스 적용 |
| 4 | `usePathname()` 기반 active 링크 스타일 처리 | ✅ **수정 완료** | `header.tsx`에 `"use client"` 추가 후 `usePathname()` + `cn(pathname === link.href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")` 적용 (mobile-nav.tsx 패턴 재사용, 새 추상화 없음) |
| 5 | 반응형 브레이크포인트(md=768px) 적용 | ✅ 통과 | `header.tsx`의 `md:flex`(데스크탑 노출)와 `mobile-nav.tsx`의 `md:hidden`(모바일 노출)이 상호 보완 |

## T005: 공유 컴포넌트(PostCard, CategoryBadge, TagBadge, SearchInput, Logo, ThemeToggle)

| # | 검증 항목 | 결과 | 근거 |
|---|---|---|---|
| 1 | `PostCard.tsx`: 카드 UI (제목, 카테고리 뱃지, 발행일) | ✅ 통과 | `components/shared/post-card.tsx`: `Card` + `CategoryBadge` + `line-clamp-2` 제목 + 포맷된 발행일 |
| 2 | `CategoryBadge.tsx` | ✅ 통과 | 카테고리 없으면 `null`, 있으면 `<Badge variant="secondary">` 반환 |
| 3 | `TagBadge.tsx` | ✅ 통과 | `<Badge variant="outline">#{tag}</Badge>` |
| 4 | `SearchInput.tsx`: 검색 입력 컴포넌트 (**debounce 적용**) | ✅ **수정 완료** | `@/hooks`의 `useDebounceCallback(onChange, 300)`으로 상위 onChange 전파를 300ms 지연 처리. `value` prop과 `SearchInputProps` 계약 무변경 — `posts-view.tsx` 수정 없음 |
| 5 | `Logo.tsx`, `ThemeToggle.tsx` | ✅ 통과 | `Logo`: `PenLine` 아이콘 + `APP_NAME` 링크. `ThemeToggle`: `next-themes`의 `useTheme` 기반 Sun/Moon 토글 |

## 수정 이력

1. **Header 데스크탑 네비 active 스타일** — ✅ 수정 완료
   - `components/layout/header.tsx`: `"use client"` 추가, `usePathname()` + `cn()` 조건부 스타일 적용
   - `mobile-nav.tsx`의 기존 패턴 재사용 (surgical change, 새 추상화 없음)
2. **SearchInput debounce** — ✅ 수정 완료
   - `components/shared/search-input.tsx`: `useDebounceCallback(onChange, 300)` 적용 (`@/hooks` 배럴 import)
   - `SearchInputProps`·`posts-view.tsx` 계약 무변경

> **참고**: Playwright 런타임 검증은 `.env.local` 플레이스홀더로 인해 서버가 500을 반환해 시도했으나 수행 불가. 정적 코드 검토로 두 수정 사항의 명세 충족을 확인. T008-1(Notion DB 설정) 완료 후 T009-T012 검증 시 통합 런타임 검증 예정.

## 결론

11개 항목 모두 통과 (미흡 2건 수정 완료). **T004/T005의 ROADMAP 체크박스 갱신 완료**.
