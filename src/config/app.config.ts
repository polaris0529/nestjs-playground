import {
  getOptionalEnumEnv,
  getOptionalNumberEnv,
  getOptionalStringEnv,
  getRequiredNumberEnv,
  getRequiredStringEnv,
} from './env.config';

const nodeEnvValues = ['development', 'test', 'production'] as const;
const logLevelValues = ['debug', 'log', 'warn', 'error'] as const;

/**
 * 애플리케이션 설정 (Spring의 application.yml / @ConfigurationProperties 역할)
 * ConfigModule.forRoot({ load: [appConfig] }) 로 로드됨.
 */
export default () => ({
  port: getOptionalNumberEnv('SERVER_PORT', 3000),
  env: getOptionalEnumEnv('NODE_ENV', nodeEnvValues, 'development'),
  logLevel: getOptionalEnumEnv('LOG_LEVEL', logLevelValues, 'log'),
  jwt: {
    secret: getRequiredStringEnv('JWT_SECRET'),
    refreshSecret: getRequiredStringEnv('JWT_REFRESH_SECRET'),
    // 만료 시간(초). access 30분 / refresh 7일
    accessExpiresIn: getRequiredNumberEnv('JWT_ACCESS_EXPIRES_IN'),
    refreshExpiresIn: getRequiredNumberEnv('JWT_REFRESH_EXPIRES_IN'),
  },
  cookie: {
    accessName: getOptionalStringEnv('COOKIE_ACCESS_NAME', 'access_token'),
    refreshName: getOptionalStringEnv('COOKIE_REFRESH_NAME', 'refresh_token'),
  },
});
