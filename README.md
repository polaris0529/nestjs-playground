# WorkFlow — NestJS 관리자 포털

NestJS + PostgreSQL 기반의 관리자 포털. JWT 인증, 공통코드/메뉴/계정 관리, SSR(hbs) 화면과 Docker 배포를 포함한다.

운영 도메인: `https://polaris9309.store`

## 기술 스택

- **런타임/프레임워크**: Node.js 20, NestJS 11
- **DB/ORM**: PostgreSQL 16, TypeORM (마이그레이션 기반, `synchronize: false`)
- **인증**: Passport JWT (access + refresh, httpOnly 쿠키), bcrypt 해싱, Double-submit CSRF
- **뷰**: Handlebars(hbs) SSR + Bootstrap 5 + DataTables
- **배포**: Docker / docker-compose, Nginx Proxy Manager 뒤단

## 주요 기능

- **인증/인가**: 로그인·로그아웃·토큰 자동 갱신(refresh), `ADMIN`/`USER` 역할 기반 접근 제어
- **공통코드 관리**: 그룹/코드 CRUD (SELECTBOX 기반 입력, 검증)
- **메뉴 관리**: 트리 구조(부모-자식) CRUD, 사이드바 동적 렌더링(접이식 폴더)
- **계정 관리**: 생성·수정·역할 변경·비활성화, 본인 비밀번호 변경
- **대시보드**: 로그인 시 통계 요약(계정/메뉴/코드)

## 프로젝트 구조 (레이어드)

```
src/
├── <feature>/                 # 기능 모듈 (auth, account, common-code, menu, admin)
│   ├── *.controller.ts        # Presentation — HTTP 라우팅
│   ├── *.service.ts           # Application — 비즈니스 흐름
│   ├── *.repository.ts        # Infrastructure — TypeORM 캡슐화
│   ├── dto/ , entities/
│   └── *.module.ts
├── shared/                    # 횡단 관심사
│   ├── guards/ (JwtAuth, Roles, AdminPage)
│   ├── interceptors/ (Logging)
│   ├── filters/ (HttpError)
│   ├── middleware/ (Logger, Auth, Csrf, MenuNav)
│   ├── decorators/ (Roles)
│   └── exceptions/
├── config/                    # app.config / typeorm.config / swagger.config
├── migrations/                # 스키마 + 시드 마이그레이션
├── data-source.ts , main.ts
views/        # hbs 템플릿 (partials/ 공통 조각, admin/ 관리 화면)
public/       # 정적 자산 (css, js)
```

의존 방향: **Controller → Service → Repository** (계층 건너뛰기 금지). 세부 규칙은 `.claude/rules/` 참조.

## 요구사항

- Node.js 20 (LTS), npm
- Docker / docker compose (배포·로컬 DB)

## 환경변수 (`.env`)

루트 `.env` 에서 로드한다(커밋 금지).

```env
SERVER_PORT=3000
LOG_LEVEL=log

DATABASE_URL="postgresql://<user>:<pass>@db:5432/<db>"
POSTGRES_USER=...
POSTGRES_PASSWORD=...
POSTGRES_DB=...

JWT_SECRET=<access 서명 시크릿>
JWT_REFRESH_SECRET=<refresh 서명 시크릿>
JWT_ACCESS_EXPIRES_IN=1800      # 초 (30분)
JWT_REFRESH_EXPIRES_IN=604800   # 초 (7일)
```

## 로컬 실행

```bash
# 1) 의존성
npm install

# 2) DB + 앱 (docker)
docker compose up -d --build      # base + docker-compose.override.yml(로컬 포트) 자동 병합

# 앱: http://localhost:3000  /  DB 툴: localhost:5433
```

> `docker-compose.yml`(base)은 원격 안전을 위해 호스트 포트를 노출하지 않는다. 로컬 포트(앱 3000, DB 5433)는 gitignore 대상인 `docker-compose.override.yml` 에서만 노출된다.

소스만 watch 로 띄우려면(별도 DB 필요):

```bash
npm run start:dev
```

## DB 마이그레이션

`synchronize: false` — 스키마 변경은 반드시 마이그레이션으로 처리한다. 컨테이너 기동 시 `docker-entrypoint.sh` 가 마이그레이션을 자동 실행한다.

```bash
npm run migration:generate    # 변경 감지해 생성
npm run migration:run         # 적용
npm run migration:revert      # 롤백
```

> 로컬에서 직접 실행 시 `DATABASE_URL` 의 호스트가 `db` 가 아니라 `localhost:5433` 이어야 한다.

## 기본 계정

- 관리자: **`appadmin`** (비밀번호는 `SeedDefaultAdmin` 마이그레이션에 시드됨 — **운영 환경에서는 반드시 변경**)
- 역할: `ROLE_TYPE` 공통코드의 `ADMIN` / `USER`

## 인증/권한 요약

- 로그인 시 access/refresh JWT 를 httpOnly 쿠키로 발급, access 만료 시 자동 갱신
- 변경 요청은 CSRF 토큰(`X-CSRF-Token` 헤더 또는 `_csrf` 폼 필드) 필요
- 관리자 API: `ADMIN` 전용(401/403), 관리자 페이지(`/admin/*`): 미인증→`/login`, 비-ADMIN→`/`

## 테스트 / 린트

```bash
npm test          # Jest
npm run lint      # ESLint (--fix)
npm run format    # Prettier
```

## 배포

```bash
# 로컬 빌드 확인
npm run build

# 원격 (Nginx Proxy Manager 뒤단)
git pull origin master
docker compose up -d --build app   # entrypoint 가 마이그레이션 자동 실행
```

- `workflow-app` — NestJS 앱 (내부 3000, nginx 프록시)
- `workflow-db` — PostgreSQL 16 (내부 전용, 볼륨 `workflow-db-data`)

## 규칙 문서

프로젝트 코딩/서비스/UI/배포 규칙은 `.claude/rules/` 에 있으며 `CLAUDE.md` 에서 import 한다.

- `app-coding.md` — 레이어드 아키텍처 / REST / DTO·엔티티 / 마이그레이션
- `app-service.md` — 모듈 구성 / 인증·인가 / Swagger
- `ui-design.md` — hbs 템플릿 / 테마 컬러 / 동적 메뉴 / 관리 UI
- `git-deploy.md` — git 운영 / 커밋 규칙 / 배포 흐름
