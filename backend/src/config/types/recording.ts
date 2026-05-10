import { RecordingStatus } from "endoscopy-shared";

// ── Create / Update payloads ──────────────────────────────────────────────────

export interface IStartRecordingSession {
  patientId?: number | null;
  remark?: string | null;
  captureDate?: string | null;
  entryDate?: string | null;
  mimeType?: string;
  branchId?: number | null;
  organizationId?: number | null;
  resourceInfo?: string | null;
  createdBy?: number | null;
  createdByAdmin?: number | null;
  updatedBy?: number | null;
  updatedByAdmin?: number | null;
}

export interface IStopRecordingSession {
  durationSeconds?: number | null;
  updatedBy?: number | null;
  updatedByAdmin?: number | null;
}

export interface ICreateCaptureImage {
  sessionId: number;
  imagePath: string;
  resourceInfo?: string | null;
  createdBy?: number | null;
  createdByAdmin?: number | null;
  updatedBy?: number | null;
  updatedByAdmin?: number | null;
}

// ── Query / list filters ──────────────────────────────────────────────────────

export interface IListRecordingSessionsQuery {
  page?: number;
  perPage?: number;
  searchedValue?: string;
}
