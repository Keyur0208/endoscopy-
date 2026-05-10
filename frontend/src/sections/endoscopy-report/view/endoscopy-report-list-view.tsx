import { useRef, useState, useEffect, useCallback } from 'react';

import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import {
  Box,
  Stack,
  Divider,
  Checkbox,
  MenuItem,
  TableCell,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useDebouncedSearch } from 'src/hooks/use-debounce';

import { DashboardContent } from 'src/layouts/dashboard';
import SettingsIcon from 'src/assets/icons/settings-icon';
import { useGetPatientRegistrations } from 'src/actions/patient-registration';

import { Iconify } from 'src/components/iconify';
import InfoTable from 'src/components/table-body';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import EndoscopyReportTableRow from '../endoscopy-report-table-row';

// ----------------------------------------------------------------------

const DEFAULT_COLUMNS = [
  'sr',
  'recordId',
  'uhid',
  'patientname',
  'category',
  'birthDate',
  'age',
  'ageUnit',
  'sex',
  'hospitalDr',
  'referenceBy',
  'height',
  'weight',
  'bloodGroup',
  'mobile',
  'email',
  'address',
  'area',
  'city',
  'state',
  'pin',
  'nationality',
  'adharCard',
  'panCard',
  'membershipId',
  'employeeId',
  'occupation',
  'spouseOccupation',
  'companyName',
  'education',
  'yojanaCardNo',
  'mediclaim',
  'remark',
  'referralTo',
  'registrationDate',
  'caseDate',
  'Modification',
];

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr no.', width: 100 },
  { id: 'recordId', label: 'Record Id', width: 150 },
  { id: 'uhid', label: 'UHID', width: 100 },
  { id: 'patientname', label: 'Patient Name', width: 200 },
  { id: 'category', label: 'Category', width: 150 },
  { id: 'birthDate', label: 'Birth Date', width: 150 },
  { id: 'age', label: 'Age', width: 100 },
  { id: 'ageUnit', label: 'Age Unit', width: 100 },
  { id: 'sex', label: 'Sex', width: 100 },
  { id: 'weddingDate', label: 'Wedding Date', width: 150 },
  { id: 'hospitalDr', label: 'Hospital Dr', width: 150 },
  { id: 'referenceBy', label: 'Reference By', width: 150 },
  { id: 'language', label: 'Language', width: 150 },
  { id: 'religion', label: 'Religion', width: 150 },
  { id: 'height', label: 'Height', width: 150 },
  { id: 'weight', label: 'Weight', width: 150 },
  { id: 'bloodGroup', label: 'Blood Group', width: 150 },
  { id: 'maritalStatus', label: 'Marital Status', width: 150 },
  { id: 'mobile', label: 'Mobile', width: 150 },
  { id: 'mobile2', label: 'Mobile2', width: 150 },
  { id: 'office', label: 'Office', width: 150 },
  { id: 'email', label: 'Email', width: 150 },
  { id: 'address', label: 'Address', width: 200 },
  { id: 'area', label: 'Area', width: 150 },
  { id: 'city', label: 'City', width: 150 },
  { id: 'state', label: 'State', width: 150 },
  { id: 'pin', label: 'Pin', width: 100 },
  { id: 'nationality', label: 'Nationality', width: 150 },
  { id: 'visaType', label: 'Type Of Visa', width: 150 },
  { id: 'adharCard', label: 'Aadhar Card', width: 150 },
  { id: 'panCard', label: 'Pan Card', width: 150 },
  { id: 'membershipId', label: 'Membership Id', width: 150 },
  { id: 'employeeId', label: 'Employee Id', width: 150 },
  { id: 'occupation', label: 'Occupation', width: 150 },
  { id: 'spouseOccupation', label: 'Spouse Occupation', width: 150 },
  { id: 'companyName', label: 'Company Name', width: 150 },
  { id: 'education', label: 'Education', width: 150 },
  { id: 'yojanaCardNo', label: 'Yojana Card No', width: 150 },
  { id: 'mediclaim', label: 'Mediclaim', width: 150 },
  { id: 'remark', label: 'Remark', width: 150 },
  { id: 'referralTo', label: 'Referral To', width: 150 },
  { id: 'transfer', label: 'Transfer', width: 150 },
  { id: 'registrationDate', label: 'Registration Date', width: 150 },
  { id: 'caseDate', label: 'Case Date', width: 150 },
  { id: 'Modification', label: 'Modification', width: 88 },
];

export default function EndoscopyReportListView() {
  const popover = usePopover();
  const table = useTable();
  const router = useRouter();
  const lastTableDataRef = useRef<any[]>([]);
  const { query, setQuery, debouncedQuery } = useDebouncedSearch(500);

  const { patientRegistrations, patientRegistrationsMeta, isLoading } = useGetPatientRegistrations({
    searchFor: 'all',
    page: table.page + 1,
    perPage: table.rowsPerPage,
    searchedValue: debouncedQuery,
  });

  const [tableData, setTableData] = useState<any[]>(patientRegistrations);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(DEFAULT_COLUMNS);

  useEffect(() => {
    if (!isLoading && Array.isArray(patientRegistrations)) {
      lastTableDataRef.current = patientRegistrations;
      setTableData(patientRegistrations);
    }
  }, [patientRegistrations, isLoading]);

  const handleEditRow = useCallback(
    (id: number) => {
      router.push(paths.dashboard.patientRegistration.edit(id));
    },
    [router]
  );

  const notFound = !isLoading && patientRegistrationsMeta?.total === 0 && tableData.length === 0;

  const handleToggleColumn = (id: string) => {
    setSelectedColumns((prev) =>
      prev.includes(id) ? prev.filter((colId) => colId !== id) : [...prev, id]
    );
  };

  const handleSelectAllColumns = () => {
    setSelectedColumns(TABLE_HEAD.map((col) => col.id));
  };

  const handleClearColumns = () => {
    setSelectedColumns(DEFAULT_COLUMNS);
  };

  return (
    <DashboardContent
      sx={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: '10px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <IconButton onClick={popover.onOpen}>
          <SettingsIcon />
        </IconButton>

        <Stack direction="row" alignItems="center" flexGrow={1} spacing={1}>
          <TextField
            fullWidth
            placeholder="Search by uhid, patient name,mobile number..."
            sx={{ '& .MuiInputBase-root': { height: 40, width: '50%' } }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Box>
          {/* <PermissionGuard
            fieldName="create"
            permissionKeys={{
              both: [PermissionKeys.PATIENT_REGISTRATION_CREATE],
            }}
            isDisabledMode="both"
          > */}
          <Button
            component={RouterLink}
            href={paths.dashboard.patientRegistration.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Entry
          </Button>
          {/* </PermissionGuard> */}
        </Box>
      </Box>
      {/* // Setting Button Popup  */}

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        sx={{
          overflowY: 'scroll',
          overflowX: 'hidden',
          width: '100%',
        }}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuItem onClick={handleSelectAllColumns}>Select All</MenuItem>
        <MenuItem onClick={handleClearColumns}>Reset to Default</MenuItem>
        <Divider />
        {Array.isArray(TABLE_HEAD) && TABLE_HEAD.length > 0 ? (
          TABLE_HEAD.map((column, index) => (
            <>
              <MenuItem key={index}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedColumns.includes(column.id)}
                      onChange={() => handleToggleColumn(column.id)}
                      disabled={column.id === 'sr'}
                    />
                  }
                  label={column.label}
                  sx={{ paddingLeft: '0.5rem' }}
                />
              </MenuItem>
              <Divider />
            </>
          ))
        ) : (
          <MenuItem disabled>No items</MenuItem>
        )}
      </CustomPopover>

      <InfoTable>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'}>
              <TableHeadCustom
                sx={{
                  '& tr': {
                    '& > th': {
                      whiteSpace: 'nowrap',
                    },
                  },
                }}
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD.filter((col) => selectedColumns.includes(col.id))}
                rowCount={tableData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />

              {isLoading ? (
                <TableCell colSpan={TABLE_HEAD.length} align="center" height={300}>
                  <LoadingScreen />
                </TableCell>
              ) : (
                <TableBody
                  sx={{
                    '& tr': {
                      '& > td': {
                        whiteSpace: 'nowrap',
                      },
                    },
                  }}
                >
                  {tableData.map((row, index) => (
                    <EndoscopyReportTableRow
                      key={row.id}
                      index={table.page * table.rowsPerPage + index + 1}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                      selectedColumns={selectedColumns}
                    />
                  ))}

                  {!isLoading && notFound && <TableNoData notFound colSpan={TABLE_HEAD.length} />}
                </TableBody>
              )}
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={patientRegistrationsMeta?.total || tableData.length || 0}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </InfoTable>
    </DashboardContent>
  );
}
