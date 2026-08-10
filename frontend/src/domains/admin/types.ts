export type UseYn = 'Y' | 'N';
export type AdminTab = 'accounts' | 'menus' | 'groups' | 'codes';

export interface AdminTabItem {
  key: AdminTab;
  label: string;
  count: number;
}

export interface Account {
  accountId: number;
  loginId: string;
  accountName: string;
  useYn: UseYn;
  lastLoginAt: string | null;
  roles: string[];
}

export interface Menu {
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

export interface CommonCodeGroup {
  codeGroupId: number;
  groupCode: string;
  groupName: string;
  description: string | null;
  useYn: UseYn;
}

export interface CommonCode {
  codeId: number;
  codeGroupId: number;
  code: string;
  codeName: string;
  description: string | null;
  sortOrder: number;
  useYn: UseYn;
  codeGroup?: CommonCodeGroup;
}

export interface CreateAccountRequest {
  loginId: string;
  password: string;
  accountName: string;
  roleCode: string;
  useYn: UseYn;
}

export interface CreateMenuRequest {
  parentMenuId: number;
  menuCode: string;
  menuName: string;
  menuUrl: string | null;
  menuType: string;
  openType: string | null;
  sortOrder: number;
  useYn: UseYn;
}

export interface CreateCommonCodeGroupRequest {
  groupCode: string;
  groupName: string;
  description: string | null;
  useYn: UseYn;
}

export interface CreateCommonCodeRequest {
  codeGroupId: number;
  code: string;
  codeName: string;
  description: string | null;
  sortOrder: number;
  useYn: UseYn;
}
