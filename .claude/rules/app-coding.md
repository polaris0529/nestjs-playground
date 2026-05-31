# App Coding Rules (NestJS)

Code-level rules for this repo (nestjs-playground). See root `CLAUDE.md` for global rules.

## Structure
- Organize by feature module: `src/<feature>/` contains `*.controller.ts`, `*.service.ts`, `*.module.ts`, `dto/`, `entities/`.
- Every feature module must be registered in `AppModule`.

## Module Initialization Pattern

Each module is responsible for its own initialization (env loading, config, middleware setup).
`AppModule` only registers the resulting module — it does not contain initialization logic.

```
[Each Module]
  └─ reads its own env / config internally
  └─ creates and exports its configured object

[AppModule]
  └─ imports: [ModuleA, ModuleB, ...]   ← registration only
  └─ configure(consumer): apply(Middleware).forRoutes('*')  ← wiring only
```

- Do NOT put module-specific config logic inside `AppModule`.
- Middleware, guards, filters: implement inside their own module/file, register in `AppModule.configure()` or `main.ts` only.
- `main.ts` calls `app.useLogger()`, `app.useGlobalFilters()`, `app.useGlobalPipes()` — it does not initialize logic, only applies already-created objects.

## DTO / Entity
- Request DTOs go in `dto/`, TypeORM entities go in `entities/`.
- Always specify the table name explicitly with `@Entity('<table>')`.

## DB / Migration
- `synchronize: false` is fixed — all schema changes must go through migrations.
- Migration files live in `src/migrations/`.
- Generate: `npm run migration:generate`, Run: `npm run migration:run`.

## Format / Lint
- Follow `npm run format` (Prettier) and `npm run lint` (ESLint) standards.

---

# 앱 코딩 규칙 (NestJS)

이 레포(nestjs-playground)의 코드 레벨 규칙. 전체 공통 룰은 루트 `CLAUDE.md` 참조.

## 구조
- 기능별 모듈 단위로 구성: `src/<기능>/` 안에 `*.controller.ts`, `*.service.ts`, `*.module.ts`, `dto/`, `entities/`.
- 모든 기능 모듈은 `AppModule` 에 등록한다.

## 모듈 초기화 패턴

각 모듈은 자신의 초기화(env 로드, 설정, 미들웨어 구성)를 스스로 처리한다.
`AppModule` 은 완성된 모듈을 등록하는 역할만 하며, 초기화 로직을 포함하지 않는다.

```
[각 모듈]
  └─ 자신의 env / config 를 내부에서 읽고 초기화
  └─ 완성된 객체를 생성하고 export

[AppModule]
  └─ imports: [ModuleA, ModuleB, ...]   ← 등록만
  └─ configure(consumer): apply(Middleware).forRoutes('*')  ← 연결만
```

- 모듈별 설정 로직을 `AppModule` 안에 작성하지 않는다.
- 미들웨어, 가드, 필터: 각자의 파일에서 구현하고, `AppModule.configure()` 또는 `main.ts` 에서 등록만 한다.
- `main.ts` 는 `app.useLogger()`, `app.useGlobalFilters()`, `app.useGlobalPipes()` 등 이미 생성된 객체를 적용하는 역할만 한다. 초기화 로직을 포함하지 않는다.

## DTO / 엔티티
- 요청 DTO 는 `dto/`, TypeORM 엔티티는 `entities/` 에 위치.
- 엔티티는 `@Entity('<table>')` 로 테이블명을 명시한다.

## DB / 마이그레이션
- `synchronize: false` 고정 — 스키마 변경은 반드시 마이그레이션으로 처리.
- 마이그레이션 파일 위치: `src/migrations/`.
- 생성: `npm run migration:generate`, 실행: `npm run migration:run`.

## 포맷 / 린트
- `npm run format`(Prettier), `npm run lint`(ESLint) 기준을 따른다.
