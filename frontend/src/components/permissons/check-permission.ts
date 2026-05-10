import { useAuthContext } from 'src/auth/hooks';

import type { AppAbility } from './ability';

/**
 * Checks permission by splitting a permissionKey like:
 *   "patient_registration:reference_dr_name_edit_with_otp"
 *
 * Returns object:
 * {
 *   hasPermission: boolean,
 *   requiresOtp: boolean
 * }
 */

export const CheckPermission = (ability: AppAbility, permissionKey: string) => {
  const { user } = useAuthContext();

  // Admin
  if (user?.isAdmin) {
    return { hasPermission: true, requiresOtp: false };
  }

  if (!permissionKey) {
    return { hasPermission: false, requiresOtp: false };
  }

  const [subject, action] = permissionKey.split(':') as [string, string];

  const hasPermission = ability.can(action, subject);

  const requiresOtp = action.includes('_with_otp');

  return { hasPermission, requiresOtp };
};
