import { IPatientRegistrationItem } from "./patient-registration";
import { IResourceInfo, IUserItem } from "./user";

export type IRecordingSession = {
    id: number;
    patientId: number;
    patient:IPatientRegistrationItem;
    recordId: number;
    uhid: string;
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
}

export type ICreateRecordingSession = {
    patientId: number | null;
    captureDate?: string;
    entryDate?: string;
    remark?: string;
    mimeType: string;
}

export type IRecordingStopResult = {
    sessionId: string;
    chunkCount: number;
    status: string;
}

export type ICapturedImage = {
    id: string;
    sessionId: string;
    url: string;
    name: string;
    capturedAt: string;
}