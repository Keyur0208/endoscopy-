import { Helmet } from 'react-helmet-async';

import { ReportTypeCreateView } from 'src/sections/report-type/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create Report Type Master</title>
      </Helmet>

      <ReportTypeCreateView />
    </>
  );
}
