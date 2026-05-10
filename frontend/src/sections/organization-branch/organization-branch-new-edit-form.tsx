import type { ICurrentPaginatedResponse } from 'src/types/pagination-fillter';
import type {
  IOrganizationBranchItem,
  ICreateOrganizationBranchItem,
  IUpdateOrganizationBranchItem,
} from 'src/types/organization-branch';

import { mutate } from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Grid, Paper, Divider, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { usePagination } from 'src/hooks/use-pagination';
import { useDebouncedSearch } from 'src/hooks/use-debounce';

import { endpoints } from 'src/utils/axios';
import { compressImage, getPreviewImage } from 'src/utils/compressImage';

import { DashboardContent } from 'src/layouts/dashboard';
import { useSearchOranizations } from 'src/actions/organization';
import { OrganizationBranchSchema } from 'src/validator/oragnization-branch-validator';
import {
  createOrganizationBranch,
  updateOrganizationBranch,
  useGetOrganizationBranches,
  useSearchOrganizationBranches,
} from 'src/actions/organization-branch';

import RHFFormField from 'src/components/form-feild';
import DoctorFormButtons from 'src/components/button-group';
import { Form, Field, RHFUpload } from 'src/components/hook-form';
import RHFFormFieldTextArea from 'src/components/form-field-textarea';
import { AutoCompleteFieldV2 } from 'src/components/autocomplate-field-v2';
import MasterAutoCompleteV2 from 'src/components/master-autocomplate-field-v2';
import { ActiveInactiveField } from 'src/components/selection/active-inactive-selection';

type Props = {
  currentOrganizationBranch?: IOrganizationBranchItem;
  currentOrganizationBranchMeta?: ICurrentPaginatedResponse | undefined;
  currentOrganizationBranchLoading?: boolean;
};

export default function OrganizationBranchNewEditForm({
  currentOrganizationBranch,
  currentOrganizationBranchMeta,
  currentOrganizationBranchLoading,
}: Props) {
  // React Router
  const router = useRouter();

  // Fetch organizationbranches and organizations
  const { organizationbranches, organizationbranchesMeta } = useGetOrganizationBranches({
    searchFor: 'all',
    page: 1,
    perPage: 100,
  });

  // Oranization Search
  const oraganizationSearch = useDebouncedSearch();
  const { searchOrganizations } = useSearchOranizations(oraganizationSearch.debouncedQuery || '');

  // Branch Name Search
  const searchAdditional = useDebouncedSearch();
  const { searchOrganizationBranches, isLoading: searchOrganizationBranchesIsLoading } =
    useSearchOrganizationBranches({
      name: searchAdditional.debouncedQuery || '',
    });

  // Custom Hook
  const {
    currentIndex,
    total,
    isDisable,
    handleNext,
    onParticularSearch,
    onhandledisableField,
    isFocus,
    isParticularSearch,
    handleDisable,
    handlePrevious,
    handleExit,
  } = usePagination({
    items: organizationbranches,
    meta: organizationbranchesMeta,
    currentisLoading: currentOrganizationBranchLoading,
    currentItem: currentOrganizationBranch,
    currentMeta: currentOrganizationBranchMeta,
    routeGenerator: (id) => paths.dashboard.organizationBranch.edit(id),
    fallbackRoute: paths.dashboard.organizationBranch.new,
    listRouter: paths.dashboard.organizationBranch.list,
    exitPermissionkey: 'true',
  });

  const defaultValues: ICreateOrganizationBranchItem = useMemo(
    () => ({
      organizationId: currentOrganizationBranch?.organizationId ?? (0 as any),
      name: currentOrganizationBranch?.name || '',
      email: currentOrganizationBranch?.email || '',
      code: currentOrganizationBranch?.code || '',
      isDefault: currentOrganizationBranch?.isDefault || false,
      legalName: currentOrganizationBranch?.legalName || '',
      address: currentOrganizationBranch?.address || '',
      logoImage: currentOrganizationBranch?.logoImage || '',
      bannerImage: currentOrganizationBranch?.bannerImage || '',
      phoneNumber: currentOrganizationBranch?.phoneNumber || '',
      mobile: currentOrganizationBranch?.mobile || '',
      website: currentOrganizationBranch?.website || '',
      rohiniId: currentOrganizationBranch?.rohiniId || '',
      gstNo: currentOrganizationBranch?.gstNo || '',
      jurisdiction: currentOrganizationBranch?.jurisdiction || '',
      city: currentOrganizationBranch?.city || '',
      state: currentOrganizationBranch?.state || '',
      country: currentOrganizationBranch?.country || '',
      zipCode: currentOrganizationBranch?.zipCode || '',
      isActive: currentOrganizationBranch?.isActive ?? true,
      timezone: currentOrganizationBranch?.timezone || '',
    }),
    [currentOrganizationBranch]
  );

  const methods = useForm<ICreateOrganizationBranchItem>({
    resolver: zodResolver(OrganizationBranchSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, currentOrganizationBranch]);

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

  const handlelogoImageDrop = useCallback(
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
      let organizationbranchId = currentOrganizationBranch?.id;
      if (organizationbranchId) {
        await updateOrganizationBranch(organizationbranchId, data as IUpdateOrganizationBranchItem);
      } else {
        const created = await createOrganizationBranch(data as ICreateOrganizationBranchItem);
        organizationbranchId = created?.id;
        if (!organizationbranchId) throw new Error('Failed to create Organization Branch.');
        router.push(paths.dashboard.organizationBranch.edit(organizationbranchId));
      }
      onhandledisableField();
      await mutate(`${endpoints.organization.getAll}?searchFor=all&page=1&perPage=50`);
      await mutate(`${endpoints.organizationBranch.getAll}?searchFor=all&page=1&perPage=50`);
      await mutate(`${endpoints.user.getAll}?searchFor=all&page=1&perPage=50`);
    } catch (error) {
      console.error('Error:', error);
    }
  });

  return (
    <>
      <DashboardContent title="Branch" currentIndex={currentIndex} total={total}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Paper elevation={3}>
            {/* ============= Organization Selection ============= */}
            <Box sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Organization
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <MasterAutoCompleteV2
                    label="Organization"
                    name="organizationId"
                    isDisable={isDisable}
                    noOptionsText="No Organization Found"
                    options={searchOrganizations}
                    getOptionLabel={(option) => option.legalName}
                    getOptionValue={(option) => option.id}
                    searchValue={oraganizationSearch.debouncedQuery}
                    onSearch={(value) => oraganizationSearch.setQuery(value)}
                    currentData={currentOrganizationBranch}
                    currentLabel={currentOrganizationBranch?.legalName || ''}
                    currentValue={Number(currentOrganizationBranch?.id)}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '100px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* ============= Branch Info ============= */}
            <Divider />
            <Box sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Branch Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <RHFFormField label="Branch Code" name="code" isdisable={isDisable} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <AutoCompleteFieldV2
                    label="Branch Name"
                    name="name"
                    options={searchOrganizationBranches}
                    getOptionLabel={(d: IOrganizationBranchItem) => d.name}
                    getOptionValue={(d: IOrganizationBranchItem) => d.id}
                    autoFocus={isFocus}
                    isdisable={isDisable}
                    isparticularSearch={isParticularSearch}
                    getRedirectPath={(id) => paths.dashboard.organizationBranch.edit(id)}
                    onSearch={(text) => searchAdditional.setQuery(text)}
                    loading={searchOrganizationBranchesIsLoading}
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
                <Grid item xs={12} sm={3}>
                  <ActiveInactiveField
                    name="isActive"
                    label="Status"
                    fullWidth
                    isdisable={isDisable}
                    BoxSx={{
                      display: { xs: 'block', md: 'grid' },
                      alignItems: 'center',
                      gridTemplateColumns: { xs: '1fr 2fr', md: '50px 2fr' },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RHFFormField label="Legal Name" name="legalName" isdisable={isDisable} />
                </Grid>
                <Grid item xs={12}>
                  <RHFFormFieldTextArea
                    multiline
                    minRows={3}
                    label="Address"
                    name="address"
                    isdisable={isDisable}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '2px',
                        height: 'auto',
                        backgroundColor: '#fff',
                        color: 'black',
                        paddingX: '10px',
                        paddingY: '5px',
                        transition: 'all 0.3s ease-in-out',
                      },
                      '& textarea': {
                        transition: 'height 0.3s ease-in-out',
                        overflow: 'hidden',
                      },
                      '& .MuiInputBase-input': {
                        color: 'black',
                        fontSize: '13px',
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* ============= Contact Info ============= */}
            <Divider />
            <Box sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field.Phone
                    name="phoneNumber"
                    label="Phone No"
                    country="IN"
                    isdisable={isDisable}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field.Phone name="mobile" label="Mobile No" country="IN" isdisable={isDisable} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFFormField label="Email" name="email" isdisable={isDisable} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFFormField label="Website" name="website" isdisable={isDisable} />
                </Grid>
              </Grid>
            </Box>

            {/* ============= Branding ============= */}
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
                    onDrop={handlelogoImageDrop}
                    helperText="Upload Report logo (JPEG, PNG, max 3MB)"
                    value={getPreviewImage(methods.watch('logoImage') ?? undefined)}
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
                    value={getPreviewImage(methods.watch('bannerImage') ?? undefined)}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* ============= Legal Information ============= */}
            <Divider />
            <Box sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Legal Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <RHFFormField label="Rohini ID" name="rohiniId" isdisable={isDisable} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <RHFFormField
                    label="GST No"
                    name="gstNo"
                    isdisable={isDisable}
                    BoxSx={{
                      display: { xs: 'block', md: 'grid' },
                      alignItems: 'center',
                      gridTemplateColumns: { xs: '1fr 2fr', md: 'auto 2fr' },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <RHFFormField
                    label="Jurisdiction"
                    name="jurisdiction"
                    isdisable={isDisable}
                    BoxSx={{
                      display: { xs: 'block', md: 'grid' },
                      alignItems: 'center',
                      gridTemplateColumns: { xs: '1fr 2fr', md: 'auto 2fr' },
                      columnGap: 1,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* ============= Location ============= */}
            <Divider />
            <Box sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Location
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <RHFFormField label="City" name="city" isdisable={isDisable} />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <RHFFormField
                    label="State"
                    name="state"
                    isdisable={isDisable}
                    BoxSx={{
                      display: { xs: 'block', md: 'grid' },
                      alignItems: 'center',
                      gridTemplateColumns: { xs: '1fr 2fr', md: 'auto 2fr' },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <RHFFormField
                    label="Country"
                    name="country"
                    isdisable={isDisable}
                    BoxSx={{
                      display: { xs: 'block', md: 'grid' },
                      alignItems: 'center',
                      gridTemplateColumns: { xs: '1fr 2fr', md: 'auto 2fr' },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <RHFFormField
                    label="Zip Code"
                    name="zipCode"
                    isdisable={isDisable}
                    BoxSx={{
                      display: { xs: 'block', md: 'grid' },
                      alignItems: 'center',
                      gridTemplateColumns: { xs: '1fr 2fr', md: 'auto 2fr' },
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
        currentData={currentOrganizationBranch}
        currentPath={paths.dashboard.organizationBranch.new}
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
