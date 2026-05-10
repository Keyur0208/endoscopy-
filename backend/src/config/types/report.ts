

// ============================================
// Report Template Section Types
// ============================================

export interface IReportTemplateSectionRecord {
  id: number;
  templateId: number;
  parameterId: number;
  sequence: number;
  isRequired: boolean;
  createdBy: number | null;
  updatedBy: number | null;
  createdByAdmin: number | null;
  updatedByAdmin: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateReportTemplateSection {
  templateId: number;
  parameterId: number;
  sequence: number;
  isRequired?: boolean;
  createdBy?: number | null;
  updatedBy?: number | null;
  createdByAdmin?: number | null;
  updatedByAdmin?: number | null;
}

export interface IUpdateReportTemplateSection {
  id?: number;
  templateId?: number;
  parameterId?: number;
  sequence?: number;
  isRequired?: boolean;
  createdBy?: number | null;
  updatedBy?: number | null;
  createdByAdmin?: number | null;
  updatedByAdmin?: number | null;
}

// ============================================
// Report Template Types
// ============================================

export interface IReportTemplateRecord {
  id: number;
  title: string;
  code: string | null;
  maxImages: number;
  isActive: boolean;
  organizationId: number | null;
  branchId: number | null;
  resourceInfo: string | null;
  createdBy: number | null;
  updatedBy: number | null;
  createdByAdmin: number | null;
  updatedByAdmin: number | null;
  createdAt: string;
  updatedAt: string;
  sections?: IReportTemplateSectionRecord[];
}

export interface ICreateReportTemplate {
  title: string;
  code?: string | null;
  maxImages?: number;
  isActive?: boolean;
  organizationId?: number | null;
  branchId?: number | null;
  resourceInfo?: string | null;
  sections?: ICreateReportTemplateSection[];
  createdBy?: number | null;
  updatedBy?: number | null;
  createdByAdmin?: number | null;
  updatedByAdmin?: number | null;
}

export interface IUpdateReportTemplate {
  id?: number;
  title?: string;
  code?: string | null;
  maxImages?: number;
  isActive?: boolean;
  organizationId?: number | null;
  branchId?: number | null;
  resourceInfo?: string | null;
  sections?: IUpdateReportTemplateSection[];
  createdBy?: number | null;
  updatedBy?: number | null;
  createdByAdmin?: number | null;
  updatedByAdmin?: number | null;
}
