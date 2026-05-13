import { Helmet } from 'react-helmet-async';

import { ParameterMasterCreateView } from 'src/sections/parameter-master/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create Parameter Master</title>
      </Helmet>

      <ParameterMasterCreateView />
    </>
  );
}
