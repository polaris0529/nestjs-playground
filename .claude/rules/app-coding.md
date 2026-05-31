# App Coding Rules (NestJS)

Code-level rules for this repo (nestjs-playground). See root `CLAUDE.md` for global rules.

## Layered Architecture

Each feature module realizes the Presentation → Application → Infrastructure flow internally.
Cross-cutting concerns live in `src/shared/`, configuration in `src/config/`.

| Layer | Role | Location |
|---|---|---|
| Presentation | Controller — HTTP routing, request/response | `src/<feature>/*.controller.ts` |
| Application | Service — business flow orchestration | `src/<feature>/*.service.ts` |
| Infrastructure | Repository (wraps TypeORM), Database, External API | `src/<feature>/*.repository.ts`, `src/config/typeorm.config.ts` |
| Shared | Guard, Interceptor, Filter, Pipe, Logger (middleware) | `src/shared/{guards,interceptors,filters,pipes,middleware}/` |
| Configuration | Environment variables, Database config, Swagger config | `src/config/` |

- Dependency direction is fixed: Controller → Service → Repository. Never skip a layer (a Controller must not touch a Repository or the DB directly).
- The Service depends only on its own `*.repository.ts`, never on `Repository<Entity>` / TypeORM directly. `@InjectRepository` is allowed **only inside** the Repository class.

## Structure
- Organize by feature module: `src/<feature>/` contains `*.controller.ts`, `*.service.ts`, `*.repository.ts`, `*.module.ts`, `dto/`, `entities/`.
- Cross-cutting components go under `src/shared/`: `filters/`, `middleware/`, and — when actually needed — `guards/`, `interceptors/`, `pipes/`. Do not create empty placeholder files.
- Configuration goes under `src/config/`: `app.config.ts` (env), `typeorm.config.ts` (database), `swagger.config.ts` (Swagger).
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
- `main.ts` calls `app.useLogger()`, `app.useGlobalFilters()`, `app.useGlobalPipes()`, `setupSwagger(app)` — it does not initialize logic, only applies already-created objects.

## DTO / Entity
- Request DTOs go in `dto/`, TypeORM entities go in `entities/`.
- Always specify the table name explicitly with `@Entity('<table>')`.

## DB / Migration
- `synchronize: false` is fixed — all schema changes must go through migrations.
- Migration files live in `src/migrations/`.
- Generate: `npm run migration:generate`, Run: `npm run migration:run`.

## REST API Design

- **HTTP Method must match intent exactly.** Do not default everything to POST.

| Method | Intent | NestJS decorator |
|---|---|---|
| `GET` | Read (no side effects) | `@Get()` |
| `POST` | Create a new resource | `@Post()` |
| `PUT` | Full replace of a resource | `@Put()` |
| `PATCH` | Partial update of a resource | `@Patch()` |
| `DELETE` | Remove a resource | `@Delete()` |

- **Use resource-based URL patterns, not action-based.**

| Wrong (action) | Correct (resource) |
|---|---|
| `POST /createUser` | `POST /users` |
| `GET /getUser?id=1` | `GET /users/1` |
| `POST /updateUser` | `PATCH /users/1` |
| `POST /deleteUser` | `DELETE /users/1` |

- Route parameter (`:id`) for a single resource; query parameter (`?role=admin`) for filtering.
- Nested resource: `GET /users/1/roles` — roles belonging to user 1.

## Format / Lint
- Follow `npm run format` (Prettier) and `npm run lint` (ESLint) standards.

---

# 앱 코딩 규칙 (NestJS)

이 레포(nestjs-playground)의 코드 레벨 규칙. 전체 공통 룰은 루트 `CLAUDE.md` 참조.

## 레이어드 아키텍처

각 기능 모듈은 내부적으로 Presentation → Application → Infrastructure 흐름을 구현한다.
횡단 관심사는 `src/shared/`, 설정은 `src/config/` 에 둔다.

| 계층 | 역할 | 위치 |
|---|---|---|
| Presentation | Controller — HTTP 라우팅, 요청/응답 | `src/<기능>/*.controller.ts` |
| Application | Service — 비즈니스 흐름 조율 | `src/<기능>/*.service.ts` |
| Infrastructure | Repository(TypeORM 캡슐화), Database, External API | `src/<기능>/*.repository.ts`, `src/config/typeorm.config.ts` |
| Shared | Guard, Interceptor, Filter, Pipe, Logger(미들웨어) | `src/shared/{guards,interceptors,filters,pipes,middleware}/` |
| Configuration | 환경변수, DB 설정, Swagger 설정 | `src/config/` |

- 의존 방향 고정: Controller → Service → Repository. 계층을 건너뛰지 않는다(Controller 가 Repository/DB 에 직접 접근 금지).
- Service 는 자신의 `*.repository.ts` 에만 의존하고, `Repository<Entity>` / TypeORM 에 직접 의존하지 않는다. `@InjectRepository` 는 **Repository 클래스 내부에서만** 허용한다.

## 구조
- 기능별 모듈 단위로 구성: `src/<기능>/` 안에 `*.controller.ts`, `*.service.ts`, `*.repository.ts`, `*.module.ts`, `dto/`, `entities/`.
- 횡단 컴포넌트는 `src/shared/` 하위: `filters/`, `middleware/`, 그리고 실제로 필요할 때만 `guards/`, `interceptors/`, `pipes/`. 빈 껍데기 파일은 만들지 않는다.
- 설정은 `src/config/` 하위: `app.config.ts`(env), `typeorm.config.ts`(database), `swagger.config.ts`(Swagger).
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
- `main.ts` 는 `app.useLogger()`, `app.useGlobalFilters()`, `app.useGlobalPipes()`, `setupSwagger(app)` 등 이미 생성된 객체를 적용하는 역할만 한다. 초기화 로직을 포함하지 않는다.

## DTO / 엔티티
- 요청 DTO 는 `dto/`, TypeORM 엔티티는 `entities/` 에 위치.
- 엔티티는 `@Entity('<table>')` 로 테이블명을 명시한다.

## DB / 마이그레이션
- `synchronize: false` 고정 — 스키마 변경은 반드시 마이그레이션으로 처리.
- 마이그레이션 파일 위치: `src/migrations/`.
- 생성: `npm run migration:generate`, 실행: `npm run migration:run`.

## REST API 설계

- **HTTP Method 를 의도에 맞게 정확히 표기한다.** 모든 요청을 POST 로 처리하지 않는다.

| Method | 의도 | NestJS 데코레이터 |
|---|---|---|
| `GET` | 읽기 (부수효과 없음) | `@Get()` |
| `POST` | 신규 리소스 생성 | `@Post()` |
| `PUT` | 리소스 전체 교체 | `@Put()` |
| `PATCH` | 리소스 일부 수정 | `@Patch()` |
| `DELETE` | 리소스 삭제 | `@Delete()` |

- **URL 은 Action 이 아닌 Resource 패턴을 사용한다.**

| 잘못된 패턴 (action) | 올바른 패턴 (resource) |
|---|---|
| `POST /createUser` | `POST /users` |
| `GET /getUser?id=1` | `GET /users/1` |
| `POST /updateUser` | `PATCH /users/1` |
| `POST /deleteUser` | `DELETE /users/1` |

- 단일 리소스 식별: route parameter (`:id`), 목록 필터링: query parameter (`?role=admin`).
- 중첩 리소스: `GET /users/1/roles` — user 1의 role 목록.

## 포맷 / 린트
- `npm run format`(Prettier), `npm run lint`(ESLint) 기준을 따른다.
