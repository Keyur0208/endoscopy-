import { useState, useEffect, useCallback } from 'react';

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

import { useDebounce } from 'src/hooks/use-debounce';

import { useGetUsers } from 'src/actions/user';
import { DashboardContent } from 'src/layouts/dashboard';
import SettingsIcon from 'src/assets/icons/settings-icon';

import { Iconify } from 'src/components/iconify';
import InfoTable from 'src/components/table-body';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import UserTableRow from '../user-table-row';

// ----------------------------------------------------------------------

const DEFAULT_COLUMNS = [
  'srNo',
  'branch',
  'oranization',
  'fullName',
  'userRole',
  'email',
  'mobile',
  'isActive',
  'Modification',
];

const TABLE_HEAD = [
  { id: 'srNo', label: 'Sr No.' },
  { id: 'branch', label: 'Branch' },
  { id: 'oranization', label: 'Oranization' },
  { id: 'fullName', label: 'Full Name' },
  { id: 'userRole', label: 'User Role' },
  { id: 'email', label: 'Email' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'isActive', label: 'Status' },
  { id: 'Modification', label: 'Modification', width: 88 },
];

export default function UserListView() {
  const popover = usePopover();
  const table = useTable();
  const router = useRouter();
  // const { users, isLoading } = useGetUsers();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { users, usersMeta, isLoading } = useGetUsers({
    searchFor: 'all',
    page: table.page + 1,
    perPage: table.rowsPerPage,
    searchedValue: debouncedSearchQuery,
  });

  const [tableData, setTableData] = useState<any[]>(users);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(DEFAULT_COLUMNS);

  useEffect(() => {
    if (users) {
      setTableData(users);
    }
  }, [users]);

  const denseHeight = table.dense ? 56 : 56 + 20;

  const handleEditRow = useCallback(
    (id: number) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  // const notFound = !filteredData.length;

  const notFound = !isLoading && usersMeta?.total === 0 && tableData.length === 0;

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
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
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
                placeholder="Search by user name & mobile number..."
                sx={{ '& .MuiInputBase-root': { height: 40, width: '50%' } }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                  both: [PermissionKeys.USER_CREATE],
                }}
                isDisabledMode="both"
              > */}
              <Button
                component={RouterLink}
                href={paths.dashboard.user.new}
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
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
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

                  <TableBody
                    sx={{
                      cursor: 'pointer',
                      '& tr': {
                        '& > td': {
                          whiteSpace: 'nowrap',
                        },
                      },
                    }}
                  >
                    {tableData
                      .sort((a, b) => a.id - b.id)
                      .map((row, index) => (
                        <UserTableRow
                          index={table.page * table.rowsPerPage + index + 1}
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onEditRow={() => handleEditRow(row.id)}
                          selectedColumns={selectedColumns}
                        />
                      ))}

                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                    />

                    <TableNoData notFound={notFound} colSpan={TABLE_HEAD.length} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              count={usersMeta?.total || tableData.length || 0}
              page={table.page}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              onRowsPerPageChange={table.onChangeRowsPerPage}
              dense={table.dense}
              onChangeDense={table.onChangeDense}
            />
          </InfoTable>
        </DashboardContent>
      )}
    </>
  );
}
