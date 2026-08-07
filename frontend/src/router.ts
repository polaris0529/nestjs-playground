import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import LoginView from './views/LoginView.vue';
import DashboardView from './views/DashboardView.vue';
import AdminView from './views/AdminView.vue';
import CalendarView from './views/CalendarView.vue';

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
