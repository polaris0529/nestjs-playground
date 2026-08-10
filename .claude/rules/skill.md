## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Architecture | CRITICAL | `arch-` |
| 2 | Dependency Injection | CRITICAL | `di-` |
| 3 | Error Handling | HIGH | `error-` |
| 4 | Security | HIGH | `security-` |
| 5 | Performance | HIGH | `perf-` |
| 6 | Testing | MEDIUM-HIGH | `test-` |
| 7 | Database & ORM | MEDIUM-HIGH | `db-` |
| 8 | API Design | MEDIUM | `api-` |
| 9 | Microservices | MEDIUM | `micro-` |
| 10 | DevOps & Deployment | LOW-MEDIUM | `devops-` |

## Quick Reference

### 1. Architecture (CRITICAL)

- `arch-avoid-circular-deps` - Avoid circular module dependencies
- `arch-feature-modules` - Organize by feature, not technical layer
- `arch-module-sharing` - Proper module exports/imports, avoid duplicate providers
- `arch-single-responsibility` - Focused services over "god services"
- `arch-use-repository-pattern` - Abstract database logic for testability
- `arch-use-events` - Event-driven architecture for decoupling

### 2. Dependency Injection (CRITICAL)

- `di-avoid-service-locator` - Avoid service locator anti-pattern
- `di-interface-segregation` - Interface Segregation Principle (ISP)
- `di-liskov-substitution` - Liskov Substitution Principle (LSP)
- `di-prefer-constructor-injection` - Constructor over property injection
- `di-scope-awareness` - Understand singleton/request/transient scopes
- `di-use-interfaces-tokens` - Use injection tokens for interfaces

### 3. Error Handling (HIGH)

- `error-use-exception-filters` - Centralized exception handling
- `error-throw-http-exceptions` - Use NestJS HTTP exceptions
- `error-handle-async-errors` - Handle async errors properly

### 4. Security (HIGH)

- `security-auth-jwt` - Secure JWT authentication
- `security-validate-all-input` - Validate with class-validator
- `security-use-guards` - Authentication and authorization guards
- `security-sanitize-output` - Prevent XSS attacks
- `security-rate-limiting` - Implement rate limiting

### 5. Performance (HIGH)

- `perf-async-hooks` - Proper async lifecycle hooks
- `perf-use-caching` - Implement caching strategies
- `perf-optimize-database` - Optimize database queries
- `perf-lazy-loading` - Lazy load modules for faster startup

### 6. Testing (MEDIUM-HIGH)

- `test-use-testing-module` - Use NestJS testing utilities
- `test-e2e-supertest` - E2E testing with Supertest
- `test-mock-external-services` - Mock external dependencies

### 7. Database & ORM (MEDIUM-HIGH)

- `db-use-transactions` - Transaction management
- `db-avoid-n-plus-one` - Avoid N+1 query problems
- `db-use-migrations` - Use migrations for schema changes

### 8. API Design (MEDIUM)

- `api-use-dto-serialization` - DTO and response serialization
- `api-use-interceptors` - Cross-cutting concerns
- `api-versioning` - API versioning strategies
- `api-use-pipes` - Input transformation with pipes

### 9. Microservices (MEDIUM)

- `micro-use-patterns` - Message and event patterns
- `micro-use-health-checks` - Health checks for orchestration
- `micro-use-queues` - Background job processing

### 10. DevOps & Deployment (LOW-MEDIUM)

- `devops-use-config-module` - Environment configuration
- `devops-use-logging` - Structured logging
- `devops-graceful-shutdown` - Zero-downtime deployments

## How to Use

Read detailed rule files under `.claude/rules/` when they exist:

```
.claude/rules/arch-avoid-circular-deps.md
.claude/rules/security-validate-all-input.md
.claude/rules/_sections.md
```

Each rule file contains:
- Brief explanation of why it matters
- Incorrect code example with explanation
- Correct code example with explanation
- Additional context and references

---

## 우선순위별 규칙 범주

| 우선순위 | 범주 | 영향도 | 접두사 |
|----------|------|--------|--------|
| 1 | 아키텍처 | 치명적 | `arch-` |
| 2 | 의존성 주입 | 치명적 | `di-` |
| 3 | 오류 처리 | 높음 | `error-` |
| 4 | 보안 | 높음 | `security-` |
| 5 | 성능 | 높음 | `perf-` |
| 6 | 테스트 | 중간-높음 | `test-` |
| 7 | 데이터베이스 & ORM | 중간-높음 | `db-` |
| 8 | API 설계 | 중간 | `api-` |
| 9 | 마이크로서비스 | 중간 | `micro-` |
| 10 | DevOps & 배포 | 낮음-중간 | `devops-` |

## 빠른 참조

### 1. 아키텍처 (치명적)

- `arch-avoid-circular-deps` - 순환 모듈 의존성을 피한다
- `arch-feature-modules` - 기술 계층이 아니라 기능 기준으로 구성한다
- `arch-module-sharing` - 모듈 export/import를 올바르게 사용하고 provider 중복을 피한다
- `arch-single-responsibility` - 거대한 service 대신 책임이 명확한 service를 사용한다
- `arch-use-repository-pattern` - 테스트 가능성을 위해 데이터베이스 로직을 추상화한다
- `arch-use-events` - 결합도를 낮추기 위해 이벤트 기반 아키텍처를 사용한다

### 2. 의존성 주입 (치명적)

- `di-avoid-service-locator` - service locator 안티패턴을 피한다
- `di-interface-segregation` - 인터페이스 분리 원칙(ISP)을 지킨다
- `di-liskov-substitution` - 리스코프 치환 원칙(LSP)을 지킨다
- `di-prefer-constructor-injection` - property injection보다 constructor injection을 선호한다
- `di-scope-awareness` - singleton/request/transient scope를 이해하고 사용한다
- `di-use-interfaces-tokens` - interface에는 injection token을 사용한다

### 3. 오류 처리 (높음)

- `error-use-exception-filters` - 중앙화된 exception handling을 사용한다
- `error-throw-http-exceptions` - NestJS HTTP exception을 사용한다
- `error-handle-async-errors` - async error를 올바르게 처리한다

### 4. 보안 (높음)

- `security-auth-jwt` - JWT 인증을 안전하게 구성한다
- `security-validate-all-input` - class-validator로 모든 입력을 검증한다
- `security-use-guards` - 인증과 인가 guard를 사용한다
- `security-sanitize-output` - XSS 공격을 방지한다
- `security-rate-limiting` - rate limiting을 구현한다

### 5. 성능 (높음)

- `perf-async-hooks` - async lifecycle hook을 올바르게 사용한다
- `perf-use-caching` - caching 전략을 구현한다
- `perf-optimize-database` - 데이터베이스 query를 최적화한다
- `perf-lazy-loading` - 빠른 startup을 위해 module을 lazy load한다

### 6. 테스트 (중간-높음)

- `test-use-testing-module` - NestJS testing utility를 사용한다
- `test-e2e-supertest` - Supertest로 E2E test를 작성한다
- `test-mock-external-services` - 외부 dependency를 mock 처리한다

### 7. 데이터베이스 & ORM (중간-높음)

- `db-use-transactions` - transaction management를 사용한다
- `db-avoid-n-plus-one` - N+1 query 문제를 피한다
- `db-use-migrations` - schema 변경에는 migration을 사용한다

### 8. API 설계 (중간)

- `api-use-dto-serialization` - DTO와 response serialization을 사용한다
- `api-use-interceptors` - 횡단 관심사에는 interceptor를 사용한다
- `api-versioning` - API versioning 전략을 사용한다
- `api-use-pipes` - pipe로 입력을 변환한다

### 9. 마이크로서비스 (중간)

- `micro-use-patterns` - message와 event pattern을 사용한다
- `micro-use-health-checks` - orchestration을 위한 health check를 사용한다
- `micro-use-queues` - background job 처리에는 queue를 사용한다

### 10. DevOps & 배포 (낮음-중간)

- `devops-use-config-module` - 환경 설정을 사용한다
- `devops-use-logging` - 구조화된 logging을 사용한다
- `devops-graceful-shutdown` - 무중단 배포를 고려한다

## 사용 방법

자세한 설명과 code example은 `.claude/rules/` 아래의 상세 rule file이 있을 때 읽는다:

```
.claude/rules/arch-avoid-circular-deps.md
.claude/rules/security-validate-all-input.md
.claude/rules/_sections.md
```

각 rule file은 다음을 포함한다:
- 중요한 이유에 대한 짧은 설명
- 잘못된 code example과 설명
- 올바른 code example과 설명
- 추가 context와 reference
