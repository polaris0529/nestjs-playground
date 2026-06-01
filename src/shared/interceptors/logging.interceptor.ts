import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// 로깅 인터셉터: 컨트롤러 핸들러 실행 시간을 측정해 로그로 남긴다.
// 응답 본문은 변형하지 않으므로 기존 API/SSR 동작에 영향이 없다.
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Handler');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const handler = `${context.getClass().name}.${context.getHandler().name}`;
    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - startedAt;
        this.logger.log(
          `${req.method} ${req.originalUrl} → ${handler} (${ms}ms)`,
        );
      }),
    );
  }
}
