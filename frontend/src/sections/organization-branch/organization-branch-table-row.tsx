import type { IOrganizationBranchItem } from 'src/types/organization-branch';

import { MenuList } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { FormatDateString } from 'src/components/format-date-time';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

type Props = {
  selected: boolean;
  index: number;
  selectedColumns: any;
  onEditRow: VoidFunction;
  row: IOrganizationBranchItem;
};

export default function OrganizationBranchTableRow({
  row,
  selected,
  onEditRow,
  index,
  selectedColumns,
}: Props) {
  const popover = usePopover();
  return (
    <>
      <TableRow hover selected={selected}>
        {selectedColumns.includes('srNo') && <TableCell>{index}</TableCell>}
        {selectedColumns.includes('organizationId') && (
          <TableCell>{row.organization?.name || ''}</TableCell>
        )}
        {selectedColumns.includes('code') && <TableCell>{row.code || '-'}</TableCell>}
        {selectedColumns.includes('isDefault') && (
          <TableCell>{row.isDefault ? 'Yes' : 'No'}</TableCell>
        )}
        {selectedColumns.includes('legalName') && <TableCell>{row.legalName || '-'}</TableCell>}
        {selectedColumns.includes('name') && <TableCell>{row.name || '-'}</TableCell>}
        {selectedColumns.includes('address') && <TableCell>{row.address || '-'}</TableCell>}
        {selectedColumns.includes('phoneNumber') && <TableCell>{row.phoneNumber || '-'}</TableCell>}
        {selectedColumns.includes('mobile') && <TableCell>{row.mobile || '-'}</TableCell>}
        {selectedColumns.includes('email') && <TableCell>{row.email || '-'}</TableCell>}
        {selectedColumns.includes('website') && <TableCell>{row.website || '-'}</TableCell>}
        {selectedColumns.includes('rohini_id') && <TableCell>{row.rohiniId || '-'}</TableCell>}
        {selectedColumns.includes('gst_no') && <TableCell>{row.gstNo || '-'}</TableCell>}
        {selectedColumns.includes('jurisdiction') && (
          <TableCell>{row.jurisdiction || '-'}</TableCell>
        )}
        {selectedColumns.includes('city') && <TableCell>{row.city || '-'}</TableCell>}
        {selectedColumns.includes('state') && <TableCell>{row.state || '-'}</TableCell>}
        {selectedColumns.includes('country') && <TableCell>{row.country || '-'}</TableCell>}
        {selectedColumns.includes('zip_code') && <TableCell>{row.zipCode || '-'}</TableCell>}
        {selectedColumns.includes('createdAt') && (
          <TableCell>{row.createdAt ? FormatDateString(row.createdAt) : '-'}</TableCell>
        )}
        {selectedColumns.includes('Modification') && (
          <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
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
          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
