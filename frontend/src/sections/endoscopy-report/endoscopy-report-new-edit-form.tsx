import type { ICurrentPaginatedResponse } from 'src/types/pagination-fillter';
import type { IReportTemplateSectionRecord } from 'src/types/report-template';

import { mutate } from 'swr';
import { useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import { Grid, Button, ImageList, Typography, ImageListItem } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { usePagination } from 'src/hooks/use-pagination';
import { useDebouncedSearch } from 'src/hooks/use-debounce';
import { useStatusDialog } from 'src/hooks/use-status-dialog';

import { endpoints } from 'src/utils/axios';

import { useSearchReportTemplates } from 'src/actions/report-template';
import BodyCard from 'src/components/body-card';
import { Form } from 'src/components/hook-form';
import RHFFormField from 'src/components/form-feild';
import CommonButton from 'src/components/common-button';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTimezone } from 'src/components/time-zone/useTimezoneDate';
import { GenderField } from 'src/components/selection/gender-selection';
import { AutoCompleteFieldV2 } from 'src/components/autocomplate-field-v2';
import MasterAutoCompleteV2 from 'src/components/master-autocomplate-field-v2';

import { EndoscopyReportHeader } from './endoscopy-report-header';
import EndoscopyReportFormButton from './endoscopy-report-footer';
import { text } from 'src/theme/core';
import { useSearchReportTypes } from 'src/actions/report-type';
import {
  ICreateEndoscopyReport,
  IEndoscopyReportRecord,
  IUpdateEndoscopyReport,
} from 'src/types/endoscopy-report';
import {
  createEndoscopyReport,
  updateEndoscopyReport,
  useGetEndoscopyReports,
} from 'src/actions/endoscopy-report';
import { useGetPatientRegistration } from 'src/actions/patient-registration';
import { EndoScopyReportValidator } from 'src/validator/endoscopy-report-validator';
import EndoScopyReportImage, { EndoscopyReportImageItem } from './endoscopy-report-modal-form';
import { useGetCameraCaptureById, useGetCaptures } from 'src/actions/camera-capture';

type Props = {
  currentData?: IEndoscopyReportRecord;
  currentMeta?: ICurrentPaginatedResponse;
  currentisLoading?: boolean;
};

export default function EndoscopyReportNewEditForm({
  currentData,
  currentMeta,
  currentisLoading,
}: Props) {
  // Json Files
  const [section, setSection] = useState<IReportTemplateSectionRecord[] | null>(null);
  const searchParams = useSearchParams();
  const patientIdFromQuery = Number(searchParams.get('patientId')) || null;
  const sessionIdFromQuery = String(searchParams.get('sessionCode')) || null;

  // timezone helpers
  const { formatPlainToInputDate, currentDate } = useTimezone();

  // React Router
  const router = useRouter();
  const { dialog, isOpen, showDialog, hideDialog } = useStatusDialog();

  const { endoscopyReports, endoscopyReportsMeta } = useGetEndoscopyReports({
    searchFor: 'all',
    page: 1,
    perPage: 50,
    searchedValue: '',
  });

  // Custome Hook
  const {
    currentIndex,
    total,
    isFocus,
    isDisable,
    handleNext,
    onParticularSearch,
    isParticularSearch,
    handleDisable,
    onhandledisableField,
    handlePrevious,
  } = usePagination({
    items: endoscopyReports,
    meta: endoscopyReportsMeta,
    currentisLoading,
    currentItem: currentData,
    currentMeta,
    routeGenerator: (id) => paths.dashboard.endoscopyReport.edit(id),
    fallbackRoute: paths.dashboard.patientRegistration.new,
    listRouter: paths.dashboard.patientRegistration.list,
    exitPermissionkey: 'true',
  });

  // Patient Registration Search Form Id
  const checkPatientId = currentData?.patientId || patientIdFromQuery || null;
  const checkSessionId = sessionIdFromQuery || null;
  const { patientRegistration } = useGetPatientRegistration(checkPatientId);

  const { captures } = useGetCaptures(checkSessionId);

  const [Captureimages, setCaptureImages] = useState<EndoscopyReportImageItem[]>(
    Array.isArray(captures) ? captures : []
  );

  const defaultValues = useMemo(
    () => ({
      patientId: currentData?.patientId || patientIdFromQuery || 0,
      recordId: currentData?.id ? currentData.id.toString() : '',
      uhid: patientRegistration?.uhid || '-',
      patientName:
        `${patientRegistration?.firstName || ''} ${patientRegistration?.middleName || ''} ${patientRegistration?.lastName || ''}` ||
        '',
      age: patientRegistration?.age || '',
      sex: patientRegistration?.sex || '',
      hospitalDoctor: `${patientRegistration?.hospitalDoctor || ''}`,
      refDrName: `${patientRegistration?.referenceDoctor || ''}`,
      remark: currentData?.remark || '',
      reportDate: currentData?.reportDate
        ? formatPlainToInputDate(currentData.reportDate)
        : currentDate(),
      entryDate: currentData?.entryDate
        ? formatPlainToInputDate(currentData.entryDate)
        : currentDate(),
      reportTypeId: currentData?.reportTypeId || 0,
      templateId: currentData?.templateId || 0,
      values:
        currentData?.values?.map((val) => ({
          templateSectionId: val.templateSectionId,
          value: val.value || '',
        })) || [],
      images:
        currentData?.images?.map((img) => ({
          templateSectionId: img.templateSectionId,
          imagePath: img.imagePath || '',
        })) || [],
    }),
    [currentData, currentDate, formatPlainToInputDate, patientRegistration]
  );

  const methods = useForm<ICreateEndoscopyReport>({
    resolver: zodResolver(EndoScopyReportValidator),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = methods;

  const watchImages = watch('images') || [];
  const watchTemplateId = watch('templateId');
  const watchReportTypeId = watch('reportTypeId');

  useEffect(() => {
    reset(defaultValues);
    setCaptureImages(Array.isArray(captures) ? captures : []);
  }, [defaultValues, reset, currentData, captures]);

  // Report Template
  const reportTemplateSearch = useDebouncedSearch();
  const { searchReportTemplates } = useSearchReportTemplates(
    reportTemplateSearch.debouncedQuery || '',
    watchReportTypeId || null
  );

  // Report Type
  const reportTypeSearch = useDebouncedSearch();
  const { searchReportTypes } = useSearchReportTypes(reportTypeSearch.debouncedQuery || '');

  const onSubmit = handleSubmit(
    async (data) => {
      try {
        const endoScopyReportId = currentData?.id;

        const payload = {
          ...data,
          values: data.values?.map((val) => ({
            ...val,
            templateSectionId: watchTemplateId,
          })),
        };
        if (endoScopyReportId) {
          await updateEndoscopyReport(currentData?.id, payload as IUpdateEndoscopyReport);
        } else {
          const res = await createEndoscopyReport(payload as ICreateEndoscopyReport);
          if (!res?.id) throw new Error('Endoscopy Report Create Time Error');
          router.push(paths.dashboard.endoscopyReport.edit(Number(res?.id)));
        }
        onhandledisableField();
        await mutate(`${endpoints.endoscopyReport.getAll}?searchFor=all&page=1&perPage=50`);
      } catch (error) {
        console.error('Error:', error);
      }
    },
    (errors) => {
      console.error('Validation Errors:', errors);
    }
  );

  const handleExit = () => {
    router.push(paths.dashboard.root);
  };

  return (
    <>
      <EndoscopyReportHeader
        title="Report"
        methods={methods}
        currentIndex={currentIndex}
        total={total}
        isdisable={isDisable}
        currentData={currentData}
      >
        <BodyCard>
          <Form methods={methods} onSubmit={onSubmit}>
            <Box sx={{ px: 3, py: 1, backgroundColor: 'rgba(217, 217, 217, 0.5)' }}>
              <Box
                display="grid"
                gridTemplateColumns={{
                  xs: '1fr',
                  md: 'repeat(8, 1fr)',
                }}
                alignItems="end"
                columnGap={{ md: 1 }}
                rowGap={{ xs: 1 }}
              >
                <Box gridColumn="span 1">
                  <RHFFormField
                    readonly
                    label="Record ID"
                    name="recordId"
                    BoxSx={{
                      textAlign: 'start',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fff',
                        color: 'black',
                        height: '28px',
                      },
                    }}
                    labelSx={{ color: 'black' }}
                  />
                </Box>
                <Box gridColumn="span 1">
                  <RHFFormField
                    readonly
                    label="UHID"
                    name="uhid"
                    BoxSx={{
                      textAlign: 'start',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fff',
                        color: 'black',
                        height: '28px',
                      },
                    }}
                    labelSx={{ color: 'black' }}
                  />
                </Box>
                <Box gridColumn="span 4">
                  <RHFFormField
                    readonly
                    label="Name"
                    name="patientName"
                    BoxSx={{
                      textAlign: 'start',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fff',
                        color: 'black',
                        height: '28px',
                      },
                    }}
                    labelSx={{ color: 'black' }}
                  />
                </Box>
                <Box>
                  <RHFFormField
                    readonly
                    label="Age"
                    name="age"
                    BoxSx={{ textAlign: 'center' }}
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
                    labelSx={{ color: 'black' }}
                  />
                </Box>
                <Box>
                  <GenderField
                    readonly
                    label="Sex"
                    name="sex"
                    BoxSx={{ textAlign: 'start' }}
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
                    labelSx={{ color: 'black' }}
                  />
                </Box>
                <Box gridColumn="span 2">
                  <RHFFormField
                    readonly
                    label="Doctor Name"
                    name="hospitalDoctor"
                    BoxSx={{
                      textAlign: 'start',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fff',
                        color: 'black',
                        height: '28px',
                      },
                    }}
                    labelSx={{ color: 'black' }}
                  />
                </Box>
                <Box gridColumn="span 2">
                  <RHFFormField
                    readonly
                    label="Ref Name"
                    name="refName"
                    BoxSx={{
                      textAlign: 'start',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fff',
                        color: 'black',
                        height: '28px',
                      },
                    }}
                    labelSx={{ color: 'black' }}
                  />
                </Box>
                <Box gridColumn="span 4">
                  <RHFFormField
                    label="Remarks"
                    name="remark"
                    BoxSx={{
                      textAlign: 'start',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fff',
                        color: 'black',
                        height: '28px',
                      },
                    }}
                    labelSx={{ color: 'black' }}
                  />
                </Box>
              </Box>
            </Box>
            {/* Dynamic Report */}
            <Grid container spacing={1} sx={{ px: 3, py: 2 }}>
              <Grid item xs={12} sm={12} md={6}>
                <Box
                  sx={{
                    backgroundColor: 'rgba(217, 217, 217, 0.5)',
                    padding: 1,
                  }}
                >
                  <Box>
                    <MasterAutoCompleteV2
                      name="reportTypeId"
                      label="Report Type :- "
                      noOptionsText="No Report Template"
                      options={searchReportTypes}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                      currentData={currentData}
                      currentLabel={currentData?.reportType?.name || ''}
                      currentValue={currentData?.reportType?.id || null}
                      searchValue={reportTypeSearch.query}
                      onSearch={(value) => reportTypeSearch.setQuery(value)}
                      onSelectOption={(opation) => {
                        if (opation?.original) {
                          setValue('reportTypeId', opation?.original?.id);
                        } else if (opation === null) {
                          reset(defaultValues);
                          setSection([]);
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
                          md: '130px 2fr',
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
                      labelSx={{
                        color: 'black',
                        fontWeight: 600,
                        fontSize: '15px',
                        textAlign: 'right',
                      }}
                    />
                  </Box>
                  <Box mt={1}>
                    <MasterAutoCompleteV2
                      name="templateId"
                      label="Report Heading :- "
                      noOptionsText="No Report Template"
                      isDisable={!watchReportTypeId}
                      options={searchReportTemplates}
                      getOptionLabel={(option) => option.title}
                      getOptionValue={(option) => option.id}
                      searchValue={reportTemplateSearch.query}
                      onSearch={(value) => reportTemplateSearch.setQuery(value)}
                      currentData={currentData}
                      currentLabel={currentData?.template?.title || ''}
                      currentValue={currentData?.template?.id || null}
                      BoxSx={{
                        display: {
                          xs: 'block',
                          md: 'grid',
                        },
                        alignItems: 'center',
                        gridTemplateColumns: {
                          xs: '1fr 2fr',
                          md: '130px 2fr',
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
                      labelSx={{
                        color: 'black',
                        fontWeight: 600,
                        fontSize: '15px',
                        textAlign: 'right',
                      }}
                      onSelectOption={(option) => {
                        if (option?.original) {
                          setSection(option?.original?.sections || []);
                        } else if (option?.original === null) {
                          setSection([]);
                        }
                      }}
                    />
                  </Box>
                  <Box mt={1}>
                    {section
                      ?.sort((a, b) => Number(a.sequence) - Number(b.sequence))
                      ?.map((sec, index) => {
                        if (sec?.parameter?.isHeading) {
                          return (
                            <Typography
                              key={index}
                              sx={{ mt: 0.5, mb: 0.5, fontSize: '15px', fontWeight: 600 }}
                            >
                              {sec?.parameter?.name || '-'}
                            </Typography>
                          );
                        }

                        const fieldIndex = section
                          ?.filter((s) => !s?.parameter?.isHeading)
                          ?.findIndex((s) => s.id === sec.id);

                        return (
                          <Box sx={{ mt: 0.5, mb: 0.5 }}>
                            <RHFFormField
                              key={index}
                              label={`${sec?.parameter?.name} :-` || '-'}
                              name={`values.${fieldIndex}.value`}
                              isdisable={!watchTemplateId}
                              BoxSx={{
                                display: {
                                  xs: 'block',
                                  md: 'grid',
                                },
                                alignItems: 'center',
                                gridTemplateColumns: {
                                  xs: '1fr 2fr',
                                  md: '130px 2fr',
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
                              labelSx={{
                                textAlign: 'right',
                                color: 'black',
                              }}
                            />
                            {/* <AutoCompleteFieldV2
                              key={index}
                              label={`${sec?.parameter?.name} :-` || '-'}
                              name={`title_${sec.id}`}
                              options={searchReportTemplates}
                              getOptionValue={(l) => l.id}
                              getOptionLabel={(l) => l.title}
                              isdisable={isDisable}
                              getRedirectPath={(id) => paths.dashboard.reportTemplate.edit(id)}
                              onSearch={(value) => reportTemplateSearch.setQuery(value)}
                              labelSx={{
                                textAlign: 'right',
                                color: 'black',
                              }}
                              BoxSx={{
                                display: {
                                  xs: 'block',
                                  md: 'grid',
                                },
                                alignItems: 'center',
                                gridTemplateColumns: {
                                  xs: '1fr 2fr',
                                  md: '130px 2fr',
                                },
                                columnGap: 1,
                              }}
                              Sx={{
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
                            /> */}
                          </Box>
                        );
                      })}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={0.5} />
              <Grid item xs={12} sm={12} md={5.5}>
                <EndoScopyReportImage
                  myImages={watchImages as EndoscopyReportImageItem[]}
                  captureImages={Captureimages}
                  onAddImages={(params: { imagePath: string }[]) =>
                    setValue(
                      'images',
                      params.map((p) => ({
                        templateSectionId: watchTemplateId ? Number(watchTemplateId) : null,
                        imagePath: p.imagePath,
                      })),
                      { shouldDirty: true }
                    )
                  }
                />
              </Grid>
            </Grid>
          </Form>
        </BodyCard>
      </EndoscopyReportHeader>

      <EndoscopyReportFormButton
        currentData={currentData}
        currentPath={paths.dashboard.patientRegistration.new}
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
