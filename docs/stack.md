# 기술 스택 (Stack)

이 문서는 프로젝트에서 사용하는 주요 기술과 전환 상태를 기록한다.

## Runtime / Language

- Node.js 20
- TypeScript
- NestJS 11

## Backend

- NestJS module architecture
- Passport JWT authentication
- HTTP-only cookie based access/refresh token handling
- Double-submit CSRF protection
- `nestjs-i18n` based response localization
- Swagger/OpenAPI documentation
- Prometheus metrics via `@willsoto/nestjs-prometheus`

## Configuration

- Runtime configuration is loaded through NestJS `ConfigModule` and `ConfigService`.
- Required numeric environment values must be parsed as `number` in `src/config/app.config.ts`.
- Required numeric config reads must use `ConfigService#getOrThrow<number>()`; do not add default fallbacks where a missing value should fail startup.
- Missing or non-numeric required number env values must throw before the app accepts requests.

## Frontend

- Vue 3
- Vue Router
- Pinia
- Vite
- Vue single-file components under `frontend/`

## Frontend Migration Note

The frontend has been changed from server-rendered Handlebars (`views/`) and
static assets (`public/`) to a Vue 3 application under `frontend/`.

- Product screens should be implemented in Vue, not new hbs templates.
- API calls should use `/api/<domain>/<request>` paths.
- Vite keeps a single proxy entry for `/api`.
- Legacy `views/` and `public/` assets are removed as part of the Vue migration.

## Database

- PostgreSQL 16
- TypeORM
- Migration files under `src/database/migrations/`
- `synchronize: false`

## Deployment

- Docker
- Docker Compose V2
- Nginx Proxy Manager fronting the app container
- Runtime deploy packet generated under `.build/deploy/`
