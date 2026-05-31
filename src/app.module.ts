import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from './config/app.config';
import { typeOrmOptions } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { LoggerMiddleware } from './logger/logger.middleware';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, load: [appConfig] }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({ ...typeOrmOptions(), autoLoadEntities: true }),
    }),
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}