<script setup lang="ts">
import AppFooter from './AppFooter.vue';
import AppHeader from './AppHeader.vue';
import AppSidebar from './AppSidebar.vue';
import type { NavItem, SessionUser } from '../../types/app-layout';

defineProps<{
  navItems: NavItem[];
  currentUser: SessionUser | null;
}>();

const emit = defineEmits<{
  (event: 'logout'): void;
}>();

function handleLogout() {
  emit('logout');
}
</script>

<template>
  <div class="app-shell">
    <AppHeader
      :nav-items="navItems"
      :current-user="currentUser"
      @logout="handleLogout"
    />

    <div class="app-body">
      <AppSidebar :nav-items="navItems" />

      <div class="content-shell">
        <main class="app-main">
          <slot />
        </main>
        <AppFooter />
      </div>
    </div>
  </div>
</template>
