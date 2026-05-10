import type { ICurrentPaginatedResponse } from 'src/types/pagination-fillter';
import type {
  IOrganizationItem,
  ICreateOrganizationItem,
  IUpdateOrganizationItem,
} from 'src/types/organization';

import { mutate } from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback } from 'react';
import { LicenseTypeSelectOption, LicenseStatusSelectOption } from 'endoscopy-shared';

import Box from '@mui/material/Box';
import { Grid, Paper, Divider, Tooltip, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { usePagination } from 'src/hooks/use-pagination';
import { useDebouncedSearch } from 'src/hooks/use-debounce';

import { endpoints } from 'src/utils/axios';
import { compressImage, getPreviewImage } from 'src/utils/compressImage';

import { DashboardContent } from 'src/layouts/dashboard';
import { OrganizationSchema } from 'src/validator/oragnization-validator';
import {
  createOrganization,
  updateOrganization,
  useGetOrganizations,
  useSearchOranizations,
} from 'src/actions/organization';

import RHFFormField from 'src/components/form-feild';
import DoctorFormButtons from 'src/components/button-group';
import { Form, Field, RHFUpload } from 'src/components/hook-form';
import { AutoCompleteFieldV2 } from 'src/components/autocomplate-field-v2';
import { LICENCE_STATUS_SELECTION } from 'src/components/selection/license-type-selection';
import { LICENCE_TYPE_SELECTION } from 'src/components/selection/license-status-selection';

type Props = {
  currentOrganization?: IOrganizationItem;
  currentOrganizationMeta?: ICurrentPaginatedResponse | undefined;
  currentOrganizationLoading?: boolean;
};

export default function OrganizationNewEditForm({
  currentOrganization,
  currentOrganizationMeta,
  currentOrganizationLoading,
}: Props) {
  // React Router
  const router = useRouter();

  // Fetch organizations
  const { organizations, organizationsMeta } = useGetOrganizations({
    searchFor: 'all',
    page: 1,
    perPage: 100,
  });

  // Oranization Search
  const oraganizationSearch = useDebouncedSearch();
  const { searchOrganizations, searchOrganizationsIsLoading } = useSearchOranizations(
    oraganizationSearch.debouncedQuery || ''
  );

  // Custome Hook
  const {
    currentIndex,
    total,
    isFocus,
    isDisable,
    handleNext,
    onParticularSearch,
    isParticularSearch,
    onhandledisableField,
    handleDisable,
    handlePrevious,
    handleExit,
  } = usePagination({
    items: organizations,
    meta: organizationsMeta,
    currentisLoading: currentOrganizationLoading,
    currentItem: currentOrganization,
    currentMeta: currentOrganizationMeta,
    routeGenerator: (id) => paths.dashboard.organization.edit(id),
    fallbackRoute: paths.dashboard.organization.new,
    listRouter: paths.dashboard.organization.list,
    exitPermissionkey: 'true',
  });

  const defaultValues: ICreateOrganizationItem = useMemo(
    () => ({
      name: currentOrganization?.name || '',
      bannerImage: currentOrganization?.bannerImage || '',
      logoImage: currentOrganization?.logoImage || '',
      legalName: currentOrganization?.legalName || '',
      email: currentOrganization?.email || '',
      mobile: currentOrganization?.mobile || '',
      licenseKey: currentOrganization?.licenseKey || '',
      licenseType: currentOrganization?.licenseType || LicenseTypeSelectOption.Trial,
      expiryDate: currentOrganization?.expiryDate || '',
      status: currentOrganization?.status || LicenseStatusSelectOption.Active,
    }),
    [currentOrganization]
  );

  const methods = useForm<ICreateOrganizationItem>({
    resolver: zodResolver(OrganizationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, currentOrganization]);

  const handlebannderImageDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        try {
          const compressedFile = await compressImage(file);
          const base64 = await convertToBase64(compressedFile);
          setValue('bannerImage', base64, { shouldValidate: true });
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }
    },
    [setValue]
  );

  const handlelogoImage = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        try {
          const compressedFile = await compressImage(file);
          const base64 = await convertToBase64(compressedFile);
          setValue('logoImage', base64, { shouldValidate: true });
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }
    },
    [setValue]
  );

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const onSubmit = handleSubmit(async (data) => {
    try {
      let organizationId = currentOrganization?.id;
      if (organizationId) {
        await updateOrganization(organizationId, data as IUpdateOrganizationItem);
      } else {
        const createorganizationId = await createOrganization(data as ICreateOrganizationItem);
        organizationId = createorganizationId?.id;
        if (!organizationId) throw new Error('Failed to create Doctor Master.');
        router.push(paths.dashboard.organization.edit(organizationId));
      }
      onhandledisableField();
      await mutate(`${endpoints.organization.getAll}?searchFor=all&page=1&perPage=50`);
    } catch (error) {
      console.error('Error:', error);
    }
  });

  return (
    <>
      <DashboardContent title="Organization" currentIndex={currentIndex} total={total}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Paper elevation={3}>
            <Box sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Basic Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={3.5}>
                  <Tooltip title="Automatic Generated" arrow>
                    <span>
                      <RHFFormField
                        label="License Key"
                        name="licenseKey"
                        isdisable
                        BoxSx={{
                          display: {
                            xs: 'block',
                            md: 'grid',
                          },
                          alignItems: 'center',
                          gridTemplateColumns: {
                            xs: '1fr 2fr',
                            md: '120px 2fr',
                          },
                          columnGap: 1,
                        }}
                      />
                    </span>
                  </Tooltip>
                </Grid>
                <Grid item xs={12} sm={2.5}>
                  <RHFFormField
                    label="License Type"
                    name="licenseType"
                    options={LICENCE_TYPE_SELECTION}
                    isdisable={isDisable}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: 'auto 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <RHFFormField
                    label="Expiry Date"
                    name="expiryDate"
                    type="date"
                    isdisable={isDisable}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: 'auto 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <RHFFormField
                    label="Status"
                    name="status"
                    options={LICENCE_STATUS_SELECTION}
                    isdisable={isDisable}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: 'auto 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <AutoCompleteFieldV2
                    label="Organization Name"
                    name="name"
                    options={searchOrganizations}
                    getOptionLabel={(d: IOrganizationItem) => d.name}
                    getOptionValue={(d: IOrganizationItem) => d.id}
                    autoFocus={isFocus}
                    isdisable={isDisable}
                    isparticularSearch={isParticularSearch}
                    getRedirectPath={(id) => paths.dashboard.organization.edit(id)}
                    onSearch={(text) => oraganizationSearch.setQuery(text)}
                    loading={searchOrganizationsIsLoading}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '120px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RHFFormField
                    label="Legal Name"
                    name="legalName"
                    isdisable={isDisable}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '120px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* ================= BRANDING ================= */}
            <Divider />

            <Box sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Branding
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Report Image
                  </Typography>
                  <RHFUpload
                    name="logoImage"
                    maxSize={3145728}
                    disabled={isDisable}
                    onDrop={handlelogoImage}
                    helperText="Upload Report logo (JPEG, PNG, max 3MB)"
                    value={getPreviewImage(methods.watch('logoImage'))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Banner Image
                  </Typography>
                  <RHFUpload
                    name="bannerImage"
                    maxSize={3145728}
                    disabled={isDisable}
                    onDrop={handlebannderImageDrop}
                    helperText="Upload banner image (JPEG, PNG, max 3MB)"
                    value={getPreviewImage(methods.watch('bannerImage'))}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* ================= CONTACT INFO ================= */}
            <Divider />
            <Box sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <RHFFormField
                    label="Email"
                    name="email"
                    isdisable={isDisable}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '120px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field.Phone
                    name="mobile"
                    label="Phone Number"
                    country="IN"
                    isdisable={isDisable}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '120px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Form>
      </DashboardContent>
      <DoctorFormButtons
        currentData={currentOrganization}
        currentPath={paths.dashboard.organization.new}
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
