export interface LayoutUser {
  loginId: string;
  roles: string[];
}

export interface NavItem {
  to: string;
  label: string;
  adminOnly?: boolean;
}
