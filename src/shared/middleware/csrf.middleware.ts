import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';

// CSRF 방어 (double-submit 토큰):
// - csrf_token 쿠키(비 httpOnly)를 발급한다
// - 변경 요청(POST/PUT/PATCH/DELETE)은 헤더(X-CSRF-Token)가 쿠키와 일치해야 통과
// - 로그인(/api/auth/login)은 세션 부트스트랩이라 예외
@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private static readonly SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];
  private readonly secureCookie: boolean;

  constructor(config: ConfigService) {
    this.secureCookie = config.getOrThrow<string>('env') === 'production';
  }

  use(req: Request, res: Response, next: NextFunction): void {
    let token = req.cookies?.csrf_token as string | undefined;
    if (!token) {
      token = randomBytes(24).toString('hex');
      res.cookie('csrf_token', token, {
        sameSite: 'lax',
        secure: this.secureCookie,
        httpOnly: false,
      });
    }
    if (CsrfMiddleware.SAFE_METHODS.includes(req.method)) return next();
    // 로그인은 세션 부트스트랩이라 CSRF 예외 (originalUrl 기준으로 견고하게 매칭)
    const path = (req.originalUrl || req.url || '').split('?')[0];
    if (path === '/api/auth/login') return next();

    const sent = req.headers['x-csrf-token'] as string | undefined;
    if (!sent || sent !== token) {
      // 미들웨어 단계에서 직접 응답(필터 미경유 가능성 회피)
      res.status(403).json({
        statusCode: 403,
        error: 'Forbidden',
        message: 'CSRF 토큰이 유효하지 않습니다.',
      });
      return;
    }
    next();
  }
}
