import type { ICurrentPaginatedResponse } from 'src/types/pagination-fillter';
import type {
  ICreateReportTemplate,
  IReportTemplateRecord,
  IUpdateReportTemplate,
  IReportTemplateSectionRecord,
} from 'src/types/report-template';

import { mutate } from 'swr';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import { Grid, Paper, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { usePagination } from 'src/hooks/use-pagination';
import { useDebouncedSearch } from 'src/hooks/use-debounce';
import { useStatusDialog } from 'src/hooks/use-status-dialog';

import { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';
import { useSearchReportTypes } from 'src/actions/report-type';
import { ReportTemplateSchema } from 'src/validator/report-template-validator';
import {
  createReportTemplate,
  updateReportTemplate,
  useGetReportTemplates,
  useSearchReportTemplates,
} from 'src/actions/report-template';

import { Form } from 'src/components/hook-form';
import RHFFormField from 'src/components/form-feild';
import DoctorFormButtons from 'src/components/button-group';
import { AutoCompleteFieldV2 } from 'src/components/autocomplate-field-v2';
import { ConfirmDialog } from 'src/components/custom-dialog/confirm-dialog';
import MasterAutoCompleteV2 from 'src/components/master-autocomplate-field-v2';
import { ActiveInactiveField } from 'src/components/selection/active-inactive-selection';

import ReportTemplateFieldEditForm from './report-template-field-edit-from';

type Props = {
  currentReportTemplate?: IReportTemplateRecord | undefined;
  currentReportTemplateMeta?: ICurrentPaginatedResponse | undefined;
  currentReportTemplateLoading?: boolean;
};

export default function ReportTemplateNewEditForm({
  currentReportTemplate,
  currentReportTemplateMeta,
  currentReportTemplateLoading,
}: Props) {
  // React Router
  const router = useRouter();
  const { dialog, isOpen, showDialog, hideDialog } = useStatusDialog();

  // Fetch report templates
  const { reportTemplates, reportTemplatesMeta } = useGetReportTemplates({
    searchFor: 'all',
    page: 1,
    perPage: 100,
  });

  // Report Template Search
  const reportTemplateSearch = useDebouncedSearch();
  const { searchReportTemplates } = useSearchReportTemplates(
    reportTemplateSearch.debouncedQuery || ''
  );

  // Report Type Seacrh
  const reportTypeSearch = useDebouncedSearch();
  const { searchReportTypes } = useSearchReportTypes(reportTypeSearch.debouncedQuery || '');

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
    items: reportTemplates,
    meta: reportTemplatesMeta,
    currentisLoading: currentReportTemplateLoading,
    currentItem: currentReportTemplate,
    currentMeta: currentReportTemplateMeta,
    routeGenerator: (id) => paths.dashboard.reportTemplate.edit(id),
    fallbackRoute: paths.dashboard.reportTemplate.new,
    listRouter: paths.dashboard.reportTemplate.list,
    exitPermissionkey: 'true',
  });

  const defaultValues: ICreateReportTemplate = useMemo(
    () => ({
      reportTypeId: currentReportTemplate?.reportTypeId || null,
      title: currentReportTemplate?.title || '',
      code: currentReportTemplate?.code || '',
      maxImages: currentReportTemplate?.maxImages || 0,
      isActive: currentReportTemplate?.isActive || true,
      sections:
        currentReportTemplate?.sections?.map((section) => ({
          ...section,
          parameterId: section.parameterId || 0,
        })) || [],
    }),
    [currentReportTemplate]
  );

  const methods = useForm<ICreateReportTemplate>({
    resolver: zodResolver(ReportTemplateSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  const watchSections = watch('sections') || [];

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, currentReportTemplate]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let reportTemplateId = currentReportTemplate?.id;
      if (reportTemplateId) {
        await updateReportTemplate(reportTemplateId, data as IUpdateReportTemplate);
      } else {
        const createReportTemplateId = await createReportTemplate(data as ICreateReportTemplate);
        reportTemplateId = createReportTemplateId?.id;
        if (!reportTemplateId) throw new Error('Failed to create Report Template.');
        router.push(paths.dashboard.reportTemplate.edit(reportTemplateId));
      }
      onhandledisableField();
      await mutate(`${endpoints.reportTemplate.getAll}?searchFor=all&page=1&perPage=50`);
    } catch (error) {
      console.error('Error:', error);
    }
  });

  return (
    <>
      <DashboardContent title="Report Template" currentIndex={currentIndex} total={total}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Paper elevation={3}>
            <Box sx={{ p: 2, borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <MasterAutoCompleteV2
                    name="reportTypeId"
                    label="Report Type"
                    noOptionsText="No Report Type Found"
                    options={searchReportTypes}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    isDisable={isDisable}
                    searchValue={reportTypeSearch.query}
                    onSearch={(value) => reportTypeSearch.setQuery(value)}
                    currentData={currentReportTemplate}
                    currentValue={currentReportTemplate?.reportTypeId || null}
                    currentLabel={currentReportTemplate?.reportType?.name || ''}
                    onSelectOption={(option) => {
                      if (option?.original) {
                        setValue('reportTypeId', option?.original?.id || null, {
                          shouldDirty: true,
                        });
                      } else if (option === null) {
                        setValue('reportTypeId', null, { shouldDirty: true });
                      }
                    }}
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
                    InputSx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '2px',
                        height: '28px',
                        backgroundColor: '#fff',
                        color: 'black',
                      },
                      '& .MuiInputBase-input': {
                        color: 'black',
                        fontSize: '13px',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <AutoCompleteFieldV2
                    label="Report Template"
                    name="title"
                    options={searchReportTemplates}
                    getOptionValue={(l) => l.id}
                    getOptionLabel={(l) => l.title}
                    isdisable={isDisable}
                    autoFocus={isFocus}
                    isparticularSearch={isParticularSearch}
                    getRedirectPath={(id) => paths.dashboard.reportTemplate.edit(id)}
                    onSearch={(value) => reportTemplateSearch.setQuery(value)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <RHFFormField name="code" label="Code" fullWidth isdisable={isDisable} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <RHFFormField
                    name="maxImages"
                    label="Max Images"
                    type="number"
                    fullWidth
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
                <Grid item xs={12} sm={4} />
                <Grid item xs={12} sm={2}>
                  <ActiveInactiveField
                    name="isActive"
                    label="Status"
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

                <Grid item xs={12} sm={12}>
                  <ReportTemplateFieldEditForm
                    isdisable={isDisable}
                    showDialog={showDialog}
                    hideDialog={hideDialog}
                    myreportTemplates={watchSections}
                    onAddReportTemplates={(params: IReportTemplateSectionRecord[]) =>
                      setValue('sections', params)
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Form>
      </DashboardContent>
      <DoctorFormButtons
        currentData={currentReportTemplate}
        currentPath={paths.dashboard.reportTemplate.new}
        isdisable={isDisable}
        isSubmitting={isSubmitting}
        onParticularSearch={onParticularSearch}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        handleDisable={handleDisable}
        onSubmit={onSubmit}
        onExit={handleExit}
      />

      {/* Dialog */}

      <ConfirmDialog
        open={isOpen}
        onClose={hideDialog}
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" color={dialog?.type}>
              {dialog?.title}
            </Typography>
          </Box>
        }
        content={
          <Typography variant="body1" color="textSecondary">
            {dialog?.message}
          </Typography>
        }
        action={
          <>
            {dialog?.cancelLabel && (
              <Button variant="outlined" onClick={dialog?.onCancel}>
                {dialog?.cancelLabel}
              </Button>
            )}

            {dialog?.confirmLabel && (
              <Button variant="contained" color={dialog?.type} onClick={dialog?.onConfirm}>
                {dialog?.confirmLabel}
              </Button>
            )}
          </>
        }
      />
    </>
  );
}
