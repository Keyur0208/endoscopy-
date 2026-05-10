import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Box, FormLabel, TextField, Autocomplete } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

type OptionType = {
  id?: number;
  value: string;
  label: string;
};

interface AutoCompleteFieldProps {
  name: string;
  label?: string;
  options: OptionType[];
  isdisable?: boolean;
  autoFocus?: boolean;
  isparticularSearch?: boolean;
  BoxSx?: {};
  labelSx?: {};
  Sx?: {};
  getRedirectPath?: (id: number) => string;
  multiline?: boolean;
  maxRows?: number;
  minRows?: number;
  skip?: boolean;
  onSelectOption?: (option: OptionType | null) => void;
}

export function AutoCompleteField({
  name,
  label = 'Select Option',
  options,
  isdisable = false,
  isparticularSearch,
  getRedirectPath,
  autoFocus,
  BoxSx,
  skip = false,
  labelSx,
  Sx,
  multiline,
  maxRows,
  minRows,
  onSelectOption,
}: AutoCompleteFieldProps) {
  const { control } = useFormContext();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ ...BoxSx }}>
      <FormLabel sx={{ fontSize: '13px', whiteSpace: 'nowrap', ...labelSx }}>{label}</FormLabel>

      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const inputValue = field.value || '';
          const trimmedInput = inputValue.trim().toLowerCase();
          const isOnlySpaces = inputValue.length > 0 && trimmedInput === '';

          const filteredOptions = (() => {
            if (isOnlySpaces) return options;

            if (isparticularSearch) {
              return trimmedInput === ''
                ? options
                : options.filter((opt) => opt.label.toLowerCase().includes(trimmedInput));
            }

            return trimmedInput === ''
              ? []
              : options.filter((opt) => opt.label.toLowerCase().includes(trimmedInput));
          })();

          return (
            <Autocomplete
              fullWidth
              freeSolo
              disableClearable
              disabled={isdisable}
              options={filteredOptions}
              open={open}
              onOpen={() => {
                // don’t open directly on focus
              }}
              onClose={() => setOpen(false)}
              getOptionLabel={(option: any) => (typeof option === 'string' ? option : option.label)}
              value={{ label: inputValue, value: inputValue }}
              inputValue={inputValue}
              onInputChange={(_, newInputValue) => {
                field.onChange(newInputValue);

                if (newInputValue.length > 0 && newInputValue.trim() === '') {
                  // typed only space(s)
                  setOpen(true);
                } else if (newInputValue.trim() !== '') {
                  // typed letters or search term
                  setOpen(true);
                } else {
                  setOpen(false);
                }
              }}
              onChange={(_, newValue: any) => {
                setOpen(false);
                if (typeof newValue === 'string') {
                  field.onChange(newValue);
                  return;
                }
                if (newValue) {
                  const obj: OptionType = {
                    id: newValue.id,
                    label: newValue.label,
                    value: newValue.value,
                  };
                  field.onChange(newValue.value);
                  onSelectOption?.(obj);
                  if (isparticularSearch && newValue.id) {
                    const path = getRedirectPath?.(newValue.id);
                    if (path) router.push(path);
                  }
                  return;
                }
                field.onChange('');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={(input) => {
                    if (autoFocus && input) {
                      setTimeout(() => input.focus(), 0);
                    }
                  }}
                  inputProps={{
                    ...params.inputProps,
                    'data-nav': skip ? 'skip' : undefined,
                  }}
                  multiline={multiline}
                  maxRows={maxRows}
                  minRows={minRows}
                  disabled={isdisable}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{
                    // '& .MuiOutlinedInput-root': {
                    //   borderRadius: '2px',
                    //   // height: 'auto',
                    //   height: multiline ? "auto" :"28px"
                    // },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '2px',
                      height: multiline ? 'auto' : '28px',
                      backgroundColor: '#fff',
                      color: 'black',
                      paddingX: '5px',
                      paddingY: '5px',
                    },
                    '& .MuiInputBase-input': {
                      color: 'black',
                      fontSize: '14px',
                    },
                    ...Sx,
                  }}
                />
              )}
            />
          );
        }}
      />
    </Box>
  );
}
