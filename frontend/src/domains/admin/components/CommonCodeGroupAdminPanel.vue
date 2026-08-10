<script setup lang="ts">
import type { ReferenceCodeOption } from '../../../shared/reference-codes';
import { useCommonCodeGroupAdminPanel } from '../composables/useCommonCodeGroupAdminPanel';
import type { CommonCodeGroup, UseYn } from '../types';

const props = defineProps<{
  groups: CommonCodeGroup[];
  useYnOptions: ReferenceCodeOption<UseYn>[];
}>();

const emit = defineEmits<{
  (event: 'success', message: string): void;
  (event: 'error', message: string): void;
}>();

const { groupForm, groupRows, isSubmitting, createGroup } =
  useCommonCodeGroupAdminPanel(props, emit);
</script>

<template>
  <div class="admin-grid">
    <form class="content-card form-grid" @submit.prevent="createGroup">
      <div>
        <p class="eyebrow">NEW GROUP</p>
        <h2>공통코드 그룹 등록</h2>
      </div>
      <label>
        그룹 코드
        <input v-model="groupForm.groupCode" required />
      </label>
      <label>
        그룹명
        <input v-model="groupForm.groupName" maxlength="50" required />
      </label>
      <label>
        설명
        <textarea v-model="groupForm.description" maxlength="200" rows="3" />
      </label>
      <label>
        사용 여부
        <select v-model="groupForm.useYn">
          <option
            v-for="option in useYnOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>
      <button type="submit" :disabled="isSubmitting">등록</button>
    </form>

    <article class="content-card table-card">
      <div class="section-heading">
        <div>
          <p class="eyebrow">CODE GROUPS</p>
          <h2>공통코드 그룹 목록</h2>
        </div>
        <span class="count-badge">{{ groups.length }}</span>
      </div>
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>그룹 코드</th>
              <th>그룹명</th>
              <th>설명</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="group in groupRows" :key="group.codeGroupId">
              <td>{{ group.codeGroupId }}</td>
              <td>{{ group.groupCode }}</td>
              <td>{{ group.groupName }}</td>
              <td>{{ group.description || '-' }}</td>
              <td>
                <span class="status-badge">{{ group.useYnText }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </div>
</template>
