# WorkFlow Design System

## 1. Atmosphere & Identity

WorkFlow feels like a quiet operations console: stable, compact, and built for repeated administrative work. The signature is Blueprint Console, an ink navy chrome around cool paper content with copper signal accents for actions and active state.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
|---|---|---|---|---|
| Surface/chrome | `--color-sidebar-bg` | `#0F1B2D` | `#0F1B2D` | Header and sidebar |
| Surface/chrome-hover | `--color-sidebar-hover` | `#1A2A42` | `#1A2A42` | Sidebar hover |
| Surface/content | `--color-content-bg` | `#ECF0F6` | `#ECF0F6` | Main page background |
| Surface/card | `--color-card` | `#ffffff` | `#ffffff` | Cards, panels, modals |
| Text/primary | `--color-text` | `#11203A` | `#11203A` | Primary content text |
| Text/secondary | `--color-text-secondary` | `#5A6B85` | `#5A6B85` | Secondary descriptions |
| Text/muted | `--color-text-muted` | `#8A98AE` | `#8A98AE` | Metadata and disabled copy |
| Text/chrome | `--color-sidebar-text` | `#A7B4C8` | `#A7B4C8` | Header/sidebar text |
| Border/default | `--color-border` | `#DAE1EC` | `#DAE1EC` | Dividers and card borders |
| Accent/primary | `--color-primary` | `#E07B39` | `#E07B39` | Primary actions and active ticks |
| Accent/primary-hover | `--color-primary-hover` | `#C9692C` | `#C9692C` | Primary action hover |
| Accent/primary-light | `--color-primary-light` | `#FBEADB` | `#FBEADB` | Soft accent backgrounds |
| Accent/secondary | `--color-secondary` | `#3B6FB0` | `#3B6FB0` | Secondary actions and personal task signal |
| Status/success | `--color-success` | `#198754` | `#198754` | Success and completed state |
| Status/warning | `--color-warning` | `#ffc107` | `#ffc107` | Caution state |
| Status/danger | `--color-danger` | `#dc3545` | `#dc3545` | Destructive and cancelled state |

### Rules

- Use the existing CSS custom properties in `public/css/layout.css`.
- Do not introduce raw colors in templates or feature CSS.
- Copper is reserved for primary actions, holidays, and active navigation.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|---|---:|---:|---:|---:|---|
| H1 | `--font-size-2xl` | `--font-weight-bold` | `--line-height-tight` | `0` | Page title |
| H2 | `--font-size-xl` | `--font-weight-semibold` | `--line-height-tight` | `0` | Modal title and panel title |
| H3 | `--font-size-lg` | `--font-weight-semibold` | `--line-height-normal` | `0` | Card title |
| Body | `--font-size-base` | `--font-weight-regular` | `--line-height-normal` | `0` | Default text |
| Body/sm | `--font-size-sm` | `--font-weight-regular` | `--line-height-normal` | `0` | Forms, table cells, descriptions |
| Caption | `--font-size-xs` | `--font-weight-semibold` | `--line-height-normal` | `0.04em` | Labels, badges, table headers |

### Font Stack

- Primary: `--font-family-base`, Noto Sans KR and Inter with system fallbacks.
- Mono: `--font-family-mono`, IBM Plex Mono with Noto Sans KR and monospace fallbacks.

### Rules

- Structural labels, badges, table headers, and numeric metadata use the mono stack.
- Body text uses the primary stack.
- Body copy must not be smaller than `--font-size-sm`.

## 4. Spacing & Layout

### Base Unit

All spacing derives from a base of 4px through the existing spacing tokens.

| Token | Value | Usage |
|---|---:|---|
| `--space-xs` | `0.25rem` | Tight inline spacing |
| `--space-sm` | `0.5rem` | Compact groups |
| `--space-md` | `1rem` | Default controls and card internals |
| `--space-lg` | `1.5rem` | Panel and modal padding |
| `--space-xl` | `2rem` | Page content rhythm |
| `--space-2xl` | `3rem` | Large section spacing |

### Grid

- Header height: `--header-height`.
- Sidebar width: `--sidebar-width`.
- Normal pages keep the header/sidebar/main/footer shell.
- Mobile hides the sidebar and keeps content in one column.

### Rules

- Prefer CSS Grid for page-level content areas.
- Calendar panels use stable dimensions so FullCalendar controls and modals do not shift layout.

## 5. Components

### Page Header

- Structure: title group on the left, actions on the right.
- Spacing: bottom border and `--space-xl` separation.
- Typography: title uses H1 with a mono `//` marker.

### Card

- Structure: `.card > .card-body`.
- Spacing: Bootstrap card structure with app border token.
- Depth: border plus existing shadow utilities only when needed.

### Modal

- Structure: `.modal-overlay > .modal-box > .modal-head + .modal-body`.
- States: hidden with `.d-none`, opened by page scripts.
- Accessibility: controls use real buttons and labelled fields.

### Badge

- Structure: inline status marker with mono label.
- Variants: active, muted, success, warning, danger.
- Usage: task type, task status, and holiday metadata.

## 6. Motion & Interaction

### Timing

| Type | Duration | Easing | Usage |
|---|---:|---|---|
| Micro | `--transition-fast` | existing cubic bezier | Hover and active controls |
| Standard | `--transition-base` | existing cubic bezier | Modal, table, and panel state |
| Slow | `--transition-slow` | existing cubic bezier | Layout transitions |

### Rules

- Animate `opacity` and `transform` only.
- Every interactive control needs hover, focus, and active states.
- JavaScript interactions live in `public/js/`, never inline templates.

## 7. Depth & Surface

### Strategy

Mixed, but restrained: chrome surfaces use tonal depth, content surfaces use border-first cards, and modals use shadow for elevation.

| Level | Token | Usage |
|---|---|---|
| Border | `--color-border` | Cards, tables, calendar grid |
| Shadow/small | `--shadow-sm` | Subtle raised controls |
| Shadow/medium | `--shadow-md` | Important cards |
| Shadow/large | `--shadow-xl` | Modals |

### Rules

- Cards do not nest inside other cards.
- Page sections are unframed unless a functional panel is needed.
- FullCalendar is styled as the main work surface, not as a decorative preview.
