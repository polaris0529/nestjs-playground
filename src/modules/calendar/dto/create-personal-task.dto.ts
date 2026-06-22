import {
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import {
  DATE_PATTERN,
  TASK_PRIORITIES,
  TASK_STATUSES,
  TIME_PATTERN,
} from '../calendar.constants';
import type { TaskPriority, TaskStatus } from '../calendar.constants';

export class CreatePersonalTaskDto {
  @Matches(DATE_PATTERN, { message: 'calendar.errors.invalid_date' })
  calendarDate: string;

  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  content?: string | null;

  @IsIn(TASK_STATUSES)
  status: TaskStatus;

  @IsOptional()
  @IsIn(TASK_PRIORITIES)
  priority?: TaskPriority | null;

  @IsOptional()
  @Matches(TIME_PATTERN, { message: 'calendar.errors.invalid_time' })
  startTime?: string | null;

  @IsOptional()
  @Matches(TIME_PATTERN, { message: 'calendar.errors.invalid_time' })
  endTime?: string | null;
}
