<script setup lang="ts">
import AccountAdminPanel from './components/AccountAdminPanel.vue';
import CommonCodeAdminPanel from './components/CommonCodeAdminPanel.vue';
import CommonCodeGroupAdminPanel from './components/CommonCodeGroupAdminPanel.vue';
import MenuAdminPanel from './components/MenuAdminPanel.vue';
import { useAdminPage } from './composables/useAdminPage';

const {
  adminStore,
  activeTab,
  errorMessage,
  successMessage,
  isLoading,
  tabsWithCount,
  roleOptions,
  useYnOptions,
  menuTypeOptions,
  openTypeOptions,
  loadAdminData,
  reportSuccess,
  reportError,
} = useAdminPage();

const accounts = adminStore.accounts;
const menus = adminStore.menus;
const groups = adminStore.groups;
const codes = adminStore.codes;
</script>

<template>
  <section class="page-stack">
    <header class="page-header">
      <div>
        <p class="eyebrow">ADMIN</p>
        <h1>관리자</h1>
        <p>
          계정, 메뉴, 공통코드 기준 데이터를 Vue 화면에서 확인하고 신규 항목을
          등록합니다.
        </p>
      </div>
      <button class="secondary-button" type="button" @click="loadAdminData">
        새로고침
      </button>
    </header>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    <p v-if="isLoading" class="muted-text">관리 데이터를 불러오는 중입니다.</p>

    <div class="tab-list" role="tablist" aria-label="관리 메뉴">
      <button
        v-for="tab in tabsWithCount"
        :key="tab.key"
        class="tab-button"
        :class="{ 'is-active': activeTab === tab.key }"
        type="button"
        role="tab"
        :aria-selected="activeTab === tab.key"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
        <span>{{ tab.count }}</span>
      </button>
    </div>

    <AccountAdminPanel
      v-if="activeTab === 'accounts'"
      :accounts="accounts"
      :role-options="roleOptions"
      :use-yn-options="useYnOptions"
      @success="reportSuccess"
      @error="reportError"
    />
    <MenuAdminPanel
      v-else-if="activeTab === 'menus'"
      :menus="menus"
      :menu-type-options="menuTypeOptions"
      :open-type-options="openTypeOptions"
      :use-yn-options="useYnOptions"
      @success="reportSuccess"
      @error="reportError"
    />
    <CommonCodeGroupAdminPanel
      v-else-if="activeTab === 'groups'"
      :groups="groups"
      :use-yn-options="useYnOptions"
      @success="reportSuccess"
      @error="reportError"
    />
    <CommonCodeAdminPanel
      v-else
      :groups="groups"
      :codes="codes"
      :use-yn-options="useYnOptions"
      @success="reportSuccess"
      @error="reportError"
    />
  </section>
</template>

<style scoped>
.tab-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tab-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 14px;
  color: var(--color-text);
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-weight: 700;
}

.tab-button.is-active {
  color: var(--color-card);
  background: var(--color-sidebar-bg);
}

.tab-button span {
  color: inherit;
  font-family: var(--font-family-mono);
  opacity: 0.72;
}

.admin-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 24px;
  align-items: start;
}

@media (max-width: 768px) {
  .admin-grid {
    grid-template-columns: 1fr;
  }
}
</style>
