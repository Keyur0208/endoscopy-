import { Helmet } from 'react-helmet-async';

import { CameraCaptureCreateView } from 'src/sections/camera-capture/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create Camera Capture</title>
      </Helmet>

      <CameraCaptureCreateView />
    </>
  );
}
