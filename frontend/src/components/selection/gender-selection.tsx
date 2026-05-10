import { SexType } from 'endoscopy-shared';

import RHFFormField from '../form-feild';

type GenderFieldProps = {
  name: string;
  label?: string;
  fullWidth?: boolean;
  isdisable?: boolean;
  readonly?: boolean;
  BoxSx?: {};
  labelSx?: {};
  sx?: {};
  InputSx?: {};
};

// Convert string options to an array of objects with 'label' and 'value' properties
export const GENDER_OPTIONS_STRUCTURED = Object.values(SexType).map((option) => ({
  label: option,
  value: option,
}));

export function GenderField({
  name,
  isdisable,
  label,
  fullWidth = false,
  sx,
  readonly,
  labelSx,
  InputSx,
  BoxSx,
}: GenderFieldProps) {
  return (
    <RHFFormField
      sx={sx}
      label={label || ''}
      labelSx={labelSx}
      name={name}
      readonly={readonly}
      isdisable={isdisable}
      InputSx={InputSx}
      options={GENDER_OPTIONS_STRUCTURED}
      fullWidth={fullWidth}
      BoxSx={BoxSx}
    />
  );
}

// import { SexType } from 'medico-shared';
// import RHFFormField from '../form-feild';

// type GenderFieldProps = {
//   name: string;
//   label?: string;
//   fullWidth?: boolean;
//   isdisable?: boolean;
//   readonly?: boolean;
//   BoxSx?: {};
//   labelSx?: {};
//   sx?: {};
//   InputSx?: {};
// };

// // Structured options with label and value
// const GENDER_OPTIONS_STRUCTURED = Object.values(SexType).map((option) => ({
//   label: option,
//   value: option,
// }));

// export function GenderField({
//   name,
//   isdisable,
//   label,
//   fullWidth = false,
//   sx,
//   readonly,
//   labelSx,
//   InputSx,
//   BoxSx,
// }: GenderFieldProps) {
//   return (
//     <RHFFormField
//       sx={sx}
//       label={label || ''}
//       labelSx={labelSx}
//       name={name}
//       readonly={readonly}
//       isdisable={isdisable}
//       InputSx={InputSx}
//       options={GENDER_OPTIONS_STRUCTURED}
//       fullWidth={fullWidth}
//       BoxSx={BoxSx}
//     />
//   );
// }
