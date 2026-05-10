import type { IUserItem } from 'src/types/user';

import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useGetUser } from 'src/actions/user';

import { UserEditView } from 'src/sections/user/view';

// Metadata
const metadata = { title: `Edit User | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id } = useParams();
  const { user, usersMeta } = useGetUser(Number(id));

  const [data, setData] = useState<IUserItem | undefined>();

  useEffect(() => {
    if (user) {
      setData(user);
    }
  }, [user]);

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <UserEditView currentUser={data} currentMeta={usersMeta} />
    </>
  );
}
