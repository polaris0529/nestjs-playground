# Schedule Service Workflow

**Goal:** WorkFlow 관리자 포털에 스케줄표 기능을 추가한다. 1차 범위는 관리자용 일정 CRUD, 기간별 조회, 소프트 삭제, 기본 SSR 관리 화면이다.

**Architecture:** 기존 기능과 동일하게 `Controller -> Service -> Repository` 계층을 유지한다. TypeORM 접근은 `schedule.repository.ts` 안에만 둔다. 서비스는 일정 검증과 비즈니스 흐름을 담당하고, 컨트롤러는 HTTP shape만 담당한다.

**Tech Stack:** NestJS 11, TypeORM, PostgreSQL migration, Handlebars SSR, public JS, i18n JSON.

**검증 방식:** DTO/서비스 단위 검증, `npm run build`, `npm test`, 관리자 화면 수동 QA로 확인한다.

---

## File Structure

- `src/modules/schedule/schedule.module.ts`
- `src/modules/schedule/schedule.controller.ts`
- `src/modules/schedule/schedule.service.ts`
- `src/modules/schedule/schedule.repository.ts`
- `src/modules/schedule/entities/schedule.entity.ts`
- `src/modules/schedule/dto/create-schedule.dto.ts`
- `src/modules/schedule/dto/update-schedule.dto.ts`
- `src/database/migrations/*-CreateSchedule.ts`
- `src/i18n/ko/schedule.json`
- `src/i18n/en/schedule.json`
- `views/admin/schedule-list.hbs`
- `views/admin/schedule-new.hbs`
- `public/js/admin/schedule.js`

---

## Domain Model

### Schedule

| Field | Type | Notes |
|---|---|---|
| `scheduleId` | bigint | PK |
| `title` | varchar(120) | required |
| `description` | text nullable | optional |
| `startAt` | timestamp | required |
| `endAt` | timestamp | required, `startAt < endAt` |
| `allDayYn` | char(1) | `Y` / `N`, default `N` |
| `status` | varchar(30) | default `PLANNED`; common-code 전환은 2차 |
| `ownerAccountId` | bigint nullable | 담당자 계정 |
| `createdBy` | bigint nullable | 생성자 |
| `updatedBy` | bigint nullable | 수정자 |
| `deleteYn` | char(1) | soft delete, default `N` |
| `createdAt` | timestamp | create date |
| `updatedAt` | timestamp | update date |

### 1차 비범위

- 반복 일정
- 알림/푸시
- 참석자 다대다
- 외부 캘린더 연동
- 드래그 앤 드롭 일정 변경

---

## Task 1: 데이터 모델과 마이그레이션

**Files:**
- Add: `src/modules/schedule/entities/schedule.entity.ts`
- Add: `src/database/migrations/*-CreateSchedule.ts`

- [ ] **Step 1: Schedule 엔티티 추가**

명시적 테이블명 `@Entity('schedule')`을 사용한다. 날짜 컬럼은 `start_at`, `end_at`, 감사 컬럼은 기존 엔티티의 snake_case 패턴을 따른다.

- [ ] **Step 2: schedule 테이블 마이그레이션 추가**

`schedule_id` PK, 기간 조회용 `start_at`, `end_at`, `delete_yn` 인덱스를 포함한다. `owner_account_id`, `created_by`, `updated_by`는 `account(account_id)` FK로 연결한다.

- [ ] **Step 3: 확인**

Run:

```bash
npm run build
```

Expected: TypeScript compile 성공.

---

## Task 2: DTO 경계 검증

**Files:**
- Add: `src/modules/schedule/dto/create-schedule.dto.ts`
- Add: `src/modules/schedule/dto/update-schedule.dto.ts`

- [ ] **Step 1: CreateScheduleDto 추가**

필수값은 `title`, `startAt`, `endAt`이다. 날짜 문자열은 `@IsDateString()`, 제목은 길이 제한을 둔다. 검증 메시지는 `schedule.validation.*` i18n key를 사용한다.

- [ ] **Step 2: UpdateScheduleDto 추가**

부분 수정 DTO로 구성한다. `startAt` 또는 `endAt` 단독 변경이 가능하므로 실제 기간 정합성은 Service에서 기존 값을 병합한 뒤 검증한다.

- [ ] **Step 3: 확인**

Run:

```bash
npm run build
```

Expected: DTO decorator compile 성공.

---

## Task 3: Repository 구현

**Files:**
- Add: `src/modules/schedule/schedule.repository.ts`

- [ ] **Step 1: 기본 조회 메서드 추가**

필수 메서드:

```text
findAll()
findById(scheduleId)
findByRange(startAt, endAt)
create(schedule)
update(scheduleId, partial)
softRemove(scheduleId)
```

- [ ] **Step 2: 기간 조회 조건 구현**

기간 겹침 조건은 `start_at < rangeEnd AND end_at > rangeStart`로 처리한다. 삭제된 일정은 항상 제외한다.

- [ ] **Step 3: 확인**

Run:

```bash
npm run build
```

Expected: TypeORM repository compile 성공.

---

## Task 4: Service 구현

**Files:**
- Add: `src/modules/schedule/schedule.service.ts`

- [ ] **Step 1: 조회 흐름 구현**

`findAll`, `findOne`, `findByRange`를 구현한다. 단건이 없으면 `NotFoundException('schedule.errors.not_found')`를 던진다.

- [ ] **Step 2: 생성 검증 구현**

`startAt < endAt`을 검증한다. 실패 시 `BadRequestException('schedule.errors.invalid_range')`를 던진다.

- [ ] **Step 3: 수정 검증 구현**

기존 일정과 DTO 값을 병합한 뒤 기간 정합성을 검증한다. 존재하지 않는 일정은 not found로 처리한다.

- [ ] **Step 4: 삭제 구현**

물리 삭제 대신 `deleteYn = 'Y'`로 소프트 삭제한다.

- [ ] **Step 5: 확인**

Run:

```bash
npm test
npm run build
```

Expected: 테스트와 빌드 통과.

---

## Task 5: Controller와 Module 연결

**Files:**
- Add: `src/modules/schedule/schedule.controller.ts`
- Add: `src/modules/schedule/schedule.module.ts`
- Modify: `src/app.module.ts`

- [ ] **Step 1: REST API 추가**

관리자 전용 API로 구성한다.

```text
GET /schedules
GET /schedules?startAt=...&endAt=...
GET /schedules/:id
POST /schedules
PATCH /schedules/:id
DELETE /schedules/:id
```

- [ ] **Step 2: Guard 적용**

기존 관리자 API처럼 `JwtAuthGuard`, `RolesGuard`, `@Roles('ADMIN')`를 적용한다.

- [ ] **Step 3: 모듈 등록**

`ScheduleModule`은 `TypeOrmModule.forFeature([Schedule])`와 controller/service/repository를 등록한다. `AppModule`은 완성된 모듈만 import한다.

- [ ] **Step 4: 확인**

Run:

```bash
npm run build
```

Expected: DI resolution 성공.

---

## Task 6: i18n 메시지 추가

**Files:**
- Add: `src/i18n/ko/schedule.json`
- Add: `src/i18n/en/schedule.json`

- [ ] **Step 1: 에러 키 추가**

필수 키:

```text
schedule.errors.not_found
schedule.errors.invalid_range
schedule.validation.title_required
schedule.validation.title_length
schedule.validation.start_at_required
schedule.validation.end_at_required
schedule.validation.date_invalid
```

- [ ] **Step 2: 확인**

Run:

```bash
rg "schedule\\.errors|schedule\\.validation" src/modules/schedule src/i18n
```

Expected: 서비스/DTO 키와 번역 파일 키가 서로 대응.

---

## Task 7: 관리자 SSR 화면

**Files:**
- Add: `views/admin/schedule-list.hbs`
- Add: `views/admin/schedule-new.hbs`
- Add: `public/js/admin/schedule.js`
- Modify: `src/modules/admin/admin.controller.ts`
- Modify: menu seed 또는 메뉴 관리 데이터

- [ ] **Step 1: 목록 화면 추가**

기존 admin list 화면 패턴을 따른다. 필터는 시작일/종료일만 먼저 제공한다.

- [ ] **Step 2: 생성 화면 추가**

제목, 설명, 시작일시, 종료일시, 종일 여부, 상태를 입력한다. inline script와 inline event handler는 사용하지 않는다.

- [ ] **Step 3: 클라이언트 JS 추가**

기존 axios/CSRF 흐름을 사용해 생성, 수정, 삭제 요청을 처리한다.

- [ ] **Step 4: 메뉴 연결**

사이드바 메뉴에 스케줄표 항목을 추가한다. DB 메뉴 데이터로 관리 중이면 migration 또는 seed 방식으로 추가한다.

- [ ] **Step 5: 수동 QA**

Run:

```bash
npm run dev
```

Expected:
- 관리자 로그인 후 스케줄표 메뉴 진입 가능
- 일정 생성 가능
- 기간 필터로 목록 조회 가능
- 일정 수정 가능
- 일정 삭제 후 목록에서 제외

---

## Acceptance Criteria

- `schedule` 테이블이 migration으로 생성된다.
- 관리자 API가 CRUD와 기간 조회를 제공한다.
- 서비스는 기간 정합성과 존재 여부를 검증한다.
- 삭제는 소프트 삭제로 처리된다.
- 서비스/DTO는 i18n key를 사용한다.
- 컨트롤러는 repository 또는 TypeORM에 직접 의존하지 않는다.
- `npm run build`와 `npm test`가 통과한다.
- 관리자 화면에서 생성, 조회, 수정, 삭제가 실제로 동작한다.
