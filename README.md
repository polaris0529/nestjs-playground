# all-inone (업무처리용 테스트 서버)

NestJS API 서버. DB 없이도 기동 가능합니다.

## 프로젝트 구조

```
├── server/   # NestJS API (포트 3000)
├── package.json   # 루트 스크립트 (dev, build, start 등)
└── README.md
```

**모든 명령은 저장소 루트에서 실행하세요.**

## 요구사항

- Node.js (LTS 권장)
- npm

## 설치

```bash
npm run install:all
```

루트에서 한 번 실행하면 루트·server 의존성이 모두 설치됩니다. (각각 따로 하려면 루트에서 `npm install`, `npm install --prefix server` 실행.)

## 개발 모드로 실행

```bash
npm run dev
```

- API 서버를 watch 모드로 실행 (포트 3000).
- 서버 코드 수정 시 자동 재시작.

## 스크립트 (루트에서 실행)

| 스크립트 | 설명 |
|----------|------|
| `npm run dev` | 서버 개발 모드 (watch, 포트 3000) |
| `npm run build` | 서버 빌드 (clean → server, 배포 전 권장) |
| `npm run start` | 빌드된 앱 프로덕션 실행 (실행 전 `npm run build` 필요) |
| `npm run run` | 빌드 후 프로덕션 실행 (한 번에) |
| `npm run deploy:prepare` | 배포용 최소 파일만 `deploy/`에 모음 (build 후 실행) |
| `npm run deploy` | 빌드 후 `deploy/` 생성 (배포 패킷) |

## 배포

**권장**: 컨테이너 안에서 `git clone` 후 빌드하는 방식이 아니라, **빌드한 결과물만** 이미지/서버에 넣어서 배포하는 방식이 일반적입니다. (보안·용량·재현성 측면에서 유리)

- **Docker**: 이미지 빌드 시 한 번만 빌드하고, **최종 이미지에는 dist + 프로덕션 node_modules만** 들어갑니다 (multi-stage).
- **수동/CI**: 로컬 또는 CI에서 `npm run deploy` 후 `deploy/` 폴더만 서버로 전달하면 됩니다.

### 배포에 필요한 것

| 구분 | 필요한 것 | 불필요한 것 |
|------|-----------|-------------|
| **서버** | `server/dist/` (빌드된 JS), `server/package.json`, **실행 시** `server/node_modules` (프로덕션 의존성) | server/src, 테스트, devDependencies |

즉, **빌드 결과(dist) + 프로덕션 의존성**만 있으면 됩니다.

### 방법 1: 배포 패킷 만들어서 전달 (권장)

```bash
npm run deploy
```

- `deploy/` 폴더가 생성되고, 그 안에 **server/dist, server/package.json** 만 들어 있습니다.
- 이 `deploy/` 폴더를 배포 서버로 복사한 뒤:

```bash
cd deploy/server
npm install --production    # 프로덕션 의존성만 설치 (한 번만)
node dist/main
```

### 방법 2: 서버에서 직접 빌드 후 실행

배포 서버에 소스 전체를 올리고:

```bash
npm run build
npm run start
```

- `server/node_modules`는 이미 있으므로, 배포 서버에서 `npm install`(또는 `npm ci`)만 해 두면 됩니다.

### 방법 3: Docker Compose (최종 이미지 = 빌드 결과만)

이미지 **안**에서는 소스로 빌드하지만, **실행용 이미지에는 빌드 결과물만** 들어갑니다. 서버에서 git clone 후 매번 빌드하는 구조가 아닙니다.

```bash
# 프로젝트 루트에서
docker compose up -d --build
```

- **Stage 1**: 소스 복사 → `npm run build` → `npm run deploy:prepare` → `deploy/` 생성
- **Stage 2**: `deploy/server` 만 복사 → `npm install --production` → 실행 시 `node dist/main.js` 만 사용
- 컨테이너 안에는 소스 코드, git, devDependencies 없음.
- 브라우저: **http://localhost:3001** (호스트 포트 3001 → 컨테이너 포트 3000)

```bash
# 로그 확인
docker compose logs -f app

# 중지
docker compose down
```

### 환경 변수

- `PORT`: 서버 포트 (기본 3000)
- 필요 시 `.env` 를 `server/` 에 두거나, 배포 환경에 맞게 설정.

## DB 없이 실행 (현재 기본)

- **`.env`에 `DATABASE_URL`을 넣지 않거나 비워두면** DB 없이 기동됩니다.
- Prisma는 초기화만 하고 실제 PostgreSQL 연결은 하지 않습니다.
- API 키 조회·IP 화이트리스트 조회는 빈 배열로 응답하며, IP 추가/수정은 "DB 비활성" 메시지를 반환합니다.

```bash
# .env 없이 또는 DATABASE_URL 없이
npm run dev
```

DB 연결을 명시적으로 건너뛰려면:

```bash
SKIP_DB_CONNECT=true npm run dev
```

## DB 사용 (PostgreSQL + Prisma)

1. PostgreSQL 준비 후 `.env`에 연결 정보 설정:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
   ```
2. 마이그레이션 적용:
   ```bash
   npx prisma migrate deploy
   # 또는 개발 시
   npx prisma migrate dev
   ```
3. 앱 실행:
   ```bash
   npm run dev
   ```

환경 변수 예시는 `.env.example`을 참고하세요.

개발 모드 상세는 위 **개발 모드로 실행** 섹션을 참고하세요.

## 문서

- [PRD 명세서](docs/PRD.md)
- [PRD 작성 가이드 정리](docs/PRD-가이드-정리.md)