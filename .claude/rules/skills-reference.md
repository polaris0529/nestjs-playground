# Skills Reference (Project-Relevant)

Curated list of installed skills relevant to **this** repo (NestJS + TypeORM + PostgreSQL + Vue.js + Docker). See root `CLAUDE.md` for global rules.

> Advisory only. User instructions and the `@`-imported rule files (`app-coding`, `app-service`, `ui-design`, `git-deploy`, `safe-coding`) always take precedence over any skill. Skill names are namespaced (`plugin:skill`); invoke with the full name.

## Core Development

| Skill | Use for |
|---|---|
| `ecc:nestjs-patterns` | NestJS module/provider/DI patterns, controllers, guards, interceptors |
| `ecc:backend-patterns` | General backend architecture / service composition |
| `ecc:api-design` | REST resource modeling, HTTP method/status conventions |
| `ecc:postgres-patterns` | PostgreSQL query/index/schema patterns |
| `ecc:database-migrations` | TypeORM migration workflow (`synchronize: false` is fixed here) |
| `ecc:error-handling` | Error envelope / exception filter design |
| `ecc:coding-standards` | Naming, structure, lint/format conventions |

## Testing & Quality

| Skill | Use for |
|---|---|
| `ecc:e2e-testing` | End-to-end test design (Playwright is set up under `e2e/`) |
| `ecc:browser-qa` | Browser-driven visual/QA checks |
| `ecc:test-coverage` | Coverage analysis and gap-filling |
| `superpowers:test-driven-development` | Red-green-refactor discipline before implementation |
| `ecc:security-review`, `ecc:security-scan` | Security review / scanning of changes |
| `code-review`, `simplify`, `verify` | Built-in: diff review, cleanup, run-and-observe verification |

## Ops & Deployment

| Skill | Use for |
|---|---|
| `ecc:docker-patterns` | Dockerfile / compose patterns (see `git-deploy.md` build flow) |
| `ecc:deployment-patterns` | Release/deploy strategy |
| `ecc:git-workflow`, `ecc:github-ops` | Branch/commit/PR workflow (see `git-deploy.md`) |

## Process (cross-cutting)

| Skill | Use for |
|---|---|
| `superpowers:brainstorming` | Before any creative/feature work — explore intent + design |
| `superpowers:writing-plans` | Turn a spec into a bite-sized implementation plan |
| `superpowers:systematic-debugging` | Any bug/test failure before proposing a fix |
| `superpowers:verification-before-completion` | Evidence before claiming done / before commit |

## UI (Vue)

| Skill | Use for |
|---|---|
| `frontend-design:frontend-design` | Visual direction for Vue screens and shared UI components — see `ui-design.md` |

## Not Currently Applicable

- `mongodb:*` — repo uses PostgreSQL, not MongoDB. Reference only if MongoDB is introduced.
- `ecc:react-*`, `ecc:nextjs-*` — repo target frontend is Vue.js, not React/Next.js.
- `ecc:prisma-patterns`, `ecc:jpa-patterns` — repo ORM is TypeORM, not Prisma/JPA.
- `ecc:springboot-*`, language packs for Go/Rust/Kotlin/etc. — out of stack.

---

# 스킬 참조 (프로젝트 관련)

이 레포(NestJS + TypeORM + PostgreSQL + Vue.js + Docker)에 해당하는 설치 스킬 정리. 전체 공통 룰은 루트 `CLAUDE.md` 참조.

> 참고용이다. 사용자 지시와 `@` import 룰 파일(`app-coding`, `app-service`, `ui-design`, `git-deploy`, `safe-coding`)이 어떤 스킬보다 우선한다. 스킬명은 네임스페이스(`plugin:skill`)이며 전체 이름으로 호출한다.

## 코어 개발

| 스킬 | 용도 |
|---|---|
| `ecc:nestjs-patterns` | NestJS 모듈/프로바이더/DI 패턴, 컨트롤러·가드·인터셉터 |
| `ecc:backend-patterns` | 일반 백엔드 아키텍처 / 서비스 구성 |
| `ecc:api-design` | REST 리소스 모델링, HTTP 메서드/상태코드 규칙 |
| `ecc:postgres-patterns` | PostgreSQL 쿼리/인덱스/스키마 패턴 |
| `ecc:database-migrations` | TypeORM 마이그레이션 워크플로(이 레포는 `synchronize: false` 고정) |
| `ecc:error-handling` | 에러 응답 봉투 / 예외 필터 설계 |
| `ecc:coding-standards` | 네이밍·구조·lint/format 규칙 |

## 테스트 & 품질

| 스킬 | 용도 |
|---|---|
| `ecc:e2e-testing` | E2E 테스트 설계(`e2e/` 에 Playwright 셋업됨) |
| `ecc:browser-qa` | 브라우저 기반 시각/QA 점검 |
| `ecc:test-coverage` | 커버리지 분석 및 보강 |
| `superpowers:test-driven-development` | 구현 전 red-green-refactor 규율 |
| `ecc:security-review`, `ecc:security-scan` | 변경분 보안 리뷰/스캔 |
| `code-review`, `simplify`, `verify` | 내장: diff 리뷰, 정리, 실행-관찰 검증 |

## 운영 & 배포

| 스킬 | 용도 |
|---|---|
| `ecc:docker-patterns` | Dockerfile/compose 패턴(`git-deploy.md` 빌드 흐름 참조) |
| `ecc:deployment-patterns` | 릴리스/배포 전략 |
| `ecc:git-workflow`, `ecc:github-ops` | 브랜치/커밋/PR 워크플로(`git-deploy.md` 참조) |

## 프로세스 (횡단)

| 스킬 | 용도 |
|---|---|
| `superpowers:brainstorming` | 창의/기능 작업 전 — 의도·설계 탐색 |
| `superpowers:writing-plans` | 스펙을 잘게 쪼갠 구현 계획으로 |
| `superpowers:systematic-debugging` | 버그/테스트 실패 시 수정 제안 전에 |
| `superpowers:verification-before-completion` | 완료 주장/커밋 전에 증거 확보 |

## UI (Vue)

| 스킬 | 용도 |
|---|---|
| `frontend-design:frontend-design` | Vue 화면과 공통 UI component 시각 방향(`ui-design.md` 참조) |

## 현재 비해당

- `mongodb:*` — 이 레포는 PostgreSQL 사용. MongoDB 도입 시에만 참조.
- `ecc:react-*`, `ecc:nextjs-*` — 이 레포 target frontend는 Vue.js이며 React/Next.js가 아님.
- `ecc:prisma-patterns`, `ecc:jpa-patterns` — 이 레포 ORM 은 TypeORM(Prisma/JPA 아님).
- `ecc:springboot-*`, Go/Rust/Kotlin 등 언어팩 — 스택 외.
