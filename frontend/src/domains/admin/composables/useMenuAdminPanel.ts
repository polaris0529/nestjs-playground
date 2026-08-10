import { computed, reactive, ref } from 'vue';
import type { ReferenceCodeOption } from '../../../shared/reference-codes';
import { formatUseYnLabel } from '../formatters';
import { getAdminErrorMessage } from '../messages';
import { useAdminStore } from '../service';
import type { Menu, UseYn } from '../types';

interface MenuAdminPanelProps {
  menus: Menu[];
  menuTypeOptions: ReferenceCodeOption[];
  openTypeOptions: ReferenceCodeOption[];
  useYnOptions: ReferenceCodeOption<UseYn>[];
}

type AdminPanelEmit = (event: 'success' | 'error', message: string) => void;

export function useMenuAdminPanel(
  props: MenuAdminPanelProps,
  emit: AdminPanelEmit,
) {
  const adminStore = useAdminStore();
  const isSubmitting = ref(false);
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

  const activeMenus = computed(() =>
    props.menus.filter((menu) => menu.useYn === 'Y'),
  );
  const menuRows = computed(() =>
    props.menus.map((menu) => ({
      ...menu,
      useYnText: formatUseYnLabel(menu.useYn, props.useYnOptions),
    })),
  );

  function resetMenuForm(): void {
    menuForm.parentMenuId = 0;
    menuForm.menuCode = '';
    menuForm.menuName = '';
    menuForm.menuUrl = '';
    menuForm.menuType = props.menuTypeOptions[0]?.value ?? 'PAGE';
    menuForm.openType = props.openTypeOptions[0]?.value ?? 'SELF';
    menuForm.sortOrder = 0;
    menuForm.useYn = props.useYnOptions[0]?.value ?? 'Y';
  }

  async function createMenu(): Promise<void> {
    isSubmitting.value = true;

    try {
      await adminStore.createMenu({
        parentMenuId: menuForm.parentMenuId,
        menuCode: menuForm.menuCode,
        menuName: menuForm.menuName,
        menuUrl: menuForm.menuUrl || null,
        menuType: menuForm.menuType,
        openType: menuForm.openType || null,
        sortOrder: menuForm.sortOrder,
        useYn: menuForm.useYn,
      });
      resetMenuForm();
      emit('success', '메뉴를 등록했습니다.');
    } catch (error) {
      emit('error', getAdminErrorMessage(error));
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    activeMenus,
    menuForm,
    menuRows,
    isSubmitting,
    createMenu,
  };
}
