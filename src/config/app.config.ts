/**
 * 애플리케이션 설정 (Spring의 application.yml / @ConfigurationProperties 역할)
 * ConfigModule.forRoot({ load: [appConfig] }) 로 로드됨.
 */
export default () => ({
  port: parseInt(process.env.SERVER_PORT ?? '3000', 10),
  env: process.env.NODE_ENV ?? 'development',
  logLevel: process.env.LOG_LEVEL ?? 'log',
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-me-in-env',
    // 만료 시간(초). 기본 86400 = 1일
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN ?? '86400', 10),
  },
});
