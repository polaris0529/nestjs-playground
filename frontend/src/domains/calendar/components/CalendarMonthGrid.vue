<script setup lang="ts">
import { useCalendarMonthGrid } from '../composables/useCalendarMonthGrid';
import type { CalendarCell } from '../../../shared/calendar-utils';
import type { CalendarEvent } from '../types';

const props = withDefaults(
  defineProps<{
    cells: CalendarCell[];
    eventsByDate: Map<string, CalendarEvent[]>;
    selectedDate?: string;
    maxEvents?: number;
    selectable?: boolean;
    compact?: boolean;
  }>(),
  {
    selectedDate: '',
    maxEvents: 3,
    selectable: false,
    compact: false,
  },
);

const emit = defineEmits<{
  (event: 'select-date', dateKey: string): void;
}>();

const { weekdays, cellViews, selectDate } = useCalendarMonthGrid(props, emit);
</script>

<template>
  <div class="weekday-grid" aria-hidden="true">
    <span v-for="weekday in weekdays" :key="weekday">{{ weekday }}</span>
  </div>

  <div class="month-grid" :class="{ 'compact-month-grid': compact }">
    <component
      :is="cellView.tagName"
      v-for="cellView in cellViews"
      :key="cellView.cell.dateKey"
      class="calendar-cell"
      :class="cellView.classes"
      :type="cellView.typeAttribute"
      @click="selectDate(cellView.cell.dateKey)"
    >
      <span class="day-number">{{ cellView.cell.dayNumber }}</span>
      <span
        v-for="eventRow in cellView.events"
        :key="eventRow.event.id"
        class="mini-event"
        :class="eventRow.className"
      >
        {{ eventRow.event.title }}
      </span>
    </component>
  </div>
</template>

<style scoped>
.weekday-grid,
.month-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.weekday-grid {
  gap: 6px;
  margin-bottom: 8px;
  color: var(--color-text-muted);
  font-family: var(--font-family-mono);
  font-size: 12px;
  text-align: center;
}

.month-grid {
  gap: 8px;
}

.calendar-cell {
  display: grid;
  align-content: start;
  gap: 6px;
  min-height: 118px;
  padding: 10px;
  color: var(--color-text);
  text-align: left;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

button.calendar-cell {
  font-weight: 400;
}

.calendar-cell:hover,
.calendar-cell.is-selected {
  border-color: var(--color-primary);
}

.calendar-cell.is-muted {
  color: var(--color-text-muted);
  background: color-mix(
    in srgb,
    var(--color-content-bg) 72%,
    var(--color-card)
  );
}

.calendar-cell.is-today .day-number {
  color: var(--color-card);
  background: var(--color-primary);
}

.day-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  font-family: var(--font-family-mono);
  font-weight: 700;
}

.compact-month-grid .calendar-cell {
  min-height: 88px;
}

.mini-event {
  display: block;
  overflow: hidden;
  padding: 4px 6px;
  color: var(--color-text);
  text-overflow: ellipsis;
  white-space: nowrap;
  background: var(--color-content-bg);
  border-left: 3px solid var(--color-secondary);
  border-radius: 4px;
  font-family: var(--font-family-mono);
  font-size: 12px;
}

.event-holiday {
  border-left-color: var(--color-danger);
}

.event-personal {
  border-left-color: var(--color-primary);
}

.event-common {
  border-left-color: var(--color-secondary);
}

@media (max-width: 768px) {
  .calendar-cell {
    min-height: 92px;
    padding: 8px;
  }

  .mini-event {
    font-size: 11px;
  }
}
</style>
