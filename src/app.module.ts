import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule, HeaderResolver } from 'nestjs-i18n';
import { join } from 'path';
import appConfig from './config/app.config';
import { typeOrmOptions } from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { CommonCodeModule } from './modules/common-code/common-code.module';
import { AccountModule } from './modules/account/account.module';
import { MenuModule } from './modules/menu/menu.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './shared/middleware/logger.middleware';
import { CsrfMiddleware } from './shared/middleware/csrf.middleware';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, load: [appConfig] }),
    // 다국어(i18n): 기본 한국어, Accept-Language 헤더로 언어 결정.
    // 번역 파일은 src/i18n/<lang>/*.json (빌드 시 dist/i18n 로 복사됨).
    I18nModule.forRoot({
      fallbackLanguage: 'ko',
      loaderOptions: { path: join(__dirname, 'i18n'), watch: true },
      resolvers: [new HeaderResolver(['accept-language'])],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({ ...typeOrmOptions(), autoLoadEntities: true }),
    }),
    AuthModule,
    CommonCodeModule,
    AccountModule,
    MenuModule,
    CalendarModule,
    MetricsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // CSRF 토큰 발급/검증은 모든 경로에 적용
    consumer.apply(LoggerMiddleware, CsrfMiddleware).forRoutes('*');
  }
}
