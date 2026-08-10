<script setup lang="ts">
import type { ReferenceCodeOption } from '../../../shared/reference-codes';
import { useAccountAdminPanel } from '../composables/useAccountAdminPanel';
import type { Account, UseYn } from '../types';

const props = defineProps<{
  accounts: Account[];
  roleOptions: ReferenceCodeOption[];
  useYnOptions: ReferenceCodeOption<UseYn>[];
}>();

const emit = defineEmits<{
  (event: 'success', message: string): void;
  (event: 'error', message: string): void;
}>();

const { accountForm, accountRows, isSubmitting, createAccount } =
  useAccountAdminPanel(props, emit);
</script>

<template>
  <div class="admin-grid">
    <form class="content-card form-grid" @submit.prevent="createAccount">
      <div>
        <p class="eyebrow">NEW ACCOUNT</p>
        <h2>계정 등록</h2>
      </div>
      <label>
        로그인 ID
        <input v-model="accountForm.loginId" required />
      </label>
      <label>
        이름
        <input v-model="accountForm.accountName" maxlength="30" required />
      </label>
      <label>
        비밀번호
        <input
          v-model="accountForm.password"
          type="password"
          minlength="8"
          maxlength="72"
          required
        />
      </label>
      <div class="form-row">
        <label>
          역할
          <select v-model="accountForm.roleCode">
            <option
              v-for="option in roleOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </label>
        <label>
          사용 여부
          <select v-model="accountForm.useYn">
            <option
              v-for="option in useYnOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </label>
      </div>
      <button type="submit" :disabled="isSubmitting">등록</button>
    </form>

    <article class="content-card table-card">
      <div class="section-heading">
        <div>
          <p class="eyebrow">ACCOUNTS</p>
          <h2>계정 목록</h2>
        </div>
        <span class="count-badge">{{ accounts.length }}</span>
      </div>
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>로그인</th>
              <th>이름</th>
              <th>역할</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="account in accountRows" :key="account.accountId">
              <td>{{ account.accountId }}</td>
              <td>{{ account.loginId }}</td>
              <td>{{ account.accountName }}</td>
              <td>{{ account.roleText }}</td>
              <td>
                <span class="status-badge">{{ account.useYnText }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </div>
</template>
