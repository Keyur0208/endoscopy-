import type { IReportTemplateSectionRecord } from 'src/types/report-template';

import { MenuList } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

type Props = {
  isdisable: boolean;
  selected: boolean;
  index: number;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
  row: IReportTemplateSectionRecord;
};

export default function ReportTemplateFieldTableRow({
  row,
  selected,
  onEditRow,
  onDeleteRow,
  index,
  isdisable,
}: Props) {
  const popover = usePopover();

  return (
    <>
      <TableRow
        hover
        selected={selected}
        onDoubleClick={onEditRow}
        sx={{ cursor: 'pointer' }}
        data-hasdata="true"
      >
        <TableCell>{index}</TableCell>
        <TableCell>{row?.parameter?.name || '-'}</TableCell>
        <TableCell>{row?.sequence !== undefined ? row.sequence : '-'}</TableCell>
        <TableCell>{row?.isRequired ? 'Yes' : 'No'}</TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton
            color={popover.open ? 'inherit' : 'default'}
            onClick={popover.onOpen}
            disabled={isdisable}
          >
            <Iconify icon="eva:more-vertical-fill" width={15} />
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
              onDeleteRow();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>

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
