import { StatusType } from 'endoscopy-shared';

import RHFFormField from '../form-feild';

type ActiveInactiveFieldProps = {
  name: string;
  label?: string;
  fullWidth?: boolean;
  isdisable?: boolean;
  BoxSx?: {};
  labelSx?: {};
};

export const ACTIVE_INACTIVE_OPTIONS = Object.entries(StatusType)
  .filter(([key, value]) => typeof value === 'number')
  .map(([key, value]) => ({
    label: key,
    value: value === StatusType.Active,
  }));

export function ActiveInactiveField({
  name,
  BoxSx,
  labelSx,
  label = 'STATUS',
  fullWidth = false,
  isdisable,
}: ActiveInactiveFieldProps) {
  return (
    <RHFFormField
      BoxSx={BoxSx}
      labelSx={labelSx}
      label={label}
      name={name}
      options={ACTIVE_INACTIVE_OPTIONS}
      fullWidth={fullWidth}
      isdisable={isdisable}
    />
  );
}
