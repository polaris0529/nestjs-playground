import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';

interface AuthUser {
  accountId: number;
  loginId: string;
  roles: string[];
}

// 역할 기반 인가 가드: @Roles 로 지정한 역할을 토큰의 roles 가 하나라도 포함해야 통과.
// JwtAuthGuard 이후에 동작하므로 request.user 가 채워져 있다.
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as AuthUser | undefined;
    return required.some((role) => user?.roles?.includes(role));
  }
}
