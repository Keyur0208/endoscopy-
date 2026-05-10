import { z as zod } from 'zod';

export const CameraCaptureSchema = zod.object({
    patientId: zod.number().nullable(),
    entryDate: zod.string(),
    remarks: zod.string().optional().nullable(),
    captureDate: zod.string(),
    mimeType: zod.string().min(1, 'MIME type is required'),
});

export type CameraCaptureFormValues = zod.infer<typeof CameraCaptureSchema>;
