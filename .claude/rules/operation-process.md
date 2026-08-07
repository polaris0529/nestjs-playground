# Operation And Process Rules

This file contains process, response, Docker, and rule-file management
rules. Coding and design rules belong in `.claude/rules/coding-design.md`.

## Response Language

- User-facing answers must be written in Korean.

## Model Switching Guidance

- Before deep reasoning tasks such as architecture design, complex bug analysis, trade-off decisions, or security review, suggest:

```text
이 작업은 깊은 추론이 필요합니다. `/model opus` 로 Opus 모델로 전환 후 진행하길 권장합니다.
```

- For straightforward implementation tasks such as simple feature additions, CRUD, simple bug fixes, or config changes, suggest:

```text
이 작업은 단순 구현입니다. 토큰 절약을 위해 `/model sonnet` 으로 전환을 권장합니다.
```

## Docker Compose Creation

- Generate valid Compose V2 YAML and omit the `version` field.
- Always set `container_name`.
- Use pinned stable image versions, never `latest`.
- Use `.env` for all secrets and credentials.
- Set `restart: unless-stopped`.
- Expose only required ports and prefer internal networking.
- Define explicit networks when multiple services exist.
- Use `depends_on` with `condition: service_healthy` when readiness matters.
- Prefer internal DNS over localhost communication.
- Use volumes only for persistent data such as DB data, uploads, and logs.
- Name volumes as `{project}-{service}-data`.
- Do not expose database ports unless explicitly requested.
- Use `json-file` logging with rotation:
  - worker: `max-size=10m`, `max-file=3`
  - api: `max-size=50m`, `max-file=5`
  - nginx: `max-size=100m`, `max-file=5`
  - db: `max-size=20m`, `max-file=3`
  - unknown service type: use api rules.
- Resource limits by server capacity:
  - small: CPU <= 2 core and RAM <= 4GB -> `cpus: "0.3"`, `memory: 256M`
  - medium: CPU <= 4 core and RAM <= 8GB -> `cpus: "0.5"`, `memory: 512M`
  - large: CPU > 4 core and RAM > 8GB -> `cpus: "1.0"`, `memory: 1G`

## Rule File Management

- Rule files must be placed under `.claude/rules/`.
- Rule file names must use kebab-case.
- File names must clearly describe the covered domain.
- Use `{domain}.md` or `{context}-{domain}.md`.
- Register every rule file in root `AGENTS.md` and `CLAUDE.md` with `@.claude/rules/{filename}.md`.
- Rule files imported with `@` must write the full English content first, then a `---` divider, then the full Korean translation.

---

# 운영 및 프로세스 규칙

이 파일은 프로세스, 응답, Docker, 규칙 파일 관리 규칙을 담는다.
코딩과 디자인 규칙은 `.claude/rules/coding-design.md`에 둔다.

## 응답 언어

- 사용자에게 보이는 답변은 한글로 작성한다.

## 모델 전환 안내

- 아키텍처 설계, 복잡한 버그 분석, trade-off 결정, 보안 리뷰처럼 깊은 추론이 필요한 작업 전에는 다음을 제안한다:

```text
이 작업은 깊은 추론이 필요합니다. `/model opus` 로 Opus 모델로 전환 후 진행하길 권장합니다.
```

- 단순 기능 추가, CRUD, 단순 버그 수정, 설정 변경처럼 단순 구현 작업에는 다음을 제안한다:

```text
이 작업은 단순 구현입니다. 토큰 절약을 위해 `/model sonnet` 으로 전환을 권장합니다.
```

## Docker Compose 생성

- 유효한 Compose V2 YAML을 생성하고 `version` 필드는 생략한다.
- 항상 `container_name`을 설정한다.
- 안정적인 고정 이미지 버전을 사용하고 `latest`는 사용하지 않는다.
- 모든 secret과 credential은 `.env`를 사용한다.
- `restart: unless-stopped`를 설정한다.
- 필요한 port만 노출하고 내부 네트워크를 우선한다.
- 서비스가 여러 개면 명시적 network를 정의한다.
- readiness가 중요하면 `depends_on`에 `condition: service_healthy`를 사용한다.
- localhost 통신보다 내부 DNS를 우선한다.
- volume은 DB data, upload, log 같은 영속 데이터에만 사용한다.
- volume 이름은 `{project}-{service}-data` 형식을 사용한다.
- 명시 요청이 없으면 database port를 노출하지 않는다.
- `json-file` logging과 rotation을 사용한다:
  - worker: `max-size=10m`, `max-file=3`
  - api: `max-size=50m`, `max-file=5`
  - nginx: `max-size=100m`, `max-file=5`
  - db: `max-size=20m`, `max-file=3`
  - 알 수 없는 service type: api 규칙 사용.
- 서버 용량별 resource limit:
  - small: CPU <= 2 core and RAM <= 4GB -> `cpus: "0.3"`, `memory: 256M`
  - medium: CPU <= 4 core and RAM <= 8GB -> `cpus: "0.5"`, `memory: 512M`
  - large: CPU > 4 core and RAM > 8GB -> `cpus: "1.0"`, `memory: 1G`

## 규칙 파일 관리

- 규칙 파일은 `.claude/rules/` 하위에 둔다.
- 규칙 파일명은 kebab-case를 사용한다.
- 파일명은 다루는 도메인을 명확하게 표현한다.
- `{domain}.md` 또는 `{context}-{domain}.md` 형식을 사용한다.
- 모든 규칙 파일은 루트 `AGENTS.md`와 `CLAUDE.md`에 `@.claude/rules/{filename}.md`로 등록한다.
- `@`로 import되는 규칙 파일은 전체 영어 내용을 먼저 작성하고, `---` 구분선 뒤에 전체 한글 번역을 작성한다.
