# UI Design / Template Rules (NestJS + hbs)

See root `CLAUDE.md` for global rules.

## Template Engine
- SSR template engine is **Handlebars (hbs)**.
- Views go in `views/`, shared partials (head, scripts, etc.) in `views/partials/`, included via `{{> partial}}`.

## No Inline JS
- Never write JS scripts directly inside templates. Inline `<script>...</script>` blocks are forbidden.
- All client JS must be in external files under `public/js/`. Templates load them via `<script src="...">` only.
- To pass data from server to client, use `data-*` attributes or a separate JSON API call (axios). No logic in templates.

## Static Assets
- CSS/JS/images go under `public/` and are served at root paths (`/css`, `/js`) via `useStaticAssets`.

## Layout Structure

```
+---------------- header (fixed top) -----------------+
|  logo                        user info / nav icons  |
+--left-sidebar--+------------- main ----------------+
|                |                                    |
|   navigation   |   page content (scrollable)        |
|   menu items   |                                    |
|                +------------------------------------+
|                |      footer (sticky bottom)        |
+----------------+------------------------------------+
```

- **Header** — Fixed top (`position: fixed` or `sticky`). Contains logo, global nav icons, user info.
- **Left Sidebar** — Fixed left, fixed width (`240px`). Main navigation menu items.
- **Main** — Remaining area to the right of sidebar. Scrollable. Renders actual page content.
- **Footer** — Sticky bottom of main area. Minimal info only (copyright, version, etc.).

### Partial Structure

```
views/
├── partials/
│   ├── head.hbs       # <head> meta / CSS links
│   ├── header.hbs     # top header
│   ├── sidebar.hbs    # left sidebar
│   ├── footer.hbs     # bottom footer
│   └── scripts.hbs    # <script src> at body bottom
└── {page}.hbs         # individual pages (must include header/sidebar/footer partials)
```

## Theme Colors

Dark sidebar + Light content theme.

| Token | Hex | Usage |
|---|---|---|
| `--color-sidebar-bg` | `#212529` | Sidebar background |
| `--color-sidebar-text` | `#adb5bd` | Sidebar text |
| `--color-content-bg` | `#f8f9fa` | Main content background |
| `--color-card` | `#ffffff` | Card / panel background |
| `--color-text` | `#212529` | Default text |
| `--color-text-muted` | `#6c757d` | Secondary text |
| `--color-primary` | `#0d6efd` | Primary action buttons, links |
| `--color-success` | `#198754` | Success state |

## Strict Rules

### Forbidden
- Inline `<script>` blocks inside templates.
- Hardcoding colors not defined in the theme table above (e.g. `style="color: #abc123"`).
- Arbitrarily changing the 4-zone layout (header / sidebar / main / footer).
- Using `!important` in CSS.

### Required
- Every page `.hbs` file must include `header`, `sidebar`, and `footer` partials.
- Responsive: sidebar hidden on mobile (`d-none d-md-block`), header remains visible.
- Any new color, layout change, or rule exception must be registered in this file (`ui-design.md`) before implementation.

---

# UI 디자인 / 템플릿 규칙 (NestJS + hbs)

전체 공통 룰은 루트 `CLAUDE.md` 참조.

## 템플릿 엔진
- SSR 템플릿 엔진은 **Handlebars(hbs)** 를 사용한다.
- 뷰는 `views/`, 공통 조각(head, scripts 등)은 `views/partials/` 에 분리하고 `{{> partial}}` 로 포함한다.

## 인라인 JS 금지
- 템플릿 내 JS 스크립트 직접 작성 금지. 인라인 `<script>...</script>` 블록 금지.
- 모든 클라이언트 JS 는 `public/js/` 하위 외부 파일로 분리하고, 템플릿에서는 `<script src="...">` 로만 로드한다.
- 서버 → 클라이언트 데이터 전달은 `data-*` 속성이나 별도 JSON API 호출(axios)로 처리. 템플릿에 로직 금지.

## 정적 자산
- CSS/JS/이미지는 `public/` 하위에 두고 루트 경로(`/css`, `/js`)로 서빙한다(`useStaticAssets`).

## 레이아웃 구조

```
+---------------- 헤더 (상단 고정) -------------------+
|  로고                        유저 정보 / 네비 아이콘 |
+--좌측 사이드바--+------------- 메인 ---------------+
|                |                                    |
|   네비게이션   |   페이지 콘텐츠 (스크롤 가능)      |
|   메뉴 항목    |                                    |
|                +------------------------------------+
|                |      푸터 (하단 고정)              |
+----------------+------------------------------------+
```

- **헤더** — 상단 고정(`position: fixed` 또는 `sticky`). 로고, 전역 네비게이션 아이콘, 유저 정보.
- **좌측 사이드바** — 고정 좌측, 고정 너비(`240px`). 주요 네비게이션 메뉴 항목.
- **메인** — 사이드바 우측 나머지 영역. 스크롤 가능. 실제 페이지 콘텐츠 렌더링.
- **푸터** — 메인 영역 하단 고정(`sticky`). 최소 정보만 표시(저작권, 버전 등).

### Partial 구조

```
views/
├── partials/
│   ├── head.hbs       # <head> 메타/CSS
│   ├── header.hbs     # 상단 헤더
│   ├── sidebar.hbs    # 좌측 사이드바
│   ├── footer.hbs     # 하단 푸터
│   └── scripts.hbs    # 바디 하단 <script src>
└── {page}.hbs         # 개별 페이지 (header/sidebar/footer partial 반드시 포함)
```

## 테마 컬러

다크 사이드바 + 라이트 콘텐츠 테마.

| 토큰 | Hex | 용도 |
|---|---|---|
| `--color-sidebar-bg` | `#212529` | 사이드바 배경 |
| `--color-sidebar-text` | `#adb5bd` | 사이드바 텍스트 |
| `--color-content-bg` | `#f8f9fa` | 메인 콘텐츠 배경 |
| `--color-card` | `#ffffff` | 카드/패널 배경 |
| `--color-text` | `#212529` | 기본 텍스트 |
| `--color-text-muted` | `#6c757d` | 보조 텍스트 |
| `--color-primary` | `#0d6efd` | 주요 액션 버튼, 링크 |
| `--color-success` | `#198754` | 성공 상태 |

## 강한 규제 사항

### 절대 금지
- 템플릿 내 인라인 `<script>` 블록 작성.
- 위 테마 테이블에 없는 컬러 하드코딩 (예: `style="color: #abc123"`).
- 레이아웃 4개 영역(헤더/사이드바/메인/푸터) 구조 임의 변경.
- CSS `!important` 사용.

### 반드시 준수
- 모든 페이지 `.hbs` 파일에 `header`, `sidebar`, `footer` partial 반드시 포함.
- 반응형 대응: 모바일에서 사이드바 숨김(`d-none d-md-block`), 헤더 유지.
- 신규 컬러, 레이아웃 변경, 규제 예외는 이 파일(`ui-design.md`)을 먼저 수정 후 구현.
