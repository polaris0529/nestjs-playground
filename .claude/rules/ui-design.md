# UI Design Rules (Vue)

See root `CLAUDE.md` for global rules.

## Frontend Direction

- New frontend work uses Vue.js. Do not create server-rendered page templates for product screens.
- When scaffolded, Vue source belongs under `frontend/`.
- Use Vue single-file components for UI. Keep API calls in shared client modules instead of scattering `fetch` or axios calls across components.
- Use route-level pages, shared layout components, and reusable table/form/modal components for admin workflows.
- Vue source under `frontend/` is the frontend source of truth.

## Layout Structure

```
+---------------- header ----------------------------+
|  logo                        user info / actions   |
+--left-sidebar--+------------- main ----------------+
|                |                                    |
|   navigation   |   routed Vue page content          |
|   menu items   |                                    |
|                +------------------------------------+
|                |      footer                        |
+----------------+------------------------------------+
```

- Preserve the admin shell: header, left sidebar, main content, and footer.
- Login/auth pages may use a standalone centered layout.
- Sidebar is hidden on mobile; header remains visible.
- Dynamic menu data should come from an API or bootstrapped route data, then render as Vue components.

## Vue Rules

- Do not use `v-html` for untrusted values unless a sanitizer is established and the safety boundary is documented.
- Use props and typed models for component contracts.
- Keep component state local unless shared state is genuinely needed.
- Centralize auth/session handling in the HTTP client and router guard layer.
- Mutating requests must send the app CSRF token via `X-CSRF-Token`.
- UI authorization is not security. Backend guards must remain the authority.

## Theme Colors

Blueprint Console theme — ink navy chrome + cool paper content + copper signal accent.

| Token | Hex | Usage |
|---|---|---|
| `--color-sidebar-bg` | `#0F1B2D` | Sidebar / header chrome (ink navy) |
| `--color-sidebar-text` | `#A7B4C8` | Sidebar text |
| `--color-content-bg` | `#ECF0F6` | Main content background (cool paper) |
| `--color-card` | `#ffffff` | Card / panel background |
| `--color-text` | `#11203A` | Default text (ink) |
| `--color-text-muted` | `#8A98AE` | Secondary text |
| `--color-primary` | `#E07B39` | Primary action / signal accent (copper) |
| `--color-secondary` | `#3B6FB0` | Steel-blue secondary |
| `--color-border` | `#DAE1EC` | Borders / dividers |
| `--color-success` | `#198754` | Success state |
| `--color-danger` | `#B42318` | Error and destructive state |

## Typography & Signature

- Use `Noto Sans KR` for Korean UI/body, `Inter` for Latin fallback, and `IBM Plex Mono` for labels, numbers, and structural type.
- Structural labels, badges, table headers, and numeric metadata use the mono stack.
- Body text uses the primary stack.
- Keep letter spacing at `0` except compact mono labels where a small positive value is intentional.

## Strict Rules

### Forbidden

- Server-rendered page templates for product screens.
- `v-html` or raw DOM HTML injection without sanitizer documentation.
- Hardcoded colors not registered in the theme table.
- Arbitrary changes to the 4-zone admin shell.
- CSS `!important`.

### Required

- Vue admin screens use shared layout, table, form, and modal components once introduced.
- Responsive behavior must preserve mobile readability and avoid overlapping text.
- New colors, layout changes, or rule exceptions must be registered in this file before implementation.

---

# UI 디자인 규칙 (Vue)

전체 공통 룰은 루트 `CLAUDE.md` 참조.

## 프론트엔드 방향

- 신규 프론트엔드 작업은 Vue.js를 사용한다. 제품 화면용 server-rendered page template을 만들지 않는다.
- Vue 앱을 scaffold하면 소스는 `frontend/` 하위에 둔다.
- UI는 Vue single-file component로 작성한다. API 호출은 component 곳곳에 흩뿌리지 말고 공통 client module에 둔다.
- 관리자 워크플로는 route page, shared layout component, 재사용 table/form/modal component를 사용한다.
- `frontend/` 하위 Vue 소스를 프론트엔드 기준 소스로 삼는다.

## 레이아웃 구조

```
+---------------- header ----------------------------+
|  logo                        user info / actions   |
+--left-sidebar--+------------- main ----------------+
|                |                                    |
|   navigation   |   routed Vue page content          |
|   menu items   |                                    |
|                +------------------------------------+
|                |      footer                        |
+----------------+------------------------------------+
```

- 관리자 셸을 유지한다: header, left sidebar, main content, footer.
- login/auth 페이지는 독립 중앙정렬 레이아웃을 사용할 수 있다.
- 모바일에서는 sidebar를 숨기고 header는 유지한다.
- 동적 메뉴 데이터는 API 또는 bootstrap route data에서 받아 Vue component로 렌더링한다.

## Vue 규칙

- sanitizer를 정하고 안전 경계를 문서화한 경우가 아니면 신뢰할 수 없는 값에 `v-html`을 사용하지 않는다.
- component 계약은 props와 typed model로 표현한다.
- 공유 상태가 실제로 필요하지 않으면 component state는 지역 상태로 둔다.
- auth/session 처리는 HTTP client와 router guard 계층에 모은다.
- 변경 요청은 앱 CSRF 토큰을 `X-CSRF-Token` 헤더로 보낸다.
- UI 권한 처리는 보안이 아니다. backend guard가 최종 권한 기준이어야 한다.

## 테마 컬러

Blueprint Console 테마 — 잉크 네이비 크롬 + 쿨 페이퍼 콘텐츠 + 쿠퍼 시그널 액센트.

| 토큰 | Hex | 용도 |
|---|---|---|
| `--color-sidebar-bg` | `#0F1B2D` | 사이드바/헤더 크롬 (잉크 네이비) |
| `--color-sidebar-text` | `#A7B4C8` | 사이드바 텍스트 |
| `--color-content-bg` | `#ECF0F6` | 메인 콘텐츠 배경 (쿨 페이퍼) |
| `--color-card` | `#ffffff` | 카드/패널 배경 |
| `--color-text` | `#11203A` | 기본 텍스트 (잉크) |
| `--color-text-muted` | `#8A98AE` | 보조 텍스트 |
| `--color-primary` | `#E07B39` | 주요 액션/시그널 액센트 (쿠퍼) |
| `--color-secondary` | `#3B6FB0` | 스틸 블루 보조 |
| `--color-border` | `#DAE1EC` | 테두리/구분선 |
| `--color-success` | `#198754` | 성공 상태 |
| `--color-danger` | `#B42318` | 오류 및 파괴적 상태 |

## 타이포그래피 & 시그니처

- 한국어 UI/본문은 `Noto Sans KR`, Latin fallback은 `Inter`, 라벨/수치/구조 타이포는 `IBM Plex Mono`를 사용한다.
- 구조적 라벨, 배지, 테이블 헤더, 숫자 메타데이터는 mono stack을 사용한다.
- 본문은 primary stack을 사용한다.
- 의도적인 작은 양수 값의 mono label을 제외하고 letter spacing은 `0`으로 유지한다.

## 강한 규칙

### 금지

- 제품 화면용 server-rendered page template.
- sanitizer 문서화 없는 `v-html` 또는 raw DOM HTML 주입.
- 테마 표에 등록되지 않은 컬러 하드코딩.
- 관리자 4영역 셸의 임의 변경.
- CSS `!important`.

### 필수

- Vue 관리자 화면은 도입 후 shared layout, table, form, modal component를 사용한다.
- 반응형 동작은 모바일 가독성을 유지하고 텍스트 겹침을 피해야 한다.
- 신규 컬러, 레이아웃 변경, 규칙 예외는 구현 전 이 파일에 등록한다.
