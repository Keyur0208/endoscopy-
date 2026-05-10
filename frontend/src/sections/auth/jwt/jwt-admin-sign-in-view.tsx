import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { signInAdmin } from 'src/auth/context/jwt';

import { JwtSignInSchema } from './schema/jwt-sign-in-schema';

import type { JwtSignInSchemaType } from './schema/jwt-sign-in-schema';

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const { checkUserSession } = useAuthContext();

  const router = useRouter();

  const password = useBoolean();
  const [errorMsg, setErrorMsg] = useState('');

  // Login form
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

      const response = await signInAdmin({
        email: data.email,
        password: data.password,
        ...(resourceInfo && { resourceInfo }),
      });

      console.log('Login response:', response);

      if ('otpRequired' in response) {
        toast.success(response?.message || 'OTP sent successfully');
        router.push(`${paths.auth.jwt.verifyOtp}?mobile=${response.mobile}`);
        signInMethods.reset();
        return;
      }

      await checkUserSession?.();
      router.push(paths.dashboard.root);
      router.refresh();
    } catch (error: any) {
      setErrorMsg(error?.message || 'Login failed');
    }
  });

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">Admin Login</Typography>
    </Stack>
  );

  const renderForm = (
    <Form key="login" methods={signInMethods} onSubmit={onSubmitLogin}>
      <Stack spacing={3}>
        <Field.Text name="email" label="Email address" InputLabelProps={{ shrink: true }} />
        <Field.Text
          name="password"
          label="Password"
          placeholder="6+ characters"
          type={password.value ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <LoadingButton
          fullWidth
          color="primary"
          size="large"
          type="submit"
          variant="contained"
          loading={signInMethods.formState.isSubmitting}
          loadingIndicator="Signing in..."
        >
          Login
        </LoadingButton>
      </Stack>
    </Form>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        mt: 3,
        textAlign: 'center',
        typography: 'caption',
        color: 'text.secondary',
      }}
    >
      {'By signing up, I agree to '}
      <Link underline="always" color="text.primary">
        Terms of service
      </Link>
      {' and '}
      <Link underline="always" color="text.primary">
        Privacy policy
      </Link>
      .
    </Typography>
  );

  return (
    <>
      {/* <Logo width={60} height={60} sx={{ mb: 3 }} /> */}
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}
      {renderForm}
      {renderTerms}
    </>
  );
}
