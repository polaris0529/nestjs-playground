import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { AdminPageGuard } from '../../shared/guards/admin-page.guard';
import { PageAuthGuard } from '../../shared/guards/page-auth.guard';
import type { AuthenticatedRequest } from '../../shared/types/auth.types';

@Controller()
export class CalendarPageController {
  @UseGuards(PageAuthGuard)
  @Get('calendar')
  @Render('calendar')
  calendar(@Req() req: AuthenticatedRequest) {
    return {
      title: '캘린더',
      page: 'calendar',
      isAdmin: req.user.roles.includes('ADMIN'),
      fullCalendarVersion: '6.1.21',
    };
  }

  @UseGuards(AdminPageGuard)
  @Get('admin/calendar')
  @Render('calendar')
  adminCalendar() {
    return {
      title: '관리자 캘린더',
      page: 'admin-calendar',
      isAdmin: true,
      adminMode: true,
      fullCalendarVersion: '6.1.21',
    };
  }
}
