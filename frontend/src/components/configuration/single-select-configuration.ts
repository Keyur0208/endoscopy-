import type { IConfigurationModule } from './type';

export const getConfigSingleSelect = (configs: IConfigurationModule[] | undefined, key: string) => {
  if (!Array.isArray(configs)) return undefined;

  const config = configs.find((c) => c.fieldKey === key);

  if (!config || config.fieldType !== 'select' || config.meta?.isMulti === true) return undefined;

  try {
    let { value } = config;

    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch {
        return value;
      }
    }

    if (Array.isArray(value) && value.length > 0) {
      return value[0];
    }
    return value || undefined;
  } catch (error) {
    console.error(`Error parsing config value for key: ${key}`, error);
    return undefined;
  }
};
