import type { AppAbility } from 'src/components/permissons/ability';

import { useMemo, useContext, createContext } from 'react';

import { createAppAbility } from 'src/components/permissons/ability';

import { useAuthContext } from 'src/auth/hooks';

const AbilityContext = createContext<AppAbility>(createAppAbility(false, []));

export const AbilityProvider = ({ children }: any) => {
  const { user } = useAuthContext();

  const ability = useMemo(() => {
    const isAdmin = user?.isAdmin ?? false;

    // const permissionKeys: string[] =
    //   user?.policy?.permissions?.map((perm: any) => perm.permissionKey) ?? [];

    const permissionKeys: string[] = [];

    return createAppAbility(isAdmin, permissionKeys);
  }, [user]);

  return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>;
};

export const useAbility = () => useContext(AbilityContext);
