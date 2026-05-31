/**
 * 애플리케이션 설정 (Spring의 application.yml / @ConfigurationProperties 역할)
 * ConfigModule.forRoot({ load: [appConfig] }) 로 로드됨.
 */
export default () => ({
  port: parseInt(process.env.SERVER_PORT ?? '3000', 10),
  env: process.env.NODE_ENV ?? 'development',
  logLevel: process.env.LOG_LEVEL ?? 'log',
});
