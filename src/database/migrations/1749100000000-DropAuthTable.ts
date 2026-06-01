import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// auth 테이블 제거: account 가 정식 사용자 모델로 일원화되어 auth(스캐폴딩 잔재)는 불필요.
export class DropAuthTable1749100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('auth', true);
  }

  // 롤백 시 CreateAuth 와 동일한 구조로 복원한다.
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'auth',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'username', type: 'varchar', isUnique: true },
          { name: 'password', type: 'varchar' },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );
  }
}
