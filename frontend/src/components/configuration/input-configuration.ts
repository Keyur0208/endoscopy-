import type { IConfigurationModule } from './type';

export const getConfigInput = (
  configs: IConfigurationModule[] | undefined,
  key: string
): string | number | undefined => {
  if (!Array.isArray(configs)) return undefined;

  const config = configs.find((c) => c.fieldKey === key);

  if (!config) return undefined;

  if (
    config.fieldType !== 'number' &&
    config.fieldType !== 'string' &&
    config.fieldType !== 'image'
  ) {
    return undefined;
  }

  if (config.value == null) return undefined;

  return config.fieldType === 'number' ? Number(config.value) : String(config.value);
};
