<script setup lang="ts">
import type { ReferenceCodeOption } from '../../../shared/reference-codes';
import { useSelectedEventList } from '../composables/useSelectedEventList';
import type { CalendarEvent, EventType } from '../types';

const props = defineProps<{
  selectedDate: string;
  events: CalendarEvent[];
  eventTypeOptions: ReferenceCodeOption<EventType>[];
}>();

const emit = defineEmits<{
  (event: 'mark-done', item: CalendarEvent): void;
}>();

const { eventRows, markDone } = useSelectedEventList(props, emit);
</script>

<template>
  <article class="content-card">
    <div class="section-heading">
      <div>
        <p class="eyebrow">SELECTED DAY</p>
        <h2>{{ selectedDate }}</h2>
      </div>
      <span class="count-badge">{{ eventRows.length }}</span>
    </div>
    <ul v-if="eventRows.length" class="event-list">
      <li v-for="eventRow in eventRows" :key="eventRow.event.id">
        <span class="event-date">{{ eventRow.time }}</span>
        <strong>{{ eventRow.event.title }}</strong>
        <em>{{ eventRow.typeLabel }}</em>
        <button
          v-if="eventRow.canMarkDone"
          class="small-button"
          type="button"
          @click="markDone(eventRow.event)"
        >
          완료
        </button>
      </li>
    </ul>
    <p v-else class="muted-text">선택한 날짜의 일정이 없습니다.</p>
  </article>
</template>

<style scoped>
.event-list {
  display: grid;
  gap: 10px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.event-list li {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.event-list li:has(.small-button) {
  grid-template-columns: auto minmax(0, 1fr) auto auto;
}

.event-list strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-list em {
  color: var(--color-text-muted);
  font-style: normal;
  font-size: 13px;
}

.event-date {
  color: var(--color-secondary);
  font-family: var(--font-family-mono);
  font-size: 12px;
}

.small-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 0 9px;
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 10%, var(--color-card));
  border: 1px solid color-mix(in srgb, var(--color-primary) 32%, transparent);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
}

@media (max-width: 768px) {
  .event-list li,
  .event-list li:has(.small-button) {
    grid-template-columns: 1fr;
  }
}
</style>
