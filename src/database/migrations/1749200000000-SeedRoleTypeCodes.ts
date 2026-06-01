import { MigrationInterface, QueryRunner } from 'typeorm';

// 역할 공통코드 시드: ROLE_TYPE 그룹 + 관리자(ADMIN) / 일반유저(USER)
export class SeedRoleTypeCodes1749200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO common_code_group (group_code, group_name, description) VALUES
        ('ROLE_TYPE', '역할유형', '계정 권한 구분')
    `);

    await queryRunner.query(`
      INSERT INTO common_code (code_group_id, code, code_name, sort_order)
      SELECT g.code_group_id, v.code, v.code_name, v.sort_order
      FROM common_code_group g
      JOIN (VALUES
        ('ADMIN', '관리자',   1),
        ('USER',  '일반유저', 2)
      ) AS v(code, code_name, sort_order) ON g.group_code = 'ROLE_TYPE'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM common_code
      WHERE code_group_id = (SELECT code_group_id FROM common_code_group WHERE group_code = 'ROLE_TYPE')
    `);
    await queryRunner.query(
      `DELETE FROM common_code_group WHERE group_code = 'ROLE_TYPE'`,
    );
  }
}
