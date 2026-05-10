import type { ICurrentPaginatedResponse } from 'src/types/pagination-fillter';

import { mutate } from 'swr';
import { useForm } from 'react-hook-form';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Chip, Paper, Button, ImageList, Typography, ImageListItem } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { usePagination } from 'src/hooks/use-pagination';
import { useStatusDialog } from 'src/hooks/use-status-dialog';

import BodyCard from 'src/components/body-card';
import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import RHFFormField from 'src/components/form-feild';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTimezone } from 'src/components/time-zone/useTimezoneDate';
import { GenderField } from 'src/components/selection/gender-selection';

import {
  useGetCaptures,
  uploadCapturedImage,
  stopRecordingSession,
  startRecordingSession,
  uploadRecordingChunk,
  useGetRecordingSessions,
} from 'src/actions/camera-capture';

import { CameraCaptureHeader } from './camera-capture-header';
import CameraCaptureFormButton from './camera-capture-footer';
import { zodResolver } from '@hookform/resolvers/zod';
import { PatientRegistrationSchema } from 'src/validator/patient-registration-validator';
import { ICreateRecordingSession, IRecordingSession } from 'src/types/recording';
import { CameraCaptureSchema } from 'src/validator/camera-capture-validator';
import { useGetPatientRegistration } from 'src/actions/patient-registration';

// ── Recording helpers ────────────────────────────────────────────────────────
const CHUNK_MS = 5000;

function getSupportedMimeType() {
    const candidates = [
        'video/mp4;codecs=avc1',
        'video/mp4;codecs=h264',
        'video/mp4',
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
    ];

    return candidates.find((mimeType) => window.MediaRecorder?.isTypeSupported?.(mimeType)) || '';
}

type Props = {
  currentData?: IRecordingSession;
  currentMeta?: ICurrentPaginatedResponse;
  currentisLoading?: boolean;
};

export default function CameraCaptureNewEditForm({
  currentData,
  currentMeta,
  currentisLoading,
}: Props) {
  // timezone helpers
  const { formatPlainToInputDate, currentDate } = useTimezone();

  // React Router
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientIdFromQuery = Number(searchParams.get('patientId')) || null;
  const { dialog, isOpen, showDialog, hideDialog } = useStatusDialog();

  const { recordingSessions, recordingSessionsMeta } = useGetRecordingSessions({
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
    items: recordingSessions,
    meta: recordingSessionsMeta,
    currentisLoading: currentisLoading,
    currentItem: currentData,
    currentMeta: currentMeta,
    routeGenerator: (id) => paths.dashboard.cameraCapture.edit(id),
    fallbackRoute: paths.dashboard.cameraCapture.new,
    listRouter: paths.dashboard.cameraCapture.list,
    exitPermissionkey: 'true',
  });

  // Patient Registration Search Form Id
  const [patientId, setPatientId] = useState<number | null>(patientIdFromQuery);
  const checkPatientId = currentData?.patientId || patientIdFromQuery || null;

  const { patientRegistration } = useGetPatientRegistration(checkPatientId);

  const defaultValues = useMemo(
    () => ({
      patientId: currentData?.patientId || patientIdFromQuery || null,
      recordId: currentData?.id ? currentData.id.toString() : '',
      uhid: patientRegistration?.uhid || '-',
      patientName:
        `${patientRegistration?.firstName || ''} ${patientRegistration?.middleName || ''} ${patientRegistration?.lastName || ''}` ||
        '',
      age: patientRegistration?.age || '',
      sex: patientRegistration?.sex || '',
      entryDate: currentData?.entryDate
        ? formatPlainToInputDate(currentData.entryDate)
        : currentDate(),
      hospitalDoctor: `${patientRegistration?.hospitalDoctor || ''}`,
      refDrName: `${patientRegistration?.referenceDoctor} || ''}`,
      remarks: '',
      captureDate: currentData?.captureDate
        ? formatPlainToInputDate(currentData.captureDate)
        : currentDate(),
    }),
    [currentData, currentDate, formatPlainToInputDate, patientRegistration]
  );

  const methods = useForm<ICreateRecordingSession>({
    resolver: zodResolver(CameraCaptureSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    getValues,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, currentData]);

  const handleExitHistory = () => {
    router.back();
  };

  // ── Camera Capture State & Refs ──────────────────────────────────────
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const animFrameRef = useRef<number>(0);
  const sessionIdRef = useRef<string | null>(null);
  const chunkIndexRef = useRef<number>(0);
  const uploadQueueRef = useRef<Promise<void>>(Promise.resolve());

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [capturedImages, setCapturedImages] = useState<{ url: string; name: string }[]>([]);

  const { captures, refreshCaptures } = useGetCaptures(sessionId);

  const onSubmit = handleSubmit((data: any) => {
    console.log('Form submitted with data:', data);
  });

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

  const handleStopCapture = useCallback(async () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    streamRef.current = null;
    setIsCameraActive(false);
    setIsRecording(false);
  }, []);

  const handleCaptureImage = useCallback(async () => {
    try {
      if (!videoRef.current || !isCameraActive) return;
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const localUrl = canvas.toDataURL('image/png');
      const fileName = `IMG_${Date.now()}.png`;
      if (sessionIdRef.current) {
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              const res = await uploadCapturedImage({
                sessionId: sessionIdRef.current!,
                blob,
                name: fileName,
              });

              if (res) {
                setCapturedImages((prev) => [...prev, { url: res.url, name: res.name }]);
                refreshCaptures();
              }
            } catch (err) {
              console.error('Error uploading captured image:', err);
            }
          }
        }, 'image/png');
      } else {
        setCapturedImages((prev) => [...prev, { url: localUrl, name: fileName }]);
      }
    } catch (err) {
      console.error('Error stopping camera capture:', err);
      setRecordingError(err?.message || 'Camera access denied');
    }
  }, [isCameraActive, refreshCaptures]);

  const handleVideoStart = useCallback(async () => {
    const { captureDate, patientId, entryDate, remark } = getValues();
    try {
      const mimeType = getSupportedMimeType();
      const session = await startRecordingSession({
        patientId,
        captureDate,
        entryDate,
        remark,
        mimeType,
      });

      sessionIdRef.current = session.sessionCode;
      setSessionId(session.sessionCode);
      chunkIndexRef.current = 0;
      uploadQueueRef.current = Promise.resolve();

      const recorder = mimeType
        ? new MediaRecorder(streamRef.current!, { mimeType })
        : new MediaRecorder(streamRef.current!);

      recorder.ondataavailable = (e) => {

        if (!e.data || e.data.size === 0 || !sessionIdRef.current) return;

        const index = chunkIndexRef.current++;
        const sid = sessionIdRef.current;

        uploadQueueRef.current = uploadQueueRef.current.then(() =>
          uploadRecordingChunk({
            sessionId: sid,
            index,
            blob: e.data,
            mimeType: recorder.mimeType || mimeType || 'video/webm',
          })
        );
      };

      recorder.start(CHUNK_MS);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err: any) {
      cancelAnimationFrame(animFrameRef.current);
      setRecordingError(err?.message || 'Failed to start recording.');
    }
  }, [isCameraActive, isRecording, currentData]);

  const handleVideoStop = useCallback(async () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      const stopped = new Promise<void>((resolve) => {
        recorder.addEventListener('stop', () => resolve(), { once: true });
      });
      recorder.stop();
      await stopped;
    }
    // Flush all pending chunk uploads before signalling the server
    await uploadQueueRef.current;
    mediaRecorderRef.current = null;
    cancelAnimationFrame(animFrameRef.current);

    const sid = sessionIdRef.current;
    if (sid) {
      try {
        await stopRecordingSession(sid);
      } catch (err) {
        console.error('Failed to stop recording session:', err);
      }
      sessionIdRef.current = null;
      setSessionId(null);
    }
    setIsRecording(false);
  }, []);


  return (
    <>
      <CameraCaptureHeader
        title="Camera Capture"
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
                <Box gridColumn="span 3">
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
                <Box>
                  <RHFFormField
                    label="Entry Date"
                    name="entryDate"
                    type="date"
                    BoxSx={{ textAlign: 'start' }}
                    readonly
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
                    label="Ref Dr.Name"
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
            <Box px={3} pt={1} mb={2}>
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
                    {/* {isCameraActive && (
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
                        <div>{`${videoRef.current?.videoWidth || 1920}x${videoRef.current?.videoHeight || 1080}`}</div>
                      </Box>
                    )} */}

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
                    {recordingError && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ fontSize: 10, textAlign: 'center' }}
                      >
                        {recordingError}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box
                  gridColumn={{
                    xs: 'span 12',
                    md: 'span 4',
                  }}
                >
                  {/* Merge local captures (immediate) with server captures (uploaded) */}
                  {/* {(() => {
                    const serverUrls = new Set(captures.map((c) => c.name));
                    const localOnly = capturedImages.filter((img) => !serverUrls.has(img.name));
                    const allImages: { url: string; name: string }[] = [
                      ...captures.map((c) => ({ url: c.url, name: c.name })),
                      ...localOnly,
                    ];
                    if (allImages.length === 0) return null;
                    return (
                      <Box sx={{ border: '1px solid #ccc', px: 1, py: 1, borderRadius: 1 }}>
                        <Typography variant="caption" fontWeight={600} display="block" mb={0.5}>
                          Captured ({allImages.length})
                          {sessionId && (
                            <Typography
                              component="span"
                              variant="caption"
                              color="success.main"
                              sx={{ ml: 1 }}
                            >
                              ● Session active
                            </Typography>
                          )}
                        </Typography>
                        <ImageList
                          cols={3}
                          gap={4}
                          sx={{ overflowY: 'auto', maxHeight: 370, m: 0 }}
                        >
                          {allImages.map((img, idx) => (
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
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
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
                    );
                  })()} */}
                </Box>
              </Box>
            </Box>
          </Form>
        </BodyCard>
      </CameraCaptureHeader>

      <CameraCaptureFormButton
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
