import { z as zod } from 'zod';

export const OrganizationSchema = zod.object({
  name: zod.string().min(1, 'organization Name is required'),
  bannerImage: zod.union([zod.string(), zod.instanceof(File)]).optional(),
  logoImage: zod.union([zod.string(), zod.instanceof(File)]).optional(),
  legalName: zod.string().min(1, 'Legal Name is required'),
  email: zod
    .string()
    .min(1, 'Email is required')
    .refine((val) => !val || val === '-' || /\S+@\S+\.\S+/.test(val), {
      message: 'Enter a valid email',
    }),
  mobile: zod
    .string()
    .regex(
      /^(?:\+91)?[0-9]\d{9}$/,
      'Mobile Number must be a valid Indian number (10 digits, starting with 0-9)'
    ),
  licenseKey: zod.string().optional(),
  licenseType: zod.string().min(1, 'License Type is required'),
  expiryDate: zod.string().min(1, 'Expiry Date is required'),
  status: zod.string().min(1, 'status is required'),
  isActive: zod.boolean().optional(),
});

export type OrganizationFormValues = zod.infer<typeof OrganizationSchema>;
