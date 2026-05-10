import { BloodGroupType } from 'endoscopy-shared';

import RHFFormField from '../form-feild';

type BloodGroupSelectionFieldProps = {
  name: string;
  label: string;
  fullWidth?: boolean;
  isdisable?: boolean;
  BoxSx?: {};
};

// Structured options with label and value
export const BLOOD_GROUP_OPTIONS = Object.values(BloodGroupType).map((option) => ({
  label: option,
  value: option,
}));

export function BloodGroupSelectionField({
  name,
  label,
  fullWidth = false,
  BoxSx,
  isdisable,
}: BloodGroupSelectionFieldProps) {
  return (
    <RHFFormField
      label={label}
      name={name}
      options={BLOOD_GROUP_OPTIONS}
      fullWidth={fullWidth}
      BoxSx={BoxSx}
      isdisable={isdisable}
    />
  );
}
