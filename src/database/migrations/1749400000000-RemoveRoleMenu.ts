import { MigrationInterface, QueryRunner } from 'typeorm';

// 레거시 'Role 관리'(/admin/role) 페이지 제거에 따라 해당 메뉴(APP_ROLE)를 삭제한다.
// (이미 SeedMenus 로 생성된 기존 DB 정리용)
export class RemoveRoleMenu1749400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM menu WHERE menu_code = 'APP_ROLE'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO menu (parent_menu_id, menu_code, menu_name, menu_url, menu_type, open_type, menu_level, sort_order)
      SELECT p.menu_id, 'APP_ROLE', 'Role 관리', '/admin/role', 'PAGE', 'SELF', 2, 6
      FROM menu p WHERE p.menu_code = 'APP'
    `);
  }
}
