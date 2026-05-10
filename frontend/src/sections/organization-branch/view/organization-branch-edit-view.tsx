import type { IOrganizationBranchItem } from 'src/types/organization-branch';
import type { ICurrentPaginatedResponse } from 'src/types/pagination-fillter';

import OrganizationBranchNewEditForm from '../organization-branch-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  currentOrganizationBranch?: IOrganizationBranchItem | undefined;
  currentOrganizationBranchMeta?: ICurrentPaginatedResponse | undefined;
  currentOrganizationBranchLoading?: boolean | undefined;
};

export default function OrganizationBranchEditView({
  currentOrganizationBranch,
  currentOrganizationBranchMeta,
  currentOrganizationBranchLoading,
}: Props) {
  return (
    <OrganizationBranchNewEditForm
      currentOrganizationBranch={currentOrganizationBranch}
      currentOrganizationBranchMeta={currentOrganizationBranchMeta}
      currentOrganizationBranchLoading={currentOrganizationBranchLoading}
    />
  );
}
