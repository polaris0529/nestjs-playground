import { CommonTaskService } from './common-task.service';

describe('CommonTaskService', () => {
  let service: CommonTaskService;
  let calendarService: { ensureDay: jest.Mock; ensureDays: jest.Mock };
  let repository: {
    create: jest.Mock;
    findById: jest.Mock;
    update: jest.Mock;
    softRemove: jest.Mock;
  };

  beforeEach(() => {
    calendarService = {
      ensureDay: jest.fn().mockResolvedValue(undefined),
      ensureDays: jest.fn().mockResolvedValue(undefined),
    };
    repository = {
      create: jest.fn().mockImplementation((task) => Promise.resolve(task)),
      findById: jest.fn(),
      update: jest
        .fn()
        .mockImplementation((_id, patch) => Promise.resolve(patch)),
      softRemove: jest.fn(),
    };
    service = new CommonTaskService(
      calendarService as never,
      repository as never,
    );
  });

  it('rejects creation when start time is after end time', async () => {
    await expect(
      service.create({
        calendarDate: '2026-06-22',
        title: '점검',
        status: 'TODO',
        startTime: '18:00',
        endTime: '09:00',
      }),
    ).rejects.toThrow('calendar.errors.invalid_time_range');
  });

  it('throws not found when the task is missing on update', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.update('missing', { title: '변경' })).rejects.toThrow(
      'calendar.errors.common_task_not_found',
    );
  });

  it('rejects update when merged time range is invalid', async () => {
    repository.findById.mockResolvedValue({
      commonTaskId: 'task-1',
      startTime: '08:00',
      endTime: '18:00',
    });

    await expect(
      service.update('task-1', { startTime: '19:00' }),
    ).rejects.toThrow('calendar.errors.invalid_time_range');
  });
});
