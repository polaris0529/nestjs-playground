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
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'change-me-refresh-in-env',
    // 만료 시간(초). access 30분 / refresh 7일
    accessExpiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES_IN ?? '1800', 10),
    refreshExpiresIn: parseInt(
      process.env.JWT_REFRESH_EXPIRES_IN ?? '604800',
      10,
    ),
  },
});
