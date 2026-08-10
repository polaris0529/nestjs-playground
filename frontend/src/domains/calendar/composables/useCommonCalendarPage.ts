import { computed, onMounted, ref } from 'vue';
import {
  addMonths,
  buildMonthCells,
  getMonthLabel,
  getMonthRange,
} from '../../../shared/calendar-utils';
import { createVisibleEventItems, groupEventsByDate } from '../formatters';
import { useCalendarStore } from '../service';
import { useCalendarReferenceOptions } from './useCalendarReferenceOptions';

export function useCommonCalendarPage() {
  const calendarStore = useCalendarStore();
  const referenceOptions = useCalendarReferenceOptions();
  const monthCursor = ref(new Date());
  const errorMessage = ref('');
  const isLoading = ref(false);
  const events = calendarStore.commonEvents;

  const monthLabel = computed(() => getMonthLabel(monthCursor.value));
  const cells = computed(() => buildMonthCells(monthCursor.value));
  const visibleEvents = computed(() =>
    createVisibleEventItems(
      events.value,
      referenceOptions.eventTypeOptions.value,
    ),
  );
  const eventsByDate = computed(() => groupEventsByDate(events.value));

  async function loadCommonCalendarPage(): Promise<void> {
    errorMessage.value = '';
    isLoading.value = true;

    try {
      await Promise.all([
        calendarStore.fetchCommonEvents(getMonthRange(monthCursor.value)),
        referenceOptions.fetchCalendarReferenceOptions(),
      ]);
    } catch {
      errorMessage.value = '공통 일정을 불러오지 못했습니다.';
    } finally {
      isLoading.value = false;
    }
  }

  async function moveMonth(amount: number): Promise<void> {
    monthCursor.value = addMonths(monthCursor.value, amount);
    await loadCommonCalendarPage();
  }

  onMounted(loadCommonCalendarPage);

  return {
    events,
    monthLabel,
    cells,
    visibleEvents,
    eventsByDate,
    errorMessage,
    isLoading,
    loadCommonCalendarPage,
    moveMonth,
  };
}
