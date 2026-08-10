import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../../shared/types/auth.types';

// Passport JWT 전략: 쿠키 또는 Authorization: Bearer <token> 를 검증하고 request.user 를 구성한다.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    // 쿠키명을 config에서 읽어 클로저로 캡처한다. super() 내부라 this 접근 불가.
    const accessCookieName = config.getOrThrow<string>('cookie.accessName');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) =>
          (req?.cookies?.[accessCookieName] as string | undefined) ?? null,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('jwt.secret'),
    });
  }

  validate(payload: JwtPayload) {
    return {
      accountId: payload.sub,
      loginId: payload.loginId,
      roles: payload.roles,
    };
  }
}
