import { Helmet } from 'react-helmet-async';

import { EndoscopyReportCreateView } from 'src/sections/endoscopy-report/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create Report</title>
      </Helmet>

      <EndoscopyReportCreateView />
    </>
  );
}
