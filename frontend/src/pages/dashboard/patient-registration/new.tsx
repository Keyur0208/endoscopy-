import { Helmet } from 'react-helmet-async';

import { PatientRegistrationCreateView } from 'src/sections/patient-registration/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create Patient Registration</title>
      </Helmet>

      <PatientRegistrationCreateView />
    </>
  );
}
