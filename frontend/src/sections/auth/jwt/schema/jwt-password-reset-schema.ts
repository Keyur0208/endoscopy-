import { z as zod } from 'zod';

export const JwtPasswordResetSchema = zod
  .object({
    mobile: zod.string().min(10, { message: 'Mobile number must be at least 10 digits' }),
    otp: zod
      .string()
      .min(1, { message: 'OTP is required !' })
      .length(6, { message: 'OTP must be 6 digits' }),
    newPassword: zod
      .string()
      .min(1, { message: 'New Password is required!' })
      .min(6, { message: 'New Password must be at least 6 characters!' }),
    confirmPassword: zod
      .string()
      .min(1, { message: 'Confirm Password is required!' })
      .min(6, { message: 'Confirm Password must be at least 6 characters!' }),
  })
  .refine(
    (data) => {
      if (data.newPassword || data.confirmPassword) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }
  );

export type JwtPasswordResetSchemaType = zod.infer<typeof JwtPasswordResetSchema>;

// ----------------------------------------------------------------------
