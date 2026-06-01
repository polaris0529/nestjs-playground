import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { AdminPageGuard } from '../shared/guards/admin-page.guard';

// 관리자 페이지 전체를 ADMIN 전용으로 제한 (비로그인/비관리자는 /login 으로 리다이렉트)
@UseGuards(AdminPageGuard)
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

  // 공통코드 그룹 관리(목록)
  @Get('common-code-group')
  @Render('admin/common-code-group-list')
  commonCodeGroupList() {
    return { title: '공통코드 그룹 관리', page: 'admin-common-code-group' };
  }

  // 공통코드 그룹 생성 페이지
  @Get('common-code-group/new')
  @Render('admin/common-code-group-new')
  commonCodeGroupNew() {
    return { title: '공통코드 그룹 생성', page: 'admin-common-code-group' };
  }

  // 공통코드 관리(목록)
  @Get('common-code')
  @Render('admin/common-code-list')
  commonCodeList() {
    return { title: '공통코드 관리', page: 'admin-common-code' };
  }

  // 공통코드 생성 페이지
  @Get('common-code/new')
  @Render('admin/common-code-new')
  commonCodeNew() {
    return { title: '공통코드 생성', page: 'admin-common-code' };
  }

  // 메뉴 관리(목록)
  @Get('menu')
  @Render('admin/menu-list')
  menuList() {
    return { title: '메뉴 관리', page: 'admin-menu' };
  }

  // 메뉴 생성 페이지
  @Get('menu/new')
  @Render('admin/menu-new')
  menuNew() {
    return { title: '메뉴 생성', page: 'admin-menu' };
  }

  // 계정 관리(목록)
  @Get('account')
  @Render('admin/account-list')
  accountList() {
    return { title: '계정 관리', page: 'admin-account' };
  }

  // 계정 생성 페이지
  @Get('account/new')
  @Render('admin/account-new')
  accountNew() {
    return { title: '계정 생성', page: 'admin-account' };
  }

  // 비밀번호 변경 (셀프)
  @Get('password')
  @Render('admin/password')
  password() {
    return { title: '비밀번호 변경', page: 'admin-password' };
  }
}
