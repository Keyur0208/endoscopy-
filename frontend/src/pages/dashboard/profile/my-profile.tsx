import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { MyProfileDetailsView } from 'src/sections/profile/view';

// ----------------------------------------------------------------------
// Metadata
const metadata = { title: `Account Setting | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <MyProfileDetailsView />
    </>
  );
}
