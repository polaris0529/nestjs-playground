import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from './shared/types/auth.types';

@Controller('dashboard')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Vue 대시보드 화면에서 사용하는 요약 API
  @UseGuards(JwtAuthGuard)
  @Get('summary')
  async dashboard(@Req() req: AuthenticatedRequest) {
    return this.appService.getDashboard(req.user.accountId);
  }
}
