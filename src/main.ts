import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { HttpErrorFilter } from './shared/filters/http-error.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { I18nService } from 'nestjs-i18n';
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

function resolveFrontendDistPath(): string | null {
  const candidates = [
    join(process.cwd(), 'frontend', 'dist'),
    join(__dirname, '..', 'frontend', 'dist'),
    join(__dirname, '..', '..', 'frontend', 'dist'),
  ];
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

function isApiRequest(pathname: string): boolean {
  const apiPrefixes = ['/api', '/api-docs'];
  return apiPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function hasFileExtension(pathname: string): boolean {
  return /\.[^/]+$/.test(pathname);
}

function registerVueFallback(
  app: NestExpressApplication,
  frontendDistPath: string | null,
): void {
  if (!frontendDistPath) return;

  const indexPath = join(frontendDistPath, 'index.html');
  if (!existsSync(indexPath)) return;

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') return next();

    const pathname = (req.originalUrl || req.url || '').split('?')[0];
    const acceptsHtml = req.headers.accept?.includes('text/html') ?? false;
    if (!acceptsHtml || isApiRequest(pathname) || hasFileExtension(pathname)) {
      return next();
    }

    return res.sendFile(indexPath);
  });
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  const logLevel = config.get<string>('logLevel', 'log');
  app.useLogger(resolveLogLevels(logLevel));

  app.use(cookieParser());
  app.setGlobalPrefix('api');

  const frontendDistPath = resolveFrontendDistPath();
  if (frontendDistPath) {
    app.useStaticAssets(frontendDistPath);
  }

  // 전역 검증 파이프: DTO 의 class-validator 규칙을 모든 요청에 강제 적용
  // whitelist: DTO 에 없는 속성 제거, transform: 타입 자동 변환
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpErrorFilter(app.get(I18nService)));
  app.useGlobalInterceptors(new LoggingInterceptor());

  setupSwagger(app);
  registerVueFallback(app, frontendDistPath);

  const port = config.get<number>('port', 3000);
  await app.listen(port, '0.0.0.0');
}
void bootstrap();
