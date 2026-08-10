<script setup lang="ts">
import CalendarMonthGrid from './components/CalendarMonthGrid.vue';
import SelectedEventList from './components/SelectedEventList.vue';
import { useCalendarPage } from './composables/useCalendarPage';

const {
  taskForm,
  statusOptions,
  priorityOptions,
  eventTypeOptions,
  monthLabel,
  cells,
  eventsByDate,
  selectedDate,
  selectedEvents,
  errorMessage,
  formMessage,
  isLoading,
  isSubmitting,
  moveMonth,
  selectDate,
  submitTask,
  markDone,
} = useCalendarPage();
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
        <CalendarMonthGrid
          :cells="cells"
          :events-by-date="eventsByDate"
          :selected-date="selectedDate"
          selectable
          @select-date="selectDate"
        />
      </article>

      <aside class="side-stack">
        <SelectedEventList
          :selected-date="selectedDate"
          :events="selectedEvents"
          :event-type-options="eventTypeOptions"
          @mark-done="markDone"
        />

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

<style scoped>
.calendar-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
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

@media (max-width: 768px) {
  .calendar-workspace {
    grid-template-columns: 1fr;
  }
}
</style>
