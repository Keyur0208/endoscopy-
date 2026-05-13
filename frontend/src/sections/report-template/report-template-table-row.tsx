import type { IReportTemplateRecord } from 'src/types/report-template';

import { MenuList } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { useTimezone } from 'src/components/time-zone';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

type Props = {
  selected: boolean;
  index: number;
  selectedColumns: any;
  onEditRow: VoidFunction;
  row: IReportTemplateRecord;
  onSelectRow: VoidFunction;
};

export default function ReportTemplateTableRow({
  row,
  selected,
  onEditRow,
  index,
  selectedColumns,
}: Props) {
  const popover = usePopover();
  const { formatPlainToDisplayDate } = useTimezone();

  return (
    <>
      <TableRow hover selected={selected}>
        {selectedColumns.includes('srNo') && <TableCell>{index}</TableCell>}
        {selectedColumns.includes('title') && <TableCell>{row?.title || '-'}</TableCell>}
        {selectedColumns.includes('code') && <TableCell>{row?.code || '-'}</TableCell>}
        {selectedColumns.includes('maxImages') && (
          <TableCell>{row?.maxImages !== undefined ? row.maxImages : '-'}</TableCell>
        )}
        {selectedColumns.includes('isActive') && (
          <TableCell>{row?.isActive ? 'Active' : 'Inactive'}</TableCell>
        )}
        {selectedColumns.includes('createdAt') && (
          <TableCell>{row?.createdAt ? formatPlainToDisplayDate(row.createdAt) : '-'}</TableCell>
        )}
        {selectedColumns.includes('updatedAt') && (
          <TableCell>{row?.updatedAt ? formatPlainToDisplayDate(row.updatedAt) : '-'}</TableCell>
        )}
        {selectedColumns.includes('createdBy') && (
          <TableCell>
            {row?.createdByUser?.fullName || row?.createdByAdminUser?.fullName || '-'}
          </TableCell>
        )}
        {selectedColumns.includes('updatedBy') && (
          <TableCell>
            {row?.updatedByUser?.fullName || row?.updatedByAdminUser?.fullName || '-'}
          </TableCell>
        )}

        {selectedColumns.includes('Modification') && (
          <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
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
