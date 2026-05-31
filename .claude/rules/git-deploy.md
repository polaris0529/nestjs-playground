# Git & Deployment Rules

Git operation and deployment rules for this project. See root `CLAUDE.md` for global rules.

## Repository
- Remote: `https://github.com/polaris0529/nestjs-playground.git`
- Main branch: `master`

## Branch Strategy
- `master` — production-ready code only. Direct commits for solo projects; use PR for team review.
- Feature work: `feat/<name>`, bug fixes: `fix/<name>`, docs: `docs/<name>`

## Commit Message Convention
- Format: `<type>: <subject>` (English, lowercase subject)
- Types: `feat` | `fix` | `refactor` | `docs` | `chore` | `test`
- Keep subject under 72 characters. No period at the end.

## Pre-Commit / Pre-Push Checklist

Before proceeding with any commit or push, check for unused code and request confirmation:

1. Scan for unused imports, variables, functions, and dependencies in the changed files.
2. Report findings to the user in a clear list.
3. **Wait for explicit user approval before proceeding.** Do not auto-remove or skip.
4. If nothing unused is found, state that clearly and proceed.

Example report format:
```
[Unused Code Check]
- src/auth/auth.service.ts: unused import `Logger`
- src/app.module.ts: unused variable `tempConfig`
- package.json: `concurrently` not referenced anywhere in src/

Proceed with commit/push? (yes to continue)
```

## What to Commit / Exclude
- **Never commit**: `.env`, `dist/`, `deploy/`, `node_modules/`
- **Always commit**: `src/`, `views/`, `public/`, `migrations/`, config files
- **Include in commit when changed**: `package.json`, `package-lock.json`, `tsconfig.json`

## Build & Deploy Flow

```
[local]
npm run build          # nest build → dist/
npm run deploy:prepare # dist/ + views/ + public/ → deploy/

[Docker]
docker compose build app   # Dockerfile 2-stage build
docker compose up -d app   # replace container (DB volume preserved)
```

### Dockerfile Overview
- **Stage 1 (builder)**: `npm install` → `nest build` → `deploy:prepare`
- **Stage 2 (runner)**: copies `deploy/` only → `npm ci --omit=dev`
- Runtime artifacts in `deploy/`: `dist/`, `views/`, `public/`, `package.json`, `package-lock.json`

### Docker Compose
- `workflow-app` — NestJS app, port `3001→3000`
- `workflow-db` — PostgreSQL 16, internal only (no exposed port)
- DB data persisted in volume `workflow-db-data`
- App waits for DB health check before starting (`depends_on: service_healthy`)

## Database Migration
- `synchronize: false` — schema changes via migration only. Never use `synchronize: true` in production.
- Generate: `npm run migration:generate`
- Run: `npm run migration:run`
- Revert: `npm run migration:revert`
- Migration files live in `src/migrations/` and must be committed.

---

# Git & 배포 규칙

이 프로젝트의 git 운영 및 배포 관련 규칙. 전체 공통 룰은 루트 `CLAUDE.md` 참조.

## 저장소
- Remote: `https://github.com/polaris0529/nestjs-playground.git`
- 메인 브랜치: `master`

## 브랜치 전략
- `master` — 배포 가능 상태만 유지. 개인 프로젝트는 직접 커밋, 팀 작업 시 PR 필수.
- 기능: `feat/<name>`, 버그: `fix/<name>`, 문서: `docs/<name>`

## 커밋 메시지 규칙
- 형식: `<type>: <subject>` (영문 소문자)
- 타입: `feat` | `fix` | `refactor` | `docs` | `chore` | `test`
- 제목 72자 이내, 마침표 없음.

## 커밋/푸시 전 체크리스트

커밋 또는 푸시 진행 전, 미사용 코드를 확인하고 사용자 수락을 받은 후 진행한다:

1. 변경된 파일의 미사용 import, 변수, 함수, 의존성을 스캔한다.
2. 발견된 항목을 목록으로 명확하게 보고한다.
3. **사용자의 명시적 수락을 받은 후에만 진행한다.** 자동 제거하거나 생략하지 않는다.
4. 미사용 항목이 없으면 없다고 명시하고 진행한다.

보고 형식 예시:
```
[미사용 코드 확인]
- src/auth/auth.service.ts: 미사용 import `Logger`
- src/app.module.ts: 미사용 변수 `tempConfig`
- package.json: `concurrently` — src/ 내 참조 없음

커밋/푸시를 진행할까요? (yes 입력 시 계속)
```

## 커밋 포함/제외 대상
- **절대 커밋 금지**: `.env`, `dist/`, `deploy/`, `node_modules/`
- **반드시 커밋**: `src/`, `views/`, `public/`, `migrations/`, 설정 파일
- **변경 시 함께 커밋**: `package.json`, `package-lock.json`, `tsconfig.json`

## 빌드 및 배포 흐름

```
[로컬]
npm run build          # nest build → dist/
npm run deploy:prepare # dist/ + views/ + public/ → deploy/

[Docker]
docker compose build app   # Dockerfile 2단계 빌드
docker compose up -d app   # 컨테이너 교체 기동 (DB 볼륨 유지)
```

### Dockerfile 구조
- **Stage 1 (builder)**: `npm install` → `nest build` → `deploy:prepare`
- **Stage 2 (runner)**: `deploy/` 만 복사 → `npm ci --omit=dev`
- 런타임 필수 산출물 (`deploy/`): `dist/`, `views/`, `public/`, `package.json`, `package-lock.json`

### Docker Compose 구성
- `workflow-app` — NestJS 앱, 포트 `3001→3000`
- `workflow-db` — PostgreSQL 16, 외부 포트 미노출 (내부 통신 전용)
- DB 데이터는 볼륨 `workflow-db-data` 로 영속 보관
- 앱은 DB 헬스체크 통과 후 기동 (`depends_on: service_healthy`)

## DB 마이그레이션
- `synchronize: false` — 스키마 변경은 반드시 마이그레이션으로. 프로덕션에서 `synchronize: true` 절대 금지.
- 생성: `npm run migration:generate`
- 실행: `npm run migration:run`
- 롤백: `npm run migration:revert`
- 마이그레이션 파일은 `src/migrations/` 에 위치하며 반드시 커밋.
