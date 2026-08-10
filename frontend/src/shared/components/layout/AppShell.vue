<script setup lang="ts">
import AppFooter from './AppFooter.vue';
import AppHeader from './AppHeader.vue';
import AppSidebar from './AppSidebar.vue';
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
  <div class="app-shell">
    <AppHeader
      :nav-items="navItems"
      :current-user="currentUser"
      :current-user-role-text="currentUserRoleText"
      @logout="emit('logout')"
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

<style scoped>
.app-shell {
  min-height: 100vh;
}

.app-body {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  min-height: calc(100vh - 64px);
}

.content-shell {
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  min-width: 0;
}

.app-main {
  min-width: 0;
  padding: 32px;
}

@media (max-width: 768px) {
  .app-body {
    display: block;
  }

  .app-main {
    padding: 16px;
  }
}
</style>
