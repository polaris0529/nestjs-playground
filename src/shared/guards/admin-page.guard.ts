import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from '../types/auth.types';

@Injectable()
export class AdminPageGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as AuthUser | undefined;

    if (user?.roles?.includes('ADMIN')) {
      return true;
    }
    throw new ForbiddenException('admin.errors.access_denied');
  }
}
