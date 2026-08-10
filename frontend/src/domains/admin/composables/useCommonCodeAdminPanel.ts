import { computed, reactive, ref, watch } from 'vue';
import type { ReferenceCodeOption } from '../../../shared/reference-codes';
import { formatUseYnLabel, resolveCommonCodeGroupName } from '../formatters';
import { getAdminErrorMessage } from '../messages';
import { useAdminStore } from '../service';
import type { CommonCode, CommonCodeGroup, UseYn } from '../types';

interface CommonCodePanelProps {
  groups: CommonCodeGroup[];
  codes: CommonCode[];
  useYnOptions: ReferenceCodeOption<UseYn>[];
}

type AdminPanelEmit = (event: 'success' | 'error', message: string) => void;

export function useCommonCodeAdminPanel(
  props: CommonCodePanelProps,
  emit: AdminPanelEmit,
) {
  const adminStore = useAdminStore();
  const isSubmitting = ref(false);
  const codeForm = reactive({
    codeGroupId: 0,
    code: '',
    codeName: '',
    description: '',
    sortOrder: 0,
    useYn: 'Y' as UseYn,
  });

  const codeRows = computed(() =>
    props.codes.map((code) => ({
      ...code,
      groupName: resolveCommonCodeGroupName(code, props.groups),
      useYnText: formatUseYnLabel(code.useYn, props.useYnOptions),
    })),
  );

  function syncDefaultGroup(): void {
    if (!codeForm.codeGroupId && props.groups[0]) {
      codeForm.codeGroupId = props.groups[0].codeGroupId;
    }
  }

  function resetCodeForm(): void {
    codeForm.codeGroupId = props.groups[0]?.codeGroupId ?? 0;
    codeForm.code = '';
    codeForm.codeName = '';
    codeForm.description = '';
    codeForm.sortOrder = 0;
    codeForm.useYn = props.useYnOptions[0]?.value ?? 'Y';
  }

  async function createCode(): Promise<void> {
    isSubmitting.value = true;

    try {
      await adminStore.createCode({
        codeGroupId: codeForm.codeGroupId,
        code: codeForm.code,
        codeName: codeForm.codeName,
        description: codeForm.description || null,
        sortOrder: codeForm.sortOrder,
        useYn: codeForm.useYn,
      });
      resetCodeForm();
      emit('success', '공통코드를 등록했습니다.');
    } catch (error) {
      emit('error', getAdminErrorMessage(error));
    } finally {
      isSubmitting.value = false;
    }
  }

  watch(() => props.groups, syncDefaultGroup, { immediate: true });

  return {
    codeForm,
    codeRows,
    isSubmitting,
    createCode,
  };
}
