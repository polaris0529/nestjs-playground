<script setup lang="ts">
import { RouterLink } from 'vue-router';
import CalendarMonthGrid from './components/CalendarMonthGrid.vue';
import { useCommonCalendarPage } from './composables/useCommonCalendarPage';

const {
  events,
  monthLabel,
  cells,
  visibleEvents,
  eventsByDate,
  errorMessage,
  isLoading,
  moveMonth,
} = useCommonCalendarPage();
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

        <CalendarMonthGrid
          :cells="cells"
          :events-by-date="eventsByDate"
          compact
          :max-events="2"
        />
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
              <span class="event-date">{{ event.dateKey }}</span>
              <strong>{{ event.title }}</strong>
              <em>{{ event.typeLabel }}</em>
            </li>
          </ul>
          <p v-else class="muted-text">등록된 공통 일정이 없습니다.</p>
        </article>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.header-command-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.split-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 24px;
  align-items: start;
}

.calendar-panel {
  min-width: 0;
  padding: 22px;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: var(--shadow-panel);
}

.side-stack {
  display: grid;
  gap: 24px;
}

.portfolio-role {
  color: var(--color-primary);
}

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

@media (max-width: 768px) {
  .header-command-group {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .split-grid {
    grid-template-columns: 1fr;
  }
}
</style>
