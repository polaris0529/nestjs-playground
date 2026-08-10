import { computed, onMounted, reactive, ref } from 'vue';
import {
  addMonths,
  buildMonthCells,
  formatDateKey,
  getMonthLabel,
  getMonthRange,
} from '../../../shared/calendar-utils';
import { groupEventsByDate, resolvePersonalTaskId } from '../formatters';
import { useCalendarStore } from '../service';
import type { CalendarEvent, TaskPriority, TaskStatus } from '../types';
import { useCalendarReferenceOptions } from './useCalendarReferenceOptions';

export function useCalendarPage() {
  const calendarStore = useCalendarStore();
  const referenceOptions = useCalendarReferenceOptions();
  const monthCursor = ref(new Date());
  const errorMessage = ref('');
  const formMessage = ref('');
  const isLoading = ref(false);
  const isSubmitting = ref(false);
  const events = calendarStore.events;

  const taskForm = reactive({
    calendarDate: formatDateKey(new Date()),
    title: '',
    content: '',
    status: 'TODO' as TaskStatus,
    priority: 'NORMAL' as TaskPriority,
    startTime: '',
    endTime: '',
  });

  const monthLabel = computed(() => getMonthLabel(monthCursor.value));
  const cells = computed(() => buildMonthCells(monthCursor.value));
  const eventsByDate = computed(() => groupEventsByDate(events.value));
  const selectedDate = computed({
    get: () => taskForm.calendarDate,
    set: (dateKey: string) => {
      taskForm.calendarDate = dateKey;
    },
  });
  const selectedEvents = computed(() =>
    [...(eventsByDate.value.get(selectedDate.value) ?? [])].sort((a, b) =>
      a.start.localeCompare(b.start),
    ),
  );

  async function fetchEvents(): Promise<void> {
    await calendarStore.fetchEvents(getMonthRange(monthCursor.value));
  }

  async function loadCalendarPage(): Promise<void> {
    errorMessage.value = '';
    isLoading.value = true;

    try {
      await Promise.all([
        fetchEvents(),
        referenceOptions.fetchCalendarReferenceOptions(),
      ]);
    } catch (error) {
      errorMessage.value =
        error instanceof Error && error.message
          ? error.message
          : '캘린더 정보를 불러오지 못했습니다.';
    } finally {
      isLoading.value = false;
    }
  }

  async function moveMonth(amount: number): Promise<void> {
    monthCursor.value = addMonths(monthCursor.value, amount);
    await loadCalendarPage();
  }

  function selectDate(dateKey: string): void {
    selectedDate.value = dateKey;
  }

  async function submitTask(): Promise<void> {
    formMessage.value = '';
    isSubmitting.value = true;

    try {
      await calendarStore.createPersonalTask(
        {
          calendarDate: taskForm.calendarDate,
          title: taskForm.title,
          content: taskForm.content || null,
          status: taskForm.status,
          priority: taskForm.priority,
          startTime: taskForm.startTime || null,
          endTime: taskForm.endTime || null,
        },
        getMonthRange(monthCursor.value),
      );
      taskForm.title = '';
      taskForm.content = '';
      taskForm.startTime = '';
      taskForm.endTime = '';
      formMessage.value = '개인 태스크를 등록했습니다.';
    } catch (error) {
      formMessage.value =
        error instanceof Error && error.message
          ? error.message
          : '개인 태스크 등록에 실패했습니다.';
    } finally {
      isSubmitting.value = false;
    }
  }

  async function markDone(event: CalendarEvent): Promise<void> {
    const taskId = resolvePersonalTaskId(event);
    if (!taskId) return;
    await calendarStore.markPersonalTaskDone(
      taskId,
      getMonthRange(monthCursor.value),
    );
  }

  onMounted(loadCalendarPage);

  return {
    taskForm,
    statusOptions: referenceOptions.taskStatusOptions,
    priorityOptions: referenceOptions.taskPriorityOptions,
    eventTypeOptions: referenceOptions.eventTypeOptions,
    monthLabel,
    cells,
    eventsByDate,
    selectedDate,
    selectedEvents,
    errorMessage,
    formMessage,
    isLoading,
    isSubmitting,
    loadCalendarPage,
    moveMonth,
    selectDate,
    submitTask,
    markDone,
  };
}
