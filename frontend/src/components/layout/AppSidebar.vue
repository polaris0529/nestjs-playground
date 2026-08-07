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
