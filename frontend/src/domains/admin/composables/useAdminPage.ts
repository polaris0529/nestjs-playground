import { computed, onMounted, ref } from 'vue';
import { getAdminErrorMessage } from '../messages';
import { useAdminStore } from '../service';
import type { AdminTab, AdminTabItem } from '../types';
import { useAdminReferenceOptions } from './useAdminReferenceOptions';

const tabs: Omit<AdminTabItem, 'count'>[] = [
  { key: 'accounts', label: '계정' },
  { key: 'menus', label: '메뉴' },
  { key: 'groups', label: '코드 그룹' },
  { key: 'codes', label: '공통코드' },
];

export function useAdminPage() {
  const adminStore = useAdminStore();
  const referenceOptions = useAdminReferenceOptions();
  const activeTab = ref<AdminTab>('accounts');
  const errorMessage = ref('');
  const successMessage = ref('');
  const isLoading = ref(false);

  const tabCounts = computed<Record<AdminTab, number>>(() => ({
    accounts: adminStore.accounts.value.length,
    menus: adminStore.menus.value.length,
    groups: adminStore.groups.value.length,
    codes: adminStore.codes.value.length,
  }));
  const tabsWithCount = computed<AdminTabItem[]>(() =>
    tabs.map((tab) => ({
      ...tab,
      count: tabCounts.value[tab.key],
    })),
  );

  async function loadAdminData(): Promise<void> {
    errorMessage.value = '';
    isLoading.value = true;

    try {
      await Promise.all([
        adminStore.fetchAccounts(),
        adminStore.fetchMenus(),
        adminStore.fetchGroups(),
        adminStore.fetchCodes(),
        referenceOptions.fetchAdminReferenceOptions(),
      ]);
    } catch (error) {
      errorMessage.value = getAdminErrorMessage(
        error,
        '관리 정보를 불러오지 못했습니다.',
      );
    } finally {
      isLoading.value = false;
    }
  }

  function reportSuccess(message: string): void {
    errorMessage.value = '';
    successMessage.value = message;
  }

  function reportError(message: string): void {
    successMessage.value = '';
    errorMessage.value = message;
  }

  onMounted(loadAdminData);

  return {
    adminStore,
    roleOptions: referenceOptions.roleOptions,
    useYnOptions: referenceOptions.useYnOptions,
    menuTypeOptions: referenceOptions.menuTypeOptions,
    openTypeOptions: referenceOptions.openTypeOptions,
    activeTab,
    errorMessage,
    successMessage,
    isLoading,
    tabsWithCount,
    loadAdminData,
    reportSuccess,
    reportError,
  };
}
