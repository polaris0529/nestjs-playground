<script setup lang="ts">
import type { ReferenceCodeOption } from '../../../shared/reference-codes';
import { useCommonCodeAdminPanel } from '../composables/useCommonCodeAdminPanel';
import type { CommonCode, CommonCodeGroup, UseYn } from '../types';

const props = defineProps<{
  groups: CommonCodeGroup[];
  codes: CommonCode[];
  useYnOptions: ReferenceCodeOption<UseYn>[];
}>();

const emit = defineEmits<{
  (event: 'success', message: string): void;
  (event: 'error', message: string): void;
}>();

const { codeForm, codeRows, isSubmitting, createCode } =
  useCommonCodeAdminPanel(props, emit);
</script>

<template>
  <div class="admin-grid">
    <form class="content-card form-grid" @submit.prevent="createCode">
      <div>
        <p class="eyebrow">NEW CODE</p>
        <h2>공통코드 등록</h2>
      </div>
      <label>
        그룹
        <select v-model.number="codeForm.codeGroupId" required>
          <option
            v-for="group in groups"
            :key="group.codeGroupId"
            :value="group.codeGroupId"
          >
            {{ group.groupName }}
          </option>
        </select>
      </label>
      <label>
        코드
        <input v-model="codeForm.code" required />
      </label>
      <label>
        코드명
        <input v-model="codeForm.codeName" maxlength="50" required />
      </label>
      <label>
        설명
        <textarea v-model="codeForm.description" maxlength="200" rows="3" />
      </label>
      <div class="form-row">
        <label>
          정렬
          <input v-model.number="codeForm.sortOrder" type="number" min="0" />
        </label>
        <label>
          사용 여부
          <select v-model="codeForm.useYn">
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
      <button type="submit" :disabled="isSubmitting || groups.length === 0">
        등록
      </button>
    </form>

    <article class="content-card table-card">
      <div class="section-heading">
        <div>
          <p class="eyebrow">CODES</p>
          <h2>공통코드 목록</h2>
        </div>
        <span class="count-badge">{{ codes.length }}</span>
      </div>
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>그룹</th>
              <th>코드</th>
              <th>코드명</th>
              <th>정렬</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="code in codeRows" :key="code.codeId">
              <td>{{ code.codeId }}</td>
              <td>{{ code.groupName }}</td>
              <td>{{ code.code }}</td>
              <td>{{ code.codeName }}</td>
              <td>{{ code.sortOrder }}</td>
              <td>
                <span class="status-badge">{{ code.useYnText }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </div>
</template>
