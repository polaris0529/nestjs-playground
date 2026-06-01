import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

interface JwtPayload {
  sub: number;
  loginId: string;
  roles: string[];
}

// 공통 미들웨어: SSR 페이지에서 access_token 쿠키를 해석해 req.user / res.locals.user 를 채운다.
// 인증을 강제하지 않는다(차단은 가드 책임). 헤더의 로그인/로그아웃 표시에 사용된다.
@Injectable()
export class AuthContextMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const token = req.cookies?.access_token as string | undefined;
    if (token) {
      try {
        const payload = this.jwtService.verify<JwtPayload>(token);
        const user = {
          accountId: payload.sub,
          loginId: payload.loginId,
          roles: payload.roles,
        };
        req.user = user;
        res.locals.user = user;
      } catch {
        // 만료/위변조 토큰은 비로그인으로 취급
      }
    }
    next();
  }
}
