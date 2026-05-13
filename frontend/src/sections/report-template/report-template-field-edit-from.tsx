import type { IParameterMasterRecord } from 'src/types/parameter-master';
import type { DialogType, DialogOptions } from 'src/hooks/use-status-dialog';
import type {
  ICreateReportTemplateSection,
  IReportTemplateSectionRecord,
} from 'src/types/report-template';

import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import { Table, TableRow, TableBody, TableCell, TableHead, TableContainer } from '@mui/material';

import { useDebouncedSearch } from 'src/hooks/use-debounce';

import { useSearchParameterMasters } from 'src/actions/parameter-master';
import { ReportTemplateSectionSchema } from 'src/validator/report-template-validator';

import { Form } from 'src/components/hook-form';
import InfoTable from 'src/components/table-body';
import RHFFormField from 'src/components/form-feild';
import CommonButton from 'src/components/common-button';
import MasterAutoCompleteV2 from 'src/components/master-autocomplate-field-v2';
import { RATE_CHANGEABLE_OPTIONS } from 'src/components/selection/rate-changeable-selection';

import ReportTemplateFieldTableRow from './report-template-field-table-row';

type Props = {
  isdisable?: boolean;
  myreportTemplates: IReportTemplateSectionRecord[];
  onAddReportTemplates: (params: IReportTemplateSectionRecord[]) => void;
  showDialog: (title: string, message: string, type?: DialogType, options?: DialogOptions) => void;
  hideDialog: () => void;
};

type SelectedOptionsState = {
  parameter: IParameterMasterRecord | null;
};

export default function ReportTemplateFieldEditForm({
  isdisable,
  myreportTemplates,
  onAddReportTemplates,
  showDialog,
  hideDialog,
}: Props) {
  const [reportTemplates, setReportTemplates] = useState<IReportTemplateSectionRecord[]>(
    myreportTemplates || []
  );
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const isEditingselectedRowId = typeof selectedRowId === 'number';

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionsState>({
    parameter: null,
  });

  const defaultValues: ICreateReportTemplateSection = useMemo(
    () => ({
      parameterId: null,
      sequence: null,
      isRequired: true,
    }),
    []
  );

  const methods = useForm<ICreateReportTemplateSection>({
    resolver: zodResolver(ReportTemplateSectionSchema),
    defaultValues,
  });

  const { handleSubmit, reset, watch, setValue, setFocus } = methods;

  const watchParameterId = watch('parameterId');

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    setReportTemplates(myreportTemplates || []);
  }, [myreportTemplates]);

  const onSubmit = handleSubmit((data) => {
    const fieldMap = {
      parameterId: 'Parameter',
      sequence: 'Sequence',
    };

    const missingFields: string[] = [];

    Object.entries(fieldMap).forEach(([key, label]) => {
      const value = (data as any)[key];

      if (value === null || value === '' || value === undefined) {
        missingFields.push(label);
      }
    });

    if (missingFields.length > 0) {
      showDialog('Medicine Prescription', `Please fill up: ${missingFields.join(', ')}`, 'error', {
        confirmLabel: 'OK',
        onConfirm: hideDialog,
      });
      return;
    }

    const checkSquenceConflict = reportTemplates.some((item, index) => {
      if (isEditingselectedRowId && index === selectedRowId) {
        return false;
      }

      return item.sequence === data.sequence;
    });

    if (checkSquenceConflict) {
      showDialog(
        'Sequence Conflict',
        `Another parameter with the same sequence already exists. Please choose a different sequence number.`,
        'error',
        {
          confirmLabel: 'OK',
          onConfirm: hideDialog,
        }
      );
      return;
    }

    let updatedReportTemplates: IReportTemplateSectionRecord[];

    if (selectedRowId !== null) {
      updatedReportTemplates = reportTemplates.map((item, index) =>
        index === selectedRowId
          ? {
              ...item,
              ...data,
            }
          : item
      );
      setSelectedRowId(null);
    } else {
      updatedReportTemplates = [
        ...reportTemplates,
        {
          ...data,
          parameter: selectedOptions.parameter || undefined,
        } as IReportTemplateSectionRecord,
      ];
    }
    setReportTemplates(updatedReportTemplates);
    onAddReportTemplates(updatedReportTemplates);
    reset(defaultValues);
    setSelectedOptions({
      parameter: null,
    });
    const focusMedicineField = () => {
      try {
        setFocus?.('parameterId');
      } catch {
        console.warn('Failed to focus parameterId via RHF setFocus');
      }

      // robust DOM fallback: find label with exact text 'Parameter' and focus its input
      try {
        const labels = Array.from(document.querySelectorAll('label'));
        const label = labels.find((l) => l.textContent?.trim() === 'Parameter');
        let input: HTMLElement | null = null;
        if (label) {
          const box = label.parentElement as HTMLElement | null;
          if (box) {
            input = box.querySelector('input, textarea, [role="combobox"]');
          }
        }

        if (!input) {
          // fallback: try common selectors
          input = document.querySelector(
            'input[name="medicineId"], input[id*="medicineId"], input[aria-label="Medicine Name"]'
          );
        }

        if (input) {
          (input as HTMLElement).focus();
          try {
            (input as HTMLInputElement).select?.();
          } catch {
            console.warn('Failed to focus medicineName via RHF setFocus');
          }
        }
      } catch (err) {
        console.warn('Failed to focus medicineName input via DOM lookup', err);
      }
    };

    setTimeout(focusMedicineField, 50);
  });

  const handleRowDoubleClick = (inv: IReportTemplateSectionRecord, index: number) => {
    const editRowData = {
      ...inv,
      parameterId: inv.parameterId || null,
      sequence: inv.sequence || null,
      isRequired: inv.isRequired || false,
    } as ICreateReportTemplateSection;
    reset(editRowData);
    setSelectedRowId(index);
    setSelectedOptions((prev) => ({
      ...prev,
      parameter: inv.parameter || null,
    }));
  };

  const handleDeleteRow = (index: number | null) => {
    if (index !== null) {
      const updatedItems = reportTemplates.filter((_, i) => i !== index);
      setReportTemplates(updatedItems);
      onAddReportTemplates(updatedItems);
      setSelectedRowId(null);
    }
  };

  // Search Parameter Master for AutoComplete

  const parameterSearch = useDebouncedSearch();
  const { searchParameterMasters } = useSearchParameterMasters(
    parameterSearch.debouncedQuery || ''
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Box display="flex" flexDirection="column" my={1}>
        <Box
          sx={{ px: 1, py: 1, backgroundColor: 'rgba(217, 217, 217, 0.5)' }}
          display="flex"
          flexDirection="column"
          rowGap={2}
        >
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(4, 1fr)',
              sm: 'repeat(5, 1fr)',
              md: 'repeat(8, 1fr)',
              lg: 'repeat(10, 1fr)',
            }}
            alignItems="end"
            columnGap={1}
            rowGap={2}
          >
            <Box gridColumn={{ xs: 'span 3', sm: 'span 2', md: 'span 3', lg: 'span 5' }}>
              <MasterAutoCompleteV2
                name="parameterId"
                label="Parameter"
                noOptionsText="No Parameter Found"
                options={searchParameterMasters}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                searchValue={parameterSearch.query}
                onSearch={(value) => parameterSearch.setQuery(value)}
                currentData={selectedOptions.parameter}
                currentValue={selectedOptions.parameter?.id || null}
                currentLabel={selectedOptions.parameter?.name || ''}
                onSelectOption={(option) => {
                  if (option?.original) {
                    setSelectedOptions((prev) => ({
                      ...prev,
                      parameter: option?.original || null,
                    }));
                    setValue('parameterId', option?.original?.id || null, { shouldDirty: true });
                  } else if (option === null) {
                    setSelectedOptions((prev) => ({
                      ...prev,
                      parameter: null,
                    }));
                    setValue('parameterId', null, { shouldDirty: true });
                  }
                }}
                BoxSx={{
                  textAlign: 'left',
                }}
                InputSx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '2px',
                    height: '28px',
                    backgroundColor: '#fff',
                    color: 'black',
                  },
                  '& .MuiInputBase-input': {
                    color: 'black',
                    fontSize: '13px',
                  },
                }}
                labelSx={{
                  color: 'black',
                }}
              />
            </Box>
            <Box gridColumn={{ xs: 'span 1', sm: 'span 1', md: 'span 2', lg: 'span 2' }}>
              <RHFFormField
                name="sequence"
                label="Sequence"
                type="number"
                BoxSx={{
                  textAlign: 'left',
                }}
                InputSx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '2px',
                    height: '28px',
                    backgroundColor: '#fff',
                    color: 'black',
                  },
                  '& .MuiInputBase-input': {
                    color: 'black',
                    fontSize: '13px',
                  },
                }}
                labelSx={{
                  color: 'black',
                }}
              />
            </Box>
            <Box gridColumn={{ xs: 'span 2', sm: 'span 1', md: 'span 2', lg: 'span 2' }}>
              <RHFFormField
                name="isRequired"
                label="Is Required"
                type="number"
                BoxSx={{
                  textAlign: 'left',
                }}
                options={RATE_CHANGEABLE_OPTIONS}
                InputSx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '2px',
                    height: '28px',
                    backgroundColor: '#fff',
                    color: 'black',
                  },
                  '& .MuiInputBase-input': {
                    color: 'black',
                    fontSize: '13px',
                  },
                }}
                labelSx={{
                  color: 'black',
                }}
              />
            </Box>

            <CommonButton
              variant="contained"
              sx={{
                backgroundColor: 'rgba(63, 84, 115, 1)',
                fontSize: '13px',
                width: 'auto',
                height: '28px',
                '&:hover': {
                  backgroundColor: 'rgba(63, 84, 115, 1)',
                },
              }}
              type="submit"
              disabled={isdisable}
              onClick={onSubmit}
              skip={watchParameterId === null || watchParameterId === undefined}
            >
              {isEditingselectedRowId ? 'Update' : 'Save'}
            </CommonButton>
          </Box>
        </Box>
        <InfoTable>
          <TableContainer
            sx={{
              height: '100%',
              maxHeight: 'calc(100vh - 30rem)',
              overflowY: 'auto',
              '&::-webkit-scrollbar': { width: '8px' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: '#888' },
              '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' },
            }}
          >
            <Table size="small" sx={{ cursor: 'pointer' }}>
              <TableHead
                sx={{
                  whiteSpace: 'nowrap',
                  '& tr > th': {
                    fontSize: '13px',
                    paddingY: '5px',
                    whiteSpace: 'nowrap',
                  },
                }}
              >
                <TableRow>
                  <TableCell>Sr No.</TableCell>
                  <TableCell>Parameter</TableCell>
                  <TableCell>Sequence</TableCell>
                  <TableCell>IsRequired</TableCell>
                  <TableCell align="right">Modification</TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                sx={{
                  whiteSpace: 'nowrap',
                  '& tr': {
                    '& > td': {
                      fontSize: '13px',
                    },
                  },
                  '& tr[data-hasdata="true"]:not(.Mui-selected):nth-of-type(even)': {
                    backgroundColor: 'rgba(26, 59, 110, 0.1)',
                  },
                  '& tr[data-hasdata="true"]:not(.Mui-selected):hover': {
                    backgroundColor: '#E5F0FF',
                  },
                  '& tr.Mui-selected, & tr.Mui-selected:hover': {
                    backgroundColor: '#E5F0FF',
                  },
                  '& tr[data-hasdata="false"]': {
                    pointerEvents: 'none',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                    '&.Mui-selected, &.Mui-selected:hover': {
                      backgroundColor: 'transparent',
                    },
                  },
                }}
              >
                {reportTemplates.length > 0 ? (
                  reportTemplates.map((inv, index) => {
                    const isSelected = index === selectedRowId;
                    return (
                      <ReportTemplateFieldTableRow
                        index={index + 1}
                        selected={isSelected}
                        isdisable={isdisable || false}
                        onEditRow={() => handleRowDoubleClick(inv, index)}
                        onDeleteRow={() => handleDeleteRow(index)}
                        row={inv}
                      />
                    );
                  })
                ) : (
                  <TableRow data-hasdata="false">
                    <TableCell colSpan={5} align="center" height={200} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </InfoTable>
      </Box>
    </Form>
  );
}
