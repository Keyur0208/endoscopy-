import type { ICreateUser } from 'src/types/user';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Box, Grid, Stack } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import BodyCard from 'src/components/body-card';
import { Form } from 'src/components/hook-form';
import RHFFormField from 'src/components/form-feild';
import CustomTitle from 'src/components/custome-title';

import { useAuthContext } from 'src/auth/hooks';

export default function MyAccountSettingsForm() {
  const { user } = useAuthContext();

  const UserSchema = zod.object({
    fullName: zod.string().min(2, 'Full name is required'),
    email: zod.string().email('Invalid email address'),
    mobile: zod.string().min(10, 'Mobile number is required'),
    branch: zod.number().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      fullName: user?.fullName || '',
      mobile: user?.mobile || '',
      branch: null,
      email: user?.email || '',
    }),
    [user]
  );

  const methods = useForm<ICreateUser>({
    resolver: zodResolver(UserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    // formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    console.log('data', data);
  });

  return (
    <DashboardContent title="Account Settings">
      <BodyCard>
        <Box padding={{ xs: 1, sm: 2, md: 3 }}>
          <Form methods={methods} onSubmit={onSubmit}>
            <CustomTitle title=" Personal Information" />
            <Stack direction="column" spacing={1}>
              {/* Account Information */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <RHFFormField label="Full Name" name="fullName" isdisable />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <RHFFormField label="Email" name="email" isdisable />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <RHFFormField label="Mobile" name="mobile" isdisable />
                </Grid>
              </Grid>
            </Stack>
          </Form>
        </Box>
      </BodyCard>
    </DashboardContent>
  );
}
