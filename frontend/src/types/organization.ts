import type { IResourceInfo } from './user';

// Type for viewing an Organization
export type IOrganizationItem = {
  id: number;
  name: string;
  bannerImage: string;
  logoImage: string;
  legalName: string;
  email: string;
  mobile: string;
  licenseKey: string;
  licenseType: string;
  expiryDate: string;
  status: string;
  isActive: boolean;
  resourceInfo: IResourceInfo;
  createdBy: number | null;
  updatedBy: number | null;
  createdByAdmin: number | null;
  updatedByAdmin: number | null;
  createdAt: string;
  updatedAt: string;
};

// Type for creating an Organization
export type ICreateOrganizationItem = {
  name: string;
  bannerImage?: string;
  logoImage?: string;
  legalName?: string;
  email: string;
  mobile?: string;
  licenseKey?: string;
  licenseType?: string;
  expiryDate?: string;
  status?: string;
  isActive?: boolean;
};

// Type for updating an Organization
export type IUpdateOrganizationItem = {
  id: number;
  name: string;
  bannerImage?: string;
  logoImage?: string;
  legalName?: string;
  email: string;
  mobile?: string;
  licenseKey?: string;
  licenseType?: string;
  expiryDate?: string;
  status?: string;
  isActive?: boolean;
};
