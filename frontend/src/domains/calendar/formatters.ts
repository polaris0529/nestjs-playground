import {
  findReferenceCodeLabel,
  type ReferenceCodeOption,
} from '../../shared/reference-codes';
import { getEventDateKey } from '../../shared/calendar-utils';
import type { CalendarCell } from '../../shared/calendar-utils';
import type { CalendarEvent, EventType } from './types';

export interface VisibleEventItem {
  id: string;
  dateKey: string;
  title: string;
  typeLabel: string;
}

export interface SelectedEventRow {
  event: CalendarEvent;
  time: string;
  typeLabel: string;
  canMarkDone: boolean;
}

export interface CalendarEventRow {
  event: CalendarEvent;
  className: string;
}

export interface CalendarCellView {
  cell: CalendarCell;
  classes: Record<string, boolean>;
  events: CalendarEventRow[];
  tagName: 'button' | 'article';
  typeAttribute?: 'button';
}

export function groupEventsByDate(
  events: CalendarEvent[],
): Map<string, CalendarEvent[]> {
  const grouped = new Map<string, CalendarEvent[]>();
  events.forEach((event) => {
    const dateKey = getEventDateKey(event.start);
    grouped.set(dateKey, [...(grouped.get(dateKey) ?? []), event]);
  });
  return grouped;
}

export function createVisibleEventItems(
  events: CalendarEvent[],
  eventTypeOptions: ReferenceCodeOption<EventType>[],
): VisibleEventItem[] {
  return [...events]
    .sort((a, b) => a.start.localeCompare(b.start))
    .slice(0, 8)
    .map((event) => ({
      id: event.id,
      dateKey: getEventDateKey(event.start),
      title: event.title,
      typeLabel: findReferenceCodeLabel(
        eventTypeOptions,
        event.extendedProps.type,
        event.extendedProps.type,
      ),
    }));
}

export function createSelectedEventRows(
  events: CalendarEvent[],
  eventTypeOptions: ReferenceCodeOption<EventType>[],
): SelectedEventRow[] {
  return events.map((event) => ({
    event,
    time: formatEventTime(event),
    typeLabel: findReferenceCodeLabel(
      eventTypeOptions,
      event.extendedProps.type,
      event.extendedProps.type,
    ),
    canMarkDone:
      event.extendedProps.type === 'PERSONAL' &&
      event.extendedProps.status !== 'DONE',
  }));
}

export function createCalendarCellViews(
  cells: CalendarCell[],
  eventsByDate: Map<string, CalendarEvent[]>,
  selectedDate: string,
  maxEvents: number,
  selectable: boolean,
): CalendarCellView[] {
  return cells.map((cell) => ({
    cell,
    classes: {
      'is-muted': !cell.isCurrentMonth,
      'is-today': cell.isToday,
      'is-selected': selectedDate === cell.dateKey,
    },
    events: (eventsByDate.get(cell.dateKey) ?? [])
      .slice(0, maxEvents)
      .map((event) => ({
        event,
        className: `event-${event.extendedProps.type.toLowerCase()}`,
      })),
    tagName: selectable ? 'button' : 'article',
    typeAttribute: selectable ? 'button' : undefined,
  }));
}

export function formatEventTime(event: CalendarEvent): string {
  return event.start.includes('T') ? event.start.slice(11, 16) : '종일';
}

export function resolvePersonalTaskId(event: CalendarEvent): string | null {
  if (event.extendedProps.type !== 'PERSONAL') return null;
  return event.id.replace('personal:', '');
}
