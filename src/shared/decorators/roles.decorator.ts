import { SetMetadata } from '@nestjs/common';

// 라우트 핸들러에 허용 역할을 지정한다. 예: @Roles('ADMIN')
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
