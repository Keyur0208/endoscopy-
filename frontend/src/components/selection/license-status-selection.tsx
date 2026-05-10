import { LicenseTypeSelectOption } from 'endoscopy-shared';

export const LICENCE_TYPE_SELECTION = Object.values(LicenseTypeSelectOption).map((value) => {
  const labelMap: Record<LicenseTypeSelectOption, string> = {
    [LicenseTypeSelectOption.Trial]: 'Trial',
    [LicenseTypeSelectOption.Monthly]: 'Monthly',
    [LicenseTypeSelectOption.Yearly]: 'Yearly',
  };

  return {
    label: labelMap[value],
    value,
  };
});
