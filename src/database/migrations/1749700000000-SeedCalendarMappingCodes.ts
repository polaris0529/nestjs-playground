import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCalendarMappingCodes1749700000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO common_code_group (group_code, group_name, description) VALUES
        ('TASK_STATUS',  '태스크상태',  '캘린더 태스크 상태'),
        ('TASK_PRIORITY','태스크우선순위','캘린더 태스크 우선순위'),
        ('EVENT_TYPE',   '일정유형',    '캘린더 일정 유형')
      ON CONFLICT (group_code) DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO common_code (code_group_id, code, code_name, sort_order)
      SELECT g.code_group_id, v.code, v.code_name, v.sort_order
      FROM common_code_group g
      JOIN (VALUES
        ('TASK_STATUS',   'TODO',        '예정', 1),
        ('TASK_STATUS',   'IN_PROGRESS', '진행', 2),
        ('TASK_STATUS',   'DONE',        '완료', 3),
        ('TASK_STATUS',   'CANCELLED',   '취소', 4),
        ('TASK_PRIORITY', 'LOW',         '낮음', 1),
        ('TASK_PRIORITY', 'NORMAL',      '보통', 2),
        ('TASK_PRIORITY', 'HIGH',        '높음', 3),
        ('EVENT_TYPE',    'HOLIDAY',     '휴일', 1),
        ('EVENT_TYPE',    'PERSONAL',    '개인', 2),
        ('EVENT_TYPE',    'COMMON',      '공통', 3)
      ) AS v(group_code, code, code_name, sort_order)
        ON v.group_code = g.group_code
      ON CONFLICT (code_group_id, code) DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM common_code
      WHERE code_group_id IN (
        SELECT code_group_id FROM common_code_group
        WHERE group_code IN ('TASK_STATUS', 'TASK_PRIORITY', 'EVENT_TYPE')
      )
    `);
    await queryRunner.query(`
      DELETE FROM common_code_group
      WHERE group_code IN ('TASK_STATUS', 'TASK_PRIORITY', 'EVENT_TYPE')
    `);
  }
}
