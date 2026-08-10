import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../service';

export function useLoginForm() {
  const router = useRouter();
  const authStore = useAuthStore();
  const loginId = ref('');
  const password = ref('');
  const errorMessage = ref('');
  const isSubmitting = ref(false);

  async function submitLogin(): Promise<void> {
    errorMessage.value = '';
    isSubmitting.value = true;

    try {
      await authStore.login({
        loginId: loginId.value,
        password: password.value,
      });
      await router.push('/dashboard');
    } catch (error) {
      errorMessage.value =
        error instanceof Error && error.message
          ? error.message
          : '로그인에 실패했습니다.';
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    loginId,
    password,
    errorMessage,
    isSubmitting,
    submitLogin,
  };
}
