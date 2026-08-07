<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { requestJson, requestVoid } from './api/http';
import AppShell from './components/layout/AppShell.vue';
import type { NavItem, SessionUser } from './types/app-layout';

const route = useRoute();
const router = useRouter();
const currentUser = ref<SessionUser | null>(null);

const isAuthLayout = computed(() => route.name === 'login');
const isAdmin = computed(
  () => currentUser.value?.roles.includes('ADMIN') ?? false,
);

const navItems: NavItem[] = [
  { to: '/', label: '홈' },
  { to: '/dashboard', label: '대시보드' },
  { to: '/calendar', label: '캘린더' },
  { to: '/admin', label: '관리자', adminOnly: true },
];

const visibleNavItems = computed(() =>
  navItems.filter((item) => !item.adminOnly || isAdmin.value),
);

async function loadSession() {
  if (isAuthLayout.value) {
    currentUser.value = null;
    return;
  }

  try {
    currentUser.value = await requestJson<SessionUser>('/api/auth/me');
  } catch {
    currentUser.value = null;
  }
}

async function logout() {
  try {
    await requestVoid('/api/auth/logout', { method: 'POST' });
  } finally {
    currentUser.value = null;
    await router.push('/login');
  }
}

watch(
  () => route.fullPath,
  () => {
    void loadSession();
  },
  { immediate: true },
);
</script>

<template>
  <div v-if="isAuthLayout" class="auth-layout">
    <RouterView />
  </div>

  <AppShell
    v-else
    :nav-items="visibleNavItems"
    :current-user="currentUser"
    @logout="logout"
  >
    <RouterView />
  </AppShell>
</template>
