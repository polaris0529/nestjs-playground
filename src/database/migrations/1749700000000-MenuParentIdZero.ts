import { MigrationInterface, QueryRunner } from 'typeorm';

export class MenuParentIdZero1749700000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    // 자기참조 FK 제약 제거 (0은 유효한 menu_id가 아니므로 제약 유지 불가)
    await queryRunner.query(`
      ALTER TABLE menu DROP CONSTRAINT IF EXISTS fk_menu_parent
    `);

    // 기존 NULL 값을 0(최상위 루트 마커)으로 교체
    await queryRunner.query(`
      UPDATE menu SET parent_menu_id = 0 WHERE parent_menu_id IS NULL
    `);

    // 컬럼을 NOT NULL DEFAULT 0 으로 변경
    await queryRunner.query(`
      ALTER TABLE menu
        ALTER COLUMN parent_menu_id SET NOT NULL,
        ALTER COLUMN parent_menu_id SET DEFAULT 0
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE menu
        ALTER COLUMN parent_menu_id DROP NOT NULL,
        ALTER COLUMN parent_menu_id DROP DEFAULT
    `);

    await queryRunner.query(`
      UPDATE menu SET parent_menu_id = NULL WHERE parent_menu_id = 0
    `);

    await queryRunner.query(`
      ALTER TABLE menu
        ADD CONSTRAINT fk_menu_parent
          FOREIGN KEY (parent_menu_id) REFERENCES menu(menu_id)
    `);
  }
}
