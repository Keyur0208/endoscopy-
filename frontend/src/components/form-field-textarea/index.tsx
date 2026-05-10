import Box from '@mui/material/Box';
import { FormLabel } from '@mui/material';

import { Field } from '../hook-form';

type FormFieldProps = {
  label: string;
  name: string;
  type?: 'text';
  fullWidth?: boolean;
  textFieldProps?: {
    inputProps?: object;
    [key: string]: any;
  };
  onChangeTransform?: (value: string) => string;
  readonly?: boolean;
  isdisable?: boolean;
  autoFocus?: boolean;
  sx?: object;
  InputSx?: any;
  labelSx?: object;
  BoxSx?: object;
  InputBox?: object;
  multiline?: boolean;
  minRows?: number;
  maxRows?: number;
  skip?: boolean;
};

export default function RHFFormFieldTextArea({
  label,
  name,
  type = 'text',
  fullWidth = false,
  textFieldProps,
  autoFocus,
  isdisable,
  readonly,
  labelSx = {},
  BoxSx = {},
  sx = {},
  InputSx = {},
  multiline = false,
  minRows,
  maxRows,
  skip,
}: FormFieldProps) {
  return (
    <Box
      sx={{
        ...(Object.keys(BoxSx).length > 0
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
        ...sx,
      }}
    >
      <FormLabel
        sx={{
          fontSize: '14px',
          whiteSpace: 'nowrap',
          ...labelSx,
        }}
      >
        {label}
      </FormLabel>

      <Field.Text
        inputProps={{
          'data-nav': skip ? 'skip' : undefined,
        }}
        autoFocus={autoFocus}
        name={name}
        type={type}
        readonly={readonly}
        disabled={isdisable}
        sx={InputSx}
        multiline={multiline}
        minRows={minRows}
        maxRows={maxRows}
        {...textFieldProps}
      />
    </Box>
  );
}
