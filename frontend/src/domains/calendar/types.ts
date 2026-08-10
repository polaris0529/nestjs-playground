export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'NORMAL' | 'HIGH';
export type EventType = 'HOLIDAY' | 'PERSONAL' | 'COMMON';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay: boolean;
  extendedProps: {
    type: EventType;
    status?: TaskStatus;
    priority?: TaskPriority | null;
    category?: string | null;
    content?: string | null;
  };
}

export interface PersonalTask {
  personalTaskId: string;
  calendarDate: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority | null;
  startTime: string | null;
  endTime: string | null;
}
