import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Link,
  Stack,
  Alert,
  useTheme,
  Typography,
  InputLabel,
  CardContent,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { verifyOtp } from 'src/auth/context/jwt';

import { JwtOtpVerifySchema } from './schema/jwt-otp-verify-schema';

import type { JwtOtpVerifySchemaType } from './schema/jwt-otp-verify-schema';

export const JwtOtpVerificationView = () => {
  const theme = useTheme();
  const { checkUserSession } = useAuthContext();
  const router = useRouter();
  const query = useSearchParams();

  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  } | null>(null);

  const otpMethods = useForm<JwtOtpVerifySchemaType>({
    resolver: zodResolver(JwtOtpVerifySchema),
    defaultValues: {
      mobile: (query.get('mobile') as string) || '',
      otp: '',
    },
  });

  const onSubmitOtp = otpMethods.handleSubmit(async (data) => {
    try {
      const response = await verifyOtp(data);
      if (response?.status === 200) {
        await checkUserSession?.();
        router.refresh();
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: err?.message || 'Invalid or expired OTP' });
    }
  });

  return (
    <Card sx={{ maxWidth: 400, boxShadow: 3 }}>
      <CardContent sx={{ padding: '20px 20px 0 20px !important' }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={2}
          sx={{ color: theme.palette.primary.main }}
        >
          Hospital Management System
        </Typography>

        <Typography variant="subtitle1" fontWeight="medium" mb={1}>
          OTP Verification
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Please enter the 6-digit OTP sent to your registered mobile number or email address.
        </Typography>

        {!!alert && (
          <Alert severity={alert?.type} sx={{ mb: 3 }}>
            {alert?.message}
          </Alert>
        )}

        <Form key="otp" methods={otpMethods} onSubmit={onSubmitOtp}>
          <Stack spacing={3}>
            <Stack>
              <InputLabel shrink sx={{ fontSize: '20px !important', color: 'black !important' }}>
                Mobile Number
              </InputLabel>
              <Field.Text
                name="mobile"
                InputLabelProps={{ shrink: true }}
                placeholder="Enter Mobile Number"
                disabled
              />
            </Stack>
            <Stack>
              <InputLabel shrink sx={{ fontSize: '20px !important', color: 'black !important' }}>
                OTP
              </InputLabel>
              <Field.Code name="otp" />
            </Stack>
            <Stack>
              <LoadingButton
                fullWidth
                color="primary"
                size="large"
                type="submit"
                variant="contained"
                loading={otpMethods.formState.isSubmitting}
                loadingIndicator="Verifying..."
              >
                Verify OTP
              </LoadingButton>
            </Stack>
          </Stack>
        </Form>
        <Box textAlign="center" mt={2}>
          <Link
            href={paths.auth.jwt.signIn}
            color="inherit"
            variant="subtitle2"
            sx={{ gap: 0.5, alignSelf: 'center', alignItems: 'center', display: 'inline-flex' }}
          >
            <Iconify width={16} icon="eva:arrow-ios-back-fill" />
            Return to sign in
          </Link>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            columnGap: '2px',
          }}
          mt={2}
        >
          <Icon icon="mdi:phone" height="20px" />
          <Typography sx={{ fontSize: '12px' }}>Customer Care 77788 78340 (Toll free)</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
