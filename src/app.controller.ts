import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  index() {
    return { title: 'WorkFlow', message: 'WorkFlow 대시보드' };
  }
}
