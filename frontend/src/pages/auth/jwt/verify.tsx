import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { JwtOtpVerificationView } from 'src/sections/auth/jwt/jwt-otp-verify-view';

// ----------------------------------------------------------------------

const metadata = { title: `Verify | Jwt - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <JwtOtpVerificationView />
    </>
  );
}
