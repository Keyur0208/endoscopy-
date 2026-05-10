import type { IOrganizationItem } from './organization';

// Type for viewing a Branch
export type IOrganizationBranchItem = {
  id: number;
  organizationId: number;
  organization: IOrganizationItem;
  code?: string | null;
  isDefault: boolean;
  legalName?: string | null;
  name: string;
  address?: string | null;
  logoImage?: string | null;
  bannerImage?: string | null;
  phoneNumber?: string | null;
  mobile?: string | null;
  email: string;
  website?: string | null;
  rohiniId?: string | null;
  gstNo?: string | null;
  jurisdiction?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipCode?: string | null;
  isActive: boolean;
  timezone?: string | null;
  createdAt: string;
  updatedAt: string;
};

// Type for creating a Branch
export type ICreateOrganizationBranchItem = {
  organizationId: number;
  name: string;
  email: string;
  code?: string | null;
  isDefault?: boolean;
  legalName?: string | null;
  address?: string | null;
  logoImage?: string | null;
  bannerImage?: string | null;
  phoneNumber?: string | null;
  mobile?: string | null;
  website?: string | null;
  rohiniId?: string | null;
  gstNo?: string | null;
  jurisdiction?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipCode?: string | null;
  isActive?: boolean;
  timezone?: string | null;
};

// Type for updating a Branch
export type IUpdateOrganizationBranchItem = {
  id: number;
  organizationId?: number;
  name?: string;
  email?: string;
  code?: string | null;
  isDefault?: boolean;
  legalName?: string | null;
  address?: string | null;
  logoImage?: string | null;
  bannerImage?: string | null;
  phoneNumber?: string | null;
  mobile?: string | null;
  website?: string | null;
  rohiniId?: string | null;
  gstNo?: string | null;
  jurisdiction?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipCode?: string | null;
  isActive?: boolean;
  timezone?: string | null;
};
