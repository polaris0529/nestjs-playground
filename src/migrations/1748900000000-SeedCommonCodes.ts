import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCommonCodes1748900000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 공통코드 그룹 시드: 메뉴/열기방식/사용여부
    await queryRunner.query(`
      INSERT INTO common_code_group (group_code, group_name, description) VALUES
        ('MENU_TYPE', '메뉴유형', '메뉴 종류 구분'),
        ('OPEN_TYPE', '열기방식', '링크 열기 방식'),
        ('USE_YN',    '사용여부', '공통 사용여부 코드')
    `);

    // 그룹별 공통코드 시드 (group_code 로 그룹 id 를 조회해 매핑)
    await queryRunner.query(`
      INSERT INTO common_code (code_group_id, code, code_name, sort_order)
      SELECT g.code_group_id, v.code, v.code_name, v.sort_order
      FROM common_code_group g
      JOIN (VALUES
        ('MENU_TYPE', 'PAGE',   '내부화면', 1),
        ('MENU_TYPE', 'LINK',   '외부링크', 2),
        ('MENU_TYPE', 'FOLDER', '폴더',     3),
        ('OPEN_TYPE', 'SELF',   '현재창',   1),
        ('OPEN_TYPE', 'BLANK',  '새창',     2),
        ('USE_YN',    'Y',      '사용',     1),
        ('USE_YN',    'N',      '미사용',   2)
      ) AS v(group_code, code, code_name, sort_order)
        ON v.group_code = g.group_code
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM common_code
      WHERE code_group_id IN (
        SELECT code_group_id FROM common_code_group
        WHERE group_code IN ('MENU_TYPE', 'OPEN_TYPE', 'USE_YN')
      )
    `);
    await queryRunner.query(`
      DELETE FROM common_code_group
      WHERE group_code IN ('MENU_TYPE', 'OPEN_TYPE', 'USE_YN')
    `);
  }
}
