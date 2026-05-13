import type { IReportTemplateRecord } from 'src/types/report-template';

import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useGetReportTemplate } from 'src/actions/report-template';

import ReportTemplateEditView from 'src/sections/report-template/view/report-template-edit-view';

// Metadata
const metadata = { title: `Report Template Details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id } = useParams();

  const [data, setData] = useState<IReportTemplateRecord | undefined>(undefined);

  const { reportTemplate, reportTemplateMeta, isLoading } = useGetReportTemplate(Number(id));

  useEffect(() => {
    if (reportTemplate) {
      setData(reportTemplate);
    }
  }, [reportTemplate]);

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <ReportTemplateEditView
        currentReportTemplate={data}
        currentReportTemplateMeta={reportTemplateMeta}
        currentReportTemplateLoading={isLoading}
      />
    </>
  );
}
