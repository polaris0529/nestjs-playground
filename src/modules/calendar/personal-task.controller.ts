import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PersonalTaskService } from './personal-task.service';
import { CalendarRangeQueryDto } from './dto/calendar-range-query.dto';
import { CreatePersonalTaskDto } from './dto/create-personal-task.dto';
import { UpdatePersonalTaskDto } from './dto/update-personal-task.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../../shared/types/auth.types';

@ApiTags('개인 태스크')
@UseGuards(JwtAuthGuard)
@Controller('calendar')
export class PersonalTaskController {
  constructor(private readonly personalTaskService: PersonalTaskService) {}

  @Get('personal-tasks')
  findByRange(
    @Req() req: AuthenticatedRequest,
    @Query() query: CalendarRangeQueryDto,
  ) {
    return this.personalTaskService.findByRange(req.user.accountId, query);
  }

  @Get('personal-tasks/:id')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.personalTaskService.findOne(req.user.accountId, id);
  }

  @Post('personal-tasks')
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreatePersonalTaskDto) {
    return this.personalTaskService.create(req.user.accountId, dto);
  }

  @Patch('personal-tasks/:id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdatePersonalTaskDto,
  ) {
    return this.personalTaskService.update(req.user.accountId, id, dto);
  }

  @Delete('personal-tasks/:id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.personalTaskService.remove(req.user.accountId, id);
  }
}
