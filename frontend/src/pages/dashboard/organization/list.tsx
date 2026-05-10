import { Helmet } from 'react-helmet-async';

import { OrganizationListView } from 'src/sections/organization/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: List Organization</title>
      </Helmet>

      <OrganizationListView />
    </>
  );
}
