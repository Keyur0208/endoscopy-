import { z as zod } from 'zod';

export const ParameterMasterSchema = zod.object({
  name: zod.string().min(1, 'Parameter Master Name is required'),
  code: zod.string().optional(),
  inputType: zod.string().min(1, 'Input Type is required'),
  defaultValue: zod.string().optional(),
  isHeading: zod.boolean().optional(),
  isActive: zod.boolean().optional(),
});

export type ParameterMasterFormValues = zod.infer<typeof ParameterMasterSchema>;
