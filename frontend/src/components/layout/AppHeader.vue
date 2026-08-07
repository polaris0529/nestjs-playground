<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { NavItem, SessionUser } from '../../types/app-layout';

defineProps<{
  navItems: NavItem[];
  currentUser: SessionUser | null;
}>();

const emit = defineEmits<{
  (event: 'logout'): void;
}>();

function requestLogout() {
  emit('logout');
}
</script>

<template>
  <header class="app-header">
    <RouterLink class="brand" to="/">WorkFlow</RouterLink>
    <nav class="top-nav" aria-label="주요 메뉴">
      <RouterLink v-for="item in navItems" :key="item.to" :to="item.to">
        {{ item.label }}
      </RouterLink>
    </nav>
    <div class="header-actions">
      <div v-if="currentUser" class="user-chip">
        <strong>{{ currentUser.loginId }}</strong>
        <span>{{ currentUser.roles.join(', ') || 'USER' }}</span>
      </div>
      <RouterLink v-else class="text-button" to="/login">로그인</RouterLink>
      <button
        v-if="currentUser"
        class="text-button"
        type="button"
        @click="requestLogout"
      >
        로그아웃
      </button>
    </div>
  </header>
</template>
