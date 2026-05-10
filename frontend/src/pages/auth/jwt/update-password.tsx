import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { JwtPasswordRecoveryView } from 'src/sections/auth/jwt/jwt-password-recovery-view';

// ----------------------------------------------------------------------

const metadata = { title: `Update password | Jwt - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <JwtPasswordRecoveryView />
    </>
  );
}
