import { computed, reactive, ref } from 'vue';
import type { ReferenceCodeOption } from '../../../shared/reference-codes';
import { formatRoleText, formatUseYnLabel } from '../formatters';
import { getAdminErrorMessage } from '../messages';
import { useAdminStore } from '../service';
import type { Account, UseYn } from '../types';

interface AccountAdminPanelProps {
  accounts: Account[];
  roleOptions: ReferenceCodeOption[];
  useYnOptions: ReferenceCodeOption<UseYn>[];
}

type AdminPanelEmit = (event: 'success' | 'error', message: string) => void;

export function useAccountAdminPanel(
  props: AccountAdminPanelProps,
  emit: AdminPanelEmit,
) {
  const adminStore = useAdminStore();
  const isSubmitting = ref(false);
  const accountForm = reactive({
    loginId: '',
    password: '',
    accountName: '',
    roleCode: 'USER',
    useYn: 'Y' as UseYn,
  });

  const accountRows = computed(() =>
    props.accounts.map((account) => ({
      ...account,
      roleText: formatRoleText(account.roles, props.roleOptions),
      useYnText: formatUseYnLabel(account.useYn, props.useYnOptions),
    })),
  );

  function resetAccountForm(): void {
    accountForm.loginId = '';
    accountForm.password = '';
    accountForm.accountName = '';
    accountForm.roleCode = props.roleOptions[0]?.value ?? 'USER';
    accountForm.useYn = props.useYnOptions[0]?.value ?? 'Y';
  }

  async function createAccount(): Promise<void> {
    isSubmitting.value = true;

    try {
      await adminStore.createAccount({
        loginId: accountForm.loginId,
        password: accountForm.password,
        accountName: accountForm.accountName,
        roleCode: accountForm.roleCode,
        useYn: accountForm.useYn,
      });
      resetAccountForm();
      emit('success', '계정을 등록했습니다.');
    } catch (error) {
      emit('error', getAdminErrorMessage(error));
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    accountForm,
    accountRows,
    isSubmitting,
    createAccount,
  };
}
