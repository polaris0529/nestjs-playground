# VIEWS KNOWLEDGE BASE

## OVERVIEW
Handlebars SSR templates for the admin portal. Templates compose server-rendered pages; client behavior lives in `public/js/`.

## STRUCTURE

```text
views/
├── admin/          # authenticated admin pages
├── partials/       # head, header, sidebar, menu_item, footer, scripts
├── index.hbs       # authenticated/home page
└── login.hbs       # standalone auth page
```

## WHERE TO LOOK

| Task | Location | Notes |
|---|---|---|
| Page shell | `views/partials/head.hbs`, `header.hbs`, `sidebar.hbs`, `footer.hbs`, `scripts.hbs` | Normal pages include all layout partials. |
| Sidebar tree | `views/partials/sidebar.hbs`, `views/partials/menu_item.hbs` | Data comes from `MenuNavMiddleware` via `res.locals.menuTree`. |
| Admin CRUD pages | `views/admin/*.hbs` | Pair with JS in `public/js/admin/<feature>/`. |
| Login page | `views/login.hbs` | Only page exempt from sidebar/footer layout. |

## CONVENTIONS

- Use hbs partial names with underscores, matching registered names such as `menu_item`.
- Normal pages preserve header/sidebar/main/footer. `login.hbs` stays standalone.
- Pass server data with rendered values, `data-*` attributes, hidden fields, or API calls; keep behavior out of templates.
- Mutating forms include CSRF via `res.locals.csrfToken` as `_csrf` when not handled by axios.
- Header auth state is server-rendered from `res.locals.user`.
- Admin tables use `.admin-table`; modals use the existing custom modal classes, not Bootstrap JS.

## ANTI-PATTERNS

- No inline `<script>` blocks.
- No inline event handlers such as `onclick`.
- No template-owned business logic that belongs in a controller/service or `public/js/`.
- No arbitrary layout changes to the 4-zone admin shell.
- No new hardcoded colors in templates.
