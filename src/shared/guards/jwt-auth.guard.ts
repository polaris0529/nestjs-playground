import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// JWT 인증 가드: 'jwt' 전략(JwtStrategy)으로 Bearer 토큰을 검증한다.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
