import { ref } from 'vue';
import {
  fetchReferenceCodeOptions,
  type ReferenceCodeOption,
} from '../../../shared/reference-codes';
import type { EventType, TaskPriority, TaskStatus } from '../types';

const taskStatusOptions = ref<ReferenceCodeOption<TaskStatus>[]>([]);
const taskPriorityOptions = ref<ReferenceCodeOption<TaskPriority>[]>([]);
const eventTypeOptions = ref<ReferenceCodeOption<EventType>[]>([]);

export function useCalendarReferenceOptions() {
  async function fetchCalendarReferenceOptions(): Promise<void> {
    const [taskStatuses, taskPriorities, eventTypes] = await Promise.all([
      fetchReferenceCodeOptions<TaskStatus>('TASK_STATUS'),
      fetchReferenceCodeOptions<TaskPriority>('TASK_PRIORITY'),
      fetchReferenceCodeOptions<EventType>('EVENT_TYPE'),
    ]);

    taskStatusOptions.value = taskStatuses;
    taskPriorityOptions.value = taskPriorities;
    eventTypeOptions.value = eventTypes;
  }

  return {
    taskStatusOptions,
    taskPriorityOptions,
    eventTypeOptions,
    fetchCalendarReferenceOptions,
  };
}
