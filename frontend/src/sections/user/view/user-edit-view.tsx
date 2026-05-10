import type { IUserItem } from 'src/types/user';
import type { ICurrentPaginatedResponse } from 'src/types/pagination-fillter';

import UserNewEditForm from '../user-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem | undefined;
  currentMeta?: ICurrentPaginatedResponse | undefined;
};

export default function UserEditView({ currentUser, currentMeta }: Props) {
  return <UserNewEditForm currentUser={currentUser} currentMeta={currentMeta} />;
}
