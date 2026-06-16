# PUBLIC KNOWLEDGE BASE

## OVERVIEW
Static assets served from root paths by Nest. Client JavaScript here drives SSR pages without inline template scripts.

## STRUCTURE

```text
public/
├── css/            # Bootstrap and app layout/theme CSS
└── js/
    ├── common/     # vendored libs, http interceptor, layout, menu tree
    ├── admin/      # CRUD utilities and feature page scripts
    ├── auth/       # login behavior
    └── portainer/  # portainer-specific UI helpers
```

## WHERE TO LOOK

| Task | Location | Notes |
|---|---|---|
| API calls | `public/js/common/http.js` | Axios wrapper/interceptor, including 401 refresh behavior. |
| Admin tables/modals | `public/js/admin/crud-util.js`, `form-util.js` | Shared DataTables rendering and themed modal helpers. |
| Feature page behavior | `public/js/admin/<feature>/` | Keep scripts paired with `views/admin/*.hbs`. |
| Sidebar folder toggles | `public/js/common/menu-tree.js` | Toggles `.open` on `[data-menu-toggle]`. |
| Theme/layout CSS | `public/css/layout.css` | Use existing CSS custom properties. |

## CONVENTIONS

- Use event delegation for row actions and dynamic content.
- Mutating requests send CSRF as `X-CSRF-Token` or form `_csrf`.
- Keep page scripts small and feature-specific; put reusable CRUD/form behavior in shared admin utilities.
- DataTables admin lists paginate 10 rows by default through `renderAdminTable`.
- Use existing theme tokens from `layout.css` and `.claude/rules/ui-design.md`.

## ANTI-PATTERNS

- Do not add behavior back into hbs templates.
- Do not depend on Bootstrap JS for admin modals; this app uses custom modal helpers.
- Do not add `!important`.
- Do not introduce new hardcoded color values without updating `.claude/rules/ui-design.md` first.
- Do not edit vendored files in `public/js/common/` unless replacing the vendor asset intentionally.
