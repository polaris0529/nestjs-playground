import { ref } from 'vue';
import { requestJson } from '../../shared/api/http';
import type { CalendarMonthRange } from '../../shared/calendar-utils';
import type {
  CalendarEvent,
  PersonalTask,
  TaskPriority,
  TaskStatus,
} from './types';

const events = ref<CalendarEvent[]>([]);
const commonEvents = ref<CalendarEvent[]>([]);
const personalTasks = ref<PersonalTask[]>([]);

interface CreatePersonalTaskRequest {
  calendarDate: string;
  title: string;
  content: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  startTime: string | null;
  endTime: string | null;
}

function queryString(range: CalendarMonthRange): string {
  return new URLSearchParams(range).toString();
}

export function useCalendarStore() {
  async function fetchEvents(range: CalendarMonthRange): Promise<void> {
    try {
      events.value = await requestJson<CalendarEvent[]>(
        `/api/calendar/events?${queryString(range)}`,
      );
    } catch (error) {
      events.value = [];
      throw error;
    }
  }

  async function fetchCommonEvents(range: CalendarMonthRange): Promise<void> {
    try {
      commonEvents.value = await requestJson<CalendarEvent[]>(
        `/api/calendar/common-events?${queryString(range)}`,
        { retryOnUnauthorized: false },
      );
    } catch (error) {
      commonEvents.value = [];
      throw error;
    }
  }

  async function fetchPersonalTasks(range: CalendarMonthRange): Promise<void> {
    try {
      personalTasks.value = await requestJson<PersonalTask[]>(
        `/api/calendar/personal-tasks?${queryString(range)}`,
      );
    } catch (error) {
      personalTasks.value = [];
      throw error;
    }
  }

  async function createPersonalTask(
    payload: CreatePersonalTaskRequest,
    range: CalendarMonthRange,
  ): Promise<void> {
    await requestJson('/api/calendar/personal-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    await fetchEvents(range);
  }

  async function markPersonalTaskDone(
    taskId: string,
    range: CalendarMonthRange,
  ): Promise<void> {
    await requestJson(`/api/calendar/personal-tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'DONE' }),
    });
    await fetchEvents(range);
  }

  return {
    events,
    commonEvents,
    personalTasks,
    fetchEvents,
    fetchCommonEvents,
    fetchPersonalTasks,
    createPersonalTask,
    markPersonalTaskDone,
  };
}
