import { useMemo, useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Box, TextField, FormLabel, Autocomplete } from '@mui/material';

/* ---------- Internal Option Type ---------- */
type AutoOption = {
  id: number | string;
  label: string;
};

interface MasterAutoCompleteV2Props<T> {
  name: string;
  label?: string;
  options: T[];
  getOptionValue: (item: T) => number | string;
  getOptionLabel: (item: T) => string;
  currentData?: any;
  currentValue?: number | string | null;
  currentLabel?: string;
  isDisable?: boolean;
  skip?: boolean;
  noOptionsText?: string;
  searchValue?: string;
  onSearch?: (text: string) => void;
  BoxSx?: any;
  labelSx?: any;
  InputSx?: any;
  onSelectOption?: (
    option: { id?: number | string; value: string; label: string; original?: T } | null
  ) => void;
}

function MasterAutoCompleteV2<T>({
  name,
  label,
  options,
  isDisable,
  skip = false,
  noOptionsText,
  currentData,
  getOptionValue,
  getOptionLabel,
  currentValue,
  currentLabel,
  searchValue,
  onSearch,
  BoxSx,
  labelSx,
  InputSx,
  onSelectOption,
}: MasterAutoCompleteV2Props<T>) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState<AutoOption | null>(null);
  const formattedOptions: AutoOption[] = useMemo(
    () =>
      options.map((item) => ({
        id: getOptionValue(item),
        label: getOptionLabel(item),
      })),
    [options, getOptionValue, getOptionLabel]
  );
  const finalOptions: AutoOption[] = useMemo(
    () =>
      // Only show search results in dropdown
      // selectedOption is only used for displaying current value, not in dropdown
      formattedOptions,
    [formattedOptions]
  );

  // Options including selected for value resolution (not for dropdown)
  const allOptionsForValue: AutoOption[] = useMemo(() => {
    const allOptions = [...formattedOptions];
    if (selectedOption && !allOptions.some((o) => o.id === selectedOption.id)) {
      allOptions.unshift(selectedOption);
    }

    if (
      currentData &&
      currentValue !== undefined &&
      currentValue !== null &&
      typeof currentLabel === 'string' &&
      !allOptions.some((o) => o.id === currentValue)
    ) {
      allOptions.unshift({ id: currentValue, label: currentLabel });
    }

    return allOptions;
  }, [formattedOptions, selectedOption, currentData, currentValue, currentLabel]);

  useEffect(() => {
    if (
      currentData &&
      currentValue !== undefined &&
      currentValue !== null &&
      typeof currentLabel === 'string'
    ) {
      setSelectedOption({ id: currentValue, label: currentLabel });
    } else {
      setSelectedOption(null);
    }
  }, [currentData, currentValue, currentLabel]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        // Use allOptionsForValue to find selected value (includes selected/edit options)
        const selectedValue =
          allOptionsForValue.find((o) => o.id === field.value) || selectedOption;
        const computedInputValue = (() => {
          if (searchValue) return searchValue;
          if (selectedValue) {
            return selectedValue.label;
          }
          return '';
        })();

        return (
          <Box sx={BoxSx}>
            {label && <FormLabel sx={{ fontSize: 13, ...labelSx }}>{label}</FormLabel>}

            <Autocomplete
              options={finalOptions}
              value={selectedValue}
              popupIcon={null}
              autoHighlight
              disabled={isDisable}
              open={open && searchValue !== undefined ? searchValue.length > 0 : open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              noOptionsText={noOptionsText}
              inputValue={computedInputValue}
              filterOptions={(x) => x}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(o, v) => o?.id === v?.id}
              onInputChange={(_, text, reason) => {
                if (reason === 'input') {
                  onSearch?.(text);
                }
                if (reason === 'reset') {
                  onSearch?.('');
                }
              }}
              onChange={(_, selected) => {
                if (selected) {
                  setSelectedOption(selected);
                  onSelectOption?.({
                    id: selected.id,
                    value: selected.label,
                    label: selected.label,
                    original: options.find((opt) => getOptionValue(opt) === selected.id),
                  });
                  field.onChange(selected.id);
                } else {
                  setSelectedOption(null);
                  onSelectOption?.(null);
                  field.onChange(null);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    'data-nav': skip ? 'skip' : undefined,
                  }}
                  disabled={isDisable}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  size="small"
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace') {
                      setSelectedOption(null);
                      field.onChange(null);
                      onSearch?.('');
                      onSelectOption?.(null);
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '2px',
                      height: '28px',
                      ...(InputSx?.['& .MuiOutlinedInput-root'] || {}),
                    },
                    ...Object.fromEntries(
                      Object.entries(InputSx || {}).filter(
                        ([key]) => key !== '& .MuiOutlinedInput-root'
                      )
                    ),
                  }}
                />
              )}
            />
          </Box>
        );
      }}
    />
  );
}

export default MasterAutoCompleteV2;
