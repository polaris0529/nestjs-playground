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
