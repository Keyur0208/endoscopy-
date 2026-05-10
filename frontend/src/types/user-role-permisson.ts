export type IUserRolePermissionItem = {
  id: number;
  roleName: string;
  roleDescription: string;
  roleKey: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  permissions: string[];
  permissionIds: string[];
  isAdmin?: boolean;
};

export type ICreateUserRolePermission = {
  recentRole?: number;
  roleName: string;
  roleDescription: string;
  roleKey: string;
  isDefault?: boolean;
  permissionIds: number[];
};

export type IUpdateUserRolePermission = {
  recentRole?: number;
  roleName?: string;
  roleDescription?: string;
  roleKey?: string;
  isDefault?: boolean;
  permissionIds?: number[];
};
