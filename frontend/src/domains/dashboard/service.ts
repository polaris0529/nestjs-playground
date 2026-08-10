import { ref } from 'vue';
import { requestJson } from '../../shared/api/http';
import type { CalendarMonthRange } from '../../shared/calendar-utils';
import type { DashboardSummary, DashboardTask } from './types';

const summary = ref<DashboardSummary | null>(null);
const tasks = ref<DashboardTask[]>([]);

function queryString(range: CalendarMonthRange): string {
  return new URLSearchParams(range).toString();
}

export function useDashboardStore() {
  async function fetchDashboard(range: CalendarMonthRange): Promise<void> {
    try {
      const [summaryPayload, taskPayload] = await Promise.all([
        requestJson<DashboardSummary>('/api/dashboard/summary'),
        requestJson<DashboardTask[]>(
          `/api/calendar/personal-tasks?${queryString(range)}`,
        ),
      ]);
      summary.value = summaryPayload;
      tasks.value = taskPayload;
    } catch (error) {
      summary.value = null;
      tasks.value = [];
      throw error;
    }
  }

  return {
    summary,
    tasks,
    fetchDashboard,
  };
}
