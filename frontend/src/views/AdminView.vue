<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { requestJson } from '../api/http';

type UseYn = 'Y' | 'N';
type AdminTab = 'accounts' | 'menus' | 'groups' | 'codes';

interface Account {
  accountId: number;
  loginId: string;
  accountName: string;
  useYn: UseYn;
  lastLoginAt: string | null;
  roles: string[];
}

interface Menu {
  menuId: number;
  parentMenuId: number;
  menuCode: string;
  menuName: string;
  menuUrl: string | null;
  menuType: string;
  openType: string | null;
  menuLevel: number;
  sortOrder: number;
  useYn: UseYn;
}

interface CommonCodeGroup {
  codeGroupId: number;
  groupCode: string;
  groupName: string;
  description: string | null;
  useYn: UseYn;
}

interface CommonCode {
  codeId: number;
  codeGroupId: number;
  code: string;
  codeName: string;
  description: string | null;
  sortOrder: number;
  useYn: UseYn;
  codeGroup?: CommonCodeGroup;
}

const tabs: { key: AdminTab; label: string }[] = [
  { key: 'accounts', label: '계정' },
  { key: 'menus', label: '메뉴' },
  { key: 'groups', label: '코드 그룹' },
  { key: 'codes', label: '공통코드' },
];

const activeTab = ref<AdminTab>('accounts');
const accounts = ref<Account[]>([]);
const menus = ref<Menu[]>([]);
const groups = ref<CommonCodeGroup[]>([]);
const codes = ref<CommonCode[]>([]);
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);
const isSubmitting = ref(false);

const accountForm = reactive({
  loginId: '',
  password: '',
  accountName: '',
  roleCode: 'USER',
  useYn: 'Y' as UseYn,
});
const menuForm = reactive({
  parentMenuId: 0,
  menuCode: '',
  menuName: '',
  menuUrl: '',
  menuType: 'PAGE',
  openType: 'SELF',
  sortOrder: 0,
  useYn: 'Y' as UseYn,
});
const groupForm = reactive({
  groupCode: '',
  groupName: '',
  description: '',
  useYn: 'Y' as UseYn,
});
const codeForm = reactive({
  codeGroupId: 0,
  code: '',
  codeName: '',
  description: '',
  sortOrder: 0,
  useYn: 'Y' as UseYn,
});

const activeMenus = computed(() =>
  menus.value.filter((menu) => menu.useYn === 'Y'),
);

function tabCount(tab: AdminTab): number {
  const counts: Record<AdminTab, number> = {
    accounts: accounts.value.length,
    menus: menus.value.length,
    groups: groups.value.length,
    codes: codes.value.length,
  };
  return counts[tab];
}

function roleText(roles: string[] | undefined): string {
  return roles?.join(', ') || 'USER';
}

function useYnLabel(useYn: UseYn): string {
  return useYn === 'Y' ? '사용' : '미사용';
}

function groupName(code: CommonCode): string {
  return (
    code.codeGroup?.groupName ??
    groups.value.find(
      (group) => String(group.codeGroupId) === String(code.codeGroupId),
    )?.groupName ??
    '-'
  );
}

function resetAccountForm() {
  accountForm.loginId = '';
  accountForm.password = '';
  accountForm.accountName = '';
  accountForm.roleCode = 'USER';
  accountForm.useYn = 'Y';
}

function resetMenuForm() {
  menuForm.parentMenuId = 0;
  menuForm.menuCode = '';
  menuForm.menuName = '';
  menuForm.menuUrl = '';
  menuForm.menuType = 'PAGE';
  menuForm.openType = 'SELF';
  menuForm.sortOrder = 0;
  menuForm.useYn = 'Y';
}

function resetGroupForm() {
  groupForm.groupCode = '';
  groupForm.groupName = '';
  groupForm.description = '';
  groupForm.useYn = 'Y';
}

function resetCodeForm() {
  codeForm.codeGroupId = groups.value[0]?.codeGroupId ?? 0;
  codeForm.code = '';
  codeForm.codeName = '';
  codeForm.description = '';
  codeForm.sortOrder = 0;
  codeForm.useYn = 'Y';
}

async function loadAdminData() {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    const [accountPayload, menuPayload, groupPayload, codePayload] =
      await Promise.all([
        requestJson<Account[]>('/api/account/accounts'),
        requestJson<Menu[]>('/api/menu/items'),
        requestJson<CommonCodeGroup[]>('/api/common-code/groups'),
        requestJson<CommonCode[]>('/api/common-code/codes'),
      ]);
    accounts.value = accountPayload;
    menus.value = menuPayload;
    groups.value = groupPayload;
    codes.value = codePayload;
    if (!codeForm.codeGroupId && groupPayload[0]) {
      codeForm.codeGroupId = groupPayload[0].codeGroupId;
    }
  } catch (error) {
    errorMessage.value =
      error instanceof Error && error.message
        ? error.message
        : '관리 정보를 불러오지 못했습니다.';
  } finally {
    isLoading.value = false;
  }
}

async function submitMutation(
  successText: string,
  mutation: () => Promise<void>,
) {
  errorMessage.value = '';
  successMessage.value = '';
  isSubmitting.value = true;

  try {
    await mutation();
    successMessage.value = successText;
    await loadAdminData();
  } catch (error) {
    errorMessage.value =
      error instanceof Error && error.message
        ? error.message
        : '요청 처리에 실패했습니다.';
  } finally {
    isSubmitting.value = false;
  }
}

async function createAccount() {
  await submitMutation('계정을 등록했습니다.', async () => {
    await requestJson('/api/account/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accountForm),
    });
    resetAccountForm();
  });
}

async function createMenu() {
  await submitMutation('메뉴를 등록했습니다.', async () => {
    await requestJson('/api/menu/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...menuForm,
        menuUrl: menuForm.menuUrl || null,
        openType: menuForm.openType || null,
      }),
    });
    resetMenuForm();
  });
}

async function createGroup() {
  await submitMutation('공통코드 그룹을 등록했습니다.', async () => {
    await requestJson('/api/common-code/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...groupForm,
        description: groupForm.description || null,
      }),
    });
    resetGroupForm();
  });
}

async function createCode() {
  await submitMutation('공통코드를 등록했습니다.', async () => {
    await requestJson('/api/common-code/codes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...codeForm,
        description: codeForm.description || null,
      }),
    });
    resetCodeForm();
  });
}

onMounted(loadAdminData);
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
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-button"
        :class="{ 'is-active': activeTab === tab.key }"
        type="button"
        role="tab"
        :aria-selected="activeTab === tab.key"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
        <span>{{ tabCount(tab.key) }}</span>
      </button>
    </div>

    <div v-if="activeTab === 'accounts'" class="admin-grid">
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
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>
          <label>
            사용 여부
            <select v-model="accountForm.useYn">
              <option value="Y">사용</option>
              <option value="N">미사용</option>
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
              <tr v-for="account in accounts" :key="account.accountId">
                <td>{{ account.accountId }}</td>
                <td>{{ account.loginId }}</td>
                <td>{{ account.accountName }}</td>
                <td>{{ roleText(account.roles) }}</td>
                <td>
                  <span class="status-badge">{{
                    useYnLabel(account.useYn)
                  }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>

    <div v-else-if="activeTab === 'menus'" class="admin-grid">
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
            <input v-model="menuForm.menuType" required />
          </label>
          <label>
            정렬
            <input v-model.number="menuForm.sortOrder" type="number" min="0" />
          </label>
        </div>
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
              <tr v-for="menu in menus" :key="menu.menuId">
                <td>{{ menu.menuId }}</td>
                <td>{{ menu.menuCode }}</td>
                <td>{{ menu.menuName }}</td>
                <td>{{ menu.menuUrl || '-' }}</td>
                <td>{{ menu.menuLevel }}</td>
                <td>
                  <span class="status-badge">{{ useYnLabel(menu.useYn) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>

    <div v-else-if="activeTab === 'groups'" class="admin-grid">
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
            <option value="Y">사용</option>
            <option value="N">미사용</option>
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
              <tr v-for="group in groups" :key="group.codeGroupId">
                <td>{{ group.codeGroupId }}</td>
                <td>{{ group.groupCode }}</td>
                <td>{{ group.groupName }}</td>
                <td>{{ group.description || '-' }}</td>
                <td>
                  <span class="status-badge">{{
                    useYnLabel(group.useYn)
                  }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>

    <div v-else class="admin-grid">
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
              <option value="Y">사용</option>
              <option value="N">미사용</option>
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
              <tr v-for="code in codes" :key="code.codeId">
                <td>{{ code.codeId }}</td>
                <td>{{ groupName(code) }}</td>
                <td>{{ code.code }}</td>
                <td>{{ code.codeName }}</td>
                <td>{{ code.sortOrder }}</td>
                <td>
                  <span class="status-badge">{{ useYnLabel(code.useYn) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>
  </section>
</template>
