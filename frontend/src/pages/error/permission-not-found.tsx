import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import PermissionNotFoundView from 'src/sections/error/permission-not-found-view';

// ----------------------------------------------------------------------

const metadata = { title: `Permission Not Found - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PermissionNotFoundView />
    </>
  );
}
