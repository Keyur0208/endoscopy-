import { Helmet } from 'react-helmet-async';

import { CameraCaptureListView } from 'src/sections/camera-capture/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Camera Capture List</title>
      </Helmet>

      <CameraCaptureListView />
    </>
  );
}
