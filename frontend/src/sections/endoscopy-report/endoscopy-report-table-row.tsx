import type { IPatientRegistrationItem } from 'src/types/patient-registration';

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
  row: IPatientRegistrationItem;
  selectedColumns: any;
};

export default function EndoscopyReportTableRow({
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

        {selectedColumns.includes('patientname') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {`${row?.firstName || '-'} ${row?.middleName || ''} ${row?.lastName || ''}`.trim()}
          </TableCell>
        )}

        {selectedColumns.includes('category') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.category || '-'}</TableCell>
        )}

        {selectedColumns.includes('birthDate') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {row?.birthDate ? formatPlainToDisplayDate(row?.birthDate) : '-'}
          </TableCell>
        )}

        {selectedColumns.includes('age') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.age || '-'}</TableCell>
        )}

        {selectedColumns.includes('ageUnit') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.ageUnit || '-'}</TableCell>
        )}

        {selectedColumns.includes('sex') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.sex || '-'}</TableCell>
        )}

        {selectedColumns.includes('weddingDate') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {row?.weddingDate ? formatPlainToDisplayDate(row?.weddingDate) : '-'}
          </TableCell>
        )}

        {selectedColumns.includes('hospitalDr') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {`${row?.hospitalDoctor || ''}`.trim()}
          </TableCell>
        )}

        {selectedColumns.includes('referenceBy') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {`${row?.referenceDoctor || ''}`.trim()}
          </TableCell>
        )}

        {selectedColumns.includes('language') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.language || '-'}</TableCell>
        )}

        {selectedColumns.includes('religion') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.religion || '-'}</TableCell>
        )}

        {selectedColumns.includes('height') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.height || '-'}</TableCell>
        )}

        {selectedColumns.includes('weight') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.weight || '-'}</TableCell>
        )}

        {selectedColumns.includes('bloodGroup') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.bloodGroup || '-'}</TableCell>
        )}

        {selectedColumns.includes('maritalStatus') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.maritalStatus || '-'}</TableCell>
        )}

        {selectedColumns.includes('mobile') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.mobile || '-'}</TableCell>
        )}

        {selectedColumns.includes('mobile2') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.mobile2 || '-'}</TableCell>
        )}

        {selectedColumns.includes('office') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.office || '-'}</TableCell>
        )}

        {selectedColumns.includes('email') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.email || '-'}</TableCell>
        )}

        {selectedColumns.includes('address') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.address || '-'}</TableCell>
        )}

        {selectedColumns.includes('area') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.area || '-'}</TableCell>
        )}

        {selectedColumns.includes('city') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.city || '-'}</TableCell>
        )}

        {selectedColumns.includes('state') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.state || '-'}</TableCell>
        )}

        {selectedColumns.includes('pin') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.pin || '-'}</TableCell>
        )}

        {selectedColumns.includes('nationality') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.nationality || '-'}</TableCell>
        )}

        {selectedColumns.includes('adharCard') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.adharCard || '-'}</TableCell>
        )}

        {selectedColumns.includes('profileImage') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.profileImage || '-'}</TableCell>
        )}

        {selectedColumns.includes('panCard') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.panCard || '-'}</TableCell>
        )}

        {selectedColumns.includes('membershipId') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.membershipId || '-'}</TableCell>
        )}

        {selectedColumns.includes('employeeId') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.employeesId || '-'}</TableCell>
        )}

        {selectedColumns.includes('occupation') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.occupation || '-'}</TableCell>
        )}

        {selectedColumns.includes('spouseOccupation') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.spouseOccupation || '-'}</TableCell>
        )}

        {selectedColumns.includes('companyName') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.companyName || '-'}</TableCell>
        )}

        {selectedColumns.includes('education') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.education || '-'}</TableCell>
        )}

        {selectedColumns.includes('yojanaCardNo') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.yojanaCardNo || '-'}</TableCell>
        )}

        {selectedColumns.includes('mediclaim') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {row?.mediclaim === true ? 'Yes' : row?.mediclaim === false ? 'No' : '-'}
          </TableCell>
        )}

        {selectedColumns.includes('remark') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.remark || '-'}</TableCell>
        )}

        {selectedColumns.includes('referralTo') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.referralTo || '-'}</TableCell>
        )}

        {selectedColumns.includes('transfer') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.transfer || '-'}</TableCell>
        )}

        {selectedColumns.includes('registrationDate') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {row?.registrationDate ? formatPlainToDisplayDate(row?.registrationDate) : '-'}
          </TableCell>
        )}

        {selectedColumns.includes('caseDate') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {row?.registrationDate ? formatPlainToDisplayDate(row?.caseDate) : '-'}
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
