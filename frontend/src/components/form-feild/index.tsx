import { useWatch } from 'react-hook-form';

import Box from '@mui/material/Box';
import { MenuItem, FormLabel } from '@mui/material';

import { Field, RHFMultiSelect } from '../hook-form';

type OptionType = {
  label: string;
  value: any;
};

type FormFieldProps = {
  label: string;
  name: string;
  type?: 'text' | 'date' | 'number' | 'time' | 'datetime-local' | 'color' | 'email' | 'password';
  options?: OptionType[];
  fullWidth?: boolean;
  textFieldProps?: {
    inputProps?: object;
    [key: string]: any;
  };
  onChangeTransform?: (value: string) => string | number;
  readonly?: boolean;
  isdisable?: boolean;
  autoFocus?: boolean;
  sx?: object;
  InputSx?: any;
  labelSx?: object;
  BoxSx?: object;
  InputBox?: object;
  min?: string; // For date type
  max?: string; // For date type
};

export default function RHFFormField({
  label,
  name,
  type = 'text',
  options,
  multiple = false,
  fullWidth = false,
  onChangeTransform,
  textFieldProps,
  autoFocus,
  isdisable,
  readonly,
  labelSx = {},
  BoxSx = {},
  sx = {},
  InputSx = {},
  min,
  max,
}: FormFieldProps & { multiple?: boolean }) {
  const selectedValue = useWatch({ name });

  const getMergedInputSx = (customSx: any = {}) => {
    const inputRootSx = customSx['& .MuiOutlinedInput-root'] || {};
    const restSx = { ...customSx };
    delete restSx['& .MuiOutlinedInput-root'];

    return {
      '& .MuiOutlinedInput-root': {
        borderRadius: '2px',
        height: inputRootSx.height || customSx.height || '28px',
        ...inputRootSx,
      },
      ...restSx,
    };
  };

  const mergedInputSx = getMergedInputSx(InputSx);

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
          fontSize: { xs: '12px', sm: '13px', md: '14px' },
          whiteSpace: 'nowrap',
          ...labelSx,
        }}
      >
        {label}
      </FormLabel>

      {multiple && options ? (
        <RHFMultiSelect name={name} options={options} disabled={isdisable} sx={mergedInputSx} />
      ) : options ? (
        <Field.Select
          name={name}
          disabled={isdisable}
          readonly={readonly}
          inputProps={{
            tabIndex: textFieldProps?.tabIndex,
            'data-nav': textFieldProps?.['data-nav'],
            'data-skip': textFieldProps?.['data-skip'],
            ...(textFieldProps?.inputProps || {}),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '2px',
              height: '28px',
              backgroundColor:
                name === 'isActive'
                  ? selectedValue === true || selectedValue === 'true'
                    ? '#1B6B40'
                    : '#B3261E'
                  : 'transparent',
              color: name === 'isActive' ? 'white' : 'inherit',
              '& svg': {
                color: name === 'isActive' ? 'white' : 'black',
              },
              ...(InputSx?.['& .MuiOutlinedInput-root'] || {}),
            },
            ...(InputSx && Object.keys(InputSx).length > 0 ? InputSx : {}),
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Field.Select>
      ) : (
        <Field.Text
          autoFocus={autoFocus}
          name={name}
          type={type}
          readonly={readonly}
          disabled={isdisable}
          sx={{
            pointerEvents: readonly ? 'none' : 'auto',
            ...mergedInputSx,
          }}
          InputLabelProps={type === 'date' ? { shrink: true } : undefined}
          inputProps={{
            ...(type === 'date' && { min, max }),
            ...{ tabIndex: textFieldProps?.tabIndex },
            'data-nav': textFieldProps?.['data-nav'],
            ...textFieldProps?.inputProps,
            ...(readonly
              ? { tabIndex: -1 }
              : {
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const rawValue = e.target.value;
                    const transformed = onChangeTransform ? onChangeTransform(rawValue) : rawValue;
                    textFieldProps?.onChange?.(e); // Call original handler if any
                    const input = e.target as HTMLInputElement;
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                      window.HTMLInputElement.prototype,
                      'value'
                    )?.set;
                    nativeInputValueSetter?.call(input, transformed);
                    const event = new Event('input', { bubbles: true });
                    input.dispatchEvent(event);
                  },
                }),
          }}
          {...textFieldProps}
        />
      )}
    </Box>
  );
}
