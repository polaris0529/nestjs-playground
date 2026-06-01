import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

// 기본 관리자 계정 시드: appadmin / arbals0529^^! (bcrypt 해시 저장) + ADMIN 역할 부여
export class SeedDefaultAdmin1749300000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const passwordHash = await bcrypt.hash('arbals0529^^!', 10);

    await queryRunner.query(
      `INSERT INTO account (login_id, password, account_name, use_yn)
       VALUES ('appadmin', $1, '관리자', 'Y')`,
      [passwordHash],
    );

    // appadmin 계정에 ROLE_TYPE/ADMIN 역할 연결
    await queryRunner.query(`
      INSERT INTO account_role (account_id, role_code_id)
      SELECT a.account_id, c.code_id
      FROM account a
      JOIN common_code c ON c.code = 'ADMIN'
      JOIN common_code_group g
        ON g.code_group_id = c.code_group_id AND g.group_code = 'ROLE_TYPE'
      WHERE a.login_id = 'appadmin'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM account_role
      WHERE account_id = (SELECT account_id FROM account WHERE login_id = 'appadmin')
    `);
    await queryRunner.query(`DELETE FROM account WHERE login_id = 'appadmin'`);
  }
}
