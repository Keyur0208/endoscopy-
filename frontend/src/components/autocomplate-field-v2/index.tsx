import { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Box, FormLabel, TextField, Autocomplete } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

interface AutoCompleteFieldV2Props<T> {
  name: string;
  label?: string;
  options: T[];
  isdisable?: boolean;
  autoFocus?: boolean;
  getOptionValue: (item: T) => number | string;
  getOptionLabel: (item: T) => string;
  getDisplayValue?: (item: T) => string;
  isparticularSearch?: boolean;
  BoxSx?: {};
  labelSx?: {};
  Sx?: {};
  skip?: boolean;
  getRedirectPath?: (id: number) => string;
  multiline?: boolean;
  maxRows?: number;
  minRows?: number;
  onSelectOption?: (option: T | null) => void;
  onSearch: (text: string) => void;
  loading?: boolean;
}

type AutoOption<T> = {
  id: number | string;
  label: string;
  original: T;
};

export function AutoCompleteFieldV2<T>({
  name,
  label = 'Select Option',
  options,
  isdisable = false,
  getDisplayValue,
  isparticularSearch,
  getRedirectPath,
  multiline,
  minRows,
  skip = false,
  maxRows,
  autoFocus,
  getOptionValue,
  getOptionLabel,
  BoxSx,
  labelSx,
  Sx,
  onSelectOption,
  onSearch,
  loading = false,
}: AutoCompleteFieldV2Props<T>) {
  const { control } = useFormContext();
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');

  const formattedOptions = useMemo<AutoOption<T>[]>(
    () =>
      options.map((item) => ({
        id: getOptionValue(item),
        label: getOptionLabel(item),
        original: item,
      })),
    [options, getOptionValue, getOptionLabel]
  );

  return (
    <Box
      sx={{
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
        ...BoxSx,
      }}
    >
      <FormLabel sx={{ fontSize: '13px', whiteSpace: 'nowrap', ...labelSx }}>{label}</FormLabel>

      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Autocomplete
            fullWidth
            freeSolo
            disableClearable
            disabled={isdisable}
            options={formattedOptions}
            loading={loading}
            value={field.value ?? null}
            inputValue={inputValue}
            isOptionEqualToValue={(opt, val) => opt.id === val.id}
            getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt.label)}
            onInputChange={(_, text, reason) => {
              field.onChange(text);
              setInputValue(text);
              if (reason === 'input') {
                onSearch?.(text);
              }
            }}
            onChange={(_, selected) => {
              if (typeof selected === 'string') {
                field.onChange(selected);
                setInputValue(selected);
                return;
              }

              if (selected) {
                const displayValue = getDisplayValue
                  ? getDisplayValue(selected.original)
                  : selected.label;

                field.onChange(displayValue);
                setInputValue(displayValue);
                onSelectOption?.(selected.original);

                if (isparticularSearch && selected.id) {
                  const path = getRedirectPath?.(selected.id);
                  if (path) router.push(path);
                }
                return;
              }
              field.onChange('');
              setInputValue('');
              onSelectOption?.(null);
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
                maxRows={maxRows}
                multiline={multiline}
                disabled={isdisable}
                minRows={minRows}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '2px',
                    height: multiline ? 'auto' : '28px',
                    backgroundColor: '#fff',
                    color: 'black',
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
        )}
      />
    </Box>
  );
}
