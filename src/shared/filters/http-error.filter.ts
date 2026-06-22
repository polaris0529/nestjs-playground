import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nErrorMessage } from '../types/i18n-message';

// 전역 예외 필터: 모든 예외를 통일 JSON 으로 변환하고, 메시지를 요청 언어로 번역한다.
// - 메시지가 i18n 키(예: 'auth.errors.invalid_credentials')면 번역
// - 키가 아닌 일반 문자열이면 그대로 통과(기존 메시지 호환)
// - { key, args } 객체면 인자와 함께 번역, 배열(검증 메시지)이면 각 항목 번역
@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    if (res.headersSent) {
      return;
    }
    const lang = I18nContext.current(host)?.lang;

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let rawMessage: unknown = 'common.errors.internal';
    let error = HttpStatus[status] ?? 'Error';
    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      if (typeof body === 'string') {
        rawMessage = body;
      } else if (body && typeof body === 'object') {
        const b = body as {
          message?: unknown;
          error?: string;
          key?: string;
          args?: Record<string, unknown>;
        };
        // throw new X({ key, args }) 형태 (파라미터 번역)
        if (typeof b.key === 'string') {
          rawMessage = { key: b.key, args: b.args };
        } else if (b.message !== undefined) {
          rawMessage = b.message;
        }
        if (b.error) error = b.error;
      }
    }

    res.status(status).json({
      statusCode: status,
      error,
      message: this.translate(rawMessage, lang),
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }

  private translate(message: unknown, lang?: string): string | string[] {
    if (Array.isArray(message)) {
      return message.map((m) => this.translateOne(m, lang));
    }
    return this.translateOne(message, lang);
  }

  private translateOne(message: unknown, lang?: string): string {
    // { key, args } 형태 — 파라미터 포함 번역
    if (
      message &&
      typeof message === 'object' &&
      typeof (message as I18nErrorMessage).key === 'string'
    ) {
      const m = message as I18nErrorMessage;
      return this.i18n.translate(m.key, { lang, args: m.args });
    }
    // 문자열 — i18n 키면 번역, 아니면 원문 그대로 반환(키 미존재 시 입력값 반환)
    if (typeof message === 'string') {
      return this.i18n.translate(message, { lang });
    }
    return String(message);
  }
}
