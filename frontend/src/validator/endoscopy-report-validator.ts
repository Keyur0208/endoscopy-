import { z as zod } from 'zod';

export const EndoscopyReportValueSchema = zod.object({
  templateSectionId: zod.number(),
  value: zod.string().optional().nullable(),
});

export const EndoscopyReportImageSchema = zod.object({
  templateSectionId: zod.number(),
  imagePath: zod.string(),
});

export const EndoScopyReportValidator = zod.object({
  patientId: zod.number().nullable(),
  reportTypeId: zod.number().nullable(),
  templateId: zod.number().nullable(),
  reportDate: zod.string().optional().nullable(),
  entryDate: zod.string().optional().nullable(),
  remarks: zod.string().optional().nullable(),
  values: zod.array(EndoscopyReportValueSchema).optional(),
  images: zod.array(EndoscopyReportImageSchema).optional(),
});

export type EndoscopyReportFormValues = zod.infer<typeof EndoScopyReportValidator>;
