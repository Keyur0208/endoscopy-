
// ============================================
// Patient Report Value Types
// ============================================

export interface IPatientReportValueRecord {
  id: number;
  reportId: number;
  templateSectionId: number;
  value: string | null;
  createdBy: number | null;
  updatedBy: number | null;
  createdByAdmin: number | null;
  updatedByAdmin: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreatePatientReportValue {
  reportId: number;
  templateSectionId: number;
  value?: string | null;
  createdBy?: number | null;
  updatedBy?: number | null;
  createdByAdmin?: number | null;
  updatedByAdmin?: number | null;
}

export interface IUpdatePatientReportValue {
  id?: number;
  reportId?: number;
  templateSectionId?: number;
  value?: string | null;
  createdBy?: number | null;
  updatedBy?: number | null;
  createdByAdmin?: number | null;
  updatedByAdmin?: number | null;
}

// ============================================
// Patient Report Image Types
// ============================================

export interface IPatientReportImageRecord {
  id: number;
  reportId: number;
  templateSectionId: number | null;
  imagePath: string;
  createdBy: number | null;
  updatedBy: number | null;
  createdByAdmin: number | null;
  updatedByAdmin: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreatePatientReportImage {
  reportId: number;
  templateSectionId?: number | null;
  imagePath: string;
  createdBy?: number | null;
  updatedBy?: number | null;
  createdByAdmin?: number | null;
  updatedByAdmin?: number | null;
}

export interface IUpdatePatientReportImage {
  id?: number;
  reportId?: number;
  templateSectionId?: number | null;
  imagePath?: string;
  createdBy?: number | null;
  updatedBy?: number |null;
  createdByAdmin?: number | null;
  updatedByAdmin?: number | null;
}

// ============================================
// Patient Report Types
// ============================================

export interface IPatientReportRecord {
  id: number;
  patientId: number;
  templateId: number;
  organizationId: number | null;
  branchId: number | null;
  resourceInfo: string | null;
  createdBy: number | null;
  updatedBy: number | null;
  createdByAdmin: number | null;
  updatedByAdmin: number | null;
  createdAt: string;
  updatedAt: string;
  values?: IPatientReportValueRecord[];
  images?: IPatientReportImageRecord[];
}

export interface ICreatePatientReport {
  patientId: number;
  templateId: number;
  organizationId?: number | null;
  branchId?: number | null;
  resourceInfo?: string | null;
  values?: ICreatePatientReportValue[];
  images?: ICreatePatientReportImage[];
  createdBy?: number | null;
  updatedBy?: number | null;
  createdByAdmin?: number | null;
  updatedByAdmin?: number | null;
}

export interface IUpdatePatientReport {
  id?: number;
  patientId?: number;
  templateId?: number;
  organizationId?: number | null;
  branchId?: number | null;
  resourceInfo?: string | null;
  values?: IUpdatePatientReportValue[];
  images?: IUpdatePatientReportImage[];
  createdBy?: number | null;
  updatedBy?: number | null;
  createdByAdmin?: number | null;
  updatedByAdmin?: number | null;
}