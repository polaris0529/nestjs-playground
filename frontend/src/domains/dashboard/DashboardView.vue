<script setup lang="ts">
import { useDashboardPage } from './composables/useDashboardPage';

const {
  summary,
  errorMessage,
  isLoading,
  activeTasks,
  todayTasks,
  doneCount,
  completionRate,
  completionStyle,
  sessionRoleText,
  upcomingTaskItems,
  loadDashboard,
} = useDashboardPage();
</script>

<template>
  <section class="page-stack">
    <header class="page-header">
      <div>
        <p class="eyebrow">DASHBOARD</p>
        <h1>대시보드</h1>
        <p>
          계정, 메뉴, 공통코드와 이번 달 개인 태스크 상태를 한 화면에서
          확인합니다.
        </p>
      </div>
      <button class="secondary-button" type="button" @click="loadDashboard">
        새로고침
      </button>
    </header>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-else-if="isLoading" class="muted-text">불러오는 중입니다.</p>

    <template v-if="summary">
      <div class="stat-grid">
        <article class="stat-card">
          <span>활성 계정</span>
          <strong>{{ summary.stats.accountActive }}</strong>
        </article>
        <article class="stat-card">
          <span>전체 계정</span>
          <strong>{{ summary.stats.accountTotal }}</strong>
        </article>
        <article class="stat-card">
          <span>메뉴</span>
          <strong>{{ summary.stats.menus }}</strong>
        </article>
        <article class="stat-card">
          <span>공통코드</span>
          <strong>{{ summary.stats.codes }}</strong>
        </article>
      </div>

      <div class="content-grid">
        <article class="content-card">
          <p class="eyebrow">SESSION</p>
          <h2>{{ summary.me.accountName }}</h2>
          <dl class="meta-list">
            <div>
              <dt>역할</dt>
              <dd>{{ sessionRoleText }}</dd>
            </div>
            <div>
              <dt>마지막 로그인</dt>
              <dd>{{ summary.me.lastLoginText }}</dd>
            </div>
          </dl>
        </article>

        <article class="content-card">
          <p class="eyebrow">TASKS</p>
          <h2>이번 달 처리 현황</h2>
          <div class="progress-row">
            <span>완료율</span>
            <strong>{{ completionRate }}%</strong>
          </div>
          <div class="progress-track">
            <span :style="completionStyle"></span>
          </div>
          <dl class="inline-metrics">
            <div>
              <dt>오늘</dt>
              <dd>{{ todayTasks.length }}</dd>
            </div>
            <div>
              <dt>진행 필요</dt>
              <dd>{{ activeTasks.length }}</dd>
            </div>
            <div>
              <dt>완료</dt>
              <dd>{{ doneCount }}</dd>
            </div>
          </dl>
        </article>
      </div>

      <article class="content-card">
        <div class="section-heading">
          <div>
            <p class="eyebrow">UPCOMING</p>
            <h2>다가오는 개인 태스크</h2>
          </div>
          <span class="count-badge">{{ upcomingTaskItems.length }}</span>
        </div>
        <ul v-if="upcomingTaskItems.length" class="task-list">
          <li v-for="task in upcomingTaskItems" :key="task.personalTaskId">
            <div>
              <strong>{{ task.title }}</strong>
              <span>{{ task.calendarDate }}</span>
            </div>
            <em :class="task.statusClass">
              {{ task.statusLabel }}
            </em>
          </li>
        </ul>
        <p v-else class="muted-text">다가오는 개인 태스크가 없습니다.</p>
      </article>
    </template>
  </section>
</template>

<style scoped>
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.stat-card {
  display: grid;
  gap: 8px;
  padding: 18px;
  color: var(--color-card);
  background: var(--color-sidebar-bg);
  border-radius: 8px;
}

.stat-card span {
  color: var(--color-sidebar-text);
  font-size: 13px;
}

.stat-card strong {
  font-family: var(--font-family-mono);
  font-size: 30px;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.inline-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 18px 0 0;
}

.inline-metrics div {
  display: grid;
  gap: 4px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.inline-metrics dt {
  color: var(--color-text-muted);
  font-family: var(--font-family-mono);
  font-size: 12px;
}

.inline-metrics dd {
  margin: 0;
  font-weight: 700;
}

.progress-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
}

.progress-row strong {
  font-family: var(--font-family-mono);
}

.progress-track {
  height: 10px;
  margin: 10px 0 16px;
  overflow: hidden;
  background: var(--color-content-bg);
  border-radius: 999px;
}

.progress-track span {
  display: block;
  height: 100%;
  background: var(--color-primary);
}

.task-list {
  display: grid;
  gap: 10px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.task-list li {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.task-list li div {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.task-list strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-list span,
.task-list em {
  color: var(--color-text-muted);
  font-size: 13px;
}

.task-list em {
  font-style: normal;
}

.status-todo,
.status-in_progress {
  color: var(--color-secondary);
}

.status-done {
  color: var(--color-success);
}

.status-cancelled {
  color: var(--color-danger);
}

@media (max-width: 768px) {
  .stat-grid,
  .content-grid,
  .inline-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
