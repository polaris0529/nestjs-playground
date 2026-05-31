import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  index() {
    return { title: 'All-in-One', message: 'hbs SSR 동작 중' };
  }
}
