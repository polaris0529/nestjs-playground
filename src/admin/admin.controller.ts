import { Controller, Get, Render } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  @Get()
  @Render('admin/index')
  index() {
    return { title: '관리자 대시보드', page: 'admin' };
  }

  @Get('role')
  @Render('admin/role')
  role() {
    return { title: 'Role 관리', page: 'admin-role' };
  }
}
