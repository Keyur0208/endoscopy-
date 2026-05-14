import type { IPatientRegistrationItem } from 'src/types/patient-registration';

import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useGetPatientRegistration } from 'src/actions/patient-registration';

import { EndoscopyReportEditView } from 'src/sections/endoscopy-report/view';
import { useGetEndoscopyReport } from 'src/actions/endoscopy-report';
import { IEndoscopyReportRecord } from 'src/types/endoscopy-report';

// Metadata
const metadata = { title: `Report Edits | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id } = useParams();

  const [data, setData] = useState<IEndoscopyReportRecord | undefined>(undefined);

  const { endoscopyReport, endoscopyReportMeta, isLoading } = useGetEndoscopyReport(
    Number(id)
  );

  useEffect(() => {
    if (endoscopyReport) {
      setData(endoscopyReport);
    }
  }, [endoscopyReport]);

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <EndoscopyReportEditView
        currentData={data}
        currentMeta={endoscopyReportMeta}
        currentisLoading={isLoading}
      />
    </>
  );
}
