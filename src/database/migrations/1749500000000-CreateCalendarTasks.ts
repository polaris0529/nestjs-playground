import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCalendarTasks1749500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);

    await queryRunner.query(`
      CREATE TABLE calendar (
        calendar_date DATE PRIMARY KEY,
        day_of_week   VARCHAR(3)   NOT NULL,
        is_holiday    BOOLEAN      NOT NULL DEFAULT false,
        holiday_name  VARCHAR(100) NULL,
        is_weekend    BOOLEAN      NOT NULL DEFAULT false,
        is_workday    BOOLEAN      NOT NULL DEFAULT true,
        created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
        CONSTRAINT chk_calendar_day_of_week
          CHECK (day_of_week IN ('MON','TUE','WED','THU','FRI','SAT','SUN'))
      )
    `);

    await queryRunner.query(`
      CREATE TABLE personal_task (
        personal_task_id UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
        calendar_date    DATE         NOT NULL,
        user_id          BIGINT       NOT NULL,
        title            VARCHAR(100) NOT NULL,
        content          TEXT         NULL,
        status           VARCHAR(20)  NOT NULL DEFAULT 'TODO',
        priority         VARCHAR(10)  NULL DEFAULT 'NORMAL',
        start_time       TIME         NULL,
        end_time         TIME         NULL,
        completed_at     TIMESTAMP    NULL,
        is_deleted       BOOLEAN      NOT NULL DEFAULT false,
        deleted_at       TIMESTAMP    NULL,
        created_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
        updated_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
        CONSTRAINT fk_personal_task_calendar
          FOREIGN KEY (calendar_date) REFERENCES calendar(calendar_date),
        CONSTRAINT fk_personal_task_user
          FOREIGN KEY (user_id) REFERENCES account(account_id),
        CONSTRAINT chk_personal_task_status
          CHECK (status IN ('TODO','IN_PROGRESS','DONE','CANCELLED')),
        CONSTRAINT chk_personal_task_priority
          CHECK (priority IS NULL OR priority IN ('LOW','NORMAL','HIGH')),
        CONSTRAINT chk_personal_task_time_range
          CHECK (start_time IS NULL OR end_time IS NULL OR start_time <= end_time)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE common_task (
        common_task_id UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
        calendar_date  DATE         NOT NULL,
        title          VARCHAR(100) NOT NULL,
        content        TEXT         NULL,
        category       VARCHAR(50)  NULL,
        status         VARCHAR(20)  NOT NULL DEFAULT 'TODO',
        start_time     TIME         NULL,
        end_time       TIME         NULL,
        is_deleted     BOOLEAN      NOT NULL DEFAULT false,
        deleted_at     TIMESTAMP    NULL,
        created_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
        updated_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
        CONSTRAINT fk_common_task_calendar
          FOREIGN KEY (calendar_date) REFERENCES calendar(calendar_date),
        CONSTRAINT chk_common_task_status
          CHECK (status IN ('TODO','IN_PROGRESS','DONE','CANCELLED')),
        CONSTRAINT chk_common_task_time_range
          CHECK (start_time IS NULL OR end_time IS NULL OR start_time <= end_time)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX idx_personal_task_date_user
      ON personal_task (calendar_date, user_id)
      WHERE is_deleted = false
    `);
    await queryRunner.query(`
      CREATE INDEX idx_common_task_date
      ON common_task (calendar_date)
      WHERE is_deleted = false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE common_task`);
    await queryRunner.query(`DROP TABLE personal_task`);
    await queryRunner.query(`DROP TABLE calendar`);
  }
}
