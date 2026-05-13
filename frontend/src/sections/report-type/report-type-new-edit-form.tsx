import type {
  ICreateReportType,
  IReportTypeRecord,
  IUpdateReportType,
} from 'src/types/report-type';

import { mutate } from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import {
  Grid,
  Paper,
  Stack,
  Table,
  TableRow,
  TableCell,
  TextField,
  TableHead,
  TableBody,
  InputAdornment,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useDebouncedSearch } from 'src/hooks/use-debounce';

import { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';
import { ReportTypeSchema } from 'src/validator/report-type-validator';
import {
  createReportType,
  updateReportType,
  useGetReportTypes,
  useSearchReportTypes,
} from 'src/actions/report-type';

import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import InfoTable from 'src/components/table-body';
import RHFFormField from 'src/components/form-feild';
import { Scrollbar } from 'src/components/scrollbar';
import DoctorFormButtons from 'src/components/button-group';
import { LoadingScreen } from 'src/components/loading-screen';
import RHFFormFieldTextArea from 'src/components/form-field-textarea';
import { AutoCompleteFieldV2 } from 'src/components/autocomplate-field-v2';
import { useTable, TableEmptyRows, TablePaginationCustom } from 'src/components/table';
import { ActiveInactiveField } from 'src/components/selection/active-inactive-selection';
import { RATE_CHANGEABLE_OPTIONS } from 'src/components/selection/rate-changeable-selection';

import ReportTypeTableRow from './report-type-table-row';

export default function ReportTypeNewEditForm() {
  // Report Type Search
  const reportTypeSearch = useDebouncedSearch();
  const { searchReportTypes, searchReportTypesIsLoading } = useSearchReportTypes(
    reportTypeSearch.debouncedQuery || ''
  );
  const [editRowId, setEditRowId] = useState<number | null>();

  const defaultValues: ICreateReportType = useMemo(
    () => ({
      name: '',
      code: '',
      description: '',
      isActive: true,
      isDefault: true,
    }),
    []
  );

  const methods = useForm<ICreateReportType>({
    resolver: zodResolver(ReportTypeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let reportTypeId = editRowId;
      if (reportTypeId) {
        await updateReportType(reportTypeId, data as IUpdateReportType);
      } else {
        const createReportTypeId = await createReportType(data as ICreateReportType);
        reportTypeId = createReportTypeId?.id;
        if (!reportTypeId) throw new Error('Failed to create Report Type.');
      }
      await mutate(`${endpoints.reportType.getAll}?searchFor=all&page=1&perPage=50`);
      reset(defaultValues);
      setEditRowId(null);
    } catch (error) {
      console.error('Error:', error);
    }
  });

  const table = useTable();
  const router = useRouter();
  const lastTableDataRef = useRef<any[]>([]);
  const { query, setQuery, debouncedQuery } = useDebouncedSearch(500);
  const { reportTypes, reportTypesMeta, isLoading } = useGetReportTypes({
    searchFor: 'all',
    page: table.page + 1,
    perPage: table.rowsPerPage,
    searchedValue: debouncedQuery,
  });
  const [tableData, setTableData] = useState<any[]>(reportTypes);

  useEffect(() => {
    if (!isLoading && Array.isArray(reportTypes)) {
      lastTableDataRef.current = reportTypes;
      setTableData(reportTypes);
    }
  }, [reportTypes, isLoading]);

  const notFound = !isLoading && reportTypesMeta?.total === 0 && tableData.length === 0;

  const handleEditRow = (row: IReportTypeRecord) => {
    const editData: ICreateReportType = {
      name: row.name || '',
      code: row.code || '',
      description: row.description || '',
      isActive: row.isActive || false,
      isDefault: row.isDefault || false,
    };
    reset(editData);
  };

  const handleExit = () => {
    router.push(paths.dashboard.root);
  };

  return (
    <>
      <DashboardContent title="Report Type Master">
        <Form methods={methods} onSubmit={onSubmit}>
          <Paper elevation={3}>
            <Box sx={{ p: 2, borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <RHFFormField
                    name="code"
                    label="Code"
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '100px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} />
                <Grid item xs={12} sm={3}>
                  <ActiveInactiveField
                    name="isActive"
                    label="Status"
                    fullWidth
                    BoxSx={{
                      display: { xs: 'block', md: 'grid' },
                      alignItems: 'center',
                      gridTemplateColumns: { xs: '1fr 2fr', md: 'auto 2fr' },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <AutoCompleteFieldV2
                    label="Name"
                    name="name"
                    options={searchReportTypes}
                    loading={searchReportTypesIsLoading}
                    getOptionValue={(l) => l.id}
                    getOptionLabel={(l) => l.name}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '100px 2fr',
                      },
                      columnGap: 1,
                    }}
                    onSearch={(value) => reportTypeSearch.setQuery(value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4} />
                <Grid item xs={12} sm={3}>
                  <RHFFormField
                    name="isDefault"
                    label="Default"
                    options={RATE_CHANGEABLE_OPTIONS}
                    fullWidth
                    BoxSx={{
                      display: { xs: 'block', md: 'grid' },
                      alignItems: 'center',
                      gridTemplateColumns: { xs: '1fr 2fr', md: 'auto 2fr' },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <RHFFormFieldTextArea
                    name="description"
                    label="Description"
                    multiline
                    minRows={2}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'start',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '100px 2fr',
                      },
                      columnGap: 1,
                    }}
                    InputSx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '2px',
                        height: 'auto',
                        backgroundColor: '#fff',
                        color: 'black',
                      },
                      '& .MuiInputBase-input': {
                        color: 'black',
                        fontSize: '14px',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={9} />
              </Grid>
            </Box>

            <Box px={2}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Stack direction="row" alignItems="center" flexGrow={1} spacing={1} mb={1}>
                  <TextField
                    fullWidth
                    placeholder="Search by report type..."
                    sx={{ '& .MuiInputBase-root': { height: 40, width: '100%' } }}
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
              </Box>

              <InfoTable>
                <TableContainer
                  sx={{
                    height: 'calc(100vh - 22rem)',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': { width: '8px' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#888' },
                    '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' },
                  }}
                >
                  <Scrollbar>
                    <Table
                      size="small"
                      stickyHeader
                      sx={{
                        fontSize: '1rem',
                        borderRadius: 0,
                      }}
                    >
                      <TableHead
                        sx={{
                          whiteSpace: 'nowrap',
                          '& tr > th': {
                            cursor: 'pointer',
                            fontSize: '13px',
                            whiteSpace: 'nowrap',
                          },
                        }}
                      >
                        <TableRow>
                          <TableCell>Sr.No</TableCell>
                          <TableCell>Code</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Default</TableCell>
                          <TableCell>Modification</TableCell>
                        </TableRow>
                      </TableHead>

                      {isLoading ? (
                        <LoadingScreen />
                      ) : (
                        <TableBody
                          sx={{
                            '& tr > td': {
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              fontSize: '13px',
                            },
                            '& tr:hover:not(.Mui-selected)': {
                              backgroundColor: '#E5F0FF',
                            },
                            '& tr.Mui-selected, & tr.Mui-selected:hover': {
                              backgroundColor: '#E5F0FF',
                            },
                            '& tr.row-red:not(.Mui-selected)': {
                              backgroundColor: '#F08080',
                            },
                            '& tr.row-red:hover:not(.Mui-selected)': {
                              backgroundColor: '#E5F0FF',
                            },
                          }}
                        >
                          {tableData.map((row, index) => (
                            <ReportTypeTableRow
                              key={row.id}
                              row={row}
                              index={table.page * table.rowsPerPage + index + 1}
                              selected={table.selected.includes(row.id)}
                              onEditRow={() => {
                                handleEditRow(row);
                                setEditRowId(Number(row?.id));
                              }}
                            />
                          ))}

                          {!isLoading && notFound && <TableEmptyRows emptyRows={20} height={20} />}
                        </TableBody>
                      )}
                    </Table>
                  </Scrollbar>
                </TableContainer>

                <TablePaginationCustom
                  count={reportTypesMeta?.total || tableData.length || 0}
                  page={table.page}
                  rowsPerPage={table.rowsPerPage}
                  onPageChange={table.onChangePage}
                  onRowsPerPageChange={table.onChangeRowsPerPage}
                  dense={table.dense}
                  onChangeDense={table.onChangeDense}
                />
              </InfoTable>
            </Box>
          </Paper>
        </Form>
      </DashboardContent>

      <DoctorFormButtons isSubmitting={isSubmitting} onSubmit={onSubmit} onExit={handleExit} />
    </>
  );
}
