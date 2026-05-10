import { Helmet } from 'react-helmet-async';

import { UserCreateView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new User</title>
      </Helmet>

      <UserCreateView />
    </>
  );
}
