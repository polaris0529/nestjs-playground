<script setup lang="ts">
import { useLoginForm } from './composables/useLoginForm';

const { loginId, password, errorMessage, isSubmitting, submitLogin } =
  useLoginForm();
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

<style scoped>
.auth-screen {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  align-items: center;
  gap: 48px;
  min-height: 100vh;
  width: min(1100px, calc(100% - 32px));
  margin: 0 auto;
  padding: 48px 0;
}

.auth-copy {
  color: var(--color-card);
}

.auth-copy p {
  max-width: 560px;
  color: var(--color-sidebar-text);
}

.auth-brand {
  display: inline-block;
  margin-bottom: 72px;
  color: var(--color-card);
}

.auth-panel {
  padding: 28px;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: var(--shadow-panel);
}

@media (max-width: 768px) {
  .auth-screen {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .auth-brand {
    margin-bottom: 36px;
  }
}
</style>
