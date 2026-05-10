import type { IOrganizationBranchItem } from 'src/types/organization-branch';

import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useGetOrganizationBranch } from 'src/actions/organization-branch';

import { OrganizationBranchEditView } from 'src/sections/organization-branch/view';

// Metadata
const metadata = { title: `Edit Organization | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id } = useParams();

  const [data, setData] = useState<IOrganizationBranchItem | undefined>(undefined);

  const { organizationBranch, organizationBranchMeta, isLoading } = useGetOrganizationBranch(
    Number(id)
  );

  useEffect(() => {
    if (organizationBranch) {
      setData(organizationBranch);
    }
  }, [organizationBranch]);

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <OrganizationBranchEditView
        currentOrganizationBranch={data}
        currentOrganizationBranchMeta={organizationBranchMeta}
        currentOrganizationBranchLoading={isLoading}
      />
    </>
  );
}
