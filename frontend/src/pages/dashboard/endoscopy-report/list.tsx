import { Helmet } from 'react-helmet-async';

import { EndoscopyReportListView } from 'src/sections/endoscopy-report/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Report List</title>
      </Helmet>

      <EndoscopyReportListView />
    </>
  );
}
