# 앱 코딩 규칙 (NestJS)

이 레포(nestjs-playground)의 코드 레벨 규칙. 전체 공통 룰은 루트 `CLAUDE.md` 참조.

## 구조
- 기능별 모듈 단위로 구성한다: `src/<기능>/` 안에 `*.controller.ts`, `*.service.ts`, `*.module.ts`, `dto/`, `entities/`.
- 각 기능 모듈은 `AppModule` 에 등록한다.

## DTO / 엔티티
- 요청 DTO 는 `dto/`, TypeORM 엔티티는 `entities/` 에 둔다.
- 엔티티는 `@Entity('<table>')` 로 테이블명을 명시한다.

## DB / 마이그레이션
- `synchronize: false` 고정 — 스키마 변경은 반드시 마이그레이션으로 한다.
- 마이그레이션 파일은 `src/migrations/`, 실행 `npm run migration:run`, 생성 `npm run migration:generate`.

## 포맷 / 린트
- `npm run format`(prettier), `npm run lint`(eslint) 기준을 따른다.
