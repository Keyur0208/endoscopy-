import type { IUserItem } from './user';
import type { IReportTypeRecord } from './report-type';
import type { IParameterMasterRecord } from './parameter-master';

export interface IReportTemplateSectionRecord {
  id?: number;
  parameterId?: number | null;
  parameter?: IParameterMasterRecord | null;
  sequence?: number | null;
  isRequired?: boolean;
  createdByAdminUser?: IUserItem;
  createdByUser?: IUserItem;
  updatedByAdminUser?: IUserItem;
  updatedByUser?: IUserItem;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateReportTemplateSection {
  parameterId?: number | null;
  parameter?: IParameterMasterRecord | null;
  sequence?: number | null;
  isRequired?: boolean;
}

// ============================================
// Report Template Types
// ============================================

export interface IReportTemplateRecord {
  id: number;
  reportTypeId: number | null;
  reportType?: IReportTypeRecord | null;
  title: string;
  code: string | null;
  maxImages: number;
  isActive: boolean;
  resourceInfo: string | null;
  createdByAdminUser?: IUserItem;
  createdByUser?: IUserItem;
  updatedByAdminUser?: IUserItem;
  updatedByUser?: IUserItem;
  createdAt: string;
  updatedAt: string;
  sections?: IReportTemplateSectionRecord[];
}

export interface ICreateReportTemplate {
  reportTypeId?: number | null;
  title: string;
  code?: string | null;
  maxImages?: number;
  isActive?: boolean;
  sections?: ICreateReportTemplateSection[];
}

export interface IUpdateReportTemplate {
  id?: number;
  reportTypeId?: number | null;
  title?: string;
  code?: string | null;
  maxImages?: number;
  isActive?: boolean;
  sections?: ICreateReportTemplateSection[];
}
