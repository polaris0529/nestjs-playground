import {
  buildCalendarDay,
  listCalendarDates,
  normalizeCalendarDate,
  validateTimeRange,
} from './calendar-date.util';

describe('calendar-date.util', () => {
  it('normalizes a valid calendar date when date has yyyy-mm-dd format', () => {
    const result = normalizeCalendarDate('2026-06-22');

    expect(result).toBe('2026-06-22');
  });

  it('rejects an invalid calendar date when day does not exist', () => {
    expect(() => normalizeCalendarDate('2026-02-30')).toThrow(
      'calendar.errors.invalid_date',
    );
  });

  it('lists dates with exclusive end date when range is valid', () => {
    const result = listCalendarDates({
      startDate: '2026-06-22',
      endDate: '2026-06-25',
    });

    expect(result).toEqual(['2026-06-22', '2026-06-23', '2026-06-24']);
  });

  it('builds Korean calendar metadata when date is weekend', () => {
    const result = buildCalendarDay('2026-06-28');

    expect(result).toMatchObject({
      calendarDate: '2026-06-28',
      dayOfWeek: 'SUN',
      isWeekend: true,
      isHoliday: false,
      isWorkday: false,
    });
  });

  it('rejects a time range when start time is after end time', () => {
    expect(() => validateTimeRange('18:00', '09:00')).toThrow(
      'calendar.errors.invalid_time_range',
    );
  });

  it('accepts a time range when start time is before end time', () => {
    expect(() => validateTimeRange('09:00', '18:00')).not.toThrow();
  });

  it('accepts a time range when either bound is missing', () => {
    expect(() => validateTimeRange('09:00', null)).not.toThrow();
    expect(() => validateTimeRange(null, '18:00')).not.toThrow();
    expect(() => validateTimeRange(null, null)).not.toThrow();
  });
});
