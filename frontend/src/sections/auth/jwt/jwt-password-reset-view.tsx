import { toast } from 'sonner';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Stack,
  Alert,
  useTheme,
  Typography,
  InputLabel,
  IconButton,
  CardContent,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { forgotPasswordVerifyOtp } from 'src/auth/context/jwt';

import { JwtPasswordResetSchema } from './schema/jwt-password-reset-schema';

import type { JwtPasswordResetSchemaType } from './schema/jwt-password-reset-schema';

export const JwtPasswordResetView = () => {
  const theme = useTheme();
  const newPassword = useBoolean();
  const confirmPassword = useBoolean();
  const router = useRouter();
  const query = useSearchParams();
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  } | null>(null);

  const passwordResetMethod = useForm<JwtPasswordResetSchemaType>({
    resolver: zodResolver(JwtPasswordResetSchema),
    defaultValues: {
      mobile: (query.get('mobile') as string) || '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmitPasswordReset = passwordResetMethod.handleSubmit(async (data) => {
    try {
      const response = await forgotPasswordVerifyOtp(data);
      if (response?.status === 200) {
        // setErrorMsg({ type: 'success', message: response?.data?.message });
        toast.success(response?.data?.message || 'Password updated successfully');
        router.push(paths.auth.jwt.signIn);
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: err?.message || 'Login failed' });
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
          Request sent successfully!
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          We&apos;ve sent a 6-digit confirmation email to your email. Please enter the code in below
          box to verify your email.
        </Typography>

        {!!alert && (
          <Alert severity={alert?.type} sx={{ mb: 3 }}>
            {alert?.message}
          </Alert>
        )}

        <Form key="passwordreset" methods={passwordResetMethod} onSubmit={onSubmitPasswordReset}>
          <Stack spacing={2}>
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
              <InputLabel shrink sx={{ fontSize: '20px !important', color: 'black !important' }}>
                New Password
              </InputLabel>
              <Field.Text
                name="newPassword"
                placeholder="Enter Password"
                type={newPassword.value ? 'text' : 'password'}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={newPassword.onToggle} edge="end">
                        <Iconify
                          icon={newPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <Stack>
              <InputLabel shrink sx={{ fontSize: '20px !important', color: 'black !important' }}>
                Confirm Password
              </InputLabel>
              <Field.Text
                name="confirmPassword"
                placeholder="Enter Password"
                type={confirmPassword.value ? 'text' : 'password'}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={confirmPassword.onToggle} edge="end">
                        <Iconify
                          icon={confirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <Stack>
              <LoadingButton
                fullWidth
                color="primary"
                size="large"
                type="submit"
                variant="contained"
                loading={passwordResetMethod.formState.isSubmitting}
                loadingIndicator="Verifying..."
              >
                Update Password
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
