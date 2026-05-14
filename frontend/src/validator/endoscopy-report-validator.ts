import { z as zod } from 'zod';

export const EndoscopyReportValueSchema = zod.object({
  templateSectionId: zod.number().nullable().optional(),
  value: zod.string().nullable().optional().default(''),
});

export const EndoscopyReportImageSchema = zod.object({
  templateSectionId: zod.number().nullable().optional(),
  imagePath: zod.string().optional().nullable(),
});

export const EndoScopyReportValidator = zod.object({
  patientId: zod.number().min(1, 'Patient is required'),
  reportTypeId: zod.number().min(1, 'Report Type is required'),
  templateId: zod.number().min(1, 'Template is required'),
  reportDate: zod.string().min(1, 'Report Date is required'),
  entryDate: zod.string().min(1, 'Entry Date is required'),
  remark: zod.string().optional().nullable(),
  values: zod.array(EndoscopyReportValueSchema).optional(),
  images: zod.array(EndoscopyReportImageSchema).optional(),
});

export type EndoscopyReportFormValues = zod.infer<typeof EndoScopyReportValidator>;
