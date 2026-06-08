# 004-005 — T004·T005 검증: 레이아웃 및 공유 컴포넌트 구현

- 관련 ROADMAP 항목: `docs/ROADMAP.md` T004, T005 (Phase 2)
- 검증 방식: 정적 코드 대조 + `grep` 기반 사용처 추적 (코드 변경 없음)
- 종합 결과: **부분 통과 (9/11)** — 미흡 2건 발견. ROADMAP 체크박스는 갱신하지 않음.

## T004: 레이아웃 컴포넌트(Header, Footer, MobileNav)

| # | 검증 항목 | 결과 | 근거 |
|---|---|---|---|
| 1 | `Header.tsx`: 로고, 데스크탑 네비게이션, 테마 토글 | ✅ 통과 | `components/layout/header.tsx`: `<Logo />` + `NAV_LINKS.map(...)` + `<ThemeToggle />` |
| 2 | `Footer.tsx`: 카피라이트 및 부가 링크 | ✅ 통과 | `components/layout/footer.tsx`: `© {year} {APP_NAME}` 카피라이트 표시 |
| 3 | `MobileNav.tsx`: 모바일 햄버거 메뉴 (`md:hidden`) | ✅ 통과 | `components/layout/mobile-nav.tsx`: `Sheet` 기반 햄버거 메뉴, `md:hidden` 클래스 적용 |
| 4 | `usePathname()` 기반 active 링크 스타일 처리 | ⚠️ **미흡** | `grep -rln "usePathname" components app` 결과 **`mobile-nav.tsx`에서만** `usePathname()`을 사용해 `cn(pathname === item.href ? "bg-primary text-primary-foreground" : ...)` 처리(19, 42~45행). **데스크탑 `header.tsx`의 nav `<Link>`(14~22행)에는 active 스타일 분기가 없음** — 명세는 컴포넌트를 특정하지 않았으므로 Header에도 동일 처리가 필요 |
| 5 | 반응형 브레이크포인트(md=768px) 적용 | ✅ 통과 | `header.tsx`의 `md:flex`(데스크탑 노출)와 `mobile-nav.tsx`의 `md:hidden`(모바일 노출)이 상호 보완 |

## T005: 공유 컴포넌트(PostCard, CategoryBadge, TagBadge, SearchInput, Logo, ThemeToggle)

| # | 검증 항목 | 결과 | 근거 |
|---|---|---|---|
| 1 | `PostCard.tsx`: 카드 UI (제목, 카테고리 뱃지, 발행일) | ✅ 통과 | `components/shared/post-card.tsx`: `Card` + `CategoryBadge` + `line-clamp-2` 제목 + 포맷된 발행일 |
| 2 | `CategoryBadge.tsx` | ✅ 통과 | 카테고리 없으면 `null`, 있으면 `<Badge variant="secondary">` 반환 |
| 3 | `TagBadge.tsx` | ✅ 통과 | `<Badge variant="outline">#{tag}</Badge>` |
| 4 | `SearchInput.tsx`: 검색 입력 컴포넌트 (**debounce 적용**) | ⚠️ **미흡** | `grep -rn "useDebounce\|debounce" app components lib hooks` 결과, `hooks/use-debounce.ts`가 `useDebounceValue`/`useDebounceCallback`을 재출력만 할 뿐 **`search-input.tsx`·`posts-view.tsx` 등 어디에서도 import/사용되지 않음**(0건). `onChange={(e) => onChange(e.target.value)}`로 매 키입력마다 즉시 상위로 전파되어 디바운스 미적용 |
| 5 | `Logo.tsx`, `ThemeToggle.tsx` | ✅ 통과 | `Logo`: `PenLine` 아이콘 + `APP_NAME` 링크. `ThemeToggle`: `next-themes`의 `useTheme` 기반 Sun/Moon 토글 |

## 미흡 사항 상세 및 권고

1. **Header 데스크탑 네비 active 스타일 부재**
   - 위치: `components/layout/header.tsx:14-22`
   - 권고: `mobile-nav.tsx`의 패턴(`usePathname()` + `cn(pathname === item.href ? ... : ...)`)을 데스크탑 `<Link>`에도 동일 적용
2. **SearchInput debounce 미적용**
   - 위치: `components/shared/search-input.tsx`, `components/shared/posts-view.tsx`
   - 권고: `@/hooks`의 `useDebounceValue` 또는 `useDebounceCallback`으로 `onChange` 전파를 디바운스 처리(예: 300ms)

## 결론

11개 항목 중 9개 통과. 위 2건의 미흡 사항으로 인해 **T004/T005의 ROADMAP 체크박스는 `[ ]` 상태를 유지**하며, 후속 작업(수정 구현)에서 해소 후 재검증 필요.
