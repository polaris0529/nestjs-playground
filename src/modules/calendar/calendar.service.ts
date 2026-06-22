import { Injectable, NotFoundException } from '@nestjs/common';
import { CalendarRepository } from './calendar.repository';
import { PersonalTaskRepository } from './personal-task.repository';
import { CommonTaskRepository } from './common-task.repository';
import { CalendarRangeQueryDto } from './dto/calendar-range-query.dto';
import { UpdateCalendarDayDto } from './dto/update-calendar-day.dto';
import { CalendarDay } from './entities/calendar-day.entity';
import { CommonTask } from './entities/common-task.entity';
import { PersonalTask } from './entities/personal-task.entity';
import {
  buildCalendarDay,
  listCalendarDates,
  normalizeCalendarDate,
} from './calendar-date.util';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay: boolean;
  classNames: string[];
  extendedProps: {
    type: 'HOLIDAY' | 'PERSONAL' | 'COMMON';
    status?: string;
    priority?: string | null;
    category?: string | null;
    content?: string | null;
  };
}

@Injectable()
export class CalendarService {
  constructor(
    private readonly calendarRepository: CalendarRepository,
    private readonly personalTaskRepository: PersonalTaskRepository,
    private readonly commonTaskRepository: CommonTaskRepository,
  ) {}

  async findDays(query: CalendarRangeQueryDto): Promise<CalendarDay[]> {
    await this.ensureDays(query);
    return this.calendarRepository.findByRange(query.startDate, query.endDate);
  }

  async ensureDay(calendarDate: string): Promise<CalendarDay> {
    const normalized = normalizeCalendarDate(calendarDate);
    const found = await this.calendarRepository.findByDate(normalized);
    if (found) {
      return found;
    }

    const saved = await this.calendarRepository.saveMany([
      buildCalendarDay(normalized),
    ]);
    return saved[0];
  }

  async ensureDays(range: CalendarRangeQueryDto): Promise<void> {
    const dates = listCalendarDates(range);
    const existing = await this.calendarRepository.findByRange(
      range.startDate,
      range.endDate,
    );
    const existingDates = new Set(existing.map((day) => day.calendarDate));
    const missing = dates
      .filter((date) => !existingDates.has(date))
      .map((date) => buildCalendarDay(date));

    if (missing.length > 0) {
      await this.calendarRepository.saveMany(missing);
    }
  }

  async updateDay(calendarDate: string, dto: UpdateCalendarDayDto) {
    const day = await this.ensureDay(calendarDate);
    const isHoliday = dto.isHoliday ?? day.isHoliday;
    const isWorkday = dto.isWorkday ?? (!day.isWeekend && !isHoliday);
    const holidayName =
      dto.holidayName === undefined ? day.holidayName : dto.holidayName || null;
    const updated = await this.calendarRepository.update(day.calendarDate, {
      isHoliday,
      isWorkday,
      holidayName,
    });

    if (!updated) {
      throw new NotFoundException('calendar.errors.day_not_found');
    }
    return updated;
  }

  async findEvents(
    userId: number,
    query: CalendarRangeQueryDto,
  ): Promise<CalendarEvent[]> {
    await this.ensureDays(query);
    const days = await this.calendarRepository.findByRange(
      query.startDate,
      query.endDate,
    );
    const personalTasks = await this.personalTaskRepository.findByRange(
      userId,
      query.startDate,
      query.endDate,
    );
    const commonTasks = await this.commonTaskRepository.findByRange(
      query.startDate,
      query.endDate,
    );

    return [
      ...days
        .filter((day) => day.isHoliday)
        .map((day) => this.holidayEvent(day)),
      ...commonTasks.map((task) => this.commonTaskEvent(task)),
      ...personalTasks.map((task) => this.personalTaskEvent(task)),
    ];
  }

  private holidayEvent(day: CalendarDay): CalendarEvent {
    return {
      id: `holiday:${day.calendarDate}`,
      title: day.holidayName ?? '공휴일',
      start: day.calendarDate,
      allDay: true,
      classNames: ['calendar-event-holiday'],
      extendedProps: {
        type: 'HOLIDAY',
        content: day.holidayName,
      },
    };
  }

  private personalTaskEvent(task: PersonalTask): CalendarEvent {
    return {
      id: `personal:${task.personalTaskId}`,
      title: task.title,
      start: eventDateTime(task.calendarDate, task.startTime),
      end: eventEndTime(task.calendarDate, task.endTime),
      allDay: !task.startTime,
      classNames: [`calendar-event-personal`, `calendar-status-${task.status}`],
      extendedProps: {
        type: 'PERSONAL',
        status: task.status,
        priority: task.priority,
        content: task.content,
      },
    };
  }

  private commonTaskEvent(task: CommonTask): CalendarEvent {
    return {
      id: `common:${task.commonTaskId}`,
      title: task.title,
      start: eventDateTime(task.calendarDate, task.startTime),
      end: eventEndTime(task.calendarDate, task.endTime),
      allDay: !task.startTime,
      classNames: [`calendar-event-common`, `calendar-status-${task.status}`],
      extendedProps: {
        type: 'COMMON',
        status: task.status,
        category: task.category,
        content: task.content,
      },
    };
  }
}

function eventDateTime(calendarDate: string, time: string | null): string {
  return time ? `${calendarDate}T${time}` : calendarDate;
}

function eventEndTime(
  calendarDate: string,
  time: string | null,
): string | undefined {
  return time ? `${calendarDate}T${time}` : undefined;
}
