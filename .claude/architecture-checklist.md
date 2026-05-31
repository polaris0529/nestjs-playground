# Architecture Checklist

Progress tracker for this project's design and implementation completeness.
Each item includes: spec, implementation status, and library/approach used.

---

## 1. Input Validation

| # | Item | Spec | Status | Library |
|---|---|---|---|---|
| 1-1 | Global ValidationPipe | Register `ValidationPipe` globally in `main.ts` with `whitelist: true`, `forbidNonWhitelisted: true` | ⬜ Not done | `class-validator`, `class-transformer` |
| 1-2 | DTO decorators | Add `@IsString()`, `@IsNotEmpty()`, `@MinLength()` etc. to all request DTOs | ⬜ Not done | `class-validator` |
| 1-3 | DTO type-safety | Ensure all DTOs have explicit types (no implicit `any`) | ⬜ Not done | TypeScript strict mode |

---

## 2. Exception Handling

| # | Item | Spec | Status | Library |
|---|---|---|---|---|
| 2-1 | Global exception filter | Implement and register `HttpErrorFilter` in `main.ts`. Catch all exceptions, return unified error response shape | ⬜ Not done | `@nestjs/common` |
| 2-2 | Error response shape | Standardize: `{ statusCode, message, timestamp, path }` | ⬜ Not done | Custom |
| 2-3 | Not found handler | Handle 404 for undefined routes | ⬜ Not done | `@nestjs/common` |

---

## 3. Authentication & Authorization

| # | Item | Spec | Status | Library |
|---|---|---|---|---|
| 3-1 | Password hashing | Hash password on create/update using bcrypt. Never store plain text | ⬜ Not done | `bcrypt`, `@types/bcrypt` |
| 3-2 | JWT auth | Issue JWT on login, verify on protected routes | ⬜ Not done | `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt` |
| 3-3 | Auth guard | `JwtAuthGuard` to protect routes. Apply globally or per-controller | ⬜ Not done | `@nestjs/passport` |
| 3-4 | Public route decorator | `@Public()` decorator to opt-out of global auth guard | ⬜ Not done | Custom decorator |
| 3-5 | Role-based access | `@Roles()` decorator + `RolesGuard` for admin/user separation | ⬜ Not done | Custom |

---

## 4. Logging

| # | Item | Spec | Status | Library |
|---|---|---|---|---|
| 4-1 | Request logger middleware | Log `method`, `url`, `status`, `response time` for every request. Register in `AppModule` | ✅ Done | `@nestjs/common` Logger |
| 4-2 | Structured logger | Replace `console.log` with structured logger supporting log levels (`log`, `warn`, `error`, `debug`) | ✅ Done | `@nestjs/common` Logger + `LOG_LEVEL` env |
| 4-3 | Error logging | Log unhandled exceptions with stack trace in exception filter | ⬜ Not done | — |

---

## 5. Security

| # | Item | Spec | Status | Library |
|---|---|---|---|---|
| 5-1 | CORS | Configure allowed origins in `main.ts`. Use env var for production origins | ⬜ Not done | `app.enableCors()` |
| 5-2 | Helmet | Set secure HTTP headers | ⬜ Not done | `helmet` |
| 5-3 | Rate limiting | Limit repeated requests per IP (e.g. 100 req/min) | ⬜ Not done | `@nestjs/throttler` |
| 5-4 | Environment variable validation | Validate required env vars on startup. Fail fast if missing | ⬜ Not done | `joi` or `class-validator` with `@nestjs/config` |

---

## 6. Health Check

| # | Item | Spec | Status | Library |
|---|---|---|---|---|
| 6-1 | Health endpoint | `GET /health` returns app + DB status | ⬜ Not done | `@nestjs/terminus` |
| 6-2 | DB health indicator | Check PostgreSQL connectivity in health response | ⬜ Not done | `@nestjs/terminus` |

---

## 7. UI / SSR

| # | Item | Spec | Status | Library |
|---|---|---|---|---|
| 7-1 | Layout partials | `header.hbs`, `sidebar.hbs`, `footer.hbs`, `scripts.hbs` created | ✅ Done | `hbs` |
| 7-2 | Base layout applied | All pages include header / sidebar / footer partials | ✅ Done | `hbs` |
| 7-3 | Static assets served | Bootstrap, jQuery, axios, DataTables served via `useStaticAssets` | ✅ Done | `@nestjs/platform-express` |
| 7-4 | Theme applied | Dark sidebar + light content color tokens applied globally | ⬜ Not done | CSS custom properties |
| 7-5 | Responsive sidebar | Sidebar hidden on mobile (`d-none d-md-block`) | ⬜ Not done | Bootstrap |

---

## 8. Testing

| # | Item | Spec | Status | Library |
|---|---|---|---|---|
| 8-1 | Unit test — AuthService | Test `create`, `findAll`, `findOne`, `update`, `remove` with mocked repository | ⬜ Not done | `jest`, `@nestjs/testing` |
| 8-2 | Unit test — HttpErrorFilter | Test exception caught and response shape correct | ⬜ Not done | `jest` |
| 8-3 | Unit test — LoggerMiddleware | Test middleware calls `next()` and logs request info | ⬜ Not done | `jest` |
| 8-4 | E2E test | Test full request cycle for `/auth` endpoints against real DB | ⬜ Not done | `supertest`, `jest` |

---

## 9. CI/CD

| # | Item | Spec | Status | Library |
|---|---|---|---|---|
| 9-1 | GitHub Actions — CI | On PR/push to master: lint → build → test | ⬜ Not done | GitHub Actions |
| 9-2 | GitHub Actions — CD | On merge to master: docker build → deploy to server | ⬜ Not done | GitHub Actions, Docker |

---

## 10. Infrastructure

| # | Item | Spec | Status | Library |
|---|---|---|---|---|
| 10-1 | Docker Compose | App + DB with health check, volume, internal network | ✅ Done | Docker Compose |
| 10-2 | Dockerfile 2-stage build | builder → runner, devDependencies excluded | ✅ Done | Docker |
| 10-3 | Deploy packager | `scripts/pack-deploy.js` bundles dist + views + public | ✅ Done | Node.js |
| 10-4 | DB migration | `synchronize: false`, migration files in `src/migrations/` | ✅ Done | TypeORM |

---

## Status Legend

| Symbol | Meaning |
|---|---|
| ✅ Done | Implemented and verified |
| 🔄 In Progress | Currently being worked on |
| ⬜ Not done | Not yet started |
| ❌ Skipped | Decided not to implement (add reason) |

---

# 아키텍처 체크리스트

이 프로젝트의 설계 및 구현 완성도 추적 파일.
각 항목은 스펙 / 구현 여부 / 사용 라이브러리로 분류.

---

## 1. 입력값 검증

| # | 항목 | 스펙 | 상태 | 라이브러리 |
|---|---|---|---|---|
| 1-1 | 전역 ValidationPipe | `main.ts`에 `ValidationPipe` 전역 등록. `whitelist: true`, `forbidNonWhitelisted: true` | ⬜ 미구현 | `class-validator`, `class-transformer` |
| 1-2 | DTO 데코레이터 | 모든 요청 DTO에 `@IsString()`, `@IsNotEmpty()`, `@MinLength()` 등 추가 | ⬜ 미구현 | `class-validator` |
| 1-3 | DTO 타입 안전성 | 모든 DTO 명시적 타입 지정 (암묵적 `any` 금지) | ⬜ 미구현 | TypeScript strict |

---

## 2. 예외 처리

| # | 항목 | 스펙 | 상태 | 라이브러리 |
|---|---|---|---|---|
| 2-1 | 전역 예외 필터 | `HttpErrorFilter` 구현 및 `main.ts` 등록. 통일된 에러 응답 형태 반환 | ⬜ 미구현 | `@nestjs/common` |
| 2-2 | 에러 응답 형태 | `{ statusCode, message, timestamp, path }` 표준화 | ⬜ 미구현 | Custom |
| 2-3 | 404 핸들러 | 정의되지 않은 라우트 404 처리 | ⬜ 미구현 | `@nestjs/common` |

---

## 3. 인증 / 인가

| # | 항목 | 스펙 | 상태 | 라이브러리 |
|---|---|---|---|---|
| 3-1 | 비밀번호 해싱 | 생성/수정 시 bcrypt 해싱. 평문 저장 절대 금지 | ⬜ 미구현 | `bcrypt`, `@types/bcrypt` |
| 3-2 | JWT 인증 | 로그인 시 JWT 발급, 보호 라우트에서 검증 | ⬜ 미구현 | `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt` |
| 3-3 | Auth Guard | `JwtAuthGuard`로 라우트 보호. 전역 또는 컨트롤러별 적용 | ⬜ 미구현 | `@nestjs/passport` |
| 3-4 | Public 데코레이터 | `@Public()` 데코레이터로 전역 가드 예외 처리 | ⬜ 미구현 | Custom |
| 3-5 | 역할 기반 접근 제어 | `@Roles()` 데코레이터 + `RolesGuard`로 admin/user 구분 | ⬜ 미구현 | Custom |

---

## 4. 로깅

| # | 항목 | 스펙 | 상태 | 라이브러리 |
|---|---|---|---|---|
| 4-1 | 요청 로거 미들웨어 | 모든 요청에 `method`, `url`, `status`, `응답시간` 로깅. `AppModule` 등록 | ✅ 완료 | `@nestjs/common` Logger |
| 4-2 | 구조화 로거 | `console.log` 대신 로그 레벨(`log`, `warn`, `error`, `debug`) 지원 로거 | ✅ 완료 | `@nestjs/common` Logger + `LOG_LEVEL` env |
| 4-3 | 에러 로깅 | 예외 필터에서 미처리 예외 스택트레이스 로깅 | ⬜ 미구현 | — |

---

## 5. 보안

| # | 항목 | 스펙 | 상태 | 라이브러리 |
|---|---|---|---|---|
| 5-1 | CORS | `main.ts`에 허용 출처 설정. 프로덕션 출처는 환경변수로 관리 | ⬜ 미구현 | `app.enableCors()` |
| 5-2 | Helmet | 보안 HTTP 헤더 설정 | ⬜ 미구현 | `helmet` |
| 5-3 | Rate Limiting | IP당 반복 요청 제한 (예: 100 req/min) | ⬜ 미구현 | `@nestjs/throttler` |
| 5-4 | 환경변수 검증 | 앱 시작 시 필수 환경변수 검증. 누락 시 즉시 종료 | ⬜ 미구현 | `joi` 또는 `class-validator` + `@nestjs/config` |

---

## 6. 헬스체크

| # | 항목 | 스펙 | 상태 | 라이브러리 |
|---|---|---|---|---|
| 6-1 | 헬스 엔드포인트 | `GET /health` — 앱 + DB 상태 반환 | ⬜ 미구현 | `@nestjs/terminus` |
| 6-2 | DB 헬스 인디케이터 | 헬스 응답에 PostgreSQL 연결 상태 포함 | ⬜ 미구현 | `@nestjs/terminus` |

---

## 7. UI / SSR

| # | 항목 | 스펙 | 상태 | 라이브러리 |
|---|---|---|---|---|
| 7-1 | 레이아웃 Partial | `header.hbs`, `sidebar.hbs`, `footer.hbs`, `scripts.hbs` 생성 | ✅ 완료 | `hbs` |
| 7-2 | 기본 레이아웃 적용 | 모든 페이지에 header / sidebar / footer partial 포함 | ✅ 완료 | `hbs` |
| 7-3 | 정적 자산 서빙 | Bootstrap, jQuery, axios, DataTables `useStaticAssets` 서빙 | ✅ 완료 | `@nestjs/platform-express` |
| 7-4 | 테마 적용 | 다크 사이드바 + 라이트 콘텐츠 컬러 토큰 전역 적용 | ⬜ 미구현 | CSS custom properties |
| 7-5 | 반응형 사이드바 | 모바일에서 사이드바 숨김 (`d-none d-md-block`) | ⬜ 미구현 | Bootstrap |

---

## 8. 테스트

| # | 항목 | 스펙 | 상태 | 라이브러리 |
|---|---|---|---|---|
| 8-1 | 단위 테스트 — AuthService | mocked repository로 CRUD 메서드 테스트 | ⬜ 미구현 | `jest`, `@nestjs/testing` |
| 8-2 | 단위 테스트 — HttpErrorFilter | 예외 캐치 및 응답 형태 검증 | ⬜ 미구현 | `jest` |
| 8-3 | 단위 테스트 — LoggerMiddleware | `next()` 호출 및 요청 로깅 검증 | ⬜ 미구현 | `jest` |
| 8-4 | E2E 테스트 | `/auth` 엔드포인트 전체 요청 사이클 실제 DB 테스트 | ⬜ 미구현 | `supertest`, `jest` |

---

## 9. CI/CD

| # | 항목 | 스펙 | 상태 | 라이브러리 |
|---|---|---|---|---|
| 9-1 | GitHub Actions — CI | PR/push 시: lint → build → test | ⬜ 미구현 | GitHub Actions |
| 9-2 | GitHub Actions — CD | master 머지 시: docker build → 서버 배포 | ⬜ 미구현 | GitHub Actions, Docker |

---

## 10. 인프라

| # | 항목 | 스펙 | 상태 | 라이브러리 |
|---|---|---|---|---|
| 10-1 | Docker Compose | 앱 + DB, 헬스체크, 볼륨, 내부 네트워크 | ✅ 완료 | Docker Compose |
| 10-2 | Dockerfile 2단계 빌드 | builder → runner, devDependencies 제외 | ✅ 완료 | Docker |
| 10-3 | 배포 패키저 | `scripts/pack-deploy.js` — dist + views + public 번들 | ✅ 완료 | Node.js |
| 10-4 | DB 마이그레이션 | `synchronize: false`, 마이그레이션 파일 관리 | ✅ 완료 | TypeORM |

---

## 상태 범례

| 기호 | 의미 |
|---|---|
| ✅ 완료 | 구현 및 검증 완료 |
| 🔄 진행중 | 현재 작업 중 |
| ⬜ 미구현 | 아직 시작 안 함 |
| ❌ 제외 | 구현 안 하기로 결정 (사유 기재) |
