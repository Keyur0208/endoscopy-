export interface IReportTypeRecord {
  id: number;
  name: string;
  code: string | null;
  description: string | null;
  isActive: boolean;
  isDefault: boolean;
  organizationId: number | null;
  branchId: number | null;
  resourceInfo: string | null;
  createdBy: number | null;
  updatedBy: number | null;
  createdByAdmin: number | null;  
  updatedByAdmin: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateReportType {
  name: string;
  code?: string;
  description?: string;
  isActive?: boolean;
  isDefault?: boolean;
  organizationId?: number;
  branchId?: number;
  resourceInfo?: string;
  createdBy?: number | null;
  updatedBy?: number | null;
  createdByAdmin?: number | null;
  updatedByAdmin?: number | null;
}

export interface IUpdateReportType {
  name?: string;
  code?: string;
  description?: string;
  isActive?: boolean;
  isDefault?: boolean;
  organizationId?: number;
  branchId?: number;
  resourceInfo?: string;
  createdBy?: number | null;
  updatedBy?: number | null;
  createdByAdmin?: number | null;
  updatedByAdmin?: number | null;
}

export interface IReportTypeParams {
  id: number;
}