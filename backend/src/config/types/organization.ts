export interface IOrganizationRecord {
  id: number;
  name: string;
  bannerImage: string | null;
  logoImage: string | null;
  legalName: string | null;
  email: string;
  mobile: string | null;
  licenseKey: string | null;
  licenseType: string | null;
  expiryDate: string | null;
  status: string | null;
  resourceInfo: string | null;
  createdBy: number | null;
  updatedBy: number | null;
  createdByAdmin: number | null;
  updatedByAdmin: number | null;
  createdAt: string;
  updatedAt: string;
}


export interface ICreateOrganization {
  name: string;
  bannerImage?: string | null;
  logoImage?: string | null;
  legalName?: string | null;
  email: string;
  mobile?: string | null;
  licenseKey?: string | null;
  licenseType?: string | null;
  expiryDate?: string | null;
  status?: string | null;
  resourceInfo?: string | null;
  createdBy?: number | null;
  updatedBy?: number | null;
  createdByAdmin?: number | null;
  updatedByAdmin?: number | null;
}

export interface IUpdateOrganization {
  id?: number;
  name?: string;
  bannerImage?: string | null;
  logoImage?: string | null;
  legalName?: string | null;
  email: string ;
  mobile?: string | null;
  licenseKey?: string | null;
  licenseType?: string | null;
  expiryDate?: string | null;
  status?: string | null;
  resourceInfo?: string | null;
  createdBy?: number | null;
  updatedBy?: number | null;
  createdByAdmin?: number | null;
  updatedByAdmin?: number | null;
}