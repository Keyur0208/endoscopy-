import type { IRecordingSession } from 'src/types/recording';

import { MenuList } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { useTimezone } from 'src/components/time-zone';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  index: number;
  selected: boolean;
  onEditRow: VoidFunction;
  row: IRecordingSession;
  selectedColumns: any;
};

export default function CameraCaptureTableRow({
  row,
  index,
  selected,
  onEditRow,
  selectedColumns,
}: Props) {
  const popover = usePopover();

  const { formatPlainToDisplayDate } = useTimezone();

  return (
    <>
      <TableRow hover selected={selected}>
        {selectedColumns.includes('sr') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{index ?? '-'}</TableCell>
        )}

        {selectedColumns.includes('recordId') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.recordId || '-'}</TableCell>
        )}

        {selectedColumns.includes('uhid') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.uhid || '-'}</TableCell>
        )}

        {selectedColumns.includes('patientName') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {`${row?.patient?.firstName || '-'} ${row?.patient?.middleName || ''} ${row?.patient?.lastName || ''}`.trim()}
          </TableCell>
        )}

        {selectedColumns.includes('age') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.patient?.age || '-'}</TableCell>
        )}

        {selectedColumns.includes('sex') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.patient?.sex || '-'}</TableCell>
        )}

        {selectedColumns.includes('captureDate') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {row?.captureDate ? formatPlainToDisplayDate(row?.captureDate) : '-'}
          </TableCell>
        )}

        {selectedColumns.includes('entryDate') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {row?.entryDate ? formatPlainToDisplayDate(row?.entryDate) : '-'}
          </TableCell>
        )}

        {selectedColumns.includes('startTime') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {row?.startTime ? formatPlainToDisplayDate(row?.startTime) : '-'}
          </TableCell>
        )}

        {selectedColumns.includes('endTime') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {row?.endTime ? formatPlainToDisplayDate(row?.endTime) : '-'}
          </TableCell>
        )}

        {selectedColumns.includes('durationTime') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {row?.durationTime ? formatPlainToDisplayDate(row?.durationTime) : '-'}
          </TableCell>
        )}

        {selectedColumns.includes('remark') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.remarks || '-'}</TableCell>
        )}

        {selectedColumns.includes('createdBy') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {row?.createdBy?.fullName || row?.createdByAdminUser?.fullName || '-'}
          </TableCell>
        )}

        {selectedColumns.includes('updatedBy') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {row?.updatedBy?.fullName || row?.updatedByAdminUser?.fullName || '-'}
          </TableCell>
        )}

        {selectedColumns.includes('resourceInfo') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.resourceInfo?.pcName || '-'}</TableCell>
        )}

        {selectedColumns.includes('modification') && (
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
