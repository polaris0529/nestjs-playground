<script setup lang="ts">
import type { ReferenceCodeOption } from '../../../shared/reference-codes';
import { useMenuAdminPanel } from '../composables/useMenuAdminPanel';
import type { Menu, UseYn } from '../types';

const props = defineProps<{
  menus: Menu[];
  menuTypeOptions: ReferenceCodeOption[];
  openTypeOptions: ReferenceCodeOption[];
  useYnOptions: ReferenceCodeOption<UseYn>[];
}>();

const emit = defineEmits<{
  (event: 'success', message: string): void;
  (event: 'error', message: string): void;
}>();

const { activeMenus, menuForm, menuRows, isSubmitting, createMenu } =
  useMenuAdminPanel(props, emit);
</script>

<template>
  <div class="admin-grid">
    <form class="content-card form-grid" @submit.prevent="createMenu">
      <div>
        <p class="eyebrow">NEW MENU</p>
        <h2>메뉴 등록</h2>
      </div>
      <label>
        상위 메뉴
        <select v-model.number="menuForm.parentMenuId">
          <option :value="0">최상위</option>
          <option
            v-for="menu in activeMenus"
            :key="menu.menuId"
            :value="menu.menuId"
          >
            {{ menu.menuName }}
          </option>
        </select>
      </label>
      <label>
        메뉴 코드
        <input v-model="menuForm.menuCode" required />
      </label>
      <label>
        메뉴명
        <input v-model="menuForm.menuName" maxlength="50" required />
      </label>
      <label>
        URL
        <input v-model="menuForm.menuUrl" maxlength="200" />
      </label>
      <div class="form-row">
        <label>
          유형
          <select v-model="menuForm.menuType">
            <option
              v-for="option in menuTypeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </label>
        <label>
          열기 방식
          <select v-model="menuForm.openType">
            <option
              v-for="option in openTypeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </label>
        <label>
          정렬
          <input v-model.number="menuForm.sortOrder" type="number" min="0" />
        </label>
      </div>
      <label>
        사용 여부
        <select v-model="menuForm.useYn">
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
          <p class="eyebrow">MENUS</p>
          <h2>메뉴 목록</h2>
        </div>
        <span class="count-badge">{{ menus.length }}</span>
      </div>
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>코드</th>
              <th>메뉴명</th>
              <th>URL</th>
              <th>레벨</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="menu in menuRows" :key="menu.menuId">
              <td>{{ menu.menuId }}</td>
              <td>{{ menu.menuCode }}</td>
              <td>{{ menu.menuName }}</td>
              <td>{{ menu.menuUrl || '-' }}</td>
              <td>{{ menu.menuLevel }}</td>
              <td>
                <span class="status-badge">{{ menu.useYnText }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </div>
</template>
