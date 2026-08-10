import { computed, onMounted, ref } from 'vue';
import {
  fetchReferenceCodeOptions,
  findReferenceCodeLabel,
  type ReferenceCodeOption,
} from '../../../shared/reference-codes';
import { formatDateKey, getMonthRange } from '../../../shared/calendar-utils';
import { useDashboardStore } from '../service';
import type { DashboardTask, DashboardTaskStatus } from '../types';

interface UpcomingTaskItem {
  personalTaskId: string;
  calendarDate: string;
  title: string;
  statusClass: string;
  statusLabel: string;
}

export function useDashboardPage() {
  const dashboardStore = useDashboardStore();
  const summary = dashboardStore.summary;
  const tasks = dashboardStore.tasks;
  const taskStatusOptions = ref<ReferenceCodeOption<DashboardTaskStatus>[]>([]);
  const roleOptions = ref<ReferenceCodeOption[]>([]);
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
  const completionStyle = computed(() => ({
    width: `${completionRate.value}%`,
  }));
  const sessionRoleText = computed(() => {
    const roles = summary.value?.me.roles;
    if (!roles) return 'USER';
    return roles
      .split(',')
      .map((role) => role.trim())
      .filter(Boolean)
      .map((role) => findReferenceCodeLabel(roleOptions.value, role, role))
      .join(', ');
  });
  const upcomingTaskItems = computed<UpcomingTaskItem[]>(() =>
    upcomingTasks.value.map((task) => toUpcomingTaskItem(task)),
  );

  function toUpcomingTaskItem(task: DashboardTask): UpcomingTaskItem {
    return {
      personalTaskId: task.personalTaskId,
      calendarDate: task.calendarDate,
      title: task.title,
      statusClass: `status-${task.status.toLowerCase()}`,
      statusLabel: findReferenceCodeLabel(
        taskStatusOptions.value,
        task.status,
        task.status,
      ),
    };
  }

  async function loadDashboard(): Promise<void> {
    errorMessage.value = '';
    isLoading.value = true;

    try {
      const [statuses, roles] = await Promise.all([
        fetchReferenceCodeOptions<DashboardTaskStatus>('TASK_STATUS'),
        fetchReferenceCodeOptions('ROLE_TYPE'),
        dashboardStore.fetchDashboard(getMonthRange(new Date())),
      ]);
      taskStatusOptions.value = statuses;
      roleOptions.value = roles;
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

  return {
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
  };
}
