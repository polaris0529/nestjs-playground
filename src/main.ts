import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { HttpErrorFilter } from './shared/filters/http-error.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import hbs from 'hbs';
import cookieParser from 'cookie-parser';

// LOG_LEVEL 값을 NestJS LogLevel 배열로 변환
// 'log' 이상: log, warn, error / 'debug': 전체 포함 / 'error': 에러만
function resolveLogLevels(level: string): LogLevel[] {
  const levels: Record<string, LogLevel[]> = {
    debug: ['debug', 'verbose', 'log', 'warn', 'error'],
    log: ['log', 'warn', 'error'],
    warn: ['warn', 'error'],
    error: ['error'],
  };
  return levels[level] ?? levels['log'];
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  const logLevel = config.get<string>('logLevel', 'log');
  app.useLogger(resolveLogLevels(logLevel));

  app.use(cookieParser());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
  hbs.registerHelper('eq', (a: unknown, b: unknown) => a === b);
  app.setViewEngine('hbs');

  // 전역 검증 파이프: DTO 의 class-validator 규칙을 모든 요청에 강제 적용
  // whitelist: DTO 에 없는 속성 제거, transform: 타입 자동 변환
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpErrorFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  setupSwagger(app);

  const port = config.get<number>('port', 3000);
  await app.listen(port, '0.0.0.0');
}
void bootstrap();
