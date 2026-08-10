import { ref } from 'vue';
import {
  fetchReferenceCodeOptions,
  type ReferenceCodeOption,
} from '../../../shared/reference-codes';
import type { UseYn } from '../types';

const roleOptions = ref<ReferenceCodeOption[]>([]);
const useYnOptions = ref<ReferenceCodeOption<UseYn>[]>([]);
const menuTypeOptions = ref<ReferenceCodeOption[]>([]);
const openTypeOptions = ref<ReferenceCodeOption[]>([]);

export function useAdminReferenceOptions() {
  async function fetchAdminReferenceOptions(): Promise<void> {
    const [roles, useYn, menuTypes, openTypes] = await Promise.all([
      fetchReferenceCodeOptions('ROLE_TYPE'),
      fetchReferenceCodeOptions<UseYn>('USE_YN'),
      fetchReferenceCodeOptions('MENU_TYPE'),
      fetchReferenceCodeOptions('OPEN_TYPE'),
    ]);

    roleOptions.value = roles;
    useYnOptions.value = useYn;
    menuTypeOptions.value = menuTypes;
    openTypeOptions.value = openTypes;
  }

  return {
    roleOptions,
    useYnOptions,
    menuTypeOptions,
    openTypeOptions,
    fetchAdminReferenceOptions,
  };
}
