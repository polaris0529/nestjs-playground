import { Matches } from 'class-validator';
import { DATE_PATTERN } from '../calendar.constants';

export class CalendarRangeQueryDto {
  @Matches(DATE_PATTERN, { message: 'calendar.errors.invalid_date' })
  startDate: string;

  @Matches(DATE_PATTERN, { message: 'calendar.errors.invalid_date' })
  endDate: string;
}
