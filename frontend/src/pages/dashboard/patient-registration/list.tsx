import { Helmet } from 'react-helmet-async';

import { PatientRegistrationListView } from 'src/sections/patient-registration/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: list Patient Registration</title>
      </Helmet>

      <PatientRegistrationListView />
    </>
  );
}
