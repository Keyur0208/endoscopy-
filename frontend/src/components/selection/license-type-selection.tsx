import { LicenseStatusSelectOption } from 'endoscopy-shared';

const LicenseStatusLabels: Record<LicenseStatusSelectOption, string> = {
  [LicenseStatusSelectOption.Active]: 'Active',
  [LicenseStatusSelectOption.InActive]: 'InActive',
  [LicenseStatusSelectOption.Expired]: 'Expired',
};

export const LICENCE_STATUS_SELECTION = Object.values(LicenseStatusSelectOption).map((value) => ({
  label: LicenseStatusLabels[value],
  value,
}));
