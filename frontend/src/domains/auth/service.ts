import { computed, ref } from 'vue';
import { requestJson, requestVoid } from '../../shared/api/http';
import type { SessionUser } from './types';

const currentUser = ref<SessionUser | null>(null);
const isAdmin = computed(
  () => currentUser.value?.roles.includes('ADMIN') ?? false,
);

interface LoginRequest {
  loginId: string;
  password: string;
}

export function useAuthStore() {
  async function login(payload: LoginRequest): Promise<void> {
    await requestJson('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      retryOnUnauthorized: false,
    });
  }

  async function fetchSession(): Promise<void> {
    currentUser.value = await requestJson<SessionUser>('/api/auth/me');
  }

  async function logout(): Promise<void> {
    try {
      await requestVoid('/api/auth/logout', { method: 'POST' });
    } finally {
      currentUser.value = null;
    }
  }

  function clearSession(): void {
    currentUser.value = null;
  }

  return {
    currentUser,
    isAdmin,
    login,
    fetchSession,
    logout,
    clearSession,
  };
}
