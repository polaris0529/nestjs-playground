import {
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import {
  DATE_PATTERN,
  TASK_STATUSES,
  TIME_PATTERN,
} from '../calendar.constants';
import type { TaskStatus } from '../calendar.constants';

export class CreateCommonTaskDto {
  @Matches(DATE_PATTERN, { message: 'calendar.errors.invalid_date' })
  calendarDate: string;

  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  content?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string | null;

  @IsIn(TASK_STATUSES)
  status: TaskStatus;

  @IsOptional()
  @Matches(TIME_PATTERN, { message: 'calendar.errors.invalid_time' })
  startTime?: string | null;

  @IsOptional()
  @Matches(TIME_PATTERN, { message: 'calendar.errors.invalid_time' })
  endTime?: string | null;
}
