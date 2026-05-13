import { Helmet } from 'react-helmet-async';

import { ReportTemplateListView } from 'src/sections/report-template/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: list Report Template</title>
      </Helmet>

      <ReportTemplateListView />
    </>
  );
}
