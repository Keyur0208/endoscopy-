import type { IParameterMasterRecord } from 'src/types/parameter-master';

import { MenuList } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

type Props = {
  selected: boolean;
  index: number;
  onEditRow: VoidFunction;
  row: IParameterMasterRecord;
};

export default function ParameterMasterTableRow({ row, selected, onEditRow, index }: Props) {
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>{index}</TableCell>
        <TableCell>{row?.name || '-'}</TableCell>
        <TableCell>{row?.defaultValue || '-'}</TableCell>
        <TableCell>{row?.inputType || '-'}</TableCell>
        <TableCell>{row?.isHeading ? 'Yes' : 'No'}</TableCell>
        <TableCell>{row?.isActive ? 'Yes' : 'No'}</TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
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
