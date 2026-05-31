import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { LogLevel } from '@nestjs/common';
import { join } from 'path';
import { AppModule } from './app.module';
import hbs = require('hbs');

// LOG_LEVEL 값을 NestJS LogLevel 배열로 변환
// 'log' 이상: log, warn, error / 'debug': 전체 포함 / 'error': 에러만
function resolveLogLevels(level: string): LogLevel[] {
  const levels: Record<string, LogLevel[]> = {
    debug: ['debug', 'verbose', 'log', 'warn', 'error'],
    log:   ['log', 'warn', 'error'],
    warn:  ['warn', 'error'],
    error: ['error'],
  };
  return levels[level] ?? levels['log'];
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  const logLevel = config.get<string>('logLevel', 'log');
  app.useLogger(resolveLogLevels(logLevel));

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
  hbs.registerHelper('eq', (a: unknown, b: unknown) => a === b);
  app.setViewEngine('hbs');

  const port = config.get<number>('port', 3000);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
