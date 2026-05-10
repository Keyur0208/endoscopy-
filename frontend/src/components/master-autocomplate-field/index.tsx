import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Box, Chip, FormLabel, TextField, Autocomplete } from '@mui/material';

interface MasterAutoCompleteProps<T> {
  name: string;
  label?: string;
  isDisable?: boolean;
  options: T[];
  getOptionLabel: (item: T) => string;
  getOptionValue: (item: T) => number | string;
  noOptionsText?: string;
  BoxSx?: {};
  labelSx?: {};
  InputSx?: any;
  multiple?: boolean;
  skip?: boolean;
}

function MasterAutoComplete<T>({
  name,
  label,
  isDisable = false,
  options,
  getOptionLabel,
  getOptionValue,
  noOptionsText,
  labelSx,
  BoxSx,
  InputSx,
  multiple = false,
}: MasterAutoCompleteProps<T>) {
  const { control, setValue } = useFormContext();
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);

  const formattedOptions = options.map((item) => ({
    id: getOptionValue(item),
    label: getOptionLabel(item),
    original: item,
  }));

  const isOnlySpaces = inputValue.trim().length === 0 && inputValue.length > 0;

  const normalizedInput = inputValue.trimStart().toString().toLowerCase();

  const filteredOptions = isOnlySpaces
    ? formattedOptions
    : formattedOptions.filter((option) => option.label.toLowerCase().includes(normalizedInput));

  const showOptions = isOnlySpaces || inputValue.length > 0 || multiple;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedOptions = multiple
          ? formattedOptions.filter(
              (opt) => Array.isArray(field.value) && field.value.includes(opt.id)
            )
          : formattedOptions.find((opt) => opt.id === field.value) || null;

        return (
          <Autocomplete
            multiple={multiple}
            value={multiple ? selectedOptions : selectedOptions || null}
            options={filteredOptions}
            disabled={isDisable}
            disablePortal={false}
            autoHighlight
            popupIcon={null}
            disableCloseOnSelect={multiple}
            open={open && showOptions}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            noOptionsText={noOptionsText}
            onChange={(_, selected, reason) => {
              if (multiple) {
                if (Array.isArray(selected)) {
                  const ids = selected.map((item) => item.id);
                  setValue(name, ids);
                  // // Only clear input if option selected or removed
                  if (reason === 'selectOption' || reason === 'removeOption') {
                    setInputValue('');
                  }
                } else {
                  setValue(name, []);
                  setInputValue('');
                }
              } else if (selected && !Array.isArray(selected)) {
                setValue(name, selected.id);
                setInputValue(selected.label);
              } else {
                setValue(name, undefined);
                setInputValue('');
              }
            }}
            inputValue={
              !multiple && selectedOptions && !Array.isArray(selectedOptions) && !inputValue
                ? selectedOptions.label
                : inputValue
            }
            // onInputChange={(_, value, reason) => {
            //   if (reason === 'input') {
            //     setInputValue(value);
            //   } else if (reason === 'clear') {
            //     setInputValue('');
            //     setValue(name, multiple ? [] : undefined);
            //   }

            //   if (reason !== 'reset') {
            //     setOpen(true);
            //   }
            // }}
            onInputChange={(_, value, reason) => {
              // Only update inputValue if user is typing or clearing
              if (reason === 'input' || reason === 'clear') {
                setInputValue(value);
              }
              if (reason !== 'reset') {
                setOpen(true);
              }
              if (!multiple && reason === 'input') {
                const matchedOption = formattedOptions.find(
                  (option) => option.label.toLowerCase() === value.toLowerCase()
                );
                if (!matchedOption) {
                  setValue(name, undefined);
                }
              }
              if (reason === 'clear') {
                setInputValue('');
                setValue(name, multiple ? [] : undefined);
              }
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option.label} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <Box sx={{ ...BoxSx }}>
                <FormLabel sx={{ fontSize: '13px', ...labelSx }}>{label}</FormLabel>
                <TextField
                  {...params}
                  disabled={isDisable}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '2px',
                      ...(multiple ? { minHeight: '33px' } : { height: '28px' }),
                      ...(InputSx?.['& .MuiOutlinedInput-root'] || {}),
                    },
                    ...Object.fromEntries(
                      Object.entries(InputSx || {}).filter(
                        ([key]) => key !== '& .MuiOutlinedInput-root'
                      )
                    ),
                  }}
                />
              </Box>
            )}
          />
        );
      }}
    />
  );
}

export default MasterAutoComplete;
