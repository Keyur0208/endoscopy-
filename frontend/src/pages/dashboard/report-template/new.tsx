import { Helmet } from 'react-helmet-async';

import { ReportTemplateCreateView } from 'src/sections/report-template/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create Parameter Master</title>
      </Helmet>

      <ReportTemplateCreateView />
    </>
  );
}
