import { Controller, Get, Render, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import { AuthUser } from './shared/types/auth.types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 메인 대시보드 (공개). 로그인 상태에서만 통계·내 정보를 노출한다.
  @Get()
  @Render('index')
  async index(@Req() req: Request) {
    const user = req.user as AuthUser | undefined;
    if (!user) {
      return { title: 'WorkFlow' };
    }
    const dashboard = await this.appService.getDashboard(user.accountId);
    return { title: 'WorkFlow', ...dashboard };
  }

  // 로그인 페이지 (사이드바 없는 독립 레이아웃)
  @Get('login')
  @Render('login')
  login() {
    return { title: '로그인' };
  }
}
