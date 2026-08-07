# Service Configuration (NestJS)

Module and service composition rules for this app. See root `CLAUDE.md` for global rules.

## Module Composition

- Entry point is `AppModule`. Global config via `ConfigModule.forRoot({ isGlobal: true })`.
- DB connection via `TypeOrmModule.forRootAsync` using `DATABASE_URL` (PostgreSQL), with `autoLoadEntities: true`.
- Each feature is an independent module (e.g. `AuthModule`) registered in `AppModule.imports`.
- A feature module registers all three layers as providers: `*.service.ts` (Application) and `*.repository.ts` (Infrastructure), with `*.controller.ts` (Presentation) as a controller. Register the entity via `TypeOrmModule.forFeature([Entity])`.

## Shared Components

- Cross-cutting concerns live in `src/shared/` (Guard / Interceptor / Filter / Pipe / Logger middleware), implemented in their own files and wired in `AppModule.configure()` or `main.ts` only.

## Config / Secrets

- All environment values are loaded from the root `.env`. No hardcoded secrets.
- Inject runtime config via `ConfigService` (e.g. port in `main.ts`).

## API Documentation (Swagger)

- Swagger config lives in `src/config/swagger.config.ts`, exposing `setupSwagger(app)`.
- `main.ts` calls `setupSwagger(app)` to mount OpenAPI docs at `/api-docs`. The config file builds the document; `main.ts` only applies it.

## Authentication & Authorization

- `AuthModule` authenticates against `account` (no separate auth table). Login issues **access + refresh** JWTs stored in **httpOnly cookies**; `JwtStrategy` accepts the access cookie or a Bearer header.
- **Token refresh**: access is short-lived (`JWT_ACCESS_EXPIRES_IN`), refresh is long-lived (`JWT_REFRESH_EXPIRES_IN`, separate `JWT_REFRESH_SECRET`). `POST /api/auth/refresh` rotates both. The Vue client must centralize HTTP calls and refresh on 401.
- **CSRF**: `CsrfMiddleware` (double-submit) issues a non-httpOnly `csrf_token` cookie and requires it back via `X-CSRF-Token` header on Vue mutating requests. `/api/auth/login` is exempt.
- **Errors**: global `HttpErrorFilter` returns a unified JSON envelope `{ statusCode, error, message, path, timestamp }`.
- Passwords are hashed with **bcrypt** in `AccountService` (never stored in plaintext).
- Roles are `ROLE_TYPE` common codes (`ADMIN` / `USER`) linked via `account_role`. The JWT payload carries `roles`.
- API routes: `JwtAuthGuard` + `RolesGuard` (`@Roles('ADMIN')`) — return 401/403. Vue route guards are UX only and must not replace backend authorization.

---

# 서비스 구성 (NestJS)

앱의 모듈/서비스 구성 규칙. 전체 공통 룰은 루트 `CLAUDE.md` 참조.

## 모듈 구성

- 진입점은 `AppModule`. 전역 설정은 `ConfigModule.forRoot({ isGlobal: true })`.
- DB 는 `TypeOrmModule.forRootAsync` 로 `DATABASE_URL`(PostgreSQL) 기반 연결, `autoLoadEntities: true`.
- 기능은 독립 모듈(예: `AuthModule`)로 만들어 `AppModule.imports` 에 등록한다.
- 기능 모듈은 3계층을 providers 로 등록한다: `*.service.ts`(Application), `*.repository.ts`(Infrastructure), 그리고 `*.controller.ts`(Presentation)는 controllers. 엔티티는 `TypeOrmModule.forFeature([Entity])` 로 등록한다.

## Shared 컴포넌트

- 횡단 관심사는 `src/shared/`(Guard / Interceptor / Filter / Pipe / Logger 미들웨어)에 두고, 각자의 파일에서 구현한 뒤 `AppModule.configure()` 또는 `main.ts` 에서 등록만 한다.

## 설정 / 시크릿

- 환경값은 루트 `.env` 에서 로드. 시크릿 하드코딩 금지.
- 런타임 설정은 `ConfigService` 로 주입받아 사용한다(예: `main.ts` 의 포트).

## API 문서 (Swagger)

- Swagger 설정은 `src/config/swagger.config.ts` 에 두고 `setupSwagger(app)` 를 export 한다.
- `main.ts` 에서 `setupSwagger(app)` 를 호출해 `/api-docs` 에 OpenAPI 문서를 마운트한다. 문서 구성은 설정 파일이 담당하고, `main.ts` 는 적용만 한다.

## 인증 / 인가

- `AuthModule` 은 별도 auth 테이블 없이 `account` 로 인증한다. 로그인 시 **access + refresh** JWT 를 **httpOnly 쿠키**로 저장하며, `JwtStrategy` 는 access 쿠키 또는 Bearer 헤더를 허용한다.
- **토큰 갱신**: access 는 단기(`JWT_ACCESS_EXPIRES_IN`), refresh 는 장기(`JWT_REFRESH_EXPIRES_IN`, 별도 `JWT_REFRESH_SECRET`). `POST /api/auth/refresh` 가 둘 다 회전. Vue client 는 HTTP 호출을 공통화하고 401 시 refresh 한다.
- **CSRF**: `CsrfMiddleware`(double-submit)가 비 httpOnly `csrf_token` 쿠키를 발급하고, Vue 변경 요청 시 `X-CSRF-Token` 헤더로 되돌려 검증한다. `/api/auth/login` 은 예외.
- **에러**: 전역 `HttpErrorFilter` 가 통일 JSON 응답 `{ statusCode, error, message, path, timestamp }` 을 반환한다.
- 비밀번호는 `AccountService` 에서 **bcrypt** 해싱한다(평문 저장 금지).
- 역할은 `ROLE_TYPE` 공통코드(`ADMIN` / `USER`)이며 `account_role` 로 연결한다. JWT 페이로드에 `roles` 포함.
- API: `JwtAuthGuard` + `RolesGuard`(`@Roles('ADMIN')`) — 401/403 반환. Vue route guard 는 UX 보조일 뿐 backend authorization 을 대체하지 않는다.
