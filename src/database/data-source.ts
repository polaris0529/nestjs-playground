import { config as loadEnv } from 'dotenv';
import { join } from 'path';

// 마이그레이션 CLI 실행 시 루트 .env 로드 (도커 실행 시엔 env 가 주입되어 무시됨)
loadEnv({ path: join(__dirname, '..', '..', '.env') });

import { DataSource } from 'typeorm';
import { typeOrmOptions } from '../config/typeorm.config';

export default new DataSource(typeOrmOptions());
