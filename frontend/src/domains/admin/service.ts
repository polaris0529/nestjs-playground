import { ref } from 'vue';
import { requestJson } from '../../shared/api/http';
import type {
  Account,
  CommonCode,
  CommonCodeGroup,
  CreateAccountRequest,
  CreateCommonCodeGroupRequest,
  CreateCommonCodeRequest,
  CreateMenuRequest,
  Menu,
} from './types';

const accounts = ref<Account[]>([]);
const menus = ref<Menu[]>([]);
const groups = ref<CommonCodeGroup[]>([]);
const codes = ref<CommonCode[]>([]);

export function useAdminStore() {
  async function fetchAccounts(): Promise<void> {
    accounts.value = await requestJson<Account[]>('/api/account/accounts');
  }

  async function fetchMenus(): Promise<void> {
    menus.value = await requestJson<Menu[]>('/api/menu/items');
  }

  async function fetchGroups(): Promise<void> {
    groups.value = await requestJson<CommonCodeGroup[]>(
      '/api/common-code/groups',
    );
  }

  async function fetchCodes(): Promise<void> {
    codes.value = await requestJson<CommonCode[]>('/api/common-code/codes');
  }

  async function createAccount(payload: CreateAccountRequest): Promise<void> {
    await requestJson('/api/account/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    await fetchAccounts();
  }

  async function createMenu(payload: CreateMenuRequest): Promise<void> {
    await requestJson('/api/menu/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    await fetchMenus();
  }

  async function createGroup(
    payload: CreateCommonCodeGroupRequest,
  ): Promise<void> {
    await requestJson('/api/common-code/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    await fetchGroups();
  }

  async function createCode(payload: CreateCommonCodeRequest): Promise<void> {
    await requestJson('/api/common-code/codes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    await fetchCodes();
  }

  return {
    accounts,
    menus,
    groups,
    codes,
    fetchAccounts,
    fetchMenus,
    fetchGroups,
    fetchCodes,
    createAccount,
    createMenu,
    createGroup,
    createCode,
  };
}
