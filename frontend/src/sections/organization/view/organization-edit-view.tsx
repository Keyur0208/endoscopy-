import type { IOrganizationItem } from 'src/types/organization';
import type { ICurrentPaginatedResponse } from 'src/types/pagination-fillter';

import OrganizationNewEditForm from '../organization-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  currentOrganization?: IOrganizationItem | undefined;
  currentOrganizationMeta?: ICurrentPaginatedResponse | undefined;
  currentOrganizationLoading?: boolean;
};

export default function OrganizationEditView({
  currentOrganization,
  currentOrganizationMeta,
  currentOrganizationLoading,
}: Props) {
  return (
    <OrganizationNewEditForm
      currentOrganization={currentOrganization}
      currentOrganizationMeta={currentOrganizationMeta}
      currentOrganizationLoading={currentOrganizationLoading}
    />
  );
}
