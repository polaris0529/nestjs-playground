import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../types/auth.types';

// 공통 미들웨어: SSR 페이지에서 access 쿠키를 해석해 req.user / res.locals.user 를 채운다.
// access 가 만료됐고 refresh 가 유효하면 새 access 쿠키를 발급(silent refresh)한다.
// 인증을 강제하지 않는다(차단은 가드 책임).
@Injectable()
export class AuthContextMiddleware implements NestMiddleware {
  private readonly accessCookieName: string;
  private readonly refreshCookieName: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    this.accessCookieName =
      config.get<string>('cookie.accessName') ?? 'access_token';
    this.refreshCookieName =
      config.get<string>('cookie.refreshName') ?? 'refresh_token';
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const payload = this.resolveUser(req, res);
    if (payload) {
      const user = {
        accountId: payload.sub,
        loginId: payload.loginId,
        roles: payload.roles,
      };
      req.user = user;
      res.locals.user = user;
    }
    next();
  }

  private resolveUser(req: Request, res: Response): JwtPayload | null {
    const accessToken = req.cookies?.[this.accessCookieName] as
      | string
      | undefined;
    if (accessToken) {
      try {
        return this.jwtService.verify<JwtPayload>(accessToken);
      } catch {
        // 만료/위변조 → refresh 로 재발급 시도
      }
    }

    const refreshToken = req.cookies?.[this.refreshCookieName] as
      | string
      | undefined;
    if (!refreshToken) return null;
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.config.get<string>('jwt.refreshSecret'),
      });
      const newAccess = this.jwtService.sign(
        { sub: payload.sub, loginId: payload.loginId, roles: payload.roles },
        {
          secret: this.config.get<string>('jwt.secret'),
          expiresIn: this.config.get<number>('jwt.accessExpiresIn'),
        },
      );
      res.cookie(this.accessCookieName, newAccess, {
        httpOnly: true,
        sameSite: 'lax',
        secure: this.config.get<string>('env') === 'production',
        maxAge: (this.config.get<number>('jwt.accessExpiresIn') ?? 1800) * 1000,
      });
      return payload;
    } catch {
      return null;
    }
  }
}
