import type { IChangePassword } from 'src/types/user';

import { mutate } from 'swr';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Box, Grid, Stack } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { endpoints } from 'src/utils/axios';

import { changeUserPassword } from 'src/actions/user';
import { DashboardContent } from 'src/layouts/dashboard';

import BodyCard from 'src/components/body-card';
import { Form } from 'src/components/hook-form';
import RHFFormField from 'src/components/form-feild';
import DoctorFormButtons from 'src/components/button-group';

import { useAuthContext } from 'src/auth/hooks';

export default function PasswordSecurityForm() {
  const route = useRouter();
  const { user } = useAuthContext();

  const changePasswordSchema = zod
    .object({
      oldPassword: zod.string().min(6, 'Old password is required'),
      newPassword: zod.string().min(6, 'Password must be at least 6 characters'),
      confirmPassword: zod.string().min(6, 'Confirm Password is required'),
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

  const defaultValues = useMemo(
    () => ({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    }),
    []
  );

  const methods = useForm<IChangePassword>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (user && user.id) {
        await changeUserPassword(user?.id, data as IChangePassword);
        await Promise.all([
          mutate(endpoints.user.getAll),
          mutate(endpoints.user.getById(user?.id)),
        ]);
      }
    } catch (error: any) {
      console.error('Error:', error);
    }
  });

  const BoxStyle = {
    display: {
      xs: 'block',
      md: 'grid',
    },
    alignItems: 'start',
    gridTemplateColumns: {
      xs: '1fr 2fr',
      md: '120px 2fr',
    },
    columnGap: 1,
  };

  const handleExit = () => {
    route.push(paths.dashboard.root);
  };

  return (
    <>
      <DashboardContent title="Password & Security">
        <BodyCard>
          <Box padding={{ xs: 1, sm: 2, md: 3 }}>
            <Form methods={methods} onSubmit={onSubmit}>
              <Stack direction="column" spacing={1}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <RHFFormField
                      label="Old Password"
                      name="oldPassword"
                      type="password"
                      BoxSx={BoxStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <RHFFormField
                      label="New Password"
                      name="newPassword"
                      type="password"
                      BoxSx={BoxStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <RHFFormField
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      BoxSx={BoxStyle}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Form>
          </Box>
        </BodyCard>
      </DashboardContent>

      <DoctorFormButtons isSubmitting={isSubmitting} onSubmit={onSubmit} onExit={handleExit} />
    </>
  );
}
