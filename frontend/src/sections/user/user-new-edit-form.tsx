import type { IUserItem, ICreateUser, IUpdateUser } from 'src/types/user';
import type { ICurrentPaginatedResponse } from 'src/types/pagination-fillter';

import { mutate } from 'swr';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { usePagination } from 'src/hooks/use-pagination';
import { useDebouncedSearch } from 'src/hooks/use-debounce';

import { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';
import { useSearchOranizations } from 'src/actions/organization';
import { useSearchOrganizationBranches } from 'src/actions/organization-branch';
import { createUser, updateUser, useGetUsers, useSearchUsers } from 'src/actions/user';

import BodyCard from 'src/components/body-card';
import RHFFormField from 'src/components/form-feild';
import { Form, Field } from 'src/components/hook-form';
import DoctorFormButtons from 'src/components/button-group';
import { AutoCompleteFieldV2 } from 'src/components/autocomplate-field-v2';
import MasterAutoCompleteV2 from 'src/components/master-autocomplate-field-v2';
import { ActiveInactiveField } from 'src/components/selection/active-inactive-selection';
import { RATE_CHANGEABLE_OPTIONS } from 'src/components/selection/rate-changeable-selection';

import { useAuthContext } from 'src/auth/hooks';

type Props = {
  currentUser?: IUserItem;
  currentMeta?: ICurrentPaginatedResponse | undefined;
};

export default function UserNewEditForm({ currentUser, currentMeta }: Props) {
  const router = useRouter();
  const { user } = useAuthContext();

  const { users, usersMeta, isLoading } = useGetUsers({
    searchFor: 'all',
    page: 1,
    perPage: 10,
  });

  // User Search
  const userSearch = useDebouncedSearch();
  const { searchUsers, searchUsersIsLoading } = useSearchUsers(userSearch.debouncedQuery || '');

  // Organization Search
  const oraganizationSearch = useDebouncedSearch();
  const { searchOrganizations } = useSearchOranizations(oraganizationSearch.debouncedQuery || '');

  // Check Admin Or Organization Admin
  const isAdminUser = user?.isAdmin || user?.isOrganizationAdmin;

  // Custome Hook

  const {
    currentIndex,
    total,
    isDisable,
    handleNext,
    onParticularSearch,
    onhandledisableField,
    handleDisable,
    isFocus,
    isParticularSearch,
    handlePrevious,
    handleExit,
  } = usePagination({
    items: users,
    meta: usersMeta,
    currentItem: currentUser,
    currentMeta,
    currentisLoading: isLoading,
    routeGenerator: (id) => paths.dashboard.user.edit(id),
    fallbackRoute: paths.dashboard.user.new,
    listRouter: paths.dashboard.user.list,
    exitPermissionkey: 'true',
  });

  const defaultValues = useMemo(
    () => ({
      fullName: currentUser?.fullName || '',
      organizationId:
        currentUser?.organizationId || (!isAdminUser && user?.branch?.organizationId) || 0,
      branchId: currentUser?.branchId || (!isAdminUser && user?.branchId) || 0,
      email: currentUser?.email || '',
      mobile: currentUser?.mobile || '',
      password: '',
      conformPassword: '',
      isEmailVerified: currentUser?.isEmailVerified || false,
      isMobileVerified: currentUser?.isMobileVerified || false,
      isOtpRequired: currentUser?.isOtpRequired || false,
      canSwitchBranch: currentUser?.canSwitchBranch || false,
      isActive: currentUser?.isActive ?? true,
    }),
    [currentUser, isAdminUser, user]
  );

  const schema = useMemo(
    () =>
      zod
        .object({
          fullName: zod.string().min(1, 'Full Name is required'),
          organizationId: zod
            .number({ required_error: 'Organization is required' })
            .int()
            .positive('Organization is required'),
          branchId: zod
            .number({ required_error: 'Branch is required' })
            .int()
            .positive('Branch is required'),
          email: zod.string().email('Invalid email address'),
          mobile: zod
            .string()
            .regex(
              /^(?:\+91)?[0-9]\d{9}$/,
              'Mobile Number must be a valid Indian number (10 digits, starting with 0-9)'
            ),
          password: currentUser?.id
            ? zod.string().optional()
            : zod.string().min(6, 'Password must be at least 6 characters'),
          conformPassword: currentUser?.id
            ? zod.string().optional()
            : zod.string().min(1, 'Confirm Password is required'),
          isOtpRequired: zod.boolean().optional(),
          canSwitchBranch: zod.boolean().optional(),
          isActive: zod.boolean().optional(),
        })
        .refine(
          (data) => {
            // only validate match if passwords are provided
            if (data.password || data.conformPassword) {
              return data.password === data.conformPassword;
            }
            return true;
          },
          {
            message: "Passwords don't match",
            path: ['conformPassword'],
          }
        ),
    [currentUser?.id]
  );

  const methods = useForm<ICreateUser>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, currentUser]);

  // Branches Search
  const watchOrganizationId = watch('organizationId');

  const branchSearch = useDebouncedSearch();
  const { searchOrganizationBranches } = useSearchOrganizationBranches({
    name: branchSearch.debouncedQuery || '',
    organizationId: watchOrganizationId || null,
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        ...data,
      };

      if (currentUser?.id) {
        const { password, ...updatePayload } = payload;
        await updateUser(currentUser.id, updatePayload as IUpdateUser);
        onhandledisableField();
      } else {
        const createdUserId = await createUser(payload);
        const userID = createdUserId[0]?.id;
        router.push(paths.dashboard.user.edit(userID));
        reset();
      }

      mutate(endpoints.user.getAll);
      await mutate(endpoints.user.getAll);
    } catch (error) {
      console.error('Error:', error);
    }
  });

  return (
    <>
      <DashboardContent title="USER MANAGEMENT" currentIndex={currentIndex} total={total}>
        <BodyCard>
          <Form methods={methods} onSubmit={onSubmit}>
            <Box padding={{ xs: 1, sm: 2, md: 3 }}>
              <Grid container spacing={1} justifyContent="space-between">
                <Grid item xs={12} sm={12} md={12}>
                  <MasterAutoCompleteV2
                    name="organizationId"
                    label="Organization"
                    noOptionsText="No Organization Found"
                    isDisable={!isAdminUser || isDisable}
                    options={searchOrganizations}
                    getOptionLabel={(option) => option.legalName}
                    getOptionValue={(option) => option.id}
                    searchValue={oraganizationSearch.debouncedQuery}
                    onSearch={(value) => oraganizationSearch.setQuery(value)}
                    currentData={currentUser}
                    currentLabel={currentUser?.organization?.legalName || ''}
                    currentValue={Number(currentUser?.organizationId)}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'start',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '100px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <MasterAutoCompleteV2
                    name="branchId"
                    label="Branch"
                    noOptionsText="No Branch Found"
                    isDisable={!isAdminUser || isDisable}
                    options={searchOrganizationBranches}
                    getOptionLabel={(option) => option?.legalName || ''}
                    getOptionValue={(option) => option?.id}
                    searchValue={branchSearch.debouncedQuery}
                    onSearch={(value) => branchSearch.setQuery(value)}
                    currentData={currentUser}
                    currentLabel={currentUser?.branch?.legalName || ''}
                    currentValue={Number(currentUser?.branchId)}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'start',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '100px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <AutoCompleteFieldV2
                    label="User Full Name"
                    name="fullName"
                    options={searchUsers}
                    getOptionLabel={(d: IUserItem) => d?.fullName || ''}
                    getOptionValue={(d: IUserItem) => d?.id}
                    autoFocus={isFocus}
                    isdisable={isDisable}
                    isparticularSearch={isParticularSearch}
                    getRedirectPath={(id) => paths.dashboard.user.edit(id)}
                    onSearch={(text) => userSearch.setQuery(text)}
                    loading={searchUsersIsLoading}
                    BoxSx={{
                      display: { xs: 'block', md: 'grid' },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '100px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <RHFFormField
                    label="Password"
                    name="password"
                    isdisable={isDisable}
                    type="password"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <RHFFormField
                    label="Confirm Password"
                    name="conformPassword"
                    type="password"
                    isdisable={isDisable}
                    BoxSx={{
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
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Field.Phone label="Mobile" name="mobile" isdisable={isDisable} country="IN" />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <RHFFormField
                    label="Email"
                    name="email"
                    type="email"
                    isdisable={isDisable}
                    BoxSx={{
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
                    }}
                  />
                </Grid>
                {isAdminUser && (
                  <Grid item xs={12} sm={6} md={4}>
                    <RHFFormField
                      label="OTP Required"
                      options={RATE_CHANGEABLE_OPTIONS}
                      name="isOtpRequired"
                      isdisable={isDisable}
                      BoxSx={{
                        display: { xs: 'block', md: 'grid' },
                        alignItems: 'center',
                        gridTemplateColumns: { xs: '1fr 2fr', md: '100px 2fr' },
                        columnGap: 1,
                      }}
                    />
                  </Grid>
                )}

                {isAdminUser && (
                  <Grid item xs={12} sm={6} md={4}>
                    <RHFFormField
                      label="Switch Branch"
                      options={RATE_CHANGEABLE_OPTIONS}
                      name="canSwitchBranch"
                      isdisable={isDisable}
                      BoxSx={{
                        display: { xs: 'block', md: 'grid' },
                        alignItems: 'center',
                        gridTemplateColumns: { xs: '1fr 2fr', md: '120px 2fr' },
                        columnGap: 1,
                      }}
                    />
                  </Grid>
                )}

                {isAdminUser && (
                  <Grid item xs={12} sm={6} md={4}>
                    <ActiveInactiveField
                      name="isActive"
                      label="Status"
                      isdisable={isDisable}
                      fullWidth
                      BoxSx={{
                        display: { xs: 'block', md: 'grid' },
                        alignItems: 'center',
                        gridTemplateColumns: { xs: '1fr 2fr', md: '50px 2fr' },
                        columnGap: 1,
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          </Form>
        </BodyCard>
      </DashboardContent>
      <DoctorFormButtons
        currentData={currentUser}
        currentPath={paths.dashboard.user.new}
        isdisable={isDisable}
        isSubmitting={isSubmitting}
        onParticularSearch={onParticularSearch}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        handleDisable={handleDisable}
        onSubmit={onSubmit}
        onExit={handleExit}
      />
    </>
  );
}
