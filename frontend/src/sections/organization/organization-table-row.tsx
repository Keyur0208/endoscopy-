import type { IOrganizationItem } from 'src/types/organization';

import { MenuList } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { FormatDateTime, FormatDateString } from 'src/components/format-date-time';

type Props = {
  selected: boolean;
  index: number;
  selectedColumns: any;
  onEditRow: VoidFunction;
  row: IOrganizationItem;
  onSelectRow: VoidFunction;
};

export default function OrganizationTableRow({
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
        {selectedColumns.includes('licenseKey') && <TableCell>{row?.licenseKey || '-'}</TableCell>}
        {selectedColumns.includes('licenseType') && (
          <TableCell>{row?.licenseType || '-'}</TableCell>
        )}
        {selectedColumns.includes('name') && <TableCell>{row?.name || '-'}</TableCell>}
        {selectedColumns.includes('legalName') && <TableCell>{row?.legalName || '-'}</TableCell>}
        {selectedColumns.includes('email') && <TableCell>{row?.email || '-'}</TableCell>}
        {selectedColumns.includes('mobile') && <TableCell>{row?.mobile || '-'}</TableCell>}
        {selectedColumns.includes('expiryDate') && (
          <TableCell>{row?.expiryDate ? FormatDateTime(row?.expiryDate) : '-'}</TableCell>
        )}

        {selectedColumns.includes('createdAt') && (
          <TableCell>{row?.createdAt ? FormatDateString(row?.createdAt) : ''}</TableCell>
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
