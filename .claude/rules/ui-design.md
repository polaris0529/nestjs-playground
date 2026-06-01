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
│   ├── menu_item.hbs  # recursive menu node (tree) used by sidebar
│   ├── footer.hbs     # bottom footer
│   └── scripts.hbs    # <script src> at body bottom
└── {page}.hbs         # individual pages (must include header/sidebar/footer partials)
```

### Dynamic Menu (DB-driven sidebar)

- The sidebar renders the `menu` table as a tree (by `parent_menu_id`, ordered by `sort_order`).
- `MenuNavMiddleware` injects `res.locals.menuTree` on SSR page routes; controllers pass nothing.
- `menu_item.hbs` is a recursive partial: a node with `menuUrl` renders as `<a>` (target `_blank` when `openType === 'BLANK'`); a node without `menuUrl` renders as a `.nav-folder` label. Children render inside `.nav-subgroup`.
- Sidebar tree classes: `.nav-subgroup` (child indentation), `.nav-folder` (clickable folder toggle), `.nav-caret` (expand/collapse indicator).
- **Folders are collapsed by default.** `.nav-subgroup` is hidden until its folder has `.open`; `public/js/common/menu-tree.js` toggles `.open` on `[data-menu-toggle]` click. Caret rotates 90° when open.
- **Partial naming**: `hbs` registers partials with hyphens converted to underscores (`menu-item.hbs` → `menu_item`). Use underscores in partial filenames and `{{> name}}` references to avoid mismatch.

## Theme Colors

Dark sidebar + Light content theme.

| Token | Hex | Usage |
|---|---|---|
| `--color-sidebar-bg` | `#212529` | Sidebar background |
| `--color-sidebar-text` | `#adb5bd` | Sidebar text |
| `--color-content-bg` | `#eef1f5` | Main content background (deeper so white cards pop) |
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
  - **Exception — auth pages**: `login.hbs` uses a standalone minimal centered layout (no sidebar/footer) since navigation should not be shown before authentication.
- Responsive: sidebar hidden on mobile (`d-none d-md-block`), header remains visible.
- **Auth UI**: auth uses an httpOnly cookie JWT. The header is server-rendered from `res.locals.user` (set by `AuthContextMiddleware`): logged in → username + `로그아웃` (a `POST /auth/logout` form), logged out → `로그인` link. Admin pages (`/admin/*`) require an ADMIN session via `AdminPageGuard`: not logged in → `/login`, logged-in non-admin → `/` (home).
- **Admin CRUD**: management pages list records in a `.admin-table` (DataTables) with per-row 수정/삭제 (event-delegated, no inline `onclick`). Editing uses a custom themed modal (`.modal-overlay`/`.modal-box`, toggled by `public/js/admin/crud-util.js` — no Bootstrap JS). Shared helpers in `crud-util.js`/`form-util.js`. `.badge-use` shows use/disuse state. All styled with theme tokens.
- **Card / surface contrast**: content bg is deepened (`--color-content-bg`) and `.app-content .card` carries a `--color-border` border so white cards stand out. Dashboard `.stat-card` uses the dark sidebar gradient tone (light text). Admin tables paginate 10/page (`renderAdminTable` in `crud-util.js`); DataTables controls (search/info/paginate) are theme-styled.
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
│   ├── menu_item.hbs  # 사이드바가 쓰는 재귀 메뉴 노드(트리)
│   ├── footer.hbs     # 하단 푸터
│   └── scripts.hbs    # 바디 하단 <script src>
└── {page}.hbs         # 개별 페이지 (header/sidebar/footer partial 반드시 포함)
```

### 동적 메뉴 (DB 기반 사이드바)

- 사이드바는 `menu` 테이블을 트리로 렌더링한다(`parent_menu_id` 기준, `sort_order` 정렬).
- `MenuNavMiddleware` 가 SSR 페이지 경로에서 `res.locals.menuTree` 를 주입하므로 컨트롤러는 별도로 넘기지 않는다.
- `menu_item.hbs` 는 재귀 partial: `menuUrl` 이 있으면 `<a>`(`openType === 'BLANK'` 이면 target `_blank`), 없으면 `.nav-folder` 라벨로 렌더링한다. 하위 메뉴는 `.nav-subgroup` 안에 들어간다.
- 사이드바 트리 클래스: `.nav-subgroup`(하위 들여쓰기), `.nav-folder`(클릭 가능한 폴더 토글), `.nav-caret`(펼침/접힘 표시).
- **폴더는 기본 접힘 상태.** `.nav-subgroup` 은 폴더에 `.open` 이 붙기 전까지 숨겨지며, `public/js/common/menu-tree.js` 가 `[data-menu-toggle]` 클릭 시 `.open` 을 토글한다. 펼침 시 캐럿이 90도 회전한다.
- **Partial 이름 규칙**: `hbs` 는 partial 등록 시 하이픈을 언더스코어로 변환한다(`menu-item.hbs` → `menu_item`). partial 파일명과 `{{> name}}` 참조는 언더스코어를 사용한다.

## 테마 컬러

다크 사이드바 + 라이트 콘텐츠 테마.

| 토큰 | Hex | 용도 |
|---|---|---|
| `--color-sidebar-bg` | `#212529` | 사이드바 배경 |
| `--color-sidebar-text` | `#adb5bd` | 사이드바 텍스트 |
| `--color-content-bg` | `#eef1f5` | 메인 콘텐츠 배경 (흰 카드 대비 위해 진하게) |
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
  - **예외 — 인증 페이지**: `login.hbs` 는 인증 전 네비게이션을 노출하지 않도록 사이드바/푸터 없는 독립 중앙정렬 레이아웃을 사용한다.
- 반응형 대응: 모바일에서 사이드바 숨김(`d-none d-md-block`), 헤더 유지.
- **인증 UI**: 인증은 httpOnly 쿠키 JWT 를 사용한다. 헤더는 `res.locals.user`(`AuthContextMiddleware` 가 설정) 기준 서버 렌더링: 로그인 시 사용자명 + `로그아웃`(`POST /auth/logout` 폼), 비로그인 시 `로그인` 링크. 관리자 페이지(`/admin/*`)는 `AdminPageGuard` 로 ADMIN 세션을 요구하며 아니면 `/login` 으로 리다이렉트.
- **관리(CRUD) UI**: 관리 페이지는 `.admin-table`(DataTables)에 레코드를 나열하고 행별 수정/삭제(이벤트 위임, 인라인 `onclick` 금지)를 제공한다. 수정은 테마 커스텀 모달(`.modal-overlay`/`.modal-box`, `public/js/admin/crud-util.js` 로 토글 — Bootstrap JS 미사용). 공통 헬퍼는 `crud-util.js`/`form-util.js`. `.badge-use` 는 사용/미사용 상태 표시. 모두 테마 토큰으로 스타일링.
- **카드/표면 대비**: 콘텐츠 배경을 진하게(`--color-content-bg`) 하고 `.app-content .card` 에 `--color-border` 테두리를 줘 흰 카드가 도드라지게 한다. 대시보드 `.stat-card` 는 다크 사이드바 그라디언트 톤(밝은 글자)을 사용. 관리 테이블은 10건/페이지 페이징(`crud-util.js` 의 `renderAdminTable`)하며 DataTables 컨트롤(검색/정보/페이지)은 테마 스타일을 적용한다.
- 신규 컬러, 레이아웃 변경, 규제 예외는 이 파일(`ui-design.md`)을 먼저 수정 후 구현.
