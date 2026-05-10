import { z as zod } from 'zod';

export const PatientRegistrationSchema = zod.object({
  registrationDate: zod.string().optional(),
  caseDate: zod.string().optional(),
  recordId: zod.string().optional(),
  uhid: zod.string().optional(),
  firstName: zod.string().min(1, { message: 'First Name is required!' }),
  middleName: zod.string().min(1, { message: 'Middle Name is required!' }),
  lastName: zod.string().min(1, { message: 'Last Name is required!' }),
  category: zod.string().min(1, 'Category is required'),
  birthDate: zod.string().optional().nullable(),
  age: zod.number().max(120, { message: 'Age is required!' }),
  ageUnit: zod.string().min(1, { message: 'Age Unit is required!' }),
  sex: zod.string().min(1, { message: 'Sex is required!' }),
  hospitalDoctor: zod.string().optional(),
  referenceDoctor: zod.string().optional(),
  language: zod.string().optional(),
  religion: zod.string().optional(),
  height: zod.number().optional().nullable(),
  weight: zod.number().optional().nullable(),
  bloodGroup: zod.string().optional(),
  maritalStatus: zod.string().optional(),
  mobile: zod
    .string()
    .trim()
    .regex(/^(\+91|91)?[6-9]\d{9}$/, 'Enter valid Indian mobile number')
    .optional(),
  mobile2: zod
    .string()
    .optional()
    .refine((val) => !val || /^(\+91|91)?[6-9]\d{9}$/.test(val), {
      message: 'Enter valid Indian mobile number',
    }),
  office: zod.string().optional(),
  email: zod.string().optional(),
  address: zod.string().optional(),
  area: zod.string().optional(),
  city: zod.string().min(1, { message: 'City is required!' }).default('Ankleshwar'),
  state: zod.string().min(1, { message: 'State is required!' }).default('Gujarat'),
  pin: zod
    .string()
    // .regex(/^\d{6}$/, { message: 'Pin must be 6 digits!' })
    .optional(),
  nationality: zod
    .string()
    .min(1, { message: 'Nationality is required!' })
    .default('India')
    .optional(),
  typeOfVisa: zod.string().optional(),
  profileImage: zod.union([zod.string(), zod.instanceof(File)]).optional(),
  estimate: zod.string().optional(),
  adharCard: zod
    .string()
    .regex(/^\d{4}-\d{4}-\d{4}$/, {
      message: 'Aadhaar No must be in the format: 1234-5678-9012',
    })
    .refine(
      (value) => {
        const digitsOnly = value.replace(/-/g, '');
        return /^\d{12}$/.test(digitsOnly);
      },
      {
        message: 'Aadhaar No must contain exactly 12 digits',
      }
    )
    .optional()
    .nullable(),
  panCard: zod
    .string()
    .regex(/^[A-Z]{5}\d{4}[A-Z]{1}$/, {
      message: 'PAN Card must be in the format: AAAAA9999A',
    })
    .optional()
    .nullable(),
  membershipId: zod.string().optional().nullable(),
  employeesId: zod.string().optional().nullable(),
  occupation: zod.string().optional().nullable(),
  spouseOccupation: zod.string().optional().nullable(),
  companyName: zod.string().optional().nullable(),
  education: zod.string().optional().nullable(),
  yojanaCardNo: zod.string().optional().nullable(),
  mediclaim: zod.boolean().optional().nullable(),
  remark: zod.string().optional().nullable(),
  referralTo: zod.string().optional().nullable(),
  transfer: zod.string().optional().nullable(),
  isActive: zod.boolean().optional(),
});

export type PatientRegistrationFormValues = zod.infer<typeof PatientRegistrationSchema>;
