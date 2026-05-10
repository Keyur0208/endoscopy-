import { z as zod } from 'zod';

export const OrganizationBranchSchema = zod.object({
  organizationId: zod
    .number({ required_error: 'Organization is required' })
    .int()
    .positive('Organization is required'),
  code: zod.string().optional().nullable(),
  isDefault: zod.boolean().optional(),
  legalName: zod.string().optional().nullable(),
  name: zod.string().min(1, 'Name is required'),
  address: zod.string().optional().nullable(),
  logoImage: zod.string().optional().nullable(),
  bannerImage: zod.string().optional().nullable(),
  phoneNumber: zod.string().optional().nullable(),
  mobile: zod.string().optional().nullable(),
  email: zod.string().min(1, 'Email is required').email('Enter a valid email'),
  website: zod.string().optional().nullable(),
  rohiniId: zod.string().optional().nullable(),
  gstNo: zod.string().optional().nullable(),
  jurisdiction: zod.string().optional().nullable(),
  city: zod.string().optional().nullable(),
  state: zod.string().optional().nullable(),
  country: zod.string().optional().nullable(),
  zipCode: zod.string().optional().nullable(),
  isActive: zod.boolean().optional(),
  timezone: zod.string().optional().nullable(),
});

export type OrganizationBranchFormValues = zod.infer<typeof OrganizationBranchSchema>;
