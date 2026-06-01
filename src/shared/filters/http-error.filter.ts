import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

// 전역 예외 필터: 모든 예외를 통일된 JSON 응답으로 변환한다.
// (SSR 페이지는 가드가 리다이렉트로 처리하므로 일반적으로 여기 도달하지 않는다.)
@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[] = '서버 오류가 발생했습니다.';
    let error = HttpStatus[status] ?? 'Error';
    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else if (body && typeof body === 'object') {
        const b = body as { message?: string | string[]; error?: string };
        if (b.message) message = b.message;
        if (b.error) error = b.error;
      }
    }

    res.status(status).json({
      statusCode: status,
      error,
      message,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
