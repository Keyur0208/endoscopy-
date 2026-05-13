import type { IUserItem } from './user';
import type { IReportTypeRecord } from './report-type';
import type { IPatientRegistrationItem } from './patient-registration';
import type { IReportTemplateRecord, IReportTemplateSectionRecord } from './report-template';

// Value Schema

export interface IEndoscopyReportValueRecord {
  id?: number;
  templateSectionId?: number;
  templateSection?: IReportTemplateSectionRecord | null;
  value?: string | null;
}

export type ICreateEndoscopyReportValueRecord = {
  templateSectionId: number;
  value?: string | null;
};

// Image Schema

export interface IEndoscopyReportImageRecord {
  id?: number;
  templateSectionId?: number;
  templateSection?: IReportTemplateSectionRecord | null;
  imagePath?: string;
}

export type ICreateEndoscopyReportImageRecord = {
  templateSectionId: number;
  templateSection?: IReportTemplateSectionRecord | null;
  imagePath: string;
};

// Endoscopy Report Types

export interface IEndoscopyReportRecord {
  id: number;
  patientId?: number | null;
  patient?: IPatientRegistrationItem | null;
  reportTypeId?: number | null;
  reportType?: IReportTypeRecord | null;
  templateId?: number | null;
  template?: IReportTemplateRecord | null;
  reportDate?: string | null;
  entryDate?: string | null;
  remarks?: string | null;
  values?: IEndoscopyReportValueRecord[];
  images?: IEndoscopyReportImageRecord[];
  createdByAdminUser?: IUserItem;
  createdByUser?: IUserItem;
  updatedByAdminUser?: IUserItem;
  updatedByUser?: IUserItem;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateEndoscopyReport {
  patientId: number | null;
  reportTypeId?: number | null;
  templateId?: number | null;
  reportDate?: string | null;
  entryDate?: string | null;
  remarks?: string | null;
  values?: ICreateEndoscopyReportValueRecord[];
  images?: ICreateEndoscopyReportImageRecord[];
}

export interface IUpdateEndoscopyReport {
  id?: number;
  patientId?: number | null;
  reportTypeId?: number | null;
  templateId?: number | null;
  reportDate?: string | null;
  entryDate?: string | null;
  remarks?: string | null;
  values?: ICreateEndoscopyReportValueRecord[];
  images?: ICreateEndoscopyReportImageRecord[];
}
