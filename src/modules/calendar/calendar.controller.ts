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
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import type { AuthenticatedRequest } from '../../shared/types/auth.types';

@ApiTags('캘린더')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('days')
  findDays(@Query() query: CalendarRangeQueryDto) {
    return this.calendarService.findDays(query);
  }

  @Get('events')
  findEvents(
    @Req() req: AuthenticatedRequest,
    @Query() query: CalendarRangeQueryDto,
  ) {
    return this.calendarService.findEvents(req.user.accountId, query);
  }

  @Roles('ADMIN')
  @Patch('days/:date')
  updateDay(
    @Param('date') calendarDate: string,
    @Body() dto: UpdateCalendarDayDto,
  ) {
    return this.calendarService.updateDay(calendarDate, dto);
  }
}
