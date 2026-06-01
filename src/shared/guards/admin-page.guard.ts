import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

interface AuthUser {
  roles?: string[];
}

// SSR 관리자 페이지 가드.
// - 미인증: /login 으로 (로그인 필요)
// - 로그인했으나 ADMIN 아님: / (홈)으로 — 이미 로그인했으므로 /login 무한 이동 방지
// AuthContextMiddleware 가 먼저 실행되어 req.user 를 채워둔 상태를 전제로 한다.
@Injectable()
export class AdminPageGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const user = req.user as AuthUser | undefined;

    if (user?.roles?.includes('ADMIN')) {
      return true;
    }
    res.redirect(user ? '/' : '/login');
    return false;
  }
}
