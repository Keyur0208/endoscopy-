import { RoundOff } from 'endoscopy-shared';

import RHFFormField from '../form-feild';

type RateChangeableFieldProps = {
  name: string;
  label?: string;
  fullWidth?: boolean;
  isdisable?: boolean;
  labelSx?: {};
  BoxSx?: {};
};

// Structured options with label and value
export const RATE_CHANGEABLE_OPTIONS = Object.entries(RoundOff)
  .filter(([key, value]) => typeof value === 'number')
  .map(([key, value]) => ({
    label: key,
    value: value === RoundOff.Yes,
  }));

export function RateChangeableField({
  name,
  label = 'RATE CHANGEABLE',
  fullWidth = false,
  isdisable,
  labelSx = {},
  BoxSx = {},
}: RateChangeableFieldProps) {
  return (
    <RHFFormField
      label={label}
      name={name}
      BoxSx={BoxSx}
      options={RATE_CHANGEABLE_OPTIONS}
      fullWidth={fullWidth}
      labelSx={labelSx}
      isdisable={isdisable}
    />
  );
}
