import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../domains/auth/service';
import {
  fetchReferenceCodeOptions,
  findReferenceCodeLabel,
  type ReferenceCodeOption,
} from '../reference-codes';
import type { NavItem } from '../types/app-layout';

const navItems: NavItem[] = [
  { to: '/', label: '홈' },
  { to: '/dashboard', label: '대시보드' },
  { to: '/calendar', label: '캘린더' },
  { to: '/admin', label: '관리자', adminOnly: true },
];

export function useAppFrame() {
  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();
  const currentUser = authStore.currentUser;
  const isAdmin = authStore.isAdmin;
  const roleOptions = ref<ReferenceCodeOption[]>([]);

  const isAuthLayout = computed(() => route.name === 'login');
  const visibleNavItems = computed(() =>
    navItems.filter((item) => !item.adminOnly || isAdmin.value),
  );
  const currentUserRoleText = computed(() => {
    if (!currentUser.value) return 'USER';
    return (
      currentUser.value.roles
        .map((role) => findReferenceCodeLabel(roleOptions.value, role, role))
        .join(', ') || 'USER'
    );
  });

  async function loadRoleOptions(): Promise<void> {
    roleOptions.value = await fetchReferenceCodeOptions('ROLE_TYPE');
  }

  async function loadSession(): Promise<void> {
    if (isAuthLayout.value) {
      authStore.clearSession();
      return;
    }

    try {
      await Promise.all([authStore.fetchSession(), loadRoleOptions()]);
    } catch {
      authStore.clearSession();
    }
  }

  async function logout(): Promise<void> {
    await authStore.logout();
    await router.push('/login');
  }

  watch(
    () => route.fullPath,
    () => {
      void loadSession();
    },
    { immediate: true },
  );

  return {
    currentUser,
    currentUserRoleText,
    isAuthLayout,
    visibleNavItems,
    logout,
  };
}
