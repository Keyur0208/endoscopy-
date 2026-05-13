import { z as zod } from 'zod';

export const ReportTemplateSectionSchema = zod.object({
  parameterId: zod.number().min(1, 'Parameter ID is required'),
  sequence: zod.number().min(1, 'Sequence is required'),
  isRequired: zod.boolean().optional(),
});

export const ReportTemplateSchema = zod.object({
  reportTypeId: zod.number().min(1, 'Report Type is required'),
  title: zod.string().min(1, 'Title is required'),
  code: zod.string().min(1, 'Code is required'),
  maxImages: zod.number().optional(),
  isActive: zod.boolean().optional(),
  isDefault: zod.boolean().optional(),
  organizationId: zod.number().nullable().optional(),
  branchId: zod.number().nullable().optional(),
  resourceInfo: zod.string().nullable().optional(),
  sections: zod.array(ReportTemplateSectionSchema).optional(),
});

export type ReportTemplateFormValues = zod.infer<typeof ReportTemplateSchema>;
export type ReportTemplateSectionFormValues = zod.infer<typeof ReportTemplateSectionSchema>;
