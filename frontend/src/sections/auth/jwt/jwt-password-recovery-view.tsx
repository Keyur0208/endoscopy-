import { toast } from 'sonner';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import { Box, Link, Card, Stack, Alert, useTheme, Typography, CardContent } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { forgotPasswordSendOtp } from 'src/auth/context/jwt';

import { JwtPasswordRecoverySchema } from './schema/jwt-password-recovery-schema';

import type { JwtPasswordRecoverySchemaType } from './schema/jwt-password-recovery-schema';

export const JwtPasswordRecoveryView = () => {
  const router = useRouter();

  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  } | null>(null);

  const passwordRecoveryMethods = useForm<JwtPasswordRecoverySchemaType>({
    resolver: zodResolver(JwtPasswordRecoverySchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmitPasswordRecovery = passwordRecoveryMethods.handleSubmit(async (data) => {
    try {
      const response = await forgotPasswordSendOtp({ email: data.email });
      if (response?.status === 200) {
        router.push(`${paths.auth.jwt.resetPassword}?mobile=${response.data?.mobile}`);
        // setAlert({ type: 'success', message: response?.data?.message });
        toast.success(response?.data?.message || 'OTP sent successfully');
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: err?.message || 'Failed to send OTP' });
    }
  });

  const theme = useTheme();

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
          Forgot your password?
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Please enter the 6-digit OTP sent to your registered mobile number or email address.
        </Typography>

        {!!alert && (
          <Alert severity={alert?.type} sx={{ mb: 3 }}>
            {alert?.message}
          </Alert>
        )}

        <Form
          key="passwordrecovery"
          methods={passwordRecoveryMethods}
          onSubmit={onSubmitPasswordRecovery}
        >
          <Stack spacing={3}>
            <Field.Text
              name="email"
              label="Email Address"
              placeholder="Enter your email address"
              InputLabelProps={{ shrink: true }}
            />
            <LoadingButton
              fullWidth
              color="primary"
              size="large"
              type="submit"
              variant="contained"
              loading={passwordRecoveryMethods.formState.isSubmitting}
              loadingIndicator="Verifying..."
            >
              Send Request
            </LoadingButton>
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
