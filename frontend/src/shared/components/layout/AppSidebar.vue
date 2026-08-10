<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { NavItem } from '../../types/app-layout';

defineProps<{
  navItems: NavItem[];
}>();
</script>

<template>
  <aside class="sidebar" aria-label="사이드바 메뉴">
    <RouterLink v-for="item in navItems" :key="item.to" :to="item.to">
      {{ item.label }}
    </RouterLink>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px 16px;
  color: var(--color-sidebar-text);
  background: var(--color-sidebar-bg);
}

.sidebar a {
  padding: 10px 12px;
  border-radius: 6px;
}

.sidebar a.router-link-active {
  color: var(--color-card);
  background: var(--color-primary);
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
</style>
