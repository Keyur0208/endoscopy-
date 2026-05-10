import type { ICurrentPaginatedResponse } from 'src/types/pagination-fillter';
import type {
  IPatientRegistrationItem,
  ICreatePatientRegistration,
  IUpdatePatientRegistration,
} from 'src/types/patient-registration';

import { mutate } from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AgeUnit, CategorType } from 'endoscopy-shared';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import {
  Chip,
  Paper,
  Button,
  ImageList,
  Typography,
  ImageListItem,
} from '@mui/material';

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
import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import RHFFormField from 'src/components/form-feild';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTimezone } from 'src/components/time-zone/useTimezoneDate';
import { GenderField } from 'src/components/selection/gender-selection';
import { CalculateAge, toAgeBreakdown, GetDateDifference } from 'src/components/caculation_age';

import { EndoscopyReportHeader } from './endoscopy-report-header';
import EndoscopyReportFormButton from './endoscopy-report-footer';

type Props = {
  currentData?: IPatientRegistrationItem;
  currentMeta?: ICurrentPaginatedResponse;
  currentisLoading?: boolean;
};

export default function EndoscopyReportNewEditForm({
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

  // ── Camera Capture State & Refs ──────────────────────────────────────
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const animFrameRef = useRef<number>(0);
  const overlayRef = useRef<{
    firstName: string;
    lastName: string;
    birthdate: string;
    age: number | undefined;
    sex: string;
  }>({
    firstName: '',
    lastName: '',
    birthdate: '',
    age: undefined,
    sex: '',
  });

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [capturedImages, setCapturedImages] = useState<{ url: string; name: string }[]>([]);

  console.log(capturedImages, 'capturedImages');

  const handleStartCapture = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error('Camera access denied:', err);
    }
  }, []);

  const handleStopCapture = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    streamRef.current = null;
    setIsCameraActive(false);
    setIsRecording(false);
  }, []);

  const handleCaptureImage = useCallback(() => {
    if (!videoRef.current || !isCameraActive) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    // Burn patient info overlay into the image
    const { firstName, lastName, birthdate: dob, age, sex } = overlayRef.current;
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || '--';
    ctx.font = 'bold 14px monospace';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 4;
    ctx.fillStyle = '#00ff00';
    ctx.fillText(`Name: ${fullName}`, 10, 22);
    ctx.fillText(`D.O.B.: ${dob || '--'}`, 10, 40);
    ctx.fillText(`Age/Sex: ${age ? `${age}/${sex || '-'}` : '--'}`, 10, 58);
    const url = canvas.toDataURL('image/png');
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    setCapturedImages((prev) => [...prev, { url, name: `IMG_${ts}.png` }]);
  }, [isCameraActive]);

  const handleVideoStart = useCallback(() => {
    if (!streamRef.current || !videoRef.current || !isCameraActive || isRecording) return;
    const video = videoRef.current;
    // Composite canvas: draws video + overlay text on every frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawFrame = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const { firstName, lastName, birthdate: dob, age, sex } = overlayRef.current;
      const fullName = [firstName, lastName].filter(Boolean).join(' ') || '--';
      ctx.font = 'bold 14px monospace';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillStyle = '#00ff00';
      ctx.fillText(`Name: ${fullName}`, 10, 22);
      ctx.fillText(`D.O.B.: ${dob || '--'}`, 10, 40);
      ctx.fillText(`Age/Sex: ${age ? `${age}/${sex || '-'}` : '--'}`, 10, 58);
      animFrameRef.current = requestAnimationFrame(drawFrame);
    };
    drawFrame();

    const chunks: BlobPart[] = [];
    const recorder = new MediaRecorder(canvas.captureStream(30));
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      cancelAnimationFrame(animFrameRef.current);
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VID_${new Date().toISOString().replace(/[:.]/g, '-')}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  }, [isCameraActive, isRecording]);

  const handleVideoStop = useCallback(() => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    setIsRecording(false);
  }, []);

  useEffect(
    () => () => {
      cancelAnimationFrame(animFrameRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    },
    []
  );

  // watched values for overlay
  const watchFirstName = watch('firstName');
  const watchLastName = watch('lastName');
  const watchSex = watch('sex');

  // Keep overlay ref in sync so rAF loop and image capture always read current values
  useEffect(() => {
    overlayRef.current = { firstName: watchFirstName, lastName: watchLastName, age: watchAge };
  }, [watchFirstName, watchLastName, watchAge, watchSex]);

  return (
    <>
      <EndoscopyReportHeader
        title="Endoscopy Report"
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
                    readonly
                    label="Remarks"
                    name="remarks"
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
            {/* ── Camera Capture Panel ─────────────────────────────────── */}
            <Box
              px={3}
              pt={1}
              // sx={{
              //   height: 420,
              // }}
              mb={2}
            >
              <Box
                display="grid"
                gridTemplateColumns={{
                  xs: '1fr',
                  md: 'repeat(12, 1fr)',
                }}
                columnGap={{ md: 1 }}
                rowGap={{ xs: 1 }}
              >
                <Box
                  gridColumn={{
                    xs: 'span 12',
                    md: 'span 7',
                  }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      flex: '1 1 60%',
                      height: 420,
                      background: '#111',
                      borderRadius: 1,
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: isCameraActive ? 'block' : 'none',
                      }}
                    />
                    {!isCameraActive && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          color: '#555',
                          gap: 1,
                        }}
                      >
                        <Box component="span">
                          <Iconify icon="mdi:camera-off" width={60} color="#555" />
                        </Box>
                        <Typography variant="body2" color="#666">
                          Camera not started
                        </Typography>
                      </Box>
                    )}

                    {/* Top-left patient info overlay */}
                    {isCameraActive && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 10,
                          color: '#00ff00',
                          fontFamily: 'monospace',
                          fontSize: 12,
                          lineHeight: 1.6,
                          textShadow: '0 0 4px #000',
                          pointerEvents: 'none',
                        }}
                      >
                        <div>
                          Name: {[watchFirstName, watchLastName].filter(Boolean).join(' ') || '--'}
                        </div>
                        <div>D.O.B.: {birthdate || '--'}</div>
                        <div>Age/Sex: {watchAge ? `${watchAge}/${watchSex || '-'}` : '--'}</div>
                        <div>{`${videoRef.current?.videoWidth || 1920}x${videoRef.current?.videoHeight || 1080}`}</div>
                      </Box>
                    )}

                    {/* Recording badge */}
                    {isRecording && (
                      <Chip
                        label="● REC"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'red',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: 11,
                          animation: 'pulse 1s infinite',
                          '@keyframes pulse': {
                            '0%,100%': { opacity: 1 },
                            '50%': { opacity: 0.4 },
                          },
                        }}
                      />
                    )}
                  </Paper>
                </Box>
                <Box
                  gridColumn={{
                    xs: 'span 12',
                    md: 'span 1',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1.2,
                    }}
                  >
                    {/* Start / Stop Capture */}
                    <Button
                      variant="contained"
                      fullWidth
                      color={isCameraActive ? 'error' : 'primary'}
                      onClick={isCameraActive ? handleStopCapture : handleStartCapture}
                      sx={{ fontWeight: 600, fontSize: 13 }}
                    >
                      {isCameraActive ? 'Stop Capture' : 'Start Capture'}
                    </Button>
                    {/* Capture Image */}
                    <Button
                      variant="contained"
                      fullWidth
                      color="success"
                      disabled={!isCameraActive}
                      onClick={handleCaptureImage}
                      sx={{ fontWeight: 600, fontSize: 13 }}
                    >
                      Capture Image
                    </Button>
                    {/* Video Start / Stop */}
                    <Button
                      variant="contained"
                      fullWidth
                      color={isRecording ? 'error' : 'warning'}
                      disabled={!isCameraActive}
                      onClick={isRecording ? handleVideoStop : handleVideoStart}
                      sx={{ fontWeight: 600, fontSize: 13 }}
                    >
                      {isRecording ? 'Video Stop' : 'Video Start'}
                    </Button>
                  </Box>
                </Box>
                <Box
                  gridColumn={{
                    xs: 'span 12',
                    md: 'span 4',
                  }}
                >
                  {capturedImages.length > 0 && (
                    <Box sx={{ border: '1px solid #ccc', px: 1, py: 1, borderRadius: 1 }}>
                      <Typography variant="caption" fontWeight={600} display="block" mb={0.5}>
                        Captured ({capturedImages.length})
                      </Typography>
                      <ImageList cols={3} gap={4} sx={{ overflowY: 'auto', maxHeight: 370, m: 0 }}>
                        {capturedImages.map((img, idx) => (
                          <ImageListItem
                            key={idx}
                            sx={{
                              border: '1px solid #ccc',
                              borderRadius: 0.5,
                              overflow: 'hidden',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              const a = document.createElement('a');
                              a.href = img.url;
                              a.download = img.name;
                              a.click();
                            }}
                          >
                            <img
                              src={img.url}
                              alt={img.name}
                              loading="lazy"
                              style={{
                                width: '100%',
                                height: 70,
                                objectFit: 'cover',
                                display: 'block',
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                display: 'block',
                                fontSize: 9,
                                textAlign: 'center',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                px: 0.5,
                                lineHeight: '18px',
                                background: 'rgba(0,0,0,0.05)',
                              }}
                            >
                              {img.name}
                            </Typography>
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
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
        onExit={handleExitHistory}
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
