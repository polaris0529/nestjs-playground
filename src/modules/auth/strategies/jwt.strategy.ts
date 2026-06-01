import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../../shared/types/auth.types';

// 쿠키(access_token)에서 토큰을 추출한다. SSR 페이지 이동 시 Authorization 헤더가 없으므로 쿠키 우선.
function cookieExtractor(req: Request): string | null {
  return (req?.cookies?.access_token as string | undefined) ?? null;
}

// Passport JWT 전략: 쿠키 또는 Authorization: Bearer <token> 를 검증하고 request.user 를 구성한다.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.secret') ?? 'change-me-in-env',
    });
  }

  // 반환값이 request.user 에 주입된다.
  validate(payload: JwtPayload) {
    return {
      accountId: payload.sub,
      loginId: payload.loginId,
      roles: payload.roles,
    };
  }
}
