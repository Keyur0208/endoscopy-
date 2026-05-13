import type { IRecordingSession } from 'src/types/recording';
import type { ICurrentPaginatedResponse } from 'src/types/pagination-fillter';

import CameraCaptureNewEditForm from '../camera-capture-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  currentData: IRecordingSession | undefined;
  currentMeta: ICurrentPaginatedResponse | undefined;
  currentisLoading: boolean;
};

export default function CameraCaptureEditView({
  currentData,
  currentMeta,
  currentisLoading,
}: Props) {
  return (
    <CameraCaptureNewEditForm
      currentData={currentData}
      currentMeta={currentMeta}
      currentisLoading={currentisLoading}
    />
  );
}
