import { z as zod } from 'zod';

export const JwtOtpVerifySchema = zod.object({
  mobile: zod.string().min(10, { message: 'Mobile number must be at least 10 digits' }),
  otp: zod
    .string()
    .min(1, { message: 'OTP is required !' })
    .length(6, { message: 'OTP must be 6 digits' }),
});

export type JwtOtpVerifySchemaType = zod.infer<typeof JwtOtpVerifySchema>;

// ----------------------------------------------------------------------
