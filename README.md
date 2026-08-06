# WorkFlow — NestJS 관리자 포털

NestJS + PostgreSQL 기반의 관리자 포털. JWT 인증, 공통코드/메뉴/계정 관리, SSR(hbs) 화면과 Docker 배포를 포함한다.

## 기술 스택

- **런타임/프레임워크**: Node.js 20, NestJS 11
- **DB/ORM**: PostgreSQL 16, TypeORM (마이그레이션 기반, `synchronize: false`)
- **인증**: Passport JWT (access + refresh, httpOnly 쿠키), bcrypt 해싱, Double-submit CSRF
- **뷰**: Handlebars(hbs) SSR + Bootstrap 5 + DataTables
- **모니터링**: prom-client + @willsoto/nestjs-prometheus — `/metrics` Prometheus pull exporter
- **배포**: Docker / docker-compose, Nginx Proxy Manager 뒤단

## 주요 기능

- **인증/인가**: 로그인·로그아웃·토큰 자동 갱신(refresh), `ADMIN`/`USER` 역할 기반 접근 제어
- **공통코드 관리**: 그룹/코드 CRUD (SELECTBOX 기반 입력, 검증)
- **메뉴 관리**: 트리 구조(부모-자식) CRUD, 사이드바 동적 렌더링(접이식 폴더)
- **계정 관리**: 생성·수정·역할 변경·비활성화, 본인 비밀번호 변경
- **메인 일정보드**: 메인 `/` 는 공통 일정보드(공통 캘린더). 공휴일·공통 태스크를 누구나 조회(무인증 `GET /calendar/common-events`)
- **대시보드**: `/dashboard`(로그인) — 통계 요약(계정/메뉴/코드)
- **소개 페이지**: `/about`(공개) — 포트폴리오
- **캘린더**: FullCalendar(CDN) 월간 뷰, 공통 캘린더 기준일 + 개인/공통 태스크 관리(등록·수정·삭제, soft-delete). `/calendar`(로그인), `/admin/calendar`(ADMIN: 공휴일·공통 태스크 편집). 공통 태스크 CRUD는 ADMIN 전용, 조회는 공개. 한국 시간(`Asia/Seoul`) 기준
- **다국어(i18n)**: `Accept-Language` 기반, 예외 메시지를 전역 필터에서 키→요청 언어로 번역 (ko/en)
- **메트릭**: `GET /metrics` — Prometheus pull 방식, Node.js 기본 메트릭(CPU·메모리·GC·이벤트루프) 수집, `app="workflow"` 레이블 포함

## 프로젝트 구조 (레이어드)

```
src/
├── modules/                   # 도메인 기능 모듈
│   └── <feature>/             # auth, account, common-code, menu, admin, calendar
│       ├── *.controller.ts    # Presentation — HTTP 라우팅
│       ├── *.service.ts       # Application — 비즈니스 흐름
│       ├── *.repository.ts    # Infrastructure — TypeORM 캡슐화
│       ├── dto/ , entities/
│       └── *.module.ts
├── shared/                    # 횡단 관심사
│   ├── guards/ (JwtAuth, Roles, AdminPage)
│   ├── interceptors/ (Logging)   filters/ (HttpError)
│   ├── middleware/ (Logger, Auth, Csrf, MenuNav)
│   ├── decorators/ (Roles)   exceptions/   types/
├── config/                    # app.config / typeorm.config / swagger.config
├── database/                  # data-source.ts + migrations/ (스키마·시드)
├── i18n/                      # 번역 리소스 (ko, en)
├── main.ts  app.module.ts  app.controller.ts  app.service.ts  # 부트스트랩
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

> `docker-compose.yml`(base)은 DB 포트 5432를 노출한다(원격 서버 로컬 접속용). 앱 포트(3000)는 gitignore 대상인 `docker-compose.override.yml` 에서만 노출된다. 로컬에서는 override가 DB 5433도 추가 노출한다.

소스만 watch 로 띄우려면(별도 DB 필요):

```bash
npm run start:dev
```

## DB 마이그레이션

`synchronize: false` — 스키마 변경은 반드시 마이그레이션으로 처리한다. 컨테이너 기동 시 `docker/docker-entrypoint.sh` 가 마이그레이션을 자동 실행한다.

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
npm run test:e2e  # Playwright (e2e/, 로컬 인스턴스 :3100 필요)
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

## 원격 서버 구성도 (Nginx Proxy Manager)

모든 외부 트래픽은 **Nginx Proxy Manager(NPM)** 가 80/443 에서 받아 `nginx-net`(공유 도커 네트워크) 내부 컨테이너로 프록시한다. DB 는 외부에 노출되지 않는다.

```
                         Internet (HTTPS / Let's Encrypt)
                                     │
                         ┌───────────▼───────────┐
                         │   nginx-manager (NPM)  │  :80 :443 :81(admin)
                         └───────────┬───────────┘
                                     │  (docker network: nginx-net)
        ┌──────────────┬─────────────┼──────────────┬──────────────┐
        ▼              ▼             ▼               ▼              ▼
 workflow-app:3000  spring-app:8080  portainer:9443  nginx-manager:81
   (NestJS)           (Spring)      (HTTPS, 내부전용) (NPM 관리 콘솔)
        │                   │
        ▼                   ▼
 workflow-db:5432    spring-app-db:5432   ← DB 는 nginx-net 미연결, 호스트 5432 노출(로컬 접속용)
 (internal net)      (internal net)
```

### 프록시 호스트 매핑 (NPM)

| 전달 대상(컨테이너) | 내부 포트 | Scheme | 접근 정책 |
|---|---|---|---|
| `workflow-app` | `3000` | http | 공개 |
| `spring-app` | `8080` | http | 공개 |
| `portainer` | `9443` | **https** | **internal-only** |
| `nginx-manager` | `81` | http | 공개 |

> 전달 대상은 호스트:포트가 아니라 **도커 내부 DNS(컨테이너명)** 를 사용한다. 모든 대상 컨테이너는 `nginx-net` 에 연결돼 있어야 한다(`docker network connect nginx-net <container>`).

### Portainer 설정

- 컨테이너: `portainer`, 내부 포트 **9443(HTTPS)** 사용 (8000/9000 은 미사용)
- NPM Proxy Host: `<your-portainer-domain>` → `https://portainer:9443`
  - Scheme 를 **https** 로 지정 (Portainer 가 자체 TLS 로 9443 서빙)
  - SSL 탭에서 Let's Encrypt 인증서 발급 + **Force SSL / HTTP2** 권장
  - Advanced 또는 접근 정책에서 **internal-only**(특정 IP 만 허용)로 제한
- `nginx-net` 에 연결돼 있어야 NPM 이 컨테이너명으로 프록시 가능
- 데이터 볼륨(예: `portainer_data`)로 설정 영속화

## 규칙 문서

프로젝트 코딩/서비스/UI/배포 규칙은 `.claude/rules/` 에 있으며 `CLAUDE.md` 에서 import 한다.

- `app-coding.md` — 레이어드 아키텍처 / REST / DTO·엔티티 / 마이그레이션 / i18n
- `app-service.md` — 모듈 구성 / 인증·인가 / Swagger
- `safe-coding.md` — 보안·안정성 코딩 규칙 / 생성 코드 리뷰 체크리스트
- `ui-design.md` — hbs 템플릿 / 테마 컬러 / 동적 메뉴 / 관리 UI
- `git-deploy.md` — git 운영 / 커밋 규칙 / 배포 흐름
- `skills-reference.md` — 프로젝트 관련 설치 스킬 참조
