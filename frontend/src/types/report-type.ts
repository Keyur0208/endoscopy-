// ============================================
// Report Types
// ============================================

import type { IUserItem } from './user';

export interface IReportTypeRecord {
  id: number;
  name: string;
  code: string;
  description?: string;
  isActive?: boolean;
  isDefault?: boolean;
  organizationId?: number;
  branchId?: number;
  resourceInfo: string | null;
  createdByAdminUser?: IUserItem;
  createdByUser?: IUserItem;
  updatedByAdminUser?: IUserItem;
  updatedByUser?: IUserItem;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateReportType {
  name: string;
  code: string;
  description?: string;
  isActive?: boolean;
  isDefault?: boolean;
}

export interface IUpdateReportType {
  id?: number;
  name?: string;
  code?: string;
  description?: string;
  isActive?: boolean;
  isDefault?: boolean;
}
