export interface BranchCreateRequest {
  organizationId: number;
  code?: string | null;
  isDefault?: boolean;
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
  resourceInfo?: string | null;
}

/** Internal create payload — client body + server-set audit fields. */
export interface ICreateBranch extends BranchCreateRequest {
  createdBy?: number | null;
  updatedBy?: number | null;
  createdByAdmin?: number | null;
  updatedByAdmin?: number | null;
}

export interface IBranchRecord {
  id: number;
  organizationId: number;
  code: string | null;
  isDefault: boolean;
  legalName: string | null;
  name: string;
  address: string | null;
  logoImage: string | null;
  bannerImage: string | null;
  phoneNumber: string | null;
  mobile: string | null;
  email: string;
  website: string | null;
  rohiniId: string | null;
  gstNo: string | null;
  jurisdiction: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipCode: string | null;
  isActive: boolean;
  resourceInfo: string | null;
  createdBy: number | null;
  updatedBy: number | null;
  createdByAdmin: number | null;
  updatedByAdmin: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateBranch {
  id?: number;
  organizationId?: number;
  code?: string | null;
  isDefault?: boolean;
  legalName?: string | null;
  name?: string;
  address?: string | null;
  logoImage?: string | null;
  bannerImage?: string | null;
  phoneNumber?: string | null;
  mobile?: string | null;
  email?: string;
  website?: string | null;
  rohiniId?: string | null;
  gstNo?: string | null;
  jurisdiction?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipCode?: string | null;
  resourceInfo?: string | null;
  createdBy?: number | null;
  updatedBy?: number | null;
  createdByAdmin?: number | null;
  updatedByAdmin?: number | null;
}
