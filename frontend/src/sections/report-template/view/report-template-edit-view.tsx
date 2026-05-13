import type { IReportTemplateRecord } from 'src/types/report-template';
import type { ICurrentPaginatedResponse } from 'src/types/pagination-fillter';

import ReportTemplateNewEditForm from '../report-template-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  currentReportTemplate?: IReportTemplateRecord | undefined;
  currentReportTemplateMeta?: ICurrentPaginatedResponse | undefined;
  currentReportTemplateLoading?: boolean;
};

export default function ReportTemplateEditView({
  currentReportTemplate,
  currentReportTemplateMeta,
  currentReportTemplateLoading,
}: Props) {
  return (
    <ReportTemplateNewEditForm
      currentReportTemplate={currentReportTemplate}
      currentReportTemplateMeta={currentReportTemplateMeta}
      currentReportTemplateLoading={currentReportTemplateLoading}
    />
  );
}
