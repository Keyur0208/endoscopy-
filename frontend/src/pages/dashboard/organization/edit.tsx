import type { IOrganizationItem } from 'src/types/organization';

import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useGetOrganization } from 'src/actions/organization';

import { OrganizationEditView } from 'src/sections/organization/view';

// Metadata
const metadata = { title: `Edit Organization | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id } = useParams();

  const [data, setData] = useState<IOrganizationItem | undefined>(undefined);

  const { organization, organizationMeta, isLoading } = useGetOrganization(Number(id));

  useEffect(() => {
    if (organization) {
      setData(organization);
    }
  }, [organization]);

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <OrganizationEditView
        currentOrganization={data}
        currentOrganizationMeta={organizationMeta}
        currentOrganizationLoading={isLoading}
      />
    </>
  );
}
