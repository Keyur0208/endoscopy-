import type { IPatientRegistrationItem } from 'src/types/patient-registration';

import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useGetPatientRegistration } from 'src/actions/patient-registration';

import { CameraCaptureEditView } from 'src/sections/camera-capture/view';
import { useGetCameraCaptureById } from 'src/actions/camera-capture';
import { IRecordingSession } from 'src/types/recording';

// Metadata
const metadata = { title: `Camera Capture Edits | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id } = useParams();

  const [data, setData] = useState<IRecordingSession | undefined>(undefined);

  const { recordingSession, recordingSessionMeta, recordingSessionLoading } = useGetCameraCaptureById(
    Number(id)
  );

  useEffect(() => {
    if (recordingSession) {
      setData(recordingSession);
    }
  }, [recordingSession]);

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <CameraCaptureEditView
        currentData={data}
        currentMeta={recordingSessionMeta}
        currentisLoading={recordingSessionLoading}
      />
    </>
  );
}
