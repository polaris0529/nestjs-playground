import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from './config/app.config';
import { typeOrmOptions } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { CommonCodeModule } from './common-code/common-code.module';
import { AccountModule } from './account/account.module';
import { AdminModule } from './admin/admin.module';
import { MenuModule } from './menu/menu.module';
import { AppController } from './app.controller';
import { AdminController } from './admin/admin.controller';
import { LoggerMiddleware } from './shared/middleware/logger.middleware';
import { MenuNavMiddleware } from './shared/middleware/menu-nav.middleware';
import { AuthContextMiddleware } from './shared/middleware/auth-context.middleware';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, load: [appConfig] }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({ ...typeOrmOptions(), autoLoadEntities: true }),
    }),
    AuthModule,
    CommonCodeModule,
    AccountModule,
    AdminModule,
    MenuModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    // SSR 페이지(루트·관리자)에만 적용: 인증 컨텍스트 주입 → 메뉴 트리 주입 순.
    // AuthContextMiddleware 가 먼저 실행되어 req.user 를 채워야 AdminPageGuard 가 동작한다.
    consumer
      .apply(AuthContextMiddleware, MenuNavMiddleware)
      .forRoutes(AppController, AdminController);
  }
}
