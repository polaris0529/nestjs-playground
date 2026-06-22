import { PersonalTaskService } from './personal-task.service';

describe('PersonalTaskService', () => {
  let service: PersonalTaskService;
  let calendarService: { ensureDay: jest.Mock; ensureDays: jest.Mock };
  let repository: {
    create: jest.Mock;
    findByIdForUser: jest.Mock;
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
      findByIdForUser: jest.fn(),
      update: jest
        .fn()
        .mockImplementation((_id, patch) => Promise.resolve(patch)),
      softRemove: jest.fn(),
    };
    service = new PersonalTaskService(
      calendarService as never,
      repository as never,
    );
  });

  it('rejects creation when start time is after end time', async () => {
    await expect(
      service.create(1, {
        calendarDate: '2026-06-22',
        title: '회의',
        status: 'TODO',
        startTime: '18:00',
        endTime: '09:00',
      }),
    ).rejects.toThrow('calendar.errors.invalid_time_range');
  });

  it('defaults priority to NORMAL on creation', async () => {
    await service.create(1, {
      calendarDate: '2026-06-22',
      title: '회의',
      status: 'TODO',
    });

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 1, priority: 'NORMAL' }),
    );
  });

  it('stamps completedAt when status becomes DONE', async () => {
    repository.findByIdForUser.mockResolvedValue({
      personalTaskId: 'task-1',
      userId: 1,
    });

    await service.update(1, 'task-1', { status: 'DONE' });

    const calls = repository.update.mock.calls as [
      string,
      Record<string, unknown>,
    ][];
    expect(calls[0][1].completedAt).toBeInstanceOf(Date);
  });

  it('clears completedAt when status moves away from DONE', async () => {
    repository.findByIdForUser.mockResolvedValue({
      personalTaskId: 'task-1',
      userId: 1,
    });

    await service.update(1, 'task-1', { status: 'TODO' });

    const calls = repository.update.mock.calls as [
      string,
      Record<string, unknown>,
    ][];
    expect(calls[0][1].completedAt).toBeNull();
  });
});
