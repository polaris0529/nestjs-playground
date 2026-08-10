import { computed } from 'vue';
import type { ReferenceCodeOption } from '../../../shared/reference-codes';
import { createSelectedEventRows } from '../formatters';
import type { CalendarEvent, EventType } from '../types';

interface SelectedEventListProps {
  events: CalendarEvent[];
  eventTypeOptions: ReferenceCodeOption<EventType>[];
}

type SelectedEventListEmit = (event: 'mark-done', item: CalendarEvent) => void;

export function useSelectedEventList(
  props: SelectedEventListProps,
  emit: SelectedEventListEmit,
) {
  const eventRows = computed(() =>
    createSelectedEventRows(props.events, props.eventTypeOptions),
  );

  return {
    eventRows,
    markDone: (event: CalendarEvent) => emit('mark-done', event),
  };
}
