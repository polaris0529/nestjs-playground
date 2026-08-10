<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppShell from './shared/components/layout/AppShell.vue';
import { useAppFrame } from './shared/composables/useAppFrame';

const {
  currentUser,
  currentUserRoleText,
  isAuthLayout,
  visibleNavItems,
  logout,
} = useAppFrame();
</script>

<template>
  <div v-if="isAuthLayout" class="auth-layout">
    <RouterView />
  </div>

  <AppShell
    v-else
    :nav-items="visibleNavItems"
    :current-user="currentUser"
    :current-user-role-text="currentUserRoleText"
    @logout="logout"
  >
    <RouterView />
  </AppShell>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    var(--color-sidebar-bg),
    color-mix(in srgb, var(--color-sidebar-bg) 82%, var(--color-secondary))
  );
}
</style>
