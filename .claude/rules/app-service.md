# Service Configuration (NestJS)

Module and service composition rules for this app. See root `CLAUDE.md` for global rules.

## Module Composition
- Entry point is `AppModule`. Global config via `ConfigModule.forRoot({ isGlobal: true })`.
- DB connection via `TypeOrmModule.forRootAsync` using `DATABASE_URL` (PostgreSQL), with `autoLoadEntities: true`.
- Each feature is an independent module (e.g. `AuthModule`) registered in `AppModule.imports`.

## Config / Secrets
- All environment values are loaded from the root `.env`. No hardcoded secrets.
- Inject runtime config via `ConfigService` (e.g. port in `main.ts`).

---

# 서비스 구성 (NestJS)

앱의 모듈/서비스 구성 규칙. 전체 공통 룰은 루트 `CLAUDE.md` 참조.

## 모듈 구성
- 진입점은 `AppModule`. 전역 설정은 `ConfigModule.forRoot({ isGlobal: true })`.
- DB 는 `TypeOrmModule.forRootAsync` 로 `DATABASE_URL`(PostgreSQL) 기반 연결, `autoLoadEntities: true`.
- 기능은 독립 모듈(예: `AuthModule`)로 만들어 `AppModule.imports` 에 등록한다.

## 설정 / 시크릿
- 환경값은 루트 `.env` 에서 로드. 시크릿 하드코딩 금지.
- 런타임 설정은 `ConfigService` 로 주입받아 사용한다(예: `main.ts` 의 포트).
