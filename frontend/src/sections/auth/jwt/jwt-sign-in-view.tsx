import { toast } from 'sonner';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Link,
  Card,
  Stack,
  Alert,
  Button,
  useTheme,
  IconButton,
  InputLabel,
  Typography,
  CardContent,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { signInWithPassword } from 'src/auth/context/jwt';

import { JwtSignInSchema } from './schema/jwt-sign-in-schema';

import type { JwtSignInSchemaType } from './schema/jwt-sign-in-schema';

export const JwtSignInView = () => {
  const theme = useTheme();
  const { checkUserSession } = useAuthContext();

  const router = useRouter();
  const password = useBoolean();
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  } | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const signInMethods = useForm<JwtSignInSchemaType>({
    resolver: zodResolver(JwtSignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmitLogin = signInMethods.handleSubmit(async (data) => {
    try {
      const stored = localStorage.getItem('resourceInfo');
      const resourceInfo = stored ? JSON.parse(stored) : undefined;

      const response = await signInWithPassword({
        email: data.email,
        password: data.password,
        ...(resourceInfo && { resourceInfo }),
      });

      if ('otpRequired' in response) {
        // setAlert({ type: 'info', message: response.message });
        toast.success(response?.message || 'OTP sent successfully');
        router.push(`${paths.auth.jwt.verifyOtp}?mobile=${response.mobile}`);
        signInMethods.reset();
        return;
      }
      await checkUserSession?.();
      router.push(paths.dashboard.root);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      setAlert({ type: 'error', message: error?.message || 'Login failed' });
      setShowForgotPassword(error?.showForgotPassword);
    }
  });

  const handleSecretClick = () => {
    router.push(paths.auth.jwt.signUp);
  };

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
          Login using
        </Typography>

        <Button
          onClick={handleSecretClick}
          variant="contained"
          sx={{
            mb: 2,
            textTransform: 'none',
            backgroundColor: theme.palette.primary.main,
            borderRadius: '17px',
          }}
        >
          Login ID / Customer ID
        </Button>

        {!!alert && (
          <Alert severity={alert?.type} sx={{ mb: 3 }}>
            {alert?.message}
          </Alert>
        )}

        <Form key="login" methods={signInMethods} onSubmit={onSubmitLogin}>
          <Stack spacing={2}>
            <Stack>
              <InputLabel shrink sx={{ fontSize: '20px !important', color: 'black !important' }}>
                Login ID / User Name
              </InputLabel>
              <Field.Text name="email" InputLabelProps={{ shrink: true }} placeholder="Enter ID" />
            </Stack>

            {showForgotPassword && (
              <Box textAlign="right">
                <Link
                  component="a"
                  variant="body2"
                  sx={{ color: theme.palette.primary.main }}
                  href={paths.auth.jwt.updatePassword}
                >
                  Forgot Password?
                </Link>
              </Box>
            )}

            <Stack>
              <InputLabel shrink sx={{ fontSize: '20px !important', color: 'black !important' }}>
                Password
              </InputLabel>
              <Field.Text
                name="password"
                placeholder="Enter Password"
                type={password.value ? 'text' : 'password'}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <LoadingButton
              fullWidth
              color="inherit"
              size="large"
              type="submit"
              sx={{ backgroundColor: theme.palette.primary.main }}
              variant="contained"
              loading={signInMethods.formState.isSubmitting}
              loadingIndicator="Sign in..."
            >
              Login
            </LoadingButton>
          </Stack>
        </Form>
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
