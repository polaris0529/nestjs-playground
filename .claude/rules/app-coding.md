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

## i18n (Internationalization) — Recommended

Use `nestjs-i18n` when multilingual support is needed. The core principle: **layers below Presentation deal in translation keys, not localized strings.** Translation happens at the edge.

- **Setup**: register `I18nModule.forRoot({ fallbackLanguage: 'ko', resolvers: [new HeaderResolver(['accept-language'])] })` globally. Translation files live under `src/i18n/<lang>/*.json`.
- **Errors → keys, translate in a filter**: Service throws a translation **key**, not a message — e.g. `throw new ConflictException('auth.errors.email_exists')`. A global i18n exception filter reads the request `Accept-Language` and translates the key for the response. (Integrate with the existing `HttpErrorFilter`.) Services stay language-agnostic.
- **Success messages**: use `I18nService.t(key, { lang })` with `I18nContext.current()?.lang ?? 'ko'` to translate response messages.
- **DTO validation**: put i18n keys in the decorator `message` — e.g. `@IsEmail({}, { message: 'validation.email_invalid' })`. The framework translates them.
- **No HTTP context (scheduler / push)**: there is no `Accept-Language`. Look up the recipient's language from DB (e.g. an `account.language` column set at login) and pass it explicitly: `this.i18n.t(key, { lang })`.
- Key namespacing: `<domain>.<category>.<name>` (e.g. `auth.errors.email_exists`, `validation.code_length`).

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

## i18n (다국어) — 권장

다국어가 필요하면 `nestjs-i18n` 을 사용한다. 핵심 원칙: **Presentation 아래 계층은 지역화된 문자열이 아니라 번역 키만 다룬다.** 번역은 가장 바깥(요청 경계)에서 수행한다.

- **설정**: `I18nModule.forRoot({ fallbackLanguage: 'ko', resolvers: [new HeaderResolver(['accept-language'])] })` 를 전역 등록한다. 번역 파일은 `src/i18n/<lang>/*.json` 에 둔다.
- **에러 → 키, 필터에서 번역**: Service 는 메시지가 아니라 번역 **키**를 던진다 — 예: `throw new ConflictException('auth.errors.email_exists')`. 전역 i18n 예외 필터가 요청의 `Accept-Language` 를 읽어 키를 번역해 응답한다(기존 `HttpErrorFilter` 와 통합). Service 는 언어를 신경 쓰지 않는다.
- **성공 메시지**: `I18nContext.current()?.lang ?? 'ko'` 로 언어를 얻어 `I18nService.t(key, { lang })` 로 번역한다.
- **DTO 검증**: 데코레이터 `message` 에 i18n 키를 넣는다 — 예: `@IsEmail({}, { message: 'validation.email_invalid' })`. 프레임워크가 번역한다.
- **HTTP 컨텍스트 없음(스케줄러/푸시)**: `Accept-Language` 가 없으므로 수신자 언어를 DB(예: 로그인 시 설정한 `account.language` 컬럼)에서 조회해 명시적으로 넘긴다: `this.i18n.t(key, { lang })`.
- 키 네임스페이스: `<도메인>.<분류>.<이름>` (예: `auth.errors.email_exists`, `validation.code_length`).
