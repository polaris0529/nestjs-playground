<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { requestJson } from '../api/http';
import {
  addMonths,
  buildMonthCells,
  getEventDateKey,
  getMonthLabel,
  getMonthRange,
} from '../calendar-utils';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  allDay: boolean;
  extendedProps: {
    type: 'HOLIDAY' | 'COMMON' | 'PERSONAL';
    status?: string;
    category?: string | null;
    content?: string | null;
  };
}

const monthCursor = ref(new Date());
const events = ref<CalendarEvent[]>([]);
const errorMessage = ref('');
const isLoading = ref(false);

const monthLabel = computed(() => getMonthLabel(monthCursor.value));
const cells = computed(() => buildMonthCells(monthCursor.value));
const visibleEvents = computed(() =>
  [...events.value].sort((a, b) => a.start.localeCompare(b.start)).slice(0, 8),
);
const eventsByDate = computed(() => {
  const grouped = new Map<string, CalendarEvent[]>();
  events.value.forEach((event) => {
    const dateKey = getEventDateKey(event.start);
    grouped.set(dateKey, [...(grouped.get(dateKey) ?? []), event]);
  });
  return grouped;
});

function typeLabel(event: CalendarEvent): string {
  return event.extendedProps.type === 'HOLIDAY' ? '휴일' : '공통';
}

async function loadEvents() {
  const range = getMonthRange(monthCursor.value);
  const params = new URLSearchParams(range);
  errorMessage.value = '';
  isLoading.value = true;

  try {
    events.value = await requestJson<CalendarEvent[]>(
      `/api/calendar/common-events?${params.toString()}`,
      { retryOnUnauthorized: false },
    );
  } catch {
    events.value = [];
    errorMessage.value = '공통 일정을 불러오지 못했습니다.';
  } finally {
    isLoading.value = false;
  }
}

async function moveMonth(amount: number) {
  monthCursor.value = addMonths(monthCursor.value, amount);
  await loadEvents();
}

onMounted(loadEvents);
</script>

<template>
  <section class="page-stack">
    <header class="page-header">
      <div>
        <p class="eyebrow">WORKFLOW</p>
        <h1>공통 일정보드</h1>
        <p>
          NestJS API에서 제공하는 공휴일과 공통 태스크를 Vue 화면에서 바로
          조회합니다.
        </p>
      </div>
      <div class="header-command-group">
        <RouterLink class="btn-primary" to="/login">관리자 로그인</RouterLink>
        <RouterLink class="secondary-button" to="/calendar">
          내 캘린더
        </RouterLink>
      </div>
    </header>

    <div class="split-grid">
      <article class="calendar-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">PUBLIC CALENDAR</p>
            <h2>{{ monthLabel }}</h2>
          </div>
          <div class="toolbar">
            <button
              class="secondary-button"
              type="button"
              @click="moveMonth(-1)"
            >
              이전
            </button>
            <button
              class="secondary-button"
              type="button"
              @click="moveMonth(1)"
            >
              다음
            </button>
          </div>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-else-if="isLoading" class="muted-text">
          일정을 불러오는 중입니다.
        </p>

        <div class="weekday-grid" aria-hidden="true">
          <span>일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span>토</span>
        </div>

        <div class="month-grid compact-month-grid">
          <article
            v-for="cell in cells"
            :key="cell.dateKey"
            class="calendar-cell"
            :class="{
              'is-muted': !cell.isCurrentMonth,
              'is-today': cell.isToday,
            }"
          >
            <span class="day-number">{{ cell.dayNumber }}</span>
            <span
              v-for="event in (eventsByDate.get(cell.dateKey) ?? []).slice(
                0,
                2,
              )"
              :key="event.id"
              class="mini-event"
              :class="`event-${event.extendedProps.type.toLowerCase()}`"
            >
              {{ event.title }}
            </span>
          </article>
        </div>
      </article>

      <aside class="side-stack">
        <article class="content-card">
          <p class="eyebrow">PUBLIC</p>
          <h2 class="portfolio-role">공통 일정</h2>
          <p>
            공개 화면에서는 인증 없이 공휴일과 공통 태스크만 확인합니다. 개인
            일정과 관리자 편집은 로그인 후 접근합니다.
          </p>
          <dl class="meta-list">
            <div>
              <dt>프론트엔드</dt>
              <dd>Vue.js + Vue Router + Vite</dd>
            </div>
            <div>
              <dt>백엔드</dt>
              <dd>NestJS + PostgreSQL + TypeORM</dd>
            </div>
          </dl>
        </article>

        <article class="content-card">
          <div class="section-heading">
            <div>
              <p class="eyebrow">THIS MONTH</p>
              <h2>이번 달 일정</h2>
            </div>
            <span class="count-badge">{{ events.length }}</span>
          </div>
          <ul v-if="visibleEvents.length" class="event-list">
            <li v-for="event in visibleEvents" :key="event.id">
              <span class="event-date">{{ getEventDateKey(event.start) }}</span>
              <strong>{{ event.title }}</strong>
              <em>{{ typeLabel(event) }}</em>
            </li>
          </ul>
          <p v-else class="muted-text">등록된 공통 일정이 없습니다.</p>
        </article>
      </aside>
    </div>
  </section>
</template>
