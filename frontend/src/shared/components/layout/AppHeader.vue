<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { LayoutUser, NavItem } from '../../types/app-layout';

defineProps<{
  navItems: NavItem[];
  currentUser: LayoutUser | null;
  currentUserRoleText: string;
}>();

const emit = defineEmits<{
  (event: 'logout'): void;
}>();
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
        <span>{{ currentUserRoleText }}</span>
      </div>
      <RouterLink v-else class="text-button" to="/login">로그인</RouterLink>
      <button
        v-if="currentUser"
        class="text-button"
        type="button"
        @click="emit('logout')"
      >
        로그아웃
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr) auto;
  align-items: center;
  min-height: 64px;
  padding: 0 24px;
  color: var(--color-card);
  background: var(--color-sidebar-bg);
  border-bottom: 1px solid
    color-mix(in srgb, var(--color-sidebar-text) 24%, transparent);
}

.top-nav {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.top-nav a {
  padding: 10px 12px;
  border-radius: 6px;
}

.top-nav a.router-link-active {
  color: var(--color-card);
  background: var(--color-primary);
}

.header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.header-actions .text-button {
  color: var(--color-card);
  background: transparent;
  border-color: color-mix(in srgb, var(--color-sidebar-text) 34%, transparent);
}

.user-chip {
  display: grid;
  gap: 2px;
  min-width: 120px;
  padding: 6px 10px;
  border: 1px solid
    color-mix(in srgb, var(--color-sidebar-text) 28%, transparent);
  border-radius: 8px;
}

.user-chip strong,
.user-chip span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-chip span {
  color: var(--color-sidebar-text);
  font-family: var(--font-family-mono);
  font-size: 12px;
}

@media (max-width: 768px) {
  .app-header {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 16px;
  }

  .top-nav,
  .header-actions {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
</style>
