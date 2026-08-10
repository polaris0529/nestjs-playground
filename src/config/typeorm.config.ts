import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
import { getRequiredStringEnv } from './env.config';

/**
 * TypeORM 연결 옵션 (앱 런타임 + 마이그레이션 CLI 공용)
 * DATABASE_URL 환경변수(PostgreSQL 연결 문자열) 기반.
 */
export const typeOrmOptions = (): DataSourceOptions => ({
  type: 'postgres',
  url: getRequiredStringEnv('DATABASE_URL'),
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, '..', 'database', 'migrations', '*.{ts,js}')],
  synchronize: false,
});
