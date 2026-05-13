import type {
  IParameterMasterRecord,
  ICreateParameterMaster,
  IUpdateParameterMaster,
} from 'src/types/parameter-master';

import { mutate } from 'swr';
import { useForm } from 'react-hook-form';
import { InputType } from 'endoscopy-shared';
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
import { ParameterMasterSchema } from 'src/validator/parameter-master-validator';
import {
  createParameterMaster,
  updateParameterMaster,
  useGetParameterMasters,
  useSearchParameterMasters,
} from 'src/actions/parameter-master';

import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import InfoTable from 'src/components/table-body';
import RHFFormField from 'src/components/form-feild';
import { Scrollbar } from 'src/components/scrollbar';
import DoctorFormButtons from 'src/components/button-group';
import { LoadingScreen } from 'src/components/loading-screen';
import { AutoCompleteFieldV2 } from 'src/components/autocomplate-field-v2';
import { INPUT_TYPE_SELECTION } from 'src/components/selection/input-type-selection';
import { useTable, TableEmptyRows, TablePaginationCustom } from 'src/components/table';
import { ActiveInactiveField } from 'src/components/selection/active-inactive-selection';
import { RateChangeableField } from 'src/components/selection/rate-changeable-selection';

import ParameterMasterTableRow from './parameter-master-table-row';

export default function ParameterMasterNewEditForm() {
  // Parameter Master Search
  const parameterMasterSearch = useDebouncedSearch();
  const { searchParameterMasters, searchParameterMastersIsLoading } = useSearchParameterMasters(
    parameterMasterSearch.debouncedQuery || ''
  );
  const [editRowId, setEditRowId] = useState<number | null>();

  const defaultValues: ICreateParameterMaster = useMemo(
    () => ({
      name: '',
      isActive: true,
      defaultValue: '',
      inputType: InputType.Text,
      isHeading: false,
    }),
    []
  );

  const methods = useForm<ICreateParameterMaster>({
    resolver: zodResolver(ParameterMasterSchema),
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
      let parameterMasterId = editRowId;
      if (parameterMasterId) {
        await updateParameterMaster(parameterMasterId, data as IUpdateParameterMaster);
      } else {
        const createParameterMasterId = await createParameterMaster(data as ICreateParameterMaster);
        parameterMasterId = createParameterMasterId?.id;
        if (!parameterMasterId) throw new Error('Failed to create Parameter Master.');
      }
      await mutate(`${endpoints.parameterMaster.getAll}?searchFor=all&page=1&perPage=50`);
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
  const { parameterMasters, parameterMastersMeta, isLoading } = useGetParameterMasters({
    searchFor: 'all',
    page: table.page + 1,
    perPage: table.rowsPerPage,
    searchedValue: debouncedQuery,
  });
  const [tableData, setTableData] = useState<any[]>(parameterMasters);

  useEffect(() => {
    if (!isLoading && Array.isArray(parameterMasters)) {
      lastTableDataRef.current = parameterMasters;
      setTableData(parameterMasters);
    }
  }, [parameterMasters, isLoading]);

  const notFound = !isLoading && parameterMastersMeta?.total === 0 && tableData.length === 0;

  const handleEditRow = (row: IParameterMasterRecord) => {
    const editData: ICreateParameterMaster = {
      name: row.name,
      defaultValue: row.defaultValue,
      inputType: row.inputType,
      isHeading: row.isHeading,
      isActive: row.isActive,
    };
    reset(editData);
  };

  const handleExit = () => {
    router.push(paths.dashboard.root);
  };

  return (
    <>
      <DashboardContent title="Parameter Master">
        <Form methods={methods} onSubmit={onSubmit}>
          <Paper elevation={3}>
            <Box sx={{ p: 2, borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <RHFFormField
                    name="inputType"
                    isdisable
                    label="Input Type"
                    options={INPUT_TYPE_SELECTION}
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '120px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <AutoCompleteFieldV2
                    label="Name"
                    name="name"
                    options={searchParameterMasters}
                    loading={searchParameterMastersIsLoading}
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
                        md: 'auto 2fr',
                      },
                      columnGap: 1,
                    }}
                    onSearch={(value) => parameterMasterSearch.setQuery(value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <RHFFormField
                    label="Default Value"
                    name="defaultValue"
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
                <Grid item xs={12} sm={3}>
                  <RateChangeableField
                    label="Is Heading"
                    name="isHeading"
                    BoxSx={{
                      display: {
                        xs: 'block',
                        md: 'grid',
                      },
                      alignItems: 'center',
                      gridTemplateColumns: {
                        xs: '1fr 2fr',
                        md: '120px 2fr',
                      },
                      columnGap: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={5} />
                <Grid item xs={12} sm={4}>
                  <ActiveInactiveField
                    name="isActive"
                    label="Is Active"
                    fullWidth
                    BoxSx={{
                      display: { xs: 'block', md: 'grid' },
                      alignItems: 'center',
                      gridTemplateColumns: { xs: '1fr 2fr', md: '100px 2fr' },
                      columnGap: 1,
                    }}
                  />
                </Grid>
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
                    placeholder="Search by parameter name..."
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
                          <TableCell>Name</TableCell>
                          <TableCell>Default Value</TableCell>
                          <TableCell>Input Type</TableCell>
                          <TableCell>Is Heading</TableCell>
                          <TableCell>Is Active</TableCell>
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
                            <ParameterMasterTableRow
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
                  count={parameterMastersMeta?.total || tableData.length || 0}
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
