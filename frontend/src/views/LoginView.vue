<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { requestJson } from '../api/http';

const router = useRouter();
const loginId = ref('');
const password = ref('');
const errorMessage = ref('');
const isSubmitting = ref(false);

async function submitLogin() {
  errorMessage.value = '';
  isSubmitting.value = true;

  try {
    await requestJson('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        loginId: loginId.value,
        password: password.value,
      }),
      retryOnUnauthorized: false,
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
</script>

<template>
  <section class="auth-screen">
    <div class="auth-copy">
      <RouterLink class="brand auth-brand" to="/">WorkFlow</RouterLink>
      <p class="eyebrow">SECURE CONSOLE</p>
      <h1>업무 관리 콘솔 로그인</h1>
      <p>
        계정, 메뉴, 공통코드, 개인 일정을 Vue 화면에서 관리합니다. 인증과 권한은
        NestJS API가 최종 검증합니다.
      </p>
    </div>

    <form class="auth-panel form-grid" @submit.prevent="submitLogin">
      <div>
        <p class="eyebrow">LOGIN</p>
        <h2>계정 로그인</h2>
      </div>
      <label>
        아이디
        <input v-model="loginId" autocomplete="username" required />
      </label>
      <label>
        비밀번호
        <input
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
        />
      </label>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? '처리 중' : '로그인' }}
      </button>
      <RouterLink class="secondary-button full-width-button" to="/">
        공통 일정으로 돌아가기
      </RouterLink>
    </form>
  </section>
</template>
