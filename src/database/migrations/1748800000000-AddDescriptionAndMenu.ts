import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDescriptionAndMenu1748800000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE common_code_group
        ADD COLUMN description VARCHAR(200) NULL
    `);

    await queryRunner.query(`
      ALTER TABLE common_code
        ADD COLUMN description VARCHAR(200) NULL
    `);

    await queryRunner.query(`
      CREATE TABLE menu (
        menu_id        BIGSERIAL    PRIMARY KEY,
        parent_menu_id BIGINT       NULL,
        menu_code      VARCHAR(30)  NOT NULL UNIQUE,
        menu_name      VARCHAR(50)  NOT NULL,
        menu_url       VARCHAR(200) NULL,
        menu_type      VARCHAR(30)  NOT NULL,
        open_type      VARCHAR(30)  NULL,
        menu_level     INT          NOT NULL DEFAULT 1,
        sort_order     INT          NOT NULL DEFAULT 0,
        use_yn         CHAR(1)      NOT NULL DEFAULT 'Y',
        delete_yn      CHAR(1)      NOT NULL DEFAULT 'N',
        created_by     BIGINT       NULL,
        updated_by     BIGINT       NULL,
        created_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
        updated_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
        CONSTRAINT fk_menu_parent
          FOREIGN KEY (parent_menu_id) REFERENCES menu(menu_id),
        CONSTRAINT fk_menu_created_by
          FOREIGN KEY (created_by) REFERENCES account(account_id),
        CONSTRAINT fk_menu_updated_by
          FOREIGN KEY (updated_by) REFERENCES account(account_id)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE menu`);
    await queryRunner.query(`ALTER TABLE common_code DROP COLUMN description`);
    await queryRunner.query(
      `ALTER TABLE common_code_group DROP COLUMN description`,
    );
  }
}
