import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  index() {
    return { title: 'WorkFlow', message: 'WorkFlow 대시보드' };
  }

  // 로그인 페이지 (사이드바 없는 독립 레이아웃)
  @Get('login')
  @Render('login')
  login() {
    return { title: '로그인' };
  }
}
