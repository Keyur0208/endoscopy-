import type { IUserItem, IResourceInfo } from './user';
import type { IPatientRegistrationItem } from './patient-registration';

export type IRecordingSession = {
  id: number;
  patientId: number;
  patient: IPatientRegistrationItem;
  recordId: number;
  uhid: string;
  sessionCode: string;
  patientName: string;
  age: string;
  sex: string;
  entryDate: string;
  hospitalDoctor: string;
  refDrName: string;
  remarks: string;
  captureDate: string;
  startTime: string;
  endTime: string;
  durationTime: string;
  createdBy: IUserItem;
  updatedBy: IUserItem;
  createdByAdminUser: IUserItem;
  updatedByAdminUser: IUserItem;
  resourceInfo: IResourceInfo;
};

export type ICreateRecordingSession = {
  patientId: number | null;
  captureDate?: string;
  entryDate?: string;
  remark?: string;
  mimeType: string;
};

export type IRecordingStopResult = {
  sessionId: string;
  chunkCount: number;
  status: string;
};

export type ICapturedImage = {
  id: string;
  sessionId: string;
  imagePath: string;
  capturedAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy: IUserItem;
  updatedBy: IUserItem;
  resourceInfo: IResourceInfo;
};
