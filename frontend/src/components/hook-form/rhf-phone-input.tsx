import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import { FormLabel } from '@mui/material';

import { PhoneInput } from '../phone-input';

import type { PhoneInputProps } from '../phone-input';

// ----------------------------------------------------------------------

type Props = Omit<PhoneInputProps, 'value' | 'onChange'> & {
  name: string;
  label: string; // Add label prop
  isdisable?: boolean;
  BoxSx?: {};
  labelSx?: {};
};

export function RHFPhoneInput({
  name,
  label,
  isdisable,
  helperText,
  BoxSx,
  labelSx,
  ...other
}: Props) {
  const { control, setValue } = useFormContext();

  return (
    <Box
      sx={{
        ...(BoxSx && Object.keys(BoxSx).length > 0
          ? BoxSx
          : {
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
            }),
      }}
    >
      <FormLabel
        sx={{ fontSize: { xs: '12px', sm: '13px', md: '14px' }, whiteSpace: 'nowrap', ...labelSx }}
      >
        {label}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <PhoneInput
            {...field}
            fullWidth
            // international
            disabled={isdisable}
            value={field.value}
            onChange={(newValue) => setValue(name, newValue, { shouldValidate: true })}
            error={!!error}
            helperText={error ? error?.message : helperText}
            {...other}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '2px', height: '28px' } }}
          />
        )}
      />
    </Box>
  );
}
