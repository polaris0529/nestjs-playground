# Safe Coding Rules

Security and reliability rules for generated or edited code in this repo. Apply these before convenience or speed.

## Core Principles

- Treat every value from users, servers, URLs, forms, cookies, headers, files, databases, and third-party APIs as untrusted until it is parsed or encoded for the target context.
- Prefer safe APIs by default: typed DTOs, validation pipes, repository methods, parameterized queries, `textContent`, DOM APIs, and existing HTTP helpers.
- Do not silence security, type, or lint failures. Fix the cause or report the blocker.
- Keep fixes scoped. Do not mix security cleanup with unrelated refactors.

## Frontend JavaScript

- Do not render untrusted values with `innerHTML`, `outerHTML`, or `insertAdjacentHTML`.
  - Use `textContent` for messages and labels.
  - For multiline text, join with `\n` and render with CSS `white-space: pre-line`.
  - If HTML rendering is unavoidable, use an established sanitizer and explain why it is safe.
- Do not build HTML attributes by concatenating dynamic values into strings.
  - Prefer DOM APIs, DataTables render callbacks that escape text, or an explicit escape helper.
- Event delegation must use `closest()` so clicks on nested icons/spans still work.
- Shared event binders must be idempotent.
  - Do not add duplicate `document` or `window` listeners on repeated initialization.
  - Use a bound flag, named handler removal, or one-time page initialization.
- Mutating requests (`POST`, `PUT`, `PATCH`, `DELETE`) must follow the app CSRF convention: `X-CSRF-Token` header.
- DOM helpers must tolerate missing elements unless the caller has already proven the element exists.
- New frontend behavior belongs in Vue components and shared client modules.

## Backend TypeScript / NestJS

- Controllers only parse request boundaries and delegate to services. They must not access TypeORM repositories or database APIs directly.
- Services must not trust raw request bodies. Use DTOs, validation decorators, and explicit transformation/parsing for IDs, booleans, enums, dates, and pagination.
- Throw i18n keys from service and lower layers, not localized strings.
- Do not return secrets, password hashes, refresh tokens, CSRF tokens, or internal exception details in API responses.
- Passwords must always be hashed with bcrypt before persistence.
- Authorization checks belong on every protected API. Vue route guards and hidden UI controls are not authorization.

## Database / Persistence

- Schema changes require migrations under `src/database/migrations/`; keep `synchronize: false`.
- Do not build SQL from string-concatenated dynamic values. Use TypeORM query parameters or repository methods.
- Validate ownership and role constraints before updates/deletes, not only before reads.
- Keep soft-delete, audit, and status fields consistent with existing entity patterns.

## Secrets / Config

- Never hardcode credentials, JWT secrets, database URLs, private keys, public IPs, or real production domains.
- Runtime secrets must come from `.env`/environment variables and `ConfigService`.
- Do not log tokens, cookies, passwords, authorization headers, or full request bodies containing credentials.

## Error Handling

- Preserve the app error envelope from `HttpErrorFilter`.
- Client-facing errors should be useful but not disclose stack traces, SQL, filesystem paths, token contents, or internal config.
- Frontend error rendering must treat server messages as text unless sanitized.

## Generated Code Review Checklist

Before accepting generated code, scan the changed files for:

- `innerHTML`, `outerHTML`, `insertAdjacentHTML`
- `v-html` or inline raw HTML without a documented sanitizer/safety boundary
- dynamic HTML strings containing unescaped IDs, names, messages, URLs, or attributes
- repeated `document.addEventListener` / `window.addEventListener` in reusable initializers
- `event.target.classList.contains(...)` where `closest()` is required
- mutating axios/fetch requests without CSRF handling
- direct repository/database access from controllers or services bypassing local repositories
- hardcoded secrets, tokens, credentials, production URLs, or IP addresses
- raw SQL or query strings with dynamic concatenation
- `any`, `@ts-ignore`, or broad catch blocks that hide the actual failure

If any item is intentionally present, document the reason and the safety boundary in the change summary.

---

# 안전 코딩 규칙

이 레포에서 생성하거나 수정하는 코드의 보안/안정성 규칙. 편의나 속도보다 우선한다.

## 핵심 원칙

- 사용자, 서버, URL, 폼, 쿠키, 헤더, 파일, DB, 외부 API에서 온 값은 대상 컨텍스트에 맞게 파싱하거나 인코딩하기 전까지 신뢰하지 않는다.
- 기본적으로 안전한 API를 사용한다: 타입 DTO, validation pipe, repository 메서드, 파라미터 바인딩, `textContent`, DOM API, 기존 HTTP 헬퍼.
- 보안/타입/린트 오류를 억누르지 않는다. 원인을 고치거나 차단 사유를 보고한다.
- 변경 범위를 좁게 유지한다. 보안 수정과 무관한 리팩터링을 섞지 않는다.

## 프론트엔드 JavaScript

- 신뢰할 수 없는 값을 `innerHTML`, `outerHTML`, `insertAdjacentHTML`로 렌더링하지 않는다.
  - 메시지와 라벨은 `textContent`를 사용한다.
  - 여러 줄 텍스트는 `\n`으로 합치고 CSS `white-space: pre-line`으로 렌더링한다.
  - HTML 렌더링이 불가피하면 검증된 sanitizer를 사용하고 왜 안전한지 설명한다.
- 동적 값을 문자열 연결로 HTML attribute에 넣지 않는다.
  - DOM API, 텍스트 escaping이 보장되는 DataTables render callback, 또는 명시적 escape helper를 사용한다.
- 이벤트 위임은 `closest()` 기반으로 작성해 내부 아이콘/span 클릭도 처리한다.
- 공통 이벤트 바인더는 idempotent해야 한다.
  - 반복 초기화 때 `document`/`window` 리스너가 중복 등록되면 안 된다.
  - bound flag, named handler 제거, 또는 페이지 1회 초기화를 사용한다.
- 변경 요청(`POST`, `PUT`, `PATCH`, `DELETE`)은 앱 CSRF 규칙을 따른다: `X-CSRF-Token` 헤더.
- DOM helper는 호출자가 존재를 이미 증명한 경우가 아니면 누락된 element를 견뎌야 한다.
- 신규 프론트 동작은 Vue component와 공통 client module에 둔다.

## 백엔드 TypeScript / NestJS

- Controller는 요청 경계를 파싱하고 Service에 위임한다. TypeORM repository나 DB API에 직접 접근하지 않는다.
- Service는 raw request body를 신뢰하지 않는다. DTO, validation decorator, ID/boolean/enum/date/pagination의 명시적 변환을 사용한다.
- Service 이하 계층은 지역화 문자열이 아니라 i18n key를 던진다.
- API 응답에 secret, password hash, refresh token, CSRF token, 내부 예외 상세를 포함하지 않는다.
- 비밀번호는 저장 전 항상 bcrypt로 해싱한다.
- 보호된 API에는 권한 검사를 둔다. Vue route guard와 숨겨진 UI 컨트롤을 권한으로 간주하지 않는다.

## DB / 영속성

- 스키마 변경은 `src/database/migrations/` 하위 migration으로 처리하고 `synchronize: false`를 유지한다.
- 동적 값을 문자열로 이어붙여 SQL을 만들지 않는다. TypeORM query parameter 또는 repository 메서드를 사용한다.
- 수정/삭제 전 ownership과 role 제약을 검증한다. 읽기 전에만 검증하고 끝내지 않는다.
- soft-delete, audit, status 필드는 기존 entity 패턴과 일관되게 유지한다.

## 시크릿 / 설정

- credential, JWT secret, DB URL, private key, public IP, 실제 운영 도메인을 하드코딩하지 않는다.
- 런타임 secret은 `.env`/환경 변수와 `ConfigService`에서 가져온다.
- token, cookie, password, authorization header, credential이 들어간 전체 request body를 로그로 남기지 않는다.

## 에러 처리

- `HttpErrorFilter`의 앱 공통 에러 envelope를 유지한다.
- 클라이언트 에러는 유용해야 하지만 stack trace, SQL, 파일 경로, token 내용, 내부 config를 노출하지 않는다.
- 프론트엔드 에러 렌더링은 sanitizer가 없는 한 서버 메시지를 텍스트로 취급한다.

## 생성 코드 리뷰 체크리스트

생성 코드를 수용하기 전 변경 파일에서 다음을 확인한다.

- `innerHTML`, `outerHTML`, `insertAdjacentHTML`
- sanitizer 또는 안전 경계 문서화 없이 사용한 `v-html` 또는 raw HTML
- escape되지 않은 ID, 이름, 메시지, URL, attribute가 들어간 동적 HTML 문자열
- 재사용 initializer 안의 반복 `document.addEventListener` / `window.addEventListener`
- `closest()`가 필요한 곳의 `event.target.classList.contains(...)`
- CSRF 처리 없는 mutating axios/fetch 요청
- Controller의 직접 repository/DB 접근 또는 Service의 local repository 우회
- 하드코딩된 secret, token, credential, 운영 URL, IP
- 동적 문자열 연결로 만든 raw SQL/query
- 실제 실패를 숨기는 `any`, `@ts-ignore`, 넓은 catch block

의도적으로 남긴 항목이 있다면 변경 요약에 이유와 안전 경계를 기록한다.
