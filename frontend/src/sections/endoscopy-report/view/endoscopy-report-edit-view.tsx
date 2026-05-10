import type { ICurrentPaginatedResponse } from 'src/types/pagination-fillter';

import EndoscopyReportNewEditForm from '../endoscopy-report-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  currentData: any | undefined;
  currentMeta: ICurrentPaginatedResponse | undefined;
  currentisLoading: boolean;
};

export default function EndoscopyReportEditView({
  currentData,
  currentMeta,
  currentisLoading,
}: Props) {
  return (
    <EndoscopyReportNewEditForm
      currentData={currentData}
      currentMeta={currentMeta}
      currentisLoading={currentisLoading}
    />
  );
}
