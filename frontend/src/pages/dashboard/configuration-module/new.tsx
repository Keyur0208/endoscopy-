import { Helmet } from 'react-helmet-async';

import { ConfigurationModuleCreateView } from 'src/sections/configuration-module/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Configuration Module</title>
      </Helmet>

      <ConfigurationModuleCreateView />
    </>
  );
}
