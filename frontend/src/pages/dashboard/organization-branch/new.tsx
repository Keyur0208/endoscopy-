import { Helmet } from 'react-helmet-async';

import { OrganizationBranchEditView } from 'src/sections/organization-branch/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new Organization</title>
      </Helmet>

      <OrganizationBranchEditView />
    </>
  );
}
