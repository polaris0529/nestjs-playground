import { Controller, Get, Render, Req } from '@nestjs/common';
import { Request } from 'express';
import { AccountService } from './account/account.service';
import { MenuService } from './menu/menu.service';
import { CommonCodeService } from './common-code/common-code.service';

interface AuthUser {
  accountId: number;
  loginId: string;
  roles: string[];
}

@Controller()
export class AppController {
  constructor(
    private readonly accountService: AccountService,
    private readonly menuService: MenuService,
    private readonly commonCodeService: CommonCodeService,
  ) {}

  // 메인 대시보드 (공개). 로그인 상태에서만 통계·내 정보를 노출한다.
  @Get()
  @Render('index')
  async index(@Req() req: Request) {
    const user = req.user as AuthUser | undefined;
    if (!user) {
      return { title: 'WorkFlow' };
    }

    const [accountStats, menuCount, codeStats, me] = await Promise.all([
      this.accountService.getStats(),
      this.menuService.count(),
      this.commonCodeService.getStats(),
      this.accountService.findOne(user.accountId),
    ]);

    return {
      title: 'WorkFlow',
      stats: {
        accountActive: accountStats.active,
        accountTotal: accountStats.total,
        menus: menuCount,
        codeGroups: codeStats.groups,
        codes: codeStats.codes,
      },
      me: {
        accountName: me.accountName,
        roles: (me.roles ?? []).join(', '),
        lastLoginText: me.lastLoginAt
          ? new Date(me.lastLoginAt).toLocaleString('ko-KR')
          : '-',
      },
    };
  }

  // 로그인 페이지 (사이드바 없는 독립 레이아웃)
  @Get('login')
  @Render('login')
  login() {
    return { title: '로그인' };
  }
}
