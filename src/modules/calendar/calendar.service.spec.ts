import { CalendarService } from './calendar.service';

describe('CalendarService', () => {
  let service: CalendarService;
  let calendarRepository: {
    findByDate: jest.Mock;
    findByRange: jest.Mock;
    saveMany: jest.Mock;
    update: jest.Mock;
  };
  let personalTaskRepository: { findByRange: jest.Mock };
  let commonTaskRepository: { findByRange: jest.Mock };

  beforeEach(() => {
    calendarRepository = {
      findByDate: jest.fn(),
      findByRange: jest.fn().mockResolvedValue([]),
      saveMany: jest.fn().mockResolvedValue([]),
      update: jest
        .fn()
        .mockImplementation((date: string, patch: object) =>
          Promise.resolve({ calendarDate: date, ...patch }),
        ),
    };
    personalTaskRepository = { findByRange: jest.fn().mockResolvedValue([]) };
    commonTaskRepository = { findByRange: jest.fn().mockResolvedValue([]) };
    service = new CalendarService(
      calendarRepository as never,
      personalTaskRepository as never,
      commonTaskRepository as never,
    );
  });

  it('clears the workday flag when a weekday is marked as holiday', async () => {
    calendarRepository.findByDate.mockResolvedValue({
      calendarDate: '2026-06-22',
      isWeekend: false,
      isHoliday: false,
      holidayName: null,
    });

    await service.updateDay('2026-06-22', {
      isHoliday: true,
      holidayName: '임시공휴일',
    });

    expect(calendarRepository.update).toHaveBeenCalledWith('2026-06-22', {
      isHoliday: true,
      isWorkday: false,
      holidayName: '임시공휴일',
    });
  });

  it('merges holiday, common, and personal tasks into calendar events', async () => {
    calendarRepository.findByRange.mockResolvedValue([
      {
        calendarDate: '2026-06-22',
        isHoliday: true,
        holidayName: '제헌절',
      },
    ]);
    commonTaskRepository.findByRange.mockResolvedValue([
      {
        commonTaskId: 'c1',
        calendarDate: '2026-06-22',
        title: '서버 점검',
        status: 'TODO',
        category: 'OPS',
        content: null,
        startTime: null,
        endTime: null,
      },
    ]);
    personalTaskRepository.findByRange.mockResolvedValue([
      {
        personalTaskId: 'p1',
        calendarDate: '2026-06-22',
        title: '회의',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        content: null,
        startTime: '09:00',
        endTime: '10:00',
      },
    ]);

    const events = await service.findEvents(1, {
      startDate: '2026-06-22',
      endDate: '2026-06-23',
    });

    expect(events.map((e) => e.extendedProps.type)).toEqual([
      'HOLIDAY',
      'COMMON',
      'PERSONAL',
    ]);
    const personal = events.find((e) => e.extendedProps.type === 'PERSONAL');
    expect(personal).toMatchObject({
      start: '2026-06-22T09:00',
      end: '2026-06-22T10:00',
      allDay: false,
      classNames: ['calendar-event-personal', 'calendar-status-IN_PROGRESS'],
    });
  });
});
