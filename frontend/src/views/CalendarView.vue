<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { requestJson } from '../api/http';
import {
  addMonths,
  buildMonthCells,
  formatDateKey,
  getEventDateKey,
  getMonthLabel,
  getMonthRange,
} from '../calendar-utils';

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
type TaskPriority = 'LOW' | 'NORMAL' | 'HIGH';
type EventType = 'HOLIDAY' | 'PERSONAL' | 'COMMON';

interface CalendarEvent {
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

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'TODO', label: '예정' },
  { value: 'IN_PROGRESS', label: '진행' },
  { value: 'DONE', label: '완료' },
  { value: 'CANCELLED', label: '취소' },
];
const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: 'LOW', label: '낮음' },
  { value: 'NORMAL', label: '보통' },
  { value: 'HIGH', label: '높음' },
];

const monthCursor = ref(new Date());
const selectedDate = ref(formatDateKey(new Date()));
const events = ref<CalendarEvent[]>([]);
const errorMessage = ref('');
const formMessage = ref('');
const isLoading = ref(false);
const isSubmitting = ref(false);

const taskForm = reactive({
  calendarDate: selectedDate.value,
  title: '',
  content: '',
  status: 'TODO' as TaskStatus,
  priority: 'NORMAL' as TaskPriority,
  startTime: '',
  endTime: '',
});

const monthLabel = computed(() => getMonthLabel(monthCursor.value));
const cells = computed(() => buildMonthCells(monthCursor.value));
const eventsByDate = computed(() => {
  const grouped = new Map<string, CalendarEvent[]>();
  events.value.forEach((event) => {
    const dateKey = getEventDateKey(event.start);
    grouped.set(dateKey, [...(grouped.get(dateKey) ?? []), event]);
  });
  return grouped;
});
const selectedEvents = computed(() =>
  [...(eventsByDate.value.get(selectedDate.value) ?? [])].sort((a, b) =>
    a.start.localeCompare(b.start),
  ),
);

function eventTypeLabel(type: EventType): string {
  const labels: Record<EventType, string> = {
    HOLIDAY: '휴일',
    PERSONAL: '개인',
    COMMON: '공통',
  };
  return labels[type];
}

function selectDate(dateKey: string) {
  selectedDate.value = dateKey;
  taskForm.calendarDate = dateKey;
}

async function loadEvents() {
  const params = new URLSearchParams(getMonthRange(monthCursor.value));
  errorMessage.value = '';
  isLoading.value = true;

  try {
    events.value = await requestJson<CalendarEvent[]>(
      `/api/calendar/events?${params.toString()}`,
    );
  } catch (error) {
    events.value = [];
    errorMessage.value =
      error instanceof Error && error.message
        ? error.message
        : '캘린더 정보를 불러오지 못했습니다.';
  } finally {
    isLoading.value = false;
  }
}

async function moveMonth(amount: number) {
  monthCursor.value = addMonths(monthCursor.value, amount);
  await loadEvents();
}

async function submitTask() {
  formMessage.value = '';
  isSubmitting.value = true;

  try {
    await requestJson('/api/calendar/personal-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        calendarDate: taskForm.calendarDate,
        title: taskForm.title,
        content: taskForm.content || null,
        status: taskForm.status,
        priority: taskForm.priority,
        startTime: taskForm.startTime || null,
        endTime: taskForm.endTime || null,
      }),
    });
    taskForm.title = '';
    taskForm.content = '';
    taskForm.startTime = '';
    taskForm.endTime = '';
    formMessage.value = '개인 태스크를 등록했습니다.';
    await loadEvents();
  } catch (error) {
    formMessage.value =
      error instanceof Error && error.message
        ? error.message
        : '개인 태스크 등록에 실패했습니다.';
  } finally {
    isSubmitting.value = false;
  }
}

async function markDone(event: CalendarEvent) {
  if (event.extendedProps.type !== 'PERSONAL') return;
  const taskId = event.id.replace('personal:', '');
  await requestJson(`/api/calendar/personal-tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'DONE' }),
  });
  await loadEvents();
}

onMounted(loadEvents);
</script>

<template>
  <section class="page-stack">
    <header class="page-header">
      <div>
        <p class="eyebrow">CALENDAR</p>
        <h1>캘린더</h1>
        <p>공휴일, 공통 태스크, 개인 태스크를 월간 화면에서 함께 확인합니다.</p>
      </div>
      <div class="toolbar">
        <button class="secondary-button" type="button" @click="moveMonth(-1)">
          이전
        </button>
        <strong class="toolbar-label">{{ monthLabel }}</strong>
        <button class="secondary-button" type="button" @click="moveMonth(1)">
          다음
        </button>
      </div>
    </header>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-else-if="isLoading" class="muted-text">캘린더를 불러오는 중입니다.</p>

    <div class="calendar-workspace">
      <article class="calendar-panel">
        <div class="weekday-grid" aria-hidden="true">
          <span>일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span>토</span>
        </div>

        <div class="month-grid">
          <button
            v-for="cell in cells"
            :key="cell.dateKey"
            class="calendar-cell"
            :class="{
              'is-muted': !cell.isCurrentMonth,
              'is-today': cell.isToday,
              'is-selected': selectedDate === cell.dateKey,
            }"
            type="button"
            @click="selectDate(cell.dateKey)"
          >
            <span class="day-number">{{ cell.dayNumber }}</span>
            <span
              v-for="event in (eventsByDate.get(cell.dateKey) ?? []).slice(
                0,
                3,
              )"
              :key="event.id"
              class="mini-event"
              :class="`event-${event.extendedProps.type.toLowerCase()}`"
            >
              {{ event.title }}
            </span>
          </button>
        </div>
      </article>

      <aside class="side-stack">
        <article class="content-card">
          <div class="section-heading">
            <div>
              <p class="eyebrow">SELECTED DAY</p>
              <h2>{{ selectedDate }}</h2>
            </div>
            <span class="count-badge">{{ selectedEvents.length }}</span>
          </div>
          <ul v-if="selectedEvents.length" class="event-list">
            <li v-for="event in selectedEvents" :key="event.id">
              <span class="event-date">
                {{
                  event.start.includes('T') ? event.start.slice(11, 16) : '종일'
                }}
              </span>
              <strong>{{ event.title }}</strong>
              <em>{{ eventTypeLabel(event.extendedProps.type) }}</em>
              <button
                v-if="
                  event.extendedProps.type === 'PERSONAL' &&
                  event.extendedProps.status !== 'DONE'
                "
                class="small-button"
                type="button"
                @click="markDone(event)"
              >
                완료
              </button>
            </li>
          </ul>
          <p v-else class="muted-text">선택한 날짜의 일정이 없습니다.</p>
        </article>

        <form class="content-card form-grid" @submit.prevent="submitTask">
          <div>
            <p class="eyebrow">PERSONAL TASK</p>
            <h2>개인 태스크 등록</h2>
          </div>
          <label>
            날짜
            <input v-model="taskForm.calendarDate" type="date" required />
          </label>
          <label>
            제목
            <input v-model="taskForm.title" maxlength="100" required />
          </label>
          <div class="form-row">
            <label>
              상태
              <select v-model="taskForm.status">
                <option
                  v-for="option in statusOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </label>
            <label>
              우선순위
              <select v-model="taskForm.priority">
                <option
                  v-for="option in priorityOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </label>
          </div>
          <div class="form-row">
            <label>
              시작
              <input v-model="taskForm.startTime" type="time" />
            </label>
            <label>
              종료
              <input v-model="taskForm.endTime" type="time" />
            </label>
          </div>
          <label>
            내용
            <textarea v-model="taskForm.content" maxlength="2000" rows="4" />
          </label>
          <p v-if="formMessage" class="muted-text">{{ formMessage }}</p>
          <button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? '등록 중' : '등록' }}
          </button>
        </form>
      </aside>
    </div>
  </section>
</template>
