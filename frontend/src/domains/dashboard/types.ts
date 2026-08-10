export type DashboardTaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';

export interface DashboardSummary {
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

export interface DashboardTask {
  personalTaskId: string;
  calendarDate: string;
  title: string;
  status: DashboardTaskStatus;
}
