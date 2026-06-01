import { Injectable } from '@nestjs/common';
import { AccountService } from './modules/account/account.service';
import { MenuService } from './modules/menu/menu.service';
import { CommonCodeService } from './modules/common-code/common-code.service';

// Application 계층: 메인 대시보드용 데이터를 여러 도메인 서비스에서 모아 조립한다.
// (표현 계층인 컨트롤러는 이 결과를 렌더링만 한다.)
@Injectable()
export class AppService {
  constructor(
    private readonly accountService: AccountService,
    private readonly menuService: MenuService,
    private readonly commonCodeService: CommonCodeService,
  ) {}

  async getDashboard(accountId: number) {
    const [accountStats, menuCount, codeStats, me] = await Promise.all([
      this.accountService.getStats(),
      this.menuService.count(),
      this.commonCodeService.getStats(),
      this.accountService.findOne(accountId),
    ]);

    return {
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
}
