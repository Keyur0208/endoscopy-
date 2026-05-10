import type { IUserItem } from 'src/types/user';

// import { PermissionKeys } from 'endoscopy-shared';

import { MenuList } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

type Props = {
  index: number;
  selected: boolean;
  onEditRow: VoidFunction;
  row: IUserItem;
  selectedColumns: any;
};

export default function UserTableRow({ index, row, selected, onEditRow, selectedColumns }: Props) {
  const { fullName, email, mobile, branch } = row;
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        {selectedColumns.includes('srNo') && <TableCell>{index}</TableCell>}
        {selectedColumns.includes('branch') && <TableCell>{branch?.legalName || '-'}</TableCell>}
        {selectedColumns.includes('oranization') && (
          <TableCell>{branch?.organization?.legalName}</TableCell>
        )}
        {selectedColumns.includes('fullName') && <TableCell>{fullName || '-'}</TableCell>}

        {selectedColumns.includes('userRole') && (
          <TableCell>
            {row?.userRoles?.length ? row.userRoles.map((role) => role.roleName).join(', ') : '-'}
          </TableCell>
        )}
        {selectedColumns.includes('email') && <TableCell>{email || '-'}</TableCell>}
        {selectedColumns.includes('mobile') && <TableCell>{mobile || '-'}</TableCell>}
        {selectedColumns.includes('isActive') && (
          <TableCell>
            <Label variant="soft" color={row.isActive ? 'success' : 'error'}>
              {row.isActive ? 'Active' : 'InActive'}
            </Label>
          </TableCell>
        )}
        {selectedColumns.includes('Modification') && (
          <TableCell align="right">
            <IconButton onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" width={15} />
            </IconButton>
          </TableCell>
        )}
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          {/* <PermissionGuard
            fieldName="View"
            permissionKeys={{
              both: [PermissionKeys.USER_VIEW],
            }}
            isDisabledMode="both"
          > */}
          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>
          {/* </PermissionGuard> */}

          {/* <PermissionGuard
            fieldName="View"
            permissionKeys={{
              both: [PermissionKeys.USER_EDIT],
            }}
            isDisabledMode="both"
          > */}
          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
          {/* </PermissionGuard> */}
        </MenuList>
      </CustomPopover>
    </>
  );
}
