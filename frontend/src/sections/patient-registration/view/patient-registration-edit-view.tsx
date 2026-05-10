import type { ICurrentPaginatedResponse } from 'src/types/pagination-fillter';
import type { IPatientRegistrationItem } from 'src/types/patient-registration';

import PatientRegistrationNewEditForm from '../patient-registration-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  currentData: IPatientRegistrationItem | undefined;
  currentMeta: ICurrentPaginatedResponse | undefined;
  currentisLoading: boolean;
};

export default function PatientRegistrationEditView({
  currentData,
  currentMeta,
  currentisLoading,
}: Props) {
  return (
    // <DashboardContent>
    <PatientRegistrationNewEditForm
      currentData={currentData}
      currentMeta={currentMeta}
      currentisLoading={currentisLoading}
    />
    // </DashboardContent>
  );
}
