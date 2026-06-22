import { Injectable, NotFoundException } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { PersonalTaskRepository } from './personal-task.repository';
import { CreatePersonalTaskDto } from './dto/create-personal-task.dto';
import { UpdatePersonalTaskDto } from './dto/update-personal-task.dto';
import { PersonalTask } from './entities/personal-task.entity';
import { CalendarRangeQueryDto } from './dto/calendar-range-query.dto';
import { validateTimeRange } from './calendar-date.util';

@Injectable()
export class PersonalTaskService {
  constructor(
    private readonly calendarService: CalendarService,
    private readonly personalTaskRepository: PersonalTaskRepository,
  ) {}

  async findByRange(userId: number, query: CalendarRangeQueryDto) {
    await this.calendarService.ensureDays(query);
    return this.personalTaskRepository.findByRange(
      userId,
      query.startDate,
      query.endDate,
    );
  }

  async create(userId: number, dto: CreatePersonalTaskDto) {
    validateTimeRange(dto.startTime, dto.endTime);
    await this.calendarService.ensureDay(dto.calendarDate);
    return this.personalTaskRepository.create({
      ...dto,
      userId,
      status: dto.status,
      priority: dto.priority ?? 'NORMAL',
    });
  }

  async findOne(userId: number, personalTaskId: string) {
    const task = await this.personalTaskRepository.findByIdForUser(
      personalTaskId,
      userId,
    );
    if (!task) {
      throw new NotFoundException('calendar.errors.personal_task_not_found');
    }
    return task;
  }

  async update(
    userId: number,
    personalTaskId: string,
    dto: UpdatePersonalTaskDto,
  ) {
    const existing = await this.findOne(userId, personalTaskId);
    const startTime =
      dto.startTime !== undefined ? dto.startTime : existing.startTime;
    const endTime = dto.endTime !== undefined ? dto.endTime : existing.endTime;
    validateTimeRange(startTime, endTime);
    if (dto.calendarDate) {
      await this.calendarService.ensureDay(dto.calendarDate);
    }

    return this.personalTaskRepository.update(
      personalTaskId,
      this.buildPatch(dto),
    );
  }

  async remove(userId: number, personalTaskId: string) {
    await this.findOne(userId, personalTaskId);
    return this.personalTaskRepository.softRemove(personalTaskId);
  }

  private buildPatch(dto: UpdatePersonalTaskDto): Partial<PersonalTask> {
    const patch: Partial<PersonalTask> = {};
    if (dto.calendarDate !== undefined) patch.calendarDate = dto.calendarDate;
    if (dto.title !== undefined) patch.title = dto.title;
    if (dto.content !== undefined) patch.content = dto.content;
    if (dto.status !== undefined) patch.status = dto.status;
    if (dto.priority !== undefined) patch.priority = dto.priority;
    if (dto.startTime !== undefined) patch.startTime = dto.startTime;
    if (dto.endTime !== undefined) patch.endTime = dto.endTime;
    if (dto.completedAt !== undefined) {
      patch.completedAt = dto.completedAt ? new Date(dto.completedAt) : null;
    }
    if (dto.status === 'DONE' && dto.completedAt === undefined) {
      patch.completedAt = new Date();
    }
    if (dto.status && dto.status !== 'DONE' && dto.completedAt === undefined) {
      patch.completedAt = null;
    }
    return patch;
  }
}
