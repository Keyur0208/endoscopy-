import type { ICurrentPaginatedResponse } from 'src/types/pagination-fillter';
import type {
  IPatientRegistrationItem,
  ICreatePatientRegistration,
  IUpdatePatientRegistration,
} from 'src/types/patient-registration';

import { mutate } from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { AgeUnit, CategorType, MaritalStatus } from 'endoscopy-shared';

import Box from '@mui/material/Box';
import { Grid, Stack, Button, Divider, Tooltip, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { usePagination } from 'src/hooks/use-pagination';
import { useDebouncedSearch } from 'src/hooks/use-debounce';
import { useStatusDialog } from 'src/hooks/use-status-dialog';

import { endpoints } from 'src/utils/axios';
import { compressImage } from 'src/utils/compressImage';

import { hospitalReportConfiguration } from 'src/actions/hospita-info';
import { PatientRegistrationSchema } from 'src/validator/patient-registration-validator';
import {
  createPatientRegistration,
  updatePatientRegistration,
  useGetPatientRegistrations,
  useSearchPatientRegistrations,
} from 'src/actions/patient-registration';

import BodyCard from 'src/components/body-card';
import RHFFormField from 'src/components/form-feild';
import CustomTitle from 'src/components/custome-title';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTimezone } from 'src/components/time-zone/useTimezoneDate';
import { GenderField } from 'src/components/selection/gender-selection';
import { AutoCompleteFieldV2 } from 'src/components/autocomplate-field-v2';
import { Form, Field, RHFCheckbox, RHFUploadAvatar } from 'src/components/hook-form';
import { ReligionSelectionField } from 'src/components/selection/religion-selection';
import { YearMonthDayField } from 'src/components/selection/year-month-day-selection';
import { LanguagesSelectionField } from 'src/components/selection/languages-selection';
import { RateChangeableField } from 'src/components/selection/rate-changeable-selection';
import { BloodGroupSelectionField } from 'src/components/selection/blood-group-selection';
import { CalculateAge, toAgeBreakdown, GetDateDifference } from 'src/components/caculation_age';
import { MaritalStatusSelectionField } from 'src/components/selection/marital-status-selection';

import PatientRegisterFormButton from './patient-registration-footer';
import { PatientRegisterHeader } from './patient-registartion-header';

type Props = {
  currentData?: IPatientRegistrationItem;
  currentMeta?: ICurrentPaginatedResponse;
  currentisLoading?: boolean;
};

export default function PatientRegistrationNewEditForm({
  currentData,
  currentMeta,
  currentisLoading,
}: Props) {
  // Json Files
  const hospitalCity = hospitalReportConfiguration?.hospital?.city || '';
  const hospitalState = hospitalReportConfiguration?.hospital?.state || '';

  // timezone helpers
  const { formatPlainToInputDate, currentDate } = useTimezone();

  // React Router
  const router = useRouter();
  const { dialog, isOpen, showDialog, hideDialog } = useStatusDialog();

  const { patientRegistrations, patientRegistrationsMeta } = useGetPatientRegistrations({
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
    items: patientRegistrations,
    meta: patientRegistrationsMeta,
    currentisLoading,
    currentItem: currentData,
    currentMeta,
    routeGenerator: (id) => paths.dashboard.patientRegistration.edit(id),
    fallbackRoute: paths.dashboard.patientRegistration.new,
    listRouter: paths.dashboard.patientRegistration.list,
    exitPermissionkey: 'true',
  });

  const defaultValues: ICreatePatientRegistration = useMemo(
    () => ({
      registrationDate: currentData?.registrationDate
        ? formatPlainToInputDate(currentData?.registrationDate)
        : currentDate(),
      caseDate: currentData?.caseDate
        ? formatPlainToInputDate(currentData.caseDate)
        : currentDate(),
      uhid: currentData?.uhid || '',
      recordId: currentData?.recordId || '',
      firstName: currentData?.firstName || '',
      middleName: currentData?.middleName || '',
      lastName: currentData?.lastName || '',
      category: currentData?.category || CategorType.New,
      birthDate: currentData?.birthDate ? formatPlainToInputDate(currentData?.birthDate) : '',
      ageUnit: currentData?.ageUnit || AgeUnit.YEAR,
      age: currentData?.age || undefined,
      sex: currentData?.sex || '',
      weddingDate: currentData?.weddingDate ? formatPlainToInputDate(currentData?.weddingDate) : '',
      hospitalDoctor: currentData?.hospitalDoctor || '',
      referenceDoctor: currentData?.referenceDoctor || '',
      language: currentData?.language || '',
      religion: currentData?.religion || '',
      height: currentData?.height || null,
      weight: currentData?.weight || null,
      bloodGroup: currentData?.bloodGroup || '',
      maritalStatus: currentData?.maritalStatus || '',
      mobile: currentData?.mobile || '',
      mobile2: currentData?.mobile2 || '',
      office: currentData?.office || '',
      email: currentData?.email || '',
      address: currentData?.address || '',
      area: currentData?.area || '',
      city: currentData?.city || hospitalCity,
      state: currentData?.state || hospitalState,
      pin: currentData?.pin || '',
      nationality: currentData?.nationality || 'India',
      typeOfVisa: currentData?.typeOfVisa || '',
      adharCard: currentData?.adharCard || null,
      profileImage: currentData?.profileImage || '',
      panCard: currentData?.panCard || null,
      membershipId: currentData?.membershipId || '',
      employeesId: currentData?.employeesId || '',
      occupation: currentData?.occupation || '',
      spouseOccupation: currentData?.spouseOccupation || '',
      companyName: currentData?.companyName || '',
      education: currentData?.education || '',
      yojanaCardNo: currentData?.yojanaCardNo || '',
      mediclaim: currentData?.mediclaim ?? true,
      remark: currentData?.remark || '',
      referralTo: currentData?.referralTo || '',
      transfer: currentData?.transfer || '',
    }),
    [currentData, currentDate, hospitalState, hospitalCity, formatPlainToInputDate]
  );

  const methods = useForm<ICreatePatientRegistration>({
    resolver: zodResolver(PatientRegistrationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  // Marital Status

  const watchMaritalStatus = watch('maritalStatus');

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        try {
          const compressedFile = await compressImage(file);
          const base64 = await convertToBase64(compressedFile);
          setValue('profileImage', base64, { shouldValidate: true });
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

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, currentData]);

  // Age Counting

  const birthdate = watch('birthDate');
  const watchAge = watch('age');
  const watchAgeunit = watch('ageUnit');
  const [dateDiff, setDateDiff] = useState({ years: 0, months: 0, days: 0 });

  useEffect(() => {
    if (birthdate) {
      const age = CalculateAge(birthdate);
      const diff = GetDateDifference(birthdate);
      setDateDiff(diff);
      setValue('age', age.age, { shouldValidate: true });
      setValue('ageUnit', age.ageUnit, { shouldValidate: true });
    } else {
      const diffs = toAgeBreakdown(watchAge, watchAgeunit);
      setDateDiff(diffs);
    }
  }, [birthdate, watchAge, watchAgeunit, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentData) {
        await updatePatientRegistration(currentData?.id, data as IUpdatePatientRegistration);
      } else {
        const res = await createPatientRegistration(data);
        if (!res?.id) throw new Error('Patient Registration Create Time Error');
        router.push(paths.dashboard.patientRegistration.edit(Number(res?.id)));
      }
      onhandledisableField();
      await mutate(`${endpoints.patientRegistration.getAll}?searchFor=all&page=1&perPage=50`);
    } catch (error) {
      console.error('Error:', error);
    }
  });

  // Search Patient Registrations by UHID
  const uhidOptionSearch = useDebouncedSearch();
  const { searchPatientRegistrations } = useSearchPatientRegistrations(
    uhidOptionSearch.debouncedQuery || ''
  );

  const handleExitHistory = () => {
    router.back();
  };

  const handleCameraCapture = () => {
    if (!currentData) {
      showDialog('Camera Capture', 'Please Save Patient Data ', 'info', {
        hideCancel: true,
        confirmLabel: 'OK',
        onConfirm: () => {
          hideDialog();
        },
      });
      return;
    }
    router.push(`${paths.dashboard.cameraCapture.new}?patientId=${currentData?.id || ''}`);
  };

  return (
    <>
      <PatientRegisterHeader
        title="Patient Registration"
        methods={methods}
        currentIndex={currentIndex}
        total={total}
        isdisable={isDisable}
        currentData={currentData}
      >
        <BodyCard>
          <Form methods={methods} onSubmit={onSubmit}>
            {/* General Information Section */}
            <Box paddingX={{ xs: 1, sm: 2, md: 3 }} paddingY={1}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  whiteSpace: 'wrap',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <CustomTitle title="GENERAL INFORMATION" />
              </Box>
              <Grid
                container
                spacing={1}
                justifyContent="space-between"
                alignItems={{ xs: 'end', md: 'center' }}
              >
                <Grid container item xs={12} sm={12} md={12}>
                  <Grid item xs={6} sm={3} md={3}>
                    <AutoCompleteFieldV2
                      label="Record ID"
                      name="recordId"
                      options={searchPatientRegistrations}
                      getOptionValue={(l) => l.id}
                      getOptionLabel={(l) => l.uhid}
                      isdisable
                      autoFocus={isFocus}
                      isparticularSearch={isParticularSearch}
                      getRedirectPath={(id) => paths.dashboard.patientRegistration.edit(id)}
                      BoxSx={{
                        display: {
                          xs: 'block',
                          md: 'grid',
                        },
                        alignItems: 'center',
                        gridTemplateColumns: {
                          xs: '1fr 2fr',
                          md: '110px 2fr',
                        },
                        columnGap: 1,
                      }}
                      onSearch={(value) => uhidOptionSearch.setQuery(value)}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <AutoCompleteFieldV2
                    label="UHID"
                    name="uhid"
                    options={searchPatientRegistrations}
                    getOptionValue={(l) => l.id}
                    getOptionLabel={(l) => l.uhid}
                    isdisable
                    autoFocus={isFocus}
                    isparticularSearch={isParticularSearch}
                    getRedirectPath={(id) => paths.dashboard.patientRegistration.edit(id)}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '110px 2fr',
                      },
                      columnGap: 1,
                    }}
                    onSearch={(value) => uhidOptionSearch.setQuery(value)}
                  />
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <RHFFormField
                    label="First Name"
                    name="firstName"
                    isdisable={isDisable}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: { xs: '1fr 2fr', md: '70px 2fr' },
                      columnGap: 1,
                    }}
                    onChangeTransform={(val) => {
                      let cleaned = val.replace(/[^A-Za-z0-9\s-]/g, '');
                      cleaned = cleaned.replace(/^[0-9-]+/, '');
                      cleaned = cleaned.replace(/\s+/g, ' ');
                      return cleaned.toUpperCase().trim();
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <RHFFormField
                    label="Middle Name"
                    name="middleName"
                    isdisable={isDisable}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: { xs: '1fr 2fr', md: 'auto 2fr' },
                      columnGap: 1,
                    }}
                    onChangeTransform={(val) => {
                      const uppercaseLetters = val.replace(/[^A-Z-]/gi, '').toUpperCase();
                      return uppercaseLetters;
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <RHFFormField
                    label="Last Name"
                    name="lastName"
                    isdisable={isDisable}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: { xs: '1fr 2fr', md: 'auto 2fr' },
                      columnGap: 1,
                    }}
                    onChangeTransform={(val) => {
                      const uppercaseLetters = val.replace(/[^A-Z-]/gi, '').toUpperCase();
                      return uppercaseLetters;
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  container
                  spacing={1}
                  justifyContent="space-between"
                  alignItems={{ xs: 'end', md: 'center' }}
                >
                  <Grid item xs={6} sm={6} md={6}>
                    <RHFFormField
                      label="Category"
                      name="category"
                      isdisable={isDisable}
                      options={Object.values(CategorType).map((option) => ({
                        label: option,
                        value: option,
                      }))}
                      BoxSx={{
                        display: {
                          xs: 'block',
                          md: 'grid',
                        },
                        alignItems: 'center',
                        gridTemplateColumns: {
                          xs: '1fr 2fr',
                          md: '110px 2fr',
                        },
                        columnGap: 1,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6}>
                    <RHFFormField
                      label="Birth Date"
                      name="birthDate"
                      isdisable={isDisable}
                      type="date"
                      max={new Date().toISOString().split('T')[0]}
                      BoxSx={{
                        display: {
                          xs: 'block',
                          md: 'grid',
                        },
                        alignItems: 'center',
                        gridTemplateColumns: { xs: '1fr 2fr', md: '70px 2fr' },
                        columnGap: 1,
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  container
                  spacing={1}
                  // display="none"
                  justifyContent="space-between"
                  alignItems={{ xs: 'end', md: 'center' }}
                >
                  <Grid item xs={6} sm={3} md={3}>
                    <RHFFormField
                      label="Age"
                      name="age"
                      type="number"
                      isdisable={isDisable}
                      BoxSx={{
                        display: {
                          xs: 'block',
                          md: 'grid',
                        },
                        alignItems: 'center',
                        gridTemplateColumns: { xs: '1fr 2fr', md: 'auto 2fr' },
                        columnGap: 1,
                      }}
                      onChangeTransform={(val) => {
                        const digits = val.replace(/\D/g, '').slice(0, 3);
                        return digits;
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={2} md={3}>
                    <YearMonthDayField
                      name="ageUnit"
                      label="-"
                      isdisable={isDisable}
                      BoxSx={{
                        display: {
                          xs: 'block',
                          md: 'grid',
                        },
                        alignItems: 'center',
                        gridTemplateColumns: { xs: '1fr 2fr', md: 'auto 2fr' },
                        columnGap: 1,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3} md={3}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography fontSize="13px">Y: {dateDiff.years}</Typography>
                      <Typography fontSize="13px">M: {dateDiff.months}</Typography>
                      <Typography fontSize="13px">D: {dateDiff.days}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={3} md={3}>
                    <GenderField
                      label="Sex"
                      name="sex"
                      isdisable={isDisable}
                      BoxSx={{
                        display: {
                          xs: 'block',
                          md: 'grid',
                        },
                        alignItems: 'center',
                        gridTemplateColumns: { xs: '1fr 2fr', md: 'auto 2fr' },
                        columnGap: 1,
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={6} sm={4} md={6}>
                  <RHFFormField
                    label="Hospital Dr.Name"
                    name="hospitalDoctor"
                    isdisable={isDisable}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: { xs: '1fr 2fr', md: '110px 2fr' },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={6}>
                  <RHFFormField
                    label="Reference Dr.Name"
                    name="referenceDoctor"
                    isdisable={isDisable}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: { xs: '1fr 2fr', md: 'auto 2fr' },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={3} md={4}>
                  <MaritalStatusSelectionField
                    name="maritalStatus"
                    label="Marital Status"
                    isdisable={isDisable}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '110px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={3} md={4}>
                  <Tooltip
                    title={
                      watchMaritalStatus === MaritalStatus.MARRIED
                        ? ''
                        : 'Wedding Date is applicable only for Married status'
                    }
                  >
                    <span style={{ width: '100%' }}>
                      <RHFFormField
                        label="Wedding Date"
                        name="weddingDate"
                        isdisable={watchMaritalStatus !== MaritalStatus.MARRIED || isDisable}
                        type="date"
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
                    </span>
                  </Tooltip>
                </Grid>
                <Grid item xs={6} sm={3} md={2}>
                  <Stack direction="row" alignItems={{ xs: 'end', md: 'center' }} spacing={1}>
                    <RHFFormField
                      isdisable={isDisable}
                      label="Height"
                      name="height"
                      type="number"
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
                    <Typography fontSize="small">CM</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} md={2}>
                  <RHFFormField
                    isdisable={isDisable}
                    label="Weight"
                    name="weight"
                    type="number"
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
                <Grid item xs={6} sm={4} md={4}>
                  <LanguagesSelectionField
                    name="language"
                    label="Language"
                    isdisable={isDisable}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '110px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <ReligionSelectionField
                    name="religion"
                    label="Religion"
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
                <Grid item xs={12} sm={4} md={2}>
                  <BloodGroupSelectionField
                    isdisable={isDisable}
                    name="bloodGroup"
                    label="Blood Group"
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
                <Grid item xs={6} sm={0} md={4} />
              </Grid>
            </Box>
            <Divider />
            <Box paddingX={{ xs: 1, sm: 2, md: 3 }} paddingY={1}>
              <Grid container spacing={1} justifyContent="space-between">
                <Grid item xs={12} sm={4} md={4} container spacing={1}>
                  <Grid item xs={12} sm={12} md={12}>
                    <CustomTitle
                      title="CONTACT DETAILS"
                      sx={{
                        mb: 0,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <Field.Phone
                      label="Mobile"
                      name="mobile"
                      country="IN"
                      BoxSx={{
                        display: {
                          xs: 'block',
                          md: 'grid',
                        },
                        alignItems: 'center',
                        gridTemplateColumns: {
                          xs: '1fr 2fr',
                          md: '110px 2fr',
                        },
                        columnGap: 1,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <Field.Phone
                      label="Mobile 2"
                      name="mobile2"
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
                          md: '110px 2fr',
                        },
                        columnGap: 1,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <RHFFormField
                      label="Office"
                      name="office"
                      isdisable={isDisable}
                      BoxSx={{
                        display: {
                          xs: 'block',
                          md: 'grid',
                        },
                        alignItems: 'center',
                        gridTemplateColumns: {
                          xs: '1fr 2fr',
                          md: '110px 2fr',
                        },
                        columnGap: 1,
                      }}
                      onChangeTransform={(val) => {
                        const digitsOnly = val.replace(/\D/g, '').slice(0, 10);
                        return digitsOnly;
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
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
                          md: '110px 2fr',
                        },
                        columnGap: 1,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <RHFFormField
                      label="Other"
                      name="other"
                      isdisable={isDisable}
                      BoxSx={{
                        display: {
                          xs: 'block',
                          md: 'grid',
                        },
                        alignItems: 'center',
                        gridTemplateColumns: {
                          xs: '1fr 2fr',
                          md: '110px 2fr',
                        },
                        columnGap: 1,
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={4} md={4} container spacing={1}>
                  <Grid item xs={12} sm={12} md={12}>
                    <CustomTitle
                      title="ADDRESS"
                      sx={{
                        mb: 0,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <RHFFormField
                      isdisable={isDisable}
                      label="Address"
                      name="address"
                      BoxSx={{
                        display: {
                          xs: 'block',
                          md: 'grid',
                        },
                        alignItems: 'center',
                        gridTemplateColumns: {
                          xs: '1fr 2fr',
                          md: '70px 2fr',
                        },
                        columnGap: 1,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} container spacing={1}>
                    <Grid item xs={6} sm={6} md={6}>
                      <RHFFormField
                        isdisable={isDisable}
                        label="Area"
                        name="area"
                        BoxSx={{
                          display: {
                            xs: 'block',
                            md: 'grid',
                          },
                          alignItems: 'center',
                          gridTemplateColumns: {
                            xs: '1fr 2fr',
                            md: '70px 2fr',
                          },
                          columnGap: 1,
                        }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6} md={6}>
                      <RHFFormField
                        isdisable={isDisable}
                        label="City"
                        name="city"
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
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} container spacing={1}>
                    <Grid item xs={6} sm={6} md={6}>
                      <RHFFormField
                        isdisable={isDisable}
                        label="State"
                        name="state"
                        BoxSx={{
                          display: {
                            xs: 'block',
                            md: 'grid',
                          },
                          alignItems: 'center',
                          gridTemplateColumns: {
                            xs: '1fr 2fr',
                            md: '70px 2fr',
                          },
                          columnGap: 1,
                        }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6} md={6}>
                      <RHFFormField
                        isdisable={isDisable}
                        label="Pin"
                        name="pin"
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
                        onChangeTransform={(val) => {
                          const digits = val.replace(/\D/g, '').slice(0, 6);
                          return digits;
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <RHFFormField
                      isdisable={isDisable}
                      label="Nationality"
                      name="nationality"
                      BoxSx={{
                        display: {
                          xs: 'block',
                          md: 'grid',
                        },
                        alignItems: 'center',
                        gridTemplateColumns: {
                          xs: '1fr 2fr',
                          md: '70px 2fr',
                        },
                        columnGap: 1,
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={4} md={4} container spacing={1}>
                  <Grid item xs={12} sm={12} md={12}>
                    <RHFUploadAvatar
                      name="profileImage"
                      maxSize={3145728}
                      disabled={isDisable}
                      onDrop={handleDrop}
                      helperText={
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 3,
                            mx: 'auto',
                            display: 'block',
                            textAlign: 'center',
                            color: 'text.disabled',
                          }}
                        >
                          Allowed *.jpeg, *.jpg, *.png, *.gif
                          {/* <br /> max size of {fData(3145728)} */}
                        </Typography>
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            <Box paddingX={{ xs: 1, sm: 2, md: 3 }} paddingY={1}>
              <CustomTitle title="OTHER INFORMATION" />
              <Grid container spacing={1} justifyContent="space-between">
                <Grid item xs={6} sm={3} md={3}>
                  <RHFFormField
                    label="Estimate"
                    name="estimate"
                    isdisable={isDisable}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '110px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <RHFFormField
                    label="Aadhar Card  No"
                    name="adharCard"
                    isdisable={isDisable}
                    onChangeTransform={(val) => {
                      const digits = val.replace(/\D/g, '').slice(0, 12);
                      return digits.replace(/(\d{4})(\d{0,4})(\d{0,4})/, (_, p1, p2, p3) =>
                        [p1, p2, p3].filter(Boolean).join('-')
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <RHFFormField
                    label="Pan Card No"
                    name="panCard"
                    isdisable={isDisable}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '80px 2fr',
                      },
                      columnGap: 1,
                    }}
                    onChangeTransform={(val) => {
                      const raw = val.toUpperCase().replace(/[^A-Z0-9]/g, '');
                      const part1 = raw.slice(0, 5).replace(/[^A-Z]/g, '');
                      const part2 = raw.slice(5, 9).replace(/[^0-9]/g, '');
                      const part3 = raw.slice(9, 10).replace(/[^A-Z]/g, '');
                      return `${part1}${part2}${part3}`;
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <RHFFormField
                    label="Type Of Visa"
                    isdisable={isDisable}
                    name="typeOfVisa"
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '125px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <RHFFormField
                    label="Membership Id"
                    name="membershipId"
                    isdisable={isDisable}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '110px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <RHFFormField isdisable={isDisable} label="Employee Id" name="employeesId" />
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <RHFFormField
                    isdisable={isDisable}
                    label="Occupation"
                    name="occupation"
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '80px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <RHFFormField
                    isdisable={isDisable}
                    label="Spouse Occupation"
                    name="spouseOccupation"
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '125px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <RHFFormField
                    label="Company name"
                    name="companyName"
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '110px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <RHFFormField
                    isdisable={isDisable}
                    label="Education"
                    name="education"
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '80px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <RHFFormField
                    isdisable={isDisable}
                    label="Yojana Card No"
                    name="yojanaCardNo"
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '125px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <RateChangeableField
                    label="Mediclaim"
                    name="mediclaim"
                    isdisable={isDisable}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '110px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <RHFFormField
                    isdisable={isDisable}
                    label="Remark"
                    name="remark"
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
                <Grid item xs={6} sm={3} md={3}>
                  <RHFFormField
                    isdisable={isDisable}
                    label="Referral To"
                    name="referralTo"
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '80px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <RHFFormField
                    isdisable={isDisable}
                    label="Transfer"
                    name="transfer"
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '125px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Form>
        </BodyCard>
      </PatientRegisterHeader>

      <PatientRegisterFormButton
        currentData={currentData}
        currentPath={paths.dashboard.patientRegistration.new}
        isdisable={isDisable}
        isSubmitting={isSubmitting}
        onParticularSearch={onParticularSearch}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        handleDisable={handleDisable}
        onSubmit={onSubmit}
        onExit={handleExitHistory}
        handleCameraCapture={handleCameraCapture}
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
