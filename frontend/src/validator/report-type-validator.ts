import { z as zod } from 'zod';


export const ReportTypeSchema = zod.object({
  name: zod.string().min(1, 'Report Type Name is required'),
  code: zod.string().optional(),
  description: zod.string().optional(),
  isActive: zod.boolean().optional(),
  isDefault: zod.boolean().optional(),
});

export type ReportTypeFormValues = zod.infer<typeof ReportTypeSchema>;
