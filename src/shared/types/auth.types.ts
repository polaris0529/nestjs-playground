import type { Request } from 'express';

// 인증 관련 공용 타입 (가드·미들웨어·전략·컨트롤러 공용)
// JWT 페이로드 (access/refresh 공통)
export interface JwtPayload {
  sub: number;
  loginId: string;
  roles: string[];
}

// 요청 컨텍스트에 주입되는 인증 사용자 (req.user)
export interface AuthUser {
  accountId: number;
  loginId: string;
  roles: string[];
}

export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}
