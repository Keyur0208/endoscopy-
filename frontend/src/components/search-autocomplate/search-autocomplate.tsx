import { useMemo, useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Box, Chip, FormLabel, TextField, Autocomplete } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

/* ---------- Internal Option Type ---------- */
type AutoOption<T> = {
  id: number | string;
  label: string;
  original: T;
};

type OnSelectOptionType<T> = {
  id?: number | string;
  value: string;
  label: string;
  original?: T;
} | null;

interface SearchAutoCompleteProps<T> {
  name: string;
  label?: string;
  options: T[];
  getOptionValue: (item: T) => number | string;
  getOptionLabel: (item: T) => string;
  formatSelectedLabel?: (item: T) => string;
  currentData?: any;
  currentValue?: number | string | null;
  currentLabel?: string;
  isDisable?: boolean;
  noOptionsText?: string;
  searchValue?: string;
  onSearch?: (text: string) => void;
  BoxSx?: any;
  labelSx?: any;
  InputSx?: any;
  multiple?: boolean;
  autoFocus?: boolean;
  isparticularSearch?: boolean;
  getRedirectPath?: (id: number | string) => string;
  onSelectOption?: (option: OnSelectOptionType<T>) => void;
  loading?: boolean;
}

function SearchAutoComplete<T>({
  name,
  label,
  options,
  getOptionValue,
  getOptionLabel,
  formatSelectedLabel,
  currentData,
  currentValue,
  currentLabel,
  isDisable = false,
  noOptionsText,
  searchValue,
  onSearch,
  BoxSx,
  labelSx,
  InputSx,
  multiple = false,
  autoFocus,
  isparticularSearch,
  getRedirectPath,
  onSelectOption,
  loading = false,
}: SearchAutoCompleteProps<T>) {
  const { control } = useFormContext();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Track selected option(s) internally to preserve label after selection
  const [selectedOption, setSelectedOption] = useState<AutoOption<T> | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<AutoOption<T>[]>([]);

  /* ---------- Normalize options ---------- */
  const formattedOptions = useMemo<AutoOption<T>[]>(
    () =>
      options.map((item) => ({
        id: getOptionValue(item),
        label: getOptionLabel(item),
        original: item,
      })),
    [options, getOptionValue, getOptionLabel]
  );

  /* ---------- Merge edit data & selected options ---------- */
  const finalOptions = useMemo<AutoOption<T>[]>(() => {
    const allOptions = [...formattedOptions];

    if (multiple) {
      // Add selected options if not in list
      selectedOptions.forEach((opt) => {
        if (!allOptions.some((o) => o.id === opt.id)) {
          allOptions.unshift(opt);
        }
      });
    } else {
      // Add selected option if not in list
      if (selectedOption && !allOptions.some((o) => o.id === selectedOption.id)) {
        allOptions.unshift(selectedOption);
      }

      // Add edit mode option if not in list
      if (
        currentData &&
        currentValue !== undefined &&
        currentValue !== null &&
        typeof currentLabel === 'string' &&
        !allOptions.some((o) => o.id === currentValue)
      ) {
        allOptions.unshift({ id: currentValue, label: currentLabel, original: {} as T });
      }
    }

    return allOptions;
  }, [
    formattedOptions,
    selectedOption,
    selectedOptions,
    currentData,
    currentValue,
    currentLabel,
    multiple,
  ]);

  // Sync selectedOption with edit mode data
  useEffect(() => {
    if (multiple) {
      // For multiple mode - would need currentValue as array and currentLabel as array
      // Reset if no current data
      if (!currentData) {
        setSelectedOptions([]);
      }
    } else if (
      currentData &&
      currentValue !== undefined &&
      currentValue !== null &&
      typeof currentLabel === 'string'
    ) {
      setSelectedOption({ id: currentValue, label: currentLabel, original: {} as T });
    } else {
      setSelectedOption(null);
    }
  }, [currentData, currentValue, currentLabel, multiple]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        // Compute selected value(s)
        const selectedVal = multiple
          ? finalOptions.filter((opt) => Array.isArray(field.value) && field.value.includes(opt.id))
          : finalOptions.find((o) => o.id === field.value) || selectedOption;

        // Compute input value - show selected label when not searching
        const computedInputValue = (() => {
          if (searchValue) return searchValue;
          if (!multiple && selectedVal && !Array.isArray(selectedVal)) {
            // Use formatSelectedLabel if provided, otherwise use label
            if (
              formatSelectedLabel &&
              selectedVal.original &&
              Object.keys(selectedVal.original).length > 0
            ) {
              return formatSelectedLabel(selectedVal.original);
            }
            return selectedVal.label;
          }
          return '';
        })();

        return (
          <Box sx={BoxSx}>
            {label && <FormLabel sx={{ fontSize: 13, ...labelSx }}>{label}</FormLabel>}

            <Autocomplete
              multiple={multiple}
              options={finalOptions}
              value={multiple ? (selectedVal as AutoOption<T>[]) || [] : selectedVal || null}
              popupIcon={null}
              autoHighlight
              disabled={isDisable}
              loading={loading}
              open={open && searchValue !== undefined ? searchValue.length > 0 : open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              disableCloseOnSelect={multiple}
              noOptionsText={noOptionsText}
              inputValue={computedInputValue}
              filterOptions={(x) => x}
              getOptionLabel={(option) => option?.label ?? ''}
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
                if (multiple) {
                  if (Array.isArray(selected)) {
                    setSelectedOptions(selected);
                    field.onChange(selected.map((item) => item.id));
                  } else {
                    setSelectedOptions([]);
                    field.onChange([]);
                  }
                } else if (selected && !Array.isArray(selected)) {
                  setSelectedOption(selected);
                  field.onChange(selected.id);
                  onSelectOption?.({
                    id: selected.id,
                    value: selected.label,
                    label: selected.label,
                    original: selected.original,
                  });

                  // Redirect if applicable
                  if (isparticularSearch && getRedirectPath && selected.id) {
                    const path = getRedirectPath(selected.id);
                    router.push(path);
                  }
                } else {
                  setSelectedOption(null);
                  field.onChange(null);
                  onSelectOption?.(null);
                }
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option.label} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={(input) => {
                    if (autoFocus && input) {
                      setTimeout(() => input.focus(), 0);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace') {
                      setSelectedOption(null);
                      field.onChange(null);
                      onSearch?.('');
                      onSelectOption?.(null);
                    }
                  }}
                  disabled={isDisable}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '2px',
                      ...(multiple ? { minHeight: '28px' } : { height: '28px' }),
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

export default SearchAutoComplete;
