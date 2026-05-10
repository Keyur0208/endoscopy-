import { useRef, useState, useEffect, useCallback } from 'react';

import Table from '@mui/material/Table';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import {
  Box,
  Stack,
  Button,
  Divider,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebouncedSearch } from 'src/hooks/use-debounce';

import { DashboardContent } from 'src/layouts/dashboard';
// Icons
import SettingsIcon from 'src/assets/icons/settings-icon';
import { useGetOrganizationBranches } from 'src/actions/organization-branch';

// Components
import { Iconify } from 'src/components/iconify';
import InfoTable from 'src/components/table-body';
import { Scrollbar } from 'src/components/scrollbar';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import UserRolePermissonTableRow from '../organization-branch-table-row';

// ----------------------------------------------------------------------

export const DEFAULT_COLUMNS = [
  'srNo',
  'organizationId',
  'name',
  'address',
  'isDefault',
  'phoneNumber',
  'mobile',
  'email',
  'website',
  'city',
  'state',
  'country',
  'zip_code',
  'createdAt',
  'Modification',
];

const TABLE_HEAD = [
  { id: 'srNo', label: 'Sr No.' },
  { id: 'organizationId', label: 'Organization Name' },
  { id: 'code', label: 'Code' },
  { id: 'isDefault', label: 'Is Default' },
  { id: 'legalName', label: 'Legal Name' },
  { id: 'name', label: 'Name' },
  { id: 'address', label: 'Address' },
  { id: 'phoneNumber', label: 'Phone Number' },
  { id: 'mobile', label: 'Mobile Number' },
  { id: 'email', label: 'Email' },
  { id: 'website', label: 'Website' },
  { id: 'rohini_id', label: 'Rohini Id' },
  { id: 'gst_no', label: 'Gst No' },
  { id: 'jurisdiction', label: 'Jurisdiction' },
  { id: 'city', label: 'City' },
  { id: 'state', label: 'State' },
  { id: 'country', label: 'Country' },
  { id: 'zip_code', label: 'Zip Code' },
  { id: 'createdAt', label: 'Created Date & Time' },
  { id: 'Modification', label: 'Modification', width: 88 }, // Actions column (Edit/Delete)
];

export default function OrganizationBranchListView() {
  const popover = usePopover();
  const table = useTable();
  const router = useRouter();
  const confirm = useBoolean();
  const lastTableDataRef = useRef<any[]>([]);
  const { query, setQuery, debouncedQuery } = useDebouncedSearch(500);
  const { organizationbranches, organizationbranchesMeta, isLoading } = useGetOrganizationBranches({
    searchFor: 'all',
    page: table.page + 1,
    perPage: table.rowsPerPage,
    searchedValue: debouncedQuery,
  });
  const [tableData, setTableData] = useState<any[]>(organizationbranches);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(DEFAULT_COLUMNS);

  useEffect(() => {
    if (organizationbranches) {
      setTableData(organizationbranches);
    }
  }, [organizationbranches]);

  useEffect(() => {
    if (!isLoading && Array.isArray(organizationbranches)) {
      lastTableDataRef.current = organizationbranches;
      setTableData(organizationbranches);
    }
  }, [organizationbranches, isLoading]);

  const notFound = !isLoading && organizationbranchesMeta?.total === 0 && tableData.length === 0;

  const handleEditRow = useCallback(
    (id: number) => {
      router.push(paths.dashboard.organizationBranch.edit(id));
    },
    [router]
  );

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
            placeholder="Search by Organization Name & legal Name..."
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
        <Button
          component={RouterLink}
          href={paths.dashboard.organizationBranch.new}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Entry
        </Button>
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
                      disabled={column.id === 'srNo'}
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
            <Table
              size={table.dense ? 'small' : 'medium'}
              sx={{ minWidth: 960, textWrap: 'nowrap' }}
            >
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD.filter((col) => selectedColumns.includes(col.id))}
                rowCount={tableData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />

              <TableBody>
                {tableData.map((row, index) => (
                  <UserRolePermissonTableRow
                    key={row.id}
                    row={row}
                    index={table.page * table.rowsPerPage + index + 1}
                    selected={table.selected.includes(row.id)}
                    onEditRow={() => handleEditRow(row.id)}
                    selectedColumns={selectedColumns}
                  />
                ))}

                {!isLoading && notFound && <TableNoData notFound colSpan={TABLE_HEAD.length} />}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={organizationbranchesMeta?.total || tableData.length || 0}
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
