# Coding And Design Rules

This file contains only coding and design rules. Process, logging, Docker,
model-switching, and deployment rules belong in separate rule files.

## Coding Rules

- Code, variable names, function names, class names, and identifiers must be written in English.
- Code comments must be written in Korean.
- Keep changes minimal and directly tied to the user request.
- Use the existing NestJS layering: Controller -> Service -> Repository.
- Controllers handle HTTP shape only. They must not access TypeORM repositories or database APIs directly.
- Services orchestrate business flow and depend on local `*.repository.ts` files.
- `@InjectRepository` is allowed only inside repository classes.
- Request DTOs live in `dto/`; TypeORM entities live in `entities/`.
- Entities must use explicit table names with `@Entity('<table>')`.
- Services and lower layers throw i18n keys, not localized strings.
- Schema changes require migrations under `src/database/migrations/`; keep `synchronize: false`.
- Do not hardcode secrets, credentials, JWT secrets, database URLs, production domains, or public IPs.
- Frontend JavaScript must treat server and user values as untrusted.
- Do not render untrusted values with `innerHTML`, `outerHTML`, or `insertAdjacentHTML` unless an established sanitizer is used and the safety boundary is documented.
- Mutating client requests must follow the app CSRF convention: `X-CSRF-Token` header.

## Design Rules

- New frontend work targets Vue.js.
- Place Vue source under `frontend/` when the Vue app is scaffolded.
- Use Vue single-file components for UI and keep API access in shared client modules.
- Do not use `v-html` or direct DOM HTML injection for untrusted values unless an established sanitizer is used and documented.
- Preserve the standard admin shell: header, left sidebar, main content, and footer.
- Login/auth pages are the only standalone layout exception.
- Use shared theme tokens from `.claude/rules/ui-design.md` and the Vue design system source once created.
- Do not hardcode new colors in components or CSS without first updating the design rule source.
- Do not use `!important`.
- Admin CRUD screens should use shared Vue table, form, and modal components once introduced.
- Do not add server-rendered page templates for product screens.
- Keep responsive behavior aligned with the existing layout: sidebar hidden on mobile, header visible.

---

# 코딩 및 디자인 규칙

이 파일은 코딩과 디자인 규칙만 담는다. 프로세스, 로그, Docker, 모델 전환,
배포 규칙은 별도 규칙 파일에 둔다.

## 코딩 규칙

- 코드, 변수명, 함수명, 클래스명, 식별자는 영어로 작성한다.
- 코드 주석은 한글로 작성한다.
- 변경은 최소화하고 사용자 요청과 직접 연결된 범위만 수정한다.
- 기존 NestJS 계층 구조를 따른다: Controller -> Service -> Repository.
- Controller는 HTTP 형태만 처리한다. TypeORM repository나 DB API에 직접 접근하지 않는다.
- Service는 비즈니스 흐름을 조율하고 로컬 `*.repository.ts` 파일에 의존한다.
- `@InjectRepository`는 repository 클래스 내부에서만 허용한다.
- 요청 DTO는 `dto/`, TypeORM entity는 `entities/`에 둔다.
- Entity는 `@Entity('<table>')`로 테이블명을 명시한다.
- Service 이하 계층은 지역화 문자열이 아니라 i18n key를 던진다.
- 스키마 변경은 `src/database/migrations/` 하위 migration으로 처리하고 `synchronize: false`를 유지한다.
- secret, credential, JWT secret, DB URL, 운영 도메인, 공개 IP를 하드코딩하지 않는다.
- 프론트엔드 JavaScript는 서버와 사용자 값을 신뢰하지 않는 값으로 취급한다.
- 검증된 sanitizer를 사용하고 안전 경계를 문서화한 경우가 아니면 신뢰할 수 없는 값을 `innerHTML`, `outerHTML`, `insertAdjacentHTML`로 렌더링하지 않는다.
- 변경 클라이언트 요청은 앱 CSRF 규칙을 따른다: `X-CSRF-Token` 헤더.

## 디자인 규칙

- 신규 프론트엔드 작업은 Vue.js를 기준으로 한다.
- Vue 앱을 scaffold할 때 소스는 `frontend/` 하위에 둔다.
- UI는 Vue single-file component로 작성하고 API 접근은 공통 client module에 둔다.
- 검증된 sanitizer를 사용하고 문서화한 경우가 아니면 신뢰할 수 없는 값에 `v-html` 또는 직접 DOM HTML 주입을 사용하지 않는다.
- 표준 관리자 셸을 유지한다: header, left sidebar, main content, footer.
- login/auth 페이지는 독립형 레이아웃 예외로 둔다.
- `.claude/rules/ui-design.md`와 Vue 디자인 시스템 소스가 만들어지면 해당 공유 테마 토큰을 사용한다.
- 디자인 규칙 원본을 먼저 갱신하지 않고 component나 CSS에 새 색상을 하드코딩하지 않는다.
- `!important`를 사용하지 않는다.
- 관리자 CRUD 화면은 Vue table, form, modal 공통 component가 도입되면 이를 사용한다.
- 제품 화면용 server-rendered page template을 추가하지 않는다.
- 반응형 동작은 기존 레이아웃과 맞춘다: 모바일에서 sidebar 숨김, header 표시.
