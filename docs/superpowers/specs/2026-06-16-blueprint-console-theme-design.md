# Blueprint Console — 전체 공통 테마 리디자인 설계

- 날짜: 2026-06-16
- 범위: 전체 공통 테마 (모든 SSR 페이지)
- 방향: 고유한 아이덴티티(과감) — "백엔드 엔지니어의 관리 콘솔"
- 웹폰트: Google Fonts CDN

## 1. 목표 / 배경

"WorkFlow"는 백엔드 개발자의 관리 콘솔 + 포트폴리오다. 현재 팔레트는 Bootstrap 블루(`#0d6efd`) + 시스템 폰트 + 회색 스케일로, 어디에나 있는 템플릿 기본값에 가깝다. 주제(백엔드 콘솔, 레이어드 아키텍처)에서 출발한 고유 아이덴티티를 부여한다.

**제약**: 4영역 레이아웃(헤더/사이드바/메인/푸터)은 유지한다. 과감함은 팔레트·타이포·시그니처에 집중한다.

## 2. 디자인 토큰 (layout.css `:root` 재조정)

| 토큰 | 기존 | 신규 | 역할 |
|---|---|---|---|
| `--color-primary` | `#0d6efd` | `#E07B39` | 주 액션(쿠퍼/앰버) |
| `--color-primary-hover` | `#0b5ed7` | `#C9692C` | hover |
| `--color-primary-light` | `#e7f1ff` | `#FBEADB` | 뱃지/연한 배경 |
| `--color-secondary` (신규) | — | `#3B6FB0` | 스틸 블루 보조 |
| `--color-sidebar-bg` | `#1f2937` | `#0F1B2D` | 잉크 네이비 크롬 |
| `--color-sidebar-border` | `#374151` | `#1E2D45` | |
| `--color-sidebar-hover` | `#374151` | `#1A2A42` | |
| `--color-sidebar-text` | `#d1d5db` | `#A7B4C8` | |
| `--color-content-bg` | `#eef1f5` | `#ECF0F6` | 쿨 페이퍼 |
| `--color-text` | `#111827` | `#11203A` | 잉크 텍스트 |
| `--color-text-secondary` | `#6b7280` | `#5A6B85` | |
| `--color-text-muted` | `#9ca3af` | `#8A98AE` | |
| `--color-border` | `#e5e7eb` | `#DAE1EC` | |

- semantic(success/warning/danger/info): 잉크 톤과 어울리도록 약하게만 재조정(과한 변경 금지).
- 회색 스케일(`--color-gray-*`), 간격/그림자/라운드/transition 토큰은 유지.

## 3. 타이포그래피 (핵심 — 이 디자인의 위험 한 방)

- 웹폰트 도입(Google Fonts CDN, `head.hbs`의 `<link>`):
  - `IBM Plex Mono` — 라벨·수치·display(구조 타이포)
  - `Inter` — 본문/문장
- 토큰:
  - `--font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;`
  - `--font-family-mono: 'IBM Plex Mono', 'Menlo', monospace;`
- 모노스페이스 구조 타이포 적용 대상: 사이드바 라벨, 페이지/섹션 제목 아이브로우, 테이블 헤더, stat 숫자, 뱃지. 문장/본문은 Inter.

## 4. 시그니처 요소 (과감함을 한 곳에 집중)

1. 사이드바 블루프린트 그리드 — 잉크 배경 위 저대비 격자선(CSS `linear-gradient` background). 레이어드 아키텍처 은유.
2. `// SECTION` 모노 아이브로우 — 섹션/페이지 제목 위 쿠퍼색 모노 라벨 + 짧은 tick (`.page-header`, `.portfolio-section-title`, `.nav-label`).
3. 터미널 톤 stat — `.stat-value` 큰 모노 숫자, `.stat-card` 상단 쿠퍼 hairline.
4. nav active — 기존 `.nav-link.active::before` 좌측 틱을 쿠퍼로.

나머지 요소는 전부 조용하게 유지(절제). 추가 애니메이션은 도입하지 않는다(기존 transition 유지).

## 5. 컴포넌트 적용 (레이아웃 구조 불변)

- 헤더: 잉크 그라디언트 유지, 브랜드 워드마크 모노 + 쿠퍼 점 액센트.
- 사이드바: 블루프린트 그리드 background, 모노 `.nav-label`, 쿠퍼 active 틱.
- 카드/모달: 토큰 기반 재스타일(테두리/그림자 유지).
- `.admin-table`: 모노 대문자 thead, 쿠퍼 hover 액센트.
- `.badge-use`: on=쿠퍼 계열, off=회색.
- 버튼: `.btn-primary`→쿠퍼, `.btn-outline-light` 헤더용 유지.
- 포트폴리오: 아바타 잉크+쿠퍼 그라디언트, `.portfolio-role` 쿠퍼, 프로젝트 카드 토큰 정렬.
- 로그인(`auth-card`): 잉크/쿠퍼 액센트.

## 6. 변경 파일 (Surgical)

- `public/css/layout.css` — 핵심. `:root` 토큰 재조정 + 시그니처 스타일 + Bootstrap 유틸 오버라이드.
  - Bootstrap 오버라이드 대상(포트폴리오/헤더에서 실제 사용 중): `.btn-primary`, `.bg-primary`, `.bg-secondary`, `.bg-success`, `.bg-info`, `.bg-warning`, `.bg-dark`, `.text-primary`.
  - layout.css가 bootstrap.min.css 뒤에 로드되므로 동일 specificity에서 오버라이드 성립.
- `views/partials/head.hbs` — Google Fonts `<link>` 추가(preconnect + 폰트 2종). layout.css 이전에 위치.
- `views/partials/header.hbs`, `views/partials/sidebar.hbs` — 최소 class만(가능하면 CSS로 처리, 템플릿 변경 최소화).
- `.claude/rules/ui-design.md` — 신규 컬러·폰트·시그니처를 구현 전 등록(프로젝트 룰). 테마 컬러 표 갱신 + 폰트/시그니처 규칙 추가.

포트폴리오 뱃지는 Bootstrap 유틸을 CSS에서 리테마(템플릿 미변경).

## 7. 검증 기준 (성공 조건)

- 모든 SSR 페이지에서 새 팔레트/폰트가 적용된다(Bootstrap 블루 잔존 없음).
- 4영역 레이아웃·반응형(태블릿 축소/모바일 사이드바 숨김) 동작 유지.
- `npm run build` 통과, 페이지 렌더 시 콘솔 에러 없음.
- `ui-design.md` 테마 표가 실제 적용 색과 일치.
- 키보드 포커스 가시성 유지, `!important` 신규 사용은 기존 유틸 패턴 내에서만.

## 8. 비범위 (YAGNI)

- 레이아웃 구조 변경, 새 페이지 추가, 다크모드 토글, 신규 애니메이션, JS 동작 변경은 하지 않는다.
