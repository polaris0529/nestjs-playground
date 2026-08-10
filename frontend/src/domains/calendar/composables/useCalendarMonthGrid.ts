import { computed } from 'vue';
import { createCalendarCellViews } from '../formatters';
import type { CalendarEvent } from '../types';
import type { CalendarCell } from '../../../shared/calendar-utils';

interface CalendarMonthGridProps {
  cells: CalendarCell[];
  eventsByDate: Map<string, CalendarEvent[]>;
  selectedDate: string;
  maxEvents: number;
  selectable: boolean;
}

type CalendarMonthGridEmit = (event: 'select-date', dateKey: string) => void;

export function useCalendarMonthGrid(
  props: CalendarMonthGridProps,
  emit: CalendarMonthGridEmit,
) {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const cellViews = computed(() =>
    createCalendarCellViews(
      props.cells,
      props.eventsByDate,
      props.selectedDate,
      props.maxEvents,
      props.selectable,
    ),
  );

  function selectDate(dateKey: string): void {
    if (props.selectable) {
      emit('select-date', dateKey);
    }
  }

  return {
    weekdays,
    cellViews,
    selectDate,
  };
}
