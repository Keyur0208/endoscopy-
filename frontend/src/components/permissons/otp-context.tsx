import type { ReactNode } from 'react';

import React, { useMemo, useState, useContext, createContext } from 'react';

type OtpContextType = {
  verifiedPermissions: Record<string, boolean>;
  markVerified: (key: string) => void;
  resetVerified: (key?: string) => void;
};

const OtpContext = createContext<OtpContextType | null>(null);

export const OtpProvider = ({ children }: { children: ReactNode }) => {
  const [verifiedPermissions, setVerifiedPermissions] = useState<Record<string, boolean>>({});

  const markVerified = (key: string) => {
    setVerifiedPermissions((prev) => ({ ...prev, [key]: true }));
  };

  const resetVerified = (key?: string) => {
    if (key) {
      setVerifiedPermissions((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    } else {
      setVerifiedPermissions({});
    }
  };

  const value = useMemo(
    () => ({ verifiedPermissions, markVerified, resetVerified }),
    [verifiedPermissions]
  );

  return <OtpContext.Provider value={value}>{children}</OtpContext.Provider>;
};

export const useOtpContext = () => {
  const ctx = useContext(OtpContext);
  if (!ctx) throw new Error('useOtpContext must be used inside OtpProvider');
  return ctx;
};
