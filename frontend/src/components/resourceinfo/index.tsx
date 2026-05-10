import type { IResourceInfo } from 'src/types/user';

export const parseResourceInfo = (resourceInfoStr: string): IResourceInfo | null => {
  try {
    const arr = JSON.parse(resourceInfoStr);
    if (Array.isArray(arr) && arr.length >= 4) {
      const organizationPart = arr[4] || '';
      const organizationId = organizationPart.startsWith('organization:')
        ? organizationPart.replace('organization:', '')
        : organizationPart;

      const branchPart = arr[5] || '';
      const brandId = branchPart.startsWith('branch:')
        ? branchPart.replace('branch:', '')
        : branchPart;

      return {
        pcName: arr[0],
        username: arr[1],
        ipAddress: arr[2],
        macAddress: arr[3],
        organizationId: organizationId === 'undefined' ? null : organizationId,
        brandId: brandId === 'undefined' ? null : brandId,
      };
    }
    return null;
  } catch {
    return null;
  }
};
