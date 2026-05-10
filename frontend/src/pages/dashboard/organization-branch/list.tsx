import { Helmet } from 'react-helmet-async';

import { OrganizationBranchListView } from 'src/sections/organization-branch/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: List Organization</title>
      </Helmet>

      <OrganizationBranchListView />
    </>
  );
}
