import { ReligionType } from 'endoscopy-shared';

import RHFFormField from '../form-feild';

type ReligionSelectionFieldProps = {
  name: string;
  label: string;
  fullWidth?: boolean;
  isdisable?: boolean;
  BoxSx?: {};
};

// Structured options with label and value
const RELIGION_OPTIONS = Object.values(ReligionType).map((option) => ({
  label: option,
  value: option,
}));

export function ReligionSelectionField({
  name,
  label,
  BoxSx,
  isdisable = false,
  fullWidth = false,
}: ReligionSelectionFieldProps) {
  return (
    <RHFFormField
      label={label}
      name={name}
      isdisable={isdisable}
      options={RELIGION_OPTIONS}
      fullWidth={fullWidth}
      BoxSx={BoxSx}
    />
  );
}
