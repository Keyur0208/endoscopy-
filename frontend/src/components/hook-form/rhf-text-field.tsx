import type { TextFieldProps } from '@mui/material/TextField';

import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
  readonly?: boolean;
};

export function RHFTextField({ name, helperText, readonly = false, type, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          // value={type === 'number' && field.value === 0 ? '' : field.value}
          value={type === 'number' ? (field.value ?? '') : field.value}
          onChange={(event) => {
            if (type === 'number') {
              field.onChange(Number(event.target.value));
            } else {
              field.onChange(event.target.value);
            }
          }}
          error={!!error}
          helperText={error?.message ?? helperText}
          inputProps={{
            autoComplete: 'off',
            readOnly: readonly,
            tabIndex: other.tabIndex ?? 0,
            'data-nav': (other as any)['data-nav'],
            ...(other.inputProps || {}),
          }}
          {...other}
        />
      )}
    />
  );
}
