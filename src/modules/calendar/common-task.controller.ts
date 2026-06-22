import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonTaskService } from './common-task.service';
import { CalendarRangeQueryDto } from './dto/calendar-range-query.dto';
import { CreateCommonTaskDto } from './dto/create-common-task.dto';
import { UpdateCommonTaskDto } from './dto/update-common-task.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';

@ApiTags('공통 태스크')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('calendar/common-tasks')
export class CommonTaskController {
  constructor(private readonly commonTaskService: CommonTaskService) {}

  @Get()
  findByRange(@Query() query: CalendarRangeQueryDto) {
    return this.commonTaskService.findByRange(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commonTaskService.findOne(id);
  }

  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateCommonTaskDto) {
    return this.commonTaskService.create(dto);
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCommonTaskDto) {
    return this.commonTaskService.update(id, dto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commonTaskService.remove(id);
  }
}
