import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { CalendarRangeQueryDto } from './dto/calendar-range-query.dto';
import { UpdateCalendarDayDto } from './dto/update-calendar-day.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles-auth.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import type { AuthenticatedRequest } from '../../shared/types/auth.types';

@ApiTags('캘린더')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  // 공개(무인증): 공통 캘린더 조회 — 공휴일 + 공통 태스크만
  @Get('common-events')
  findCommonEvents(@Query() query: CalendarRangeQueryDto) {
    return this.calendarService.findCommonEvents(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('days')
  findDays(@Query() query: CalendarRangeQueryDto) {
    return this.calendarService.findDays(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('events')
  findEvents(
    @Req() req: AuthenticatedRequest,
    @Query() query: CalendarRangeQueryDto,
  ) {
    return this.calendarService.findEvents(req.user.accountId, query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('days/:date')
  updateDay(
    @Param('date') calendarDate: string,
    @Body() dto: UpdateCalendarDayDto,
  ) {
    return this.calendarService.updateDay(calendarDate, dto);
  }
}
