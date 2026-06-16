# SCRIPTS KNOWLEDGE BASE

## OVERVIEW
Deployment helper scripts. Current script surface is focused on creating the runtime `deploy/` package.

## WHERE TO LOOK

| Task | Location | Notes |
|---|---|---|
| Build deploy packet | `scripts/pack-deploy.js` | Removes and recreates root `deploy/` from build/runtime assets. |
| Docker build flow | `Dockerfile` | Builder runs `npm run build` and `npm run deploy:prepare`; runner copies `deploy/`. |
| NPM commands | `package.json` | `deploy:prepare` and `deploy` invoke this directory. |

## CONVENTIONS

- Scripts run from repository root and should use explicit root-relative paths.
- `pack-deploy.js` copies `dist`, `package.json`, `package-lock.json`, `views`, and `public` into `deploy/`.
- Treat `deploy/` as generated output; do not hand-edit it as source.
- Keep scripts deterministic and idempotent so Docker builds can rerun from a clean or dirty workspace.
- Prefer Node standard library for simple filesystem packaging tasks already handled here.

## ANTI-PATTERNS

- Do not copy `.env`, secrets, `node_modules/`, or source-only tooling into `deploy/`.
- Do not make deployment scripts depend on local machine absolute paths.
- Do not add public hostnames/IPs to generated artifacts or README updates.
- Do not silently change Docker runtime expectations without updating `Dockerfile` and README together.
