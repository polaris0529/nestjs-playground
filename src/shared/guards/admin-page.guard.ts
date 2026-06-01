import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

interface AuthUser {
  roles?: string[];
}

// SSR 관리자 페이지 가드: ADMIN 이 아니면 /login 으로 리다이렉트한다.
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
    res.redirect('/login');
    return false;
  }
}
