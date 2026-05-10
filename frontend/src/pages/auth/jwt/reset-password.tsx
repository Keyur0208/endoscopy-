import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { JwtPasswordResetView } from 'src/sections/auth/jwt/jwt-password-reset-view';
// ----------------------------------------------------------------------

const metadata = { title: `Reset password | Jwt - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <JwtPasswordResetView />
    </>
  );
}
