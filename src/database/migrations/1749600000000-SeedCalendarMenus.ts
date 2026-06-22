import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCalendarMenus1749600000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO menu (parent_menu_id, menu_code, menu_name, menu_url, menu_type, open_type, menu_level, sort_order)
      SELECT p.menu_id, v.menu_code, v.menu_name, v.menu_url, 'PAGE', 'SELF', 2, v.sort_order
      FROM (VALUES
        ('APP_CALENDAR', '캘린더', '/calendar', 3),
        ('APP_ADMIN_CALENDAR', '관리자 캘린더', '/admin/calendar', 4)
      ) AS v(menu_code, menu_name, menu_url, sort_order)
      JOIN menu p ON p.menu_code = 'APP'
      WHERE NOT EXISTS (
        SELECT 1 FROM menu m WHERE m.menu_code = v.menu_code
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM menu WHERE menu_code IN ('APP_CALENDAR', 'APP_ADMIN_CALENDAR')
    `);
  }
}
