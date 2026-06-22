import { BadRequestException } from '@nestjs/common';
import {
  DATE_PATTERN,
  DAY_OF_WEEK_CODES,
  DayOfWeekCode,
} from './calendar.constants';

export interface CalendarDateRange {
  startDate: string;
  endDate: string;
}

export interface CalendarDaySeed {
  calendarDate: string;
  dayOfWeek: DayOfWeekCode;
  isHoliday: boolean;
  holidayName: string | null;
  isWeekend: boolean;
  isWorkday: boolean;
}

export function normalizeCalendarDate(value: string): string {
  if (!DATE_PATTERN.test(value)) {
    throw new BadRequestException('calendar.errors.invalid_date');
  }

  const date = parseUtcDate(value);
  if (formatUtcDate(date) !== value) {
    throw new BadRequestException('calendar.errors.invalid_date');
  }

  return value;
}

export function listCalendarDates(range: CalendarDateRange): string[] {
  const startDate = normalizeCalendarDate(range.startDate);
  const endDate = normalizeCalendarDate(range.endDate);
  const start = parseUtcDate(startDate);
  const end = parseUtcDate(endDate);

  if (start >= end) {
    throw new BadRequestException('calendar.errors.invalid_range');
  }

  const dates: string[] = [];
  for (
    const cursor = new Date(start);
    cursor < end;
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  ) {
    dates.push(formatUtcDate(cursor));
  }

  if (dates.length > 370) {
    throw new BadRequestException('calendar.errors.range_too_large');
  }

  return dates;
}

export function validateTimeRange(
  startTime: string | null | undefined,
  endTime: string | null | undefined,
): void {
  if (startTime && endTime && startTime > endTime) {
    throw new BadRequestException('calendar.errors.invalid_time_range');
  }
}

export function buildCalendarDay(calendarDate: string): CalendarDaySeed {
  const normalized = normalizeCalendarDate(calendarDate);
  const date = parseUtcDate(normalized);
  const dayIndex = date.getUTCDay();
  const dayOfWeek = DAY_OF_WEEK_CODES[dayIndex];
  const isWeekend = dayIndex === 0 || dayIndex === 6;

  return {
    calendarDate: normalized,
    dayOfWeek,
    isHoliday: false,
    holidayName: null,
    isWeekend,
    isWorkday: !isWeekend,
  };
}

function parseUtcDate(value: string): Date {
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7)) - 1;
  const day = Number(value.slice(8, 10));
  return new Date(Date.UTC(year, month, day));
}

function formatUtcDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
