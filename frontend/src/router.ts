import { createRouter, createWebHistory } from 'vue-router';
import AdminView from './domains/admin/AdminView.vue';
import LoginView from './domains/auth/LoginView.vue';
import CalendarView from './domains/calendar/CalendarView.vue';
import HomeView from './domains/calendar/HomeView.vue';
import DashboardView from './domains/dashboard/DashboardView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/dashboard', name: 'dashboard', component: DashboardView },
    { path: '/admin/:pathMatch(.*)*', name: 'admin', component: AdminView },
    { path: '/calendar', name: 'calendar', component: CalendarView },
  ],
});
