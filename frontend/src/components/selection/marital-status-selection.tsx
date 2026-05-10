import { MaritalStatus } from 'endoscopy-shared';

import RHFFormField from '../form-feild';

type MaritalStatusSelectionFieldProps = {
  name: string;
  label: string;
  fullWidth?: boolean;
  isdisable?: boolean;
  BoxSx?: {};
  readonly?: boolean;
};

// Convert string options to an array of objects with 'label' and 'value' properties
const MARITAL_STATUS_OPTIONS_STRUCTURED = Object.values(MaritalStatus).map((option) => ({
  label: option,
  value: option,
}));

export function MaritalStatusSelectionField({
  name,
  label,
  fullWidth = false,
  BoxSx,
  isdisable,
  readonly,
}: MaritalStatusSelectionFieldProps) {
  return (
    <RHFFormField
      label={label}
      name={name}
      options={MARITAL_STATUS_OPTIONS_STRUCTURED}
      fullWidth={fullWidth}
      BoxSx={BoxSx}
      isdisable={isdisable}
      readonly={readonly}
    />
  );
}

// import { MaritalStatus } from 'medico-shared';
// import RHFFormField from '../form-feild';

// type MaritalStatusSelectionFieldProps = {
//   name: string;
//   label: string;
//   fullWidth?: boolean;
//   isdisable?: boolean;
//   BoxSx?: {};
// };

// // Structured options with label and value
// const MARITAL_STATUS_OPTIONS_STRUCTURED = Object.values(MaritalStatus).map((option) => ({
//   label: option,
//   value: option,
// }));

// export function MaritalStatusSelectionField({
//   name,
//   label,
//   fullWidth = false,
//   BoxSx,
//   isdisable,
// }: MaritalStatusSelectionFieldProps) {
//   return (
//     <RHFFormField
//       label={label}
//       name={name}
//       options={MARITAL_STATUS_OPTIONS_STRUCTURED}
//       fullWidth={fullWidth}
//       BoxSx={BoxSx}
//       isdisable={isdisable}
//     />
//   );
// }
