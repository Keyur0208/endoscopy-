import { FIELD_TYPES } from 'endoscopy-shared';

import type { ISelectOption, IConfigurationModule } from './type';

export const getConfigSelect = (
  configs: IConfigurationModule[] | undefined,
  key: string
): ISelectOption[] => {
  if (!Array.isArray(configs)) return [];

  const config = configs.find((c) => c.fieldKey === key);

  if (!config || config.fieldType !== FIELD_TYPES.SELECT) return [];

  const options = config.value ?? [];

  // Handle array of strings
  if (Array.isArray(options) && options.length > 0) {
    return options.map((opt: any) => ({
      label: opt,
      value: opt,
    }));
  }

  return [];
};
