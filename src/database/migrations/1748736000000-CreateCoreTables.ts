import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCoreTables1748736000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE common_code_group (
        code_group_id BIGSERIAL PRIMARY KEY,
        group_code    VARCHAR(30)  NOT NULL UNIQUE,
        group_name    VARCHAR(50)  NOT NULL,
        use_yn        CHAR(1)      NOT NULL DEFAULT 'Y',
        created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE common_code (
        code_id       BIGSERIAL PRIMARY KEY,
        code_group_id BIGINT      NOT NULL,
        code          VARCHAR(30) NOT NULL,
        code_name     VARCHAR(50) NOT NULL,
        sort_order    INT         NOT NULL DEFAULT 0,
        use_yn        CHAR(1)     NOT NULL DEFAULT 'Y',
        created_at    TIMESTAMP   NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMP   NOT NULL DEFAULT NOW(),
        CONSTRAINT fk_common_code_group
          FOREIGN KEY (code_group_id) REFERENCES common_code_group(code_group_id),
        CONSTRAINT uk_common_code
          UNIQUE (code_group_id, code)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE account (
        account_id    BIGSERIAL    PRIMARY KEY,
        login_id      VARCHAR(30)  NOT NULL UNIQUE,
        password      VARCHAR(100) NOT NULL,
        account_name  VARCHAR(30)  NOT NULL,
        last_login_at TIMESTAMP    NULL,
        use_yn        CHAR(1)      NOT NULL DEFAULT 'Y',
        created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE account_role (
        account_role_id BIGSERIAL PRIMARY KEY,
        account_id      BIGINT    NOT NULL,
        role_code_id    BIGINT    NOT NULL,
        created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT fk_account_role_account
          FOREIGN KEY (account_id)   REFERENCES account(account_id),
        CONSTRAINT fk_account_role_code
          FOREIGN KEY (role_code_id) REFERENCES common_code(code_id),
        CONSTRAINT uk_account_role
          UNIQUE (account_id, role_code_id)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE account_role`);
    await queryRunner.query(`DROP TABLE account`);
    await queryRunner.query(`DROP TABLE common_code`);
    await queryRunner.query(`DROP TABLE common_code_group`);
  }
}
