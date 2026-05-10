import type { ReactElement } from 'react';

import { Navigate } from 'react-router-dom';

import { paths } from 'src/routes/paths';

import { usePermission } from 'src/components/permissons/usePermission';

// ----------------------------------------------------------------------

export type PermissionBasedGuardProps = {
  element: ReactElement;
  requiredPermissions?: string | string[];
};

/**
 * PermissionBasedGuard for protecting routes based on user permissions
 *
 * @param element - The component to render if permissions are valid
 * @param requiredPermissions - Single permission key or array of permission keys
 *
 * Permission format: "subject:action" (e.g., "organization:list")
 */
export function PermissionBasedGuard({ requiredPermissions, element }: PermissionBasedGuardProps) {
  const { hasPermission } = usePermission();

  const allowed = requiredPermissions
    ? Array.isArray(requiredPermissions)
      ? requiredPermissions.some((p) => hasPermission(p))
      : hasPermission(requiredPermissions)
    : true;

  // If permission check fails, redirect to fallback path
  if (!allowed) {
    return <Navigate to={paths.permissionNotFound} replace />;
  }

  return element;
}
