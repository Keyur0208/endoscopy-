import { Helmet } from 'react-helmet-async';

import { OrganizationEditView } from 'src/sections/organization/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new Organization</title>
      </Helmet>

      <OrganizationEditView />
    </>
  );
}
