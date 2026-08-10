import { computed, reactive, ref } from 'vue';
import type { ReferenceCodeOption } from '../../../shared/reference-codes';
import { formatUseYnLabel } from '../formatters';
import { getAdminErrorMessage } from '../messages';
import { useAdminStore } from '../service';
import type { CommonCodeGroup, UseYn } from '../types';

interface CommonCodeGroupPanelProps {
  groups: CommonCodeGroup[];
  useYnOptions: ReferenceCodeOption<UseYn>[];
}

type AdminPanelEmit = (event: 'success' | 'error', message: string) => void;

export function useCommonCodeGroupAdminPanel(
  props: CommonCodeGroupPanelProps,
  emit: AdminPanelEmit,
) {
  const adminStore = useAdminStore();
  const isSubmitting = ref(false);
  const groupForm = reactive({
    groupCode: '',
    groupName: '',
    description: '',
    useYn: 'Y' as UseYn,
  });

  const groupRows = computed(() =>
    props.groups.map((group) => ({
      ...group,
      useYnText: formatUseYnLabel(group.useYn, props.useYnOptions),
    })),
  );

  function resetGroupForm(): void {
    groupForm.groupCode = '';
    groupForm.groupName = '';
    groupForm.description = '';
    groupForm.useYn = props.useYnOptions[0]?.value ?? 'Y';
  }

  async function createGroup(): Promise<void> {
    isSubmitting.value = true;

    try {
      await adminStore.createGroup({
        groupCode: groupForm.groupCode,
        groupName: groupForm.groupName,
        description: groupForm.description || null,
        useYn: groupForm.useYn,
      });
      resetGroupForm();
      emit('success', '공통코드 그룹을 등록했습니다.');
    } catch (error) {
      emit('error', getAdminErrorMessage(error));
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    groupForm,
    groupRows,
    isSubmitting,
    createGroup,
  };
}
