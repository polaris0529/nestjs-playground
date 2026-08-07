<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { requestJson } from '../api/http';
import { formatDateKey, getMonthRange } from '../calendar-utils';

interface DashboardSummary {
  stats: {
    accountActive: number;
    accountTotal: number;
    menus: number;
    codeGroups: number;
    codes: number;
  };
  me: {
    accountName: string;
    roles: string;
    lastLoginText: string;
  };
}

interface PersonalTask {
  personalTaskId: string;
  calendarDate: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | null;
  startTime: string | null;
  endTime: string | null;
}

const summary = ref<DashboardSummary | null>(null);
const tasks = ref<PersonalTask[]>([]);
const errorMessage = ref('');
const isLoading = ref(false);

const todayKey = formatDateKey(new Date());
const activeTasks = computed(() =>
  tasks.value.filter(
    (task) => task.status !== 'DONE' && task.status !== 'CANCELLED',
  ),
);
const todayTasks = computed(() =>
  tasks.value.filter((task) => task.calendarDate === todayKey),
);
const upcomingTasks = computed(() =>
  activeTasks.value
    .filter((task) => task.calendarDate >= todayKey)
    .sort((a, b) => a.calendarDate.localeCompare(b.calendarDate))
    .slice(0, 6),
);
const doneCount = computed(
  () => tasks.value.filter((task) => task.status === 'DONE').length,
);
const completionRate = computed(() => {
  if (tasks.value.length === 0) return 0;
  return Math.round((doneCount.value / tasks.value.length) * 100);
});

function statusLabel(status: PersonalTask['status']): string {
  const labels: Record<PersonalTask['status'], string> = {
    TODO: '예정',
    IN_PROGRESS: '진행',
    DONE: '완료',
    CANCELLED: '취소',
  };
  return labels[status];
}

async function loadDashboard() {
  const taskParams = new URLSearchParams(getMonthRange(new Date()));
  errorMessage.value = '';
  isLoading.value = true;

  try {
    const [summaryPayload, taskPayload] = await Promise.all([
      requestJson<DashboardSummary>('/api/dashboard/summary'),
      requestJson<PersonalTask[]>(
        `/api/calendar/personal-tasks?${taskParams.toString()}`,
      ),
    ]);
    summary.value = summaryPayload;
    tasks.value = taskPayload;
  } catch (error) {
    errorMessage.value =
      error instanceof Error && error.message
        ? error.message
        : '대시보드 정보를 불러오지 못했습니다.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadDashboard);
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
              <dd>{{ summary.me.roles || 'USER' }}</dd>
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
            <span :style="{ width: `${completionRate}%` }"></span>
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
          <span class="count-badge">{{ upcomingTasks.length }}</span>
        </div>
        <ul v-if="upcomingTasks.length" class="task-list">
          <li v-for="task in upcomingTasks" :key="task.personalTaskId">
            <div>
              <strong>{{ task.title }}</strong>
              <span>{{ task.calendarDate }}</span>
            </div>
            <em :class="`status-${task.status.toLowerCase()}`">
              {{ statusLabel(task.status) }}
            </em>
          </li>
        </ul>
        <p v-else class="muted-text">다가오는 개인 태스크가 없습니다.</p>
      </article>
    </template>
  </section>
</template>
