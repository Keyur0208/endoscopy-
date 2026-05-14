import RHFFormField from '../form-feild';

type YearMonthDayProps = {
  name: string;
  label?: string;
  fullWidth?: boolean;
  isdisable?: boolean;
  BoxSx?: {};
  labelSx?: {};
  readonly?: boolean;
};

const YEAR_MONTH_DAT_OPTAIONS_STRUCTURE = [
  { label: 'Year', value: 'year' },
  { label: 'Month', value: 'month' },
  { label: 'Day', value: 'day' },
];

export function YearMonthDayField({
  label,
  name,
  isdisable,
  fullWidth = false,
  BoxSx,
  labelSx,
  readonly,
}: YearMonthDayProps) {
  return (
    <RHFFormField
      label={label || ''}
      name={name}
      isdisable={isdisable}
      options={YEAR_MONTH_DAT_OPTAIONS_STRUCTURE}
      fullWidth={fullWidth}
      BoxSx={BoxSx}
      labelSx={labelSx}
      readonly={readonly} // Assuming isdisable means the field should be read-only
    />
  );
}
