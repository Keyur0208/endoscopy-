import type { IPatientRegistrationItem } from 'src/types/patient-registration';

import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useGetPatientRegistration } from 'src/actions/patient-registration';

import { EndoscopyReportEditView } from 'src/sections/endoscopy-report/view';

// Metadata
const metadata = { title: `Report Edits | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id } = useParams();

  const [data, setData] = useState<IPatientRegistrationItem | undefined>(undefined);

  const { patientRegistration, patientRegistrationMeta, isLoading } = useGetPatientRegistration(
    Number(id)
  );

  useEffect(() => {
    if (patientRegistration) {
      setData(patientRegistration);
    }
  }, [patientRegistration]);

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <EndoscopyReportEditView
        currentData={data}
        currentMeta={patientRegistrationMeta}
        currentisLoading={isLoading}
      />
    </>
  );
}
