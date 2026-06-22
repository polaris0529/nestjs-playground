import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { PageAuthGuard } from './shared/guards/page-auth.guard';
import type { AuthenticatedRequest } from './shared/types/auth.types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 메인: 공통 일정보드 (공개)
  @Get()
  @Render('index')
  index() {
    return { title: '일정보드' };
  }

  // 대시보드 (로그인 필요) — 통계·내 정보
  @UseGuards(PageAuthGuard)
  @Get('dashboard')
  @Render('dashboard')
  async dashboard(@Req() req: AuthenticatedRequest) {
    const dashboard = await this.appService.getDashboard(req.user.accountId);
    return { title: '대시보드', ...dashboard };
  }

  // 소개 페이지 (공개)
  @Get('about')
  @Render('about')
  about() {
    return { title: '소개' };
  }

  // 로그인 페이지 (사이드바 없는 독립 레이아웃)
  @Get('login')
  @Render('login')
  login() {
    return { title: '로그인' };
  }
}
