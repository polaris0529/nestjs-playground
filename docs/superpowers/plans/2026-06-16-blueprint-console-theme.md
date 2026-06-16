# Blueprint Console Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** "WorkFlow" 전체 공통 테마를 Bootstrap 기본값에서 "Blueprint Console"(잉크 네이비 + 쿠퍼 + 모노스페이스 구조 타이포) 아이덴티티로 리테마한다.

**Architecture:** 변경은 대부분 `public/css/layout.css`의 `:root` 토큰 재조정 + 시그니처 스타일 + Bootstrap 유틸 오버라이드로 처리한다. layout.css가 bootstrap.min.css 뒤에 로드되므로 동일 specificity 오버라이드가 성립한다. 웹폰트는 `head.hbs`에 Google Fonts CDN `<link>`로 주입한다. 4영역 레이아웃·JS 동작은 불변.

**Tech Stack:** Handlebars(hbs), 순수 CSS(CSS 변수), Bootstrap CSS(오버라이드 대상), Google Fonts CDN (IBM Plex Mono, Inter).

**검증 방식:** CSS 시각 변경이므로 단위 테스트 대신 (a) `grep` 어서션으로 토큰 치환 확인, (b) `npm run build` 통과, (c) 렌더 시각 확인으로 검증한다.

---

## File Structure

- `public/css/layout.css` — 핵심. `:root` 토큰, 시그니처 스타일, Bootstrap 오버라이드.
- `views/partials/head.hbs` — Google Fonts `<link>` 주입.
- `views/partials/header.hbs` — 브랜드 워드마크 모노/쿠퍼 점 (CSS 처리 가능, 템플릿 변경 없음 목표).
- `views/partials/sidebar.hbs` — `.nav-label` 모노 아이브로우 (CSS 처리 가능, 템플릿 변경 없음 목표).
- `.claude/rules/ui-design.md` — 신규 컬러·폰트·시그니처 룰 등록(구현 전 선행).

---

### Task 1: ui-design.md 룰에 신규 테마 등록 (선행)

프로젝트 룰: "신규 컬러, 레이아웃 변경, 규제 예외는 이 파일(ui-design.md)을 먼저 수정 후 구현."

**Files:**
- Modify: `.claude/rules/ui-design.md` (테마 컬러 표 + 폰트/시그니처 규칙)

- [ ] **Step 1: 테마 컬러 표 갱신**

`## Theme Colors` 표의 값을 신규 팔레트로 교체하고 행을 추가한다(영문 표 + 한글 표 양쪽 모두):

| Token | Hex | Usage |
|---|---|---|
| `--color-sidebar-bg` | `#0F1B2D` | Sidebar/header chrome (ink navy) |
| `--color-sidebar-text` | `#A7B4C8` | Sidebar text |
| `--color-content-bg` | `#ECF0F6` | Main content background (cool paper) |
| `--color-card` | `#ffffff` | Card / panel background |
| `--color-text` | `#11203A` | Default text (ink) |
| `--color-text-muted` | `#8A98AE` | Secondary text |
| `--color-primary` | `#E07B39` | Primary action / signal accent (copper) |
| `--color-secondary` | `#3B6FB0` | Steel-blue secondary |
| `--color-success` | `#198754` | Success state |

- [ ] **Step 2: 폰트/시그니처 규칙 추가**

`## Theme Colors` 아래에 `## Typography & Signature (Blueprint Console)` 섹션을 추가한다(영/한 양쪽):

```
## Typography & Signature (Blueprint Console)

- Web fonts via Google Fonts CDN: `IBM Plex Mono` (labels/numbers/structural), `Inter` (body).
  Loaded in `views/partials/head.hbs` before `layout.css`.
- `--font-family-base: 'Inter', ...`; `--font-family-mono: 'IBM Plex Mono', ...`.
- Monospace structural type: sidebar `.nav-label`, page/section title eyebrows, `.admin-table thead`, `.stat-value`, `.badge-use` use IBM Plex Mono (uppercase, tracked). Prose stays Inter.
- Signature elements:
  - Sidebar blueprint grid: low-contrast CSS `linear-gradient` grid over ink background.
  - `// SECTION` mono eyebrow: copper mono label tick on `.page-header`, `.portfolio-section-title`, `.nav-label`.
  - Terminal-tone stat: `.stat-value` large mono; `.stat-card` top copper hairline.
  - nav active: `.nav-link.active::before` left tick in copper.
- Bootstrap color utilities (`.btn-primary`, `.bg-primary/secondary/success/info/warning/dark`, `.text-primary`) are re-themed in `layout.css` (loads after bootstrap.min.css).
```

- [ ] **Step 3: 변경 확인**

Run: `grep -c "0F1B2D\|E07B39\|IBM Plex Mono" .claude/rules/ui-design.md`
Expected: 1 이상 (신규 값이 문서에 존재)

- [ ] **Step 4: Commit**

```bash
git add .claude/rules/ui-design.md docs/superpowers/specs/2026-06-16-blueprint-console-theme-design.md docs/superpowers/plans/2026-06-16-blueprint-console-theme.md
git commit -m "docs: register blueprint-console theme tokens and spec"
```

---

### Task 2: head.hbs에 Google Fonts CDN 주입

**Files:**
- Modify: `views/partials/head.hbs`

- [ ] **Step 1: 폰트 link 추가**

`<link rel="stylesheet" href="/css/bootstrap.min.css" />` 위에 다음을 삽입한다(layout.css보다 앞):

```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
```

- [ ] **Step 2: 확인**

Run: `grep -c "IBM+Plex+Mono" views/partials/head.hbs`
Expected: 1

---

### Task 3: layout.css `:root` 토큰 재조정

**Files:**
- Modify: `public/css/layout.css:1-89` (`:root` 블록)

- [ ] **Step 1: 색상 토큰 교체**

`:root` 안에서 다음 값을 교체한다(나머지 회색 스케일/간격/그림자/라운드/transition은 유지):

```css
  --color-primary: #E07B39;
  --color-primary-hover: #C9692C;
  --color-primary-light: #FBEADB;
  --color-secondary: #3B6FB0;

  --color-sidebar-bg: #0F1B2D;
  --color-sidebar-border: #1E2D45;
  --color-sidebar-hover: #1A2A42;
  --color-sidebar-active: #E07B39;
  --color-sidebar-text: #A7B4C8;

  --color-content-bg: #ECF0F6;
  --color-text: #11203A;
  --color-text-secondary: #5A6B85;
  --color-text-muted: #8A98AE;
  --color-border: #DAE1EC;
```

> 주의: `--color-secondary`는 신규 토큰이므로 `--color-primary-light` 다음 줄에 추가한다. `--color-sidebar-active`는 기존 `#0d6efd` 값을 교체한다.

- [ ] **Step 2: 폰트 토큰 교체**

`:root`의 폰트 토큰을 교체한다:

```css
  --font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-family-mono: 'IBM Plex Mono', 'Menlo', 'Monaco', 'Courier New', monospace;
```

- [ ] **Step 3: 잔존 Bootstrap 블루 확인**

Run: `grep -n "0d6efd\|0b5ed7" public/css/layout.css`
Expected: 결과 없음 (rgba(13,110,253,...) 형태는 Step 4에서 처리)

- [ ] **Step 4: nav active 배경의 하드코딩 블루 교체**

`public/css/layout.css`의 `.app-sidebar .nav-link.active` 규칙에서:

```css
  background-color: rgba(13, 110, 253, 0.15);
```
를
```css
  background-color: rgba(224, 123, 57, 0.15);
```
로 교체한다(쿠퍼 톤 active 배경).

- [ ] **Step 5: 확인**

Run: `grep -n "13, 110, 253" public/css/layout.css`
Expected: 결과 없음

---

### Task 4: Bootstrap 유틸리티 오버라이드

포트폴리오/헤더가 Bootstrap 유틸(`bg-*`, `btn-primary`, `text-dark` 등)을 사용 중이라 팔레트 일관성을 위해 오버라이드한다.

**Files:**
- Modify: `public/css/layout.css` (UTILITY CLASSES 섹션 끝, 파일 하단에 추가)

- [ ] **Step 1: 오버라이드 블록 추가**

`public/css/layout.css` 맨 끝에 추가한다:

```css
/* ════════════════════════════════════════════════════════════════════════════
   🎨 BOOTSTRAP 컬러 유틸 오버라이드 (Blueprint Console 팔레트 일관성)
   ════════════════════════════════════════════════════════════════════════════ */

.btn-primary {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-primary:hover,
.btn-primary:focus {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.bg-primary {
  background-color: var(--color-primary) !important;
}

.bg-secondary {
  background-color: var(--color-secondary) !important;
}

.bg-dark {
  background-color: var(--color-sidebar-bg) !important;
}

.bg-info {
  background-color: var(--color-secondary) !important;
}

.text-primary {
  color: var(--color-primary) !important;
}
```

> `bg-success`/`bg-warning`는 semantic 의미를 유지하므로 Bootstrap 기본을 그대로 둔다(과한 변경 금지). `text-dark`는 잉크 텍스트와 자연히 어울려 변경 불필요.

- [ ] **Step 2: 확인**

Run: `grep -c "BOOTSTRAP 컬러 유틸 오버라이드" public/css/layout.css`
Expected: 1

---

### Task 5: 시그니처 요소 + 컴포넌트 재스타일

**Files:**
- Modify: `public/css/layout.css` (여러 기존 규칙 + Task 4 블록 위에 시그니처 블록 추가)

- [ ] **Step 1: 사이드바 블루프린트 그리드**

`.app-sidebar` 규칙의 `background:` 선언 바로 아래에 그리드 background-image를 추가한다(기존 그라디언트 위 저대비 격자):

```css
  background-image:
    linear-gradient(rgba(167, 180, 200, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(167, 180, 200, 0.05) 1px, transparent 1px);
  background-size: 24px 24px;
```

> `.app-sidebar`의 기존 `background: linear-gradient(...)` 선언은 유지하고, 그 아래에 위 두 줄을 별도 선언으로 추가한다.

- [ ] **Step 2: 모노 아이브로우 — nav-label**

`.app-sidebar .nav-label` 규칙에 모노 + tick를 적용한다. 기존 규칙의 속성에 다음을 추가/병합:

```css
  font-family: var(--font-family-mono);
  color: var(--color-primary);
  opacity: 0.9;
```

그리고 `letter-spacing`은 기존 `0.12em` 유지. (라벨 앞 `//` 표기는 다음 규칙으로 추가)

```css
.app-sidebar .nav-label::before {
  content: '// ';
  color: var(--color-primary);
}
```

- [ ] **Step 3: 페이지/포트폴리오 섹션 제목 아이브로우 tick**

`.page-header` 규칙 위에 다음을 추가한다(제목 위 쿠퍼 모노 마커):

```css
.page-header h1::before,
.portfolio-section-title::before {
  content: '// ';
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  color: var(--color-primary);
}
```

- [ ] **Step 4: 터미널 톤 stat**

`.stat-card .stat-value` 규칙에 모노 폰트를 추가한다:

```css
  font-family: var(--font-family-mono);
```

그리고 `.app-content .stat-card` 규칙에 상단 쿠퍼 hairline을 추가한다:

```css
  border-top: 2px solid var(--color-primary);
```

> 기존 `.app-content .stat-card`는 `border: none`이므로 `border-top`만 별도로 덮어쓴다(규칙 끝에 `border-top` 추가).

- [ ] **Step 5: admin-table 모노 헤더**

`.admin-table thead th` 규칙에 추가한다:

```css
  font-family: var(--font-family-mono);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: var(--font-size-xs);
```

- [ ] **Step 6: badge-use 모노**

`.badge-use` 규칙에 추가한다:

```css
  font-family: var(--font-family-mono);
  letter-spacing: 0.02em;
```

- [ ] **Step 7: 브랜드 워드마크 모노 점**

`.app-header .brand` 규칙에 `font-family: var(--font-family-mono);`를 추가하고, 브랜드 앞에 쿠퍼 점을 넣는다:

```css
.app-header .brand::before {
  content: '';
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 2px;
  background-color: var(--color-primary);
  margin-right: var(--space-sm);
  flex-shrink: 0;
}
```

> 기존 `.brand`는 `gap` flex이므로 점이 자연히 배치된다. 충돌 시 `margin-right` 대신 gap 활용.

- [ ] **Step 8: 포트폴리오 아바타 잉크+쿠퍼**

`.portfolio-avatar` 규칙의 `background:` 를 교체한다:

```css
  background: linear-gradient(135deg, var(--color-sidebar-bg) 0%, var(--color-primary) 140%);
```

- [ ] **Step 9: 빌드 검증**

Run: `npm run build`
Expected: 에러 없이 빌드 성공 (CSS는 빌드 대상이 아니지만 TS/뷰 무결성 확인)

- [ ] **Step 10: 시각 검증**

`npm run start:dev` 후 브라우저로 다음을 확인:
- `/` (비로그인 포트폴리오): 쿠퍼 role/아바타, 잉크 헤더, `// ` 섹션 마커
- `/login`: 잉크/쿠퍼 액센트 카드
- 로그인 후 `/` 대시보드: stat 카드 모노 숫자 + 쿠퍼 상단선, 사이드바 그리드/모노 라벨/쿠퍼 active 틱
- `/admin/account`: admin-table 모노 대문자 헤더, badge-use

Expected: 모든 페이지에서 Bootstrap 블루 잔존 없음, 레이아웃/반응형 정상.

- [ ] **Step 11: Commit**

```bash
git add public/css/layout.css views/partials/head.hbs
git commit -m "feat: apply blueprint-console theme (ink + copper, mono structural type)"
```

---

## Self-Review (작성자 점검 결과)

- **Spec coverage:** 토큰(Task 3) / 타이포(Task 2,3,5) / 시그니처 4종(Task 5 Step 1~4,7) / 컴포넌트(Task 5) / Bootstrap 오버라이드(Task 4) / ui-design.md 등록(Task 1) — 스펙 전 항목이 태스크로 매핑됨.
- **Placeholder scan:** TBD/모호 지시 없음. 모든 CSS 코드 블록은 실제 값 포함.
- **Type consistency:** 토큰명(`--color-primary`, `--color-secondary`, `--font-family-mono`)이 Task 3 정의 후 Task 4·5에서 일관 사용됨.
- **비범위 확인:** 레이아웃/JS/신규 애니메이션 변경 없음 — 스펙 §8과 일치.
