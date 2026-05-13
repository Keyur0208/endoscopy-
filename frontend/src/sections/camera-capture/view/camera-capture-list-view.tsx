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
import { useGetRecordingSessions } from 'src/actions/camera-capture';

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

import CameraCaptureTableRow from '../camera-capture-table-row';

// ----------------------------------------------------------------------

const DEFAULT_COLUMNS = [
  'sr',
  'recordId',
  'uhid',
  'patientName',
  'age',
  'sex',
  'captureDate',
  'entryDate',
  'startTime',
  'endTime',
  'durationTime',
  'remark',
  'createdBy',
  'updatedBy',
  'resourceInfo',
  'modification',
];

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr no.', width: 100 },
  { id: 'recordId', label: 'Record Id', width: 150 },
  { id: 'uhid', label: 'UHID', width: 150 },
  { id: 'patientName', label: 'Patient Name', width: 200 },
  { id: 'age', label: 'Age', width: 80 },
  { id: 'sex', label: 'Sex', width: 80 },
  { id: 'captureDate', label: 'Capture Date', width: 150 },
  { id: 'entryDate', label: 'Entry Date', width: 150 },
  { id: 'startTime', label: 'Start Time', width: 150 },
  { id: 'endTime', label: 'End Time', width: 150 },
  { id: 'durationTime', label: 'Duration Time', width: 150 },
  { id: 'remark', label: 'Remark', width: 200 },
  { id: 'createdBy', label: 'Created By', width: 150 },
  { id: 'updatedBy', label: 'Updated By', width: 150 },
  { id: 'resourceInfo', label: 'Resource Info', width: 200 },
  { id: 'modification', label: 'Modification', width: 88 },
];

export default function CameraCaptureListView() {
  const popover = usePopover();
  const table = useTable();
  const router = useRouter();
  const lastTableDataRef = useRef<any[]>([]);
  const { query, setQuery, debouncedQuery } = useDebouncedSearch(500);

  const { recordingSessions, isLoading, recordingSessionsMeta } = useGetRecordingSessions({
    searchFor: 'all',
    page: table.page + 1,
    perPage: table.rowsPerPage,
    searchedValue: debouncedQuery,
  });

  const [tableData, setTableData] = useState<any[]>(recordingSessions || []);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(DEFAULT_COLUMNS);

  useEffect(() => {
    if (Array.isArray(recordingSessions)) {
      lastTableDataRef.current = recordingSessions;

      setTableData(recordingSessions);
    }
  }, [recordingSessions]);

  const handleEditRow = useCallback(
    (id: number) => {
      router.push(paths.dashboard.cameraCapture.edit(id));
    },
    [router]
  );

  const notFound = !isLoading && recordingSessionsMeta?.total === 0 && tableData.length === 0;

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
          <Button
            component={RouterLink}
            href={paths.dashboard.cameraCapture.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Entry
          </Button>
        </Box>
      </Box>
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
                    <CameraCaptureTableRow
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
          count={recordingSessionsMeta?.total || tableData.length || 0}
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
