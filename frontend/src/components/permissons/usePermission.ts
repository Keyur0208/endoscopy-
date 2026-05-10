import { useAbility } from 'src/context/ability-provider';

import { useAuthContext } from 'src/auth/hooks';

import { CheckPermission } from './check-permission';

export const usePermission = () => {
  const ability = useAbility();
  const { user } = useAuthContext();

  const hasPermission = (permissionKey: string): boolean => {
    if (user?.isAdmin) return true; // Admin always has access
    if (!permissionKey) return false;

    const { hasPermission: canAccess } = CheckPermission(ability, permissionKey);

    return canAccess;
  };

  return { hasPermission };
};
