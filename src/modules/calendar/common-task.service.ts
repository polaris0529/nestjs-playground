import { Injectable, NotFoundException } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CommonTaskRepository } from './common-task.repository';
import { CalendarRangeQueryDto } from './dto/calendar-range-query.dto';
import { CreateCommonTaskDto } from './dto/create-common-task.dto';
import { UpdateCommonTaskDto } from './dto/update-common-task.dto';
import { CommonTask } from './entities/common-task.entity';
import { validateTimeRange } from './calendar-date.util';

@Injectable()
export class CommonTaskService {
  constructor(
    private readonly calendarService: CalendarService,
    private readonly commonTaskRepository: CommonTaskRepository,
  ) {}

  async findByRange(query: CalendarRangeQueryDto) {
    await this.calendarService.ensureDays(query);
    return this.commonTaskRepository.findByRange(
      query.startDate,
      query.endDate,
    );
  }

  async create(dto: CreateCommonTaskDto) {
    validateTimeRange(dto.startTime, dto.endTime);
    await this.calendarService.ensureDay(dto.calendarDate);
    return this.commonTaskRepository.create(dto);
  }

  async findOne(commonTaskId: string) {
    const task = await this.commonTaskRepository.findById(commonTaskId);
    if (!task) {
      throw new NotFoundException('calendar.errors.common_task_not_found');
    }
    return task;
  }

  async update(commonTaskId: string, dto: UpdateCommonTaskDto) {
    const existing = await this.findOne(commonTaskId);
    const startTime =
      dto.startTime !== undefined ? dto.startTime : existing.startTime;
    const endTime = dto.endTime !== undefined ? dto.endTime : existing.endTime;
    validateTimeRange(startTime, endTime);
    if (dto.calendarDate) {
      await this.calendarService.ensureDay(dto.calendarDate);
    }
    return this.commonTaskRepository.update(commonTaskId, this.buildPatch(dto));
  }

  async remove(commonTaskId: string) {
    await this.findOne(commonTaskId);
    return this.commonTaskRepository.softRemove(commonTaskId);
  }

  private buildPatch(dto: UpdateCommonTaskDto): Partial<CommonTask> {
    const patch: Partial<CommonTask> = {};
    if (dto.calendarDate !== undefined) patch.calendarDate = dto.calendarDate;
    if (dto.title !== undefined) patch.title = dto.title;
    if (dto.content !== undefined) patch.content = dto.content;
    if (dto.category !== undefined) patch.category = dto.category;
    if (dto.status !== undefined) patch.status = dto.status;
    if (dto.startTime !== undefined) patch.startTime = dto.startTime;
    if (dto.endTime !== undefined) patch.endTime = dto.endTime;
    return patch;
  }
}
